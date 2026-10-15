"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "rinseup_cookie_consent";
const POLICY_VERSION = "2026-10-15";

type Consent = { choice: "accepted" | "rejected"; timestamp: string; version: string };

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const open = () => setVisible(true);
    queueMicrotask(() => setVisible(!localStorage.getItem(CONSENT_KEY)));
    window.addEventListener("rinseup:cookie-settings", open);
    return () => window.removeEventListener("rinseup:cookie-settings", open);
  }, []);

  const save = (choice: Consent["choice"]) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      choice,
      timestamp: new Date().toISOString(),
      version: POLICY_VERSION,
    } satisfies Consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white shadow-2xl" aria-label="Cookie consent">
      <p className="text-sm leading-6 text-slate-200">
        RinseUp uses essential browser storage for sign-in, theme, and order flow. We do not currently use analytics or advertising cookies. See our{" "}
        <a href="/cookies" className="font-bold text-teal-300 underline">Cookie Policy</a>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => save("accepted")} className="rounded-xl bg-teal-400 px-4 py-2 text-sm font-black text-slate-950">Accept all</button>
        <button type="button" onClick={() => save("rejected")} className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-bold text-white">Reject non-essential</button>
        <button type="button" onClick={() => save("rejected")} className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-bold text-white">Customise</button>
      </div>
    </aside>
  );
}
