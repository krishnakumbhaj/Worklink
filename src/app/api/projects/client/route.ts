import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // You can get username from query params or headers
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find projects posted by this user
    const projects = await Project.find({ userId: user._id }).populate('applicants selectedFreelancer userId');

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
