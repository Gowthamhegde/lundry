"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

function getSafeDestination(next: string | null): string {
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/order";
}

function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const code = searchParams.get("code");
    const authError = searchParams.get("error_description") || searchParams.get("error");

    if (authError) {
      queueMicrotask(() => {
        if (!cancelled) setErrorMessage(authError);
      });
      return;
    }

    if (!code) {
      queueMicrotask(() => {
        if (!cancelled) setErrorMessage("Google sign-in did not return an authorization code.");
      });
      return;
    }

    const destination = getSafeDestination(searchParams.get("next"));

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (cancelled) return;

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.replace(destination);
    });

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  if (errorMessage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-md items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
          <AlertCircle size={18} className="shrink-0" />
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center gap-3 text-sm font-semibold text-slate-600">
      <Loader2 size={18} className="animate-spin" />
      Completing Google sign-in...
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <OAuthCallback />
    </Suspense>
  );
}
