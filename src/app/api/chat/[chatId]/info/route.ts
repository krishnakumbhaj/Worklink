import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chatmodel';

export async function GET(req: NextRequest, context: { params: Promise<{ chatId: string }> }) {
  const params = await context.params;  // await params here

  await dbConnect();

  if (!params.chatId) {
    return NextResponse.json({ error: 'chatId param missing' }, { status: 400 });
  }

  try {
    const chat = await Chat.findById(params.chatId).select('clientId freelancerId');

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({
      clientId: chat.clientId.toString(),
      freelancerId: chat.freelancerId.toString(),
    });
  } catch (error) {
    console.error('Error fetching chat info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
