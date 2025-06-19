import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chatmodel';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email;
  const User = mongoose.model('User');
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const userId = user._id.toString();
  const { message, type = 'text', attachmentUrl = null } = await req.json();

  // Validation: message must be a non-empty string
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
  }

  const chat = await Chat.findById(params.chatId);
  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  // Allow only participants to send message
  if (
    chat.clientId.toString() !== userId &&
    chat.freelancerId.toString() !== userId
  ) {
    return NextResponse.json({ error: 'Not part of this chat' }, { status: 403 });
  }

  // ✅ Push message with proper ObjectId
  chat.messages.push({
    senderId: new mongoose.Types.ObjectId(userId),
    message: message.trim(),
    type,
    attachmentUrl,
    timestamp: new Date(),
  });

  await chat.save();

  // ✅ Return the saved message
  const savedMessage = chat.messages[chat.messages.length - 1];

 return NextResponse.json({
  _id: savedMessage._id.toString(),
  message: savedMessage.message,
  senderId: {
    _id: user._id.toString(),
    username: user.username,
  },
  timestamp: savedMessage.timestamp,
});


}
