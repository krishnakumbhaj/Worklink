import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options'; // adjust path as needed
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import ProfileModel from '@/models/Profile';
import TestimonialModel from '@/models/Testimonial';

interface CreateTestimonialRequest {
            message: string;
}

export async function POST(req: Request) {
            await dbConnect();

            try {
                        const session = await getServerSession(authOptions);
                        if (!session || !session.user?.email) {
                                    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
                        }

                        // Get user by email from session
                        const user = await UserModel.findOne({ email: session.user.email });
                        if (!user) {
                                    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
                        }

                        const body: CreateTestimonialRequest = await req.json();
                        const { message } = body;

                        // Get profile
                        const profile = await ProfileModel.findOne({ userId: user._id });

                        const testimonial = await TestimonialModel.create({
                                    userId: user._id,
                                    username: user.username,
                                    profileImage: profile?.profileImage || '',
                                    message: message
                        });

                        return NextResponse.json({ success: true, testimonial });
            } catch (error) {
                        console.error('Error creating testimonial:', error);
                        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
            }
}

export async function GET() {
            await dbConnect();
            try {
                        const testimonials = await TestimonialModel.find().sort({ createdAt: -1 });
                        return NextResponse.json({ success: true, testimonials });
            } catch (error) {
                        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
            }
}
