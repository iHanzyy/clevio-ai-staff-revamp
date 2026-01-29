import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { payload, token } = body;

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

        if (!backendUrl) {
            return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
        }

        if (!token) {
            return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
        }

        // Use IPv4 Agent to prevent connection issues
        const agent = new https.Agent({ family: 4 });

        // Forward request to Backend API
        const response = await axios.post(`${backendUrl}/agents/`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            httpsAgent: agent
        });

        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error('[AgentCreateProxy] Error:', error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data || 'Failed to create agent' },
            { status: error.response?.status || 500 }
        );
    }
}
