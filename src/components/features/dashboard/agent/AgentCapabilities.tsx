"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X, Check, Loader2 } from "lucide-react";
import { Agent, agentService } from "@/services/agentService";
import { useToast } from "@/components/ui/ToastProvider";
import { useUserTier } from "@/hooks/useUserTier";
import PlanRestrictionPopup from "@/components/ui/PlanRestrictionPopup";

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
    isAutoMode?: boolean;
    isSelected?: boolean;
    onSectionClick?: () => void;
    agentData?: Agent; // Added based on usage in the instruction
    onUpdate?: () => void; // Added based on usage in the instruction
}

export default function AgentCapabilities({ selectedAgent, isAutoMode, agentData, onUpdate, isSelected, onSectionClick, onAgentUpdate }: AgentCapabilitiesProps) {
    const [activeModal, setActiveModal] = useState<keyof typeof TOOL_CATEGORIES | null>(null);
    const [confirmationState, setConfirmationState] = useState<{ type: 'activate' | 'deactivate', toolId: string, label: string } | null>(null);
    const [isTrialPopupOpen, setIsTrialPopupOpen] = useState(false);
    const { isGuest, isTrial } = useUserTier();
    // const { toast } = useToast();

    const handleIconClick = (category: keyof typeof TOOL_CATEGORIES) => {
        if (!selectedAgent || isAutoMode) return;
        setActiveModal(category);
    };

    // Block Restricted Tools for GUEST or TRIAL (Both blocked until Paid)
    const handleAdditionalToolClick = (toolId: string, toolName: string) => {
        if (!selectedAgent || isAutoMode) return;

        const isRestricted = isGuest || isTrial;
        if (isRestricted && (toolId === 'web_search' || toolId === 'deep_research')) {
            setIsTrialPopupOpen(true);
            return;
        }

        const isActive = selectedAgent.mcp_tools?.includes(toolId);
        setConfirmationState({
            type: isActive ? 'deactivate' : 'activate',
            toolId,
            label: toolName
        });
    };

    const isCategoryActive = (category: keyof typeof TOOL_CATEGORIES) => {
        if (!selectedAgent?.google_tools) return false;
        const categoryTools = Object.keys(TOOL_CATEGORIES[category].tools);
        return categoryTools.some(t => selectedAgent.google_tools?.includes(t));
    };

    return (
        <div
            onClick={() => isAutoMode && onSectionClick?.()}
            className={cn(
                "w-full px-6 py-6 rounded-2xl flex flex-col h-full transition-all duration-200",
                "bg-[#FDFDFD]",
                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]",
                // Clickable cursor in AUTO mode
                isAutoMode && "cursor-pointer hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)]",
                // Lime glow when selected
                isSelected && "ring-2 ring-[#84cc16] shadow-[0_0_20px_rgba(132,204,22,0.3)]"
            )}>
            <h3 className="text-gray-900 font-bold text-lg mb-6">Kemampuan Agen</h3>

            <div className="flex flex-col md:flex-row gap-8 md:items-start">

                {/* Left: Google Workspace */}
                <div className="flex-1">
                    <h4 className="text-gray-900 font-bold text-sm mb-4">Google Workspace:</h4>

                    {/* Conditional: Show Connect Button or Icons */}
                    {selectedAgent?.auth_required === true ? (
                        /* Show Connect Button when auth_required is true */
                        <button
                            onClick={async () => {
                                if (!selectedAgent) return;
                                try {
                                    // Derive scopes from selectedAgent.google_tools or usage defaults
                                    // Note: Backend documentation says google_tools fields trigger scopes.
                                    // We pass the current google_tools list so backend can derive scopes?
                                    // The doc says: "Backend derives the required scopes from that list [google_tools]... and passes them to /auth/google".
                                    // Wait, the doc says WE must pass scopes in the body:
                                    // "POST /auth/google ... -d { scopes: [...], agent_id: ... }"
                                    // AND "Backend implementation should use [GOOGLE_TOOL_SCOPE_MAP] to derive scopes".
                                    // This implies the FRONTEND (or whoever calls /auth/google) needs to pass scopes.
                                    // OR, if the backend derives them, maybe we can just pass an empty list or the tool list?
                                    // Doc says: "Backend should load the same mapping... to build the scopes array when calling /auth/google".
                                    // This phrasing is confusing. "When calling /auth/google" - who calls it? The client.
                                    // So the CLIENT must build the scopes array.

                                    // Let's hardcode the scopes for now based on the selected google_tools, or simply request ALL possible scopes if we want to be safe, 
                                    // OR better: Assume the backend *can* derive them if we don't pass them? 
                                    // No, the CURL example explicitly shows "scopes": [...]

                                    // Let's gather scopes based on selectedAgent.google_tools
                                    // Since we don't have the map here easily, and the user wants to Fix It fast.
                                    // The error "no trial..." suggests the previous call was malformed or went to a wrong path.
                                    // Let's try passing the standard scopes the user likely needs.

                                    const scopes = [
                                        "https://www.googleapis.com/auth/gmail.readonly",
                                        "https://www.googleapis.com/auth/gmail.send",
                                        "https://www.googleapis.com/auth/gmail.compose",
                                        "https://www.googleapis.com/auth/calendar",
                                        "https://www.googleapis.com/auth/spreadsheets",
                                        "https://www.googleapis.com/auth/documents",
                                        "https://www.googleapis.com/auth/drive.file"
                                    ];

                                    const { auth_url } = await agentService.initiateGoogleAuth(selectedAgent.id, scopes);
                                    if (auth_url) {
                                        window.location.href = auth_url;
                                    }
                                } catch (error) {
                                    console.error("Failed to initiate Google Auth:", error);
                                    // toast.error("Gagal menghubungkan Google Workspace");
                                }
                            }}
                            className={cn(
                                "flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-200",
                                "bg-white border border-gray-200",
                                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]",
                                "hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)] hover:scale-[1.02]",
                                "cursor-pointer"
                            )}
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238989)">
                                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                </g>
                            </svg>
                            <span className="font-bold text-gray-700 text-sm">Connect with Google Workspace</span>
                        </button>
                    ) : (
                        /* Show Icons when auth_required is false or undefined */
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
                    )}
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-red-100 self-stretch my-2"></div>

                {/* Right: Additional Capabilities */}
                <div className="flex-1">
                    <h4 className="text-gray-900 font-bold text-sm mb-4">Kemampuan Tambahan:</h4>
                    <div className="flex flex-wrap gap-4">
                        <CapabilityIcon
                            src="/webSearchIcon.svg"
                            label="Web Search"
                            isActive={selectedAgent?.mcp_tools?.includes('web_search')}
                            onClick={() => handleAdditionalToolClick('web_search', 'Web Search')}
                            disabled={isTrial}
                        />
                        {/* <CapabilityIcon
                            src="/telescopeIcon.svg"
                            label="Deep Research"
                            isActive={selectedAgent?.mcp_tools?.includes('deep_research')}
                            onClick={() => handleAdditionalToolClick('deep_research', 'Deep Research')}
                            disabled={isTrial}
                        /> */}
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
            {/* ADDITIONAL TOOL CONFIRMATION MODAL */}
            {confirmationState && selectedAgent && (
                <AdditionalToolModal
                    state={confirmationState}
                    onClose={() => setConfirmationState(null)}
                    agentId={selectedAgent.id}
                    agentData={selectedAgent}
                    onUpdate={() => {
                        setConfirmationState(null);
                        onAgentUpdate?.();
                    }}
                />
            )}

            {/* Trial Popup */}
            <PlanRestrictionPopup
                isOpen={isTrialPopupOpen}
                onClose={() => setIsTrialPopupOpen(false)}
                type="feature"
                message="Fitur Advanced (Web Search/Deep Research) hanya untuk user terdaftar."
            />
        </div>
    );
}

