
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prevMousePosition, setPrevMousePosition] = useState({ x: 0, y: 0 });

  // Handle canvas setup for fluid effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Fluid simulation properties
    const fluidCells: {
      x: number;
      y: number;
      density: number;
      velocity: { x: number; y: number };
      color: string;
      opacity: number;
    }[] = [];
    
    const generateFluidCells = () => {
      fluidCells.length = 0;
      const cellSize = 10;
      const cols = Math.ceil(canvas.width / cellSize);
      const rows = Math.ceil(canvas.height / cellSize);
      
      for (let i = 0; i < 200; i++) {
        fluidCells.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          density: Math.random() * 0.5 + 0.5,
          velocity: { x: 0, y: 0 },
          color: getRandomColor(),
          opacity: Math.random() * 0.5 + 0.3
        });
      }
    };
    
    const getRandomColor = () => {
      const colors = [
        'rgba(139, 92, 246, 1)',  // Purple
        'rgba(14, 165, 233, 1)',  // Blue
        'rgba(249, 115, 22, 1)',  // Orange
        'rgba(16, 185, 129, 1)',  // Green
        'rgba(239, 68, 68, 1)',   // Red
        'rgba(236, 72, 153, 1)'   // Pink
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };
    
    generateFluidCells();
    
    // Initial black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Track mouse position and velocity
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseVelocityX = 0;
    let mouseVelocityY = 0;
    let lastMouseX = -1000;
    let lastMouseY = -1000;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate velocity
      mouseVelocityX = e.clientX - lastMouseX;
      mouseVelocityY = e.clientY - lastMouseY;
      
      // Update positions
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      setMousePosition({ x: e.clientX, y: e.clientY });
      setPrevMousePosition({ x: lastMouseX, y: lastMouseY });
      
      // Add new fluid cells in response to mouse movement
      const speed = Math.sqrt(mouseVelocityX * mouseVelocityX + mouseVelocityY * mouseVelocityY);
      const count = Math.min(Math.floor(speed / 2), 5);
      
      for (let i = 0; i < count; i++) {
        const angle = Math.atan2(mouseVelocityY, mouseVelocityX) + (Math.random() - 0.5) * 1;
        const dist = Math.random() * 30;
        
        fluidCells.push({
          x: mouseX + Math.cos(angle) * dist,
          y: mouseY + Math.sin(angle) * dist,
          density: Math.random() * 0.5 + 0.5,
          velocity: { 
            x: mouseVelocityX * (Math.random() * 0.5 + 0.5), 
            y: mouseVelocityY * (Math.random() * 0.5 + 0.5) 
          },
          color: getRandomColor(),
          opacity: Math.random() * 0.8 + 0.2
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation function
    const animate = () => {
      // Semi-transparent black for fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw fluid cells
      for (let i = 0; i < fluidCells.length; i++) {
        const cell = fluidCells[i];
        
        // Update position based on velocity
        cell.x += cell.velocity.x * 0.2;
        cell.y += cell.velocity.y * 0.2;
        
        // Apply dampening
        cell.velocity.x *= 0.98;
        cell.velocity.y *= 0.98;
        
        // Apply gravity and randomness for organic movement
        cell.velocity.y += 0.01;
        cell.velocity.x += (Math.random() - 0.5) * 0.1;
        cell.velocity.y += (Math.random() - 0.5) * 0.1;
        
        // Decrease opacity over time
        cell.opacity *= 0.99;
        
        // Draw fluid blob
        const size = Math.max(cell.density * 50, 20);
        
        // Skip rendering nearly transparent cells
        if (cell.opacity < 0.01) {
          fluidCells.splice(i, 1);
          i--;
          continue;
        }
        
        // Use more advanced gradient for fluid look
        const gradient = ctx.createRadialGradient(
          cell.x, cell.y, 0,
          cell.x, cell.y, size
        );
        
        // Convert color to rgba with cell opacity
        const baseColor = cell.color.replace('1)', `${cell.opacity})`);
        const transparentColor = cell.color.replace('1)', '0)');
        
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(0.6, baseColor.replace('1)', `${cell.opacity * 0.6})`));
        gradient.addColorStop(1, transparentColor);
        
        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath();
        
        // Use quadratic curves for more organic shapes
        const wobble = 1 + Math.sin(Date.now() / 200 + i) * 0.1;
        ctx.ellipse(cell.x, cell.y, size * wobble, size / wobble, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Create interaction with mouse
        const dx = cell.x - mouseX;
        const dy = cell.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelDistance = 100;
        
        if (distance < repelDistance) {
          const angle = Math.atan2(dy, dx);
          const force = (repelDistance - distance) / repelDistance;
          cell.velocity.x += Math.cos(angle) * force * 0.5;
          cell.velocity.y += Math.sin(angle) * force * 0.5;
        }
      }
      
      // Limit the number of cells
      if (fluidCells.length > 300) {
        fluidCells.splice(0, fluidCells.length - 300);
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Handle the click explosion effect
  const handleClick = () => {
    setClicked(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!canvas || !ctx) return;
    
    // Create fluid explosion
    const explosionPoints = 50;
    const centerX = mousePosition.x;
    const centerY = mousePosition.y;
    
    // Helper function to create explosion
    const createFluidExplosion = () => {
      for (let i = 0; i < explosionPoints; i++) {
        const angle = (i / explosionPoints) * Math.PI * 2;
        const distance = Math.random() * 20 + 5;
        const speed = Math.random() * 10 + 10;
        
        setTimeout(() => {
          // Create expanding radial gradient
          const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, distance * 10 + i * 5
          );
          
          const hue = Math.random() * 60 + 250; // Blue to purple
          gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.8)`);
          gradient.addColorStop(0.4, `hsla(${hue}, 70%, 60%, 0.4)`);
          gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0)`);
          
          ctx.globalCompositeOperation = 'screen';
          ctx.beginPath();
          ctx.fillStyle = gradient;
          
          // Create wobbling circle
          const wobble = 1 + Math.sin(i / 10) * 0.2;
          ctx.ellipse(
            centerX + Math.cos(angle) * distance, 
            centerY + Math.sin(angle) * distance, 
            100 * wobble + i * 3, 
            100 / wobble + i * 3, 
            0, 0, Math.PI * 2
          );
          ctx.fill();
        }, i * 10);
      }
    };
    
    // Create multiple explosion waves
    for (let wave = 0; wave < 5; wave++) {
      setTimeout(createFluidExplosion, wave * 100);
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
