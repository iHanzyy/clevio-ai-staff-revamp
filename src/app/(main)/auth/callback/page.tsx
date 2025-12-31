"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // Handle the callback logic
        // 1. Parse the token from URL query params
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            // 2. Save token to localStorage (for API)
            localStorage.setItem('jwt_token', token);

            // 3. Save token to Cookie (Native Method for Reliability)
            document.cookie = `session_token=${token}; path=/; max-age=604800; SameSite=Lax`;

            // 4. Redirect to Dashboard (Active User Flow)
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 500);
        } else {
            // Redirect back to login on error
            const error = params.get('error');
            if (error) {
                router.push(`/login?error=${error}`);
            } else {
                router.push('/login');
            }
        }
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#F9F6EE]">
            <div className="text-center">
                <h2 className="text-xl font-bold font-sans mb-2">Authenticating...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
}
