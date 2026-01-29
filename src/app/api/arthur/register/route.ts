import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const n8nUrl = process.env.N8N_REGISTER_WEBHOOK_URL;

        if (!n8nUrl) {
            console.error("[RegisterProxy] Error: N8N_REGISTER_WEBHOOK_URL is missing.");
            return NextResponse.json(
                { error: 'Server misconfiguration: N8N_REGISTER_WEBHOOK_URL not set' },
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
            console.error('[RegisterProxy] N8N Error Response:', response.data);
            return NextResponse.json(
                { error: 'Failed to register user', details: response.data },
                { status: response.status }
            );
        }

        console.log('[RegisterProxy] N8N Response:', JSON.stringify(response.data, null, 2));
        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error('[RegisterProxy] Internal Error:', error.message);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
