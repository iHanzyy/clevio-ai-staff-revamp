"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight } from "lucide-react";
import { authService, User } from "@/services/authService";

export default function ExpiredPlanPopup() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkPlanStatus = async () => {
            try {
                const userData = await authService.getMe();
                setUser(userData);
                
                if (userData?.api_expires_at) {
                    const daysRemaining = Math.ceil(
                        (new Date(userData.api_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    
                    if (daysRemaining <= 0) {
                        setIsExpired(true);
                    }
                }
            } catch (error) {
                console.error("Failed to check plan status", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        checkPlanStatus();
    }, []);

    // Don't render until we know the status to avoid flicker
    if (isLoading || !isExpired) {
        return null; 
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl relative overflow-hidden animate-fade-in-up">
                
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600 shadow-sm border border-red-200">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Masa Aktif Paket Berakhir
                    </h2>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Mohon maaf, paket AI Staff Anda telah habis masa berlakunya. 
                        Silakan perpanjang paket Anda untuk kembali menggunakan dan mengelola agen AI.
                    </p>
                    
                    <button
                        onClick={() => router.push('/payment')}
                        className="w-full flex items-center justify-center gap-2 bg-[#02457A] hover:bg-[#013560] text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/20 group"
                    >
                        <span>Perpanjang Paket Sekarang</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    {/* Optional support link if they have questions */}
                    <div className="mt-6 text-sm text-gray-500">
                        Butuh bantuan? <a href="#" className="text-blue-600 hover:underline">Hubungi Tim Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
