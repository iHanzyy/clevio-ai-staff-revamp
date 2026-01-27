"use client";

import Image from "next/image";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

// Navigation links based on landing page sections
const navLinks = [
    { label: "Blog", href: "#" },
    { label: "Pricing", href: "#pricing" },
    { label: "Fitur", href: "#features" },
    { label: "Cara Kerja", href: "#how-it-works" },
    { label: "Whatsapp Support", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
];

export default function Footer() {
    return (
        <footer
            className="w-full py-12 px-6 sm:px-8 md:px-12 lg:px-16 font-google-sans-flex"
            style={{ backgroundColor: '#1E293B' }}
        >
            <div className="max-w-4xl mx-auto">
                {/* Logo */}
                <div className="mb-8">
                    <Image
                        src="/brandFooter.png"
                        alt="Clevio AI Staff"
                        width={99}
                        height={66}
                        className="object-contain"
                    />
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-4 mb-8">
                    <a
                        href="#"
                        className="text-white hover:opacity-80 transition-opacity"
                        aria-label="WhatsApp"
                    >
                        <FaWhatsapp className="w-6 h-6" />
                    </a>
                    <a
                        href="#"
                        className="text-white hover:opacity-80 transition-opacity"
                        aria-label="Instagram"
                    >
                        <FaInstagram className="w-6 h-6" />
                    </a>
                </div>

                {/* Company Name */}
                <h3 className="font-bold text-white text-[15px] mb-6">
                    PT. Clevio
                </h3>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-3 mb-12">
                    {navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="text-white text-[15px] hover:underline transition-all"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Divider */}
                <div className="w-full h-px bg-white/20 mb-6"></div>

                {/* Copyright */}
                <p
                    className="font-semibold text-[15px] text-white text-center"
                >
                    © 2026 Clevio AI Staff. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
