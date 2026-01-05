import React from "react";
import ArthurPhone from "@/components/features/dashboard/ArthurPhone";
import SimulatorPhone from "@/components/features/dashboard/SimulatorPhone";
import AgentWorkArea from "@/components/features/dashboard/AgentWorkArea";

export default function DashboardPage() {
    return (
        <div className="w-full h-full p-6 md:p-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

                {/* COLUMN 1: Arthur (Bot Creator) - 3 Columns width */}
                <div className="lg:col-span-3 h-full flex flex-col min-h-0">
                    <ArthurPhone />
                </div>

                {/* COLUMN 2: Agent Work Area (Central Hub) - 6 Columns width */}
                <div className="lg:col-span-6 h-full flex flex-col min-h-0">
                    <AgentWorkArea />
                </div>

                {/* COLUMN 3: Simulator (Test Bot) - 3 Columns width */}
                <div className="lg:col-span-3 h-full flex flex-col min-h-0">
                    <SimulatorPhone />
                </div>

            </div>
        </div>
    );
}
