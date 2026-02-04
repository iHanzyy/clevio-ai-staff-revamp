"use client";

import React, { useState } from "react";
import AgentSelector from "./agent/AgentSelector";
import AgentTask from "./agent/AgentTask";
import AgentCapabilities from "./agent/AgentCapabilities";
import AgentKnowledge from "./agent/AgentKnowledge";
import AgentIntegrations from "./agent/AgentIntegrations";
import { Agent } from "@/services/agentService";

type SectionType = 'name' | 'system_prompt' | 'capabilities' | null;

interface AgentWorkAreaProps {
    agents: Agent[];
    selectedAgent: Agent | null;
    onSelectAgent: (agent: Agent) => void;
    onAgentUpdate?: () => void;
    // isAutoMode removed
    // onToggleMode removed
    selectedSection?: SectionType;
    onSelectSection: (section: SectionType) => void;
}

export default function AgentWorkArea({ agents, selectedAgent, onSelectAgent, onAgentUpdate, selectedSection, onSelectSection }: AgentWorkAreaProps) {

    // Click handler removed - context selection is now via Arthur Dropdown only

    return (
        <div className="flex flex-col gap-6 h-full font-sans overflow-y-auto scrollbar-hide pb-5 relative">

            {/* 1. AGENT SELECTOR (Context Highlight Only) */}
            <AgentSelector
                agents={agents}
                selectedAgent={selectedAgent}
                onSelectAgent={onSelectAgent}
                onAgentUpdate={onAgentUpdate}
                isAutoMode={false} // Disabled interaction
                onToggleMode={() => { }} // No-op
                isSelected={selectedSection === 'name'}
                onSectionClick={() => { }} // No-op
            />

            {/* 2. SYSTEM PROMPT / TUGAS AGEN (Context Highlight Only) */}
            <AgentTask
                selectedAgent={selectedAgent}
                onAgentUpdate={onAgentUpdate}
                isAutoMode={false} // Disabled interaction
                isSelected={selectedSection === 'system_prompt'}
                onSectionClick={() => { }} // No-op
            />

            {/* 3. CAPABILITIES / KEMAMPUAN AGEN (Context Highlight Only) */}
            <AgentCapabilities
                selectedAgent={selectedAgent}
                onAgentUpdate={onAgentUpdate}
                isAutoMode={false} // Disabled interaction
                isSelected={selectedSection === 'capabilities'}
                onSectionClick={() => { }} // No-op
            />

            {/* 4. GRID: KNOWLEDGE & INTEGRATIONS (Not selectable for Arthur) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AgentKnowledge selectedAgent={selectedAgent} />
                <AgentIntegrations selectedAgent={selectedAgent} />
            </div>

        </div>
    );
}
