import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import Chat from '@/models/Chatmodel';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import mongoose from 'mongoose';

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;

    const user = await mongoose.model('User').findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get projects where the user is the client and project is confirmed
    const projects = await Project.find({
      userId: user._id,
      confirm: true,
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email')
      .populate('selectedFreelancer', 'username email');

    const projectsWithChat = await Promise.all(
      projects.map(async (project) => {
        const chat = await Chat.findOne({ projectId: project._id });

        return {
          ...project.toObject(),
          chatId: chat ? chat._id.toString() : null,
          chatStatus: chat?.status || 'active',
          clientCloseFlag: chat?.clientCloseFlag || false,
          freelancerCloseFlag: chat?.freelancerCloseFlag || false,
        };
      })
    );

    return NextResponse.json(projectsWithChat, { status: 200 });
  } catch (error) {
    console.error('Error fetching client projects:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
