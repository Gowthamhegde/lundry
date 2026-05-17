import { NextResponse } from 'next/server';
import { serverClient, verifyAdmin } from '@/lib/supabaseServer';

// PATCH /api/services/[id] — admin only, partial update
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = serverClient();
  const admin = await verifyAdmin(request, supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json() as Partial<{
    name: string; description: string; price: number;
    category: string; icon: string; badge: string | null;
    sort_order: number; active: boolean;
  }>;

  const { data, error } = await supabase
    .from('services')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/services/[id] — admin only, soft-delete
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = serverClient();
  const admin = await verifyAdmin(request, supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { error } = await supabase
    .from('services')
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
