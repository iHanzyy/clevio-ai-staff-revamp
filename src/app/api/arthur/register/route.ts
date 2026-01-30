import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { rateLimit } from '@/lib/rateLimit';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        // Rate Limit: 5 registrations per minute per IP
        const headerList = await headers();
        const ip = headerList.get('x-forwarded-for') || 'unknown';
        if (!rateLimit(ip, 5, 60000)) {
            return NextResponse.json({ error: 'Too many registration attempts.' }, { status: 429 });
        }

        const body = await req.json();
        const n8nUrl = process.env.N8N_REGISTER_WEBHOOK_URL;

        if (!n8nUrl) {
            console.error("[RegisterProxy] Error: N8N_REGISTER_WEBHOOK_URL is missing.");
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        const agent = new https.Agent({ family: 4 });

        const response = await axios.post(n8nUrl, body, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: agent,
            validateStatus: () => true,
        });

        if (response.status >= 400) {
            console.error('[RegisterProxy] N8N Error Response:', response.data);
            return NextResponse.json(
                { error: 'Failed to register user' },
                { status: response.status }
            );
        }

        // console.log('[RegisterProxy] N8N Response:', JSON.stringify(response.data, null, 2)); // Debug removed
        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error('[RegisterProxy] Internal Error:', error.message);
        return NextResponse.json(
            { error: 'An unexpected error occurred during registration' },
            { status: 500 }
        );
    }
}
