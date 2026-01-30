"use client";

import React from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClayInputProps {
    placeholder?: string;
    onSend?: (value: string) => void;
    className?: string;
}

export default function ClayInput({
    placeholder = "Type something...",
    onSend,
    className
}: ClayInputProps) {
    const handleSend = () => {
        // Mock send logic for now, can be expanded to use state
        if (onSend) onSend("");
    };

    return (
        <div className={cn("relative group w-full", className)}>
            {/* Soft Glow Behind */}
            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Clay Container */}
            <div className={cn(
                "relative flex items-center pl-3 pr-1.5 py-1.5 sm:px-2 sm:py-2 rounded-full transition-transform duration-300 transform focus-within:scale-[1.02]",
                "bg-[#FDFDFD]", // Almost white
                // Claymorphism Shadows: Inner Highlight (Top-Left) + Soft Drop Shadow (Bottom)
                "shadow-[inset_2px_2px_6px_rgba(255,255,255,0.8),inset_-2px_-2px_6px_rgba(0,0,0,0.05),0_8px_20px_rgba(0,0,0,0.08)]",
                "border border-white/60"
            )}>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="grow bg-transparent border-none outline-none px-2 sm:px-4 text-gray-700 placeholder:text-gray-400 font-sans text-sm sm:text-base h-9 sm:h-12"
                />
                <button
                    onClick={handleSend}
                    className="w-9 h-9 sm:w-12 sm:h-12 bg-[#5D4037] hover:bg-[#4E342E] rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg text-white group-focus-within:scale-105 cursor-pointer"
                >
                    <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                </button>
            </div>
        </div>
    );
}
