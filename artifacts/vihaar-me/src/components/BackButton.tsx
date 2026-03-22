import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

type BackButtonProps = {
  /** Saffron / maroon glass — seva / child-hunger fundraiser */
  variant?: "default" | "pantry";
};

export function BackButton({ variant = "default" }: BackButtonProps) {
  const chip =
    variant === "pantry"
      ? "bg-[#3f0d1f]/88 backdrop-blur-md border-2 border-dashed border-amber-400/55 text-[#fef3c7] hover:bg-[#5c1428]/92 hover:border-amber-300/75 shadow-[0_0_24px_rgba(251,191,36,0.15)]"
      : "bg-black/20 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black/40";

  return (
    <Link href="/" className="fixed top-6 left-6 z-50 group">
      <motion.div 
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer shadow-lg ${chip}`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-display text-xl pt-1">Back to Map</span>
      </motion.div>
    </Link>
  );
}
