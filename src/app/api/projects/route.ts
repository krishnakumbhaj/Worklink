import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import User from '@/models/User';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const {
      title,
      description,
      budget,
      skillsRequired,
      deadline,
      category,
    } = await req.json();

    if (
      !title ||
      !description ||
      !budget ||
      !skillsRequired ||
      !deadline ||
      !category
    ) {
      return NextResponse.json(
        { message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const email = session.user.email;
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    const newProject = await Project.create({
      userId: user._id,
      title,
      description,
      budget,
      skillsRequired,
      deadline,
      category,
      status: 'Open',
      applicants: [],
      selectedFreelancer: null,
      isAssigned: false,
      confirm: false,
      confirmedAt: null,
      acceptedAt: null,
    });

    return NextResponse.json(
      { message: 'Project created successfully!', project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const projects = await Project.find({ status: 'Open' })  // ← Filter added here
      .sort({ createdAt: -1 })
      .populate('userId', 'username email')
      .populate('applicants', 'username email')
      .populate('selectedFreelancer', 'username email');

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ message: 'Project ID is required.' }, { status: 400 });
    }

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return NextResponse.json({ message: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
