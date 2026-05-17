"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff,
  Loader2, Lock, LogIn, Mail, Shirt,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type AuthState = "idle" | "loading" | "error";

const PERKS = [
  { title: "Live order tracking",  desc: "See exactly where your laundry is." },
  { title: "Saved pickup details", desc: "Reuse your address in one tap." },
  { title: "Order history",        desc: "Review and reorder your favourite stack." },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/order";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [state,    setState]    = useState<AuthState>("idle");
  const [errMsg,   setErrMsg]   = useState("");

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setState("loading"); setErrMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setState("error");
      setErrMsg(error.message === "Invalid login credentials"
        ? "Wrong email or password. Please try again." : error.message);
      return;
    }
    router.push(from);
  };

  const handleGoogle = async () => {
    setState("loading"); setErrMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${from}` },
    });
    if (error) { setState("error"); setErrMsg(error.message); }
  };

  const loading = state === "loading";

  return (
    <div className="gz-page">
      <div className="gz-blob gz-blob-a" />
      <div className="gz-blob gz-blob-b" />

      <div className="gz-shell gz-auth-layout">
        {/* ── left panel ── */}
        <div className="gz-auth-left">
          <div className="gz-auth-brand">
            <div className="gz-auth-logo"><Shirt size={22} /></div>
            <span className="gz-auth-brand-name">FreshWash</span>
          </div>
          <h1 className="gz-auth-headline">
            Welcome back.<br />
            <span className="gz-auth-headline-accent">Your laundry awaits.</span>
          </h1>
          <p className="gz-auth-copy">
            Sign in to manage orders, track pickups in real time, and keep garment care on autopilot.
          </p>
          <div className="gz-auth-perks">
            {PERKS.map(({ title, desc }) => (
              <div key={title} className="gz-auth-perk">
                <CheckCircle2 size={15} className="gz-auth-perk-icon" />
                <div>
                  <p className="gz-auth-perk-title">{title}</p>
                  <p className="gz-auth-perk-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="gz-auth-stats">
            {[["4.9★","Rating"],["24h","Turnaround"],["10k+","Orders"]].map(([v,l]) => (
              <div key={l} className="gz-auth-stat">
                <span className="gz-auth-stat-val">{v}</span>
                <span className="gz-auth-stat-lbl">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── right: form card ── */}
        <div className="gz-auth-card">
          <div className="gz-auth-card-icon"><LogIn size={22} /></div>
          <h2 className="gz-auth-card-title">Sign in</h2>
          <p className="gz-auth-card-sub">
            No account?{" "}
            <Link href="/signup" className="gz-auth-link">Create one free</Link>
          </p>

          {state === "error" && (
            <div className="gz-auth-error">
              <AlertCircle size={15} />{errMsg}
            </div>
          )}

          {/* Google */}
          <button type="button" onClick={handleGoogle} disabled={loading} className="gz-google-btn">
            <svg className="gz-google-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="gz-divider"><span>or</span></div>

          <form onSubmit={handleEmail} className="gz-auth-form" noValidate>
            <label className="gz-auth-label">Email address
              <div className="gz-auth-input-wrap">
                <Mail size={15} className="gz-auth-input-icon" />
                <input id="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="gz-auth-input gz-auth-input-pl" />
              </div>
            </label>

            <label className="gz-auth-label">Password
              <div className="gz-auth-input-wrap">
                <Lock size={15} className="gz-auth-input-icon" />
                <input id="password" type={showPass ? "text" : "password"}
                  autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="gz-auth-input gz-auth-input-pl gz-auth-input-pr" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="gz-auth-eye" aria-label="toggle password">
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </label>

            <div className="gz-auth-row">
              <label className="gz-auth-remember">
                <input type="checkbox" checked={remember}
                  onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <Link href="/forgot-password" className="gz-auth-link">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading || !email || !password} className="gz-cta-btn gz-cta-full">
              {loading
                ? <><Loader2 size={15} className="gz-spin" /> Signing in…</>
                : <>Sign in <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="gz-auth-terms">
            By signing in you agree to our{" "}
            <Link href="#" className="gz-auth-link">Terms</Link> and{" "}
            <Link href="#" className="gz-auth-link">Privacy policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
