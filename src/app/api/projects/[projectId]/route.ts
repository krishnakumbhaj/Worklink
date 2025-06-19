// app/api/project/applicants/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  await dbConnect();

  try {
    const project = await Project.findById(params.projectId).populate('applicants', 'username email');
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project.applicants, { status: 200 });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
