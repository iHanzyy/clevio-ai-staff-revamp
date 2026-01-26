"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent, agentService } from "@/services/agentService";
import AddOnsTabs from "@/components/features/addons/AddOnsTabs";
import CapabilitiesSection from "@/components/features/addons/CapabilitiesSection";

import HistorySection from "@/components/features/addons/HistorySection";
import MessageLimitSection from "@/components/features/addons/MessageLimitSection";
import AgentSlotSection from "@/components/features/addons/AgentSlotSection";

type TabType = 'kemampuan-tambahan' | 'limit-pesan' | 'slot-agent' | 'riwayat';

export default function AddOnsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('kemampuan-tambahan');
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch agents on mount
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const fetchedAgents = await agentService.getAgents();
                setAgents(fetchedAgents);
                if (fetchedAgents.length > 0) {
                    setSelectedAgent(fetchedAgents[0]);
                }
            } catch (error) {
                console.error("Failed to fetch agents", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'kemampuan-tambahan':
                return (
                    <CapabilitiesSection
                        agents={agents}
                        selectedAgent={selectedAgent}
                        onSelectAgent={setSelectedAgent}
                    />
                );
            case 'limit-pesan':
                return (
                    <MessageLimitSection
                        agents={agents}
                        selectedAgent={selectedAgent}
                        onSelectAgent={setSelectedAgent}
                    />
                );
            case 'slot-agent':
                return (
                    <AgentSlotSection
                        agents={agents}
                        selectedAgent={selectedAgent}
                        onSelectAgent={setSelectedAgent}
                    />
                );
            case 'riwayat':
                return <HistorySection />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-full p-6 md:px-12 md:py-8 overflow-y-auto">
            {/* Back to Dashboard Link - Compact */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm font-medium mb-2 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Dashboard
            </Link>

            {/* Page Title - Compact margin */}
            <h1 className="text-white font-bold text-3xl md:text-4xl mb-6">
                Add-Ons
            </h1>

            {/* Tabs Navigation - Compact margin */}
            <AddOnsTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content - Reduced top margin */}
            <div className="mt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    renderTabContent()
                )}
            </div>
        </div>
    );
}
