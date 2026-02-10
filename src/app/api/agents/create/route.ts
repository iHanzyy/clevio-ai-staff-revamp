import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { rateLimit } from '@/lib/rateLimit';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting Protection (Max 10 requests per minute per IP for creation)
        const headerList = await headers();
        const ip = headerList.get('x-forwarded-for') || 'unknown';
        if (!rateLimit(ip, 10, 60000)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const body = await req.json();
        const { payload, token } = body;

        // 2. Use Secure Server-Side Env Var
        const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;

        if (!backendUrl) {
            console.error('[AgentCreateProxy] Error: Backend URL missing');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        if (!token) {
            return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
        }

        const agent = new https.Agent({ family: 4 });

        const response = await axios.post(`${backendUrl}/agents/`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            httpsAgent: agent
        });

        return NextResponse.json(response.data);

    } catch (error: any) {
        // Log full error for server-side debugging
        const upstreamStatus = error.response?.status;
        const upstreamData = error.response?.data;
        console.error(`[AgentCreateProxy] Error (${upstreamStatus}):`, upstreamData || error.message);

        // Return meaningful error to client with upstream details
        return NextResponse.json(
            {
                error: upstreamData?.detail || upstreamData?.error || error.message || 'Failed to create agent',
                upstream_status: upstreamStatus,
                details: typeof upstreamData === 'object' ? upstreamData : undefined
            },
            { status: upstreamStatus || 500 }
        );
    }
}
