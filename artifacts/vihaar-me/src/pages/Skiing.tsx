import { useState, useEffect, useCallback } from "react";
import { BackButton } from "@/components/BackButton";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trees, Snowflake } from "lucide-react";

export default function Skiing() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2
  const [obstacles, setObstacles] = useState<{id: number, lane: number, y: number}[]>([]);
  const [gameOver, setGameOver] = useState(false);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') setPlayerLane(l => Math.max(0, l - 1));
      if (e.key === 'ArrowRight') setPlayerLane(l => Math.min(2, l + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;
    
    let frameId: number;
    let lastTime = performance.now();
    let speed = 40; // units per second

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setObstacles(prev => {
        let newObs = prev.map(o => ({ ...o, y: o.y + speed * dt }));
        
        // Check collision (player is at y: 80 to 90)
        const hit = newObs.find(o => o.y > 80 && o.y < 95 && o.lane === playerLane);
        if (hit) {
          setIsPlaying(false);
          setGameOver(true);
          return prev;
        }

        // Remove offscreen
        newObs = newObs.filter(o => o.y < 110);

        // Spawn new
        if (Math.random() < 0.03 + (score * 0.001)) { // gets harder
          if (!newObs.find(o => o.y < 20)) { // prevent stacking
            newObs.push({
              id: Math.random(),
              lane: Math.floor(Math.random() * 3),
              y: -10
            });
          }
        }
        return newObs;
      });

      setScore(s => s + Math.floor(dt * 10));
      frameId = requestAnimationFrame(loop);
    };
    
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, playerLane, score]);

  const startGame = () => {
    setScore(0);
    setObstacles([]);
    setPlayerLane(1);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#e6f2f5] text-slate-800">
      <div 
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-skiing.png)`, backgroundSize: 'cover' }}
      />
      {/* Snow effect CSS */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {Array.from({length: 20}).map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full blur-[1px]"
            style={{
              width: Math.random() * 10 + 5 + 'px',
              height: Math.random() * 10 + 5 + 'px',
              left: Math.random() * 100 + '%',
              top: -20,
              animation: `float ${Math.random() * 5 + 5}s linear infinite`,
              animationDelay: `-${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <BackButton />
      
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-8 pt-24 gap-8 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h1 className="font-display text-6xl md:text-8xl text-blue-900 mb-6 drop-shadow-sm">Skiing</h1>
          <div className="font-body text-xl leading-relaxed space-y-4 bg-white/60 p-8 rounded-3xl backdrop-blur-md shadow-xl border border-white">
            <p><span className="text-4xl float-left mr-2 font-display text-blue-600">I</span>cy winds, intense focus, and the rush of gravity.</p>
            <p>Skiing is the unique place where fear and joy co-exist. The mountain demands complete presence. Every turn is a negotiation with speed.</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-100 flex flex-col relative" style={{ height: '600px' }}>
            
            <div className="p-4 bg-blue-900 text-white flex justify-between items-center z-20">
              <span className="font-display text-2xl">Downhill Dodge</span>
              <span className="font-body font-bold">Score: {score}</span>
            </div>

            {/* Game Canvas Area */}
            <div className="flex-1 relative bg-gradient-to-b from-blue-100 to-white overflow-hidden">
              {!isPlaying && !gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm z-30">
                  <button onClick={startGame} className="px-8 py-3 bg-blue-600 text-white rounded-full font-display text-3xl shadow-lg hover:scale-105 transition-transform">Start Run</button>
                  <p className="mt-4 text-blue-900 font-body">Use Left/Right arrows or buttons</p>
                </div>
              )}
              {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/80 backdrop-blur-sm z-30 text-white">
                  <h3 className="font-display text-5xl mb-2">Wipeout!</h3>
                  <p className="font-body text-xl mb-6">Distance: {score}m</p>
                  <button onClick={startGame} className="px-8 py-3 bg-white text-blue-900 rounded-full font-display text-3xl shadow-lg hover:scale-105 transition-transform">Try Again</button>
                </div>
              )}

              {/* Lanes */}
              <div className="absolute inset-0 flex">
                <div className="flex-1 border-r border-blue-200/50" />
                <div className="flex-1 border-r border-blue-200/50" />
                <div className="flex-1" />
              </div>

              {/* Obstacles */}
              {obstacles.map(obs => (
                <div 
                  key={obs.id}
                  className="absolute w-1/3 text-green-800 flex justify-center items-center drop-shadow-md"
                  style={{ left: `${obs.lane * 33.33}%`, top: `${obs.y}%` }}
                >
                  <Trees className="w-12 h-12" />
                </div>
              ))}

              {/* Player */}
              <motion.div 
                className="absolute bottom-[10%] w-1/3 flex justify-center items-center text-blue-600 drop-shadow-lg z-20"
                animate={{ left: `${playerLane * 33.33}%` }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Snowflake className="w-10 h-10 animate-spin" style={{ animationDuration: '3s' }} />
              </motion.div>
            </div>

            {/* Mobile Controls */}
            <div className="h-24 bg-slate-100 border-t flex z-20 p-2 gap-2">
              <button 
                className="flex-1 bg-white rounded-xl shadow flex items-center justify-center active:bg-blue-50"
                onPointerDown={() => isPlaying && setPlayerLane(l => Math.max(0, l - 1))}
              >
                <ChevronLeft className="w-10 h-10 text-slate-400" />
              </button>
              <button 
                className="flex-1 bg-white rounded-xl shadow flex items-center justify-center active:bg-blue-50"
                onPointerDown={() => isPlaying && setPlayerLane(l => Math.min(2, l + 1))}
              >
                <ChevronRight className="w-10 h-10 text-slate-400" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
