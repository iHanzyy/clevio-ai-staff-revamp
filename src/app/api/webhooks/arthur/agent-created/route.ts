import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ============================================================
// PRIMARY: In-memory store (instant, no race conditions)
// BACKUP: File-based store (survives process restarts)
// ============================================================

// In-memory store - survives across requests in the same process
const memoryStore = new Map<string, { data: any; timestamp: number }>();

// File-based backup storage
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

// Helper to read payloads from file (backup)
const readPayloadsFromFile = (): Record<string, any> => {
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

// Helper to write payloads to file (backup)
const writePayloadsToFile = (payloads: Record<string, any>) => {
    try {
        ensureStorageDir();
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(payloads, null, 2));
    } catch (err) {
        console.error('[Webhook: Arthur] File write error:', err);
    }
};

// Save to BOTH memory and file
const savePayload = (sessionId: string, data: any) => {
    const entry = { data, timestamp: Date.now() };

    // Primary: in-memory
    memoryStore.set(sessionId, entry);
    console.log(`[Webhook: Arthur] Saved to memory for session: ${sessionId} (total entries: ${memoryStore.size})`);

    // Backup: file
    try {
        const payloads = readPayloadsFromFile();
        payloads[sessionId] = entry;
        writePayloadsToFile(payloads);
        console.log(`[Webhook: Arthur] Saved to file for session: ${sessionId}`);
    } catch (err) {
        console.error('[Webhook: Arthur] File backup failed:', err);
    }
};

// Retrieve from memory first, then file fallback
const retrievePayload = (sessionId: string): any | null => {
    // Try memory first (instant)
    const memEntry = memoryStore.get(sessionId);
    if (memEntry && memEntry.data) {
        console.log(`[Webhook: Arthur] Found in memory for session: ${sessionId}`);
        memoryStore.delete(sessionId);
        // Also clean file backup
        try {
            const payloads = readPayloadsFromFile();
            delete payloads[sessionId];
            writePayloadsToFile(payloads);
        } catch { /* ignore */ }
        return memEntry.data;
    }

    // Fallback: try file
    try {
        const payloads = readPayloadsFromFile();
        const fileEntry = payloads[sessionId];
        if (fileEntry && fileEntry.data) {
            console.log(`[Webhook: Arthur] Found in file for session: ${sessionId}`);
            delete payloads[sessionId];
            writePayloadsToFile(payloads);
            return fileEntry.data;
        }
    } catch (err) {
        console.error('[Webhook: Arthur] File read error:', err);
    }

    // Log debugging info
    const memKeys = Array.from(memoryStore.keys());
    console.log(`[Webhook: Arthur] Session NOT found: ${sessionId}. Memory keys: [${memKeys.join(', ')}]`);

    return null;
};

// Cleanup old entries (>30 minutes) from memory to prevent leaks
const cleanupOldEntries = () => {
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    for (const [key, entry] of memoryStore.entries()) {
        if (entry.timestamp < thirtyMinutesAgo) {
            memoryStore.delete(key);
        }
    }
};

export async function POST(req: Request) {
    try {
        let body = await req.json();
        console.log('[Webhook: Arthur] Received POST:', JSON.stringify(body, null, 2));

        // Handle Array payload from N8N (extract first item)
        if (Array.isArray(body) && body.length > 0) {
            body = body[0];
        }

        // 1. Parse Payload from N8N
        const { name, mcp_tools, google_tools, session_id, config } = body;
        const system_prompt = body.system_prompt || config?.system_prompt;
        const llm_model = config?.llm_model || 'gpt-4o-mini';
        const temperature = config?.temperature ?? 0.1;

        if (!name || !system_prompt) {
            console.log('[Webhook: Arthur] Missing name or system_prompt');
            return NextResponse.json({ error: "Missing 'name' or 'system_prompt' in payload" }, { status: 400 });
        }

        // 2. Map to Backend Agent Structure
        const agentPayload = {
            "name": name,
            "google_tools": google_tools || [],
            "config": {
                "llm_model": llm_model,
                "temperature": temperature,
                "system_prompt": system_prompt,
            },
            "mcp_servers": body.mcp_servers || {
                "calculator_sse": {
                    "transport": "sse",
                    "url": "http://194.238.23.242:8190/sse"
                }
            },
            "mcp_tools": mcp_tools || [],
            // Auth tokens from N8N
            "access_token": body.access_token,
            "token_type": body.token_type,
            "expires_at": body.expires_at,
            "token_limit": body.token_limit,
            "plan_code": body.plan_code,
        };

        // 3. Save to BOTH memory and file
        if (session_id) {
            savePayload(session_id, agentPayload);
            // Cleanup old entries periodically
            cleanupOldEntries();
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

    const data = retrievePayload(sessionId);

    if (data) {
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    }

    return NextResponse.json({ error: 'Not found' }, {
        status: 404,
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        }
    });
}