"use client";

import React, { useState } from "react";
import { Users, Plus, Minus, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/services/agentService";

interface AgentSlotSectionProps {
    agents: Agent[];
    selectedAgent: Agent | null;
    onSelectAgent: (agent: Agent) => void;
}

export default function AgentSlotSection({ agents }: AgentSlotSectionProps) {
    const [quantity, setQuantity] = useState(1);

    // Mock data - replace with real data later
    const usedSlots = agents.length;
    const totalSlots = 1; // Default plan
    const pricePerSlot = 20000;

    const handlePurchase = () => {
        console.log(`Purchasing ${quantity} slot(s) for Rp ${(quantity * pricePerSlot).toLocaleString()}`);
        // TODO: Implement payment logic
    };

    const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
    const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

    return (
        <div className="space-y-8">
            {/* Current Slots Info Card */}
            <div className={cn(
                "p-6 rounded-2xl",
                "bg-white",
                "border border-gray-100",
                "shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
            )}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-gray-900 font-bold text-lg">Slot Agen Anda</h3>
                        <p className="text-gray-500 text-sm">Kelola jumlah agen yang bisa Anda buat</p>
                    </div>
                </div>

                {/* Slot Counter */}
                <div className="flex items-center gap-8 mb-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">{usedSlots}</div>
                        <div className="text-gray-500 text-sm">Terpakai</div>
                    </div>
                    <div className="text-3xl text-gray-300">/</div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600">{totalSlots}</div>
                        <div className="text-gray-500 text-sm">Total Slot</div>
                    </div>
                </div>

                {/* Active Agents List */}
                {agents.length > 0 && (
                    <div>
                        <h4 className="text-gray-700 font-medium text-sm mb-3">Agen Aktif:</h4>
                        <div className="flex flex-wrap gap-2">
                            {agents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg",
                                        "bg-gray-50 border border-gray-100"
                                    )}
                                >
                                    <Bot className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700 text-sm font-medium">{agent.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Purchase Slot Card */}
            <div className={cn(
                "p-6 rounded-2xl",
                "bg-linear-to-br from-purple-500 to-purple-700",
                "shadow-xl shadow-purple-500/20"
            )}>
                <h3 className="text-white font-bold text-xl mb-2">Tambah Slot Agen</h3>
                <p className="text-purple-200 text-sm mb-6">
                    Beli slot tambahan untuk membuat lebih banyak agen. Pembayaran sekali, slot permanen.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                        <span className="text-purple-200 text-sm">Jumlah:</span>
                        <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1">
                            <button
                                onClick={decrementQuantity}
                                disabled={quantity <= 1}
                                className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                                    quantity <= 1
                                        ? "text-purple-300 cursor-not-allowed"
                                        : "text-white hover:bg-white/10 cursor-pointer"
                                )}
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-white font-bold text-xl w-8 text-center">{quantity}</span>
                            <button
                                onClick={incrementQuantity}
                                disabled={quantity >= 10}
                                className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                                    quantity >= 10
                                        ? "text-purple-300 cursor-not-allowed"
                                        : "text-white hover:bg-white/10 cursor-pointer"
                                )}
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex-1">
                        <div className="text-purple-200 text-sm">Total Harga:</div>
                        <div className="text-white font-bold text-2xl">
                            Rp {(quantity * pricePerSlot).toLocaleString()}
                        </div>
                        <div className="text-purple-200 text-xs">
                            Rp {pricePerSlot.toLocaleString()} / slot
                        </div>
                    </div>

                    {/* Buy Button */}
                    <button
                        onClick={handlePurchase}
                        className={cn(
                            "px-8 py-4 rounded-xl font-bold text-purple-700 transition-all",
                            "bg-white hover:bg-purple-50 hover:scale-105",
                            "shadow-lg cursor-pointer"
                        )}
                    >
                        Beli Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
}
