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
            className="relative bg-white p-6 pt-12 min-w-[280px] max-w-[300px] flex-shrink-0 font-google-sans-flex"
            style={{
                borderRadius: '26px',
                border: '1px solid rgba(0, 0, 0, 0.22)',
                boxShadow: '0 4px 14.6px 0 rgba(37, 99, 235, 0.40)'
            }}
        >
            {/* Profile Image - positioned at top-left overlapping card */}
            <div
                className="absolute -top-8 left-4 w-16 h-16 overflow-hidden"
                style={{
                    borderRadius: '74px',
                    border: '1px solid #2563EB',
                    background: '#2563EB',
                    boxShadow: '0 0 11.2px 0 #2563EB'
                }}
            >
                <Image
                    src={imageSrc}
                    alt={name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="mt-2">
                {/* Name */}
                <h3 className="font-semibold text-[16px] text-gray-900">
                    {name}
                </h3>

                {/* Title */}
                <p className="font-medium text-[11px] text-gray-600 mb-4">
                    {title}
                </p>

                {/* Testimonial */}
                <p className="font-normal text-[10px] text-gray-700 leading-relaxed">
                    "{testimonial}"
                </p>
            </div>
        </div>
    );
}
