import { useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/BackButton";

const W = 400, H = 600;
const LANES = 3;
const LANE_W = W / LANES;

interface Obstacle { x: number; y: number; type: "tree" | "rock"; }

function drawSkier(ctx: CanvasRenderingContext2D, x: number, y: number, lean: number) {
  ctx.save();
  ctx.translate(x, y);
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.ellipse(0, 18, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.fillStyle = "#3498db";
  ctx.beginPath();
  ctx.roundRect(-8, -10, 16, 22, 4);
  ctx.fill();
  // Head
  ctx.fillStyle = "#ffdab9";
  ctx.beginPath();
  ctx.arc(0, -18, 10, 0, Math.PI * 2);
  ctx.fill();
  // Helmet
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.arc(0, -22, 8, Math.PI, 0);
  ctx.fill();
  // Goggles
  ctx.fillStyle = "#ffd700";
  ctx.fillRect(-7, -21, 5, 4);
  ctx.fillRect(2, -21, 5, 4);
  // Skis
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-10, 12);
  ctx.lineTo(-14 + lean * 5, 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(10, 12);
  ctx.lineTo(14 + lean * 5, 20);
  ctx.stroke();
  // Poles
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-6, -2);
  ctx.lineTo(-18, 16);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(6, -2);
  ctx.lineTo(18, 16);
  ctx.stroke();
  ctx.restore();
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  // Trunk
  ctx.fillStyle = "#8b6914";
  ctx.fillRect(-4, 0, 8, 20);
  // Layers
  ctx.fillStyle = "#2d7a1e";
  ctx.beginPath();
  ctx.moveTo(0, -40); ctx.lineTo(-20, 0); ctx.lineTo(20, 0);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#3a9a28";
  ctx.beginPath();
  ctx.moveTo(0, -30); ctx.lineTo(-16, 2); ctx.lineTo(16, 2);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#4ab830";
  ctx.beginPath();
  ctx.moveTo(0, -18); ctx.lineTo(-12, 4); ctx.lineTo(12, 4);
  ctx.closePath(); ctx.fill();
  // Snow on top
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.moveTo(0, -40); ctx.lineTo(-8, -22); ctx.lineTo(8, -22);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawRock(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(-18, 14);
  ctx.lineTo(-22, 0);
  ctx.lineTo(-10, -14);
  ctx.lineTo(8, -16);
  ctx.lineTo(22, -4);
  ctx.lineTo(20, 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#aaa";
  ctx.beginPath();
  ctx.moveTo(-10, -14);
  ctx.lineTo(8, -16);
  ctx.lineTo(10, -6);
  ctx.lineTo(-6, -4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSnowflakes(ctx: CanvasRenderingContext2D, flakes: {x:number,y:number,r:number,s:number}[]) {
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  flakes.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
    ctx.fill();
  });
}

function drawSlope(ctx: CanvasRenderingContext2D, offset: number) {
  // Gradient sky to snow
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#c8e6f5");
  grad.addColorStop(1, "#f0f8ff");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Snow texture lines
  ctx.strokeStyle = "rgba(180,210,240,0.4)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const y = ((i * 80 + offset * 0.4) % H);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(W/3, y+10, 2*W/3, y-8, W, y+5);
    ctx.stroke();
  }

  // Lane guides (subtle)
  ctx.strokeStyle = "rgba(150,200,230,0.3)";
  ctx.setLineDash([10, 15]);
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(LANE_W, 0); ctx.lineTo(LANE_W, H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(LANE_W*2, 0); ctx.lineTo(LANE_W*2, H); ctx.stroke();
  ctx.setLineDash([]);
}

export default function Skiing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    playerX: W / 2,
    targetX: W / 2,
    obstacles: [] as Obstacle[],
    flakes: Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3 + 1,
      s: Math.random() * 1.5 + 0.8,
    })),
    score: 0,
    speed: 180,
    offset: 0,
    alive: false,
    started: false,
    frameId: 0,
    lastTime: 0,
    spawnTimer: 0,
    leanDir: 0,
  });
  const [displayScore, setDisplayScore] = useState(0);
  const [gameState, setGameState] = useState<"idle"|"playing"|"dead">("idle");
  const keysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const onKey = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if ((e.key === "ArrowLeft" || e.key === "a") && s.alive) {
        s.targetX = Math.max(LANE_W/2, s.targetX - LANE_W);
        s.leanDir = -1;
      }
      if ((e.key === "ArrowRight" || e.key === "d") && s.alive) {
        s.targetX = Math.min(W - LANE_W/2, s.targetX + LANE_W);
        s.leanDir = 1;
      }
    };
    window.addEventListener("keydown", onKey);

    function loop(ts: number) {
      if (!s.alive) {
        s.frameId = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min((ts - s.lastTime) / 1000, 0.05);
      s.lastTime = ts;

      // Move player toward target
      s.playerX += (s.targetX - s.playerX) * Math.min(dt * 10, 1);
      s.leanDir *= 0.9;

      // Scroll
      s.offset += s.speed * dt;
      s.speed += dt * 15; // accelerate

      // Snow
      s.flakes.forEach(f => {
        f.y += f.s * s.speed * dt * 0.3;
        f.x += Math.sin(f.y * 0.01) * 0.5;
        if (f.y > H) { f.y = -5; f.x = Math.random() * W; }
      });

      // Spawn obstacles
      s.spawnTimer += dt;
      const spawnRate = 1.2 - s.score * 0.004;
      if (s.spawnTimer > Math.max(0.4, spawnRate)) {
        s.spawnTimer = 0;
        const lane = Math.floor(Math.random() * LANES);
        s.obstacles.push({
          x: lane * LANE_W + LANE_W / 2,
          y: -50,
          type: Math.random() > 0.4 ? "tree" : "rock",
        });
      }

      // Move obstacles
      s.obstacles.forEach(o => o.y += s.speed * dt);
      s.obstacles = s.obstacles.filter(o => o.y < H + 80);

      // Collision
      const px = s.playerX, py = H - 80;
      for (const o of s.obstacles) {
        const dx = Math.abs(o.x - px), dy = Math.abs(o.y - py);
        if (dx < 28 && dy < 30) {
          s.alive = false;
          setGameState("dead");
          break;
        }
      }

      s.score += dt * 12;
      setDisplayScore(Math.floor(s.score));

      // Draw
      drawSlope(ctx, s.offset);
      drawSnowflakes(ctx, s.flakes);
      s.obstacles.forEach(o => {
        if (o.type === "tree") drawTree(ctx, o.x, o.y);
        else drawRock(ctx, o.x, o.y);
      });
      drawSkier(ctx, s.playerX, H - 80, s.leanDir);

      // Score HUD
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.roundRect(10, 10, 130, 36, 8);
      ctx.fill();
      ctx.fillStyle = "#1a4a7a";
      ctx.font = "bold 18px 'Patrick Hand', cursive";
      ctx.fillText(`⛷  ${Math.floor(s.score)}m`, 20, 34);

      s.frameId = requestAnimationFrame(loop);
    }

    s.frameId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(s.frameId);
    };
  }, []);

  const start = () => {
    const s = stateRef.current;
    s.playerX = W / 2;
    s.targetX = W / 2;
    s.obstacles = [];
    s.score = 0;
    s.speed = 180;
    s.offset = 0;
    s.alive = true;
    s.started = true;
    s.lastTime = performance.now();
    s.spawnTimer = 0;
    s.leanDir = 0;
    setDisplayScore(0);
    setGameState("playing");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#d0e8f5]">
      <div className="absolute inset-0 opacity-35"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-skiing.png)`, backgroundSize: "cover", backgroundPosition: "center" }}/>
      <BackButton />
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-6 pt-20 gap-8 max-w-6xl mx-auto items-center">
        {/* Story */}
        <div className="flex-1 max-w-sm">
          <h1 className="font-display text-7xl text-blue-900 mb-4 drop-shadow-sm">Skiing</h1>
          <div className="bg-white/65 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white text-blue-900 font-body text-lg leading-relaxed space-y-3">
            <p><em>I started skiing at age 2.</em></p>
            <p>I grew up skiing my entire life. My whole family — from my mom, dad, and both my brothers — ski. The mountains and slopes were always home.</p>
            <p className="text-sm text-blue-600 mt-4 font-semibold">← → Arrow keys or A / D to dodge</p>
          </div>
        </div>
        {/* Game */}
        <div className="relative" style={{ width: W, height: H }}>
          <canvas ref={canvasRef} width={W} height={H} className="rounded-2xl shadow-2xl border-4 border-white/80"/>
          {gameState === "idle" && (
            <div className="absolute inset-0 rounded-2xl bg-blue-900/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <p className="text-white font-display text-4xl">Downhill Dash</p>
              <p className="text-blue-200 font-body text-lg">Dodge trees & rocks!</p>
              <button onClick={start} className="px-10 py-4 bg-white text-blue-900 font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95">
                Drop In!
              </button>
            </div>
          )}
          {gameState === "dead" && (
            <div className="absolute inset-0 rounded-2xl bg-blue-900/75 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <p className="text-white font-display text-5xl">Wipeout!</p>
              <p className="text-blue-100 font-body text-2xl">{displayScore}m schussed</p>
              <button onClick={start} className="px-10 py-4 bg-red-400 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">
                Try Again
              </button>
            </div>
          )}
          {/* Mobile controls */}
          {gameState === "playing" && (
            <div className="absolute bottom-2 left-0 right-0 flex gap-2 px-2">
              <button
                className="flex-1 h-16 bg-white/30 backdrop-blur rounded-2xl text-4xl text-white font-bold active:bg-white/50"
                onPointerDown={() => {
                  const s = stateRef.current;
                  s.targetX = Math.max(LANE_W/2, s.targetX - LANE_W);
                  s.leanDir = -1;
                }}>◀</button>
              <button
                className="flex-1 h-16 bg-white/30 backdrop-blur rounded-2xl text-4xl text-white font-bold active:bg-white/50"
                onPointerDown={() => {
                  const s = stateRef.current;
                  s.targetX = Math.min(W - LANE_W/2, s.targetX + LANE_W);
                  s.leanDir = 1;
                }}>▶</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
