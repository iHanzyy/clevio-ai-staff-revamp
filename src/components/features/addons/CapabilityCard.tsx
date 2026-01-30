"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface CapabilityCardProps {
    icon: string;
    title: string;
    description: string;
    price: string;
    onAdd?: () => void;
    onBuy?: () => void;
}

export default function CapabilityCard({ icon, title, description, price, onAdd, onBuy }: CapabilityCardProps) {
    return (
        <div className={cn(
            "flex flex-col rounded-2xl overflow-hidden",
            "bg-white",
            "border border-gray-200",
            "shadow-[0_4px_10px_rgba(0,0,0,0.05)]",
            "transition-all duration-300",
            "hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
        )}>
            {/* TOP SECTION - Icon Area */}
            <div className={cn(
                "flex items-center justify-center",
                "bg-[#e2e8f0]",
                "h-36"
            )}>
                <Image
                    src={icon}
                    alt={title}
                    width={120}
                    height={120}
                />
            </div>

            {/* BOTTOM SECTION - Content */}
            <div className="flex flex-col p-5">
                {/* Title */}
                <h3 className="text-gray-900 font-bold text-base mb-2">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 min-h-[60px]">
                    {description}
                </p>

                {/* Price */}
                <p className="text-gray-900 font-bold text-xl mb-4">
                    {price}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onAdd}
                        className={cn(
                            "p-2.5 rounded-lg",
                            "border-2 border-lime-500 text-lime-600",
                            "bg-transparent hover:bg-lime-50",
                            "active:scale-[0.98] transition-all duration-200",
                            "cursor-pointer flex items-center justify-center"
                        )}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onBuy}
                        className={cn(
                            "flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm text-white",
                            "bg-linear-to-br from-[#65a30d] to-[#84cc16]",
                            "hover:opacity-90 active:scale-[0.98]",
                            "transition-all duration-200",
                            "cursor-pointer"
                        )}
                    >
                        Beli Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
}
