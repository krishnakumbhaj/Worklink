import {  NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';
import User from '@/models/User';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userJobs = await Job.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json(userJobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    return NextResponse.json({ message: 'Failed to fetch user jobs' }, { status: 500 });
  }
}
