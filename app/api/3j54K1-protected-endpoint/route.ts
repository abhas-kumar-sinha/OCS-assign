import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// This marks the route as dynamic and it should not be statically generated.
export const dynamic = 'force-dynamic';

type Data = {
  message: string;
};

export async function POST(req: NextRequest) {
  try {
    // Extract token from request headers
    const token = req.headers.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Ensure JWT secret is available
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

    // Verify token
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userid = decodedToken.username;
    const role = decodedToken.role;

    // Fetch user data from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('userid, password_hash, role')
      .eq('userid', userid)
      .single();

    if (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if role matches
    if (role === data?.role) {
      // If the user is admin, fetch all users
      if (role === 'admin') {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*');

        if (usersError) {
          return NextResponse.json({ message: 'Internal Server Error', data: data }, { status: 500 });
        }

        return NextResponse.json({ message: 'Success', data: users }, { status: 200 });
      }

      // Return current user data if not admin
      return NextResponse.json({ message: 'Success', data: data }, { status: 200 });
    }

    // If role does not match
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  } catch (error) {
    console.error('Error in protected endpoint:', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
