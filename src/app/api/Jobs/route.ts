import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';
import User from '@/models/User'; // Import your User model

export async function POST(req: NextRequest) {
            await dbConnect();

            try {
                        const {
                                    email, // Accept email instead of userId
                                    title,
                                    company,
                                    location,
                                    type,
                                    salary,
                                    description,
                                    requirements,
                                    benefits,
                                    applicationDeadline,
                                    experienceLevel,
                                    remoteOption,
                                    experience,
                        } = await req.json();

                        // Validate required fields
                        if (
                                    !email ||
                                    !title ||
                                    !company ||
                                    !location ||
                                    !type ||
                                    !salary ||
                                    !description ||
                                    !requirements ||
                                    !benefits ||
                                    !applicationDeadline ||
                                    !experienceLevel ||
                                    !remoteOption ||
                                    !experience
                        ) {
                                    return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
                        }

                        // Find user by email
                        const user = await User.findOne({ email });
                        if (!user) {
                                    return NextResponse.json({ message: 'User not found.' }, { status: 404 });
                        }

                        const newJob = await Job.create({
                                    userId: user._id, // Use user._id as userId
                                    email,
                                    title,
                                    company,
                                    location,
                                    type,
                                    salary,
                                    description,
                                    requirements,
                                    benefits,
                                    applicationDeadline,
                                    experienceLevel,
                                    remoteOption,
                                    experience,
                        });

                        return NextResponse.json({ message: 'Job created successfully!', job: newJob }, { status: 201 });
            } catch (error) {
                        console.error(error);
                        return NextResponse.json({ message: 'Server error.' }, { status: 500 });
            }
}


export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const jobs = await Job.find().sort({ createdAt: -1 }); // Latest first
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ message: 'Failed to fetch jobs' }, { status: 500 });
  }
}

