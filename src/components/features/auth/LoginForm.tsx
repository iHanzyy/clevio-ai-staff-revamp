"use client";

import React from "react";
import StickyNote from "@/components/ui/StickyNote";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";
import ClayInput from "@/components/ui/ClayInput";

export default function LoginForm() {
    const router = useRouter();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = React.useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = React.useState(false);

    // Form State
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleGoogleLogin = async () => {
        try {
            const data = await authService.getGoogleLoginUrl();
            if (typeof data === 'string') window.location.href = data;
            else if (data && data.auth_url) window.location.href = data.auth_url;
        } catch (error) {
            console.error("Google Login Error", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (activeTab === 'register') {
                const res = await authService.register(email, password);
                if (res.message) {
                    showToast("Registrasi berhasil! Mengarahkan ke login...", "success");

                    if (res.redirect) {
                        router.push(res.redirect);
                    }

                    setActiveTab('login');
                    setPassword(""); // Clear password for safety
                }
            } else {
                const res = await authService.login(email, password);
                if (res.jwt_token) {
                    authService.setSession(res.jwt_token);

                    // CRITICAL: Get access_token for CRUD operations (agents, tools, etc.)
                    // jwt_token is login-only, access_token is what backend needs for API calls
                    console.log('[Login] Getting access_token via /auth/api-key...');
                    const accessToken = await authService.getAccessToken(email, password);
                    if (!accessToken) {
                        console.warn('[Login] Could not get access_token, CRUD operations may fail');
                    }

                    // Check User Status & Redirect
                    try {
                        console.log("Fetching user profile...");
                        const user = await authService.getMe();
                        console.log("User fetched:", user);

                        showToast("Login berhasil! Mengarahkan ke dashboard...", "success");

                        // Force redirect using window.location.replace to prevent history loop
                        setTimeout(() => {
                            window.location.replace('/dashboard');
                        }, 500);

                    } catch (err) {
                        console.error("Profile fetch failed, forcing redirect...", err);
                        window.location.href = '/dashboard';
                    }
                }
            }
        } catch (error: any) {
            console.error(error);
            const errMsg = error.response?.data?.detail || "Terjadi kesalahan. Coba lagi.";
            showToast(errMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center w-full h-full">
            <StickyNote
                bgColor="bg-[#d3c716ff]"
                foldColor="#d3c716ff"
                showHoles={true}
                holeColor="bg-white"
                className="w-[400px] min-h-[420px] transition-all duration-300"
            >
                <div className="flex flex-col items-center w-full h-full px-8 py-6">

                    {/* Tabs */}
                    <div className="flex w-full bg-white/30 backdrop-blur-sm rounded-full p-1 mb-6 border border-white/40">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-bold rounded-full transition-all",
                                activeTab === 'login' ? "bg-white shadow-sm text-gray-800" : "text-gray-700/70 hover:bg-white/20"
                            )}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab('register')}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-bold rounded-full transition-all",
                                activeTab === 'register' ? "bg-white shadow-sm text-gray-800" : "text-gray-700/70 hover:bg-white/20"
                            )}
                        >
                            Register
                        </button>
                    </div>

                    {/* Email/Pass Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-4 mb-6">
                        <ClayInput
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/50 border-white/40 focus:bg-white/80"
                        />
                        <ClayInput
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white/50 border-white/40 focus:bg-white/80"
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 bg-[#2A2E37] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#353A45] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                activeTab === 'login' ? "Sign In" : "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="w-full flex items-center gap-3 mb-6">
                        <div className="h-px bg-black/10 flex-1" />
                        <span className="text-[10px] font-bold text-black/30">OR</span>
                        <div className="h-px bg-black/10 flex-1" />
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center py-2.5 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm transition-all active:scale-95 hover:bg-white/60 cursor-pointer gap-3"
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238989)">
                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                            </g>
                        </svg>
                        <span className="text-[#1a1a1a] text-xs font-bold font-sans">
                            Continue with Google
                        </span>
                    </button>
                </div>
            </StickyNote>
        </div>
    );
}
