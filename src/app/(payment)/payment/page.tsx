"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PricingCard, { PricingFeature } from "@/components/features/payment/PricingCard";
import { paymentService, PaymentWebhookPayload } from "@/services/paymentService";
import { authService, UserInfo } from "@/services/authService";

import Image from "next/image";

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    // Fetch user info from backend API
    const fetchUserInfo = useCallback(async () => {
        try {
            const data = await authService.getMe();
            setUserInfo(data);
        } catch {
            // Token invalid or expired - redirect to login
            router.replace('/login');
        }
    }, [router]);

    // Handle token from URL (Backend redirects here with ?token=...)
    useEffect(() => {
        const token = searchParams.get('token');
        const hasCookie = document.cookie.includes('session_token=');

        if (token) {
            // Save token to localStorage (for API Calls)
            localStorage.setItem('jwt_token', token);

            // Save token to Cookie (for Middleware Protection)
            document.cookie = `session_token=${token}; path=/; max-age=604800; SameSite=Lax`;

            // Clean URL and fetch user info
            router.replace('/payment');
        } else if (!hasCookie) {
            // No token in URL AND no existing cookie = unauthorized
            router.replace('/login');
        } else {
            // Already has cookie - fetch user info
            fetchUserInfo();
        }
    }, [searchParams, router, fetchUserInfo]);

    // Handle Pro Monthly Payment via Midtrans
    const handleProPayment = async () => {
        if (!userInfo) {
            alert('Informasi user tidak ditemukan. Silakan login ulang.');
            router.push('/login');
            return;
        }

        setIsLoading(true);

        try {
            const payload: PaymentWebhookPayload = {
                user_id: userInfo.id,
                email: userInfo.email,
                plan_code: 'PRO_M',
                charge: '880000',
                harga: '880000',
                order_suffix: paymentService.generateOrderSuffix(),
                source: 'frontend',
            };

            const response = await paymentService.notifyPaymentWebhook(payload);

            if (response.payment_url || response.redirect_url) {
                // Redirect to Midtrans payment page
                window.location.href = response.payment_url || response.redirect_url || '';
            } else {
                alert('Gagal membuat order pembayaran. Silakan coba lagi.');
            }
        } catch (error) {
            alert('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (plan: string) => {
        if (plan === 'pro') {
            handleProPayment();
        } else if (plan === 'trial') {
            // Trial flow - to be implemented
            alert('Trial flow akan diimplementasikan terpisah.');
        } else if (plan === 'enterprise') {
            // Enterprise - contact sales
            window.open('https://wa.me/6281234567890', '_blank');
        }
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
        <div className="min-h-screen w-full bg-[#F9F6EE] flex flex-col items-center py-10 px-4 overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-10 max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold font-sans text-[#1a1a1a] mb-3 tracking-tight">
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
                    title="Gratis Trial"
                    price="Rp 0"
                    period="/ 14 hari"
                    description="Coba buat Staff AI Anda tanpa biaya. Cocok untuk eksplorasi awal."
                    features={trialFeatures}
                    buttonText="Coba Sekarang"
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
                    buttonText="Mulai Sekarang"
                    isPopular={true}
                    onButtonClick={() => handleSelect("pro")}
                />

                {/* Card 3: Enterprise */}
                <PricingCard
                    title="Enterprise"
                    price="Custom"
                    description="Solusi skala besar dengan dukungan khusus dan kustomisasi tanpa batas."
                    features={enterpriseFeatures}
                    buttonText="Hubungi Kami"
                    isPopular={false}
                    onButtonClick={() => handleSelect("enterprise")}
                />
            </div>

            <div className="mt-16 text-center text-[#1a1a1a]/40 text-sm">
                <p className="flex items-center justify-center gap-2">
                    Butuh bantuan memilih?
                    <span
                        onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                        className="flex items-center gap-1.5 text-[#25D366] font-semibold cursor-pointer hover:underline transition-all"
                    >
                        <Image
                            src="/iconWhatsapp.svg"
                            alt="WhatsApp"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                        />
                        Hubungi kami di WhatsApp
                    </span>
                </p>
            </div>
        </div>
    );
}
