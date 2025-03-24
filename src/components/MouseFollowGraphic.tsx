
import React, { useEffect, useRef } from 'react';

interface MouseFollowGraphicProps {
  className?: string;
}

const MouseFollowGraphic: React.FC<MouseFollowGraphicProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    if (!container || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Fluid simulation variables
    interface FluidParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      opacity: number;
      life: number;
    }
    
    const fluidParticles: FluidParticle[] = [];
    
    // Mouse position and velocity
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let mouseVelX = 0;
    let mouseVelY = 0;
    
    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      
      // Calculate velocity
      mouseVelX = e.clientX - rect.left - lastMouseX;
      mouseVelY = e.clientY - rect.top - lastMouseY;
      
      // Update positions
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      // Add fluid particles based on velocity
      const speed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);
      const particleCount = Math.min(Math.floor(speed / 2), 8);
      
      for (let i = 0; i < particleCount; i++) {
        // Create particles along the path, not just at the cursor
        const t = i / particleCount;
        const posX = lastMouseX + (mouseX - lastMouseX) * t;
        const posY = lastMouseY + (mouseY - lastMouseY) * t;
        
        // Add slight variation for more natural look
        const angle = Math.atan2(mouseVelY, mouseVelX) + (Math.random() - 0.5) * 1;
        const dist = Math.random() * 10;
        
        const hue = 250 + Math.random() * 60; // Blue to purple range
        
        fluidParticles.push({
          x: posX + Math.cos(angle) * dist,
          y: posY + Math.sin(angle) * dist,
          vx: mouseVelX * (Math.random() * 0.3),
          vy: mouseVelY * (Math.random() * 0.3),
          radius: Math.random() * 20 + 15,
          color: `hsla(${hue}, 70%, 60%, 1)`,
          opacity: Math.random() * 0.5 + 0.2,
          life: 100
        });
      }
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    // Animation function
    const animate = () => {
      // Create semi-transparent fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Updated fluid simulation
      ctx.globalCompositeOperation = 'screen';
      
      // Update fluid particles
      for (let i = 0; i < fluidParticles.length; i++) {
        let p = fluidParticles[i];
        
        // Update position with velocity
        p.x += p.vx;
        p.y += p.vy;
        
        // Apply physics: friction
        p.vx *= 0.97;
        p.vy *= 0.97;
        
        // Apply slight gravity
        p.vy += 0.01;
        
        // Add slight random movement for more fluid-like behavior
        p.vx += (Math.random() - 0.5) * 0.3;
        p.vy += (Math.random() - 0.5) * 0.3;
        
        // Reduce life
        p.life -= 1;
        
        // Skip if almost dead
        if (p.life <= 0) {
          fluidParticles.splice(i, 1);
          i--;
          continue;
        }
        
        // Calculate opacity based on life
        const opacity = p.opacity * (p.life / 100);
        
        // Create fluid effect with gradient
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius
        );
        
        // Get base color from particle's color
        const baseColor = p.color.replace('1)', `${opacity})`);
        const transparentColor = p.color.replace('1)', '0)');
        
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(0.6, baseColor.replace('1)', `${opacity * 0.6})`));
        gradient.addColorStop(1, transparentColor);
        
        // Draw a slightly wobbling shape for more organic look
        const time = Date.now() / 1000;
        const wobbleX = 1 + Math.sin(time + i) * 0.1;
        const wobbleY = 1 + Math.cos(time + i) * 0.1;
        
        ctx.beginPath();
        ctx.ellipse(
          p.x, p.y, 
          p.radius * wobbleX, 
          p.radius / wobbleY, 
          Math.sin(time + i * 0.3), 
          0, Math.PI * 2
        );
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Connect nearby particles with fluid bridges
        for (let j = i + 1; j < fluidParticles.length; j++) {
          const p2 = fluidParticles[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < p.radius + p2.radius) {
            // Draw fluid connection between particles
            const midX = (p.x + p2.x) / 2;
            const midY = (p.y + p2.y) / 2;
            
            // Calculate control point for bezier curve
            const cpOffsetX = (Math.random() - 0.5) * 20;
            const cpOffsetY = (Math.random() - 0.5) * 20;
            
            // Use combined opacity
            const connectionOpacity = Math.min(opacity, p2.opacity * (p2.life / 100)) * 0.7;
            
            // Create gradient for connection
            const connGradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            
            const startColor = p.color.replace('1)', `${connectionOpacity})`);
            const endColor = p2.color.replace('1)', `${connectionOpacity})`);
            
            connGradient.addColorStop(0, startColor);
            connGradient.addColorStop(1, endColor);
            
            // Draw the fluid bridge using bezier curve
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.quadraticCurveTo(midX + cpOffsetX, midY + cpOffsetY, p2.x, p2.y);
            ctx.lineWidth = Math.min(p.radius, p2.radius) * 0.5;
            ctx.strokeStyle = connGradient;
            ctx.stroke();
          }
        }
      }
      
      // Add ambient fluid movement 
      if (Math.random() > 0.97) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const hue = 250 + Math.random() * 60;
        
        fluidParticles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 20 + 10,
          color: `hsla(${hue}, 70%, 60%, 1)`,
          opacity: Math.random() * 0.3 + 0.1,
          life: 80
        });
      }
      
      // Limit particles to prevent performance issues
      if (fluidParticles.length > 150) {
        fluidParticles.splice(0, fluidParticles.length - 150);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full ${className}`}
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default MouseFollowGraphic;
