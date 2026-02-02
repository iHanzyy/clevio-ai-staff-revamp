"use server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Handle potential double slash or missing /api/v1
        let backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        // Remove trailing slash if present
        if (backendUrl?.endsWith('/')) {
            backendUrl = backendUrl.slice(0, -1);
        }

        let endpoint;
        if (backendUrl?.endsWith('/api/v1')) {
            endpoint = `${backendUrl}/auth/google/login`;
        } else {
            endpoint = `${backendUrl}/api/v1/auth/google/login`;
        }

        console.log("[GoogleLogin] Proxy Request to:", endpoint);

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                const text = await response.text();
                console.error("[GoogleLogin] Proxy Error Response (Non-JSON):", text);
                return NextResponse.json(
                    { message: `Backend Error: ${response.status}`, details: text },
                    { status: response.status }
                );
            }
            return NextResponse.json(errorData, { status: response.status });
        }

        let data;
        try {
            data = await response.json();
        } catch (e) {
            // Success status but non-JSON body?
            const text = await response.text();
            // Check if it's a raw URL string
            if (text.startsWith('http')) {
                return NextResponse.json({ auth_url: text });
            }
            console.error("[GoogleLogin] Proxy Success Response (Non-JSON):", text);
            return NextResponse.json(
                { message: "Backend returned invalid JSON", details: text },
                { status: 500 }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error("[GoogleLogin] Proxy Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
