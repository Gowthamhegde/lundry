/**
 * Server-side Supabase helpers.
 * Only import these from API route handlers — never from client components.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Service-role client — bypasses RLS, use only in trusted server code. */
export function serverClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/**
 * Verify that the Bearer token belongs to an admin user.
 * Returns the user object on success, or null on failure.
 */
export async function verifyAdmin(
  request: Request,
  supabase: SupabaseClient,
): Promise<{ id: string } | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  // Use a raw query so TypeScript doesn't collapse the result type
  const { data, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !data) return null;

  const row = data as { role: string };
  return row.role === 'admin' ? user : null;
}
