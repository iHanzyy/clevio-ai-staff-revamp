"use client";

import { LuBrain, LuZap } from "react-icons/lu";

// Feature data
const featuresData = [
    {
        id: 1,
        icon: "clock",
        title: "Tersedia 24/7",
        description: "Staf AI Anda tidak pernah tidur dan siap melayani kapan saja"
    },
    {
        id: 2,
        icon: "brain",
        title: "Pembelajaran berkelanjutan",
        description: "Staf AI Anda tidak pernah tidur dan siap melayani kapan saja"
    },
    {
        id: 3,
        icon: "bar",
        title: "Analitik real-time",
        description: "Staf AI Anda tidak pernah tidur dan siap melayani kapan saja"
    },
    {
        id: 4,
        icon: "shield",
        title: "Keamanan terjamin",
        description: "Staf AI Anda tidak pernah tidur dan siap melayani kapan saja"
    },
    {
        id: 5,
        icon: "thunder",
        title: "Respon instan",
        description: "Staf AI Anda tidak pernah tidur dan siap melayani kapan saja"
    },
    {
        id: 6,
        icon: "web",
        title: "Multi-bahasa",
        description: "Staf AI Anda tidak pernah tidur dan siap melayani kapan saja"
    },
];

// Icon components
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="61" height="62" viewBox="0 0 61 62" fill="none">
        <g clipPath="url(#clip0_clock)">
            <g filter="url(#filter0_clock)">
                <path d="M30.4175 15.3092V30.6185L40.5564 35.7216M55.7648 30.6185C55.7648 44.7103 44.4164 56.1339 30.4175 56.1339C16.4186 56.1339 5.07031 44.7103 5.07031 30.6185C5.07031 16.5267 16.4186 5.10303 30.4175 5.10303C44.4164 5.10303 55.7648 16.5267 55.7648 30.6185Z" stroke="#02457A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges" />
            </g>
        </g>
        <defs>
            <filter id="filter0_clock" x="-3.17969" y="-3.14697" width="67.1953" height="67.5308" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="3.25" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.145098 0 0 0 0 0.388235 0 0 0 0 0.921569 0 0 0 1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <clipPath id="clip0_clock">
                <rect width="60.8333" height="61.2371" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const BarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="59" viewBox="0 0 44 59" fill="none">
        <g filter="url(#filter0_bar)">
            <path d="M21.7075 52.1342V23.6128M36.915 52.1342V6.5M6.5 52.1342V40.7257" stroke="#02457A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
            <filter id="filter0_bar" x="0" y="0" width="43.4141" height="58.6343" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="2.25" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.145098 0 0 0 0 0.388235 0 0 0 0 0.921569 0 0 0 1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
        </defs>
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="70" viewBox="0 0 60 70" fill="none">
        <g filter="url(#filter0_shield)">
            <path d="M29.5774 60.3279C29.5774 60.3279 49.8541 50.1223 49.8541 34.8139V16.954L29.5774 9.2998L9.30078 16.954V34.8139C9.30078 50.1223 29.5774 60.3279 29.5774 60.3279Z" stroke="#02457A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges" />
        </g>
        <defs>
            <filter id="filter0_shield" x="0.000781059" y="-0.000195503" width="59.1527" height="69.6283" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="3.65" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.145098 0 0 0 0 0.388235 0 0 0 0 0.921569 0 0 0 1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
        </defs>
    </svg>
);

const WebIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="63" height="64" viewBox="0 0 63 64" fill="none">
        <g filter="url(#filter0_web)">
            <path d="M56.6917 31.5141C56.6917 45.6051 45.344 57.0281 31.3458 57.0281M56.6917 31.5141C56.6917 17.423 45.344 6 31.3458 6M56.6917 31.5141H6M31.3458 57.0281C17.3477 57.0281 6 45.6051 6 31.5141M31.3458 57.0281C37.6855 50.0415 41.2884 40.9746 41.4842 31.5141C41.2884 22.0535 37.6855 12.9866 31.3458 6M31.3458 57.0281C25.0061 50.0415 21.4033 40.9746 21.2075 31.5141C21.4033 22.0535 25.0061 12.9866 31.3458 6M6 31.5141C6 17.423 17.3477 6 31.3458 6" stroke="#02457A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges" />
        </g>
        <defs>
            <filter id="filter0_web" x="0" y="0" width="62.6914" height="63.0283" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.145098 0 0 0 0 0.388235 0 0 0 0 0.921569 0 0 0 1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
        </defs>
    </svg>
);

// Icon renderer based on type
const renderIcon = (iconType: string) => {
    switch (iconType) {
        case "clock":
            return <ClockIcon />;
        case "brain":
            return <LuBrain className="w-14 h-14" style={{ color: '#02457A', filter: 'drop-shadow(0 0 6px #2563EB)', strokeWidth: '1.5px' }} />;
        case "bar":
            return <BarIcon />;
        case "shield":
            return <ShieldIcon />;
        case "thunder":
            return <LuZap className="w-12 h-12" style={{ color: '#02457A', filter: 'drop-shadow(0 0 6px #2563EB)', strokeWidth: '2px' }} />;
        case "web":
            return <WebIcon />;
        default:
            return null;
    }
};

export default function FeaturesSection() {
    return (
        <section
            className="relative w-full py-16 px-6 sm:px-8 md:px-12 lg:px-16 font-google-sans-flex"
            style={{ backgroundColor: '#02457A' }}
        >
            {/* Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="font-bold text-[24px] sm:text-3xl md:text-4xl text-white mb-3">
                    Fitur Inovatif
                </h2>
                <p className="font-medium text-[15px] text-white/90">
                    Teknologi canggih untuk mendukung kesuksesan bisnis Anda
                </p>
            </div>

            {/* Features Grid */}
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuresData.map((feature) => (
                        <div
                            key={feature.id}
                            className="bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] group"
                            style={{ borderRadius: '24px' }}
                        >
                            {/* Icon */}
                            <div className="flex justify-center items-center h-20 mb-6 group-hover:scale-110 transition-transform duration-300">
                                {renderIcon(feature.icon)}
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-xl text-[#02457A] mb-3">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="font-medium text-[15px] text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
