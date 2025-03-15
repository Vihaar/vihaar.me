
import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface CounterAnimationProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const CounterAnimation: React.FC<CounterAnimationProps> = ({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  className = "",
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(percentage);
      
      const currentCount = Math.floor(easedProgress * end);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(animateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className={`animate-count-up ${className}`}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default CounterAnimation;
