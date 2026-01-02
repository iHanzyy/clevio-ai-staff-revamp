"use client"; // Komponen ini berjalan di client

import Image from "next/image";

export default function LoginBackground() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full">
            <Image
                src="/loginBackground.webp"
                alt="Login Background"
                fill
                priority
                className="object-cover object-top"
                quality={75}
                onContextMenu={(e) => e.preventDefault()}
            />
        </div>
    );
}