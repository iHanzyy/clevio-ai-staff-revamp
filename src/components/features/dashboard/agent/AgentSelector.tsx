"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AgentSelector() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={cn(
            "w-full px-6 py-4 rounded-[1rem]",
            "bg-[#FDFDFD]", // White Clay
            "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
        )}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 w-full md:w-auto">
                    <label className="text-gray-900 font-bold text-lg">Pilih Agen</label>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={cn(
                                "flex items-center justify-between w-full md:w-64 px-4 py-2.5 rounded-xl text-left",
                                "bg-white border border-gray-200 text-gray-900 font-bold", // Active: Bold Dark
                                "shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
                            )}
                        >
                            <span>Asdos Bot</span>
                            <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                        </button>

                        {/* Dropdown Menu (Click-based) */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-fade-in-up">
                                <div
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-900 font-bold bg-gray-50 rounded-lg cursor-pointer flex justify-between items-center"
                                >
                                    Asdos Bot
                                    <div className="w-2 h-2 rounded-full bg-[#2A2E37]"></div>
                                </div>
                                <div
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                                >
                                    Marketing Agent
                                </div>
                                <div className="h-px bg-gray-100 my-1"></div>
                                <div
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="px-4 py-2 text-sm text-[#2A2E37] font-bold hover:bg-gray-50 rounded-lg cursor-pointer flex items-center gap-2"
                                >
                                    + Buat Agent Baru
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-right text-sm font-semibold text-gray-900">
                    Sisa token chat Agent: <span className="text-gray-900">200 Pesan</span>
                </div>
            </div>
        </div>
    );
}
