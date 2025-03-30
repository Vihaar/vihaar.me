
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CounterAnimation from "./CounterAnimation";
import { ArrowUpRight, Clock } from "lucide-react";

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
  const isComingSoon = url === "#coming-soon";
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  
  useEffect(() => {
    const element = isComingSoon ? buttonRef.current : linkRef.current;
    if (!element) return;
    
    let animating = false;
    let initialX = 0;
    let initialY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (animating) return;
      
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const distanceX = x - centerX;
      const distanceY = y - centerY;
      
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const maxDistance = Math.min(rect.width, rect.height) * 0.5;
      
      if (distance < maxDistance) {
        const strength = 0.3; // Magnetic pull strength
        const moveX = distanceX * strength;
        const moveY = distanceY * strength;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        element.classList.add("magnetic-button");
      }
    };
    
    const handleMouseLeave = () => {
      animating = true;
      initialX = parseFloat(element.style.transform.replace(/[^\d.-]/g, '')) || 0;
      initialY = parseFloat(element.style.transform.split(',')[1]?.replace(/[^\d.-]/g, '')) || 0;
      
      // Animate back to center
      element.style.transition = 'transform 0.3s ease-out';
      element.style.transform = 'translate(0px, 0px)';
      
      setTimeout(() => {
        element.style.transition = '';
        animating = false;
      }, 300);
    };
    
    // Add event listeners to parent card for better magnetic effect area
    const parentCard = element.closest('.group');
    if (parentCard) {
      parentCard.addEventListener('mousemove', handleMouseMove);
      parentCard.addEventListener('mouseleave', handleMouseLeave);
      
      // Clean up
      return () => {
        parentCard.removeEventListener('mousemove', handleMouseMove);
        parentCard.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isComingSoon]);
  
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
        {isComingSoon ? (
          <Button 
            ref={buttonRef}
            variant="outline" 
            size="sm" 
            className="opacity-80 group-hover:opacity-100 transition-opacity" 
            disabled
          >
            <Clock className="mr-1 h-4 w-4" />
            <span>Coming Soon</span>
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-80 group-hover:opacity-100 transition-opacity" 
            asChild
          >
            <a 
              ref={linkRef}
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <span>Get Tool</span>
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
