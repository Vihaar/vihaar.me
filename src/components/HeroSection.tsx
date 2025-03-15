
import React from "react";
import { ParallaxContainer, ParallaxLayer } from "./Parallax";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedGradientBackground from "./AnimatedGradientBackground";

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background elements with parallax effect */}
      <ParallaxContainer className="absolute inset-0 -z-10">
        <ParallaxLayer speed={0.2} className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-40 right-1/5 w-72 h-72 rounded-full bg-secondary/30 blur-3xl" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.4} className="absolute inset-0">
          <div className="grid grid-cols-6 gap-4 opacity-5">
            {Array.from({ length: 60 }).map((_, index) => (
              <div 
                key={index} 
                className="h-16 bg-primary rounded-full"
                style={{ 
                  opacity: Math.random() * 0.5,
                  transform: `scale(${Math.random() * 0.5 + 0.5})`,
                }}
              />
            ))}
          </div>
        </ParallaxLayer>
      </ParallaxContainer>

      <div className="container pt-40 pb-20 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <ParallaxLayer speed={-0.2} className="relative">
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight">
              <span className="relative z-10">Hi, I'm </span>
              <span className="relative inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Vihaar
              </span>
            </h1>
          </ParallaxLayer>

          <ParallaxLayer speed={-0.1} className="relative">
            <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto">
              Sharing the tools that helped me grow my business. Ready to level up your journey?
            </p>
          </ParallaxLayer>

          <ParallaxLayer speed={-0.05} className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6">
              <span>Explore My Tools</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Sparkles className="mr-2 h-5 w-5" />
              <span>Learn More</span>
            </Button>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
