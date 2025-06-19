// pages/api/projects/freelancer.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  await dbConnect();

  const url = new URL(req.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Missing email param' }, { status: 400 });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email }).select('_id').lean();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find projects assigned to this freelancer
    const projects = await Project.find({ selectedFreelancer: user._id })
      .populate('userId', 'username email')
      .lean();

    // Add 'confirm' field to each project
    const updatedProjects = projects.map((project) => ({
      ...project,
      confirm: project.confirm || false, // Ensure 'confirm' is a boolean
    }));

    return NextResponse.json(updatedProjects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
