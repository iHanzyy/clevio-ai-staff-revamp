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
    // Placeholder for more testimonials
    // {
    //     id: 2,
    //     imageSrc: "/sinta.png",
    //     name: "Sinta Kaniawati",
    //     title: "Ketua Dewan Pengurus Bina Antarbudaya",
    //     testimonial: "..."
    // },
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
        <section className="relative w-full font-google-sans-flex">
            {/* Top Wave */}
            <div className="w-full" style={{ marginBottom: '-1px' }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 390 173"
                    fill="none"
                    className="w-full h-auto"
                    preserveAspectRatio="none"
                >
                    <path d="M0 173C62.6661 91.9511 390 176.189 390 83.2405C390 -9.70837 390 0.31553 390 0.31553H0V173Z" fill="#02457A" />
                </svg>
            </div>

            {/* Main Content */}
            <div
                className="py-16 px-6 sm:px-8 md:px-12 lg:px-16"
                style={{ backgroundColor: '#FFFAF2' }}
            >
                {/* Section Header */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="font-bold text-[24px] text-gray-900 mb-3">
                        Ini kata mereka
                    </h2>
                    <p className="font-medium text-[15px] text-gray-700">
                        Mereka sudah, Anda kapan?
                    </p>
                </div>

                {/* Testimonials Carousel */}
                <div className="max-w-5xl mx-auto">
                    <div
                        ref={carouselRef}
                        onScroll={handleScroll}
                        className="flex gap-6 overflow-x-auto pb-8 pt-10 px-4 snap-x snap-mandatory scrollbar-hide"
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
                        <div className="flex justify-center gap-2 mt-6">
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
