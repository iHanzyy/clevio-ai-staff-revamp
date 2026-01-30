"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, MessageSquare, Zap, TrendingUp, Crown, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/services/agentService";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/ToastProvider";

// Hardcoded packages - prices not final
const MESSAGE_PACKAGES = [
    {
        id: 'starter',
        name: 'Starter',
        messages: 2000,
        price: 'Rp 50.000',
        icon: Zap,
        color: 'lime'
    },
    {
        id: 'medium',
        name: 'Medium',
        messages: 4000,
        price: 'Rp 90.000',
        icon: TrendingUp,
        color: 'blue',
        popular: true
    },
    {
        id: 'bulk',
        name: 'Bulk',
        messages: 6000,
        price: 'Rp 125.000',
        icon: Crown,
        color: 'purple'
    }
];

interface MessageLimitSectionProps {
    agents: Agent[];
    selectedAgent: Agent | null;
    onSelectAgent: (agent: Agent) => void;
}

export default function MessageLimitSection({ agents, selectedAgent, onSelectAgent }: MessageLimitSectionProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mock data - replace with real data later
    const currentUsage = 350;
    const totalLimit = 2000;
    const usagePercent = Math.round((currentUsage / totalLimit) * 100);
    const resetDate = "1 Februari 2026";

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

    const handleAddPackage = (packageId: string) => {
        const pkg = MESSAGE_PACKAGES.find(p => p.id === packageId);
        if (!pkg) return;

        // Parse price to number (remove "Rp " and dots)
        const priceValue = parseInt(pkg.price.replace(/[^0-9]/g, ''));

        const cartItem: CartItem = {
            id: `message-limit-${packageId}-${selectedAgent?.id || 'no-agent'}`,
            name: `${pkg.name} (${pkg.messages.toLocaleString()} pesan)`,
            price: pkg.price,
            priceValue,
            type: 'message-limit',
            agentId: selectedAgent?.id,
            agentName: selectedAgent?.name
        };

        const added = addItem(cartItem);
        if (added) {
            showToast(`Paket ${pkg.name} ditambahkan ke keranjang`, 'success');
        } else {
            showToast('Item sudah ada di keranjang', 'info');
        }
    };

    const handlePurchase = (packageId: string) => {
        console.log(`Purchasing package ${packageId} for agent ${selectedAgent?.id}`);
        // TODO: Implement payment redirect logic
    };

    return (
        <div className="space-y-8">
            {/* Agent Selector */}
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

            {/* Current Usage Card */}
            <div className={cn(
                "p-6 rounded-2xl",
                "bg-white",
                "border border-gray-100",
                "shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
            )}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-lime-100 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-lime-600" />
                    </div>
                    <div>
                        <h3 className="text-gray-900 font-bold text-lg">Penggunaan Bulan Ini</h3>
                        <p className="text-gray-500 text-sm">Reset pada {resetDate}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm font-medium">
                            {currentUsage.toLocaleString()} / {totalLimit.toLocaleString()} pesan
                        </span>
                        <span className={cn(
                            "text-sm font-bold",
                            usagePercent > 80 ? "text-red-500" : usagePercent > 50 ? "text-yellow-500" : "text-lime-600"
                        )}>
                            {usagePercent}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all",
                                usagePercent > 80 ? "bg-red-500" : usagePercent > 50 ? "bg-yellow-500" : "bg-lime-500"
                            )}
                            style={{ width: `${usagePercent}%` }}
                        />
                    </div>
                </div>

                {/* Status */}
                <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                    usagePercent > 80 ? "bg-red-50 text-red-600" : "bg-lime-50 text-lime-600"
                )}>
                    <span className={cn(
                        "w-2 h-2 rounded-full",
                        usagePercent > 80 ? "bg-red-500" : "bg-lime-500"
                    )} />
                    {usagePercent > 80 ? "Kuota hampir habis" : "Kuota masih tersedia"}
                </div>
            </div>

            {/* Package Cards */}
            <div>
                <h3 className="text-white font-bold text-lg mb-4">Tambah Kuota Pesan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MESSAGE_PACKAGES.map((pkg) => {
                        const IconComponent = pkg.icon;
                        return (
                            <div
                                key={pkg.id}
                                className={cn(
                                    "relative p-5 rounded-2xl transition-all duration-200",
                                    "bg-white border",
                                    pkg.popular
                                        ? "border-lime-400 shadow-[0_4px_20px_rgba(132,204,22,0.15)]"
                                        : "border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
                                    "hover:shadow-lg hover:scale-[1.02]"
                                )}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-lime-500 text-white text-xs font-bold rounded-full">
                                        Populer
                                    </div>
                                )}

                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                                    pkg.color === 'lime' && "bg-lime-100",
                                    pkg.color === 'blue' && "bg-blue-100",
                                    pkg.color === 'purple' && "bg-purple-100"
                                )}>
                                    <IconComponent className={cn(
                                        "w-6 h-6",
                                        pkg.color === 'lime' && "text-lime-600",
                                        pkg.color === 'blue' && "text-blue-600",
                                        pkg.color === 'purple' && "text-purple-600"
                                    )} />
                                </div>

                                <h4 className="text-gray-900 font-bold text-lg mb-1">{pkg.name}</h4>
                                <p className="text-gray-500 text-sm mb-4">
                                    {pkg.messages.toLocaleString()} pesan
                                </p>

                                <div className="text-2xl font-bold text-gray-900 mb-4">
                                    {pkg.price}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAddPackage(pkg.id)}
                                        className={cn(
                                            "p-3 rounded-xl transition-all cursor-pointer",
                                            "border-2 border-lime-500 text-lime-600",
                                            "bg-transparent hover:bg-lime-50",
                                            "flex items-center justify-center"
                                        )}
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handlePurchase(pkg.id)}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer",
                                            "bg-linear-to-br from-[#65a30d] to-[#84cc16] text-white",
                                            "hover:opacity-90 shadow-lg shadow-lime-500/20"
                                        )}
                                    >
                                        Beli Sekarang
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
