"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(7);
        const newToast = { id, message, type };
        setToasts((prev) => [...prev, newToast]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-2 w-full max-w-sm pointer-events-none p-4">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 backdrop-blur-md animate-fade-in-down transition-all",
                            toast.type === "success" && "bg-white text-green-700",
                            toast.type === "error" && "bg-white text-red-700",
                            toast.type === "info" && "bg-white text-gray-700"
                        )}
                    >
                        {toast.type === "success" && <CheckCircle className="w-5 h-5 text-green-500 fill-green-100" />}
                        {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-500 fill-red-100" />}
                        {toast.type === "info" && <Info className="w-5 h-5 text-blue-500 fill-blue-100" />}

                        <p className="text-sm font-semibold flex-1">{toast.message}</p>

                        <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
