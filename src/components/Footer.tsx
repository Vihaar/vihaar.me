
import React from "react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import DoodleJumpGame from "./DoodleJumpGame";
import FluidEmailReveal from "./FluidEmailReveal";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background py-12 border-t border-border relative">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">vihaar.me</h3>
            <p className="text-foreground/70 max-w-xs">
              Sharing the tools and resources I use to grow my business and help others succeed.
            </p>
          </div>
          <div className="relative">
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/tools"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Tools
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Vihaar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/vihaar-nandigala/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/VihaarNandigala"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:vbnandigala@gmail.com"
                className="text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            
            {/* Email Reveal with bubbles */}
            <div className="mt-4">
              <p className="text-foreground/70 mb-2">Here's my email. Feel free to contact me about anything, I'd love to help!</p>
              <div className="h-16">
                <FluidEmailReveal email="vbnandigala@gmail.com" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
        
        {/* DoodleJump Game integrated into the footer - this is the only game canvas */}
        <div className="relative min-h-[200px]">
          <DoodleJumpGame />
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/70 text-sm">
            &copy; {currentYear} vihaar.me. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
