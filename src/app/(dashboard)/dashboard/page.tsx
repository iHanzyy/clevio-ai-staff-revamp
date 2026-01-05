import React from "react";
import ArthurPhone from "@/components/features/dashboard/ArthurPhone";

export default function DashboardPage() {
    return (
        <div className="w-full h-full p-6 md:p-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

                {/* COLUMN 1: Arthur (Bot Creator) - 3 Columns width */}
                <div className="lg:col-span-3 h-full flex flex-col">
                    <ArthurPhone />
                </div>

                {/* COLUMN 2: Agent Detail (Work Area) - 6 Columns width */}
                <div className="lg:col-span-6 h-full flex flex-col bg-[#1C1F26] rounded-[3rem] p-6 border border-white/5 shadow-inner">
                    <div className="flex items-center justify-center h-full text-gray-500 font-sans">
                        Agent Detail Placeholder
                    </div>
                </div>

                {/* COLUMN 3: Created Agents (List) - 3 Columns width */}
                <div className="lg:col-span-3 h-full flex flex-col bg-[#1C1F26] rounded-[3rem] p-6 border border-white/5 shadow-inner">
                    <div className="flex items-center justify-center h-full text-gray-500 font-sans">
                        Created Agents Placeholder
                    </div>
                </div>

            </div>
        </div>
    );
}
