import crypto from 'crypto';
import { getSql } from './db';
import type { Approval, Decision, DecisionEvent, Project } from './types';

function parseFirst<T>(rows: T[]): T {
  const row = rows[0];
  if (!row) {
    throw new Error('Record not found.');
  }
  return row;
}

export async function listProjects() {
  const sql = getSql();
  return (await sql`SELECT * FROM projects ORDER BY created_at DESC`) as Project[];
}

export async function createProject(input: { name: string; clientName: string; description?: string }) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO projects (name, client_name, description)
    VALUES (${input.name}, ${input.clientName}, ${input.description ?? null})
    RETURNING *
  `;
  return parseFirst<Project>(rows as Project[]);
}

export async function getProject(projectId: string) {
  const sql = getSql();
  const rows = await sql`SELECT * FROM projects WHERE id = ${projectId} LIMIT 1`;
  return parseFirst<Project>(rows as Project[]);
}

export async function updateProject(projectId: string, input: { name: string; clientName: string; description?: string }) {
  const sql = getSql();
  const rows = await sql`
    UPDATE projects
    SET name = ${input.name}, client_name = ${input.clientName}, description = ${input.description ?? null}
    WHERE id = ${projectId}
    RETURNING *
  `;
  return parseFirst<Project>(rows as Project[]);
}

export async function deleteProject(projectId: string) {
  const sql = getSql();
  await sql`DELETE FROM projects WHERE id = ${projectId}`;
}

export async function listDecisionsByProject(projectId: string) {
  const sql = getSql();
  return (await sql`
    SELECT * FROM decisions WHERE project_id = ${projectId}
    ORDER BY updated_at DESC
  `) as Decision[];
}

export async function createDecision(input: {
  projectId: string;
  title: string;
  summary: string;
  pendingItems?: string;
}) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO decisions (project_id, title, summary, pending_items)
    VALUES (${input.projectId}, ${input.title}, ${input.summary}, ${input.pendingItems ?? null})
    RETURNING *
  `;
  const decision = parseFirst<Decision>(rows as Decision[]);
  await appendDecisionEvent({
    decisionId: decision.id,
    eventType: 'decision_created',
    actorName: 'system',
    details: `Decision created: ${decision.title}`,
  });
  return decision;
}

export async function getDecision(decisionId: string) {
  const sql = getSql();
  const rows = await sql`SELECT * FROM decisions WHERE id = ${decisionId} LIMIT 1`;
  return parseFirst<Decision>(rows as Decision[]);
}

export async function updateDecision(
  decisionId: string,
  input: { title: string; summary: string; pendingItems?: string; status: Decision['status'] },
) {
  const sql = getSql();
  const rows = await sql`
    UPDATE decisions
    SET title = ${input.title}, summary = ${input.summary}, pending_items = ${input.pendingItems ?? null}, status = ${input.status}
    WHERE id = ${decisionId}
    RETURNING *
  `;
  const decision = parseFirst<Decision>(rows as Decision[]);
  await appendDecisionEvent({
    decisionId,
    eventType: 'decision_updated',
    actorName: 'system',
    details: `Decision updated with status: ${decision.status}`,
  });
  return decision;
}

export async function deleteDecision(decisionId: string) {
  const sql = getSql();
  await sql`DELETE FROM decisions WHERE id = ${decisionId}`;
}

export async function listDecisionEvents(decisionId: string) {
  const sql = getSql();
  return (await sql`
    SELECT * FROM decision_events WHERE decision_id = ${decisionId}
    ORDER BY created_at DESC
  `) as DecisionEvent[];
}

export async function appendDecisionEvent(input: {
  decisionId: string;
  eventType: string;
  actorName: string;
  details?: string;
}) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO decision_events (decision_id, event_type, actor_name, details)
    VALUES (${input.decisionId}, ${input.eventType}, ${input.actorName}, ${input.details ?? null})
    RETURNING *
  `;
  return parseFirst<DecisionEvent>(rows as DecisionEvent[]);
}

export async function listApprovals(decisionId: string) {
  const sql = getSql();
  return (await sql`
    SELECT id, decision_id, approver_name, approver_email, approved_at, created_at
    FROM approvals WHERE decision_id = ${decisionId}
    ORDER BY created_at DESC
  `) as Approval[];
}

export async function requestApproval(input: {
  decisionId: string;
  approverName: string;
  approverEmail?: string;
  requesterName: string;
}) {
  const sql = getSql();
  const token = crypto.randomBytes(24).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const rows = await sql`
    INSERT INTO approvals (decision_id, approver_name, approver_email, token_hash, token_expires_at)
    VALUES (${input.decisionId}, ${input.approverName}, ${input.approverEmail ?? null}, ${tokenHash}, NOW() + INTERVAL '7 days')
    RETURNING id
  `;

  await sql`UPDATE decisions SET status = 'pending_approval' WHERE id = ${input.decisionId}`;
  await appendDecisionEvent({
    decisionId: input.decisionId,
    eventType: 'approval_requested',
    actorName: input.requesterName,
    details: `Requested approval from ${input.approverName}`,
  });

  const host = process.env.APP_BASE_URL ?? 'http://localhost:3000';
  return {
    approvalId: parseFirst<{ id: string }>(rows as { id: string }[]).id,
    approvalLink: `${host}/approve/${token}`,
  };
}

export async function approveByToken(token: string, actorName = 'approval_link') {
  const sql = getSql();
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const approvals = await sql`
    SELECT * FROM approvals
    WHERE token_hash = ${tokenHash}
      AND token_used_at IS NULL
      AND token_expires_at > NOW()
    LIMIT 1
  ` as Array<{ id: string; decision_id: string; approver_name: string }>;

  const approval = parseFirst(approvals);

  await sql`UPDATE approvals SET approved_at = NOW(), token_used_at = NOW() WHERE id = ${approval.id}`;
  await sql`UPDATE decisions SET status = 'approved' WHERE id = ${approval.decision_id}`;

  await appendDecisionEvent({
    decisionId: approval.decision_id,
    eventType: 'approval_granted',
    actorName,
    details: `${approval.approver_name} approved via one-time link`,
  });

  return approval.decision_id;
}
