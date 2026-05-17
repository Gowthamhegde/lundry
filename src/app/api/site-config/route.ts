import { NextResponse } from 'next/server';
import { serverClient, verifyAdmin } from '@/lib/supabaseServer';

// GET /api/site-config — public
export async function GET() {
  const supabase = serverClient();
  const { data, error } = await supabase.from('site_config').select('key, value');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const config = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return NextResponse.json(config);
}

// PUT /api/site-config — admin only, upserts all keys
export async function PUT(request: Request) {
  const supabase = serverClient();
  const admin = await verifyAdmin(request, supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json() as Record<string, string>;
  const now = new Date().toISOString();

  const rows = Object.entries(body).map(([key, value]) => ({
    key,
    value: String(value),
    updated_at: now,
  }));

  const { error } = await supabase
    .from('site_config')
    .upsert(rows, { onConflict: 'key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
