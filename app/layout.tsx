import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kettei.io',
  description: 'Decision ledger for architect ↔ client projects',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink antialiased">
        <div className="mx-auto min-h-screen max-w-5xl px-4 py-8">
          <header className="mb-8 border-b border-slate-300 pb-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-xl font-semibold tracking-wide">
                Kettei.io
              </Link>
              <div className="flex gap-4 text-sm">
                <Link href="/projects">Projects</Link>
              </div>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
