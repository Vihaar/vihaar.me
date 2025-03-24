
import React, { useEffect, useRef } from 'react';

interface FluidEmailRevealProps {
  email: string;
  className?: string;
}

const FluidEmailReveal: React.FC<FluidEmailRevealProps> = ({ email, className = "" }) => {
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
    
    // Bubble properties
    interface Bubble {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }
    
    // Create bubbles
    const bubbles: Bubble[] = [];
    const bubbleCount = 100;
    
    const createBubbles = () => {
      bubbles.length = 0;
      for (let i = 0; i < bubbleCount; i++) {
        const radius = Math.random() * 20 + 10;
        const bubble: Bubble = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: radius,
          color: getRandomColor(0.6),
          vx: 0,
          vy: 0
        };
        bubbles.push(bubble);
      }
    };
    
    const getRandomColor = (alpha: number) => {
      const colors = [
        `rgba(255, 99, 132, ${alpha})`,  // Red
        `rgba(54, 162, 235, ${alpha})`,  // Blue
        `rgba(255, 206, 86, ${alpha})`,  // Yellow
        `rgba(75, 192, 192, ${alpha})`,  // Green
        `rgba(153, 102, 255, ${alpha})`, // Purple
        `rgba(255, 159, 64, ${alpha})`,  // Orange
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };
    
    createBubbles();
    
    // Handle mouse
    let mouseX = -100;
    let mouseY = -100;
    let isMouseOver = false;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseOver = true;
    };
    
    const handleMouseLeave = () => {
      isMouseOver = false;
      mouseX = -100;
      mouseY = -100;
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Draw email text
    function drawEmail() {
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(email, canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
    
    // Animation loop
    function animate() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)'); // Light purple
      gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.1)'); // Light blue
      gradient.addColorStop(1, 'rgba(249, 115, 22, 0.1)'); // Light orange
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw email first
      drawEmail();
      
      // Draw bubbles over email to hide it
      for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        
        // Apply cursor avoidance behavior
        if (isMouseOver) {
          const dx = bubble.x - mouseX;
          const dy = bubble.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 100; // Radius of cursor influence
          
          if (distance < repelRadius) {
            // Calculate repulsion force (stronger when closer)
            const force = (repelRadius - distance) / repelRadius;
            const angle = Math.atan2(dy, dx);
            
            // Apply force to velocity
            bubble.vx += Math.cos(angle) * force * 2;
            bubble.vy += Math.sin(angle) * force * 2;
          }
        }
        
        // Apply friction to gradually slow down
        bubble.vx *= 0.95;
        bubble.vy *= 0.95;
        
        // Apply velocity to position
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        
        // Bounce off walls
        if (bubble.x - bubble.radius < 0) {
          bubble.x = bubble.radius;
          bubble.vx *= -0.7;
        }
        if (bubble.x + bubble.radius > canvas.width) {
          bubble.x = canvas.width - bubble.radius;
          bubble.vx *= -0.7;
        }
        if (bubble.y - bubble.radius < 0) {
          bubble.y = bubble.radius;
          bubble.vy *= -0.7;
        }
        if (bubble.y + bubble.radius > canvas.height) {
          bubble.y = canvas.height - bubble.radius;
          bubble.vy *= -0.7;
        }
        
        // Draw bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        
        // Add highlight effect to bubble
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3, 
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.1,
          bubble.x, 
          bubble.y,
          bubble.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, bubble.color);
        
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    }
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [email]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative rounded-lg overflow-hidden ${className}`}
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default FluidEmailReveal;
