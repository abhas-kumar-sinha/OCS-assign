// app/api/7f83d9-protected-endpoint/route.ts

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

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ message: 'Server is running...' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const requestType = req.headers.get('Request-Type');

  if (requestType === 'login') {

    try {
      const { username, password_hash }: { username: string; password_hash: string } = await req.json();

      
      const { data, error } = await supabase
      .from('users')
      .select('password_hash, role') 
      .eq('userid', username)     
      .single();                
  
      if (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      if (password_hash == data.password_hash) {

        const role = data.role;

        if (!process.env.JWT_SECRET) {
          return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }

        const token = jwt.sign( { username, role }, process.env.JWT_SECRET )

        return NextResponse.json({ message: 'Success', token: token }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

  }

  else if (requestType === 'signup') {

    try {
      const { username, password_hash }: { username: string; password_hash: string } = await req.json();
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          { userid: username, password_hash: password_hash, role: 'Basic' },
        ])
        .select();
        if (data) {

          const role = 'Basic';

          if (!process.env.JWT_SECRET) {
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
          }

          const token = jwt.sign( { username, role }, process.env.JWT_SECRET );

          return NextResponse.json({ message: 'Success', token: token }, {status: 200})
        } 
        
        else if (error) {
          return NextResponse.json({ message: 'Database Error' }, {status: 406})
        }

        else {
          return NextResponse.json({ message: 'Internal Server Error' }, {status: 500})
        }
          
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

  }

  return NextResponse.json({ message: 'Unauthorized access' }, { status: 400 });

}
