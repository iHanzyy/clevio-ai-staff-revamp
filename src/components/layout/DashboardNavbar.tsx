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
            <nav className="relative w-full h-20 px-6 md:px-12 flex items-center justify-between bg-[#02457A] text-white">
                {/* LEFT: Logo & Brand */}
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 md:w-16 md:h-16">
                        <Image
                            src="/clevioLogo_figma.png"
                            alt="Clevio Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* CENTER: Title */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                    <span className="font-sans font-semibold text-2xl md:text-4xl text-white tracking-tight selection:bg-white/20">
                        Atur Staf AI mu
                    </span>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-4 md:gap-6">

                    {/* Upgrade Plan Link */}
                    {(user?.plan_code === 'GUEST' || user?.plan_code === 'TRIAL') && (
                        <Link 
                            href="/payment"
                            className="flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-white/90 hover:text-white transition-colors duration-200 group"
                        >
                            <span className="text-yellow-400">✨</span>
                            <span className="group-hover:underline underline-offset-4 decoration-white/50">Upgrade Paket</span>
                        </Link>
                    )}

                    {/* Label: Paket Aktif */}
                    <div className={cn(
                        "hidden md:flex items-center px-5 py-2.5 rounded-full font-medium text-sm",
                        "bg-white text-black", // User Req: White background
                        "shadow-lg",
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
                                "w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-all duration-300 active:scale-95",
                                "bg-white hover:bg-gray-100 text-black", // User Req: White background
                                "shadow-lg",
                                "border border-black/5",
                                "cursor-pointer"
                            )}
                        >
                            <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-100 animate-fade-in-down origin-top-right text-black">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setIsSettingsOpen(true);
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
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
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <Puzzle className="w-4 h-4" />
                                        Add-Ons
                                    </button>
                                    <div className="h-px bg-gray-100 mx-2" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
