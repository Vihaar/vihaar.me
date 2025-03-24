
import React, { useEffect, useState } from "react";

export default function CursorEffect() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trails, setTrails] = useState<{ x: number; y: number; id: number; opacity: number; size: number }[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredMagnetic, setHoveredMagnetic] = useState(false);

  useEffect(() => {
    // Hide cursor effect on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Handle cursor position
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Create a new trail dot with unique ID and random properties for fluid effect
      const newTrail = { 
        x: e.clientX, 
        y: e.clientY, 
        id: Date.now(), 
        opacity: Math.random() * 0.3 + 0.7,
        size: Math.random() * 10 + 5
      };
      
      setTrails(prevTrails => [...prevTrails, newTrail].slice(-20)); // Keep more trails for fluid look
    };

    // Handle mouse entering/leaving magnetic elements
    const handleMouseEnterMagnetic = () => setHoveredMagnetic(true);
    const handleMouseLeaveMagnetic = () => setHoveredMagnetic(false);

    // Add event listeners
    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseenter", () => setIsVisible(true));
    document.addEventListener("mouseleave", () => setIsVisible(false));
    
    // Add event listeners to all magnetic button elements
    const magneticElements = document.querySelectorAll('.magnetic-button');
    magneticElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnterMagnetic);
      element.addEventListener('mouseleave', handleMouseLeaveMagnetic);
    });

    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", () => setIsVisible(true));
      document.removeEventListener("mouseleave", () => setIsVisible(false));
      magneticElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnterMagnetic);
        element.removeEventListener('mouseleave', handleMouseLeaveMagnetic);
      });
    };
  }, []);

  // Apply magnetic button effect
  useEffect(() => {
    const handleMagneticEffect = (e: MouseEvent) => {
      const magneticElements = document.querySelectorAll('.magnetic-button');
      magneticElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from cursor to element center
        const distanceX = e.clientX - elementCenterX;
        const distanceY = e.clientY - elementCenterY;
        
        // Check if cursor is near the element (within a certain range)
        const isNear = Math.abs(distanceX) < 100 && Math.abs(distanceY) < 100;
        
        if (isNear) {
          // Apply magnetic movement - stronger as cursor gets closer
          const strength = 0.3; // Adjust as needed
          const moveX = distanceX * strength;
          const moveY = distanceY * strength;
          
          (element as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          // Reset position when cursor is far away
          (element as HTMLElement).style.transform = 'translate(0, 0)';
        }
      });
    };

    document.addEventListener('mousemove', handleMagneticEffect);
    return () => document.removeEventListener('mousemove', handleMagneticEffect);
  }, []);

  // Cleanup trails after animation
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setTrails(prevTrails => {
        if (prevTrails.length > 0) {
          return prevTrails.slice(1);
        }
        return prevTrails;
      });
    }, 50);

    return () => clearInterval(cleanupInterval);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        className={`cursor-dot ${hoveredMagnetic ? 'scale-150' : 'scale-100'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: 'rgba(139, 92, 246, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />
      
      {/* Fluid trail effect */}
      {trails.map((trail, index) => {
        // Calculate distance from current position for a stretching effect
        const dx = position.x - trail.x;
        const dy = position.y - trail.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // Create elongated shape based on movement speed
        const stretchFactor = Math.min(distance / 10, 3);
        const width = trail.size + stretchFactor * 5;
        const height = trail.size;
        
        return (
          <div
            key={trail.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${trail.x}px`,
              top: `${trail.y}px`,
              width: `${width}px`, 
              height: `${height}px`,
              opacity: (trail.opacity * (20 - index) / 20), // Fade out gradually
              transform: `translate(-50%, -50%) rotate(${angle}rad) scale(${(20 - index) / 20})`,
              background: `rgba(139, 92, 246, ${trail.opacity * 0.3})`,
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
              filter: 'blur(2px)',
            }}
          />
        );
      })}
    </>
  );
}
