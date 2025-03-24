
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number; color: string }[]>([]);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add new trail particle
      const colors = [
        "rgba(139, 92, 246, 0.8)", // Purple
        "rgba(14, 165, 233, 0.8)",  // Blue
        "rgba(249, 115, 22, 0.8)",  // Orange
        "rgba(236, 72, 153, 0.8)",  // Pink
      ];
      
      const newParticle = {
        x: e.clientX,
        y: e.clientY,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      
      setTrail(prev => [...prev, newParticle].slice(-30)); // Keep only 30 most recent
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Handle the click explosion effect
  const handleClick = () => {
    setClicked(true);
    
    if (particlesRef.current && containerRef.current) {
      // Create explosion particles
      const particles = 100;
      const container = containerRef.current;
      const particlesContainer = particlesRef.current;
      
      // Clear any existing particles
      particlesContainer.innerHTML = '';
      
      for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 15 + 5;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 300 + 100;
        const distance = Math.random() * window.innerWidth * 0.5;
        
        // Set random colors
        const hue = Math.random() * 360;
        particle.style.backgroundColor = `hsla(${hue}, 80%, 60%, 0.8)`;
        
        // Position at click point
        particle.style.left = `${mousePosition.x}px`;
        particle.style.top = `${mousePosition.y}px`;
        
        // Size
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Start the animation
        requestAnimationFrame(() => {
          particle.style.transform = `translate(
            ${Math.cos(angle) * distance}px, 
            ${Math.sin(angle) * distance}px
          ) scale(0)`;
        });
        
        particlesContainer.appendChild(particle);
      }
      
      // Navigate after animation
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-screen bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Mouse trail */}
      {trail.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full pointer-events-none transition-opacity"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${10 + Math.random() * 10}px`,
            height: `${10 + Math.random() * 10}px`,
            backgroundColor: particle.color,
            opacity: (30 - index) / 30, // Fade based on age
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      {/* Explosion particles container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden" />
      
      {/* Simple button */}
      <Button
        onClick={handleClick}
        disabled={clicked}
        className={`text-white border border-white/20 bg-transparent hover:bg-white/5 transition-all ${
          clicked ? 'opacity-0 scale-150' : 'opacity-100'
        }`}
      >
        click me
      </Button>
    </div>
  );
};

export default Welcome;
