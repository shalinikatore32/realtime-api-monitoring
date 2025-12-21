import { Navbar } from "@/components/landing-page/Navbar";
import HeroSection from "@/components/landing-page/Hero";
import Features from "@/components/landing-page/Features";
import LiveStatus from "@/components/landing-page/LiveStatus";
import HowItWorks from "@/components/landing-page/HowItWorks";
import Architecture from "@/components/landing-page/Architecture";
import FinalCTA from "@/components/landing-page/FinalCTA";
import Footer from "@/components/landing-page/Footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#05070A]">
      <Navbar />
      <HeroSection />

      {/* Next sections go here */}
      <Features />
      <HowItWorks />
      <LiveStatus />
      <Architecture />
      <FinalCTA />
      <Footer />
    </main>
  );
}
