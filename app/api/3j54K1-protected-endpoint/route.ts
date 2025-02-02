// app/api/3j54K1-protected-endpoint/route.ts

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

        const token = req.headers.get('token');

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (!process.env.JWT_SECRET) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }

        const verify = jwt.verify( token, process.env.JWT_SECRET )

        if (!verify) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userid = (verify as any).username;
        const role = (verify as any).role;

        const { data, error } = await supabase
        .from('users')
        .select('userid, password_hash, role') 
        .eq('userid', userid)     
        .single(); 

        if (error) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (role == data?.role) {
            if (role == 'admin') {
                
                let { data: users, error } = await supabase
                .from('users')
                .select('*')

                if (error) {
                    return NextResponse.json({ message: 'Internal Server Error', data: data }, { status: 500 });
                }

                return NextResponse.json({ message: 'Success', data: users }, { status: 200 });
                
            }


            return NextResponse.json({ message: 'Success', data: data }, { status: 200 });

        }


    } catch (error) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

}
