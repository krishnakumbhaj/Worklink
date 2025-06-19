import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chatmodel';
import Project from '@/models/Project';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { projectId } = await req.json();
  const project = await Project.findById(projectId);

  if (!project || !project.userId || !project.selectedFreelancer) {
    return NextResponse.json({ error: 'Project or Freelancer not found' }, { status: 400 });
  }

  // Check if chat already exists
  const existingChat = await Chat.findOne({ projectId });
  if (existingChat) {
    return NextResponse.json({ chatId: existingChat._id, message: 'Chat already exists' });
  }

  const chat = await Chat.create({
    projectId,
    clientId: project.userId,
    freelancerId: project.selectedFreelancer,
    status: 'active',
    clientCloseFlag: false,
    freelancerCloseFlag: false,
  });

  return NextResponse.json({ chatId: chat._id, message: 'Chat room created' }, { status: 201 });
}
