// app/api/project/applicants/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  await dbConnect();

  try {
    // ✅ Await the params to get projectId
    const { projectId } = await params;

    const project = await Project.findById(projectId).populate('applicants', 'username email');
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project.applicants, { status: 200 });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}