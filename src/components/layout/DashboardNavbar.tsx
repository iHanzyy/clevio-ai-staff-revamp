"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, User as UserIcon, Settings, LogOut, ChevronDown, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import type { User } from "@/services/authService";
import SettingsModal from "@/components/features/dashboard/SettingsModal";
import PlanRestrictionPopup from "@/components/ui/PlanRestrictionPopup";

export default function DashboardNavbar({ showCreateButton = true }: { showCreateButton?: boolean }) {
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isTrialPopupOpen, setIsTrialPopupOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
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

    // Fetch User Data
    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authService.getMe();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user", error);
                // Optional: Redirect if unauthorized, but interceptor handles it
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        authService.logout();
    };

    return (
        <>
            <nav className="w-full h-20 px-6 md:px-12 flex items-center justify-between bg-[#02457A] text-white">
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

                    {/* Label: Paket Aktif */}
                    <div className={cn(
                        "hidden md:flex items-center px-5 py-2.5 rounded-full font-medium text-sm",
                        "bg-[#2A2E37] text-gray-300 border border-white/5",
                        "shadow-inner",
                        "select-none"
                    )}>
                        Paket aktif tersisa: {user?.api_expires_at
                            ? `${Math.max(0, Math.ceil((new Date(user.api_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} Hari`
                            : "-- Hari"
                        }
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
                            <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-[#1C1F26] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-100 animate-fade-in-down origin-top-right">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setIsSettingsOpen(true);
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (user?.plan_code === 'GUEST') {
                                                setIsTrialPopupOpen(true);
                                            } else {
                                                router.push('/addons');
                                            }
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <Puzzle className="w-4 h-4" />
                                        Add-Ons
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

            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                user={user}
            />

            {/* Trial Popup */}
            <PlanRestrictionPopup
                isOpen={isTrialPopupOpen}
                onClose={() => setIsTrialPopupOpen(false)}
                type="feature"
                message="Fitur Add-Ons hanya tersedia untuk pengguna terdaftar. Silakan Sign In untuk membeli."
            />
        </>
    );
}
