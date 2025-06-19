import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { projectId, freelancerId } = await req.json();

    if (!projectId || !freelancerId) {
      return NextResponse.json(
        { message: 'Missing required fields: projectId or freelancerId' },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ message: 'Project not found.' }, { status: 404 });
    }

    // 🚫 Prevent unapply if freelancer is already selected
    if (String(project.selectedFreelancer) === String(freelancerId)) {
      return NextResponse.json(
        { message: 'You are already selected for this project and cannot unapply.' },
        { status: 403 }
      );
    }

    // ✅ Unapply logic if freelancer is in applicants
    const wasInApplicants = project.applicants.includes(freelancerId);
    if (wasInApplicants) {
      project.applicants = project.applicants.filter(
        (applicantId: string) => String(applicantId) !== String(freelancerId)
      );

      await project.save();

      return NextResponse.json(
        { message: 'You have successfully unapplied from the project.', project },
        { status: 200 }
      );
    }

    // ❌ Not applied or selected
    return NextResponse.json(
      { message: 'You have not applied or been assigned to this project.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error withdrawing/unapplying from project:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
