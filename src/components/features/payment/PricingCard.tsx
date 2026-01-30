"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

export interface PricingFeature {
    text: string;
    included: boolean;
}

interface PricingCardProps {
    title: string;
    price: string;
    period?: string;
    description: string;
    features: PricingFeature[];
    buttonText: string;
    isPopular?: boolean;
    onButtonClick?: () => void;
}

export default function PricingCard({
    title,
    price,
    period,
    description,
    features,
    buttonText,
    isPopular = false,
    onButtonClick,
}: PricingCardProps) {
    return (
        <motion.div
            className={cn(
                "relative flex flex-col p-8 rounded-[32px] transition-all duration-300 border",
                "w-full max-w-[400px] min-h-[500px]",
                // Base style for all cards (Uniform)
                "bg-white/60 backdrop-blur-2xl border-white/60",
                // Conditional styling for Popular (Glow Effect)
                isPopular
                    ? "shadow-[0px_-13px_120px_0px_rgba(9,0,255,0.4)] border-blue-500/30 ring-1 ring-blue-500/50 z-10"
                    : "shadow-xl hover:shadow-2xl hover:bg-white/80"
            )}
        >
            {/* Popular Badge */}
            {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_20px_-5px_rgba(9,0,255,0.5)] uppercase tracking-wider ring-1 ring-white/20">
                        Most Popular
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                {/* Text is always dark since background is always light glass */}
                <h3 className="text-2xl font-bold mb-2 tracking-tight text-[#1a1a1a]">
                    {title}
                </h3>
                <p className="text-sm mb-6 text-gray-600/80">
                    {description}
                </p>
                <div className="flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight text-[#1a1a1a]">{price}</span>
                    {period && (
                        <span className="ml-2 text-sm text-gray-500">
                            {period}
                        </span>
                    )}
                </div>
            </div>

            {/* Features */}
            <div className="grow mb-8">
                <span className="block text-sm font-semibold mb-4 text-gray-900">
                    Key Features:
                </span>
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className={cn(
                                "flex items-center justify-center w-5 h-5 rounded-full mt-0.5 shadow-sm",
                                feature.included
                                    ? "bg-linear-to-br from-[#34C759] to-[#2DA849]"
                                    : "bg-black/5"
                            )}>
                                {feature.included ? (
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                ) : (
                                    <X className="w-3 h-3 text-gray-400" strokeWidth={3} />
                                )}
                            </div>
                            <span className={cn(
                                "text-sm leading-6",
                                feature.included
                                    ? "text-gray-700"
                                    : "text-gray-400/80 line-through"
                            )}>
                                {feature.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Button */}
            <button
                onClick={onButtonClick}
                className={cn(
                    "w-full py-4 rounded-2xl font-semibold transition-all duration-300 active:scale-95 cursor-pointer",
                    isPopular
                        // Pro Button: Gradient Blue + Shadow + Border (Reference Style)
                        ? "bg-gradient-to-t from-blue-500 to-blue-600 shadow-lg shadow-blue-800/80 border border-blue-500 text-white hover:brightness-110"
                        // Standard Button: Dark
                        : "bg-[#1a1a1a] text-white hover:bg-black/80 hover:shadow-xl shadow-lg"
                )}
            >
                {buttonText}
            </button>
        </motion.div>
    );
}
