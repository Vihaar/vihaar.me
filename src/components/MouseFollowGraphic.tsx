
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
    const particles: {
      x: number;
      y: number;
      size: number;
      color: string;
      life: number;
      vx: number;
      vy: number;
    }[] = [];
    
    // Mouse position
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      // Add fluid particles
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        
        particles.push({
          x: mouseX,
          y: mouseY,
          size: Math.random() * 20 + 10,
          color: `hsla(${Math.random() * 60 + 250}, 70%, 60%, 0.3)`,
          life: 100,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed
        });
      }
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    // Animation function
    const animate = () => {
      // Create semi-transparent fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update fluid particles
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Reduce life
        p.life -= 1;
        
        // Get opacity based on life
        const opacity = p.life / 100;
        
        // Draw fluid-like element
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size
        );
        
        gradient.addColorStop(0, p.color.replace('0.3', opacity.toString()));
        gradient.addColorStop(1, p.color.replace('0.3', '0'));
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect nearby particles with curved lines for more fluid look
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 50) {
            ctx.beginPath();
            ctx.strokeStyle = p.color.replace('0.3', (opacity * 0.5).toString());
            ctx.lineWidth = Math.min(p.life / 50, 3);
            
            // Create a curved line between particles
            const midX = (p.x + p2.x) / 2;
            const midY = (p.y + p2.y) / 2 - 15;
            
            ctx.moveTo(p.x, p.y);
            ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
            ctx.stroke();
          }
        }
        
        // Remove dead particles
        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      // Add ambient particles
      if (Math.random() > 0.95) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 15 + 5,
          color: `hsla(${Math.random() * 60 + 250}, 70%, 60%, 0.3)`,
          life: 50,
          vx: Math.random() * 1 - 0.5,
          vy: Math.random() * 1 - 0.5
        });
      }
      
      // Limit particles to prevent performance issues
      if (particles.length > 100) {
        particles.splice(0, particles.length - 100);
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
