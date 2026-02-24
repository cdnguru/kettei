import { NextRequest, NextResponse } from 'next/server';
import { deleteDecision, getDecision, updateDecision } from '@/lib/ledger';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const decision = await getDecision(params.id);
  return NextResponse.json(decision);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const decision = await updateDecision(params.id, {
    title: body.title,
    summary: body.summary,
    pendingItems: body.pendingItems,
    status: body.status,
  });
  return NextResponse.json(decision);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await deleteDecision(params.id);
  return NextResponse.json({ ok: true });
}
