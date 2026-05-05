import { motion } from "framer-motion";

type Props = { tilt?: number; size?: number; className?: string; animate?: boolean };

// Hand-drawn single-line ship & sail mark. One continuous gold stroke.
export const SailMark = ({ tilt = 0, size = 120, className, animate = true }: Props) => {
  const path = "M10 78 Q60 90 110 78 L100 84 L20 84 Z M60 12 L60 78 M60 14 Q90 30 88 70 L60 70 Z";
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 120 100" className={className} aria-hidden>
      <g transform={`rotate(${tilt} 60 50)`} fill="none" stroke="hsl(var(--gold))" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <motion.path
          d={path}
          initial={animate ? { pathLength: 0, opacity: 0 } : false}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      </g>
    </svg>
  );
};

export const CompassMark = ({ size = 80, className }: Props) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
    <g fill="none" stroke="hsl(var(--gold))" strokeWidth="0.8" strokeLinecap="round">
      <circle cx="50" cy="50" r="38" />
      <circle cx="50" cy="50" r="30" strokeDasharray="1 3" />
      <path d="M50 8 L54 50 L50 92 L46 50 Z" fill="hsl(var(--gold) / 0.15)" />
      <path d="M8 50 L50 46 L92 50 L50 54 Z" />
      <text x="50" y="6" textAnchor="middle" fontSize="6" fill="hsl(var(--gold))" fontFamily="serif">N</text>
    </g>
  </svg>
);
