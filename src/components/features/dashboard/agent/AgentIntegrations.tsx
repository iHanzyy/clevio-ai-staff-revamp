"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import WhatsAppModal from "./WhatsAppModal";
import { Agent } from "@/services/agentService";
import { whatsappService } from "@/services/whatsappService";

export default function AgentIntegrations({ selectedAgent }: { selectedAgent: Agent | null }) {
    const [isWAModalOpen, setIsWAModalOpen] = useState(false);
    const [waStatus, setWaStatus] = useState<"active" | "inactive">("inactive");

    const fetchStatus = async () => {
        if (!selectedAgent) return;
        try {
            const res = await whatsappService.getSessionDetail(selectedAgent.id);
            const status = res?.data?.session?.status;
            if (status === "connected") {
                setWaStatus("active");
            } else {
                setWaStatus("inactive");
            }
        } catch (error) {
            setWaStatus("inactive");
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [selectedAgent]);

    return (
        <div className={cn(
            "w-full px-6 py-6 rounded-[1rem] h-full", // h-full
            "bg-[#FDFDFD]",
            "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
        )}>
            <h3 className="text-gray-900 font-bold text-lg mb-1">Integrasi Agent</h3>
            <div className="grid grid-cols-2 gap-4">
                <IntegrationCard
                    src="/iconWhatsapp.svg"
                    label="WhatsApp"
                    status={waStatus}
                    onClick={() => {
                        if (selectedAgent) setIsWAModalOpen(true);
                    }}
                />
                <IntegrationCard src="/iconTelegram.svg" label="Telegram" status="coming_soon" />
                <IntegrationCard src="/iconInstagram.svg" label="Instagram" status="coming_soon" />
                <IntegrationCard src="/iconEmbed.svg" label="Embed" status="inactive" />
            </div>

            {selectedAgent && (
                <WhatsAppModal
                    isOpen={isWAModalOpen}
                    onClose={() => {
                        setIsWAModalOpen(false);
                        fetchStatus(); // Refresh on close as fallback
                    }}
                    agentId={selectedAgent.id}
                    agentName={selectedAgent.name}
                    onStatusChange={fetchStatus}
                />
            )}
        </div>
    );
}

type IntegrationStatus = "active" | "inactive" | "coming_soon";

function IntegrationCard({ src, label, status, onClick }: { src: string, label: string, status: IntegrationStatus, onClick?: () => void }) {
    const statusConfig = {
        active: { text: "Active", className: "bg-green-100 text-green-700" },
        inactive: { text: "Not Active", className: "bg-gray-200 text-gray-500" },
        coming_soon: { text: "Coming Soon", className: "bg-blue-100 text-blue-600" }
    };

    const currentStatus = statusConfig[status];

    return (
        <div
            onClick={status !== "coming_soon" ? onClick : undefined}
            className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100",
                status !== "coming_soon" && onClick && "cursor-pointer hover:bg-gray-100 hover:scale-[1.02] transition-all active:scale-[0.98]"
            )}
        >
            <div className="relative w-12 h-12">
                <Image src={src} alt={label} fill className="object-contain" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-gray-900 text-sm">{label}</span>
                <span className={cn(
                    "px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    currentStatus.className
                )}>
                    {currentStatus.text}
                </span>
            </div>
        </div>
    );
}
