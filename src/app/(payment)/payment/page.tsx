"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PricingCard, { PricingFeature } from "@/components/features/payment/PricingCard";

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Handle token from URL (Backend redirects here with ?token=...)
    useEffect(() => {
        const token = searchParams.get('token');
        const hasCookie = document.cookie.includes('session_token=');

        if (token) {
            // Save token to localStorage (for API Calls)
            localStorage.setItem('jwt_token', token);

            // Save token to Cookie (for Middleware Protection)
            document.cookie = `session_token=${token}; path=/; max-age=604800; SameSite=Lax`;

            // Clean URL (remove query params) - soft redirect
            router.replace('/payment');
        } else if (!hasCookie) {
            // No token in URL AND no existing cookie = unauthorized
            router.replace('/login');
        }
    }, [searchParams, router]);

    const handleSelect = (plan: string) => {
        // Future integration: Payment Gateway
    };

    const trialFeatures: PricingFeature[] = [
        { text: "Durasi 2 Minggu (14 Days)", included: true },
        { text: "Maksimal 1 Agent", included: true },
        { text: "Akses MCP Tools", included: false },
        { text: "Integrasi WhatsApp", included: false },
    ];

    const proFeatures: PricingFeature[] = [
        { text: "Maksimal 1 Agent", included: true },
        { text: "Akses Full MCP Tools", included: true },
        { text: "Integrasi WhatsApp Connect", included: true },
        { text: "Priority Support", included: true },
    ];

    const enterpriseFeatures: PricingFeature[] = [
        { text: "Unlimited Custom Agents", included: true },
        { text: "Custom API & Tools Integration", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "Custom SLA & Agreement", included: true },
    ];

    return (
        <div className="min-h-screen w-full bg-[#F9F6EE] flex flex-col items-center py-20 px-4 overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-16 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold font-sans text-[#1a1a1a] mb-6 tracking-tight">
                    Pilih Paket AI Staff Anda
                </h1>
                <p className="text-lg text-[#1a1a1a]/60 leading-relaxed">
                    Investasi cerdas untuk produktivitas tanpa batas. Mulai dari trial gratis hingga solusi enterprise yang disesuaikan untuk bisnis Anda.
                </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl w-full items-start justify-items-center">
                {/* Card 1: Gratis / Trial */}
                <PricingCard
                    title="Starter Trial"
                    price="Rp 0"
                    period="/ 14 hari"
                    description="Coba kecerdasan AI Staff tanpa biaya. Cocok untuk eksplorasi awal."
                    features={trialFeatures}
                    buttonText="Start Free Trial"
                    isPopular={false}
                    onButtonClick={() => handleSelect("trial")}
                />

                {/* Card 2: Bulanan (Pro) */}
                <PricingCard
                    title="Pro Monthly"
                    price="Rp 880rb"
                    period="/ bulan"
                    description="Power penuh untuk bisnis yang siap bertumbuh. Full akses tools & integrasi."
                    features={proFeatures}
                    buttonText="Choose Pro"
                    isPopular={true}
                    onButtonClick={() => handleSelect("pro")}
                />

                {/* Card 3: Enterprise */}
                <PricingCard
                    title="Enterprise"
                    price="Custom"
                    description="Solusi skala besar dengan dukungan khusus dan kustomisasi tanpa batas."
                    features={enterpriseFeatures}
                    buttonText="Contact Sales"
                    isPopular={false}
                    onButtonClick={() => handleSelect("enterprise")}
                />
            </div>

            <div className="mt-16 text-center text-[#1a1a1a]/40 text-sm">
                <p>Butuh bantuan memilih? <span className="underline cursor-pointer hover:text-black">Hubungi kami di WhatsApp</span></p>
            </div>
        </div>
    );
}
