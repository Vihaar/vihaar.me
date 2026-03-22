import { useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/BackButton";

const W = 500, H = 280;

interface Obstacle { x: number; type: "cone"|"puddle"|"hill"; }
interface Cloud { x: number; y: number; w: number; speed: number; }

function drawRunner(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, airborne: boolean) {
  ctx.save(); ctx.translate(x, y);
  const leg = Math.sin(t * 8) * (airborne ? 0 : 18);
  const arm = Math.sin(t * 8 + Math.PI) * 15;
  const bodyBob = airborne ? 0 : Math.abs(Math.sin(t * 8)) * 3;

  ctx.translate(0, -bodyBob);
  // Shadow
  if (!airborne) {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.ellipse(0, bodyBob + 4, 14, 5, 0, 0, Math.PI*2); ctx.fill();
  }
  // Legs
  ctx.strokeStyle = "#e67e22"; ctx.lineWidth = 7; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(-8 + leg*0.5, 30); ctx.lineTo(-10 + leg, 44); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(8 - leg*0.5, 30); ctx.lineTo(12 - leg, 44); ctx.stroke();
  // Shoes
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath(); ctx.roundRect(-14+leg, 38, 16, 8, 3); ctx.fill();
  ctx.beginPath(); ctx.roundRect(8-leg, 38, 16, 8, 3); ctx.fill();
  // Body
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath(); ctx.roundRect(-11, -10, 22, 24, 5); ctx.fill();
  // Race number bib
  ctx.fillStyle = "white"; ctx.fillRect(-7, -4, 14, 10);
  ctx.fillStyle = "#333"; ctx.font = "bold 7px Arial"; ctx.textAlign = "center"; ctx.fillText("26", 0, 5);
  // Arms
  ctx.strokeStyle = "#ffdab9"; ctx.lineWidth = 6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-18-arm*0.3, 14+arm*0.2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(18+arm*0.3, 14-arm*0.2); ctx.stroke();
  // Head
  ctx.fillStyle = "#ffdab9"; ctx.beginPath(); ctx.arc(0, -20, 13, 0, Math.PI*2); ctx.fill();
  // Headband
  ctx.fillStyle = "#e74c3c"; ctx.fillRect(-13, -27, 26, 7);
  // Eyes (determined!)
  ctx.fillStyle = "#333";
  ctx.beginPath(); ctx.arc(-5, -20, 3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -20, 3, 0, Math.PI*2); ctx.fill();
  // Gritted teeth
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, -15, 5, 0.2, Math.PI-0.2); ctx.stroke();
  ctx.restore();
}

