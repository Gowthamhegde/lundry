"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, Shirt, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function getStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#e2e8f0", "#ef4444", "#f97316", "#eab308", "#14b8a6"];
  return { score: s, label: labels[s], color: colors[s] };
}

export default function SignupPage() {
  const router = useRouter();
  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [errMsg,      setErrMsg]      = useState("");
  const [success,     setSuccess]     = useState(false);

  const strength    = getStrength(password);
  const passMatch   = confirm.length > 0 && password === confirm;
  const passMismatch = confirm.length > 0 && password !== confirm;
  const canSubmit   = !!name && !!email && password.length >= 8 && passMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true); setErrMsg("");

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });

    if (error) {
      setErrMsg(
        error.message.includes("already registered")
          ? "An account with this email already exists."
          : error.message
      );
      setLoading(false); return;
    }

    // If session is returned immediately (email confirmation disabled), go straight to order
    if (data.session) {
      router.push("/order");
      return;
    }

    // Otherwise show "check your inbox"
    setSuccess(true);
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true); setErrMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/order` },
    });
    if (error) { setErrMsg(error.message); setLoading(false); }
  };

  if (success) {
    return (
      <div className="gz-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 16px" }}>
        <div className="gz-blob gz-blob-a" />
        <div className="gz-blob gz-blob-b" />
        <div className="gz-panel" style={{ position: "relative", zIndex: 1, maxWidth: 420, width: "100%", padding: "48px 36px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "999px", background: "rgba(20,184,166,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={30} style={{ color: "#14b8a6" }} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--color-text-primary)", marginBottom: 10 }}>Check your inbox</h2>
          <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: 28 }}>
            We sent a confirmation link to <strong style={{ color: "var(--color-text-primary)" }}>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Link href="/login" className="gz-cta-btn" style={{ justifyContent: "center", display: "inline-flex" }}>
            Go to sign in <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--color-text-primary)", marginBottom: 4 }}>Create account</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: 28 }}>
            Already have one?{" "}
            <Link href="/login" style={{ color: "#14b8a6", fontWeight: 700 }}>Sign in</Link>
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
              color: "var(--color-text-primary)", cursor: "pointer", marginBottom: 20 }}>
            {GOOGLE_ICON} Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.25)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>or</span>
            <span style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.25)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Name */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Full name
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your full name" autoComplete="name" required
                  className="gz-input gz-input-pl" style={{ width: "100%" }} />
              </div>
            </label>

            {/* Email */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Email address
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email" required
                  className="gz-input gz-input-pl" style={{ width: "100%" }} />
              </div>
            </label>

            {/* Password */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Password
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" autoComplete="new-password" required
                  className="gz-input gz-input-pl" style={{ width: "100%", paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* strength bar */}
              {password.length > 0 && (
                <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 99,
                      background: i <= strength.score ? strength.color : "rgba(148,163,184,0.2)",
                      transition: "background 200ms ease" }} />
                  ))}
                </div>
              )}
              {password.length > 0 && strength.label && (
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  Strength: <strong style={{ color: strength.color }}>{strength.label}</strong>
                </span>
              )}
            </label>

            {/* Confirm */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Confirm password
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                <input type={showConfirm ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter your password" autoComplete="new-password" required
                  className="gz-input gz-input-pl" style={{ width: "100%", paddingRight: 44,
                    borderColor: passMismatch ? "#ef4444" : passMatch ? "#14b8a6" : undefined }} />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passMismatch && <span style={{ fontSize: "0.75rem", color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12} /> Passwords don&apos;t match</span>}
              {passMatch    && <span style={{ fontSize: "0.75rem", color: "#14b8a6", display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={12} /> Passwords match</span>}
            </label>

            <button type="submit" disabled={loading || !canSubmit}
              className="gz-cta-btn" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
              {loading ? <><Loader2 size={15} className="gz-spin" /> Creating account…</> : <>Create account <ArrowRight size={15} /></>}
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
            By signing up you agree to our{" "}
            <Link href="#" style={{ color: "#14b8a6" }}>Terms</Link> &amp;{" "}
            <Link href="#" style={{ color: "#14b8a6" }}>Privacy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
