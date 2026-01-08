"use client";

import React from "react";
import AgentSelector from "./agent/AgentSelector";
import AgentTask from "./agent/AgentTask";
import AgentCapabilities from "./agent/AgentCapabilities";
import AgentKnowledge from "./agent/AgentKnowledge";
import AgentIntegrations from "./agent/AgentIntegrations";
import { Agent } from "@/services/agentService";

interface AgentWorkAreaProps {
    agents: Agent[];
    selectedAgent: Agent | null;
    onSelectAgent: (agent: Agent) => void;
    onAgentUpdate?: () => void;
}

export default function AgentWorkArea({ agents, selectedAgent, onSelectAgent, onAgentUpdate }: AgentWorkAreaProps) {
    return (
        <div className="flex flex-col gap-6 h-full font-sans overflow-y-auto scrollbar-hide pb-5">

            {/* 1. AGENT SELECTOR */}
            <AgentSelector agents={agents} selectedAgent={selectedAgent} onSelectAgent={onSelectAgent} />

            {/* 2. SYSTEM PROMPT (TUGAS AGEN) */}
            <AgentTask selectedAgent={selectedAgent} onAgentUpdate={onAgentUpdate} />

            {/* 3. CAPABILITIES (KEMAMPUAN AGEN) */}
            <AgentCapabilities selectedAgent={selectedAgent} onAgentUpdate={onAgentUpdate} />

            {/* 4. GRID: KNOWLEDGE & INTEGRATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AgentKnowledge selectedAgent={selectedAgent} />
                <AgentIntegrations />
            </div>

        </div>
    );
}
