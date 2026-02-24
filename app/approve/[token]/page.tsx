import { redirect } from 'next/navigation';
import { approveByToken } from '@/lib/ledger';

export const dynamic = 'force-dynamic';

export default async function ApprovePage({ params }: { params: { token: string } }) {
  try {
    const decisionId = await approveByToken(params.token, 'link_click');
    redirect(`/decisions/${decisionId}`);
  } catch {
    return (
      <main className="rounded-md border border-rose-300 bg-rose-50 p-6">
        <h1 className="text-xl font-semibold text-rose-700">Approval link is invalid or expired.</h1>
      </main>
    );
  }
}
