
import React, { useRef } from "react";
import ToolCard from "./ToolCard";
import { Badge } from "@/components/ui/badge";
import { Mail, Code, Copy, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import FluidEmailReveal from "./FluidEmailReveal";
import { useToast } from "@/components/ui/use-toast";

const ToolsSection: React.FC = () => {
  const titleRef = useScrollReveal({ threshold: 0.2 });
  const descriptionRef = useScrollReveal({ threshold: 0.2 });
  const toolsContainerRef = useScrollReveal({ threshold: 0.1 });
  const emailRevealRef = useScrollReveal({ threshold: 0.2 });
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  
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

  const email = "vbnandigala@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      toast({
        title: "Email copied!",
        description: `${email} has been copied to your clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
          <div ref={emailRevealRef} className="relative w-full h-64 mb-8 rounded-lg overflow-hidden group">
            <FluidEmailReveal 
              email={email}
              className="w-full h-full cursor-none"
            />
            <button 
              onClick={copyEmail} 
              className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Copy email address"
            >
              {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-primary" />}
            </button>
          </div>
          <h3 className="text-2xl font-heading font-semibold mb-4">
            Here's my email, feel free to reach out!
          </h3>
          <p className="text-foreground/70">
            Feel free to email me about anything. I would love to help with your business growth questions,
            discuss these tools further, or collaborate on exciting new projects.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
