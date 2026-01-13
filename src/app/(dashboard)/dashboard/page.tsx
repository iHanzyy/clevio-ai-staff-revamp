"use client";

import React, { useState } from "react";
import ArthurPhone from "@/components/features/dashboard/ArthurPhone";
import SimulatorPhone from "@/components/features/dashboard/SimulatorPhone";
import PreviewPhone from "@/components/features/dashboard/PreviewPhone";
import AgentWorkArea from "@/components/features/dashboard/AgentDetail";
import AgentEmptyState from "@/components/features/dashboard/AgentEmptyState";
import { useToast } from "@/components/ui/ToastProvider";

import { agentService, Agent } from "@/services/agentService";

import AgentModeToggle from "@/components/features/dashboard/agent/AgentModeToggle";

export default function DashboardPage() {
    const [hasAgent, setHasAgent] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isArthurActive, setIsArthurActive] = useState(false);
    const [isAutoMode, setIsAutoMode] = useState(false);
    // Section selection for AUTO mode (Arthur context)
    const [selectedSection, setSelectedSection] = useState<'name' | 'system_prompt' | 'capabilities' | null>(null);
    // Agent version to trigger simulator session reset on updates
    const [agentVersion, setAgentVersion] = useState(0);

    const { showToast } = useToast();

    // Fetch Agents on Mount
    const fetchAgents = async () => {
        try {
            const fetchedAgents = await agentService.getAgents();
            setAgents(fetchedAgents);
            if (fetchedAgents.length > 0) {
                setHasAgent(true);
                // Only set selected if none selected - fetch full details
                if (!selectedAgent) {
                    // Check localStorage for persisted agent ID (restored after OAuth redirect)
                    const persistedAgentId = typeof window !== 'undefined'
                        ? localStorage.getItem('selected_agent_id')
                        : null;

                    const targetAgentId = persistedAgentId && fetchedAgents.find(a => a.id === persistedAgentId)
                        ? persistedAgentId
                        : fetchedAgents[0].id;

                    const fullAgentData = await agentService.getAgent(targetAgentId);
                    setSelectedAgent(fullAgentData);
                }
            } else {
                setHasAgent(false);
            }
        } catch (error) {
            console.error("Failed to fetch agents", error);
            showToast("Gagal memuat data agen.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAgents();
    }, []);

    const handleAgentCreated = async (rawAgentData: any) => {
        // Show loading state or toast
        showToast("Sedang membuat agent...", "info");

        try {


            const agentPayload = {
                name: rawAgentData.name,

                // Top Level Fields
                google_tools: rawAgentData.google_tools || [],
                mcp_tools: rawAgentData.mcp_tools || [],

                config: {
                    system_prompt: rawAgentData.system_prompt || rawAgentData.config?.system_prompt,
                    llm_model: rawAgentData.llm_model || 'gpt-4.1-mini',
                    temperature: 0.1,
                },

                mcp_servers: rawAgentData.mcp_servers || {
                    "calculator_sse": {
                        "transport": "sse",
                        "url": "http://0.0.0.0:8190/sse"
                    }
                }
            };

            const newAgent = await agentService.createAgent(agentPayload);

            // Fetch full details (including auth_required)
            const fullAgentData = await agentService.getAgent(newAgent.id);

            // Refresh list and select new agent
            setAgents(prev => [fullAgentData, ...prev]);
            setSelectedAgent(fullAgentData);
            setHasAgent(true);
            setIsArthurActive(false); // Reset Arthur flow

            showToast("Agent berhasil dibuat!", "success");
        } catch (error) {
            console.error("Failed to create agent", error);
            showToast("Gagal membuat agent. Silakan coba lagi.", "error");
        }
    };

    // Handle agent selection with full data fetch
    const handleSelectAgent = async (agent: Agent) => {
        try {
            // Fetch full agent details including auth_required
            const fullAgentData = await agentService.getAgent(agent.id);
            setSelectedAgent(fullAgentData);
            // Persist to localStorage for OAuth redirect restore
            if (typeof window !== 'undefined') {
                localStorage.setItem('selected_agent_id', agent.id);
            }
        } catch (error) {
            console.error("Failed to fetch agent details", error);
            // Fallback to basic agent data
            setSelectedAgent(agent);
        }
    };

    const refreshAgents = async () => {
        try {
            const fetched = await agentService.getAgents();
            setAgents(fetched);
            if (selectedAgent) {
                // Fetch full details to get auth_required, etc.
                const fullAgentData = await agentService.getAgent(selectedAgent.id);
                setSelectedAgent(fullAgentData);
                // Increment version to trigger simulator session reset
                setAgentVersion(prev => prev + 1);
            }
        } catch (error) {
            console.error("Failed to refresh agents", error);
        }
    };

    // Update messages_remaining in selectedAgent (called after chat)
    const handleMessagesRemainingUpdate = (remaining: number) => {
        if (selectedAgent) {
            setSelectedAgent(prev => prev ? { ...prev, messages_remaining: remaining } : null);
        }
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <div className="w-full h-full p-6 md:p-10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

                {/* COLUMN 1: Arthur (Bot Creator) - 3 Columns width */}
                <div className="lg:col-span-3 h-full flex flex-col min-h-0">
                    <ArthurPhone
                        isActive={isArthurActive}
                        onAgentCreated={handleAgentCreated}
                        hasAgent={hasAgent}
                        isAutoMode={isAutoMode}
                        selectedSection={selectedSection}
                        selectedAgent={selectedAgent}
                        onSectionReset={() => setSelectedSection(null)}
                    />
                </div>

                {/* COLUMN 2: Work Area - 6 Columns width */}
                <div className="lg:col-span-6 h-full flex flex-col min-h-0 relative">

                    {/* Toggle Switch (Floating Top-Right) */}
                    {hasAgent && (
                        <AgentModeToggle
                            isAutoMode={isAutoMode}
                            onToggle={setIsAutoMode}
                            className="absolute -top-8.75 right-0 z-50"
                        />
                    )}

                    {!hasAgent ? (
                        <AgentEmptyState onCreateClick={() => setIsArthurActive(true)} />
                    ) : (
                        <AgentWorkArea
                            agents={agents}
                            selectedAgent={selectedAgent}
                            onSelectAgent={handleSelectAgent}
                            onAgentUpdate={refreshAgents}
                            isAutoMode={isAutoMode}
                            onToggleMode={setIsAutoMode}
                            selectedSection={selectedSection}
                            onSelectSection={setSelectedSection}
                        />
                    )}
                </div>

                {/* COLUMN 3: Simulator/Preview - 3 Columns width */}
                <div className="lg:col-span-3 h-full flex flex-col min-h-0">
                    {!hasAgent ? (
                        <PreviewPhone />
                    ) : (
                        <SimulatorPhone
                            selectedAgent={selectedAgent}
                            onMessagesRemainingUpdate={handleMessagesRemainingUpdate}
                            agentVersion={agentVersion}
                        />
                    )}
                </div>

            </div>
        </div>
    );
}
