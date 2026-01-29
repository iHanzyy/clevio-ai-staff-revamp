
import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { rateLimit } from '@/lib/rateLimit';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        // Rate Limit for Dashboard: 100 req/min (higher than landing)
        const ip = headers().get('x-forwarded-for') || 'unknown';
        if (!rateLimit(ip, 100, 60000)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const body = await req.json();
        const n8nUrl = process.env.NEXT_N8N_PROCESS_AGENT;

        if (!n8nUrl) {
            console.error("[ArthurProxy] Error: NEXT_N8N_PROCESS_AGENT is missing.");
            return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
        }

        const agent = new https.Agent({ family: 4 });

        const response = await axios.post(n8nUrl, body, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: agent,
            validateStatus: () => true,
        });

        if (response.status >= 400) {
            console.error('[ArthurProxy] N8N Error:', response.data);
            return NextResponse.json(
                { error: 'Failed to process request' },
                { status: response.status }
            );
        }

        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error('[ArthurProxy] Internal Error:', error.message);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
