import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const { projectId, freelancerId } = await req.json();

    if (!projectId || !freelancerId) {
      return NextResponse.json(
        { message: 'Project ID and freelancer ID are required' },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if the freelancer matches the assigned freelancer
   if (!project.selectedFreelancer || project.selectedFreelancer.toString() !== freelancerId) {
  return NextResponse.json(
    { message: 'You are not the assigned freelancer for this project' },
    { status: 403 }
  );
}


    // Confirm the proposal
    project.confirm = true;
    project.confirmedAt = new Date();

    await project.save();

    return NextResponse.json(
      { message: 'Proposal confirmed successfully', project },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error confirming proposal:', error);
    return NextResponse.json(
      { message: 'Server error while confirming proposal' },
      { status: 500 }
    );
  }
}
