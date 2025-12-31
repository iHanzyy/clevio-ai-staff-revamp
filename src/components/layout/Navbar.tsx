"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavbarProps {
    className?: string;
}

export function Navbar({ className }: NavbarProps) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    // Consider /login as the Dashboard active state for now as requested
    const isDashboard = pathname === "/login" || pathname === "/dashboard";


    return (
        <nav
            className={cn(
                "flex items-center justify-between px-[60px]",
                // Dimensions & Background
                // Width: 956px (responsive: scales down on smaller screens)
                "w-full max-w-[1000px] h-[80px]",
                // Liquid Glass Effect (Apple Tech Elegant)
                "bg-[#F9F6EE]/20 backdrop-blur-xl backdrop-saturate-150",
                "border border-white/10",
                "rounded-[30px]",
                // Shadow (exact values from design)
                "shadow-[0_452px_127px_0_rgba(0,0,0,0.01),0_289px_116px_0_rgba(0,0,0,0.04),0_163px_98px_0_rgba(0,0,0,0.15),0_72px_72px_0_rgba(0,0,0,0.26),0_18px_40px_0_rgba(0,0,0,0.29)]",
                className
            )}
        >
            {/* Logo Section */}
            <div className="flex-shrink-0">
                <Image
                    src="/clevioLogo.webp"
                    alt="Clevio Logo"
                    width={60.054}
                    height={62.943}
                    style={{
                        width: "60.054px",
                        height: "62.943px",
                        objectFit: "contain",
                    }}
                    priority
                />
            </div>

            {/* Navigation Links */}
            {/* Navigation Links */}
            <div
                className="flex justify-center items-center gap-[30px]"
                style={{ width: "249px" }}
            >
                {[
                    { name: "Home", path: "/" },
                    { name: "Dashboard", path: "/login" }, // Use /login as dashboard link for now
                ].map((item) => {
                    const isActive = pathname === item.path || (item.path === "/login" && pathname === "/dashboard");

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="relative flex flex-col items-center justify-center p-2"
                        >
                            <span className={cn(
                                "text-[24px] leading-normal font-sans transition-colors duration-300",
                                isActive ? "text-black font-bold" : "text-black/60 font-medium hover:text-black"
                            )}>
                                {item.name}
                            </span>

                            {/* Animated Underline */}
                            {isActive && (
                                <motion.div
                                    layoutId="navbar-underline"
                                    className="absolute top-full w-[81px] h-[3px] bg-black rounded-[30px]"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
