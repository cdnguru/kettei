import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="space-y-6">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Architecture Decision Ledger</p>
      <h1 className="text-3xl font-bold">Keep architect-client decisions explicit and signed off.</h1>
      <p className="max-w-2xl text-slate-700">
        Kettei.io records every decision, event, and approval in an append-only timeline so both sides stay aligned.
      </p>
      <Link
        href="/projects"
        className="inline-flex rounded-md border border-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-900 hover:text-white"
      >
        Open Projects
      </Link>
    </main>
  );
}
