"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shirt,
  User,
  UserPlus,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type AuthState = "idle" | "loading" | "success" | "error";

/* Password strength */
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "",        color: "bg-gray-200 dark:bg-slate-700" },
    { label: "Weak",    color: "bg-red-500" },
    { label: "Fair",    color: "bg-orange-400" },
    { label: "Good",    color: "bg-yellow-400" },
    { label: "Strong",  color: "bg-teal-500" },
  ];
  return { score, ...map[score] };
}

const PERKS = [
  { icon: BadgeCheck, title: "Live order tracking",  desc: "Know exactly where your laundry is at every step." },
  { icon: BadgeCheck, title: "Saved addresses",      desc: "Skip re-entering your details every time." },
  { icon: BadgeCheck, title: "Fast reorders",        desc: "Repeat your favourite service stack in one tap." },
];

export default function SignupPage() {
  const router = useRouter();

  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authState,   setAuthState]   = useState<AuthState>("idle");
  const [errorMsg,    setErrorMsg]    = useState("");

  const strength    = getStrength(password);
  const passMatch   = confirm.length > 0 && password === confirm;
  const passMismatch = confirm.length > 0 && password !== confirm;
  const canSubmit   = name && email && password.length >= 8 && passMatch;

  /* ── Email sign-up ── */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setAuthState("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      setAuthState("error");
      setErrorMsg(
        error.message.includes("already registered")
          ? "An account with this email already exists. Try signing in."
          : error.message
      );
      return;
    }

    setAuthState("success");
  };

  /* ── Google OAuth ── */
  const handleGoogleSignup = async () => {
    setAuthState("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/order` },
    });

    if (error) {
      setAuthState("error");
      setErrorMsg(error.message);
    }
  };

  const isLoading = authState === "loading";

  /* ── Success screen ── */
  if (authState === "success") {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-teal-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Check your inbox</h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            We sent a confirmation link to <strong className="text-gray-700 dark:text-gray-300">{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-sm rounded-xl px-6 py-3 shadow-md shadow-teal-500/20 hover:from-teal-600 hover:to-emerald-600 transition-all"
          >
            Go to sign in <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-slate-950">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1fr_460px] gap-10 items-center">

        {/* ── Left: brand panel ── */}
        <div className="hidden lg:block space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-teal-400 to-emerald-600 p-3 rounded-2xl shadow-lg shadow-teal-500/30">
                <Shirt className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-400">
                FreshWash
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">
              Start cleaner<br />
              <span className="text-teal-600 dark:text-teal-400">weekly routines.</span>
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              Create your free account and get access to order tracking, saved addresses, and priority pickup slots.
            </p>
          </div>

          <div className="space-y-4">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            {[["Free", "No subscription needed"], ["Secure", "Encrypted & private"], ["Fast", "2-min setup"]].map(([val, lbl]) => (
              <div key={lbl} className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 text-center shadow-sm">
                <p className="text-xl font-black text-teal-600 dark:text-teal-400">{val}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: form card ── */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/30 p-8">

          {/* Card header */}
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-5">
              <UserPlus className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Create account</h2>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Already have one?{" "}
              <Link href="/login" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Error banner */}
          {authState === "error" && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
            </div>
          )}

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold text-sm rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">or</span>
            <span className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4" noValidate>

            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Full name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-gray-200 dark:bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Password strength: <span className="font-semibold">{strength.label}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 ${
                    passMismatch
                      ? "border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : passMatch
                      ? "border-teal-400 dark:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      : "border-gray-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passMismatch && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Passwords don&apos;t match
                </p>
              )}
              {passMatch && (
                <p className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !canSubmit}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white disabled:text-gray-400 font-bold text-sm rounded-xl px-4 py-3.5 transition-all duration-200 shadow-md shadow-teal-500/20 hover:shadow-teal-500/30 disabled:shadow-none disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
              ) : (
                <>Create account <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
            By creating an account you agree to our{" "}
            <Link href="#" className="underline hover:text-gray-600 dark:hover:text-gray-400">Terms</Link>
            {" "}and{" "}
            <Link href="#" className="underline hover:text-gray-600 dark:hover:text-gray-400">Privacy policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
