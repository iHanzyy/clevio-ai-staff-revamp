"use client";

import React from "react";
import { X, User, CreditCard, Mail, Fingerprint } from "lucide-react";
import { User as UserType } from "@/services/authService";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType | null;
}

export default function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content - White Clay Style */}
            <div className="relative w-full max-w-md bg-[#FDFDFD] rounded-[2rem] p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_0_0_2px_rgba(255,255,255,0.5)] border border-white/40 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#F0F0F3] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,1)] flex items-center justify-center text-gray-700">
                            <User className="w-6 h-6 text-[#2A2E37]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#2A2E37] tracking-tight">Setting Akun</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl bg-[#F0F0F3] text-gray-400 hover:text-[#2A2E37] transition-all duration-300 hover:scale-105 active:scale-95 shadow-[-2px_-2px_5px_rgba(255,255,255,1),3px_3px_5px_rgba(0,0,0,0.05)] hover:shadow-[-1px_-1px_2px_rgba(255,255,255,1),1px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Account Details Card */}
                <div className="space-y-5">
                    {/* ID */}
                    <div className="bg-[#F5F5F7] p-5 rounded-2xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white/50">
                        <div className="flex items-center gap-3 text-gray-400 mb-1.5">
                            <Fingerprint className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">ID User</span>
                        </div>
                        <p className="text-sm font-mono font-medium text-gray-700 break-all bg-white/50 px-2 py-1 rounded-md border border-white/50 inline-block">
                            {user.id}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="bg-[#F5F5F7] p-5 rounded-2xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white/50">
                        <div className="flex items-center gap-3 text-gray-400 mb-1.5">
                            <Mail className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Email</span>
                        </div>
                        <p className="text-base font-semibold text-gray-800">{user.email}</p>
                    </div>

                    {/* Plan */}
                    <div className="bg-[#F5F5F7] p-5 rounded-2xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white/50 flex items-center justify-between group">
                        <div>
                            <div className="flex items-center gap-3 text-gray-400 mb-1.5">
                                <CreditCard className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Paket Aktif</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-bold text-[#2A2E37]">{user.plan_code}</p>
                            </div>
                            {user.api_expires_at && (
                                <p className="text-xs text-gray-500 mt-1.5">
                                    Tersisa: <span className="font-bold text-lime-600">
                                        {Math.max(0, Math.ceil((new Date(user.api_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} hari
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs font-medium text-gray-400 bg-[#F5F5F7] inline-block px-4 py-1.5 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]">
                        Member sejak <span className="text-gray-600">{new Date(user.created_at).toLocaleDateString()}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
