import { NextRequest, NextResponse } from 'next/server';
import { createDecision } from '@/lib/ledger';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const decision = await createDecision({
    projectId: body.projectId,
    title: body.title,
    summary: body.summary,
    pendingItems: body.pendingItems,
  });
  return NextResponse.json(decision, { status: 201 });
}
