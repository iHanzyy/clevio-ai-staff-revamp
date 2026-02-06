import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const n8nUrl = process.env.N8N_REGISTER_WITH_N8N;

        if (!n8nUrl) {
            console.error('N8N_REGISTER_WITH_N8N is not defined');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Forward to N8N
        const response = await axios.post(n8nUrl, {
            email,
            password
        });

        // Check for success response from N8N
        if (response.data?.response === 'Success') {
            // Return consistent structure for frontend
            return NextResponse.json({
                message: 'Registration successful',
                data: response.data
            });
        } else {
            return NextResponse.json(
                { error: 'Registration failed at N8N', details: response.data },
                { status: 400 }
            );
        }

    } catch (error: any) {
        console.error('N8N Registration Proxy Error:', error.response?.data || error.message);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
