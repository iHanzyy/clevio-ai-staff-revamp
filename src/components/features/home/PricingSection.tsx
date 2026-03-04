"use client";

import { useRouter } from "next/navigation";
import PricingCard from "@/components/ui/PricingCard";

// Pricing data
const pricingData = [
    {
        id: 1,
        title: "Gratis",
        subtitle: "Coba buat Staff AI Anda tanpa biaya. Cocok untuk eksplorasi awal.",
        price: "Rp 0",
        priceLabel: "/ 2 minggu",
        features: [
            "Durasi 2 Minggu (14 Days)",
            "Maksimal 1 Agent"
        ],
        buttonText: "Coba Gratis",
        isEnterprise: false
    },
    {
        id: 2,
        title: "Economy",
        subtitle: "Paket awal untuk individu yang butuh staf pintar sehari-hari.",
        price: "Rp 200rb",
        priceLabel: "/ bulan",
        features: [
            "Maksimal 1 Agent",
            "2000 Percakapan/bulan",
            "Akses MCP Tools",
            "Integrasi WhatsApp",
        ],
        buttonText: "Coba Sekarang",
        isEnterprise: false,
        isPopular: false
    },
    {
        id: 3,
        title: "Profesional",
        subtitle: "Power penuh untuk bisnis yang siap bertumbuh. Full akses tools & integrasi.",
        price: "Rp 880rb",
        priceLabel: "/ bulan",
        features: [
            "Maksimal 1 Agent",
            "Akses Full MCP Tools",
            "Integrasi WhatsApp Connect",
            "Priority Support",
        ],
        buttonText: "Coba Sekarang",
        isEnterprise: false,
        isPopular: false
    },
    {
        id: 4,
        title: "Enterprise",
        subtitle: "Solusi skala besar dengan dukungan khusus dan kustomisasi tanpa batas.",
        price: "Mari Diskusi!🙂",
        priceLabel: "",
        features: [
            "Agen Kustom Tanpa Batas",
            "Integrasi API & Tools Kustom",
            "Manajer Akun Khusus",
            "SLA & Perjanjian Kustom",
        ],
        buttonText: "Hubungi Kami",
        isEnterprise: true
    }
];

export default function PricingSection() {
    const router = useRouter();

    const handleScrollToArthur = () => {
        window.dispatchEvent(new CustomEvent('scrollToArthur'));
    };

    const handleProClick = () => {
        // Store destination for after login
        if (typeof window !== 'undefined') {
            localStorage.setItem('post_login_redirect', '/payment');
        }
        router.push('/login');
    };

    const getClickHandler = (plan: typeof pricingData[0]) => {
        if (plan.title === "Gratis") {
            return handleScrollToArthur;
        }
        if (plan.title === "Economy" || plan.title === "Profesional") {
            return handleProClick;
        }
        if (plan.title === "Enterprise") {
            return () => window.open('https://wa.me/6282221118860', '_blank');
        }
        return undefined;
    };

    return (
        <section
            className="relative w-full py-16 px-6 sm:px-8 md:px-12 lg:px-16 font-google-sans-flex"
            style={{ backgroundColor: '#FFFAF2' }}
        >
            {/* Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
                <h2 className="font-bold text-[24px] md:text-[40px] text-gray-900 mb-2 md:mb-4">
                    Pilih paket Anda
                </h2>
                <p className="font-bold text-[15px] md:text-[20px] text-gray-700">
                    Fitur canggih dengan harga terjangkau
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">
                {pricingData.map((plan) => (
                    <PricingCard
                        key={plan.id}
                        title={plan.title}
                        subtitle={plan.subtitle}
                        price={plan.price}
                        priceLabel={plan.priceLabel}
                        features={plan.features}
                        buttonText={plan.buttonText}
                        isEnterprise={plan.isEnterprise}
                        isPopular={plan.isPopular}
                        onClick={getClickHandler(plan)}
                    />
                ))}
            </div>
        </section>
    );
}
