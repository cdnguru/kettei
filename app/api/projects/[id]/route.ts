import { NextRequest, NextResponse } from 'next/server';
import { deleteProject, getProject, updateProject } from '@/lib/ledger';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  return NextResponse.json(project);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const project = await updateProject(params.id, {
    name: body.name,
    clientName: body.clientName,
    description: body.description,
  });
  return NextResponse.json(project);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await deleteProject(params.id);
  return NextResponse.json({ ok: true });
}
