"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

export default function CartFAB() {
    const { itemCount, isOpen, openCart } = useCart();

    // Hide FAB when panel is open
    if (isOpen) {
        return null;
    }

    return (
        <button
            onClick={openCart}
            className={cn(
                "fixed bottom-6 right-6 z-40",
                "w-14 h-14 rounded-full",
                "bg-linear-to-br from-[#65a30d] to-[#84cc16]",
                "shadow-lg shadow-lime-500/30",
                "flex items-center justify-center",
                "hover:scale-110 active:scale-95",
                "transition-all duration-200",
                "cursor-pointer"
            )}
        >
            <ShoppingCart className="w-6 h-6 text-white" />

            {/* Badge Counter */}
            {itemCount > 0 && (
                <span className={cn(
                    "absolute -top-1 -right-1",
                    "w-5 h-5 rounded-full",
                    "bg-red-500 text-white",
                    "text-xs font-bold",
                    "flex items-center justify-center",
                    "shadow-md"
                )}>
                    {itemCount > 9 ? '9+' : itemCount}
                </span>
            )}
        </button>
    );
}
