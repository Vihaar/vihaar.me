import { useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/BackButton";

const W = 420, H = 420;

const MEMBERS = [
  { name: "Vipul",       x: 210, y: 80,  color: "#e91e8c", bodyColor: "#f06292" },
  { name: "Vijval",      x: 340, y: 210, color: "#1976d2", bodyColor: "#42a5f5" },
  { name: "Vihaar",      x: 210, y: 340, color: "#388e3c", bodyColor: "#66bb6a" },
  { name: "Narasimha",   x: 80,  y: 210, color: "#f57c00", bodyColor: "#ffa726" },
  { name: "Usha",        x: 370, y: 340, color: "#9b59b6", bodyColor: "#c39bd3" },
];

function drawPerson(ctx: CanvasRenderingContext2D, x: number, y: number, name: string, color: string, bodyColor: string, glowing: boolean, size: number) {
  ctx.save();
  ctx.translate(x, y);

  // Glow
  if (glowing) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 24;
  }

  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.roundRect(-size * 0.6, -size * 0.3, size * 1.2, size * 1.4, size * 0.3);
  ctx.fill();

  // Head
  ctx.fillStyle = "#ffdab9";
  ctx.beginPath();
  ctx.arc(0, -size * 0.6, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -size * 0.6 - size * 0.2, size * 0.45, Math.PI, 0);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#333";
  ctx.beginPath(); ctx.arc(-size*0.18, -size*0.6, size*0.1, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(size*0.18, -size*0.6, size*0.1, 0, Math.PI*2); ctx.fill();

  // Smile (bigger if glowing)
  ctx.strokeStyle = "#333";
  ctx.lineWidth = glowing ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.arc(0, -size * 0.52, size * 0.2, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Name label
  ctx.shadowBlur = 0;
  ctx.fillStyle = glowing ? color : "#4a2e1b";
  ctx.font = `bold ${size * 0.55}px 'Patrick Hand', cursive`;
  ctx.textAlign = "center";
  ctx.fillText(name, 0, size * 1.3);

  ctx.restore();
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#e74c3c";
  ctx.shadowColor = "#e74c3c";
  ctx.shadowBlur = 20;
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, size * 0.4);
  ctx.bezierCurveTo(-size * 1.2, -size * 0.2, -size * 1.2, -size * 1.0, 0, -size * 0.5);
  ctx.bezierCurveTo(size * 1.2, -size * 1.0, size * 1.2, -size * 0.2, 0, size * 0.4);
  ctx.fill();
  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.8);
  bg.addColorStop(0, "#5a2a10");
  bg.addColorStop(1, "#2a0e05");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle warmth circles
  ctx.fillStyle = "rgba(230,110,30,0.06)";
  ctx.beginPath(); ctx.arc(W/2, H/2, 160, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(W/2, H/2, 90, 0, Math.PI*2); ctx.fill();

  // Dotted paths connecting center to each member position
  MEMBERS.forEach(m => {
    ctx.strokeStyle = "rgba(255,160,50,0.2)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(W/2, H/2);
    ctx.lineTo(m.x, m.y);
    ctx.stroke();
    ctx.setLineDash([]);
  });
}

export default function Family() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    activeIdx: 0,
    heartX: W/2, heartY: H/2,
    targetX: W/2, targetY: H/2,
    score: 0,
    timeLeft: 30,
    playing: false,
    frameId: 0,
    lastTime: 0,
    switchTimer: 1.5,
    heartScale: 1,
    heartBeat: 0,
    particles: [] as {x:number,y:number,vx:number,vy:number,life:number,color:string}[],
  });
  const [displayScore, setDisplayScore] = useState(0);
  const [displayTime, setDisplayTime] = useState(30);
  const [gameState, setGameState] = useState<"idle"|"playing"|"over">("idle");
  const timeIntervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function loop(ts: number) {
      const dt = Math.min((ts - s.lastTime) / 1000, 0.05);
      s.lastTime = ts;

      // Ensure active index is within bounds
      if (s.activeIdx >= MEMBERS.length) s.activeIdx = MEMBERS.length - 1;

      // Animate heart toward active member
      const target = MEMBERS[s.activeIdx];
      s.heartX += (target.x - s.heartX) * dt * 6;
      s.heartY += (target.y - s.heartY) * dt * 6;

      // Heartbeat pulse
      s.heartBeat += dt * 4;
      const pulse = 1 + Math.sin(s.heartBeat * 2) * 0.12;

      // Auto-switch active member
      if (s.playing) {
        s.switchTimer -= dt;
        if (s.switchTimer <= 0) {
          // pick different index
          let next = s.activeIdx;
          while (next === s.activeIdx) next = Math.floor(Math.random() * MEMBERS.length);
          s.activeIdx = next;
          s.switchTimer = Math.max(0.7, 1.5 - s.score * 0.03);
        }
      }

      // Particles
      s.particles = s.particles.filter(p => p.life > 0);
      s.particles.forEach(p => {
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vy += 60 * dt;
        p.life -= dt * 1.2;
      });

      // Draw
      drawBackground(ctx);

      // Draw members
      MEMBERS.forEach((m, i) => {
        drawPerson(ctx, m.x, m.y, m.name, m.color, m.bodyColor, i === s.activeIdx, 28);
      });

      // Draw heart
      drawHeart(ctx, s.heartX, s.heartY, 14 * pulse, 0.95);

      // Draw center label
      if (!s.playing) {
        ctx.fillStyle = "rgba(255,200,100,0.8)";
        ctx.font = "bold 16px 'Patrick Hand', cursive";
        ctx.textAlign = "center";
        ctx.fillText("Tap the glowing family member!", W/2, H/2 - 20);
      }

      // Particles
      s.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.bezierCurveTo(p.x-4, p.y-4, p.x+4, p.y-8, p.x, p.y-10);
        ctx.bezierCurveTo(p.x-4, p.y-8, p.x+4, p.y-4, p.x, p.y);
        ctx.fill();
        ctx.restore();
      });

      s.frameId = requestAnimationFrame(loop);
    }
    s.frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(s.frameId);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const s = stateRef.current;
    if (!s.playing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const scale = W / rect.width;
    const cx = (e.clientX - rect.left) * scale;
    const cy = (e.clientY - rect.top) * scale;

    // Check if clicked near active member
    const active = MEMBERS[s.activeIdx];
    const dist = Math.hypot(cx - active.x, cy - active.y);
    if (dist < 50) {
      s.score++;
      setDisplayScore(s.score);
      // Spawn hearts
      for (let i = 0; i < 6; i++) {
        s.particles.push({
          x: active.x, y: active.y,
          vx: (Math.random()-0.5)*80, vy: -80 - Math.random()*40,
          life: 1, color: active.color,
        });
      }
    }
  };

  const start = () => {
    const s = stateRef.current;
    s.score = 0; s.timeLeft = 30; s.playing = true;
    s.activeIdx = 0; s.switchTimer = 1.5;
    s.heartX = W/2; s.heartY = H/2;
    s.lastTime = performance.now();
    setDisplayScore(0); setDisplayTime(30); setGameState("playing");

    clearInterval(timeIntervalRef.current);
    timeIntervalRef.current = setInterval(() => {
      s.timeLeft--;
      setDisplayTime(s.timeLeft);
      if (s.timeLeft <= 0) {
        clearInterval(timeIntervalRef.current);
        s.playing = false;
        setGameState("over");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#3a1a08]">
      <div className="absolute inset-0 opacity-25"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-family.png)`, backgroundSize: "cover", backgroundPosition: "center" }}/>
      <BackButton />
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-6 pt-20 gap-8 max-w-6xl mx-auto items-center">
        {/* Story */}
        <div className="flex-1 max-w-sm">
          <h1 className="font-display text-7xl text-amber-300 mb-4 drop-shadow-lg">Family</h1>
          <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-900/40 text-amber-50 font-body text-lg leading-relaxed space-y-3">
            <p><em>Growing up in the Michigan suburbs, on a lake.</em></p>
            <p>Home was more than a place — it was a feeling. Every risk I've taken was backed by the unwavering foundation of family.</p>
            <p className="text-amber-400 text-sm font-semibold mt-4">Click/tap the glowing family member to pass the love! ❤️</p>
          </div>
          {gameState === "playing" && (
            <div className="mt-4 flex gap-4 justify-center">
              <div className="bg-black/50 px-6 py-3 rounded-2xl text-amber-200 font-display text-2xl">❤️ {displayScore}</div>
              <div className={`bg-black/50 px-6 py-3 rounded-2xl font-display text-2xl ${displayTime < 10 ? "text-red-400" : "text-amber-200"}`}>⏱ {displayTime}s</div>
            </div>
          )}
        </div>
        {/* Game */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H} onClick={handleClick}
              className="rounded-3xl shadow-2xl border-4 border-amber-900/50 cursor-pointer"/>
            {gameState === "idle" && (
              <div className="absolute inset-0 rounded-3xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-amber-200 font-display text-4xl">Pass the Love</p>
                <p className="text-amber-400 font-body">Click the glowing family member!</p>
                <button onClick={start} className="px-10 py-4 bg-amber-500 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">
                  Start! ❤️
                </button>
              </div>
            )}
            {gameState === "over" && (
              <div className="absolute inset-0 rounded-3xl bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-amber-200 font-display text-3xl">Round complete!</p>
                <p className="text-white font-body text-2xl">You passed love <span className="text-amber-400 font-bold">{displayScore}</span> times 🥹</p>
                <button onClick={start} className="px-10 py-4 bg-amber-500 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">
                  Play Again ❤️
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
