"use client";

import { useState } from "react";
import {
    LuGem,
    LuZap,
    LuTrendingUp,
    LuCircleCheck,
    LuRocket,
    LuBanknote,
    LuClock,
    LuUsers,
    LuChartColumn,
    LuBookOpen
} from "react-icons/lu";

// Data for Staf AI
const staffAIData = [
    {
        id: 1,
        icon: LuGem,
        title: "Biaya Tetap & Predictable",
        description: "Langganan bulanan tanpa hidden cost"
    },
    {
        id: 2,
        icon: LuZap,
        title: "Operasional 24/7",
        description: "Tidak butuh istirahat atau cuti"
    },
    {
        id: 3,
        icon: LuTrendingUp,
        title: "Skalabilitas Instant",
        description: "Handle ratusan customer simultan"
    },
    {
        id: 4,
        icon: LuCircleCheck,
        title: "Konsistensi Terjamin",
        description: "Selalu follow SOP, zero human error"
    },
    {
        id: 5,
        icon: LuRocket,
        title: "Onboarding Cepat",
        description: "Siap produktif dalam hitungan menit"
    },
];

// Data for Staf Biasa
const staffBiasaData = [
    {
        id: 1,
        icon: LuBanknote,
        title: "Biaya Kompleks",
        description: "Gaji + benefit + training + equipment"
    },
    {
        id: 2,
        icon: LuClock,
        title: "Jam Kerja Terbatas",
        description: "8 jam/hari dengan break dan overtime"
    },
    {
        id: 3,
        icon: LuUsers,
        title: "Kapasitas Linear",
        description: "1 staff = 1-3 customer per waktu"
    },
    {
        id: 4,
        icon: LuChartColumn,
        title: "Performa Variabel",
        description: "Tergantung mood dan motivasi"
    },
    {
        id: 5,
        icon: LuBookOpen,
        title: "Training 2-4 Minggu",
        description: "Learning curve panjang sebelum produktif"
    },
];

export default function ComparisonSection() {
    const [activeTab, setActiveTab] = useState<'ai' | 'biasa'>('ai');

    const currentData = activeTab === 'ai' ? staffAIData : staffBiasaData;
    const accentColor = activeTab === 'ai' ? '#2563EB' : '#6B7280';

    return (
        <section
            className="relative w-full py-16 px-6 sm:px-8 md:px-12 lg:px-16 font-google-sans-flex"
            style={{ backgroundColor: '#FFFAF2' }}
        >
            {/* Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
                <h2 className="font-bold text-[24px] md:text-[40px] mb-3 md:mb-6">
                    <span className="text-[#2563EB]">Staf AI</span>
                    <span className="text-[#2563EB] text-sm md:text-2xl align-top">✦</span>
                    <span className="text-gray-900"> VS Staf Biasa</span>
                </h2>
                <p className="font-medium text-[15px] md:text-[20px] text-gray-700 leading-relaxed">
                    Lihat perbedaan signifikan antara<br />
                    <span className="text-[#2563EB]">Staf AI</span>
                    {' '}dan Staf Biasa
                </p>
            </div>

            {/* Tab Toggle */}
            <div className="flex justify-center mb-10">
                <div
                    className="flex p-1"
                    style={{
                        backgroundColor: '#E5E7EB',
                        borderRadius: '30px'
                    }}
                >
                    <button
                        onClick={() => setActiveTab('ai')}
                        className="px-6 py-2 text-sm font-medium transition-all duration-300"
                        style={{
                            borderRadius: '30px',
                            backgroundColor: activeTab === 'ai' ? '#2563EB' : 'transparent',
                            color: activeTab === 'ai' ? 'white' : '#6B7280'
                        }}
                    >
                        Staf AI
                    </button>
                    <button
                        onClick={() => setActiveTab('biasa')}
                        className="px-6 py-2 text-sm font-medium transition-all duration-300"
                        style={{
                            borderRadius: '30px',
                            backgroundColor: activeTab === 'biasa' ? '#6B7280' : 'transparent',
                            color: activeTab === 'biasa' ? 'white' : '#6B7280'
                        }}
                    >
                        Staf Biasa
                    </button>
                </div>
            </div>

            {/* Comparison Cards */}
            <div className="max-w-2xl md:max-w-4xl mx-auto flex flex-col gap-4 md:gap-6">
                {currentData.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 md:gap-8 bg-white p-4 md:p-8 transition-all duration-300"
                            style={{
                                borderRadius: '20px',
                                borderLeft: `4px solid ${accentColor}`,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            {/* Icon */}
                            <div
                                className="flex-shrink-0 w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-xl md:rounded-2xl"
                                style={{
                                    backgroundColor: activeTab === 'ai' ? '#EFF6FF' : '#F3F4F6'
                                }}
                            >
                                <IconComponent
                                    className="w-6 h-6 md:w-10 md:h-10"
                                    style={{ color: accentColor }}
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="font-bold text-[16px] md:text-[24px] text-gray-900 mb-1 md:mb-2">
                                    {item.title}
                                </h3>
                                <p className="font-normal text-[13px] md:text-[18px] text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
