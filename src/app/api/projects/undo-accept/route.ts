import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.confirm === true) {
      return NextResponse.json(
        { message: 'Cannot undo accept after freelancer has confirmed' },
        { status: 403 }
      );
    }

    // Undo accept
    project.selectedFreelancer = undefined;
    project.status = 'Open';  // or any status you want to reset to
    project.isAssigned = false;

    await project.save();

    return NextResponse.json({ message: 'Accept undone successfully', project }, { status: 200 });
  } catch (error) {
    console.error('Error undoing accept:', error);
    return NextResponse.json(
      { message: 'Server error while undoing accept' },
      { status: 500 }
    );
  }
}
