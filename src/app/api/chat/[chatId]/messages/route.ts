import { NextRequest, NextResponse } from 'next/server';
import Chat from '@/models/Chatmodel';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  await dbConnect();


  if (!params?.chatId) {
    return NextResponse.json({ error: 'chatId param missing' }, { status: 400 });
  }

  try {
    const chat = await Chat.findById(params.chatId).populate('messages.senderId', 'username');
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    return NextResponse.json(chat.messages);
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
