import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = { children: ReactNode; tone?: "ivory" | "ink" | "warm"; className?: string };

export const ChapterShell = ({ children, tone = "ivory", className = "" }: Props) => {
  const bg = tone === "ink" ? "bg-ink text-paper" : tone === "warm" ? "bg-[hsl(38_38%_90%)]" : "bg-background";
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative h-full w-full overflow-hidden paper-grain ${bg} ${className}`}
    >
      {children}
    </motion.section>
  );
};

export const SmallCaps = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`smallcaps text-gold-deep ${className}`}>{children}</div>
);

export const GoldRule = ({ className = "" }: { className?: string }) => (
  <div className={`gold-rule ${className}`} />
);
