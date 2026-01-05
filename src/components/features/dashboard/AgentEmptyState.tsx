"use client";

import React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentEmptyStateProps {
    onCreateClick: () => void;
}

export default function AgentEmptyState({ onCreateClick }: AgentEmptyStateProps) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6">
            <div className={cn(
                "w-full max-w-md p-10 rounded-[2rem] flex flex-col items-center text-center",
                "bg-[#1C1F26]/95 backdrop-blur-sm", // Dark Glass
                "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
                "border border-white/5"
            )}>
                <h2 className="text-3xl font-bold text-white mb-4">Belum ada Agen</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
                    Buat agen pertama Anda untuk mulai mengatur tugas, pengetahuan, kemampuan, dan integrasi.
                </p>

                <ul className="text-left text-sm text-gray-400 space-y-3 mb-10 w-full max-w-xs pl-2">
                    <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
                        <span>Mulai wawancara dengan Arthur</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0 mt-1.5" />
                        <span>Arthur akan membuat agen berdasarkan jawaban Anda</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0 mt-1.5" />
                        <span>Preview agen akan aktif setelah dibuat</span>
                    </li>
                </ul>

                <button
                    onClick={onCreateClick}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-transform active:scale-95 duration-200",
                        "bg-[#FDFDFD] text-gray-800",
                        "cursor-pointer",
                        // Claymorphism: Inner Highlight + Drop Shadow
                        "shadow-[inset_2px_2px_4px_rgba(255,255,255,1),inset_-2px_-2px_4px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.2)]",
                        "hover:shadow-[inset_2px_2px_6px_rgba(255,255,255,1),inset_-2px_-2px_6px_rgba(0,0,0,0.05),0_6px_14px_rgba(0,0,0,0.25)]"
                    )}
                >
                    <Plus className="w-5 h-5 text-gray-900" />
                    <span>Buat Agent Baru</span>
                </button>
            </div>
        </div>
    );
}
