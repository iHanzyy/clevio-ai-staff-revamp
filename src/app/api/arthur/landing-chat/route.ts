import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { rateLimit } from '@/lib/rateLimit';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        // Rate Limit: 30 messages per minute per IP
        const headerList = await headers();
        const ip = headerList.get('x-forwarded-for') || 'unknown';
        if (!rateLimit(ip, 30, 60000)) {
            return NextResponse.json({ error: 'Too many messages. Please slow down.' }, { status: 429 });
        }

        const body = await req.json();
        const n8nUrl = process.env.N8N_CHAT_WEBHOOK_URL;

        if (!n8nUrl) {
            console.error("[LandingChatProxy] Error: N8N_CHAT_WEBHOOK_URL is missing.");
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        const agent = new https.Agent({ family: 4 });

        const response = await axios.post(n8nUrl, body, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: agent,
            validateStatus: () => true,
        });

        if (response.status >= 400) {
            console.error('[LandingChatProxy] N8N Error:', response.data);
            return NextResponse.json(
                { error: 'Failed to process message' },
                { status: response.status }
            );
        }

        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error('[LandingChatProxy] Internal Error:', error.message);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
