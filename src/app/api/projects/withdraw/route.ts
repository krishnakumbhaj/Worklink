// /pages/api/projects/withdraw.ts (or /app/api/projects/withdraw/route.ts in Next.js 13+)

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const { projectId, freelancerId } = await req.json();

    if (!projectId || !freelancerId) {
      return NextResponse.json(
        { message: 'Missing projectId or freelancerId' },
        { status: 400 }
      );
    }

    // Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if the current selected freelancer matches the freelancerId
    if (!project.selectedFreelancer || project.selectedFreelancer.toString() !== freelancerId) {
      return NextResponse.json(
        { message: 'You are not the selected freelancer for this project' },
        { status: 403 }
      );
    }

    // Withdraw confirmation by removing selectedFreelancer and confirm flag
    project.selectedFreelancer = null;
    project.confirm = false;
    project.isAssigned = false; // optional: update if you want to allow re-assign
    project.confirmedAt = null;
    project.acceptedAt = null;
   // Reset status to 'Open' or any other status you prefer

    await project.save();

    return NextResponse.json({ message: 'Confirmation withdrawn successfully' }, { status: 200 });

  } catch (error) {
    console.error('Withdraw error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
