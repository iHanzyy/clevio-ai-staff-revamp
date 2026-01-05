import HeroBackground from "@/components/features/home/HeroBackground";
import ClayInput from "@/components/ui/ClayInput";
// AgentCard removed

export default function Home() {
  return (
    <>
      <HeroBackground />

      {/* Main Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start pt-14 lg:pt-0 lg:justify-center px-4 md:px-12 lg:px-24">

        {/* Content Max Width */}
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-8">

          {/* LEFT: Text & Input */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl lg:max-w-2xl animate-fade-in lg:mt-0">
            {/* Headline */}
            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-[3rem] font-bold font-sans text-white leading-[1.2] tracking-tight drop-shadow-lg mb-6 lg:mb-8">
              Jika Anda bisa mudah membuat staf dari AI <br />
              <span className="block mt-2">APA PERAN AI ANDA?</span>
            </h1>

            {/* Main Input (Claymorphism) */}
            <ClayInput
              placeholder="Saya butuh AI Customer Service..."
              className="max-w-md lg:max-w-lg"
            />
          </div>

          {/* RIGHT: Agent Card (REMOVED as per instruction) */}
          {/* User requested to focus ONLY on left side for now. */}

        </div>
      </div>
    </>
  );
}