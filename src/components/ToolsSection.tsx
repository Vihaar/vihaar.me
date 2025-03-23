
import React from "react";
import ToolCard from "./ToolCard";
import SVGAnimation from "./SVGAnimation";
import { Badge } from "@/components/ui/badge";
import { Mail, Code } from "lucide-react";

const ToolsSection: React.FC = () => {
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

  return (
    <section className="relative py-24 overflow-hidden" id="tools">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-60 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 bg-background/80 backdrop-blur-sm">
            Business Growth Tools
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Tools I Use To{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Grow My Business
            </span>
          </h2>
          <p className="text-xl text-foreground/70">
            I've curated these powerful tools and resources that helped me scale my business.
            Now I'm sharing them with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tools.map((tool, index) => (
            <div key={tool.title} className="h-full">
              <ToolCard {...tool} />
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-2xl mx-auto text-center">
          <SVGAnimation className="w-full h-32 mb-8">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1" />
              <path d="M15,50 C15,30 35,15 50,15 C65,15 85,30 85,50 C85,70 65,85 50,85 C35,85 15,70 15,50 Z" 
                    fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M20,50 C20,33 33,20 50,20 C67,20 80,33 80,50 C80,67 67,80 50,80 C33,80 20,67 20,50 Z" 
                    fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </SVGAnimation>
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
