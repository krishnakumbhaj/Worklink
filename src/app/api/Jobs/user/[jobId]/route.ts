import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json({ message: 'Missing job ID to delete' }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    await Job.findByIdAndDelete(jobId);

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json({ message: 'Missing job ID to update' }, { status: 400 });
    }

    const updates = await req.json();
    
    const updateKey = Object.keys(updates)[0];
    const updateValue = updates[updateKey];

    const allowedFields = [
      'title', 'company', 'location', 'salary', 'description',
      'requirements', 'benefits', 'applicationDeadline',
      'type', 'experienceLevel', 'remoteOption', 'experience'
    ];

    if (!allowedFields.includes(updateKey)) {
      return NextResponse.json({ success: false, message: 'Invalid field' }, { status: 400 });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { [updateKey]: updateValue },
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
