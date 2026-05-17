import { NextResponse } from 'next/server';
import { serverClient, verifyAdmin } from '@/lib/supabaseServer';

// GET /api/services — public, returns all active services ordered by sort_order
export async function GET() {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/services — admin only
export async function POST(request: Request) {
  const supabase = serverClient();
  const admin = await verifyAdmin(request, supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json() as {
    name: string; description?: string; price: number;
    category?: string; icon?: string; badge?: string; sort_order?: number;
  };

  if (!body.name || body.price == null) {
    return NextResponse.json({ error: 'name and price are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('services')
    .insert({
      name: body.name,
      description: body.description ?? '',
      price: body.price,
      category: body.category ?? 'Per piece',
      icon: body.icon ?? null,
      badge: body.badge ?? null,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