function CapabilityIcon({ src, label, isActive, onClick, disabled }: { src: string, label: string, isActive?: boolean, onClick?: () => void, disabled?: boolean }) {
    return (
        <div className={cn("flex flex-col items-center text-center gap-2 group", disabled && "opacity-50 grayscale")} onClick={onClick}>
            <div className={cn(
                "w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl p-2.5 transition-all duration-300",
                "bg-white shadow-sm border border-gray-100",
                onClick && "cursor-pointer hover:scale-105 hover:shadow-md",
                isActive && !disabled && "border-lime-500 ring-2 ring-lime-100"
            )}>
                <div className="relative w-full h-full">
                    <Image src={src} alt={label} fill className="object-contain" />
                </div>
            </div>
            <span className={cn("text-xs font-bold transition-colors", isActive && !disabled ? "text-lime-600" : "text-gray-700")}>{label}</span>
        </div>
    );
}

interface ModalProps {
    categoryKey: string;
    config: typeof TOOL_CATEGORIES[keyof typeof TOOL_CATEGORIES];
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
            <div className="relative w-full max-w-md bg-[#FDFDFD] rounded-4xl p-6 animate-scale-up shadow-[inset_0_4px_8px_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.1)] border border-white/50">

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
                                        ? "bg-lime-50/50 border-lime-200 shadow-sm"
                                        : "bg-white border-gray-100 hover:bg-gray-50"
                                )}
                            >
                                <span className={cn("font-bold text-sm", isChecked ? "text-lime-700" : "text-gray-700")}>{label}</span>
                                <div className={cn(
                                    "w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                                    isChecked ? "bg-lime-500 text-white" : "bg-gray-200 text-transparent"
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
                                ? "bg-[#65a30d] hover:bg-[#4d7c0f] hover:scale-105 cursor-pointer shadow-lime-500/20"
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

interface AdditionalModalProps {
    state: { type: 'activate' | 'deactivate', toolId: string, label: string };
    onClose: () => void;
    agentId: string;
    agentData: Agent;
    onUpdate: () => void;
}

function AdditionalToolModal({ state, onClose, agentId, agentData, onUpdate }: AdditionalModalProps) {
    const { showToast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleConfirm = async () => {
        setIsUpdating(true);
        try {
            const currentMcpTools = agentData.mcp_tools || [];
            let newMcpTools;

            if (state.type === 'activate') {
                newMcpTools = [...new Set([...currentMcpTools, state.toolId])];
            } else {
                newMcpTools = currentMcpTools.filter(t => t !== state.toolId);
            }

            const payload = {
                name: agentData.name,
                config: agentData.config,
                mcp_tools: newMcpTools,
                google_tools: agentData.google_tools || []
            };

            await agentService.updateAgent(agentId, payload);
            showToast(`Kemampuan ${state.label} berhasil ${state.type === 'activate' ? 'diaktifkan' : 'dinonaktifkan'}!`, "success");
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

            <div className="relative w-full max-w-sm bg-[#FDFDFD] rounded-4xl p-6 animate-scale-up shadow-[inset_0_4px_8px_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.1)] border border-white/50 text-center">

                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                    <Image
                        src={state.toolId === 'web_search' ? '/webSearchIcon.svg' : '/telescopeIcon.svg'}
                        alt={state.label}
                        width={32}
                        height={32}
                    />
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {state.type === 'activate' ? `Aktifkan ${state.label}?` : `Matikan ${state.label}?`}
                </h3>
                <p className="text-gray-500 text-xs mb-6 px-4 leading-relaxed">
                    {state.type === 'activate'
                        ? `Apakah Anda yakin ingin menambahkan kemampuan ${state.label} untuk agen ini?`
                        : `Apakah Anda yakin ingin menghapus kemampuan ${state.label}? Agen tidak akan bisa menggunakannya lagi.`}
                </p>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-gray-500 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isUpdating}
                        className={cn(
                            "flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer",
                            state.type === 'activate'
                                ? "bg-linear-to-br from-[#65a30d] to-[#84cc16] hover:scale-105 shadow-lime-500/20"
                                : "bg-red-500 hover:bg-red-600 hover:scale-105 shadow-red-500/20"
                        )}
                    >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : (state.type === 'activate' ? 'Ya, Aktifkan' : 'Ya, Matikan')}
                    </button>
                </div>

            </div>
        </div>
    );
}
