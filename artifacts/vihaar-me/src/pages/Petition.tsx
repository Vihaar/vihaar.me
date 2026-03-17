import { useState, useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { PenTool } from "lucide-react";
import { motion } from "framer-motion";

interface Signature { id: number; type: 'student' | 'parent'; x: number; y: number; }

export default function Petition() {
  const [player, setPlayer] = useState({ x: 2, y: 2 }); // 5x5 grid (0-4)
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const TARGET = 30;

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    const spawner = setInterval(() => {
      setSignatures(prev => {
        if (prev.length > 5) return prev;
        const newSig: Signature = {
          id: Date.now(),
          type: Math.random() > 0.7 ? 'parent' : 'student',
          x: Math.floor(Math.random() * 5),
          y: Math.floor(Math.random() * 5)
        };
        // Ensure not spawning exactly on player
        if (newSig.x === player.x && newSig.y === player.y) return prev;
        return [...prev, newSig];
      });
    }, 800);

    return () => { clearInterval(timer); clearInterval(spawner); };
  }, [isPlaying, timeLeft, player]);

  // Handle collision
  useEffect(() => {
    const hit = signatures.find(s => s.x === player.x && s.y === player.y);
    if (hit) {
      setScore(s => s + (hit.type === 'parent' ? 5 : 1));
      setSignatures(prev => prev.filter(s => s.id !== hit.id));
    }
  }, [player, signatures]);

  // Movement
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isPlaying || timeLeft <= 0) return;
      setPlayer(p => {
        let { x, y } = p;
        if (e.key === 'ArrowUp' || e.key === 'w') y = Math.max(0, y - 1);
        if (e.key === 'ArrowDown' || e.key === 's') y = Math.min(4, y + 1);
        if (e.key === 'ArrowLeft' || e.key === 'a') x = Math.max(0, x - 1);
        if (e.key === 'ArrowRight' || e.key === 'd') x = Math.min(4, x + 1);
        return { x, y };
      });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, timeLeft]);

  const start = () => {
    setScore(0);
    setTimeLeft(20);
    setPlayer({ x: 2, y: 2 });
    setSignatures([]);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden notebook-paper text-slate-800 cursor-default">
      <BackButton />
      
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-8 pt-24 gap-8 max-w-7xl mx-auto">
        
        {/* Story */}
        <div className="flex-1 flex flex-col justify-center max-w-lg pl-8">
          <h1 className="font-display text-5xl md:text-7xl text-slate-800 mb-6 relative">
            <span className="relative z-10">The Petition</span>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-300/40 -rotate-1" />
          </h1>
          <div className="font-display text-2xl leading-relaxed space-y-4 text-slate-700">
            <p>At Walled Lake Western, I started a petition to replace styrofoam trays with paper plates.</p>
            <p>First attempt: I got student signatures. Great numbers, wrong audience.</p>
            <p>Second attempt: I targeted <span className="bg-red-200/50 px-1 rounded">parents and taxpayers</span> (+5 pts). It worked! We got sponsors to put ads on the back of the trays to fund it.</p>
          </div>
        </div>

        {/* Game */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-[5px_5px_15px_rgba(0,0,0,0.1)] border border-slate-200 w-full max-w-md" style={{ transform: 'rotate(1deg)' }}>
            
            <div className="flex justify-between items-center mb-6 font-display text-3xl border-b-2 border-slate-800 pb-2">
              <div className="flex flex-col leading-none">
                <span className="text-sm text-slate-500 uppercase font-sans font-bold tracking-wider">Signatures</span>
                <span>{score} / {TARGET}</span>
              </div>
              <div className="text-red-500 font-bold">
                {timeLeft}s
              </div>
            </div>

            {!isPlaying && timeLeft === 20 ? (
              <div className="text-center py-12">
                <button onClick={start} className="px-8 py-3 bg-slate-800 text-white font-display text-2xl rounded shadow-md hover:bg-slate-700 transition-colors">Start Collecting</button>
                <p className="mt-4 font-body text-slate-500 text-sm">Use arrow keys/WASD. Parents are worth more!</p>
              </div>
            ) : !isPlaying && timeLeft <= 0 ? (
              <div className="text-center py-12">
                <p className="font-display text-4xl mb-4">
                  {score >= TARGET ? "Petition Passed!" : "Not enough support."}
                </p>
                <button onClick={start} className="px-6 py-2 border-2 border-slate-800 text-slate-800 font-display text-xl rounded hover:bg-slate-50 transition-colors">Try Again</button>
              </div>
            ) : (
              <div className="aspect-square bg-slate-50 border-2 border-slate-200 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none opacity-20">
                  {Array.from({length: 25}).map((_, i) => <div key={i} className="border border-slate-400" />)}
                </div>

                {/* Signatures */}
                {signatures.map(sig => (
                  <div 
                    key={sig.id}
                    className={`absolute w-1/5 h-1/5 flex items-center justify-center font-display text-xl animate-in fade-in zoom-in`}
                    style={{ left: `${sig.x * 20}%`, top: `${sig.y * 20}%` }}
                  >
                    {sig.type === 'parent' ? (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-sm border border-red-200 shadow-sm rotate-[-10deg]">Parent</span>
                    ) : (
                      <span className="text-slate-500">Student</span>
                    )}
                  </div>
                ))}

                {/* Player */}
                <motion.div 
                  className="absolute w-1/5 h-1/5 flex items-center justify-center z-10"
                  animate={{ left: `${player.x * 20}%`, top: `${player.y * 20}%` }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <PenTool className="w-5 h-5" />
                  </div>
                </motion.div>
              </div>
            )}
            
            {isPlaying && (
              <div className="mt-4 flex gap-2 md:hidden">
                <div className="grid grid-cols-3 gap-2 w-full max-w-[200px] mx-auto">
                  <div />
                  <button className="bg-slate-200 p-3 rounded active:bg-slate-300" onPointerDown={() => setPlayer(p => ({...p, y: Math.max(0, p.y-1)}))}>↑</button>
                  <div />
                  <button className="bg-slate-200 p-3 rounded active:bg-slate-300" onPointerDown={() => setPlayer(p => ({...p, x: Math.max(0, p.x-1)}))}>←</button>
                  <button className="bg-slate-200 p-3 rounded active:bg-slate-300" onPointerDown={() => setPlayer(p => ({...p, y: Math.min(4, p.y+1)}))}>↓</button>
                  <button className="bg-slate-200 p-3 rounded active:bg-slate-300" onPointerDown={() => setPlayer(p => ({...p, x: Math.min(4, p.x+1)}))}>→</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
