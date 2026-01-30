"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X, Lock } from "lucide-react";
import Image from "next/image";

interface TrialPopupProps {
    isOpen: boolean;
    onClose: () => void;
    type: "timer" | "feature"; // 'timer' for 5-min warning, 'feature' for locked feature
    message?: string;
}

export default function TrialPopup({ isOpen, onClose, type, message }: TrialPopupProps) {
    if (!isOpen) return null;

    const handleSignIn = () => {
        console.log("Sign In with Google Clicked");
        // Future: Trigger Google Auth flow
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Blocking Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

            {/* Modal Card */}
            <div className="relative w-full max-w-sm bg-[#FDFDFD] rounded-[2rem] p-8 animate-scale-up shadow-[inset_0_4px_8px_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.1)] border border-white/50 text-center flex flex-col items-center">

                {/* Icon */}
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                    {type === 'timer' ? (
                        <div className="relative w-12 h-12">
                            <Image src="/clevioLogo.webp" alt="Clevio" fill className="object-contain" />
                        </div>
                    ) : (
                        <Lock className="w-8 h-8 text-gray-400" />
                    )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 text-xl mb-3">
                    {type === 'timer' ? "Simpan Progress Anda!" : "Fitur Terkunci 🔒"}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2">
                    {message || (type === 'timer'
                        ? "Sesi Trial Anda terbatas. Sign In sekarang agar konfigurasi agent Anda tidak hilang."
                        : "Maaf, fitur ini hanya tersedia untuk user terdaftar. Silakan Sign In untuk melanjutkan.")}
                </p>

                {/* Button */}
                <button
                    onClick={handleSignIn}
                    className={cn(
                        "w-full py-3.5 rounded-xl font-bold text-sm text-gray-700",
                        "bg-white border border-gray-200",
                        "flex items-center justify-center gap-3",
                        "shadow-[0_4px_6px_rgba(0,0,0,0.05)]",
                        "hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    )}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238989)">
                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                        </g>
                    </svg>
                    Sign in with Google
                </button>

                {/* Close Button? Optional. User said "wajib sign in". But usually user can close popup. */}
                {/* Because "wajib", maybe NO close button? But user said "bila user klik maka akan muncul popup". */}
                {/* Usually timer popup is dismissible but annoying. Locked feature popup is strict. */}
                {/* I will add a small "Later" button for UX, unless user insists strict block. */}
                {/* User: "isi dari akunnya ga hilang". Suggests persistent warning. */}

                {/* I'll add a close button for now, otherwise it's softlock since button does nothing. */}
                <button
                    onClick={onClose}
                    className="mt-4 text-xs text-gray-400 font-medium hover:text-gray-600 transition-colors cursor-pointer"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}
