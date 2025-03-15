
import { useEffect, useRef } from "react";

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed: number; // Speed factor (negative values move in opposite direction)
  className?: string;
}

export const ParallaxLayer = ({ children, speed, className = "" }: ParallaxLayerProps) => {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!layerRef.current) return;
      
      const scrollY = window.scrollY;
      const yPos = scrollY * speed;
      layerRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Call once to set initial position
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={layerRef} className={`parallax-layer ${className}`}>
      {children}
    </div>
  );
};

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ParallaxContainer = ({ children, className = "" }: ParallaxContainerProps) => {
  return <div className={`parallax-container ${className}`}>{children}</div>;
};
