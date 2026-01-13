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
    isAutoMode: boolean;
    onToggleMode: (isAuto: boolean) => void;
    selectedSection?: SectionType;
    onSelectSection?: (section: SectionType) => void;
}

export default function AgentWorkArea({ agents, selectedAgent, onSelectAgent, onAgentUpdate, isAutoMode, onToggleMode, selectedSection, onSelectSection }: AgentWorkAreaProps) {

    const handleSectionClick = (section: SectionType) => {
        if (!isAutoMode || !onSelectSection) return;
        // Toggle: if same section clicked, deselect; else select
        onSelectSection(selectedSection === section ? null : section);
    };

    return (
        <div className="flex flex-col gap-6 h-full font-sans overflow-y-auto scrollbar-hide pb-5 relative">

            {/* 1. AGENT SELECTOR (Clickable in AUTO mode) */}
            <AgentSelector
                agents={agents}
                selectedAgent={selectedAgent}
                onSelectAgent={onSelectAgent}
                onAgentUpdate={onAgentUpdate}
                isAutoMode={isAutoMode}
                onToggleMode={onToggleMode}
                isSelected={isAutoMode && selectedSection === 'name'}
                onSectionClick={() => handleSectionClick('name')}
            />

            {/* 2. SYSTEM PROMPT / TUGAS AGEN (Clickable in AUTO mode) */}
            <AgentTask
                selectedAgent={selectedAgent}
                onAgentUpdate={onAgentUpdate}
                isAutoMode={isAutoMode}
                isSelected={isAutoMode && selectedSection === 'system_prompt'}
                onSectionClick={() => handleSectionClick('system_prompt')}
            />

            {/* 3. CAPABILITIES / KEMAMPUAN AGEN (Clickable in AUTO mode) */}
            <AgentCapabilities
                selectedAgent={selectedAgent}
                onAgentUpdate={onAgentUpdate}
                isAutoMode={isAutoMode}
                isSelected={isAutoMode && selectedSection === 'capabilities'}
                onSectionClick={() => handleSectionClick('capabilities')}
            />

            {/* 4. GRID: KNOWLEDGE & INTEGRATIONS (Not selectable for Arthur) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AgentKnowledge selectedAgent={selectedAgent} isAutoMode={isAutoMode} />
                <AgentIntegrations selectedAgent={selectedAgent} />
            </div>

        </div>
    );
}
