import React from "react";
import { cn } from "@/lib/utils";

interface AgentModeToggleProps {
    isAutoMode: boolean;
    onToggle: (isAuto: boolean) => void;
    className?: string;
}

export default function AgentModeToggle({ isAutoMode, onToggle, className }: AgentModeToggleProps) {
    return (
        <div className={cn("absolute right-1 z-10 flex items-center gap-3 bg-[#FDFDFD]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/50 shadow-sm transition-all animate-fade-in", className)}>
            <span
                className={cn(
                    "text-[10px] font-bold tracking-wider transition-colors cursor-pointer select-none",
                    !isAutoMode ? "text-gray-900" : "text-gray-400"
                )}
                onClick={() => onToggle(false)}
            >
                MANUAL
            </span>

            <button
                onClick={() => onToggle(!isAutoMode)}
                className={cn(
                    "relative w-10 h-5 rounded-full transition-colors duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none cursor-pointer",
                    isAutoMode ? "bg-lime-500" : "bg-gray-300"
                )}
            >
                <div className={cn(
                    "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-spring",
                    isAutoMode ? "translate-x-5" : "translate-x-0"
                )} />
            </button>

            <span
                className={cn(
                    "text-[10px] font-bold tracking-wider transition-colors cursor-pointer select-none",
                    isAutoMode ? "text-lime-600" : "text-gray-400"
                )}
                onClick={() => onToggle(true)}
            >
                AUTO
            </span>
        </div>
    );
}
