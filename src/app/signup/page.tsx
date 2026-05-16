"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Lock, Mail, ShieldCheck, User, UserPlus } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="studio-page">
      <div className="studio-shell grid min-h-[calc(100vh-9rem)] gap-8 lg:grid-cols-[minmax(0,0.95fr)_460px] lg:items-center">
        <section>
          <p className="studio-kicker">
            <UserPlus className="h-4 w-4" />
            New customer
          </p>
          <h1 className="studio-title">Start cleaner weekly routines</h1>
          <p className="studio-copy">
            Create a FreshWash account to save pickup details, track garment care, and make repeat orders feel nearly automatic.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Priority pickup", "Reserve better windows."],
              ["Care history", "Know what was cleaned."],
              ["Fast reorders", "Repeat common stacks."],
            ].map(([title, copy]) => (
              <div key={title} className="studio-panel p-4">
                <BadgeCheck className="mb-4 h-5 w-5 text-teal-500" />
                <p className="text-sm font-black text-[var(--color-text-primary)]">{title}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="studio-panel p-6 sm:p-8">
          <div className="mb-7">
            <span className="mb-5 grid h-14 w-14 place-items-center rounded-lg bg-blue-500/12 text-blue-500">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Create account</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Already have one?{" "}
              <Link href="/login" className="font-black text-teal-600 hover:text-teal-500 dark:text-teal-300">
                Sign in
              </Link>
            </p>
          </div>

          <button
            type="button"
            onClick={() => console.log("Google signup clicked")}
            className="studio-secondary-button w-full"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs font-black uppercase text-[var(--color-text-muted)]">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            Email signup
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
            <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
              Full name
              <span className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="name" name="name" type="text" autoComplete="name" required className="studio-input pl-10" placeholder="Your name" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
              Email address
              <span className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="email" name="email" type="email" autoComplete="email" required className="studio-input pl-10" placeholder="you@example.com" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
              Password
              <span className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="password" name="password" type="password" autoComplete="new-password" required className="studio-input pl-10" placeholder="Create password" />
              </span>
            </label>

            <button type="submit" className="studio-button w-full">
              Create account <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
