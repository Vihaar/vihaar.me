import { useState, useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Family() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePerson, setActivePerson] = useState(0); // 0-3
  
  const family = ["Mom", "Dad", "Vihaar", "Sibling"];

  useEffect(() => {
    let timer: any;
    let heartMover: any;
    
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      heartMover = setInterval(() => {
        setActivePerson(Math.floor(Math.random() * 4));
      }, Math.max(600, 1500 - score * 50)); // Gets faster
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    
    return () => {
      clearInterval(timer);
      clearInterval(heartMover);
    };
  }, [isPlaying, timeLeft, score]);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
  };

  const handleClick = (index: number) => {
    if (!isPlaying) return;
    if (index === activePerson) {
      setScore(s => s + 1);
      setActivePerson(Math.floor(Math.random() * 4));
    } else {
      setScore(s => Math.max(0, s - 1));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#4a2e1b]">
      <div 
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-family.png)`, backgroundSize: 'cover' }}
      />
      <BackButton />
      
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-8 pt-24 gap-8 max-w-7xl mx-auto">
        
        {/* Story Panel */}
        <div className="flex-1 text-amber-50 flex flex-col justify-center max-w-lg">
          <h1 className="font-display text-6xl md:text-8xl text-amber-200 mb-6 drop-shadow-lg">Family</h1>
          <div className="font-body text-xl leading-relaxed space-y-4 text-amber-50/90 bg-black/20 p-8 rounded-3xl backdrop-blur-sm border border-amber-500/20">
            <p><span className="text-4xl float-left mr-2 font-display text-amber-400">G</span>rowing up in the Michigan suburbs on a lake, home was more than a place—it was a feeling.</p>
            <p>Every risk I've taken, every chapter that unfolded, was backed by the unwavering foundation of family. The love was passed around, keeping us warm through the midwestern winters.</p>
          </div>
        </div>

        {/* Game Panel */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black/30 rounded-3xl backdrop-blur-md border border-white/10 p-8 shadow-2xl">
          <h2 className="font-display text-4xl text-amber-200 mb-2">Pass the Love</h2>
          <div className="flex gap-8 text-amber-100 font-body text-xl mb-8">
            <div className="bg-black/40 px-4 py-2 rounded-xl">Score: <span className="font-bold text-amber-400">{score}</span></div>
            <div className="bg-black/40 px-4 py-2 rounded-xl">Time: <span className="font-bold text-red-400">{timeLeft}s</span></div>
          </div>

          {!isPlaying && timeLeft === 30 ? (
            <button 
              onClick={handleStart}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-display text-3xl rounded-full shadow-[0_0_20px_rgba(217,119,6,0.5)] hover:shadow-[0_0_30px_rgba(217,119,6,0.8)] transition-all hover:scale-105"
            >
              Start Passing
            </button>
          ) : !isPlaying && timeLeft === 0 ? (
            <div className="text-center">
              <div className="text-3xl text-amber-100 mb-4 font-body">Final Score: {score}</div>
              <button onClick={handleStart} className="px-6 py-3 bg-amber-600 rounded-full font-display text-2xl hover:bg-amber-500">Play Again</button>
            </div>
          ) : (
            <div className="relative w-full max-w-sm aspect-square">
              {/* Circle of family members */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2">
                <FamilyAvatar name={family[0]} active={activePerson === 0} onClick={() => handleClick(0)} />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <FamilyAvatar name={family[1]} active={activePerson === 1} onClick={() => handleClick(1)} />
              </div>
              <div className="absolute top-1/2 left-0 -translate-y-1/2">
                <FamilyAvatar name={family[2]} active={activePerson === 2} onClick={() => handleClick(2)} />
              </div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2">
                <FamilyAvatar name={family[3]} active={activePerson === 3} onClick={() => handleClick(3)} />
              </div>
              
              {/* Center decoration */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <Heart className="w-24 h-24 text-red-500 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FamilyAvatar({ name, active, onClick }: { name: string, active: boolean, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-24 h-24 rounded-full flex items-center justify-center font-display text-2xl transition-all duration-300 border-4
        ${active 
          ? 'bg-red-500 border-red-300 text-white shadow-[0_0_30px_rgba(239,68,68,0.8)] scale-110 z-10' 
          : 'bg-amber-900 border-amber-700 text-amber-200/50 shadow-lg'}`}
    >
      {active && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Heart fill="currentColor" className="w-12 h-12 opacity-30" />
        </motion.div>
      )}
      <span className="relative z-10">{name}</span>
    </motion.button>
  );
}
