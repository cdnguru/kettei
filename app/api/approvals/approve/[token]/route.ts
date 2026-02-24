import { NextRequest, NextResponse } from 'next/server';
import { approveByToken } from '@/lib/ledger';

export async function POST(_: NextRequest, { params }: { params: { token: string } }) {
  try {
    const decisionId = await approveByToken(params.token, 'api_approve');
    return NextResponse.json({ ok: true, decisionId });
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid or expired token' }, { status: 400 });
  }
}
