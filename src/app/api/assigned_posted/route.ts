import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options'; // Adjust path to your actual auth options file
import dbConnect from '@/lib/dbConnect';
import AssignedProject from '@/models/AssignedProject';
import Project from '@/models/Project';

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ message: 'Missing projectId' }, { status: 400 });
    }

    // Find the project to get userId_posted (client)
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const userId = session.user._id;
    const userId_posted = project.userId; // owner of the project

    // Create assigned project entry
    const newAssignedProject = new AssignedProject({
      projectId,
      userId,
      userId_posted,
    });

    await newAssignedProject.save();

    return NextResponse.json({ message: 'Assigned project created', data: newAssignedProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create assigned project', error: (error as Error).message },
      { status: 500 }
    );
  }
}
