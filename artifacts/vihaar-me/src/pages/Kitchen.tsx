import { useState, useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils } from "lucide-react";

const INGREDIENTS = [
  { id: 'scallop', label: 'Scallop', color: 'bg-orange-100 text-orange-800' },
  { id: 'caviar', label: 'Caviar', color: 'bg-slate-800 text-slate-100' },
  { id: 'dill', label: 'Micro Dill', color: 'bg-green-100 text-green-800' },
  { id: 'foam', label: 'Citrus Foam', color: 'bg-yellow-50 text-yellow-800' },
  { id: 'truffle', label: 'Truffle', color: 'bg-stone-800 text-stone-200' },
  { id: 'gold', label: 'Gold Leaf', color: 'bg-yellow-300 text-yellow-900' }
];

export default function Kitchen() {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'IDLE' | 'SHOWING' | 'PLAYING' | 'WIN' | 'LOSE'>('IDLE');

  const generateSequence = (len: number) => {
    return Array.from({length: len}, () => INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)].id);
  };

  const startLevel = (lvl: number) => {
    setLevel(lvl);
    const newSeq = generateSequence(2 + lvl);
    setSequence(newSeq);
    setPlayerInput([]);
    setGameState('SHOWING');
    
    // Hide sequence after a few seconds
    setTimeout(() => {
      setGameState('PLAYING');
    }, 1500 + (lvl * 500));
  };

  const handleIngredientClick = (id: string) => {
    if (gameState !== 'PLAYING') return;

    const newInput = [...playerInput, id];
    setPlayerInput(newInput);

    // Check if mistake
    const currentIndex = newInput.length - 1;
    if (newInput[currentIndex] !== sequence[currentIndex]) {
      setGameState('LOSE');
      return;
    }

    // Check if sequence complete
    if (newInput.length === sequence.length) {
      if (level === 5) {
        setGameState('WIN');
      } else {
        setTimeout(() => startLevel(level + 1), 1000);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#3a1319] text-amber-50">
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-kitchen.png)`, backgroundSize: 'cover' }}
      />
      <BackButton />
      
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-8 pt-24 gap-8 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h1 className="font-display text-5xl md:text-7xl text-amber-200 mb-6 drop-shadow-lg">Max Cekot Kitchen</h1>
          <div className="font-body text-xl leading-relaxed space-y-4 bg-black/40 p-8 rounded-3xl backdrop-blur-md border border-amber-900/50">
            <p><span className="text-4xl float-left mr-2 font-display text-amber-500">R</span>iga, Latvia. The only Michelin star in the country.</p>
            <p>I came in as a stage, knowing almost nothing about fine dining. The kitchen demands absolute perfection, memory, and speed. You assemble art on a plate while a clock ticks down. I learned more here about high-stakes performance than anywhere else.</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-[#1a080c]/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-[#521b23]">
            <div className="flex justify-between items-center mb-8 border-b border-[#521b23] pb-4">
              <h2 className="font-display text-3xl text-amber-400">Plate Up</h2>
              <div className="bg-amber-900/50 px-3 py-1 rounded text-amber-200 font-body">Service {level}/5</div>
            </div>

            {gameState === 'IDLE' && (
              <div className="text-center py-12">
                <Utensils className="w-16 h-16 text-amber-500/50 mx-auto mb-6" />
                <button onClick={() => startLevel(1)} className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-full font-display text-3xl shadow-[0_0_20px_rgba(180,83,9,0.4)] transition-all hover:scale-105">
                  Start Service
                </button>
              </div>
            )}

            {(gameState === 'SHOWING' || gameState === 'PLAYING') && (
              <div className="space-y-8">
                {/* The Plate (Target) */}
                <div className="h-32 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute top-2 left-3 text-xs uppercase tracking-widest text-amber-500/70 font-bold">Chef's Order</div>
                  
                  {gameState === 'SHOWING' ? (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {sequence.map((id, i) => {
                        const ing = INGREDIENTS.find(x => x.id === id)!;
                        return (
                          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i*0.1 }} className={`px-3 py-1 rounded-full text-sm font-bold ${ing.color}`}>
                            {ing.label}
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-2xl font-display text-amber-200/50">Recreate the dish...</div>
                  )}
                </div>

                {/* Player's Plate */}
                <div className="h-16 flex items-center justify-center gap-2 border-b-2 border-dashed border-amber-900/50 pb-4">
                  <AnimatePresence>
                    {playerInput.map((id, i) => {
                      const ing = INGREDIENTS.find(x => x.id === id)!;
                      return (
                        <motion.div key={i} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} className={`w-8 h-8 rounded-full ${ing.color} flex items-center justify-center shadow-lg border-2 border-white/20`} title={ing.label} />
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Ingredients selection */}
                <div className="grid grid-cols-2 gap-3">
                  {INGREDIENTS.map(ing => (
                    <button
                      key={ing.id}
                      onClick={() => handleIngredientClick(ing.id)}
                      disabled={gameState !== 'PLAYING'}
                      className={`p-3 rounded-xl border border-white/10 transition-transform active:scale-95 text-left font-body font-bold ${ing.color} ${gameState !== 'PLAYING' ? 'opacity-50 grayscale' : 'hover:brightness-110'}`}
                    >
                      {ing.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gameState === 'LOSE' && (
              <div className="text-center py-8 animate-in slide-in-from-bottom-4">
                <p className="font-display text-4xl text-red-400 mb-2">Dish Rejected!</p>
                <p className="font-body text-amber-200/60 mb-6">The chef noticed the mistake.</p>
                <button onClick={() => startLevel(1)} className="px-6 py-2 bg-[#521b23] hover:bg-[#6b232e] text-white rounded-full font-display text-xl">Restart Service</button>
              </div>
            )}

            {gameState === 'WIN' && (
              <div className="text-center py-8 animate-in slide-in-from-bottom-4">
                <p className="font-display text-5xl text-yellow-400 mb-2 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">Michelin Star!</p>
                <p className="font-body text-amber-100 mb-6">Flawless execution.</p>
                <button onClick={() => setGameState('IDLE')} className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-full font-display text-xl text-white">Play Again</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
