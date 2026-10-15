import Link from "next/link";

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="studio-page">
      <div className="studio-shell max-w-4xl">
        <p className="studio-kicker">RinseUp · Draft for review</p>
        <h1 className="studio-title">{title}</h1>
        <p className="mb-8 text-sm text-slate-500">Last updated: 15 October 2026</p>
        <div className="studio-panel space-y-6 p-6 text-sm leading-7 text-[var(--color-text-muted)]">
          {children}
          <p className="border-t border-slate-200 pt-5 text-xs dark:border-slate-800">
            Questions or requests: <a className="font-bold text-teal-600" href="mailto:gowthamhegde606@gmail.com">gowthamhegde606@gmail.com</a>
          </p>
          <Link href="/" className="inline-block font-bold text-teal-600">Back to RinseUp</Link>
        </div>
      </div>
    </article>
  );
}
