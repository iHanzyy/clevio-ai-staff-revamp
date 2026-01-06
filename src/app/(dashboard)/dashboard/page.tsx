"use client";

import React, { useState } from "react";
import ArthurPhone from "@/components/features/dashboard/ArthurPhone";
import SimulatorPhone from "@/components/features/dashboard/SimulatorPhone";
import PreviewPhone from "@/components/features/dashboard/PreviewPhone";
import AgentWorkArea from "@/components/features/dashboard/AgentDetail";
import AgentEmptyState from "@/components/features/dashboard/AgentEmptyState";
import { useToast } from "@/components/ui/ToastProvider";

import { agentService, Agent } from "@/services/agentService";

export default function DashboardPage() {
    const [hasAgent, setHasAgent] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isArthurActive, setIsArthurActive] = useState(false);

    const { showToast } = useToast();

    // Fetch Agents on Mount
    const fetchAgents = async () => {
        try {
            const fetchedAgents = await agentService.getAgents();
            setAgents(fetchedAgents);
            if (fetchedAgents.length > 0) {
                setHasAgent(true);
                // Only set selected if none selected
                if (!selectedAgent) {
                    setSelectedAgent(fetchedAgents[0]);
                }
            } else {
                setHasAgent(false);
            }
        } catch (error) {
            console.error("Failed to fetch agents", error);
            showToast("Gagal memuat data agen.", "error"); // Optional: Silent fail on simple fetch
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAgents();
    }, []);

    const handleAgentCreated = async (agentData: any) => {
        // Show loading state or toast
        const loadingToastId = showToast("Sedang membuat agent...", "info");

        try {
            const newAgent = await agentService.createAgent(agentData);

            // Refresh list and select new agent
            setAgents(prev => [newAgent, ...prev]);
            setSelectedAgent(newAgent);
            setHasAgent(true);
            setIsArthurActive(false); // Reset Arthur flow

            showToast("Agent berhasil dibuat!", "success");
        } catch (error) {
            console.error("Failed to create agent", error);
            showToast("Gagal membuat agent. Silakan coba lagi.", "error");
        }
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <div className="w-full h-full p-6 md:p-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

                {/* COLUMN 1: Arthur (Bot Creator) - 3 Columns width */}
                <div className="lg:col-span-3 h-full flex flex-col min-h-0">
                    <ArthurPhone
                        isActive={isArthurActive}
                        onAgentCreated={handleAgentCreated}
                    />
                </div>

                {/* COLUMN 2: Work Area - 6 Columns width */}
                <div className="lg:col-span-6 h-full flex flex-col min-h-0">
                    {!hasAgent ? (
                        <AgentEmptyState onCreateClick={() => setIsArthurActive(true)} />
                    ) : (
                        <AgentWorkArea
                            agents={agents}
                            selectedAgent={selectedAgent}
                            onSelectAgent={setSelectedAgent}
                        />
                    )}
                </div>

                {/* COLUMN 3: Simulator/Preview - 3 Columns width */}
                <div className="lg:col-span-3 h-full flex flex-col min-h-0">
                    {!hasAgent ? (
                        <PreviewPhone />
                    ) : (
                        <SimulatorPhone selectedAgent={selectedAgent} />
                    )}
                </div>

            </div>
        </div>
    );
}
