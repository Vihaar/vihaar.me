import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function BackButton() {
  return (
    <Link href="/" className="fixed top-6 left-6 z-50 group">
      <motion.div 
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black/40 transition-all cursor-pointer shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-display text-xl pt-1">Back to Map</span>
      </motion.div>
    </Link>
  );
}
