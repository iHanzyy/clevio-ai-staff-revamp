import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("[Webhook: Arthur] Agent Created Event Received:", JSON.stringify(body, null, 2));

        // Validation (Optional but recommended)
        if (!body.agentData) {
             return NextResponse.json({ error: "Missing agentData in payload" }, { status: 400 });
        }

        // TODO: Logic to save the agent to your main database.
        // Note: Since this request comes from N8N (not a logged-in user browser),
        // you won't have the user's JWT token here automatically.
        // You should ensure 'userId' is included in the 'agentData' payload from N8N,
        // or use an Admin API Key to call your backend service.

        /* Example Logic:
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API_URL + '/agents', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-admin-key': process.env.ADMIN_API_KEY // If applicable
            },
            body: JSON.stringify({ ...body.agentData, user_id: body.userId })
        });
        */

        return NextResponse.json({ 
            success: true, 
            message: "Agent data received successfully",
            receivedData: body.agentData
        });

    } catch (error) {
        console.error("[Webhook: Arthur] Processing Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}
