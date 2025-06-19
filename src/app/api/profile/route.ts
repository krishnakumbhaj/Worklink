import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/options';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProfileModel from '@/models/Profile';
import UserModel from '@/models/User';



export async function POST(request: Request) {
  await dbConnect();

  try {
    // Get current logged-in user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return Response.json(
        { success: false, message: "Unauthorized: No valid session found" },
        { status: 401 }
      );
    }

    const email = session.user.email;

    // Find user by email from session
    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get the rest data from request body
    const {
      fullName,
      bio,
      profileImage,
      phone,
      socialLinks,
      skills,
      experience,
      education,
      location,
    } = await request.json();

    const profileData = {
      userId: user._id,
      email: user.email,  // fetched directly from session
      fullName,
      bio,
      profileImage,
      phone,
      socialLinks,
      skills,
      experience,
      education,
      location,
    };

    // Upsert the profile
    const profile = await ProfileModel.findOneAndUpdate(
      { userId: user._id },
      profileData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return Response.json(
      {
        success: true,
        message: "Profile created/updated successfully",
        profile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    return Response.json(
      { success: false, message: "Server error while processing profile" },
      { status: 500 }
    );
  }
}



export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const email = session.user.email;

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found with the provided email' },
        { status: 404 }
      );
    }

    // Get profile and populate username
    const profile = await ProfileModel.findOne({ userId: user._id }).populate(
      'userId',
      'username'
    );

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found for the user' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, profile},
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while fetching profile' },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const email = session.user.email;

    // Find the user by session email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const updates = await req.json();

    // Define allowed fields
    const allowedFields = [
      'email', 'fullName', 'bio', 'profileImage', 'phone',
      'socialLinks', 'skills', 'experience', 'education', 'location',
    ];

    // Filter only allowed updates
    const filteredUpdates: any = {};
    for (const key in updates) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    }

    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { userId: user._id },
      { $set: filteredUpdates },
      { new: true }
    );

    if (!updatedProfile) {
      return NextResponse.json({ success: false, message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Profile updated', profile: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedProfile = await ProfileModel.findOneAndDelete({ email: session.user.email });

    if (!deletedProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}