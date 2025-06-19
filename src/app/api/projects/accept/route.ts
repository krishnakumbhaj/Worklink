import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    let { projectId, status, selectedFreelancer } = body;

    if (!projectId || !status) {
      return NextResponse.json(
        { message: 'Project ID and status are required' },
        { status: 400 }
      );
    }

    // Trim and normalize the status string
    status = status.trim();

    const allowedStatuses = ['Open', 'Pending', 'In Progress', 'Completed', 'Cancelled', 'Dispute'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId).populate('applicants');

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    project.status = status;

    if (status === 'In Progress') {
      if (!selectedFreelancer) {
        return NextResponse.json(
          { message: 'Freelancer ID is required to set project as In Progress' },
          { status: 400 }
        );
      }

      const freelancer = project.applicants.find(
        (a: any) => a._id?.toString() === selectedFreelancer
      );

      if (!freelancer) {
        return NextResponse.json(
          { message: 'Selected freelancer not found among applicants' },
          { status: 400 }
        );
      }

      project.selectedFreelancer = freelancer._id;
      project.isAssigned = true;
    }

    if (status === 'Open') {
      project.selectedFreelancer = undefined;
      project.isAssigned = false;
    }

    if (status === 'Completed') {
      project.isAssigned = false;
    }

    await project.save();

    // Add derived status for frontend
    const proposalStatus = project.confirm
      ? 'Proposal Accepted'
      : 'Proposal Sent';

    return NextResponse.json(
      {
        message: 'Project status updated successfully',
        project,
        proposalStatus, // ✅ Add custom status here
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating project status:', error);
    return NextResponse.json(
      { message: 'Server error updating project status' },
      { status: 500 }
    );
  }
}
