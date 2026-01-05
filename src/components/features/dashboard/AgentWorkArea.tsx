"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// --- DUMMY DATA ---

const SYSTEM_PROMPT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const KNOWLEDGE_FILES = [
    { id: 1, title: "Tite teatu:m 1", desc: "Sesourest descriptions bant yurmili sepantum.", date: "DD MMM YYYY" },
    { id: 2, title: "Penetarrum 2", desc: "Resouresi descriptions bant yurmili sepantum.", date: "DD MMM YYYY" },
    { id: 3, title: "Penetarrum 3", desc: "Resouresi descriptions bant yurmili sepantum.", date: "DD MMM YYYY" },
    // Hidden by default if > 3
    { id: 4, title: "Hidden File 4", desc: "This file is hidden by default.", date: "DD MMM YYYY" },
    { id: 5, title: "Hidden File 5", desc: "This file is hidden by default.", date: "DD MMM YYYY" },
];

export default function AgentWorkArea() {
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Filter visible files (Top 3)
    const visibleFiles = KNOWLEDGE_FILES.slice(0, 3);
    const hasMoreFiles = KNOWLEDGE_FILES.length > 3;

    return (
        <div className="flex flex-col gap-6 h-full font-sans overflow-y-auto scrollbar-hide pb-5">

            {/* 1. AGENT SELECTOR CARD */}
            <div className={cn(
                "w-full px-6 py-4 rounded-[1rem]",
                "bg-[#FDFDFD]", // White Clay
                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
            )}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-gray-900 font-bold text-lg">Pilih Agen</label>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={cn(
                                    "flex items-center justify-between w-full md:w-64 px-4 py-2.5 rounded-xl text-left",
                                    "bg-white border border-gray-200 text-gray-900 font-bold", // Active: Bold Dark
                                    "shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
                                )}
                            >
                                <span>Asdos Bot</span>
                                <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                            </button>

                            {/* Dropdown Menu (Click-based) */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-fade-in-up">
                                    <div
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="px-4 py-2 text-sm text-gray-900 font-bold bg-gray-50 rounded-lg cursor-pointer flex justify-between items-center"
                                    >
                                        Asdos Bot
                                        <div className="w-2 h-2 rounded-full bg-[#2A2E37]"></div>
                                    </div>
                                    <div
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                                    >
                                        Marketing Agent
                                    </div>
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
                    </div>
                    <div className="text-right text-sm font-semibold text-gray-900">
                        Sisa token chat Agent: <span className="text-gray-900">200 Pesan</span>
                    </div>
                </div>
            </div>

            {/* 2. SYSTEM PROMPT (TUGAS AGEN) */}
            <div className={cn(
                "w-full px-6 py-6 rounded-[1rem]",
                "bg-[#FDFDFD]",
                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
            )}>
                <h3 className="text-gray-900 font-bold text-lg mb-3">Tugas Agen</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {SYSTEM_PROMPT}
                </p>
                <button
                    onClick={() => setIsPromptModalOpen(true)}
                    className="mt-2 text-[#2A2E37] font-bold text-sm hover:underline cursor-pointer"
                >
                    Baca Selengkapnya...
                </button>
            </div>

            {/* 3. CAPABILITIES (KEMAMPUAN AGEN) */}
            <div className={cn(
                "w-full px-6 py-6 rounded-[1rem]",
                "bg-[#FDFDFD]",
                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
            )}>
                <h3 className="text-gray-900 font-bold text-lg mb-6">Kemampuan Agen</h3>

                <div className="flex flex-col md:flex-row gap-8 md:items-start">

                    {/* Left: Google Workspace */}
                    <div className="flex-1">
                        <h4 className="text-gray-900 font-bold text-sm mb-4">Google Workspace:</h4>
                        <div className="flex flex-wrap gap-4">
                            <CapabilityIcon src="/gmaiLicon.svg" label="Gmail" />
                            <CapabilityIcon src="/GoogleSheetIcon.svg" label="Sheets" />
                            <CapabilityIcon src="/GoogleDocsIcon.svg" label="Docs" />
                            <CapabilityIcon src="/GoogleCalendarIcon.svg" label="Calendar" />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px bg-red-100 self-stretch my-2"></div>

                    {/* Right: Additional Capabilities */}
                    <div className="flex-1">
                        <h4 className="text-gray-900 font-bold text-sm mb-4">Kemampuan Tambahan:</h4>
                        <div className="flex flex-wrap gap-4">
                            <CapabilityIcon src="/webSearchIcon.svg" label="Web Search" />
                            <CapabilityIcon src="/telescopeIcon.svg" label="Deep Research" />
                        </div>
                    </div>

                </div>
            </div>

            {/* 4. GRID: KNOWLEDGE & INTEGRATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">

                {/* 4A. KNOWLEDGE BASE (PENGETAHUAN AGEN) */}
                <div className={cn(
                    "w-full px-6 py-6 rounded-[1rem] flex flex-col h-full", // Flex col + h-full
                    "bg-[#FDFDFD]",
                    "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
                )}>
                    <h3 className="text-gray-900 font-bold text-lg mb-4">Pengetahuan Agen</h3>
                    <div className="flex flex-col gap-4 flex-1">
                        {visibleFiles.map((file) => (
                            <div key={file.id} className="flex items-start justify-between pb-3 border-b border-gray-100">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{file.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-1">{file.desc}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Ditambahkan: {file.date}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {hasMoreFiles && (
                        <button
                            onClick={() => setIsFilesModalOpen(true)}
                            className="w-full mt-4 text-center text-[#2A2E37] font-bold text-sm hover:underline cursor-pointer"
                        >
                            Buka lebih banyak..
                        </button>
                    )}
                </div>

                {/* 4B. INTEGRATIONS (INTEGRASI AGENT) */}
                <div className={cn(
                    "w-full px-6 py-6 rounded-[1rem] h-full", // h-full
                    "bg-[#FDFDFD]",
                    "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
                )}>
                    <h3 className="text-gray-900 font-bold text-lg mb-1">Integrasi Agent</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <IntegrationCard src="/iconWhatsapp.svg" label="WhatsApp" isActive={true} />
                        <IntegrationCard src="/iconTelegram.svg" label="Telegram" isActive={false} />
                        <IntegrationCard src="/iconInstagram.svg" label="Instagram" isActive={false} />
                        <IntegrationCard src="/iconEmbed.svg" label="Embed" isActive={true} />
                    </div>
                </div>

            </div>


            {/* --- MODALS --- */}

            {/* Prompt Modal */}
            {isPromptModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPromptModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">System Prompt</h3>
                        <div className="max-h-[60vh] overflow-y-auto text-gray-700 leading-relaxed text-sm p-4 bg-gray-50 rounded-xl">
                            {SYSTEM_PROMPT}
                            <br /><br />
                            {SYSTEM_PROMPT}
                            <br /><br />
                            (Dummy Extended Content)
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

            {/* Files Modal */}
            {isFilesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilesModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Knowledge Base Files</h3>
                        <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-4">
                            {KNOWLEDGE_FILES.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <FileText className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{file.title}</h4>
                                            <p className="text-xs text-gray-500">{file.desc}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Ditambahkan: {file.date}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setIsFilesModalOpen(false)}
                                className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

// --- SUB COMPONENTS ---

function CapabilityIcon({ src, label, subLabel }: { src: string, label: string, subLabel?: string }) {
    return (
        <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-2.5 transition-transform hover:scale-105">
                <div className="relative w-full h-full">
                    <Image src={src} alt={label} fill className="object-contain" />
                </div>
            </div>
            <span className="text-xs font-bold text-gray-700">{label}</span>
            {subLabel && <span className="text-[10px] font-medium text-gray-400 -mt-1">{subLabel}</span>}
        </div>
    );
}

function IntegrationCard({ src, label, isActive }: { src: string, label: string, isActive: boolean }) {
    return (
        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="relative w-12 h-12">
                <Image src={src} alt={label} fill className="object-contain" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-gray-900 text-sm">{label}</span>
                <span className={cn(
                    "px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                )}>
                    {isActive ? "Active" : "Not Active"}
                </span>
            </div>
        </div>
    );
}
