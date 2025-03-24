
import React, { useEffect, useRef } from 'react';

interface MouseFollowGraphicProps {
  className?: string;
}

const MouseFollowGraphic: React.FC<MouseFollowGraphicProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    
    if (!container || !svg) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      
      // Get mouse position relative to container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate relative position (0-1)
      const relX = mouseX / rect.width;
      const relY = mouseY / rect.height;
      
      // Apply transformations to SVG elements based on mouse position
      const circles = svg.querySelectorAll('circle');
      const paths = svg.querySelectorAll('path');
      
      // Move circles
      circles.forEach((circle, index) => {
        const factor = index % 2 === 0 ? 1 : -1;
        const intensity = 10 * (index + 1) / circles.length;
        
        const cx = parseFloat(circle.getAttribute('cx') || '50');
        const cy = parseFloat(circle.getAttribute('cy') || '50');
        
        const offsetX = (relX - 0.5) * intensity * factor;
        const offsetY = (relY - 0.5) * intensity * factor;
        
        circle.setAttribute('cx', `${cx + offsetX}`);
        circle.setAttribute('cy', `${cy + offsetY}`);
      });
      
      // Distort paths
      paths.forEach((path, index) => {
        const intensity = 5 * (index + 1) / paths.length;
        const offsetX = (relX - 0.5) * intensity;
        const offsetY = (relY - 0.5) * intensity;
        
        path.setAttribute('transform', `translate(${offsetX}, ${offsetY})`);
      });
    };
    
    // Add mouse move listener
    container.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full ${className}`}
    >
      <svg 
        ref={svgRef}
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1" />
        <path 
          d="M15,50 C15,30 35,15 50,15 C65,15 85,30 85,50 C85,70 65,85 50,85 C35,85 15,70 15,50 Z" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1" 
        />
        <path 
          d="M20,50 C20,33 33,20 50,20 C67,20 80,33 80,50 C80,67 67,80 50,80 C33,80 20,67 20,50 Z" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
        />
      </svg>
    </div>
  );
};

export default MouseFollowGraphic;
