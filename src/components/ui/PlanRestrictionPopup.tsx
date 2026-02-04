"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { X, Lock, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import { useUserTier } from "@/hooks/useUserTier";
import { useToast } from "@/components/ui/ToastProvider";

interface PlanRestrictionPopupProps {
    isOpen: boolean;
    onClose: () => void;
    type: "timer" | "feature"; // 'timer' for 5-min warning, 'feature' for locked feature
    message?: string;
}

export default function PlanRestrictionPopup({ isOpen, onClose, type, message }: PlanRestrictionPopupProps) {
    // Hooks
    const { user } = useUserTier();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSignIn = async () => {
        if (!user?.id) {
            showToast("User ID tidak ditemukan. Silakan refresh halaman.", "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/migrate-trial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trial_user_id: user.id }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal melakukan migrasi.");
            }

            if (data.auth_url) {
                // Redirect user to Google Auth for migration
                window.location.href = data.auth_url;
            } else {
                showToast("Gagal mendapatkan URL Login.", "error");
            }

        } catch (error: any) {
            console.error("Migration Error:", error);
            showToast(error.message || "Terjadi kesalahan saat mencoba login.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                {!isLoading && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                <div className="flex flex-col items-center text-center">
                    {/* Icon based on type */}
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
                        {type === 'timer' ? <Clock size={32} /> : <Lock size={32} />}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {type === 'timer' ? "Simpan Progress Anda" : "Fitur Terkunci"}
                    </h3>

                    <p className="text-gray-600 mb-6 px-4">
                        {message || (type === 'timer'
                            ? "Yuk Sign In agar data agent Anda tersimpan aman (Gratis)."
                            : "Fitur ini hanya tersedia untuk pengguna yang terdaftar.")}
                        <br />
                        Silakan Masuk untuk melanjutkan penggunaan <strong>gratis</strong>.
                    </p>
                </div>

                {/* Button - Now outside the inner div context for spacing, matching prev style or clean stack */}
                <button
                    onClick={handleSignIn}
                    disabled={isLoading}
                    className={cn(
                        "w-full py-3.5 mt-6 rounded-xl font-bold text-sm text-gray-700",
                        "bg-white border border-gray-200",
                        "flex items-center justify-center gap-3",
                        "shadow-[0_4px_6px_rgba(0,0,0,0.05)]",
                        "hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer",
                        isLoading && "opacity-70 cursor-not-allowed"
                    )}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238989)">
                                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                </g>
                            </svg>
                            Sign in with Google
                        </>
                    )}
                </button>

                {/* Close Button at bottom */}
                <button
                    onClick={onClose}
                    className="mt-4 text-xs text-center w-full text-gray-400 font-medium hover:text-gray-600 transition-colors cursor-pointer"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}
