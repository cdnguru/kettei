import Link from 'next/link';
import { createProjectAction } from '@/app/actions';
import { listProjects } from '@/lib/ledger';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <main className="space-y-8">
      <section className="rounded-md border border-slate-300 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Create project</h2>
        <form action={createProjectAction} className="grid gap-3 md:grid-cols-2">
          <input name="name" required placeholder="Project name" className="rounded border border-slate-300 px-3 py-2" />
          <input name="clientName" required placeholder="Client name" className="rounded border border-slate-300 px-3 py-2" />
          <textarea
            name="description"
            placeholder="Short context"
            className="rounded border border-slate-300 px-3 py-2 md:col-span-2"
          />
          <button className="w-fit rounded bg-slate-900 px-4 py-2 text-white md:col-span-2">Create</button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Projects</h2>
        {projects.length === 0 && <p className="text-sm text-slate-600">No projects yet.</p>}
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id} className="rounded border border-slate-300 bg-white p-4">
              <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                {project.name}
              </Link>
              <p className="text-sm text-slate-600">Client: {project.client_name}</p>
              {project.description && <p className="mt-1 text-sm">{project.description}</p>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
