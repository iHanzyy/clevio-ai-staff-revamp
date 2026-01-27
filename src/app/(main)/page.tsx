import HeroSection from "@/components/features/home/HeroSection";
import ArthurSection from "@/components/features/home/ArthurSection";
import HowItWorksSection from "@/components/features/home/HowItWorksSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <ArthurSection />
      <HowItWorksSection />
    </main>
  );
}