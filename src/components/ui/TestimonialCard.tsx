"use client";

import Image from "next/image";

interface TestimonialCardProps {
    imageSrc: string;
    name: string;
    title: string;
    testimonial: string;
}

export default function TestimonialCard({ imageSrc, name, title, testimonial }: TestimonialCardProps) {
    return (
        <div
            className="relative bg-white p-6 pt-12 md:pt-16 h-full flex flex-col min-w-[280px] max-w-[300px] md:min-w-0 md:max-w-none md:w-full flex-shrink-0 font-google-sans-flex"
            style={{
                borderRadius: '26px',
                border: '1px solid rgba(0, 0, 0, 0.22)',
                boxShadow: '0 4px 14.6px 0 rgba(37, 99, 235, 0.40)'
            }}
        >
            {/* Profile Image - positioned at top-left overlapping card */}
            <div
                className="absolute -top-10 left-5 w-20 h-20 md:w-24 md:h-24 md:-top-12 overflow-hidden"
                style={{
                    borderRadius: '74px',
                    border: '1px solid #2563EB',
                    background: '#2563EB',
                }}
            >
                <Image
                    src={imageSrc}
                    alt={name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="mt-2 md:mt-4 flex-grow flex flex-col">
                {/* Name */}
                <h3 className="font-semibold text-[16px] md:text-[20px] text-gray-900 leading-tight">
                    {name}
                </h3>

                {/* Title */}
                <p className="font-medium text-[11px] md:text-[14px] text-gray-600 mb-4 md:mb-6 leading-tight">
                    {title}
                </p>

                {/* Testimonial */}
                <p className="font-normal text-[10px] md:text-[14px] text-gray-700 leading-relaxed flex-grow">
                    "{testimonial}"
                </p>
            </div>
        </div>
    );
}
