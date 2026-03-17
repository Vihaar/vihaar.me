import { useState, useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";

export default function Tedx() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [promptActive, setPromptActive] = useState(false);
  
  // Very simple reaction time game: A prompt flashes, hit space/button fast.
  
  useEffect(() => {
    if (!isPlaying) return;
    
    let timer: any;
    const scheduleNext = () => {
      setPromptActive(false);
      const delay = Math.random() * 2000 + 1000;
      timer = setTimeout(() => {
        setPromptActive(true);
        // Window to hit is 600ms
        setTimeout(() => {
          setPromptActive(active => {
            if (active) {
              setMessage("Missed the beat!");
              setScore(s => Math.max(0, s - 10));
            }
            return false;
          });
          scheduleNext();
        }, 600);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, [isPlaying]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isPlaying) {
        e.preventDefault();
        handleHit();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, promptActive]);

  const handleHit = () => {
    if (promptActive) {
      setScore(s => s + 20);
      setMessage("Perfect delivery!");
      setPromptActive(false); // consume it
    } else {
      setScore(s => Math.max(0, s - 5));
      setMessage("Too early!");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#6b1111] text-white cursor-default">
      <div 
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-tedx.png)`, backgroundSize: 'cover' }}
      />
      
      {/* Spotlight effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none mix-blend-overlay blur-[50px]" style={{ clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0% 100%)' }} />

      <BackButton />
      
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-8 pt-24 gap-8 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h1 className="font-display text-6xl md:text-8xl text-red-400 mb-6 drop-shadow-xl">TEDxYouth</h1>
          <div className="font-body text-xl leading-relaxed space-y-4 bg-black/30 p-8 rounded-3xl backdrop-blur-sm border border-red-500/20">
            <p><span className="text-4xl float-left mr-2 font-display text-white">F</span>ounding a TEDxYouth event was about more than logistics.</p>
            <p>It was years of organizing, curating speakers, and learning the rhythm of a great speech. I got good at talking, but more importantly, I helped others find their voice and hit their cadence on stage.</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-black/60 backdrop-blur-xl rounded-full aspect-square border-8 border-red-900/50 shadow-[0_0_50px_rgba(220,38,38,0.3)] flex flex-col items-center justify-center p-8 relative">
            
            <h2 className="font-display text-3xl text-red-400 absolute top-12">Keep the Beat</h2>
            
            <div className="absolute top-24 font-body text-xl">Score: <span className="font-bold text-white">{score}</span></div>

            {!isPlaying ? (
              <button onClick={() => {setIsPlaying(true); setScore(0); setMessage("");}} className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-500 rounded-full font-display text-4xl shadow-xl hover:scale-105 transition-all">
                Take the Stage
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center w-full mt-4">
                
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-colors duration-100 ${promptActive ? 'border-red-500 bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'border-gray-700 bg-transparent'}`}>
                  <Mic className={`w-12 h-12 ${promptActive ? 'text-red-400 animate-pulse' : 'text-gray-600'}`} />
                </div>
                
                <button 
                  onPointerDown={handleHit}
                  className="mt-12 px-12 py-6 bg-red-700 active:bg-red-500 text-white rounded-full font-display text-3xl select-none"
                >
                  SPEAK!
                </button>
                <p className="mt-4 font-body text-gray-400">Wait for the cue, then hit it.</p>
              </div>
            )}

            <div className="absolute bottom-16 text-center font-display text-2xl h-8 text-red-200">
              {message}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
