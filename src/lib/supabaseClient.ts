import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

type Client = SupabaseClient<Database>;

// Lazy singleton — only instantiated on first access so Next.js static
// prerendering doesn't fail when env vars are absent at build time.
let _client: Client | null = null;

export function getSupabaseClient(): Client {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Support both key names: ANON_KEY (standard) and PUBLISHABLE_KEY (legacy alias)
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      throw new Error(
        'Missing Supabase env vars. Copy .env.local.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      );
    }

    _client = createClient<Database>(url, key);
  }
  return _client;
}

// Proxy so all existing `supabase.auth.*` / `supabase.from(...)` calls
// keep working without any import changes across the codebase.
export const supabase = new Proxy({} as Client, {
  get(_target, prop: string | symbol) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getSupabaseClient() as any)[prop];
  },
});
