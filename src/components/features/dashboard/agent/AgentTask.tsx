"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Agent } from "@/services/agentService";

interface AgentTaskProps {
    selectedAgent: Agent | null;
}

export default function AgentTask({ selectedAgent }: AgentTaskProps) {
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

    const systemPrompt = selectedAgent?.config?.system_prompt || "Agent ini belum memiliki instruksi tugas (System Prompt).";
    const hasPrompt = !!selectedAgent?.config?.system_prompt;

    return (
        <>
            <div className={cn(
                "w-full px-6 py-6 rounded-[1rem]",
                "bg-[#FDFDFD]",
                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
            )}>
                <h3 className="text-gray-900 font-bold text-lg mb-3">Tugas Agen</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {systemPrompt}
                </p>
                <button
                    onClick={() => setIsPromptModalOpen(true)}
                    className="mt-2 text-[#2A2E37] font-bold text-sm hover:underline cursor-pointer"
                >
                    Baca Selengkapnya...
                </button>
            </div>

            {/* Prompt Modal */}
            {isPromptModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPromptModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">System Prompt</h3>
                        <div className="max-h-[60vh] overflow-y-auto text-gray-700 leading-relaxed text-sm p-4 bg-gray-50 rounded-xl whitespace-pre-wrap">
                            {systemPrompt}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setIsPromptModalOpen(false)}
                                className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
