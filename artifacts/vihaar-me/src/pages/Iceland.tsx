import { useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/BackButton";

const W = 360, H = 580;
const NUM_COLS = 5;

function drawNorthernLights(ctx: CanvasRenderingContext2D, t: number) {
  for (let i = 0; i < 3; i++) {
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "rgba(0,200,150,0)");
    grad.addColorStop(0.4 + Math.sin(t*0.4+i)*0.2, `rgba(${[0,100,50][i]},${[180,80,160][i]},${[130,160,80][i]},0.12)`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    const y = 40 + i * 45 + Math.sin(t*0.5 + i) * 18;
    ctx.fillRect(0, y, W, 90);
  }
}

function drawBasaltColumn(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, highlighted: boolean) {
  const cx = x + w/2;
  const grad = ctx.createLinearGradient(x, 0, x + w, 0);
  grad.addColorStop(0, "#3a4a58"); grad.addColorStop(0.5, "#5a6a78"); grad.addColorStop(1, "#2a3a48");
  ctx.fillStyle = highlighted ? "rgba(100,230,200,0.35)" : grad;
  ctx.shadowColor = highlighted ? "#7aeacc" : "transparent";
  ctx.shadowBlur = highlighted ? 20 : 0;
  ctx.beginPath();
  ctx.moveTo(cx, y); ctx.lineTo(cx + w/2, y + w*0.3);
  ctx.lineTo(cx + w/2, y + h); ctx.lineTo(cx - w/2, y + h); ctx.lineTo(cx - w/2, y + w*0.3);
  ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const lx = x + (w/4)*i;
    ctx.beginPath(); ctx.moveTo(lx, y + w*0.3); ctx.lineTo(lx, y + h); ctx.stroke();
  }
  if (highlighted) {
    ctx.strokeStyle = "#7aeacc"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - w/2, y + w*0.3); ctx.lineTo(cx, y); ctx.lineTo(cx + w/2, y + w*0.3); ctx.stroke();
  }
}

