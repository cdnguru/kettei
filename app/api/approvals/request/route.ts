import { NextRequest, NextResponse } from 'next/server';
import { requestApproval } from '@/lib/ledger';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const approvalRequest = await requestApproval({
    decisionId: body.decisionId,
    approverName: body.approverName,
    approverEmail: body.approverEmail,
    requesterName: body.requesterName ?? 'Architect',
  });
  return NextResponse.json(approvalRequest, { status: 201 });
}
