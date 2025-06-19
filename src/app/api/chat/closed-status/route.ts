import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chatmodel';
import Project from '@/models/Project';

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const { chatId, role } = body;

  if (!chatId || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  // Step 1: Set the flag for the requesting party
  if (role === 'client') {
    chat.clientCloseFlag = true;
  } else if (role === 'freelancer') {
    chat.freelancerCloseFlag = true;
  }

  // Step 2: If both flags are true, close the chat and update project
  if (chat.clientCloseFlag && chat.freelancerCloseFlag) {
    chat.chatStatus = 'closed';

    await Project.findByIdAndUpdate(chat.projectId, {
      status: 'Completed',
      completedAt: new Date(),
    });
  }

  // Step 3: Save the updated chat
  await chat.save();

  return NextResponse.json({ message: 'Completion flag updated', chat });
}
