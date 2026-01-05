"use client";

import React from "react";
import AgentSelector from "./agent/AgentSelector";
import AgentTask from "./agent/AgentTask";
import AgentCapabilities from "./agent/AgentCapabilities";
import AgentKnowledge from "./agent/AgentKnowledge";
import AgentIntegrations from "./agent/AgentIntegrations";

export default function AgentWorkArea() {
    return (
        <div className="flex flex-col gap-6 h-full font-sans overflow-y-auto scrollbar-hide pb-5">

            {/* 1. AGENT SELECTOR */}
            <AgentSelector />

            {/* 2. SYSTEM PROMPT (TUGAS AGEN) */}
            <AgentTask />

            {/* 3. CAPABILITIES (KEMAMPUAN AGEN) */}
            <AgentCapabilities />

            {/* 4. GRID: KNOWLEDGE & INTEGRATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AgentKnowledge />
                <AgentIntegrations />
            </div>

        </div>
    );
}
