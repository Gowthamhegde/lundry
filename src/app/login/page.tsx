"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Shirt, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/order";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errMsg,   setErrMsg]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true); setErrMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("[login] data:", data, "error:", error);
    if (error) {
      setErrMsg(`${error.message} (status: ${error.status})`);
      setLoading(false); return;
    }
    router.push(from);
  };

  const handleGoogle = async () => {
    setLoading(true); setErrMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${from}` },
    });
    if (error) { setErrMsg(error.message); setLoading(false); }
  };

  return (
    <div className="gz-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 16px" }}>
      <div className="gz-blob gz-blob-a" />
      <div className="gz-blob gz-blob-b" />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#14b8a6,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shirt size={20} color="white" />
          </div>
          <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--color-text-primary)" }}>FreshWash</span>
        </div>

        <div className="gz-panel" style={{ padding: "36px 32px" }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--color-text-primary)", marginBottom: 4 }}>Welcome back</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: 28 }}>
            No account?{" "}
            <Link href="/signup" style={{ color: "#14b8a6", fontWeight: 700 }}>Create one free</Link>
          </p>

          {errMsg && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 10,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444", fontSize: "0.85rem", fontWeight: 600, marginBottom: 20 }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {errMsg}
            </div>
          )}

          {/* Google */}
          <button type="button" onClick={handleGoogle} disabled={loading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", minHeight: 46, borderRadius: 10, border: "1.5px solid rgba(148,163,184,0.3)",
              background: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: "0.9rem",
              color: "var(--color-text-primary)", cursor: "pointer", marginBottom: 20,
              transition: "all 160ms ease" }}>
            {GOOGLE_ICON} Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.25)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>or</span>
            <span style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.25)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Email address
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email" required
                  className="gz-input gz-input-pl" style={{ width: "100%" }} />
              </div>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Password
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" autoComplete="current-password" required
                  className="gz-input gz-input-pl" style={{ width: "100%", paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading || !email || !password}
              className="gz-cta-btn" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
              {loading ? <><Loader2 size={15} className="gz-spin" /> Signing in…</> : <>Sign in <ArrowRight size={15} /></>}
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
            By signing in you agree to our{" "}
            <Link href="#" style={{ color: "#14b8a6" }}>Terms</Link> &amp;{" "}
            <Link href="#" style={{ color: "#14b8a6" }}>Privacy</Link>.
          </p>
        </div>

        {/* perks */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
          {["Live tracking", "Saved addresses", "Order history"].map(p => (
            <span key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
              <CheckCircle2 size={13} style={{ color: "#14b8a6" }} /> {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
