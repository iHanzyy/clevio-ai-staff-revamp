"use client";

import React from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PreviewPhone() {
    return (
        <div className="relative w-full h-[800px] md:h-full max-h-[85vh] flex flex-col items-center justify-center">

            {/* FRAME ELEMENTS (Buttons) - Absolute to container */}
            {/* Left Side: Mute & Volume */}
            <div className="absolute top-24 -left-[2px] w-1 h-7 bg-[#2A2E37] rounded-l-md" /> {/* Mute */}
            <div className="absolute top-36 -left-[2px] w-1 h-12 bg-[#2A2E37] rounded-l-md" /> {/* Vol Up */}
            <div className="absolute top-52 -left-[2px] w-1 h-12 bg-[#2A2E37] rounded-l-md" /> {/* Vol Down */}

            {/* Right Side: Power */}
            <div className="absolute top-40 -right-[2px] w-1 h-16 bg-[#2A2E37] rounded-r-md" /> {/* Power */}

            {/* MAIN DEVICE BODY */}
            <div className={cn(
                "relative w-full h-full flex flex-col overflow-hidden",
                "rounded-[3rem]", // Extra rounded corners for iPhone look
                "border-[8px] md:border-[10px] border-[#1C1F26]", // The Bezel
                "bg-[#F9F9F9]",
                "shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                "select-none"
            )}>

                {/* NOTCH (Dynamic Island style) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-[#1C1F26] rounded-b-3xl z-50 flex items-center justify-center">
                    {/* Camera/Sensor dots */}
                    <div className="flex gap-2">
                        <div className="w-12 h-1.5 bg-[#0f1115] rounded-full opacity-60"></div>
                        <div className="w-1.5 h-1.5 bg-blue-900/30 rounded-full"></div>
                    </div>
                </div>

                {/* --- HEADER --- */}
                <div className="flex items-center justify-between px-6 py-5 pt-9 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
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
                <div className="p-4 pb-8 bg-white border-t border-gray-100 opacity-50 z-40">
                    <div className="w-full h-12 bg-gray-100 rounded-full" />
                </div>

                {/* HOME INDICATOR */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full z-50"></div>
            </div>
        </div>
    );
}
