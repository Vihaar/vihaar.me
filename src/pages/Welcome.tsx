
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle canvas setup for fluid effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Fluid simulation properties
    let points: {x: number; y: number; vx: number; vy: number; life: number; color: string}[] = [];
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add fluid points
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1 + 0.5;
        
        const hue = Math.random() * 60 + 250; // Blue to purple
        const point = {
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 100,
          color: `hsla(${hue}, 70%, 60%, 0.7)`
        };
        
        points.push(point);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation function
    function animate() {
      // Clear with a slight fade effect instead of completely clearing
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw fluid points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.5;
        
        // Draw fluid element
        const size = Math.min(p.life / 2, 20);
        const opacity = p.life / 100;
        
        // Create a gradient for each point for more fluid look
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        gradient.addColorStop(0, p.color.replace('0.7', opacity.toString()));
        gradient.addColorStop(1, p.color.replace('0.7', '0'));
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Remove dead points
        if (p.life <= 0) {
          points.splice(i, 1);
          i--;
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle the click explosion effect
  const handleClick = () => {
    setClicked(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!canvas || !ctx) return;
    
    // Create fluid explosion
    const explosionPoints = 200;
    const centerX = mousePosition.x;
    const centerY = mousePosition.y;
    
    // Clear canvas first for dramatic effect
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create circular pattern of fluid
    for (let i = 0; i < explosionPoints; i++) {
      const angle = (i / explosionPoints) * Math.PI * 2;
      const distance = Math.random() * 100 + 50;
      const delay = Math.random() * 500;
      
      setTimeout(() => {
        const hue = Math.random() * 60 + 250; // Blue to purple range
        const size = Math.random() * 50 + 20;
        
        // Draw explosion element
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, canvas.width
        );
        
        gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.8)`);
        gradient.addColorStop(0.1, `hsla(${hue}, 70%, 60%, 0.3)`);
        gradient.addColorStop(0.2, 'rgba(0,0,0,0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(centerX, centerY, size + distance, 0, Math.PI * 2);
        ctx.fill();
      }, delay);
    }
    
    // Navigate after animation
    setTimeout(() => {
      navigate('/home');
    }, 1200);
  };
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-screen bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Canvas for fluid effects */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
      />
      
      {/* Simple button */}
      <Button
        onClick={handleClick}
        disabled={clicked}
        className={`text-white border border-white/20 bg-transparent hover:bg-white/5 transition-all z-10 ${
          clicked ? 'opacity-0 scale-150' : 'opacity-100'
        }`}
      >
        click me
      </Button>
    </div>
  );
};

export default Welcome;
