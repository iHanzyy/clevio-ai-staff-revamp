
import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const n8nUrl = process.env.NEXT_N8N_PROCESS_AGENT;

        if (!n8nUrl) {
            console.error("[ArthurProxy] Error: NEXT_N8N_PROCESS_AGENT is missing.");
            return NextResponse.json(
                { error: 'Server misconfiguration: NEXT_N8N_PROCESS_AGENT not set' },
                { status: 500 }
            );
        }

        // Force IPv4 to resolve connectivity issues on some VPS environments
        const agent = new https.Agent({ family: 4 });

        const response = await axios.post(n8nUrl, body, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: agent,
            validateStatus: () => true,
        });

        if (response.status >= 400) {
            console.error('[ArthurProxy] N8N Error Response:', response.data);
            return NextResponse.json(
                { error: 'Failed to communicate with AI service', details: response.data },
                { status: response.status }
            );
        }

        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error('[ArthurProxy] Internal Error:', error.message);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
