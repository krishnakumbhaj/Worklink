import UserModel from "@/models/User";
import MessageModel from "@/models/message";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, content } = await request.json();

    // Find the user by username
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        { message: "User is not accepting messages", success: false },
        { status: 403 }
      );
    }

    // Create a new message and save it to the database
    const newMessage = await MessageModel.create({
      content,
      createdAt: new Date(),
    });

    // Push the new message's ObjectId to the user's messages array
    user.messages.push(newMessage);
    await user.save();

    return NextResponse.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
