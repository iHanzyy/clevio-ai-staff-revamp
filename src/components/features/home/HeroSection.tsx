"use client";

import Image from "next/image";
import { useState } from "react";

export default function HeroSection() {
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  const chips = [
    "Customer Service",
    "Marketing Assistant",
    "Support Agent",
    "Sales Assistant",
  ];
  const marqueeChips = [...chips, ...chips, ...chips, ...chips];

  const handleInputClick = () => {
    window.dispatchEvent(new CustomEvent('scrollToArthur'));
  };

  const handleChipClick = (label: string) => {
    // Pause marquee briefly
    setIsMarqueePaused(true);
    setTimeout(() => setIsMarqueePaused(false), 1500);

    // Dispatch event to Arthur with message
    const message = `Saya ingin membuat ${label} agent`;
    window.dispatchEvent(new CustomEvent('sendToArthur', { detail: { message } }));
  };

  return (
    <div className="relative min-h-[90vh] sm:min-h-[837px] w-full overflow-hidden font-google-sans-flex">
      {/* Background Image - Fixed height at top */}
      <div className="absolute top-0 left-0 right-0 h-[80vh] sm:h-auto sm:bottom-0 z-0">
        <Image
          src="/heroBackground.png"
          alt="Office Background"
          fill
          priority
          className="object-cover object-top sm:object-center"
          quality={100}
        />
        {/* Gradient Overlay for Smooth Transition */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/90 sm:to-white pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent" />
      </div>

      {/* Content Container - Lifted up on Desktop, Centered on Mobile */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center sm:justify-start pt-24 sm:pt-100">
        {/* Main Text Content */}
        <div className="relative w-full flex flex-col items-center text-center max-w-sm sm:max-w-3xl mx-auto px-4">
          {/* Shadow Image - Mobile Only */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-5 scale-[2.5] sm:hidden z-0 opacity-80">
            <Image
              src="/shadow.png"
              alt=""
              width={1378}
              height={1359}
              className="object-contain"
              priority
            />
          </div>

          {/* Desktop Purple Glow */}
          <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#2563EB]/20 blur-[100px] rounded-full z-0 mixer-blend-multiply pointer-events-none" />

          <h1 className="relative z-10 text-[28px] sm:text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg mb-8 sm:mb-10 tracking-tight">
            Jika AI bisa menjadi staf Anda,<br className="hidden sm:block" /> peran apa yang ingin Anda buat?
          </h1>

          {/* Search Input Container with Button Inside */}
          <div className="relative z-10 w-full max-w-[320px] sm:max-w-2xl">
            <div
              onClick={handleInputClick}
              className="relative bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] pl-6 pr-14 py-4 sm:py-5 border border-white/50 backdrop-blur-sm cursor-pointer hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-shadow"
            >
              <input
                type="text"
                placeholder="Ketik disini......."
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-base sm:text-lg pointer-events-none"
                readOnly
              />
              {/* Button INSIDE input */}
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-[#2563EB] rounded-full flex items-center justify-center hover:bg-[#1d4ed8] transition-colors shadow-lg"
                aria-label="Search"
              >
                <div className="h-5 w-5 sm:h-6 sm:w-6 relative">
                  <Image
                    src="/starIcon.png"
                    alt="Star"
                    fill
                    sizes="24px"
                    className="object-contain"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Chips - Marquee (Now flowing below input) */}
        <div className="mt-8 sm:mt-16 w-full overflow-hidden relative z-20">
          <div className={`flex ${isMarqueePaused ? '' : 'animate-marquee-scroll'} px-4`}>
            {marqueeChips.map((label, index) => (
              <button
                key={`chip-${index}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleChipClick(label);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleChipClick(label);
                }}
                className="marquee-chip mx-3 px-6 py-3 rounded-full bg-[#02457A] text-white text-sm font-medium shadow-lg active:bg-[#035696] active:scale-95 transition-all shrink-0 cursor-pointer whitespace-nowrap border border-white/10"
              >
                {label}
              </button>
            ))}
            {marqueeChips.map((label, index) => (
              <button
                key={`chip-dup-${index}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleChipClick(label);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleChipClick(label);
                }}
                className="marquee-chip mx-3 px-6 py-3 rounded-full bg-[#02457A] text-white text-sm font-medium shadow-lg active:bg-[#035696] active:scale-95 transition-all shrink-0 cursor-pointer whitespace-nowrap border border-white/10"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

