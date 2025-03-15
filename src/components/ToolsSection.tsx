
import React from "react";
import ToolCard from "./ToolCard";
import SVGAnimation from "./SVGAnimation";
import { Badge } from "@/components/ui/badge";
import { BarChart4, Briefcase, LineChart, Mail, Users, TrendingUp } from "lucide-react";

const ToolsSection: React.FC = () => {
  const tools = [
    {
      title: "Growth Analytics",
      description: "Track your business metrics with advanced analytics and reporting tools to make data-driven decisions.",
      icon: <BarChart4 className="h-6 w-6 text-primary" />,
      usageCount: 1245,
      tags: ["Analytics", "Data"],
      url: "https://tools.vihaar.me/growth-analytics",
    },
    {
      title: "CRM System",
      description: "Manage customer relationships efficiently with our intuitive CRM solution designed for growing businesses.",
      icon: <Users className="h-6 w-6 text-primary" />,
      usageCount: 2389,
      tags: ["Productivity", "Business"],
      url: "https://tools.vihaar.me/crm-system",
    },
    {
      title: "Email Campaigns",
      description: "Create and optimize email marketing campaigns that convert with templates and automation features.",
      icon: <Mail className="h-6 w-6 text-primary" />,
      usageCount: 3150,
      tags: ["Marketing", "Automation"],
      url: "https://tools.vihaar.me/email-campaigns",
    },
    {
      title: "Market Research",
      description: "Get insights into market trends, competitor analysis, and customer behavior to stay ahead.",
      icon: <LineChart className="h-6 w-6 text-primary" />,
      usageCount: 1752,
      tags: ["Research", "Planning"],
      url: "https://tools.vihaar.me/market-research",
    },
    {
      title: "SEO Toolkit",
      description: "Boost your online visibility with comprehensive SEO tools that help you rank higher on search engines.",
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      usageCount: 2987,
      tags: ["Marketing", "SEO"],
      url: "https://tools.vihaar.me/seo-toolkit",
    },
    {
      title: "Business Planning",
      description: "Create professional business plans with templates, financial projections, and strategy guides.",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      usageCount: 1623,
      tags: ["Planning", "Strategy"],
      url: "https://tools.vihaar.me/business-planning",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div key={tool.title} className="h-full">
              <ToolCard {...tool} />
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-2xl mx-auto text-center">
          <SVGAnimation className="w-full h-32 mb-8">
            <svg viewBox="0 0 500 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,90 Q125,30 250,50 T450,90" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none" />
              <path d="M50,50 Q125,100 250,50 T450,50" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none" />
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
