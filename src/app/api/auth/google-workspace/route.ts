"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { agent_id, scopes, action } = body;

        if (!agent_id) {
            return NextResponse.json(
                { message: "Missing agent_id" },
                { status: 400 }
            );
        }

        // Get auth token from cookies or headers
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token')?.value;
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '') || sessionToken;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Construct backend URL
        let backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        if (backendUrl?.endsWith('/')) {
            backendUrl = backendUrl.slice(0, -1);
        }

        let endpoint;
        const apiPrefix = backendUrl?.endsWith('/api/v1') ? '' : '/api/v1';
        const baseUrl = backendUrl + apiPrefix;

        if (action === 'refresh') {
            endpoint = `${baseUrl}/auth/refresh-status-google`;
        } else {
            endpoint = `${baseUrl}/auth/google`;
        }

        console.log("[GoogleWorkspace] Proxy Request to:", endpoint);
        console.log("[GoogleWorkspace] Action:", action || 'initiate');

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(
                action === 'refresh'
                    ? { agent_id }
                    : { agent_id, scopes: scopes || [] }
            ),
        });

        if (!response.ok) {
            let errorDetails;
            try {
                const text = await response.text();
                console.error("[GoogleWorkspace] Backend Error Status:", response.status);
                console.error("[GoogleWorkspace] Backend Error Body:", text);
                errorDetails = text;
                try {
                    errorDetails = JSON.parse(text);
                } catch (e) {
                    // It's text
                }
            } catch (e) {
                console.error("[GoogleWorkspace] Failed to read response body");
            }

            return NextResponse.json(
                { message: `Backend Error: ${response.status}`, details: errorDetails, endpointUsed: endpoint },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("[GoogleWorkspace] Proxy Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
