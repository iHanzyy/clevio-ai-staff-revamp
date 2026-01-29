"use client";

import Image from "next/image";

interface StepCardProps {
    stepNumber: number;
    imageSrc: string;
    title: string;
    description: string;
    priority?: boolean;
}

export default function StepCard({ stepNumber, imageSrc, title, description, priority = false }: StepCardProps) {
    return (
        <div className="relative w-full max-w-[349px] mx-auto">
            {/* Step Number Badge - positioned top-left, overlapping the card */}
            <div
                className="absolute -top-7 left-5 z-10 w-[68px] h-[68px] flex items-center justify-center font-google-sans-flex font-bold text-2xl text-white"
                style={{
                    backgroundColor: '#1E293B',
                    borderRadius: '17px'
                }}
            >
                {stepNumber}
            </div>

            {/* Card Container */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    background: 'linear-gradient(0deg, #FFFAF2 0%, #C3D2F4 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '16px'
                }}
            >
                {/* Image */}
                <div className="relative w-full aspect-video overflow-hidden mx-4 mt-4" style={{ borderRadius: '20px', width: 'calc(100% - 32px)' }}>
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        priority={priority}
                        sizes="(max-width: 768px) 100vw, 350px"
                        className="object-cover"
                        style={{ borderRadius: '20px' }}
                    />
                </div>

                {/* Content */}
                <div className="p-4 pb-8">
                    <h3 className="font-google-sans-flex font-bold text-xl text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="font-google-sans-flex font-medium text-sm text-gray-700 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
