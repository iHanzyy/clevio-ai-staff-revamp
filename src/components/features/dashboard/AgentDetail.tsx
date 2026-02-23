"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
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
    isFocused?: boolean;
}

export default function AgentWorkArea({ agents, selectedAgent, onSelectAgent, onAgentUpdate, isFocused = false }: AgentWorkAreaProps) {

    // Click handler removed - context selection is now via Arthur Dropdown only

    return (
        <div className={cn(
            "flex flex-col gap-6 h-full font-sans overflow-y-auto scrollbar-hide pb-5 relative rounded-4xl p-4 transition-all duration-300",
            isFocused ? "shadow-[0px_4px_63px_3px_rgba(37,99,235,0.6)]" : "shadow-none"
        )}>

            {/* 1. AGENT SELECTOR (Context Highlight Only) */}
            <AgentSelector
                agents={agents}
                selectedAgent={selectedAgent}
                onSelectAgent={onSelectAgent}
                onAgentUpdate={onAgentUpdate}
                isAutoMode={false}
                onToggleMode={() => { }}
                isSelected={false}
                onSectionClick={() => { }}
            />

            {/* 2. SYSTEM PROMPT / TUGAS AGEN (Context Highlight Only) */}
            <AgentTask
                selectedAgent={selectedAgent}
                onAgentUpdate={onAgentUpdate}
                isAutoMode={false}
                isSelected={false}
                onSectionClick={() => { }}
            />

            {/* 3. CAPABILITIES / KEMAMPUAN AGEN (Context Highlight Only) */}
            <AgentCapabilities
                selectedAgent={selectedAgent}
                onAgentUpdate={onAgentUpdate}
                isAutoMode={false}
                isSelected={false}
                onSectionClick={() => { }}
            />

            {/* 4. GRID: KNOWLEDGE & INTEGRATIONS (Not selectable for Arthur) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AgentKnowledge selectedAgent={selectedAgent} />
                <AgentIntegrations selectedAgent={selectedAgent} />
            </div>

        </div>
    );
}
