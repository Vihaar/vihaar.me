
import React, { useEffect, useRef, useState } from 'react';

interface FluidEmailRevealProps {
  email: string;
  className?: string;
}

const FluidEmailReveal: React.FC<FluidEmailRevealProps> = ({
  email,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emailTextRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const emailText = emailTextRef.current;
    
    if (!container || !canvas || !emailText) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Position text element
    emailText.style.top = `${container.clientHeight / 2 - emailText.clientHeight / 2}px`;
    emailText.style.left = `${container.clientWidth / 2 - emailText.clientWidth / 2}px`;

    // Bubble properties
    interface Bubble {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }

    // Create bubbles - dramatically increase for better coverage
    const bubbles: Bubble[] = [];
    const bubbleCount = 1000; // Increased from 500 to 1000 for complete coverage

    const createBubbles = () => {
      bubbles.length = 0;
      for (let i = 0; i < bubbleCount; i++) {
        const radius = Math.random() * 25 + 10; // Larger bubbles
        const bubble: Bubble = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: radius,
          color: getRandomColor(0.9), // More opaque to better hide email
          vx: 0,
          vy: 0
        };
        bubbles.push(bubble);
      }
    };
    
    const getRandomColor = (alpha: number) => {
      const colors = [
        `rgba(255, 99, 132, ${alpha})`, // Red
        `rgba(54, 162, 235, ${alpha})`, // Blue
        `rgba(255, 206, 86, ${alpha})`, // Yellow
        `rgba(75, 192, 192, ${alpha})`, // Green
        `rgba(153, 102, 255, ${alpha})`, // Purple
        `rgba(255, 159, 64, ${alpha})`, // Orange
        `rgba(255, 127, 223, ${alpha})`, // Pink
        `rgba(102, 204, 153, ${alpha})`, // Mint
        `rgba(178, 102, 255, ${alpha})`, // Lavender
        `rgba(255, 117, 24, ${alpha})` // Coral
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
      setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
      isMouseOver = false;
      mouseX = -100;
      mouseY = -100;
      setIsHovering(false);
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    function animate() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw a solid background to completely hide email when not hovering
      if (!isHovering) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.95)'); // Light purple
        gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.95)'); // Light blue
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0.95)'); // Light orange
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Draw a semi-transparent gradient when hovering
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)'); // Light purple
        gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.3)'); // Light blue
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0.3)'); // Light orange
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw bubbles to hide email
      for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];

        // Apply cursor avoidance behavior - increased repel radius and force
        if (isMouseOver) {
          const dx = bubble.x - mouseX;
          const dy = bubble.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 200; // Increased from 150 to 200 for larger clearing area

          if (distance < repelRadius) {
            // Calculate repulsion force (stronger when closer)
            const force = (repelRadius - distance) / repelRadius;
            const angle = Math.atan2(dy, dx);

            // Apply force to velocity - increased force multiplier
            bubble.vx += Math.cos(angle) * force * 5;
            bubble.vy += Math.sin(angle) * force * 5;
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

        // Draw bubble with highlight effect
        const bubbleGradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3, 
          bubble.y - bubble.radius * 0.3, 
          bubble.radius * 0.1, 
          bubble.x, 
          bubble.y, 
          bubble.radius
        );
        bubbleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        bubbleGradient.addColorStop(1, bubble.color);
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubbleGradient;
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
      <div 
        ref={emailTextRef} 
        className="absolute z-0 text-center font-bold text-2xl select-all"
      >
        {email}
      </div>
      <canvas ref={canvasRef} className="w-full h-full z-10" />
    </div>
  );
};

export default FluidEmailReveal;
