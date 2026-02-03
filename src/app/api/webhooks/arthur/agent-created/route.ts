import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// File-based storage for pending payloads (works across serverless invocations)
// File-based storage for pending payloads (works across serverless invocations)
// NOTE: On Vercel, this is ephemeral. For production, use Vercel KV or Database.
const STORAGE_DIR = process.env.VERCEL || process.env.NODE_ENV === 'production'
    ? '/tmp'
    : path.join(process.cwd(), '.tmp');
const STORAGE_FILE = path.join(STORAGE_DIR, 'pending_payloads.json');

// Helper to ensure storage directory exists
const ensureStorageDir = () => {
    if (!fs.existsSync(STORAGE_DIR)) {
        fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
};

// Helper to read payloads from file
const readPayloads = (): Record<string, any> => {
    ensureStorageDir();
    if (!fs.existsSync(STORAGE_FILE)) {
        return {};
    }
    try {
        const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {};
    }
};

// Helper to write payloads to file
const writePayloads = (payloads: Record<string, any>) => {
    ensureStorageDir();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(payloads, null, 2));
};

export async function POST(req: Request) {
    try {
        let body = await req.json();
        console.log('[Webhook: Arthur] Received POST:', JSON.stringify(body, null, 2));

        // Handle Array payload from N8N (extract first item)
        if (Array.isArray(body) && body.length > 0) {
            body = body[0];
        }

        // 1. Parsing Payload from N8N (Flat structure based on user screenshot)
        // Payload: { name, system_prompt, mcp_tools, google_tools, session_id }
        const { name, system_prompt, mcp_tools, google_tools, session_id } = body;

        if (!name || !system_prompt) {
            console.log('[Webhook: Arthur] Missing name or system_prompt');
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
                    "url": "http://194.238.23.242:18100/sse"
                }
            },
            "mcp_tools": mcp_tools || [],
        };

        // 3. Save to File-Based Store for Frontend Retrieval
        if (session_id) {
            const payloads = readPayloads();
            payloads[session_id] = {
                data: agentPayload,
                timestamp: Date.now()
            };
            writePayloads(payloads);
            console.log(`[Webhook: Arthur] Saved payload for session: ${session_id}`);
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

    const payloads = readPayloads();
    const entry = payloads[sessionId];

    if (entry && entry.data) {
        console.log(`[Webhook: Arthur] Retrieving payload for session: ${sessionId}`);

        // Remove from storage after retrieval
        delete payloads[sessionId];
        writePayloads(payloads);

        return NextResponse.json(entry.data);
    }

    // Debugging: Log available keys to see if mismatch exists
    console.log(`[Webhook: Arthur] Session not found: ${sessionId}. Available: ${Object.keys(payloads)}`);

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}