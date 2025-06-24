import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";  // your existing auth config
import connectDB from "@/lib/dbConnect";  // your existing database connection utility
import UserModel from "@/models/User";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const deletedUser = await UserModel.findOneAndDelete({ email: userEmail });

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
