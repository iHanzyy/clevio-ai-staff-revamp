import Image from "next/image";

export default function HeroSection() {
  const chips = [
    "Customer Service",
    "Marketing Assistant",
    "Support Agent",
    "Sales Assistant",
  ];
  const marqueeChips = [...chips, ...chips, ...chips, ...chips];

  return (
    <div className="relative min-h-svh w-full overflow-hidden font-google-sans-flex">
      {/* Background Image - Fixed height at top */}
      <div className="absolute top-0 left-0 right-0 h-114 z-0">
        <Image
          src="/heroBackground.png"
          alt="Office Background"
          fill
          priority
          className="object-cover object-center"
          quality={100}
        />
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-25">
        {/* Main Text Content */}
        <div className="relative w-full flex flex-col items-center text-center max-w-85 sm:max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-7 scale-[3] sm:scale-[3] z-0">
            <Image
              src="/shadow.png"
              alt=""
              width={1378}
              height={1359}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="relative z-10 text-[28px] sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg mb-5 sm:mb-8">
            Jika AI bisa menjadi staf Anda, peran apa yang ingin Anda buat?
          </h1>

          {/* Search Input Container with Button Inside */}
          <div className="relative z-10 w-full max-w-[320px] sm:max-w-md">
            <div className="relative bg-white rounded-full shadow-2xl pl-5 pr-12 py-4">
              <input
                type="text"
                placeholder="Ketik disini......."
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-base"
                disabled
              />
              {/* Button INSIDE input */}
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 bg-[#2563EB] rounded-full flex items-center justify-center hover:bg-[#1d4ed8] transition-colors shadow-lg"
                aria-label="Search"
              >
                <div className="h-5 w-5 relative">
                  <Image
                    src="/starIcon.png"
                    alt="Star"
                    fill
                    className="object-contain"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Chips - Marquee */}
        <div className="mt-6 w-full overflow-hidden px-6 sm:mt-0 sm:absolute sm:bottom-6 sm:left-0 sm:right-0">
          <div className="flex animate-marquee-scroll px-4">
            {marqueeChips.map((label, index) => (
              <button
                key={`chip-${index}`}
                className="mx-2 px-5 py-2 rounded-full bg-[#02457A] text-white text-[10px] font-medium shadow-lg hover:bg-[#035696] transition-all shrink-0 cursor-pointer whitespace-nowrap"
              >
                {label}
              </button>
            ))}
            {marqueeChips.map((label, index) => (
              <button
                key={`chip-dup-${index}`}
                className="mx-2 px-5 py-2 rounded-full bg-[#02457A] text-white text-[10px] font-medium shadow-lg hover:bg-[#035696] transition-all shrink-0 cursor-pointer whitespace-nowrap"
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
