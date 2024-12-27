import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Retrieve the session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract user ID from session
    const userId = new mongoose.Types.ObjectId(session.user._id);

    // Fetch user's messages
    const user = await UserModel.aggregate([
      { $match: { _id: userId } }, // Match the authenticated user
      { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } }, // Unwind messages array
      { $sort: { 'messages.createdAt': -1 } }, // Sort messages by createdAt (descending)
      {
        $group: {
          _id: '$_id',
          messages: { $push: '$messages' }, // Regroup messages into an array
        },
      },
    ]);

    // If user or messages not found, return an appropriate response
    if (!user || user.length === 0 || !user[0].messages) {
      return new Response(
        JSON.stringify({ success: true, messages: [] }), // Return empty array if no messages
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Respond with the messages
    return new Response(
      JSON.stringify({ success: true, messages: user[0].messages }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetching messages:', error);

    // Return internal server error
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
