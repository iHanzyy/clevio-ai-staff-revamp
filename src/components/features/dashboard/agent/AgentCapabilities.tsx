"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X, Check, Loader2 } from "lucide-react";
import { Agent, agentService } from "@/services/agentService";
import { useToast } from "@/components/ui/ToastProvider";

// Mapping Configuration
const TOOL_CATEGORIES = {
    "Gmail": {
        label: "Gmail",
        icon: "/gmaiLicon.svg",
        tools: {
            "gmail_list_messages": "Lihat Daftar Email",
            "gmail_get_message": "Baca Detail Email",
            "gmail_get_thread": "Baca Percakapan",
            "gmail_read_messages": "Baca Email (Batch)",
            "gmail_send_message": "Kirim Email",
            "gmail_create_draft": "Buat Draf Email"
        }
    },
    "Sheets": {
        label: "Google Sheets",
        icon: "/GoogleSheetIcon.svg",
        tools: {
            "google_sheets_list_spreadsheets": "Lihat Daftar Spreadsheet",
            "google_sheets_create_spreadsheet": "Buat Spreadsheet Baru",
            "google_sheets_get_values": "Baca Data Cell",
            "google_sheets_update_values": "Update Data Cell"
        }
    },
    "Docs": {
        label: "Google Docs",
        icon: "/GoogleDocsIcon.svg",
        tools: {
            "google_docs_list_documents": "Lihat Daftar Dokumen",
            "google_docs_get_document": "Baca Konten Dokumen",
            "google_docs_create_document": "Buat Dokumen Baru",
            "google_docs_append_text": "Tambah Teks ke Dokumen",
            "google_docs_update_text": "Edit Teks Dokumen",
            "google_docs_delete_document": "Hapus Dokumen"
        }
    },
    "Calendar": {
        label: "Google Calendar",
        icon: "/GoogleCalendarIcon.svg",
        tools: {
            "google_calendar_list_events": "Lihat Daftar Jadwal",
            "google_calendar_get_event": "Lihat Detail Jadwal",
            "google_calendar_create_event": "Buat Jadwal Baru"
        }
    }
};

interface AgentCapabilitiesProps {
    selectedAgent: Agent | null;
    onAgentUpdate?: () => void;
}

