
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CounterAnimation from "./CounterAnimation";
import { ArrowUpRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  usageCount: number;
  tags: string[];
  url: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon,
  usageCount,
  tags,
  url,
}) => {
  return (
    <Card className="group overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.01] border-border hover:border-primary/20">
      <CardHeader className="relative pb-0">
        <div className="absolute top-4 right-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-medium">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl font-heading">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <CardDescription className="text-foreground/70 line-clamp-3 min-h-[4.5rem]">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center text-sm text-foreground/80">
          <span className="mr-1">Used by</span>
          <CounterAnimation
            end={usageCount}
            suffix="+"
            className="font-semibold text-foreground"
          />
          <span className="ml-1">people</span>
        </div>
        <Button variant="ghost" size="sm" className="magnetic-button opacity-80 group-hover:opacity-100 transition-opacity" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <span>Get Tool</span>
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
