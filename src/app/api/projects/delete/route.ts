import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import mongoose from 'mongoose';

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ message: 'Project ID is required.' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ message: 'Invalid project ID.' }, { status: 400 });
    }

    // Fetch project first to check confirmation status
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json({ message: 'Project not found.' }, { status: 404 });
    }

    // Check if freelancer confirmed proposal
    if (project.confirm) {
      return NextResponse.json(
        { message: 'Cannot delete project. Freelancer has confirmed the proposal.' },
        { status: 403 }
      );
    }

    // If not confirmed, delete project
    await Project.findByIdAndDelete(projectId);

    return NextResponse.json({ message: 'Project deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
