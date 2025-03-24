
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ToolsSection from "@/components/ToolsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import CursorEffect from "@/components/CursorEffect";
import { ThemeProvider } from "@/components/ThemeProvider";
import AnimatedGradientBackground from "@/components/AnimatedGradientBackground";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index: React.FC = () => {
  // Preload any additional resources
  useEffect(() => {
    document.title = "Vihaar.me | Business Growth Tools";
    
    // Force light mode
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    localStorage.setItem("vihaar-theme", "light");
  }, []);

  // Get refs for scroll reveal animations
  const heroRef = useScrollReveal({ threshold: 0.1 });
  const toolsRef = useScrollReveal({ threshold: 0.1 });
  const ctaRef = useScrollReveal({ threshold: 0.1 });
  const footerRef = useScrollReveal({ threshold: 0.1 });

  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-10">
          <AnimatedGradientBackground interactive={true} className="w-full h-full opacity-40" />
        </div>
        <CursorEffect />
        <Navbar />
        <main>
          <div ref={heroRef} id="home">
            <HeroSection />
          </div>
          <div ref={toolsRef} id="tools">
            <ToolsSection />
          </div>
          <div ref={ctaRef} id="about">
            <CTASection />
          </div>
        </main>
        <div ref={footerRef} id="contact">
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
