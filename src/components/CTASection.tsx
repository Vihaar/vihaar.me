
import React from "react";
import AnimatedGradientBackground from "./AnimatedGradientBackground";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const CTASection: React.FC = () => {
  return (
    <section className="py-24">
      <div className="container">
        <AnimatedGradientBackground 
          interactive={true} 
          className="rounded-3xl overflow-hidden p-12 md:p-16"
        >
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to transform your business growth?
            </h2>
            <p className="text-xl mb-8 text-white/80">
              Get access to all my tools and start accelerating your business today.
              I'm here to help you succeed.
            </p>
            <Button 
              size="lg" 
              className="magnetic-button bg-white text-primary hover:bg-white/90 hover:text-primary text-lg px-8"
            >
              <Mail className="mr-2 h-5 w-5" />
              <span>Get in Touch</span>
            </Button>
          </div>
        </AnimatedGradientBackground>
      </div>
    </section>
  );
};

export default CTASection;
