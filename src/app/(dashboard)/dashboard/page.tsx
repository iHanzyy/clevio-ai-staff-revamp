"use client";

import React, { useState } from "react";
import ArthurPhone from "@/components/features/dashboard/ArthurPhone";
import SimulatorPhone from "@/components/features/dashboard/SimulatorPhone";
import PreviewPhone from "@/components/features/dashboard/PreviewPhone";
import AgentWorkArea from "@/components/features/dashboard/AgentDetail";
import AgentEmptyState from "@/components/features/dashboard/AgentEmptyState";

export default function DashboardPage() {
    const [hasAgent, setHasAgent] = useState(false);

    // Initial Welcome Message for Empty State
    const WELCOME_MESSAGES_EMPTY: { id: number; sender: "Arthur" | "User"; message: string; time: string; }[] = [
        {
            id: 1,
            sender: "Arthur",
            message: "Halo, saya Arthur. Saya akan membantu Anda membuat agent.",
            time: "10:05 AM"
        },
        {
            id: 2,
            sender: "Arthur",
            message: "Klik tombol 'Buat Agent Baru' di tengah untuk memulai wawancara.",
            time: "10:06 AM"
        }
    ];

    return (
        <div className="w-full h-full p-6 md:p-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

                {/* COLUMN 1: Arthur (Bot Creator) - 3 Columns width */}
                <div className="lg:col-span-3 h-full flex flex-col min-h-0">
                    <ArthurPhone initialMessages={!hasAgent ? WELCOME_MESSAGES_EMPTY : undefined} />
                </div>

                {/* COLUMN 2: Work Area - 6 Columns width */}
                <div className="lg:col-span-6 h-full flex flex-col min-h-0">
                    {!hasAgent ? (
                        <AgentEmptyState onCreateClick={() => setHasAgent(true)} />
                    ) : (
                        <AgentWorkArea />
                    )}
                </div>

                {/* COLUMN 3: Simulator/Preview - 3 Columns width */}
                <div className="lg:col-span-3 h-full flex flex-col min-h-0">
                    {!hasAgent ? (
                        <PreviewPhone />
                    ) : (
                        <SimulatorPhone />
                    )}
                </div>

            </div>
        </div>
    );
}
