import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/User";
import ProfileModel from "@/models/Profile";

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    await connectDB();

    const { username } = params;

    if (!username) {
      return NextResponse.json({ message: "Username is required" }, { status: 400 });
    }

    // Case-insensitive search
    const user = await UserModel.findOne({
      username: { $regex: `^${username}$`, $options: 'i' }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const profile = await ProfileModel.findOne({ userId: user._id });

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
