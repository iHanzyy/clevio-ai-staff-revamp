"use client";

import { LuCheck } from "react-icons/lu";

interface PricingCardProps {
    title: string;
    subtitle: string;
    price?: string;
    priceLabel?: string;
    features: string[];
    buttonText: string;
    isEnterprise?: boolean;
    isPopular?: boolean;
}

export default function PricingCard({
    title,
    subtitle,
    price,
    priceLabel = "/Bulan",
    features,
    buttonText,
    isEnterprise = false,
    isPopular = false
}: PricingCardProps) {
    return (
        <div
            suppressHydrationWarning={true}
            className={`relative p-6 flex flex-col font-google-sans-flex ${isPopular ? 'scale-105 z-10' : ''}`}
            style={{
                borderRadius: '22px',
                border: isPopular ? '2px solid #2563EB' : '1px solid rgba(0, 0, 0, 0.40)',
                background: 'linear-gradient(0deg, #FFFAF2 0%, #C3D2F4 100%)',
                boxShadow: isPopular
                    ? '0 8px 30px 0 rgba(37, 99, 235, 0.5)'
                    : '0 4px 11.6px 0 rgba(2, 91, 255, 0.37)'
            }}
        >
            {/* Title */}
            <h3
                className="font-bold text-[24px]"
                style={{ color: '#02457A' }}
            >
                {title}
            </h3>

            {/* Subtitle */}
            <p
                className="font-normal text-[15px] mb-4"
                style={{ color: '#02457A' }}
            >
                {subtitle}
            </p>

            {/* Price or Custom Text */}
            {isEnterprise ? (
                <p
                    className="font-bold text-[24px] mb-6"
                    style={{ color: '#02457A' }}
                >
                    Mari berdiskusi!
                </p>
            ) : (
                <p className="mb-6">
                    <span
                        className="font-bold text-[24px]"
                        style={{ color: '#02457A' }}
                    >
                        {price}
                    </span>
                    <span
                        className="font-normal text-[14px]"
                        style={{ color: '#02457A' }}
                    >
                        {priceLabel}
                    </span>
                </p>
            )}

            {/* Features List */}
            <ul className="flex flex-col gap-3 mb-8 grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <LuCheck
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: '#10B981' }}
                        />
                        <span className="text-[14px] text-gray-800">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <button
                className="w-full py-3 text-white font-medium text-[15px] transition-all duration-300 hover:opacity-90"
                style={{
                    borderRadius: '30px',
                    background: '#2563EB',
                    boxShadow: '0 0 20.4px 0 rgba(37, 99, 235, 0.57)'
                }}
            >
                {buttonText}
            </button>
        </div>
    );
}

