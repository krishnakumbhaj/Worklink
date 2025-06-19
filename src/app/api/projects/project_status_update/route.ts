import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chatmodel';
import Project from '@/models/Project';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { chatId } = await req.json();
  if (!chatId) {
    return NextResponse.json({ message: 'chatId is required' }, { status: 400 });
  }

  try {
    // Step 1: Find the chat
    const chat = await Chat.findById(chatId).lean() as unknown as { status: string; projectId?: string };
    if (!chat) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    // Step 2: Only proceed if chat.status === 'closed'
    if (chat.status !== 'closed') {
      return NextResponse.json({ message: 'Chat is not closed yet' }, { status: 400 });
    }

    // Step 3: Ensure chat has projectId
    if (!chat.projectId) {
      return NextResponse.json({ message: 'No project linked to chat' }, { status: 400 });
    }

    // Step 4: Update linked project
    const updatedProject = await Project.findByIdAndUpdate(
      chat.projectId,
      { status: 'Completed' },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project marked as Completed ✅' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error checking chat and updating project:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
