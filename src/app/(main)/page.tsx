import HeroSection from "@/components/features/home/HeroSection";
import ArthurSection from "@/components/features/home/ArthurSection";
import HowItWorksSection from "@/components/features/home/HowItWorksSection";
import FeaturesSection from "@/components/features/home/FeaturesSection";
import TestimonialsSection from "@/components/features/home/TestimonialsSection";
import ComparisonSection from "@/components/features/home/ComparisonSection";
import PricingSection from "@/components/features/home/PricingSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <ArthurSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ComparisonSection />
      <PricingSection />
    </main>
  );
}