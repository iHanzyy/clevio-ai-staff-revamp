"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/services/agentService";
import CapabilityCard from "@/components/features/addons/CapabilityCard";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/ToastProvider";

// Hardcoded capabilities data
const CAPABILITIES = [
    {
        id: 'web_search',
        icon: '/webSearchIcon.svg',
        title: 'Web Search',
        description: 'Temukan informasi relevan dengan cepat dari seluruh web untuk analisis mendalam.',
        price: 'Rp 150.000'
    },
    {
        id: 'deep_research',
        icon: '/telescopeIcon.svg',
        title: 'Deep Research',
        description: 'Lakukan riset mendalam dengan data komprehensif dan analisis terperinci.',
        price: 'Rp 250.000'
    }
];

interface CapabilitiesSectionProps {
    agents: Agent[];
    selectedAgent: Agent | null;
    onSelectAgent: (agent: Agent) => void;
}

export default function CapabilitiesSection({ agents, selectedAgent, onSelectAgent }: CapabilitiesSectionProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { addItem } = useCart();
    const { showToast } = useToast();

    const handleAddCapability = (capabilityId: string) => {
        const capability = CAPABILITIES.find(c => c.id === capabilityId);
        if (!capability) return;

        // Parse price to number (remove "Rp " and dots)
        const priceValue = parseInt(capability.price.replace(/[^0-9]/g, ''));

        const cartItem: CartItem = {
            id: `capability-${capabilityId}-${selectedAgent?.id || 'no-agent'}`,
            name: capability.title,
            price: capability.price,
            priceValue,
            type: 'capability',
            agentId: selectedAgent?.id,
            agentName: selectedAgent?.name
        };

        const added = addItem(cartItem);
        if (added) {
            showToast(`${capability.title} ditambahkan ke keranjang`, 'success');
        } else {
            showToast('Item sudah ada di keranjang', 'info');
        }
    };

    const handleBuyCapability = (capabilityId: string) => {
        console.log(`Buying capability ${capabilityId} for agent ${selectedAgent?.id}`);
        // TODO: Implement payment redirect logic
    };

    return (
        <div className="space-y-6">
            {/* Agent Selector - Compact */}
            <div className="space-y-1.5">
                <label className="text-gray-400 text-sm font-medium">
                    Pilih Agen
                </label>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={cn(
                            "flex items-center justify-between gap-3 w-full max-w-xs px-4 py-2.5 rounded-xl",
                            "bg-white",
                            "border border-gray-200",
                            "shadow-[0_2px_6px_rgba(0,0,0,0.05)]",
                            "text-gray-900 font-medium text-sm",
                            "hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-all",
                            "cursor-pointer"
                        )}
                    >
                        <span className="truncate">
                            {selectedAgent?.name || "Pilih agen..."}
                        </span>
                        <ChevronDown className={cn(
                            "w-4 h-4 text-gray-500 transition-transform",
                            isDropdownOpen && "rotate-180"
                        )} />
                    </button>

                    {isDropdownOpen && (
                        <div className={cn(
                            "absolute top-full left-0 mt-2 w-full max-w-xs z-50",
                            "bg-white border border-gray-200 rounded-xl",
                            "shadow-xl overflow-hidden",
                            "animate-fade-in-down origin-top"
                        )}>
                            <div className="max-h-60 overflow-y-auto py-1">
                                {agents.length === 0 ? (
                                    <div className="px-4 py-3 text-gray-500 text-sm">
                                        Tidak ada agen tersedia
                                    </div>
                                ) : (
                                    agents.map((agent) => (
                                        <button
                                            key={agent.id}
                                            onClick={() => {
                                                onSelectAgent(agent);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={cn(
                                                "w-full px-4 py-3 text-left text-sm transition-colors cursor-pointer",
                                                selectedAgent?.id === agent.id
                                                    ? "bg-lime-50 text-lime-700 font-medium"
                                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            {agent.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Capability Cards - LEFT aligned grid, wider cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {CAPABILITIES.map((cap) => (
                    <CapabilityCard
                        key={cap.id}
                        icon={cap.icon}
                        title={cap.title}
                        description={cap.description}
                        price={cap.price}
                        onAdd={() => handleAddCapability(cap.id)}
                        onBuy={() => handleBuyCapability(cap.id)}
                    />
                ))}
            </div>
        </div>
    );
}
