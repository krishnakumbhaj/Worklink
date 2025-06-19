import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { username, projectId } = await req.json();

    if (!username || !projectId) {
      return NextResponse.json(
        { message: 'Username and projectId are required.' },
        { status: 400 }
      );
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ message: 'Project not found.' }, { status: 404 });
    }

    // Prevent applying if project status is 'in-progress'
    if (project.status === 'In Progress') {
      return NextResponse.json({ message: 'Cannot apply to a project that is in progress.' }, { status: 400 });
    }

    // Check if user already applied
    if (project.applicants.includes(user._id)) {
      return NextResponse.json({ message: 'You have already applied to this project.' }, { status: 400 });
    }

    // Add user to applicants array
    project.applicants.push(user._id);

    // Save the updated project
    await project.save();

    return NextResponse.json({ message: 'Applied successfully!', project }, { status: 200 });
  } catch (error) {
    console.error('Error applying to project:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
