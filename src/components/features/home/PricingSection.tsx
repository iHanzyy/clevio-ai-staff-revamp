"use client";

import PricingCard from "@/components/ui/PricingCard";

// Pricing data
const pricingData = [
    {
        id: 1,
        title: "Gratis",
        subtitle: "Sempurna untuk mencoba staf AI",
        price: "Rp. 0",
        features: [
            "1 Staf AI",
            "100 percakapan/bulan",
            "Fitur dasar",
            "Email support",
            "Dashboard analytics"
        ],
        buttonText: "Coba Gratis",
        isEnterprise: false
    },
    {
        id: 2,
        title: "Pro",
        subtitle: "Untuk bisnis yang sedang berkembang",
        price: "Rp. 1.299.000",
        features: [
            "5 staf AI",
            "Unlimited percakapan",
            "Semua fitur premium",
            "Prioritas support 24/7",
            "Advanced analytics",
            "Custom branding",
            "API acces"
        ],
        buttonText: "Coba Sekarang",
        isEnterprise: false,
        isPopular: true
    },
    {
        id: 3,
        title: "Enterprise",
        subtitle: "Solusi lengkap untuk perusahaan",
        price: "",
        features: [
            "Unlimited staf AI",
            "Unlimited percakapan",
            "Semua fitur premium",
            "Dedicated account manager",
            "Custom integration",
            "SLA guarantee",
            "Training & onboarding",
            "White-label solution"
        ],
        buttonText: "Coba Sekarang",
        isEnterprise: true
    }
];

export default function PricingSection() {
    const handleScrollToArthur = () => {
        window.dispatchEvent(new CustomEvent('scrollToArthur'));
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
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                {pricingData.map((plan) => (
                    <PricingCard
                        key={plan.id}
                        title={plan.title}
                        subtitle={plan.subtitle}
                        price={plan.price}
                        features={plan.features}
                        buttonText={plan.buttonText}
                        isEnterprise={plan.isEnterprise}
                        isPopular={plan.isPopular}
                        onClick={plan.buttonText === "Coba Gratis" ? handleScrollToArthur : undefined}
                    />
                ))}
            </div>
        </section>
    );
}
