"use client";

import React, { useState } from "react";
import { ChevronDown, Pencil, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent, agentService } from "@/services/agentService";
import { useToast } from "@/components/ui/ToastProvider";

interface AgentSelectorProps {
    agents: Agent[];
    selectedAgent: Agent | null;
    onSelectAgent: (agent: Agent) => void;
    onAgentUpdate?: () => void;
}

export default function AgentSelector({ agents, selectedAgent, onSelectAgent, onAgentUpdate }: AgentSelectorProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className={cn(
                "w-full px-6 py-4 rounded-[1rem]",
                "bg-[#FDFDFD]", // White Clay
                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
            )}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-gray-900 font-bold text-lg">Pilih Agen</label>
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={cn(
                                        "flex items-center justify-between w-full md:w-64 px-4 py-2.5 rounded-xl text-left",
                                        "bg-white border border-gray-200 text-gray-900 font-bold", // Active: Bold Dark
                                        "shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
                                    )}
                                >
                                    <span>{selectedAgent?.name || "Pilih Agent"}</span>
                                    <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                                </button>

                                {/* Dropdown Menu (Click-based) */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-fade-in-up max-h-60 overflow-y-auto">
                                        {agents.map((agent) => (
                                            <div
                                                key={agent.id}
                                                onClick={() => {
                                                    onSelectAgent(agent);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="px-4 py-2 text-sm text-gray-900 font-bold hover:bg-gray-50 rounded-lg cursor-pointer flex justify-between items-center"
                                            >
                                                {agent.name}
                                                {selectedAgent?.id === agent.id && (
                                                    <div className="w-2 h-2 rounded-full bg-[#2A2E37]"></div>
                                                )}
                                            </div>
                                        ))}

                                        <div className="h-px bg-gray-100 my-1"></div>
                                        <div
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="px-4 py-2 text-sm text-[#2A2E37] font-bold hover:bg-gray-50 rounded-lg cursor-pointer flex items-center gap-2"
                                        >
                                            + Buat Agent Baru
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Edit Name Button */}
                            {selectedAgent && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-10 h-[46px] flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-lime-600 hover:border-lime-200 transition-colors shadow-sm cursor-pointer"
                                    title="Edit Nama Agen"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="text-right text-sm font-semibold text-gray-900">
                        Sisa token chat Agent: <span className="text-gray-900">200 Pesan</span>
                    </div>
                </div>
            </div>

            {/* Edit Name Modal */}
            {isEditModalOpen && selectedAgent && (
                <EditNameModal
                    initialName={selectedAgent.name}
                    onClose={() => setIsEditModalOpen(false)}
                    agentId={selectedAgent.id}
                    agentData={selectedAgent}
                    onUpdate={onAgentUpdate}
                />
            )}
        </>
    );
}

interface EditNameModalProps {
    initialName: string;
    onClose: () => void;
    agentId: string;
    agentData: Agent;
    onUpdate?: () => void;
}


function EditNameModal({ initialName, onClose, agentId, agentData, onUpdate }: EditNameModalProps) {
    const { showToast } = useToast();
    const [name, setName] = useState(initialName);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const hasChanges = name !== initialName && name.trim().length > 0;

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            const payload = {
                name: name,
                config: agentData.config,
                mcp_tools: agentData.mcp_tools || [],
                google_tools: agentData.google_tools || []
            };

            await agentService.updateAgent(agentId, payload);
            showToast("Nama agen berhasil diperbarui!", "success");
            onUpdate?.();
            onClose();
        } catch (error) {
            console.error(error);
            showToast("Gagal memperbarui nama agen.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Claymorphism Modal */}
            <div className="relative w-full max-w-lg bg-[#FDFDFD] rounded-[2rem] p-6 animate-scale-up shadow-[inset_0_4px_8px_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.1)] border border-white/50">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Edit Nama Agen</h3>
                        <p className="text-gray-500 text-xs mt-0.5">Ubah nama identitas agen Anda.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-red-500 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-500/50 shadow-inner"
                        placeholder="Masukkan nama agen..."
                        autoFocus
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
                                ? "bg-gradient-to-br from-[#65a30d] to-[#84cc16] hover:scale-105 cursor-pointer shadow-lime-500/20"
                                : "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                        )}
                    >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Simpan Perubahan
                    </button>
                </div>

                {/* Confirmation Overlay */}
                {showConfirm && (
                    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-[2rem] flex items-center justify-center p-4 animate-fade-in">
                        <div className="w-full max-w-sm text-center">

                            {/* Icon Container - Matching AdditionalToolModal */}
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                <span className="text-3xl">⚠️</span>
                            </div>

                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                                Simpan Perubahan?
                            </h3>
                            <p className="text-gray-500 text-xs mb-6 px-4 leading-relaxed">
                                Apakah Anda yakin ingin mengubah nama agen ini? Identitas agen akan diperbarui di seluruh sistem.
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
                                        "bg-gradient-to-br from-[#65a30d] to-[#84cc16] hover:scale-105 shadow-lime-500/20"
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