function drawObstacle(ctx: CanvasRenderingContext2D, x: number, ground: number, type: string) {
  ctx.save(); ctx.translate(x, ground);
  if (type === "cone") {
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-14, 0); ctx.lineTo(-7, -28); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillRect(-13, -8, 12, 4); ctx.fillRect(-12, -16, 10, 4);
  } else if (type === "puddle") {
    ctx.fillStyle = "#5baad8";
    ctx.ellipse(-12, -3, 18, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.ellipse(-14, -5, 6, 3, -0.3, 0, Math.PI*2); ctx.fill();
  } else if (type === "hill") {
    ctx.fillStyle = "#7ab648";
    ctx.beginPath(); ctx.arc(-14, 0, 18, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#5a9a30";
    ctx.beginPath(); ctx.arc(-14, -2, 10, Math.PI, 0); ctx.fill();
  }
  ctx.restore();
}

function drawMichigan(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
  // Autumn trees
  const colors = ["#d4531c","#e67e22","#f39c12","#c0392b","#8B4513"];
  for (let i = 0; i < 8; i++) {
    const tx = x + i * 65 + 10;
    const th = 30 + (i*37)%20;
    ctx.fillStyle = "#8B6914";
    ctx.fillRect(tx, y - th, 5, th);
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath(); ctx.arc(tx + 2, y - th - 14, 16 + (i*7)%8, 0, Math.PI*2); ctx.fill();
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, scroll: number, clouds: Cloud[]) {
  // Sky gradient (Michigan autumn)
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#a8cde8"); sky.addColorStop(1, "#d4e8f0");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  // Clouds
  clouds.forEach(c => {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath(); ctx.ellipse(c.x, c.y, c.w, c.w*0.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(c.x - c.w*0.35, c.y + 4, c.w*0.6, c.w*0.35, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(c.x + c.w*0.35, c.y + 4, c.w*0.6, c.w*0.35, 0, 0, Math.PI*2); ctx.fill();
  });
  // Far trees
  drawMichigan(ctx, (-scroll*0.3) % (W + 200) - 200, H - 60, 50);
  // Ground
  ctx.fillStyle = "#9aba5a"; ctx.fillRect(0, H - 40, W, 40);
  ctx.fillStyle = "#7a9a40"; ctx.fillRect(0, H - 38, W, 3);
  // Road
  ctx.fillStyle = "#888"; ctx.fillRect(0, H - 40, W, 16);
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.setLineDash([25, 20]);
  ctx.beginPath(); ctx.moveTo((-scroll*1.5)%45 - 45, H-32); ctx.lineTo(W+45, H-32); ctx.stroke();
  ctx.setLineDash([]);
  // Mile marker
  const mile = Math.floor(scroll/150);
  ctx.fillStyle = "white"; ctx.font = "bold 10px 'Patrick Hand',cursive"; ctx.textAlign = "left";
  ctx.fillText(`Mile ${mile % 27}`, 6, H-25);
}

export default function Marathon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    runnerY: 0, vy: 0, jumping: false, alive: true, playing: false,
    t: 0, scroll: 0, speed: 180, score: 0,
    obstacles: [] as Obstacle[],
    clouds: Array.from({length:5},(_,i)=>({x:i*120+60, y:30+i*10, w:40+i*8, speed:20+i*5})),
    frameId: 0, lastTime: 0, spawnTimer: 0,
  });
  const [gameState, setGameState] = useState<"idle"|"playing"|"dead">("idle");
  const [score, setScore] = useState(0);
  const GROUND = H - 70;

  useEffect(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    s.runnerY = GROUND;

    const onKey = (e: KeyboardEvent) => {
      if (!s.playing) return;
      if ((e.key === " " || e.key === "ArrowUp" || e.key === "w") && !s.jumping) {
        s.vy = -460; s.jumping = true;
      }
    };
    window.addEventListener("keydown", onKey);

    function loop(ts: number) {
      const dt = Math.min((ts-s.lastTime)/1000, 0.05); s.lastTime=ts; s.t+=dt;
      if (s.playing) {
        // Physics
        s.vy += 900 * dt;
        s.runnerY += s.vy * dt;
        if (s.runnerY >= GROUND) { s.runnerY=GROUND; s.vy=0; s.jumping=false; }
        // Scroll
        s.scroll += s.speed * dt; s.speed += dt * 10;
        s.score += dt * 12; setScore(Math.floor(s.score));
        // Clouds
        s.clouds.forEach(c => { c.x -= c.speed*dt; if(c.x<-80) c.x=W+80; });
        // Obstacles
        s.spawnTimer += dt;
        if(s.spawnTimer > Math.max(0.9, 2-s.score*0.003)) {
          s.spawnTimer=0;
          const types:Obstacle["type"][] = ["cone","puddle","hill"];
          s.obstacles.push({x:W+30, type:types[Math.floor(Math.random()*types.length)]});
        }
        s.obstacles.forEach(o=>o.x-=s.speed*dt);
        s.obstacles=s.obstacles.filter(o=>o.x>-60);
        // Collision
        const runnerX = 90;
        for(const o of s.obstacles){
          const dx=Math.abs(o.x-runnerX),dy=Math.abs(s.runnerY-GROUND);
          const obsH = o.type==="cone"?28:o.type==="hill"?18:8;
          if(dx<22 && dy<obsH+10){ s.playing=false; s.alive=false; setGameState("dead"); break; }
        }
      }
      drawBackground(ctx, s.scroll, s.clouds);
      s.obstacles.forEach(o=>drawObstacle(ctx, o.x, GROUND+16, o.type));
      drawRunner(ctx, 90, s.runnerY, s.t, s.jumping);
      // Score
      ctx.fillStyle="rgba(255,255,255,0.75)"; ctx.beginPath(); ctx.roundRect(W-140,8,130,34,8); ctx.fill();
      ctx.fillStyle="#3a2010"; ctx.font="bold 16px 'Patrick Hand',cursive"; ctx.textAlign="right";
      ctx.fillText(`RUN ${Math.floor(s.score)}m`, W-14, 31);
      s.frameId=requestAnimationFrame(loop);
    }
    s.frameId=requestAnimationFrame(loop);
    return ()=>{ window.removeEventListener("keydown",onKey); cancelAnimationFrame(s.frameId); };
  }, []);

  const jump = () => {
    const s = stateRef.current;
    if(s.playing && !s.jumping){ s.vy=-460; s.jumping=true; }
  };

  const start = () => {
    const s = stateRef.current;
    s.runnerY=GROUND; s.vy=0; s.jumping=false; s.alive=true; s.playing=true;
    s.scroll=0; s.speed=180; s.score=0; s.obstacles=[];
    s.spawnTimer=0; s.lastTime=performance.now();
    setScore(0); setGameState("playing");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#c8a060]">
      <div className="absolute inset-0 opacity-30"
        style={{backgroundImage:`url(${import.meta.env.BASE_URL}images/bg-marathon.png)`,backgroundSize:"cover",backgroundPosition:"center"}}/>
      <BackButton />
      <div className="relative z-10 flex flex-col h-screen p-6 pt-20 max-w-3xl mx-auto">
        <h1 className="font-display text-6xl text-orange-900 mb-3">Ann Arbor Marathon</h1>
        <img
          src={`${import.meta.env.BASE_URL}images/marathon-hero.png`}
          alt="Marathon hero"
          className="w-full h-40 object-cover rounded-2xl border-2 border-stone-200 mb-4"
          draggable={false}
        />
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-orange-200 text-orange-900 font-body text-lg leading-relaxed mb-5">
          <p>26.2 miles through Michigan autumn — every mile a negotiation between your legs saying stop and your heart saying keep going.</p>
          <p className="text-sm mt-2 font-semibold text-orange-700">Space / W / ↑ to jump — dodge cones, puddles & hills!</p>
        </div>
        <div className="relative flex-1 flex flex-col items-center justify-center gap-4">
          <canvas ref={canvasRef} width={W} height={H} onClick={jump}
            className="rounded-2xl shadow-2xl border-4 border-orange-300/60 cursor-pointer w-full max-w-full"
            style={{maxWidth:W}}/>
          {gameState==="idle"&&(
            <div className="absolute inset-0 rounded-2xl bg-orange-900/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <p className="text-white font-display text-4xl">Race Day!</p>
              <p className="text-orange-200 font-body">Jump over obstacles — tap or press Space!</p>
              <button onClick={start} className="px-10 py-4 bg-orange-400 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">Start Running!</button>
            </div>
          )}
          {gameState==="dead"&&(
            <div className="absolute inset-0 rounded-2xl bg-orange-900/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <p className="text-white font-display text-5xl">DNF</p>
              <p className="text-orange-100 font-body text-2xl">{score}m completed</p>
              <button onClick={start} className="px-10 py-4 bg-orange-400 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105">Run Again!</button>
            </div>
          )}
          {gameState==="playing"&&(
            <button onClick={jump} className="px-12 py-5 bg-orange-400/80 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 active:scale-95 md:hidden">JUMP!</button>
          )}
        </div>
      </div>
    </div>
  );
}
