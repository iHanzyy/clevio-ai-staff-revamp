"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Agent, agentService } from "@/services/agentService";
import { Pencil, Copy, Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface AgentTaskProps {
    selectedAgent: Agent | null;
    onAgentUpdate?: () => void;
    isAutoMode?: boolean;
    isSelected?: boolean;
    onSectionClick?: () => void;
}

export default function AgentTask({ selectedAgent, onAgentUpdate, isAutoMode = false, isSelected = false, onSectionClick }: AgentTaskProps) {
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { showToast } = useToast();

    const systemPrompt = selectedAgent?.config?.system_prompt || "Agent ini belum memiliki instruksi tugas (System Prompt).";
    const hasPrompt = !!selectedAgent?.config?.system_prompt;
    const isTruncated = systemPrompt.length > 150;

    const handleCopy = async () => {
        if (!systemPrompt) return;
        try {
            await navigator.clipboard.writeText(systemPrompt);
            showToast("Tugas berhasil disalin ke clipboard!", "success");
        } catch (err) {
            showToast("Gagal menyalin teks.", "error");
        }
    };

    return (
        <>
            <div
                onClick={() => isAutoMode && onSectionClick?.()}
                className={cn(
                    "w-full px-6 py-6 rounded-2xl transition-all duration-200",
                    "bg-[#FDFDFD]",
                    "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]",
                    // Clickable cursor in AUTO mode
                    isAutoMode && "cursor-pointer hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)]",
                    // Lime glow when selected
                    isSelected && "ring-2 ring-[#84cc16] shadow-[0_0_20px_rgba(132,204,22,0.3)]"
                )}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-900 font-bold text-lg">Tugas Agen</h3>
                    <div className="flex items-center gap-2">
                        {/* Copy Button */}
                        <button
                            onClick={handleCopy}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-lime-600 hover:border-lime-200 transition-colors shadow-sm cursor-pointer"
                            title="Salin Tugas"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        {/* Edit Button */}
                        {!isAutoMode && (
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-lime-600 hover:border-lime-200 transition-colors shadow-sm cursor-pointer"
                                title="Edit Tugas"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <p className={cn("text-gray-600 text-sm leading-relaxed", isTruncated && "line-clamp-3")}>
                    {systemPrompt}
                </p>
                {isTruncated && (
                    <button
                        onClick={() => setIsPromptModalOpen(true)}
                        className="mt-2 text-[#2A2E37] font-bold text-sm hover:underline cursor-pointer"
                    >
                        Baca Selengkapnya...
                    </button>
                )}
            </div>

            {/* Read More Modal (Standard) */}
            {isPromptModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPromptModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Tugas Agen</h3>
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

            {/* Edit Modal (Claymorphism) */}
            {isEditModalOpen && selectedAgent && (
                <EditTaskModal
                    initialPrompt={selectedAgent.config?.system_prompt || ""}
                    onClose={() => setIsEditModalOpen(false)}
                    agentId={selectedAgent.id}
                    agentData={selectedAgent}
                    onUpdate={onAgentUpdate}
                />
            )}
        </>
    );
}

interface EditModalProps {
    initialPrompt: string;
    onClose: () => void;
    agentId: string;
    agentData: Agent;
    onUpdate?: () => void;
}


function EditTaskModal({ initialPrompt, onClose, agentId, agentData, onUpdate }: EditModalProps) {
    const { showToast } = useToast();
    const [prompt, setPrompt] = useState(initialPrompt);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const hasChanges = prompt !== initialPrompt;

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            const payload = {
                name: agentData.name,
                config: {
                    ...agentData.config,
                    system_prompt: prompt
                },
                mcp_tools: agentData.mcp_tools || [],
                google_tools: agentData.google_tools || []
            };

            await agentService.updateAgent(agentId, payload);
            showToast("Tugas agen berhasil diperbarui!", "success");
            onUpdate?.();
            onClose();
        } catch (error) {
            console.error(error);
            showToast("Gagal memperbarui tugas agen.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Claymorphism Modal */}
            <div className="relative w-full max-w-2xl bg-[#FDFDFD] rounded-4xl p-6 animate-scale-up shadow-[inset_0_4px_8px_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.1)] border border-white/50">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Edit Tugas Agen</h3>
                        <p className="text-gray-500 text-xs mt-0.5">Ubah instruksi utama agen Anda.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-red-500 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full h-[40vh] p-4 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/50 resize-none shadow-inner leading-relaxed"
                        placeholder="Masukkan instruksi tugas agen..."
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-500 font-bold text-sm hover:text-gray-700 transition-colors cursor-pointer bg-gray-100 rounded-xl"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={!hasChanges || isUpdating}
                        className={cn(
                            "px-6 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all shadow-lg",
                            hasChanges && !isUpdating
                                ? "bg-linear-to-br from-[#65a30d] to-[#84cc16] hover:scale-105 cursor-pointer shadow-lime-500/20"
                                : "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                        )}
                    >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Simpan Perubahan
                    </button>
                </div>

                {/* Confirmation Overlay */}
                {showConfirm && (
                    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-4xl flex items-center justify-center p-4 animate-fade-in">
                        <div className="w-full max-w-sm text-center">

                            {/* Icon Container - Matching AdditionalToolModal */}
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                <span className="text-3xl">⚠️</span>
                            </div>

                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                                Simpan Perubahan?
                            </h3>
                            <p className="text-gray-500 text-xs mb-6 px-4 leading-relaxed">
                                Apakah Anda yakin ingin memperbarui tugas agen ini? Perubahan akan langsung diterapkan pada perilaku agen.
                            </p>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-3 text-gray-500 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isUpdating}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer",
                                        "bg-linear-to-br from-[#65a30d] to-[#84cc16] hover:scale-105 shadow-lime-500/20"
                                    )}
                                >
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Simpan"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
