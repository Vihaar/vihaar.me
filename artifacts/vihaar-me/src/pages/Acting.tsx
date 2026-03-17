import { useState, useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { motion } from "framer-motion";
import { Film, Eye, Hand, RotateCcw, Shield } from "lucide-react";

type Action = 'LOOK' | 'CLAP' | 'TURN' | 'FREEZE';
const ACTIONS: {type: Action, label: string, icon: any}[] = [
  {type: 'LOOK', label: 'Look Left', icon: Eye},
  {type: 'CLAP', label: 'Clap', icon: Hand},
  {type: 'TURN', label: 'Turn', icon: RotateCcw},
  {type: 'FREEZE', label: 'Freeze', icon: Shield},
];

export default function Acting() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [prompt, setPrompt] = useState<{text: string, action: Action, isSimon: boolean} | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const generatePrompt = () => {
    const isSimon = Math.random() > 0.3; // 70% chance it's a real simon says
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    setPrompt({
      text: isSimon ? `Director says: ${action.label.toUpperCase()}` : `${action.label.toUpperCase()}!`,
      action: action.type,
      isSimon
    });
  };

  useEffect(() => {
    if (!isPlaying) return;
    
    // Auto-fail if you don't respond to a Simon prompt in time
    let timer: any;
    if (prompt && prompt.isSimon) {
      timer = setTimeout(() => {
        setGameOver(true);
        setIsPlaying(false);
      }, Math.max(1000, 2500 - score * 100)); // Gets faster
    } else if (prompt && !prompt.isSimon) {
      timer = setTimeout(() => {
        generatePrompt(); // moving on, player correctly ignored
      }, 1500);
    }
    
    return () => clearTimeout(timer);
  }, [prompt, isPlaying]);

  const handleAction = (act: Action) => {
    if (!isPlaying || !prompt) return;
    
    if (prompt.isSimon && prompt.action === act) {
      setScore(s => s + 1);
      setPrompt(null);
      setTimeout(generatePrompt, 400); // Brief pause before next
    } else {
      // Failed (either did wrong action, or acted when simon didn't say)
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  const start = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    generatePrompt();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#2b2518] text-yellow-100 scanlines cursor-default">
      <div 
        className="absolute inset-0 opacity-40 mix-blend-overlay sepia-[0.5]"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-acting.png)`, backgroundSize: 'cover' }}
      />
      <BackButton />
      
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-8 pt-24 gap-8 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <Film className="w-12 h-12 text-yellow-600 animate-pulse" />
            <h1 className="font-display text-5xl md:text-7xl text-yellow-500 drop-shadow-md">Child Actor</h1>
          </div>
          <div className="font-body text-xl leading-relaxed space-y-4 bg-black/60 p-8 rounded-3xl backdrop-blur-md border border-yellow-900/30">
            <p><span className="text-4xl float-left mr-2 font-display text-yellow-400">B</span>etween middle school and high school, I spent a year acting.</p>
            <p>Modeling, commercials, short films, and a sitcom called "My Step Kids". It was a crash course in taking direction, hitting marks, and delivering under the pressure of a rolling camera.</p>
            <a href="https://www.imdb.com/name/nm9990820/" target="_blank" rel="noreferrer" className="inline-block mt-4 px-4 py-2 border border-yellow-600 rounded-full hover:bg-yellow-600/20 transition-colors text-sm uppercase tracking-widest text-yellow-400">View IMDb Profile</a>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-[#1a160d]/90 backdrop-blur-xl rounded-xl shadow-2xl p-6 border-4 border-[#3a301c] relative">
            
            {/* Film border dots */}
            <div className="absolute top-0 bottom-0 left-2 w-2 flex flex-col justify-between py-2">
              {Array.from({length: 12}).map((_, i) => <div key={`l-${i}`} className="w-2 h-3 bg-[#0d0b06] rounded-sm" />)}
            </div>
            <div className="absolute top-0 bottom-0 right-2 w-2 flex flex-col justify-between py-2">
              {Array.from({length: 12}).map((_, i) => <div key={`r-${i}`} className="w-2 h-3 bg-[#0d0b06] rounded-sm" />)}
            </div>

            <div className="px-6 text-center">
              <h2 className="font-display text-4xl text-yellow-600 mb-2">Director's Cues</h2>
              <p className="font-body text-yellow-200/50 mb-8 font-bold tracking-widest">Takes: {score}</p>

              {!isPlaying && !gameOver && (
                <div className="py-12">
                  <button onClick={start} className="px-8 py-3 bg-yellow-700 text-black font-display text-3xl hover:bg-yellow-600 transition-colors shadow-[0_0_15px_rgba(202,138,4,0.5)]">ACTION!</button>
                  <p className="mt-4 font-body text-sm text-yellow-600">Only act when the "Director says"</p>
                </div>
              )}

              {gameOver && (
                <div className="py-12">
                  <p className="font-display text-5xl text-red-500 mb-2 drop-shadow-md">CUT!</p>
                  <p className="font-body text-yellow-200 mb-6">You missed your cue.</p>
                  <button onClick={start} className="px-6 py-2 border-2 border-yellow-700 text-yellow-500 font-display text-2xl hover:bg-yellow-900/30">Take Two</button>
                </div>
              )}

              {isPlaying && (
                <div className="space-y-8 min-h-[300px] flex flex-col justify-center">
                  <div className="h-24 flex items-center justify-center bg-black border-2 border-yellow-900 rounded p-4 shadow-inner">
                    {prompt ? (
                      <motion.div 
                        key={prompt.text}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`font-display text-3xl ${prompt.isSimon ? 'text-yellow-400' : 'text-gray-400'}`}
                      >
                        {prompt.text}
                      </motion.div>
                    ) : (
                      <span className="text-gray-600 font-body animate-pulse">Waiting for cue...</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {ACTIONS.map(act => (
                      <button 
                        key={act.type}
                        onClick={() => handleAction(act.type)}
                        className="py-4 bg-[#2b2518] border border-yellow-800 hover:bg-[#3a301c] active:bg-yellow-900/50 rounded flex flex-col items-center gap-2 text-yellow-500 transition-colors"
                      >
                        <act.icon className="w-6 h-6" />
                        <span className="font-display text-xl">{act.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
