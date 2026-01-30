"use client";

import React from "react";
import { X, Trash2, ShoppingBag, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPanel() {
    const { items, removeItem, clearCart, totalPrice, itemCount, isOpen, closeCart } = useCart();

    const formatPrice = (value: number) => {
        return `Rp ${value.toLocaleString('id-ID')}`;
    };

    const handleCheckout = () => {
        console.log('Checkout with items:', items);
        // TODO: Implement checkout logic - redirect to payment with cart items
    };

    const isEmpty = itemCount === 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={closeCart}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed right-0 top-0 h-full w-80 z-50",
                            "bg-white shadow-2xl",
                            "flex flex-col"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-lime-600" />
                                <h3 className="font-bold text-gray-900">Keranjang</h3>
                                {!isEmpty && (
                                    <span className="px-2 py-0.5 bg-lime-100 text-lime-700 text-xs font-bold rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {!isEmpty && (
                                    <button
                                        onClick={clearCart}
                                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                                        title="Kosongkan keranjang"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={closeCart}
                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                                    title="Tutup"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {isEmpty ? (
                            /* Empty State */
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingCart className="w-10 h-10 text-gray-300" />
                                </div>
                                <h4 className="font-semibold text-gray-700 mb-2">Keranjang Kosong</h4>
                                <p className="text-gray-400 text-sm">
                                    Tambahkan add-ons untuk meningkatkan kemampuan agent Anda
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Items List */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "p-3 rounded-xl",
                                                "bg-gray-50 border border-gray-100",
                                                "flex items-start justify-between gap-2"
                                            )}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 text-sm truncate">
                                                    {item.name}
                                                </h4>
                                                {item.agentName && (
                                                    <p className="text-xs text-gray-400 truncate">
                                                        Agent: {item.agentName}
                                                    </p>
                                                )}
                                                <p className="text-lime-600 font-bold text-sm mt-1">
                                                    {item.price}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer - Total & Checkout */}
                                <div className="p-4 border-t border-gray-100 bg-gray-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-600 font-medium">Total</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            {formatPrice(totalPrice)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className={cn(
                                            "w-full py-3 rounded-xl font-bold text-white",
                                            "bg-linear-to-br from-[#65a30d] to-[#84cc16]",
                                            "hover:opacity-90 active:scale-[0.98]",
                                            "transition-all cursor-pointer",
                                            "shadow-lg shadow-lime-500/20"
                                        )}
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
