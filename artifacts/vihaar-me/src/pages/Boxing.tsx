import { useEffect, useRef, useState, useCallback } from "react";
import { BackButton } from "@/components/BackButton";

const W = 500, H = 380;

function drawBoxer(ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean, color: string, state: string, hp: number) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);

  const shake = state === "hit" ? (Math.random() - 0.5) * 6 : 0;
  ctx.translate(shake, 0);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.ellipse(0, 80, 25, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  const legOffset = state === "punch" ? 8 : 0;
  ctx.fillStyle = "#444";
  ctx.fillRect(-14, 48, 12, 32);
  ctx.fillRect(4, 48, 12, 32);
  // Shoes
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.roundRect(-18, 76, 16, 8, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(2, 76, 20, 8, 3);
  ctx.fill();

  // Body (trunk)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(-16, 10, 32, 40, 5);
  ctx.fill();
  // Shorts
  ctx.fillStyle = "#333";
  ctx.fillRect(-16, 38, 32, 12);

  // Back arm (guard)
  ctx.fillStyle = color;
  if (state === "punch") {
    // Extended punch arm
    ctx.beginPath();
    ctx.roundRect(12, 14, 36, 14, 6);
    ctx.fill();
    // Glove
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(50, 21, 12, 0, Math.PI * 2);
    ctx.fill();
    // Back guard
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-32, 18, 18, 12, 5);
    ctx.fill();
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(-32, 24, 10, 0, Math.PI * 2);
    ctx.fill();
  } else if (state === "dodge") {
    // Lean back
    ctx.beginPath();
    ctx.roundRect(-30, 20, 18, 12, 5);
    ctx.fill();
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(-30, 26, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-10, 14, 18, 12, 5);
    ctx.fill();
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(-10, 20, 10, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Guard position
    ctx.beginPath();
    ctx.roundRect(-30, 16, 18, 12, 5);
    ctx.fill();
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(-30, 22, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(12, 16, 18, 12, 5);
    ctx.fill();
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(30, 22, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // Head
  ctx.fillStyle = "#ffdab9";
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  // Headgear
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -4, 16, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(-16, -4, 32, 6);
  // Chin strap
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0.3, Math.PI - 0.3);
  ctx.stroke();
  // Eyes
  ctx.fillStyle = "white";
  ctx.beginPath(); ctx.arc(-6, -2, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -2, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#333";
  ctx.beginPath(); ctx.arc(-5, -2, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(7, -2, 2.5, 0, Math.PI * 2); ctx.fill();

  // HP bar above head
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.roundRect(-30, -44, 60, 10, 4);
  ctx.fill();
  const hpColor = hp > 60 ? "#2ecc71" : hp > 30 ? "#f39c12" : "#e74c3c";
  ctx.fillStyle = hpColor;
  ctx.beginPath();
  ctx.roundRect(-30, -44, (hp / 100) * 60, 10, 4);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "bold 8px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${hp}`, 0, -36);

  if (state === "hit") {
    ctx.fillStyle = "#e74c3c";
    ctx.font = "bold 20px Arial";
    ctx.fillText("!", 0, -55);
  }

  ctx.restore();
}

function drawRing(ctx: CanvasRenderingContext2D) {
  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#1a0a0a");
  bg.addColorStop(1, "#2d1515");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Spotlight
  const spot = ctx.createRadialGradient(W/2, H/3, 0, W/2, H/3, 220);
  spot.addColorStop(0, "rgba(255,255,220,0.18)");
  spot.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = spot;
  ctx.fillRect(0, 0, W, H);

  // Canvas mat
  ctx.fillStyle = "#8b3030";
  ctx.beginPath();
  ctx.roundRect(40, H - 140, W - 80, 130, 8);
  ctx.fill();
  ctx.fillStyle = "#a03838";
  ctx.fillRect(50, H - 140, W - 100, 3);
  ctx.fillRect(50, H - 50, W - 100, 3);

  // Ropes
  for (let i = 0; i < 3; i++) {
    const ry = H - 55 - i * 25;
    ctx.strokeStyle = ["#e74c3c", "#ffffff", "#e74c3c"][i];
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(30, ry);
    ctx.bezierCurveTo(W/3, ry + (i%2?4:-4), 2*W/3, ry + (i%2?-4:4), W-30, ry);
    ctx.stroke();
  }

  // Corner posts
  [[30,H-150],[W-30,H-150]].forEach(([px,py]) => {
    ctx.fillStyle = "#c8a040";
    ctx.fillRect(px-6, py, 12, 145);
  });
}

export default function Boxing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    playerHP: 100,
    enemyHP: 100,
    playerState: "idle" as string,
    enemyState: "idle" as string,
    result: "" as string,
    stateTimer: 0,
    enemyTimer: 1.5,
    started: false,
    frameId: 0,
    lastTime: 0,
    round: 1,
  });
  const [gameState, setGameState] = useState<"idle"|"playing"|"over">("idle");
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("Use A/D/S to fight!");

  const doAction = useCallback((action: "jab"|"hook"|"dodge") => {
    const s = stateRef.current;
    if (!s.started || s.stateTimer > 0 || s.playerState !== "idle") return;

    if (action === "jab") {
      s.playerState = "punch";
      s.stateTimer = 0.4;
      // Hit or miss
      if (s.enemyState !== "dodge") {
        const dmg = 12;
        s.enemyHP = Math.max(0, s.enemyHP - dmg);
        setEnemyHP(s.enemyHP);
        setMessage("Jab lands! 💥");
        s.enemyState = "hit";
        setTimeout(() => { s.enemyState = "idle"; }, 300);
      } else {
        setMessage("Opponent dodged!");
      }
    } else if (action === "hook") {
      s.playerState = "punch";
      s.stateTimer = 0.5;
      if (s.enemyState !== "dodge") {
        const dmg = 20;
        s.enemyHP = Math.max(0, s.enemyHP - dmg);
        setEnemyHP(s.enemyHP);
        setMessage("Hook connects! 💥");
        s.enemyState = "hit";
        setTimeout(() => { s.enemyState = "idle"; }, 300);
      } else {
        setMessage("Missed the hook!");
      }
    } else if (action === "dodge") {
      s.playerState = "dodge";
      s.stateTimer = 0.5;
      setMessage("Dodge!");
    }

    if (s.enemyHP <= 0) {
      s.started = false;
      s.result = "KO! You Win! 🏆";
      setResult("KO! You Win! 🏆");
      setGameState("over");
    }
    setTimeout(() => { s.playerState = "idle"; }, 400);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "ArrowLeft") doAction("jab");
      if (e.key === "d" || e.key === "ArrowRight") doAction("hook");
      if (e.key === "s" || e.key === "ArrowDown" || e.key === " ") doAction("dodge");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doAction]);

  useEffect(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function loop(ts: number) {
      const dt = Math.min((ts - s.lastTime) / 1000, 0.05);
      s.lastTime = ts;

      drawRing(ctx);
      drawBoxer(ctx, 130, H - 200, false, "#3498db", s.playerState, s.playerHP);
      drawBoxer(ctx, 370, H - 200, true, "#e74c3c", s.enemyState, s.enemyHP);

      // Enemy AI
      if (s.started) {
        s.enemyTimer -= dt;
        if (s.enemyTimer <= 0) {
          s.enemyTimer = 1.2 + Math.random();
          // Enemy attacks
          if (s.playerState !== "dodge" && Math.random() > 0.3) {
            s.enemyState = "punch";
            const dmg = 10 + Math.floor(Math.random() * 10);
            s.playerHP = Math.max(0, s.playerHP - dmg);
            setPlayerHP(s.playerHP);
            s.playerState = "hit";
            setMessage(`You took ${dmg} damage! Guard up!`);
            setTimeout(() => { s.playerState = "idle"; }, 300);
            setTimeout(() => { s.enemyState = "idle"; }, 400);
          } else {
            s.enemyState = "dodge";
            setTimeout(() => { s.enemyState = "idle"; }, 500);
          }
          if (s.playerHP <= 0) {
            s.started = false;
            s.result = "KO'd! Try again 🥊";
            setResult("KO'd! Try again 🥊");
            setGameState("over");
          }
        }
      }

      // Draw round text
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "bold 14px 'Patrick Hand', cursive";
      ctx.textAlign = "center";
      ctx.fillText(`ROUND ${s.round}`, W/2, 30);

      s.stateTimer = Math.max(0, s.stateTimer - dt);
      s.frameId = requestAnimationFrame(loop);
    }

    s.frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(s.frameId);
  }, []);

  const start = () => {
    const s = stateRef.current;
    s.playerHP = 100; s.enemyHP = 100;
    s.playerState = "idle"; s.enemyState = "idle";
    s.stateTimer = 0; s.enemyTimer = 1.5;
    s.result = ""; s.started = true; s.round = 1;
    s.lastTime = performance.now();
    setPlayerHP(100); setEnemyHP(100);
    setResult(""); setMessage("Use A/D/S to fight!");
    setGameState("playing");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#1a0808]">
      <div className="absolute inset-0 opacity-35"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-boxing.png)`, backgroundSize: "cover", backgroundPosition: "center" }}/>
      <BackButton />
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-6 pt-20 gap-8 max-w-6xl mx-auto items-center">
        {/* Story */}
        <div className="flex-1 max-w-sm">
          <h1 className="font-display text-7xl text-red-500 mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">Boxing</h1>
          <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-red-900/40 text-red-100 font-body text-lg leading-relaxed space-y-3">
            <p><em>Freshman year. 135-lb weight class.</em></p>
            <p>A broken nose in my first fight vs GVSU. My senior mentor was like an older brother — boxing isn't about anger, it's discipline under the lights.</p>
            <div className="mt-4 p-3 bg-red-900/30 rounded-xl text-sm">
              <p className="font-bold text-red-300 mb-1">Controls:</p>
              <p>A / ← → Jab</p>
              <p>D / → → Hook</p>
              <p>S / Space → Dodge</p>
            </div>
          </div>
        </div>
        {/* Game */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H} className="rounded-2xl shadow-2xl border-2 border-red-900/50"/>
            {gameState === "idle" && (
              <div className="absolute inset-0 rounded-2xl bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-white font-display text-5xl drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]">PUNCH OUT</p>
                <p className="text-red-300 font-body text-lg">A=Jab  D=Hook  S=Dodge</p>
                <button onClick={start} className="px-10 py-4 bg-red-600 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">
                  Fight!
                </button>
              </div>
            )}
            {gameState === "over" && (
              <div className="absolute inset-0 rounded-2xl bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-white font-display text-4xl">{result}</p>
                <button onClick={start} className="px-10 py-4 bg-red-600 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">
                  Rematch!
                </button>
              </div>
            )}
          </div>
          {/* Message */}
          <p className="text-red-200 font-body text-lg bg-black/40 px-6 py-2 rounded-full">{message}</p>
          {/* Mobile controls */}
          {gameState === "playing" && (
            <div className="flex gap-3">
              <button onClick={() => doAction("jab")} className="px-6 py-4 bg-blue-600/80 text-white font-display text-xl rounded-2xl shadow hover:scale-105 active:scale-95">JAB</button>
              <button onClick={() => doAction("dodge")} className="px-6 py-4 bg-gray-600/80 text-white font-display text-xl rounded-2xl shadow hover:scale-105 active:scale-95">DODGE</button>
              <button onClick={() => doAction("hook")} className="px-6 py-4 bg-red-600/80 text-white font-display text-xl rounded-2xl shadow hover:scale-105 active:scale-95">HOOK</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
