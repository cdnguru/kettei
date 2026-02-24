import { requestApprovalAction } from '@/app/actions';
import { getDecision, listApprovals, listDecisionEvents } from '@/lib/ledger';

export const dynamic = 'force-dynamic';

export default async function DecisionDetailPage({ params }: { params: { id: string } }) {
  const decision = await getDecision(params.id);
  const events = await listDecisionEvents(decision.id);
  const approvals = await listApprovals(decision.id);

  return (
    <main className="space-y-8">
      <section className="rounded-md border border-slate-300 bg-white p-4">
        <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Decision detail</p>
        <h1 className="text-2xl font-semibold">{decision.title}</h1>
        <p className="mt-2">{decision.summary}</p>
        <p className="mt-2 text-sm">Status: {decision.status}</p>
      </section>

      <section className="rounded-md border border-slate-300 bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">Pending items</h2>
        <p className="text-sm text-slate-700">{decision.pending_items || 'None'}</p>
      </section>

      <section className="rounded-md border border-slate-300 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Request approval</h2>
        <form action={requestApprovalAction} className="grid gap-3 md:grid-cols-2">
          <input type="hidden" name="decisionId" value={decision.id} />
          <input name="approverName" required placeholder="Approver name" className="rounded border border-slate-300 px-3 py-2" />
          <input name="approverEmail" placeholder="Approver email" className="rounded border border-slate-300 px-3 py-2" />
          <input name="requesterName" placeholder="Requester name" className="rounded border border-slate-300 px-3 py-2 md:col-span-2" />
          <button className="w-fit rounded bg-slate-900 px-4 py-2 text-white md:col-span-2">Generate one-time link</button>
        </form>
      </section>

      <section className="rounded-md border border-slate-300 bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">Approvals</h2>
        <ul className="space-y-2 text-sm">
          {approvals.length === 0 && <li>No approvals requested yet.</li>}
          {approvals.map((approval) => (
            <li key={approval.id} className="rounded border border-slate-200 p-2">
              {approval.approver_name} · {approval.approved_at ? `Approved at ${new Date(approval.approved_at).toLocaleString()}` : 'Pending'}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-md border border-slate-300 bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">Audit timeline</h2>
        <ol className="space-y-2 text-sm">
          {events.map((event) => (
            <li key={event.id} className="rounded border border-slate-200 p-2">
              <p className="font-medium">{event.event_type}</p>
              <p>{event.details}</p>
              <p className="text-xs text-slate-500">{event.actor_name} · {new Date(event.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
