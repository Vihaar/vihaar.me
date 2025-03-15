
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ToolsSection from "@/components/ToolsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import CursorEffect from "@/components/CursorEffect";
import { ThemeProvider } from "@/components/ThemeProvider";
import AnimatedGradientBackground from "@/components/AnimatedGradientBackground";

const Index: React.FC = () => {
  // Preload any additional resources
  useEffect(() => {
    document.title = "Vihaar.me | Business Growth Tools";
    
    // Force light mode
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    localStorage.setItem("vihaar-theme", "light");
  }, []);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-10">
          <AnimatedGradientBackground interactive={true} className="w-full h-full opacity-40" />
        </div>
        <CursorEffect />
        <Navbar />
        <main>
          <section id="home">
            <HeroSection />
          </section>
          <section id="tools">
            <ToolsSection />
          </section>
          <section id="about">
            <CTASection />
          </section>
        </main>
        <section id="contact">
          <Footer />
        </section>
      </div>
    </ThemeProvider>
  );
};

export default Index;
