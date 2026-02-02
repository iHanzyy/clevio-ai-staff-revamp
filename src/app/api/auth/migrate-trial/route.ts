
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { trial_user_id } = body;

        if (!trial_user_id) {
            return NextResponse.json(
                { message: "Missing trial_user_id" },
                { status: 400 }
            );
        }

        // Handle potential double slash or missing /api/v1
        let backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        // Remove trailing slash if present
        if (backendUrl.endsWith('/')) {
            backendUrl = backendUrl.slice(0, -1);
        }
        // If env var already includes /api/v1, rely on it
        // If not, assume we need to add it, unless it's just the domain.
        // Safest approach compatible with user's .env:
        // User env: .../api/v1
        // Target: .../api/v1/auth/google/migrate-trial

        let endpoint;
        if (backendUrl.endsWith('/api/v1')) {
            endpoint = `${backendUrl}/auth/google/migrate-trial`;
        } else {
            endpoint = `${backendUrl}/api/v1/auth/google/migrate-trial`;
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ trial_user_id }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("[MigrateTrial] Proxy Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
