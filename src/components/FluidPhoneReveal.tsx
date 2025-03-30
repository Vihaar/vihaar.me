
import React, { useEffect, useRef, useState } from 'react';

interface FluidPhoneRevealProps {
  phoneNumber: string;
  className?: string;
}

const FluidPhoneReveal: React.FC<FluidPhoneRevealProps> = ({ phoneNumber, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
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
      // Draw the phone number on resize
      drawPhoneNumber();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Fluid simulation properties
    const CELL_SIZE = 10;
    const numColumns = Math.ceil(canvas.width / CELL_SIZE);
    const numRows = Math.ceil(canvas.height / CELL_SIZE);
    
    // Fluid grid
    let fluid = Array(numColumns).fill(0).map(() => Array(numRows).fill(0));
    
    // Function to draw phone number as background
    function drawPhoneNumber() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      if (isHovering) {
        // Semi-transparent when hovering
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)'); // Purple
        gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.3)'); // Blue
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0.3)'); // Orange
      } else {
        // More opaque when not hovering
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.9)'); // Purple
        gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.9)'); // Blue
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0.9)'); // Orange
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw phone number text
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000';
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillText(phoneNumber, canvas.width / 2, canvas.height / 2);
      ctx.globalCompositeOperation = 'source-over';
    }
    
    // Initial drawing
    drawPhoneNumber();
    
    // Handle mouse interaction
    let mouseX = -100;
    let mouseY = -100;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
      mouseX = -100;
      mouseY = -100;
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Animation loop
    function animate() {
      // Update fluid simulation based on mouse position
      if (isHovering) {
        const cellX = Math.floor(mouseX / CELL_SIZE);
        const cellY = Math.floor(mouseY / CELL_SIZE);
        const radius = 4; // Influence radius
        
        // Create a repulsion effect (air bubble)
        for (let i = Math.max(0, cellX - radius); i <= Math.min(numColumns - 1, cellX + radius); i++) {
          for (let j = Math.max(0, cellY - radius); j <= Math.min(numRows - 1, cellY + radius); j++) {
            const dx = i - cellX;
            const dy = j - cellY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < radius) {
              // Create a circular void around the mouse
              fluid[i][j] = 1 - (distance / radius);
            }
          }
        }
      }
      
      // Redraw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the base gradient with phone number
      drawPhoneNumber();
      
      // Apply fluid distortion effect
      ctx.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < numColumns; i++) {
        for (let j = 0; j < numRows; j++) {
          if (fluid[i][j] > 0.01) {
            const x = i * CELL_SIZE;
            const y = j * CELL_SIZE;
            
            // Create circular mask for fluid
            const radius = CELL_SIZE * fluid[i][j] * 2;
            const gradient = ctx.createRadialGradient(
              x, y, 0,
              x, y, radius
            );
            
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Decay the fluid over time
            fluid[i][j] *= 0.95;
          }
        }
      }
      
      ctx.globalCompositeOperation = 'source-over';
      
      requestAnimationFrame(animate);
    }
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [phoneNumber, isHovering]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative rounded-lg overflow-hidden ${className}`}
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
      <div className="absolute inset-0 flex items-center justify-center z-0 select-all">
        <span className="text-2xl font-bold">{phoneNumber}</span>
      </div>
    </div>
  );
};

export default FluidPhoneReveal;
