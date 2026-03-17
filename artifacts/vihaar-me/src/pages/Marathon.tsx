import { useState, useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { motion } from "framer-motion";
import { Timer, Footprints } from "lucide-react";

export default function Marathon() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pace, setPace] = useState(100);
  const [distance, setDistance] = useState(0); // target 26.2
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setPace(p => {
        const newPace = p - 2; // deplete energy
        if (newPace <= 0) {
          setIsPlaying(false);
          setGameOver(true);
          return 0;
        }
        return newPace;
      });

      setDistance(d => {
        const newDist = d + 0.1;
        if (newDist >= 26.2) {
          setIsPlaying(false);
          setGameOver(true);
          return 26.2;
        }
        return newDist;
      });
    }, 100); // Fast tick

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isPlaying) {
        e.preventDefault();
        step();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

  const step = () => {
    setPace(p => Math.min(100, p + 8)); // Fill bar
  };

  const start = () => {
    setPace(100);
    setDistance(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#5c2a18] text-orange-50">
      <div 
        className="absolute inset-0 opacity-50 mix-blend-overlay"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-marathon.png)`, backgroundSize: 'cover' }}
      />
      <BackButton />
      
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-8 pt-24 gap-8 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h1 className="font-display text-6xl md:text-8xl text-orange-400 mb-6 drop-shadow-md">Marathon</h1>
          <div className="font-body text-xl leading-relaxed space-y-4 bg-[#2b1108]/80 p-8 rounded-3xl backdrop-blur-sm border border-orange-900/50">
            <p><span className="text-4xl float-left mr-2 font-display text-amber-500">2</span>6.2 miles through Ann Arbor.</p>
            <p>Running a marathon isn't just physical. Around mile 20, you hit "the wall." It becomes a pure rhythm game of the mind—keeping the pace steady, step after step, until you cross the finish line.</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-[#3b170b]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-orange-900/50 text-center">
            
            <h2 className="font-display text-4xl text-orange-300 mb-2">Pacer</h2>
            <p className="font-body text-orange-200/60 mb-8">Maintain your rhythm to survive</p>

            <div className="text-6xl font-display text-white mb-8 tracking-wider">
              {distance.toFixed(1)} <span className="text-2xl text-orange-400">mi</span>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm font-body mb-2 text-orange-200">
                <span>Exhaustion</span>
                <span>Energy Level</span>
              </div>
              <div className="h-6 bg-[#2a0f06] rounded-full overflow-hidden border border-orange-900 p-1">
                <motion.div 
                  className={`h-full rounded-full ${pace > 50 ? 'bg-orange-500' : pace > 25 ? 'bg-yellow-500' : 'bg-red-600 animate-pulse'}`}
                  animate={{ width: `${pace}%` }}
                  transition={{ type: "tween", duration: 0.1 }}
                />
              </div>
            </div>

            {!isPlaying && !gameOver && (
              <button onClick={start} className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-display text-3xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2">
                <Footprints className="w-6 h-6" /> Start Race
              </button>
            )}

            {gameOver && (
              <div className="animate-in fade-in zoom-in duration-300">
                <p className="font-display text-3xl text-orange-200 mb-6">
                  {distance >= 26.2 ? "You crossed the finish line!" : "You hit the wall."}
                </p>
                <button onClick={start} className="px-8 py-3 bg-white text-[#5c2a18] rounded-full font-display text-2xl shadow-xl hover:scale-105 transition-transform">
                  Run Again
                </button>
              </div>
            )}

            {isPlaying && (
              <button 
                onPointerDown={(e) => { e.preventDefault(); step(); }}
                className="w-full py-8 bg-[#2a0f06] border-4 border-orange-600 text-orange-500 hover:bg-[#3d1609] hover:text-orange-400 rounded-2xl font-display text-4xl active:scale-95 transition-all shadow-[0_0_30px_rgba(234,88,12,0.2)] select-none"
              >
                TAP TO STEP
              </button>
            )}
            
            {isPlaying && <p className="mt-4 text-xs font-body text-orange-400/50">Or press Spacebar</p>}

          </div>
        </div>
      </div>
    </div>
  );
}
