
import React, { useEffect, useState } from "react";

export default function CursorEffect() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([]);
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
      
      // Create a new trail dot with unique ID
      const newTrail = { x: e.clientX, y: e.clientY, id: Date.now() };
      setTrails(prevTrails => [...prevTrails, newTrail].slice(-10)); // Keep only the 10 most recent trails
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
          const [_, ...rest] = prevTrails;
          return rest;
        }
        return prevTrails;
      });
    }, 150);

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
        }}
      />
      
      {/* Trail effect */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="cursor-trail animate-cursor-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            opacity: (10 - index) / 10, // Fade out based on position in trail
            transform: `translate(-50%, -50%) scale(${(10 - index) / 10})`, // Scale down based on position in trail
          }}
        />
      ))}
    </>
  );
}
