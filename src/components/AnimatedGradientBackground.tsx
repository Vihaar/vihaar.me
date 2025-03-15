
import React, { useEffect, useRef } from "react";

interface AnimatedGradientBackgroundProps {
  children?: React.ReactNode;
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
    if (!containerRef.current) return;
    
    // Create a more dynamic animation effect
    const container = containerRef.current;
    let animationFrame: number;
    let hue = 0;
    let saturation = 70;
    let lightness = 80;
    let direction = 1;
    
    const animate = () => {
      // Gently change the hue
      hue = (hue + 0.2) % 360;
      
      // Oscillate saturation for subtle color changes
      saturation += direction * 0.05;
      if (saturation >= 80) {
        saturation = 80;
        direction = -1;
      } else if (saturation <= 65) {
        saturation = 65;
        direction = 1;
      }
      
      const color1 = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      const color2 = `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`;
      const color3 = `hsl(${(hue + 180) % 360}, ${saturation}%, ${lightness}%)`;
      
      container.style.background = `
        linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)
      `;
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  useEffect(() => {
    if (!interactive || !containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      // Change background position based on mouse coordinates
      const rotateX = (y - 0.5) * 10;
      const rotateY = (x - 0.5) * 10;
      
      containerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        backgroundSize: "400% 400%",
        transform: "perspective(1000px)",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedGradientBackground;
