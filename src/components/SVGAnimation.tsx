
import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface SVGAnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const SVGAnimation: React.FC<SVGAnimationProps> = ({
  children,
  delay = 0,
  className = "",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!inView || !svgRef.current) return;
    
    const paths = svgRef.current.querySelectorAll("path");
    
    paths.forEach((path, index) => {
      // Add class after delay based on index
      setTimeout(() => {
        path.classList.add("animate");
      }, delay + index * 100);
    });
  }, [inView, delay]);

  return (
    <div ref={ref} className={className}>
      {React.cloneElement(children as React.ReactElement, {
        ref: svgRef,
        className: `svg-animated ${(children as React.ReactElement).props.className || ""}`,
      })}
    </div>
  );
};

export default SVGAnimation;
