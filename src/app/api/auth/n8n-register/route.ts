import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const bodyText = await request.text();
        let body;
        try {
            body = bodyText ? JSON.parse(bodyText) : {};
        } catch (e) {
            console.error("Failed to parse request body:", e);
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Call N8N Webhook
        console.log(`Registering user via N8N: ${email}`);

        const n8nUrl = process.env.N8N_REGISTER_WITH_N8N;
        if (!n8nUrl) {
            console.error('N8N_REGISTER_WITH_N8N is not defined in environment variables');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // IMPORTANT: Use responseType: 'text' to handle empty/non-JSON responses manually
        const response = await axios.post(
            n8nUrl,
            { email, password },
            {
                validateStatus: () => true,
                responseType: 'text'
            }
        );

        console.log(`N8N Response Status: ${response.status}`);
        console.log(`N8N Response Body Raw: "${response.data}"`);

        // Handle N8N Response
        // Priority 1: Check parsing of explicit JSON format requested by user
        // Priority 2: Check HTTP Status 200 (Fallback for empty body)

        let n8nData = null;
        try {
            if (response.data) {
                const parsed = JSON.parse(response.data);
                n8nData = Array.isArray(parsed) ? parsed[0] : parsed;
            }
        } catch (e) {
            console.warn("N8N response was not valid JSON, treating as raw text/empty");
        }

        const jsonStatusCode = n8nData?.response?.statusCode;
        const jsonLocation = n8nData?.response?.headers?.location;

        const isSuccess = jsonStatusCode === 200 || response.status === 200;

        if (isSuccess) {
            // Determine Redirect Path
            // USER REQUEST: "Redirect full yang n8n kasih"
            // If N8N provides a full URL in 'location', we use it directly.
            // Fallback to '/login' only if location is missing.

            let redirectPath = '/login'; // Default

            if (jsonLocation) {
                // Trust the location header completely as requested
                redirectPath = jsonLocation;
            }

            // REMOVED: Do NOT use axios response URL as fallback, as it points to the N8N webhook
            // else if (response.request?.res?.responseUrl) { ... }

            return NextResponse.json({
                message: 'Registration successful',
                redirect: redirectPath,
                data: n8nData
            });
        } else {
            // Extract error message if available
            return NextResponse.json(
                {
                    error: 'Registration failed at N8N',
                    n8nStatus: response.status,
                    details: response.data || 'Unknown Error'
                },
                { status: 400 }
            );
        }

    } catch (error: any) {
        console.error('N8N Registration Proxy Error:', error.response?.data || error.message);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
