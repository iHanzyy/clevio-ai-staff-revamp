"use client";

import React from "react";
import { cn } from "@/lib/utils";

type TabType = 'overview' | 'kemampuan-tambahan' | 'limit-pesan' | 'slot-agent' | 'riwayat';

interface Tab {
    id: TabType;
    label: string;
}

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'kemampuan-tambahan', label: 'Kemampuan Tambahan' },
    { id: 'limit-pesan', label: 'Tambah Limit Pesan' },
    { id: 'slot-agent', label: 'Tambah Slot Agent' },
    { id: 'riwayat', label: 'Riwayat' },
];

interface AddOnsTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function AddOnsTabs({ activeTab, onTabChange }: AddOnsTabsProps) {
    return (
        <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-8 min-w-max border-b border-white/10 pb-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "relative pb-3 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer",
                            activeTab === tab.id
                                ? "text-white"
                                : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        {tab.label}
                        {/* Active underline indicator */}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
