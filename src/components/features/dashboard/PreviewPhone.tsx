"use client";

import React from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PreviewPhone() {
    return (
        <div className={cn(
            "w-full h-[800px] md:h-full max-h-[85vh] flex flex-col rounded-[3rem] overflow-hidden border-[8px] border-[#1C1F26]",
            "bg-[#F9F9F9]", // Phone Screen Background
            // Device Outer Shadow (Clay-like depth)
            "shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
            "select-none"
        )}>
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                        <Image
                            src="/skeletonProfile.webp"
                            alt="Preview Agent"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">Preview Agent</h3>
                        <p className="text-xs text-gray-500 font-medium">Belum dibuat</p>
                    </div>
                </div>
                <button
                    disabled
                    className="text-sm font-medium text-gray-300"
                >
                    Reset
                </button>
            </div>

            {/* --- LOCKED BODY --- */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4 shadow-sm">
                    <Lock className="w-8 h-8" />
                </div>
                <p className="text-gray-500 font-medium text-sm max-w-[200px] leading-relaxed">
                    Buat agent terlebih dahulu untuk melihat preview.
                </p>
            </div>

            {/* --- DUMMY INPUT AREA (Visual Only) --- */}
            <div className="p-4 bg-white border-t border-gray-100 opacity-50">
                <div className="w-full h-12 bg-gray-100 rounded-full" />
            </div>
        </div>
    );
}
