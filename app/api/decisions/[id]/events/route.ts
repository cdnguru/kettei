import { NextRequest, NextResponse } from 'next/server';
import { appendDecisionEvent, listDecisionEvents } from '@/lib/ledger';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const events = await listDecisionEvents(params.id);
  return NextResponse.json(events);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const event = await appendDecisionEvent({
    decisionId: params.id,
    eventType: body.eventType,
    actorName: body.actorName,
    details: body.details,
  });
  return NextResponse.json(event, { status: 201 });
}
