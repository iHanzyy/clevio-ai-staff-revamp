"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Handle token from URL (in case backend sends token here too)
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('jwt_token', token);
            document.cookie = `session_token=${token}; path=/; max-age=604800; SameSite=Lax`;
            router.replace('/dashboard');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen w-full bg-[#F9F6EE] flex flex-col items-center justify-center py-20 px-4">
            <div className="text-center max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold font-sans text-[#1a1a1a] mb-6 tracking-tight">
                    Dashboard
                </h1>
                <p className="text-lg text-[#1a1a1a]/60 leading-relaxed mb-8">
                    Selamat datang di Dashboard Clevio AI Staff. Halaman ini sedang dalam pengembangan.
                </p>
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-lg">
                    <p className="text-[#1a1a1a]/80">
                        Fitur manajemen Agent dan integrasi akan segera hadir.
                    </p>
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem('jwt_token');
                        document.cookie = 'session_token=; path=/; max-age=0';
                        window.location.href = '/login';
                    }}
                    className="mt-8 px-6 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 font-medium transition-all duration-200 border border-red-500/20 hover:border-red-500/30 backdrop-blur-sm"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
