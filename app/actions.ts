'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createDecision, createProject, requestApproval } from '@/lib/ledger';

export async function createProjectAction(formData: FormData) {
  const name = String(formData.get('name') ?? '');
  const clientName = String(formData.get('clientName') ?? '');
  const description = String(formData.get('description') ?? '');

  if (!name || !clientName) {
    return;
  }

  await createProject({ name, clientName, description });
  revalidatePath('/projects');
  redirect('/projects');
}

export async function createDecisionAction(formData: FormData) {
  const projectId = String(formData.get('projectId') ?? '');
  const title = String(formData.get('title') ?? '');
  const summary = String(formData.get('summary') ?? '');
  const pendingItems = String(formData.get('pendingItems') ?? '');

  if (!projectId || !title || !summary) {
    return;
  }

  await createDecision({ projectId, title, summary, pendingItems });
  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export async function requestApprovalAction(formData: FormData) {
  const decisionId = String(formData.get('decisionId') ?? '');
  const approverName = String(formData.get('approverName') ?? '');
  const approverEmail = String(formData.get('approverEmail') ?? '');
  const requesterName = String(formData.get('requesterName') ?? 'Architect');

  if (!decisionId || !approverName) {
    return;
  }

  await requestApproval({ decisionId, approverName, approverEmail, requesterName });
  revalidatePath(`/decisions/${decisionId}`);
  redirect(`/decisions/${decisionId}`);
}
