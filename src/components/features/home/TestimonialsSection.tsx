"use client";

import { useState, useRef } from "react";
import TestimonialCard from "@/components/ui/TestimonialCard";

// Testimonial data - currently just Sara, more can be added later
const testimonialsData = [
    {
        id: 1,
        imageSrc: "/sara.png",
        name: "Sara Dhewanto",
        title: "Impact Incubator",
        testimonial: "Saya memakai staf AI untuk membantu pekerjaan saya agar tugas-tugas rutin bisa selesai lebih cepat dan akurat."
    },
    {
        id: 2,
        imageSrc: "/sinta.png",
        name: "Sinta Kaniawati",
        title: "Ketua Dewan Pengurus Bina Antarbudaya",
        testimonial: "Saya memakai staf AI untuk membantu pekerjaan saya agar tugas-tugas rutin bisa selesai lebih cepat dan akurat."
    },
    {
        id: 3,
        imageSrc: "/gatot.png",
        name: "Gatot Nuradi Sam",
        title: "Executive Director Bina Antarbudaya",
        testimonial: "Saya memakai staf AI untuk membantu pekerjaan saya agar tugas-tugas rutin bisa selesai lebih cepat dan akurat."
    },
    {
        id: 4,
        imageSrc: "/kemal.png",
        name: "Dr. Kemal H.S. Ist",
        title: "Konsultan Manajemen Governence, Risk and Compliance",
        testimonial: "Saya memakai staf AI untuk membantu pekerjaan saya agar tugas-tugas rutin bisa selesai lebih cepat dan akurat."
    }
];

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollToIndex = (index: number) => {
        if (carouselRef.current) {
            const cardWidth = 300 + 24; // card width + gap
            carouselRef.current.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
            setActiveIndex(index);
        }
    };

    const handleScroll = () => {
        if (carouselRef.current) {
            const scrollLeft = carouselRef.current.scrollLeft;
            const cardWidth = 300 + 24;
            const newIndex = Math.round(scrollLeft / cardWidth);
            setActiveIndex(newIndex);
        }
    };

    return (
        <section className="relative w-full font-google-sans-flex -mt-[2px]">
            {/* Top Wave - Fixed Height on Desktop Only */}
            <div className="w-full sm:h-[100px] sm:overflow-hidden" style={{ marginBottom: '-1px' }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 390 173"
                    fill="none"
                    className="w-full h-auto sm:h-full"
                    preserveAspectRatio="none"
                >
                    <path d="M0 173C62.6661 91.9511 390 176.189 390 83.2405C390 -9.70837 390 0.31553 390 0.31553H0V173Z" fill="#02457A" />
                </svg>
            </div>

            {/* Main Content */}
            <div style={{ backgroundColor: '#FFFAF2' }}>
                {/* Section Header */}
                <div className="max-w-4xl mx-auto text-center pt-16 mb-8 px-6 sm:px-8 md:px-12 lg:px-16">
                    <h2 className="font-bold text-[24px] text-gray-900">
                        Ini kata mereka
                    </h2>
                    <p className="font-medium text-[15px] text-gray-700">
                        Mereka sudah, Anda kapan?
                    </p>
                </div>

                {/* Testimonials Carousel - Full width, no padding */}
                <div className="w-full">
                    <div
                        ref={carouselRef}
                        onScroll={handleScroll}
                        className="flex gap-6 overflow-x-auto pb-8 pt-10 snap-x snap-mandatory scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {testimonialsData.map((testimonial) => (
                            <div key={testimonial.id} className="snap-start">
                                <TestimonialCard
                                    imageSrc={testimonial.imageSrc}
                                    name={testimonial.name}
                                    title={testimonial.title}
                                    testimonial={testimonial.testimonial}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Carousel Indicators */}
                    {testimonialsData.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6 pb-16">
                            {testimonialsData.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                        ? 'w-8 bg-gray-800'
                                        : 'w-2 bg-gray-400'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
