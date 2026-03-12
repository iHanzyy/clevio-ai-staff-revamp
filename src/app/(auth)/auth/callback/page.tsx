"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";

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

            // 4. Check for post-login redirect (e.g., from Pricing Pro button)
            const postLoginRedirect = localStorage.getItem('post_login_redirect');
            localStorage.removeItem('post_login_redirect'); // Clean up

            // 5. Redirect to intended destination or Dashboard
            setTimeout(() => {
                window.location.href = postLoginRedirect || '/dashboard';
            }, 1000); // 1s delay to see the nice loader
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
        <LoadingScreen text="Memuat Dashboard..." />
    );
}
