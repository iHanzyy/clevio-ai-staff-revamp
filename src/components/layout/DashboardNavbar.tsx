"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function DashboardNavbar({ showCreateButton = true }: { showCreateButton?: boolean }) {
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Clear tokens
        localStorage.removeItem('jwt_token');
        document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    return (
        <nav className="w-full h-20 px-6 md:px-12 flex items-center justify-between bg-[#1C1F26] text-white">
            {/* LEFT: Logo & Brand */}
            <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 md:w-10 md:h-10">
                    <Image
                        src="/clevioLogo.webp"
                        alt="Clevio Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <span className="text-xl md:text-2xl font-bold font-sans tracking-wide text-white">
                    Clevio AI Staff
                </span>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-4 md:gap-6">

                {/* Label: Paket Aktif (Dummy) */}
                <div className={cn(
                    "hidden md:flex items-center px-5 py-2.5 rounded-full font-medium text-sm",
                    "bg-[#2A2E37] text-gray-300 border border-white/5",
                    "shadow-inner",
                    "select-none"
                )}>
                    Paket aktif tersisa: 30 Hari
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={cn(
                            "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95",
                            "bg-[#2A2E37] hover:bg-[#353A45] text-white",
                            // Dark Claymorphism: Subtle Inner Highlight + Deep Inner Shadow + Drop Shadow
                            "shadow-[inset_2px_2px_4px_rgba(255,255,255,0.05),inset_-2px_-2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.4)]",
                            "hover:shadow-[inset_2px_2px_6px_rgba(255,255,255,0.08),inset_-2px_-2px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.5)]",
                            "border border-white/5",
                            "cursor-pointer"
                        )}
                    >
                        <User className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-[#1C1F26] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] animate-fade-in-down origin-top-right">
                            <div className="py-1">
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                                <div className="h-px bg-white/10 mx-2" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
}
