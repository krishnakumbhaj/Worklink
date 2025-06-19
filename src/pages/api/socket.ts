import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chatmodel';

export default async function socketHandler(req: NextApiRequest, res: NextApiResponse) {
  const typedSocket = res.socket as typeof res.socket & { server: any };

  if (!typedSocket.server.io) {
    console.log('🔌 Initializing Socket.IO...');
    const io = new Server(typedSocket.server);
    typedSocket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Connection opened:', socket.id);

      socket.on('joinRoom', (roomId: string) => {
        console.log('Joining room:', roomId);
        socket.join(roomId);
      });

      socket.on('message', async (msg) => {
        console.log('📩 Received message for room:', msg.roomId, '→', msg.message);

        try {
          await dbConnect();

          const chat = await Chat.findById(msg.roomId);
          if (!chat) {
            console.error('Chat NOT found for ID:', msg.roomId);
            return;
          }

          const newMsg = {
            _id: new Date().getTime().toString(), // temporary unique ID for UI
            senderId: {
              _id: msg.senderId._id,
              username: msg.senderId.username || 'Unknown',
            },
            message: msg.message,
            timestamp: new Date(),
            type: msg.type || 'text',
            attachmentUrl: msg.attachmentUrl || null,
          };

          // Push new message to chat messages array
          chat.messages.push({
            senderId: msg.senderId._id,
            message: msg.message,
            timestamp: new Date(),
            type: msg.type || 'text',
            attachmentUrl: msg.attachmentUrl || null,
          });

          await chat.save();

          // Emit new message to all clients in the room INCLUDING sender
          io.to(msg.roomId).emit('newMessage', newMsg);
          console.log('Emitted newMessage to room:', msg.roomId);
        } catch (err) {
          console.error('Error in message handler:', err);
        }
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected:', socket.id);
      });
    });
  } else {
    console.log('🌀 Socket.IO already initialized');
  }

  res.end();
}
