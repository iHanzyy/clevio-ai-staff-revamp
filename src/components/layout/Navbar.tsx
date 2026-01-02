"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
    className?: string;
}

export function Navbar({ className }: NavbarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isHome = pathname === "/";
    // Consider /login as the Dashboard active state for now as requested
    const isDashboard = pathname === "/login" || pathname === "/dashboard";

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/login" },
    ];

    return (
        <>
            <nav
                className={cn(
                    "flex items-center justify-between px-5 py-2 md:px-6 md:py-2.5",
                    // Dimensions & Background
                    "w-[95%] max-w-7xl h-auto min-h-[50px] md:min-h-[64px]",
                    // Liquid Glass Effect (Apple Tech Elegant - Glassmorphism)
                    "bg-white/20 backdrop-blur-xl backdrop-saturate-150",
                    "border border-white/30",
                    "rounded-full",
                    // Shadow
                    "shadow-[0_452px_127px_0_rgba(0,0,0,0.01),0_289px_116px_0_rgba(0,0,0,0.04),0_163px_98px_0_rgba(0,0,0,0.15)]",
                    className,
                    "relative z-50 transition-all duration-300"
                )}
            >
                {/* Logo Section */}
                <div className="flex-shrink-0 ml-1 md:ml-2">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <Image
                            src="/clevioLogo.webp"
                            alt="Clevio Logo"
                            width={32}
                            height={34}
                            className="w-auto h-[34px] md:h-[40px] object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex justify-center items-center gap-4 mr-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (item.path === "/login" && pathname === "/dashboard");

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className="relative flex items-center justify-center px-6 py-2 rounded-full transition-all duration-300"
                            >
                                {/* Active State Capsule Background */}
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-active-pill"
                                        className="absolute inset-0 bg-white/40 shadow-sm rounded-full"
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25
                                        }}
                                    />
                                )}

                                <span className={cn(
                                    "relative z-10 text-[15px] leading-normal font-sans font-semibold transition-colors duration-200",
                                    isActive ? "text-black" : "text-black/60 hover:text-black"
                                )}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="md:hidden mr-1">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-black/80" />
                        ) : (
                            <Menu className="w-6 h-6 text-black/80" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay (Detached Floating Card - Cekat.ai Style) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 25
                        }}
                        className="fixed left-0 right-0 z-[49] px-6 md:px-8 pointer-events-none"
                        style={{ top: "75px" }} // Positioned just below the navbar (approx 50px + 25px gap)
                    >
                        {/* Card Container */}
                        <div className="w-[95%] max-w-7xl mx-auto pointer-events-auto mt-2">
                            <div className={cn(
                                "flex flex-col w-full rounded-[2rem] overflow-hidden",
                                // Adjusted Glassmorphism - Slightly more transparent to optically match top navbar
                                "bg-white/15 backdrop-blur-xl backdrop-saturate-150",
                                "border border-white/20",
                                "shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]"
                            )}>

                                {/* Menu Items */}
                                <div className="flex flex-col p-3 space-y-2">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.path || (item.path === "/login" && pathname === "/dashboard");
                                        return (
                                            <Link
                                                key={item.path}
                                                href={item.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={cn(
                                                    "flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-200 group",
                                                    isActive
                                                        ? "bg-white/60 shadow-sm"
                                                        : "hover:bg-white/30"
                                                )}
                                            >
                                                <span className={cn(
                                                    "text-lg font-medium",
                                                    isActive ? "text-black font-semibold" : "text-black/70"
                                                )}>
                                                    {item.name}
                                                </span>

                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

