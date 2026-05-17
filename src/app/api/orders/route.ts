import { NextResponse } from 'next/server';
import { serverClient, verifyAdmin } from '@/lib/supabaseServer';

// GET /api/orders — admin sees all; authenticated user sees own orders
export async function GET(request: Request) {
  const supabase = serverClient();
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check if admin
  const adminUser = await verifyAdmin(request, supabase);
  const isAdmin = !!adminUser;

  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (!isAdmin) {
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/orders — create a new order (works for guests too)
export async function POST(request: Request) {
  const supabase = serverClient();

  let userId: string | null = null;
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (token) {
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id ?? null;
  }

  const body = await request.json() as {
    id: string;
    customer_name: string;
    customer_phone: string;
    pickup_address: string;
    pickup_date?: string;
    pickup_time?: string;
    notes?: string;
    estimated_total: number;
    items: Array<{ service_id?: string; name: string; price: number; quantity?: number }>;
  };

  if (!body.id || !body.customer_name || !body.customer_phone || !body.pickup_address) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      id: body.id,
      user_id: userId,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      pickup_address: body.pickup_address,
      pickup_date: body.pickup_date ?? null,
      pickup_time: body.pickup_time ?? null,
      notes: body.notes ?? null,
      estimated_total: body.estimated_total,
      status: 'Order received',
    })
    .select()
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  if (body.items?.length) {
    const { error: itemsError } = await supabase.from('order_items').insert(
      body.items.map((item) => ({
        order_id: body.id,
        service_id: item.service_id ?? null,
        name: item.name,
        price: item.price,
        quantity: item.quantity ?? 1,
      })),
    );
    if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json(order, { status: 201 });
}
