import React from "react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "info" | "success";
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger",
    isLoading = false,
    icon
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className={cn(
                "relative bg-[#F9FAFB] rounded-[2rem] p-8 max-w-sm w-full animate-fade-in-up",
                // Claymorphism
                "shadow-[inset_-6px_-6px_14px_rgba(255,255,255,0.8),inset_6px_6px_10px_rgba(0,0,0,0.03),0_20px_40px_rgba(0,0,0,0.08)]",
                "border border-white/60",
                icon && "flex flex-col items-center text-center"
            )}>
                {icon && <div className="mb-5">{icon}</div>}

                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    {message}
                </p>
                <div className={cn("flex gap-3 w-full", icon ? "justify-center" : "justify-end")}>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-3 rounded-[18px] text-gray-500 font-bold hover:bg-gray-100 hover:text-gray-700 transition-all text-sm cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            "px-6 py-3 rounded-[18px] text-white font-bold transition-all text-sm cursor-pointer disabled:opacity-50 flex items-center gap-2 active:scale-[0.98]",
                            // Clay button style
                            type === "danger"
                                ? "bg-red-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_16px_rgba(239,68,68,0.3)] hover:bg-red-600"
                                : type === "success"
                                    ? "bg-linear-to-br from-[#65a30d] to-[#84cc16] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_16px_rgba(101,163,13,0.3)] hover:scale-[1.02]"
                                    : "bg-gray-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_8px_16px_rgba(17,24,39,0.3)] hover:bg-gray-800"
                        )}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
