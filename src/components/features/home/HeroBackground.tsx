"use client";

import Image from "next/image";

export default function HeroBackground() {
    return (
        /* Fullscreen Hero Background */
        <div className="absolute inset-0 z-0 h-screen w-full overflow-hidden">
            <Image
                src="/heroBackground.webp"
                alt="Hero Background"
                fill
                priority
                className="object-cover object-center"
                onContextMenu={(e) => e.preventDefault()}
            />
            {/* Overlay for contrast (Fixed Brightness) */}
            <div className="absolute inset-0 bg-black/20" />
        </div>
    );
}