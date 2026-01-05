"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AgentCapabilities() {
    return (
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
    );
}

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
