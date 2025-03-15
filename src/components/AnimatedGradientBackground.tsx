
import React, { useEffect, useRef } from "react";

interface AnimatedGradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  children,
  className = "",
  interactive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive || !containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      // Change background position based on mouse coordinates
      containerRef.current.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className={`animated-gradient ${interactive ? "transition-all duration-300 ease-out" : "animate-gradient-flow"} ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedGradientBackground;
