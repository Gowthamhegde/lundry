"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/**
 * Redirects unauthenticated users to /login?from=<current-path>.
 * Returns { checked } — render nothing until checked is true.
 */
export function useRequireAuth() {
  const router   = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      } else {
        setChecked(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  return { checked };
}
