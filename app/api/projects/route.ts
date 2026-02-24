import { NextRequest, NextResponse } from 'next/server';
import { createProject, listProjects } from '@/lib/ledger';

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const project = await createProject({
    name: body.name,
    clientName: body.clientName,
    description: body.description,
  });
  return NextResponse.json(project, { status: 201 });
}