export default function AgentCapabilities({ selectedAgent, onAgentUpdate }: AgentCapabilitiesProps) {
    const [activeModal, setActiveModal] = useState<keyof typeof TOOL_CATEGORIES | null>(null);
    const { showToast } = useToast();

    const handleIconClick = (category: keyof typeof TOOL_CATEGORIES) => {
        if (!selectedAgent) return;
        setActiveModal(category);
    };

    const isCategoryActive = (category: keyof typeof TOOL_CATEGORIES) => {
        if (!selectedAgent?.google_tools) return false;
        const categoryTools = Object.keys(TOOL_CATEGORIES[category].tools);
        return categoryTools.some(t => selectedAgent.google_tools?.includes(t));
    };

    return (
        <div className={cn(
            "w-full px-6 py-6 rounded-[1rem] flex flex-col h-full",
            "bg-[#FDFDFD]",
            "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
        )}>
            <h3 className="text-gray-900 font-bold text-lg mb-6">Kemampuan Agen</h3>

            <div className="flex flex-col md:flex-row gap-8 md:items-start">

                {/* Left: Google Workspace */}
                <div className="flex-1">
                    <h4 className="text-gray-900 font-bold text-sm mb-4">Google Workspace:</h4>
                    <div className="flex flex-wrap gap-4">
                        {(Object.keys(TOOL_CATEGORIES) as Array<keyof typeof TOOL_CATEGORIES>).map((key) => (
                            <CapabilityIcon
                                key={key}
                                src={TOOL_CATEGORIES[key].icon}
                                label={key}
                                isActive={isCategoryActive(key)}
                                onClick={() => handleIconClick(key)}
                            />
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-red-100 self-stretch my-2"></div>

                {/* Right: Additional Capabilities */}
                <div className="flex-1">
                    <h4 className="text-gray-900 font-bold text-sm mb-4">Kemampuan Tambahan:</h4>
                    <div className="flex flex-wrap gap-4">
                        <CapabilityIcon src="/webSearchIcon.svg" label="Web Search" isActive={selectedAgent?.mcp_tools?.includes('web_search')} />
                        <CapabilityIcon src="/telescopeIcon.svg" label="Deep Research" isActive={selectedAgent?.mcp_tools?.includes('deep_research')} />
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {activeModal && selectedAgent && (
                <GoogleToolsModal
                    categoryKey={activeModal}
                    config={TOOL_CATEGORIES[activeModal]}
                    currentTools={selectedAgent.google_tools || []}
                    onClose={() => setActiveModal(null)}
                    agentId={selectedAgent.id}
                    agentData={selectedAgent}
                    onUpdate={() => {
                        setActiveModal(null);
                        onAgentUpdate?.();
                    }}
                />
            )}
        </div>
    );
}

function CapabilityIcon({ src, label, isActive, onClick }: { src: string, label: string, isActive?: boolean, onClick?: () => void }) {
    return (
        <div className="flex flex-col items-center text-center gap-2 group" onClick={onClick}>
            <div className={cn(
                "w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl p-2.5 transition-all duration-300",
                "bg-white shadow-sm border border-gray-100",
                onClick && "cursor-pointer hover:scale-105 hover:shadow-md",
                isActive && "border-blue-500 ring-2 ring-blue-100"
            )}>
                <div className="relative w-full h-full">
                    <Image src={src} alt={label} fill className="object-contain" />
                </div>
            </div>
            <span className={cn("text-xs font-bold transition-colors", isActive ? "text-blue-600" : "text-gray-700")}>{label}</span>
        </div>
    );
}

interface ModalProps {
    categoryKey: string;
    config: typeof TOOL_CATEGORIES["Gmail"];
    currentTools: string[];
    onClose: () => void;
    agentId: string;
    agentData: Agent;
    onUpdate: () => void;
}

function GoogleToolsModal({ categoryKey, config, currentTools, onClose, agentId, agentData, onUpdate }: ModalProps) {
    const { showToast } = useToast();
    const [selected, setSelected] = useState<string[]>(() => {
        // Initialize with currently active tools for this category
        return currentTools.filter(t => Object.keys(config.tools).includes(t));
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const categoryToolsKeys = Object.keys(config.tools);

    // Calc "Other" tools (preserve them)
    const otherTools = currentTools.filter(t => !categoryToolsKeys.includes(t));

    // Has Changes?
    const initialSelected = currentTools.filter(t => categoryToolsKeys.includes(t));
    const hasChanges =
        selected.length !== initialSelected.length ||
        !selected.every(s => initialSelected.includes(s));

    const toggleTool = (toolKey: string) => {
        setSelected(prev =>
            prev.includes(toolKey)
                ? prev.filter(k => k !== toolKey)
                : [...prev, toolKey]
        );
    };

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            const finalGoogleTools = [...otherTools, ...selected];

            const payload = {
                name: agentData.name,
                config: agentData.config,
                mcp_tools: agentData.mcp_tools || [],
                google_tools: finalGoogleTools
            };

            await agentService.updateAgent(agentId, payload);
            showToast("Kemampuan berhasil diperbarui!", "success");
            onUpdate();
        } catch (error) {
            console.error(error);
            showToast("Gagal memperbarui kemampuan.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Claymorphism Modal */}
            <div className="relative w-full max-w-md bg-[#FDFDFD] rounded-[2rem] p-6 animate-scale-up shadow-[inset_0_4px_8px_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.1)] border border-white/50">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                            <Image src={config.icon} alt={categoryKey} width={28} height={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{categoryKey} — Pilih Kemampuan</h3>
                            <p className="text-gray-500 text-xs mt-0.5">Pilih kemampuan yang boleh digunakan oleh agen.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-red-500 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List */}
                <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto scrollbar-hide mb-8 px-1">
                    {Object.entries(config.tools).map(([key, label]) => {
                        const isChecked = selected.includes(key);
                        return (
                            <div
                                key={key}
                                onClick={() => toggleTool(key)}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border",
                                    isChecked
                                        ? "bg-blue-50/50 border-blue-200 shadow-sm"
                                        : "bg-white border-gray-100 hover:bg-gray-50"
                                )}
                            >
                                <span className={cn("font-bold text-sm", isChecked ? "text-blue-700" : "text-gray-700")}>{label}</span>
                                <div className={cn(
                                    "w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                                    isChecked ? "bg-blue-500 text-white" : "bg-gray-200 text-transparent"
                                )}>
                                    <Check className="w-4 h-4" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-500 font-bold text-sm hover:text-gray-700 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={!hasChanges || isUpdating}
                        className={cn(
                            "px-6 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all shadow-lg",
                            hasChanges && !isUpdating
                                ? "bg-[#5080FF] hover:bg-[#3b66d6] hover:scale-105 cursor-pointer shadow-blue-500/20"
                                : "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                        )}
                    >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Perbarui Kemampuan
                    </button>
                </div>

            </div>
        </div>
    );
}
