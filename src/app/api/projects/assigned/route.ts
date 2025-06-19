import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    const projects = await Project.find({ assignedTo: userId }).populate('postedBy');

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching assigned projects:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
