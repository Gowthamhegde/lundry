import { NextResponse } from 'next/server';
import { serverClient, verifyAdmin } from '@/lib/supabaseServer';

type OrderStatus =
  | 'Order received' | 'Picked up' | 'Being cleaned'
  | 'Out for delivery' | 'Delivered' | 'Cancelled';

const VALID_STATUSES: OrderStatus[] = [
  'Order received', 'Picked up', 'Being cleaned',
  'Out for delivery', 'Delivered', 'Cancelled',
];

// GET /api/orders/[id] — fetch a single order with its items (public by order ID)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = serverClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

// PATCH /api/orders/[id] — admin only, update status or notes
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = serverClient();
  const admin = await verifyAdmin(request, supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json() as { status?: OrderStatus; notes?: string };

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
