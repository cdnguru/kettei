import Link from 'next/link';
import { createDecisionAction } from '@/app/actions';
import { getProject, listDecisionsByProject } from '@/lib/ledger';

export const dynamic = 'force-dynamic';

export default async function ProjectOverviewPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  const decisions = await listDecisionsByProject(project.id);

  return (
    <main className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="text-sm text-slate-600">Client: {project.client_name}</p>
        {project.description && <p>{project.description}</p>}
      </section>

      <section className="rounded-md border border-slate-300 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Add decision</h2>
        <form action={createDecisionAction} className="grid gap-3">
          <input type="hidden" name="projectId" value={project.id} />
          <input name="title" required placeholder="Decision title" className="rounded border border-slate-300 px-3 py-2" />
          <textarea name="summary" required placeholder="Decision summary" className="rounded border border-slate-300 px-3 py-2" />
          <textarea name="pendingItems" placeholder="Pending items" className="rounded border border-slate-300 px-3 py-2" />
          <button className="w-fit rounded bg-slate-900 px-4 py-2 text-white">Create decision</button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Decision list</h2>
        {decisions.length === 0 && <p className="text-sm text-slate-600">No decisions yet.</p>}
        <ul className="space-y-2">
          {decisions.map((decision) => (
            <li key={decision.id} className="rounded border border-slate-300 bg-white p-4">
              <Link href={`/decisions/${decision.id}`} className="font-medium hover:underline">
                {decision.title}
              </Link>
              <p className="text-sm text-slate-600">Status: {decision.status}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
