import { NextRequest, NextResponse } from 'next/server';
import { appendDecisionEvent } from '@/lib/ledger';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const event = await appendDecisionEvent({
    decisionId: body.decisionId,
    eventType: body.eventType,
    actorName: body.actorName,
    details: body.details,
  });
  return NextResponse.json(event, { status: 201 });
}
