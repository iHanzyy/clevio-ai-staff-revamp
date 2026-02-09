"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get error message from query params
    const rawMessage = searchParams.get("message") || "Terjadi kesalahan saat autentikasi";

    // Decode URL-encoded message and make it user-friendly
    const errorMessage = decodeURIComponent(rawMessage).replace(/\+/g, " ");

    const handleBackToDashboard = () => {
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            {/* Claymorphism Card */}
            <div className="
                relative
                w-full max-w-md
                bg-white/80
                backdrop-blur-sm
                rounded-[2rem]
                p-8
                shadow-[8px_8px_24px_rgba(0,0,0,0.08),-8px_-8px_24px_rgba(255,255,255,0.9)]
                border border-white/50
            ">
                {/* Illustration */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                        <Image
                            src="/illustrations/auth-error.png"
                            alt="Authentication Error"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-3">
                    Oops! Ada Kendala
                </h1>

                {/* Error Message */}
                <div className="
                    bg-red-50/80
                    border border-red-200/50
                    rounded-xl
                    p-4
                    mb-6
                    shadow-[inset_2px_2px_6px_rgba(0,0,0,0.04)]
                ">
                    <p className="text-red-700 text-center text-sm leading-relaxed">
                        {errorMessage}
                    </p>
                </div>

                {/* Helpful Hint */}
                <p className="text-slate-500 text-center text-sm mb-6">
                    Silakan coba lagi atau kembali ke dashboard untuk melanjutkan.
                </p>

                {/* Back to Dashboard Button */}
                <button
                    onClick={handleBackToDashboard}
                    className="
                        w-full
                        flex items-center justify-center gap-2
                        bg-gradient-to-br from-lime-600 to-lime-500
                        hover:from-lime-700 hover:to-lime-600
                        text-white
                        font-semibold
                        py-3.5 px-6
                        rounded-xl
                        shadow-[4px_4px_12px_rgba(101,163,13,0.3)]
                        hover:shadow-[6px_6px_16px_rgba(101,163,13,0.4)]
                        transition-all duration-200
                        cursor-pointer
                    "
                >
                    <ArrowLeft size={20} />
                    Kembali ke Dashboard
                </button>
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="loader" />
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    );
}
