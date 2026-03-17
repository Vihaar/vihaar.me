import { useState, useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { motion } from "framer-motion";
import { MountainSnow } from "lucide-react";

export default function Iceland() {
  const [height, setHeight] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [barPosition, setBarPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  
  const GOAL = 10;
  const SPEED = 2 + height * 0.5; // Gets faster as you climb

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    let frameId: number;
    const loop = () => {
      setBarPosition(prev => {
        let next = prev + direction * SPEED;
        if (next > 100) { next = 100; setDirection(-1); }
        if (next < 0) { next = 0; setDirection(1); }
        return next;
      });
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, direction, SPEED, gameOver]);

  const handleGrab = () => {
    if (!isPlaying) return;
    // Green zone is between 40 and 60
    if (barPosition >= 35 && barPosition <= 65) {
      const newHeight = height + 1;
      setHeight(newHeight);
      if (newHeight >= GOAL) {
        setGameOver(true);
        setIsPlaying(false);
      }
    } else {
      // Fall
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  const start = () => {
    setHeight(0);
    setGameOver(false);
    setIsPlaying(true);
    setBarPosition(0);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0d1b2a] text-teal-50">
      <div 
        className="absolute inset-0 opacity-60 mix-blend-screen"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-iceland.png)`, backgroundSize: 'cover' }}
      />
      <BackButton />
      
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-8 pt-24 gap-8 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h1 className="font-display text-5xl md:text-7xl text-teal-300 mb-6 drop-shadow-[0_0_20px_rgba(45,212,191,0.5)]">Batman Mountain</h1>
          <div className="font-body text-xl leading-relaxed space-y-4 bg-slate-900/50 p-8 rounded-3xl backdrop-blur-md border border-teal-900/50 text-slate-300">
            <p><span className="text-4xl float-left mr-2 font-display text-purple-400">T</span>he air in Iceland bites your lungs.</p>
            <p>We found these towering basalt spires—locals called it "Batman Mountain." Free soloing the hexagonal columns required absolute focus. Timing, balance, and the surreal glow of the environment above made it unforgettable.</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-teal-800 shadow-[0_0_50px_rgba(45,212,191,0.1)] p-8">
            <h2 className="font-display text-4xl text-center text-teal-400 mb-8">Basalt Climber</h2>
            
            <div className="flex justify-between items-end mb-4 font-body">
              <span className="text-gray-400">Ground</span>
              <span className="text-2xl text-white">Height: {height} / {GOAL}</span>
              <span className="text-gray-400">Summit</span>
            </div>

            {/* Climbing Progress visual */}
            <div className="w-full h-8 bg-slate-800 rounded-full mb-12 overflow-hidden border border-slate-700 relative">
              <motion.div 
                className="absolute top-0 bottom-0 left-0 bg-teal-600"
                animate={{ width: `${(height / GOAL) * 100}%` }}
                transition={{ type: "spring" }}
              />
            </div>

            {/* The Game Area */}
            {!isPlaying && !gameOver && (
              <button onClick={start} className="w-full py-4 bg-teal-600 hover:bg-teal-500 rounded-xl font-display text-3xl shadow-lg transition-transform hover:scale-105">
                Start Climbing
              </button>
            )}

            {gameOver && (
              <div className="text-center">
                <p className="font-display text-4xl mb-4 text-white">
                  {height >= GOAL ? "Summit Reached!" : "You Slipped!"}
                </p>
                <button onClick={start} className="px-8 py-3 bg-teal-700 rounded-full font-display text-2xl hover:bg-teal-600">Try Again</button>
              </div>
            )}

            {isPlaying && (
              <div className="space-y-8">
                {/* Timing Bar */}
                <div className="relative w-full h-12 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-600">
                  {/* Success Zone */}
                  <div className="absolute top-0 bottom-0 left-[35%] right-[35%] bg-teal-500/30 border-l border-r border-teal-400" />
                  
                  {/* Moving Cursor */}
                  <motion.div 
                    className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_white]"
                    style={{ left: `${barPosition}%`, x: '-50%' }}
                  />
                </div>

                <button 
                  onClick={handleGrab}
                  className="w-full py-6 bg-slate-800 border-2 border-teal-600 text-teal-400 hover:bg-teal-900/50 rounded-2xl font-display text-4xl active:scale-95 transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                >
                  GRAB
                </button>
                <p className="text-center text-sm font-body text-slate-400">Tap when the line is in the center</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
