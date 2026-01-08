import { NextResponse } from 'next/server';

const PENDING_PAYLOADS = new Map<string, any>();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("[Webhook: Arthur] Received Payload:", JSON.stringify(body, null, 2));

        // 1. Parsing Payload from N8N (Flat structure based on user screenshot)
        // Payload: { name, system_prompt, mcp_tools, google_tools, session_id }
        const { name, system_prompt, mcp_tools, google_tools, session_id } = body;

        if (!name || !system_prompt) {
            return NextResponse.json({ error: "Missing 'name' or 'system_prompt' in payload" }, { status: 400 });
        }

        // 2. Map to Backend Agent Structure
        const agentPayload = {
            "name": name,
            "google_tools": google_tools || [],
            "config": {
                "llm_model": "gpt-4.1-mini",
                "temperature": 0.1,
                "system_prompt": system_prompt,
            },
            "mcp_servers": {
                "calculator_sse": {
                    "transport": "sse",
                    "url": "http://0.0.0.0:8190/sse"
                }
            },
            "mcp_tools": mcp_tools || [],
        };

        console.log("[Webhook: Arthur] Mapped Agent Payload:", JSON.stringify(agentPayload, null, 2));

        // 3. Save to In-Memory Store for Frontend Retrieval
        if (session_id) {
            console.log(`[Webhook: Arthur] Storing payload for session: ${session_id}`);
            PENDING_PAYLOADS.set(session_id, agentPayload);
        }

        return NextResponse.json({
            success: true,
            message: "Agent data processed and buffered",
            stored: !!session_id
        });

    } catch (error: any) {
        console.error("[Webhook: Arthur] Error:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const data = PENDING_PAYLOADS.get(sessionId);

    if (data) {
        console.log(`[Webhook: Arthur] Retrieving & clearing payload for session: ${sessionId}`);
        PENDING_PAYLOADS.delete(sessionId);
        return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}