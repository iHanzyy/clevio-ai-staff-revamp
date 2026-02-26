import type { Metadata } from "next";
import HeroSection from "@/components/features/home/HeroSection";
import ArthurSection from "@/components/features/home/ArthurSection";
import HowItWorksSection from "@/components/features/home/HowItWorksSection";
import FeaturesSection from "@/components/features/home/FeaturesSection";
import TestimonialsSection from "@/components/features/home/TestimonialsSection";
import ComparisonSection from "@/components/features/home/ComparisonSection";
import PricingSection from "@/components/features/home/PricingSection";
import CtaSection from "@/components/features/home/CtaSection";
import Footer from "@/components/features/home/Footer";

export const metadata: Metadata = {
  title: "Clevio AI Staff - Buat AI Agent untuk Bisnis Anda",
  description:
    "Jika AI bisa menjadi staf Anda, peran apa yang ingin Anda buat? Buat AI agent custom untuk customer service, marketing, dan sales dengan Clevio AI Staff.",
  alternates: {
    canonical: "https://chiefaiofficer.id",
  },
};

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
      <CtaSection />
      <Footer />
    </main>
  );
}