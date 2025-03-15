
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ToolsSection from "@/components/ToolsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import CursorEffect from "@/components/CursorEffect";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index: React.FC = () => {
  // Preload any additional resources
  useEffect(() => {
    document.title = "Vihaar.me | Business Growth Tools";
  }, []);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <CursorEffect />
        <Navbar />
        <main>
          <HeroSection />
          <ToolsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
