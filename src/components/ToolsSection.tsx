
import React, { useEffect, useRef } from "react";
import ToolCard from "./ToolCard";
import { Badge } from "@/components/ui/badge";
import { Mail, Code } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ToolsSection: React.FC = () => {
  const titleRef = useScrollReveal({ threshold: 0.2 });
  const descriptionRef = useScrollReveal({ threshold: 0.2 });
  const toolsContainerRef = useScrollReveal({ threshold: 0.1 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const tools = [
    {
      title: "Enrichly",
      description: "Sales enrichment tool that helps you find and connect with the right prospects, with detailed contact information.",
      icon: <Mail className="h-6 w-6 text-primary" />,
      usageCount: 2389,
      tags: ["Sales", "Leads"],
      url: "https://getenrichly.com",
    },
    {
      title: "Selenium Scripts",
      description: "Automate web scraping for lead generation with customized Selenium scripts that extract valuable prospect data.",
      icon: <Code className="h-6 w-6 text-primary" />,
      usageCount: 1752,
      tags: ["Automation", "Scraping"],
      url: "#coming-soon",
    },
  ];

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particles class
    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.color = `hsl(${Math.random() * 60 + 250}, 70%, 50%)`;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.05;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    let particles: Particle[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseMoving = true;

      // Add particles on mouse move
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouseX, mouseY));
      }
    };

    // Stop particle generation when mouse leaves
    const handleMouseLeave = () => {
      isMouseMoving = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Remove particles that are too small
        if (particles[i].size <= 0.2) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      // Add particles over time even without mouse movement
      if (Math.random() > 0.9) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
      
      // Limit the number of particles
      if (particles.length > 100) {
        particles = particles.slice(-100);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="relative py-24 overflow-hidden" id="tools">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-60 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container">
        <div ref={titleRef} className="max-w-3xl mx-auto text-center mb-8">
          <Badge variant="outline" className="mb-4 px-4 py-2 bg-background/80 backdrop-blur-sm">
            Business Growth Tools
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Tools I Use To{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Grow My Business
            </span>
          </h2>
        </div>
        
        <div ref={descriptionRef} className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-xl text-foreground/70">
            I've curated these powerful tools and resources that helped me scale my business.
            Now I'm sharing them with you.
          </p>
        </div>

        <div ref={toolsContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tools.map((tool, index) => (
            <div key={tool.title} className="h-full">
              <ToolCard {...tool} />
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-2xl mx-auto text-center">
          <div className="w-full h-64 mb-8 rounded-lg overflow-hidden">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full cursor-none"
            />
          </div>
          <h3 className="text-2xl font-heading font-semibold mb-4">
            Every tool has been personally tested and proven effective
          </h3>
          <p className="text-foreground/70">
            These are the exact tools that helped me achieve consistent growth. 
            I've tested and refined this toolkit over years of business development.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
