
import React, { useEffect, useRef } from 'react';

interface AnimatedLogoProps {
  text: string;
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    
    if (!container || !textElement) return;
    
    let animationFrame: number;
    let startTime = performance.now();
    const animationDuration = 3000; // 3 seconds for one full cycle
    const totalWidth = textElement.offsetWidth;
    
    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) % animationDuration;
      const progress = elapsed / animationDuration;
      
      // Calculate gradient position (0 to 100% over time)
      const gradientPosition = Math.floor(progress * 200);
      
      // Apply the gradient with a moving highlight
      textElement.style.backgroundImage = `linear-gradient(
        90deg,
        hsl(var(--primary)) 0%,
        hsl(var(--secondary)) ${gradientPosition - 10}%,
        hsl(var(--primary)) ${gradientPosition}%,
        hsl(var(--primary)) 100%
      )`;
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
    >
      <span 
        ref={textRef}
        className="font-heading font-bold bg-clip-text text-transparent inline-block"
      >
        {text}
      </span>
    </div>
  );
};

export default AnimatedLogo;
