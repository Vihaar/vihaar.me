import { useState, useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, Crosshair } from "lucide-react";

type Action = 'JAB' | 'LOW' | 'BLOCK_HIGH' | 'BLOCK_LOW';

export default function Boxing() {
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [turn, setTurn] = useState(1);
  const [enemyIntent, setEnemyIntent] = useState<'HIGH' | 'LOW' | 'REST'>('HIGH');
  const [combatLog, setCombatLog] = useState<string[]>(["Round 1 begins. Opponent looks ready."]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (playerHP <= 0 || enemyHP <= 0) {
      setGameOver(true);
      log(playerHP <= 0 ? "You were knocked out!" : "TKO! You win!");
    }
  }, [playerHP, enemyHP]);

  const log = (msg: string) => setCombatLog(p => [msg, ...p].slice(0, 4));

  const getEnemyIntent = () => {
    const roll = Math.random();
    if (roll < 0.4) return 'HIGH';
    if (roll < 0.8) return 'LOW';
    return 'REST';
  };

  const handleAction = (action: Action) => {
    if (gameOver) return;
    
    let pDmg = 0;
    let eDmg = 0;
    let msg = "";

    // Resolve Player Attack
    if (action === 'JAB') {
      eDmg += 15;
      msg = "You threw a solid Jab! ";
    } else if (action === 'LOW') {
      eDmg += 20;
      msg = "You aimed a low body hook! ";
    } else {
      msg = `You guarded ${action === 'BLOCK_HIGH' ? 'high' : 'low'}. `;
    }

    // Resolve Enemy Attack
    if (enemyIntent === 'HIGH') {
      if (action === 'BLOCK_HIGH') {
        msg += "Blocked their high punch perfectly.";
        eDmg += 5; // counter
      } else {
        pDmg += 20;
        msg += "Opponent landed a devastating headshot!";
      }
    } else if (enemyIntent === 'LOW') {
      if (action === 'BLOCK_LOW') {
        msg += "Blocked their body blow.";
        eDmg += 5; // counter
      } else {
        pDmg += 20;
        msg += "Opponent worked your ribs hard!";
      }
    } else {
      msg += "Opponent caught their breath.";
    }

    setPlayerHP(h => Math.max(0, h - pDmg));
    setEnemyHP(h => Math.max(0, h - eDmg));
    log(msg);
    setTurn(t => t + 1);
    
    // Set next intent
    setEnemyIntent(getEnemyIntent());
  };

  const restart = () => {
    setPlayerHP(100);
    setEnemyHP(100);
    setTurn(1);
    setGameOver(false);
    setEnemyIntent('HIGH');
    setCombatLog(["Rematch starts! Keep your hands up."]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#1a1a1a] text-red-50">
      <div 
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-boxing.png)`, backgroundSize: 'cover' }}
      />
      
      {/* Lighting effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      
      <BackButton />
      
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-8 pt-24 gap-8 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h1 className="font-display text-6xl md:text-8xl text-red-600 mb-6 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">Boxing</h1>
          <div className="font-body text-xl leading-relaxed space-y-4 bg-black/60 p-8 rounded-3xl backdrop-blur-md border border-red-900/30 text-gray-300">
            <p><span className="text-4xl float-left mr-2 font-display text-red-500">F</span>reshman year, university boxing team.</p>
            <p>135-lb weight class. A broken nose in the first fight against GVSU taught me reality fast. The senior mentor I had was like an older brother—teaching me that boxing isn't about anger; it's about discipline, respect, and endurance under the lights.</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-[#2a2a2a]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-900/50 p-6 flex flex-col">
            
            <h2 className="text-center font-display text-4xl text-red-500 mb-6 tracking-wider uppercase">Punch Out</h2>

            {/* HP Bars */}
            <div className="flex justify-between items-center mb-8 gap-4 font-body">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span>You</span>
                  <span>{playerHP} HP</span>
                </div>
                <div className="h-4 bg-black rounded-full overflow-hidden border border-gray-700">
                  <motion.div className="h-full bg-blue-600" animate={{ width: `${playerHP}%` }} />
                </div>
              </div>
              <div className="text-2xl font-display text-gray-500 font-bold px-2">VS</div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span>Opponent</span>
                  <span>{enemyHP} HP</span>
                </div>
                <div className="h-4 bg-black rounded-full overflow-hidden border border-gray-700">
                  <motion.div className="h-full bg-red-600" animate={{ width: `${enemyHP}%` }} />
                </div>
              </div>
            </div>

            {/* Combat Area */}
            <div className="bg-black/50 rounded-xl p-4 mb-6 h-32 flex flex-col justify-center items-center text-center relative border border-gray-800">
              <div className="absolute top-2 left-2 text-xs text-gray-500 font-body uppercase tracking-wider">Turn {turn}</div>
              
              {!gameOver ? (
                <>
                  <p className="text-gray-400 font-body italic mb-2">Opponent's Stance:</p>
                  <p className="text-xl font-display text-red-400">
                    {enemyIntent === 'HIGH' ? "Aiming for your head..." : 
                     enemyIntent === 'LOW' ? "Looking at your ribs..." : 
                     "Catching breath..."}
                  </p>
                </>
              ) : (
                <div className="text-3xl font-display text-white">
                  {playerHP <= 0 ? "DEFEAT" : "VICTORY!"}
                </div>
              )}
            </div>

            {/* Controls */}
            {!gameOver ? (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleAction('BLOCK_HIGH')} className="py-4 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2 border border-slate-600 active:scale-95 transition-all">
                  <Shield className="w-5 h-5 text-blue-400" /> Block High
                </button>
                <button onClick={() => handleAction('BLOCK_LOW')} className="py-4 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2 border border-slate-600 active:scale-95 transition-all">
                  <ShieldAlert className="w-5 h-5 text-blue-400" /> Block Low
                </button>
                <button onClick={() => handleAction('JAB')} className="py-4 bg-red-900/60 hover:bg-red-800 rounded-xl flex items-center justify-center gap-2 border border-red-700 active:scale-95 transition-all">
                  <Crosshair className="w-5 h-5 text-red-400" /> Jab (High)
                </button>
                <button onClick={() => handleAction('LOW')} className="py-4 bg-red-900/60 hover:bg-red-800 rounded-xl flex items-center justify-center gap-2 border border-red-700 active:scale-95 transition-all">
                  <Crosshair className="w-5 h-5 text-red-400" /> Hook (Low)
                </button>
              </div>
            ) : (
              <button onClick={restart} className="w-full py-4 bg-red-700 hover:bg-red-600 text-white font-display text-2xl rounded-xl tracking-wider uppercase">
                Rematch
              </button>
            )}

            {/* Combat Log */}
            <div className="mt-6 font-body text-sm text-gray-400 space-y-1 overflow-hidden h-20">
              <AnimatePresence>
                {combatLog.map((log, i) => (
                  <motion.div 
                    key={`${turn}-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1 - i*0.3, x: 0 }}
                    className="truncate"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
