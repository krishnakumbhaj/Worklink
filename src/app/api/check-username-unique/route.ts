import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';

// Force dynamic rendering to fix Vercel deployment error
export const dynamic = 'force-dynamic';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET( request: any) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get('username'),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}