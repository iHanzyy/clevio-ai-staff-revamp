"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: string;
    priceValue: number; // Numeric value for calculation
    type: 'capability' | 'message-limit';
    agentId?: string;
    agentName?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => boolean; // returns false if already exists
    removeItem: (itemId: string) => void;
    clearCart: () => void;
    totalPrice: number;
    itemCount: number;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'clevio_addons_cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                try {
                    setItems(JSON.parse(stored));
                } catch (e) {
                    console.error('Failed to parse cart from localStorage', e);
                }
            }
            setIsHydrated(true);
        }
    }, []);

    // Save to localStorage when items change
    useEffect(() => {
        if (isHydrated && typeof window !== 'undefined') {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isHydrated]);

    const addItem = (item: CartItem): boolean => {
        // Check if item already exists
        const exists = items.some(i => i.id === item.id);
        if (exists) {
            return false;
        }
        setItems(prev => [...prev, item]);
        // Auto-open cart when adding first item
        setIsOpen(true);
        return true;
    };

    const removeItem = (itemId: string) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const totalPrice = items.reduce((sum, item) => sum + item.priceValue, 0);
    const itemCount = items.length;

    return (
        <CartContext.Provider value={{
            items, addItem, removeItem, clearCart, totalPrice, itemCount,
            isOpen, openCart, closeCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
