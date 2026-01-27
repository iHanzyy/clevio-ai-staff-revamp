"use client";

import StepCard from "@/components/ui/StepCard";

// Step data - can be expanded later for steps 2 and 3
const stepsData = [
    {
        stepNumber: 1,
        imageSrc: "/caraKerjaPertama.png",
        title: "Daftar & Pilih Peran",
        description: "Buat akun dan pilih peran Staff AI yang sesuai dengan kebutuhan bisnis Anda"
    },
    {
        stepNumber: 2,
        imageSrc: "/caraKerjaKedua.png",
        title: "Kustomisasi & Latih",
        description: "Sesuaikan personality dan latih Staff AI dengan data bisnis Anda"
    },
    {
        stepNumber: 3,
        imageSrc: "/caraKerjaKetiga.png",
        title: "Aktifkan & Pantau",
        description: "Aktifkan Staff AI Anda dan pantau performanya secara real-time"
    },
];

export default function HowItWorksSection() {
    return (
        <section
            className="relative w-full py-16 px-6 sm:px-8 md:px-12 lg:px-16 font-google-sans-flex"
            style={{
                backgroundColor: '#FFFAF2'
            }}
        >
            {/* Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-3">
                    Cara Kerja Staf AI
                </h2>
                <p className="font-medium text-[15px] text-gray-700">
                    Mulai dengan Staf AI Anda dalam 3 langkah mudah
                </p>
            </div>

            {/* Steps Container */}
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-center items-start gap-4 md:gap-6 lg:gap-8">
                    {stepsData.map((step) => (
                        <StepCard
                            key={step.stepNumber}
                            stepNumber={step.stepNumber}
                            imageSrc={step.imageSrc}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