function drawClimber(ctx: CanvasRenderingContext2D, x: number, y: number, jumping: boolean) {
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = "#c8a050"; ctx.lineWidth = 2; ctx.setLineDash([4,3]);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 35); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = "#e67e22";
  ctx.beginPath(); ctx.roundRect(-8, -8, 16, 22, 4); ctx.fill();
  ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.stroke();
  ctx.fillStyle = "#ffdab9"; ctx.beginPath(); ctx.arc(0, -16, 10, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#e74c3c"; ctx.beginPath(); ctx.arc(0, -19, 9, Math.PI, 0); ctx.fill(); ctx.fillRect(-9, -19, 18, 5);
  ctx.fillStyle = "#ffd700"; ctx.beginPath(); ctx.arc(0, -22, 3, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = "#ffdab9"; ctx.lineWidth = 4; ctx.lineCap = "round";
  if (jumping) {
    ctx.beginPath(); ctx.moveTo(-8,-4); ctx.lineTo(-22,-18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8,-4); ctx.lineTo(22,-18); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(-8,-2); ctx.lineTo(-18,6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8,-2); ctx.lineTo(18,6); ctx.stroke();
  }
  ctx.strokeStyle = "#555"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(-4,14); ctx.lineTo(-6,28); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(4,14); ctx.lineTo(6,28); ctx.stroke();
  ctx.restore();
}

export default function Iceland() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    col: 2, height: 0, climbing: false,
    jumpAnim: 0, t: 0, frameId: 0, lastTime: 0,
    highlighted: [false,false,true,false,false],
    colPositions: [] as {x:number,w:number}[],
    scrollY: 0,
  });
  const [gameState, setGameState] = useState<"idle"|"playing"|"win">("idle");
  const [height, setHeight] = useState(0);
  const MAX_HEIGHT = 10;

  useEffect(() => {
    const s = stateRef.current;
    const colW = 52, spacing = (W - NUM_COLS*colW) / (NUM_COLS+1);
    s.colPositions = Array.from({length: NUM_COLS}, (_,i) => ({ x: spacing + i*(colW+spacing), w: colW }));
  }, []);

  const climbUp = () => {
    const s = stateRef.current;
    if (!s.climbing) return;
    s.height++; s.jumpAnim = 1;
    setHeight(s.height);
    const next = Array(NUM_COLS).fill(false);
    [s.col-1,s.col,s.col+1].filter(c=>c>=0&&c<NUM_COLS).forEach(c=>{next[c]=Math.random()>0.35;});
    next[s.col] = true; s.highlighted = next;
    if (s.height >= MAX_HEIGHT) { s.climbing = false; setGameState("win"); }
  };

  const moveCol = (dir: -1|1) => {
    const s = stateRef.current;
    if (!s.climbing) return;
    const nc = Math.max(0, Math.min(NUM_COLS-1, s.col+dir));
    s.col = nc; s.jumpAnim = 0.6;
  };

  useEffect(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const onKey = (e: KeyboardEvent) => {
      if (e.key==="ArrowLeft"||e.key==="a") moveCol(-1);
      if (e.key==="ArrowRight"||e.key==="d") moveCol(1);
      if (e.key===" "||e.key==="ArrowUp"||e.key==="w") climbUp();
    };
    window.addEventListener("keydown", onKey);
    function loop(ts: number) {
      const dt = Math.min((ts-s.lastTime)/1000,0.05); s.lastTime=ts; s.t+=dt;
      s.jumpAnim = Math.max(0, s.jumpAnim-dt*3);
      // Sky
      const sky = ctx.createLinearGradient(0,0,0,H);
      sky.addColorStop(0,"#050a14"); sky.addColorStop(1,"#101828");
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
      // Stars
      for(let i=0;i<45;i++){
        const sx=(i*137+17)%W,sy=(i*97+7)%(H*0.55);
        ctx.fillStyle=`rgba(255,255,255,${0.4+0.4*Math.sin(s.t*1.5+i)})`;
        ctx.beginPath(); ctx.arc(sx,sy,1.1,0,Math.PI*2); ctx.fill();
      }
      drawNorthernLights(ctx, s.t);
      // Columns
      const climberY = H - 140;
      const scrollOffset = s.height * 40;
      s.colPositions.forEach((col,i)=>{
        const topY = -scrollOffset;
        drawBasaltColumn(ctx, col.x, topY, col.w, H+scrollOffset+60, s.highlighted[i]);
      });
      // Climber
      const col = s.colPositions[s.col];
      if(col){
        const jumpOff = s.jumpAnim>0 ? -s.jumpAnim*22 : 0;
        drawClimber(ctx, col.x+col.w/2, climberY+jumpOff, s.jumpAnim>0.5);
      }
      // HUD
      ctx.fillStyle="rgba(0,0,0,0.55)"; ctx.beginPath(); ctx.roundRect(10,10,170,48,10); ctx.fill();
      ctx.fillStyle="#7aeacc"; ctx.font="bold 17px 'Patrick Hand',cursive"; ctx.textAlign="left";
      ctx.fillText(`⛰ ${s.height} / ${MAX_HEIGHT}`, 22, 42);
      // Progress bar
      ctx.fillStyle="#1abc9c";
      const barH=(s.height/MAX_HEIGHT)*(H-60);
      ctx.fillRect(W-18, H-10-barH, 8, barH);
      ctx.strokeStyle="#7aeacc"; ctx.lineWidth=1.5; ctx.strokeRect(W-18,30,8,H-40);
      s.frameId=requestAnimationFrame(loop);
    }
    s.frameId=requestAnimationFrame(loop);
    return ()=>{ window.removeEventListener("keydown",onKey); cancelAnimationFrame(s.frameId); };
  }, []);

  const start = () => {
    const s = stateRef.current;
    s.col=2; s.height=0; s.climbing=true; s.jumpAnim=0;
    s.highlighted=[false,false,true,false,false]; s.lastTime=performance.now();
    setHeight(0); setGameState("playing");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050a14]">
      <div className="absolute inset-0 opacity-30"
        style={{backgroundImage:`url(${import.meta.env.BASE_URL}images/bg-iceland.png)`,backgroundSize:"cover",backgroundPosition:"center"}}/>
      <BackButton />
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-6 pt-20 gap-8 max-w-6xl mx-auto items-center">
        <div className="flex-1 max-w-sm">
          <h1 className="font-display text-5xl text-teal-300 mb-4 leading-tight">Batman<br/>Mountain</h1>
          <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-teal-900/40 text-teal-100 font-body text-lg leading-relaxed space-y-3">
            <p><em>Iceland, basalt spires, free soloing.</em></p>
            <p>Locals called them "Batman Mountain" — towering hexagonal columns. Free soloing required total focus and trust in your hands.</p>
            <div className="mt-4 p-3 bg-teal-900/30 rounded-xl text-sm text-teal-200">
              <p className="font-bold mb-1">Controls:</p>
              <p>A / ← → Move between columns</p>
              <p>W / Space / ↑ → Climb up</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H} className="rounded-2xl shadow-2xl border-2 border-teal-900/50"/>
            {gameState==="idle"&&(
              <div className="absolute inset-0 rounded-2xl bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-teal-300 font-display text-4xl">Basalt Climber</p>
                <p className="text-teal-200 font-body">Climb 10 levels to the summit!</p>
                <button onClick={start} className="px-10 py-4 bg-teal-600 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">Start Climbing</button>
              </div>
            )}
            {gameState==="win"&&(
              <div className="absolute inset-0 rounded-2xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-teal-300 font-display text-5xl">Summit! 🏔</p>
                <p className="text-white font-body text-xl">You reached the top!</p>
                <button onClick={start} className="px-10 py-4 bg-teal-600 text-white font-display text-2xl rounded-full shadow-lg hover:scale-105">Climb Again</button>
              </div>
            )}
          </div>
          {gameState==="playing"&&(
            <div className="flex gap-3">
              <button onClick={()=>moveCol(-1)} className="px-6 py-4 bg-teal-800/80 text-white font-display text-2xl rounded-2xl hover:scale-105 active:scale-95">◀</button>
              <button onClick={climbUp} className="px-8 py-4 bg-teal-600/80 text-white font-display text-2xl rounded-2xl hover:scale-105 active:scale-95">▲ Climb</button>
              <button onClick={()=>moveCol(1)} className="px-6 py-4 bg-teal-800/80 text-white font-display text-2xl rounded-2xl hover:scale-105 active:scale-95">▶</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
