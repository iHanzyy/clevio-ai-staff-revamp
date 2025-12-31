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
            whileHover={{ y: -5 }}
            className={cn(
                "relative flex flex-col p-8 rounded-[32px] border transition-all duration-300",
                "w-full max-w-[400px] min-h-[500px]",
                isPopular
                    ? "bg-[#1a1a1a] text-[#F9F6EE] border-transparent shadow-2xl"
                    : "bg-white/60 backdrop-blur-xl border-white/40 text-[#1a1a1a] shadow-lg hover:shadow-xl"
            )}
        >
            {/* Popular Badge */}
            {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-[#9A8B7D] text-[#F9F6EE] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                        Most Popular
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h3 className={cn("text-2xl font-bold mb-2", isPopular ? "text-white" : "text-[#1a1a1a]")}>
                    {title}
                </h3>
                <p className={cn("text-sm mb-6", isPopular ? "text-gray-400" : "text-gray-500")}>
                    {description}
                </p>
                <div className="flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight">{price}</span>
                    {period && (
                        <span className={cn("ml-2 text-sm", isPopular ? "text-gray-400" : "text-gray-500")}>
                            {period}
                        </span>
                    )}
                </div>
            </div>

            {/* Features */}
            <div className="flex-grow mb-8">
                <span className={cn("block text-sm font-semibold mb-4", isPopular ? "text-gray-300" : "text-gray-900")}>
                    Key Features:
                </span>
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className={cn(
                                "flex items-center justify-center w-5 h-5 rounded-full mt-0.5",
                                feature.included
                                    ? (isPopular ? "bg-[#34C759]" : "bg-[#34C759]")
                                    : (isPopular ? "bg-white/10" : "bg-black/5")
                            )}>
                                {feature.included ? (
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                ) : (
                                    <X className={cn("w-3 h-3", isPopular ? "text-gray-500" : "text-gray-400")} strokeWidth={3} />
                                )}
                            </div>
                            <span className={cn(
                                "text-sm leading-6",
                                feature.included
                                    ? (isPopular ? "text-gray-200" : "text-gray-700")
                                    : (isPopular ? "text-gray-600 line-through" : "text-gray-400 line-through")
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
                    "w-full py-4 rounded-2xl font-semibold transition-all duration-300 active:scale-95",
                    isPopular
                        ? "bg-[#F9F6EE] text-[#1a1a1a] hover:bg-white"
                        : "bg-[#1a1a1a] text-white hover:bg-black/80"
                )}
            >
                {buttonText}
            </button>
        </motion.div>
    );
}
