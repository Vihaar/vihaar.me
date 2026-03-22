import { useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/BackButton";

const W = 420, H = 420;
const GRID = 8;
const CELL = H / GRID;

type PersonType = "student" | "parent";
interface Person { x: number; y: number; type: PersonType; signed: boolean; vx: number; vy: number; }

function drawPerson(ctx: CanvasRenderingContext2D, p: Person, cx: number, cy: number) {
  ctx.save(); ctx.translate(cx, cy);
  if (p.signed) {
    ctx.globalAlpha = 0.35;
  }
  // Body
  const color = p.type === "parent" ? "#9b59b6" : "#3498db";
  const bodyColor = p.type === "parent" ? "#c39bd3" : "#85c1e9";
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.roundRect(-10,-6,20,18,4); ctx.fill();
  if (p.type === "parent") {
    // Blazer lapels
    ctx.fillStyle = "#7d3c98";
    ctx.beginPath(); ctx.moveTo(-10,-6); ctx.lineTo(-2,2); ctx.lineTo(-2,-6); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(10,-6); ctx.lineTo(2,2); ctx.lineTo(2,-6); ctx.closePath(); ctx.fill();
  }
  // Head
  ctx.fillStyle = "#ffdab9"; ctx.beginPath(); ctx.arc(0,-15,9,0,Math.PI*2); ctx.fill();
  // Hair
  ctx.fillStyle = p.type==="parent" ? "#888" : "#6b3a1f";
  ctx.beginPath(); ctx.arc(0,-19,8,Math.PI,0); ctx.fill();
  if (p.type === "parent") {
    // Glasses
    ctx.strokeStyle="#555"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(-4,-15,3,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(4,-15,3,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-1,-15); ctx.lineTo(1,-15); ctx.stroke();
  }
  // Point value
  if (!p.signed) {
    ctx.fillStyle = p.type==="parent" ? "#7d3c98" : "#1a5276";
    ctx.font = `bold ${p.type==="parent"?16:13}px 'Patrick Hand',cursive`;
    ctx.textAlign = "center";
    ctx.fillText(p.type==="parent" ? "+5" : "+1", 0, -27);
  } else {
    // Checkmark
    ctx.strokeStyle = "#2ecc71"; ctx.lineWidth = 2.5; ctx.lineCap="round";
    ctx.beginPath(); ctx.moveTo(-5,0); ctx.lineTo(-1,5); ctx.lineTo(7,-6); ctx.stroke();
  }
  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  ctx.save(); ctx.translate(x, y);
  const bob = Math.sin(t*6)*2;
  ctx.translate(0, bob);
  // Shadow
  ctx.fillStyle="rgba(0,0,0,0.1)"; ctx.ellipse(0,20,12,4,0,0,Math.PI*2); ctx.fill();
  // Body
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath(); ctx.roundRect(-9,-4,18,18,4); ctx.fill();
  ctx.fillStyle = "white"; ctx.fillRect(-6,0,12,8);
  ctx.fillStyle="#e74c3c"; ctx.font="bold 6px Arial"; ctx.textAlign="center"; ctx.fillText("VK",0,7);
  // Head
  ctx.fillStyle="#ffdab9"; ctx.beginPath(); ctx.arc(0,-13,10,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#1a2a5a"; ctx.beginPath(); ctx.arc(0,-17,9,Math.PI,0); ctx.fill();
  ctx.fillStyle="#333";
  ctx.beginPath(); ctx.arc(-4,-13,2.5,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(4,-13,2.5,0,Math.PI*2); ctx.fill();
  // Clipboard
  ctx.fillStyle="#f5dca0"; ctx.fillRect(9,-2,14,16); ctx.strokeStyle="#c8a050"; ctx.lineWidth=1; ctx.strokeRect(9,-2,14,16);
  ctx.fillStyle="#555"; ctx.fillRect(12,1,8,1.5); ctx.fillRect(12,4,8,1.5); ctx.fillRect(12,7,6,1.5); ctx.fillRect(12,10,8,1.5);
  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  // Notebook paper background
  ctx.fillStyle = "#fffef5"; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle = "#b8d0e8"; ctx.lineWidth=0.8;
  for(let y=24;y<H;y+=20){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  ctx.strokeStyle = "#e8b0b0"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(38,0); ctx.lineTo(38,H); ctx.stroke();
  // Spiral binding
  for(let y=10;y<H;y+=30){
    ctx.strokeStyle="#bbb"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(14,y,8,Math.PI*0.2,Math.PI*1.8); ctx.stroke();
  }
}

export default function Petition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    px:6, py:4, t:0, frameId:0, lastTime:0,
    people:[] as Person[], sigs:0, goal:30, timeLeft:25, playing:false,
    keys:new Set<string>(), moveTimer:0,
  });
  const [gameState,setGameState]=useState<"idle"|"playing"|"win"|"lose">("idle");
  const [sigs,setSigs]=useState(0);
  const [timeLeft,setTimeLeft]=useState(25);
  const timerRef=useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(()=>{
    const s=stateRef.current;
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d")!;
    const onKey=(e:KeyboardEvent)=>{ s.keys.add(e.key); e.preventDefault(); };
    const offKey=(e:KeyboardEvent)=>s.keys.delete(e.key);
    window.addEventListener("keydown",onKey,{passive:false});
    window.addEventListener("keyup",offKey);
    function loop(ts:number){
      const dt=Math.min((ts-s.lastTime)/1000,0.05); s.lastTime=ts; s.t+=dt;
      if(s.playing){
        // Move player
        s.moveTimer+=dt;
        if(s.moveTimer>0.15){
          s.moveTimer=0;
          const k=s.keys;
          if((k.has("ArrowLeft")||k.has("a"))&&s.px>0) s.px--;
          if((k.has("ArrowRight")||k.has("d"))&&s.px<GRID-1) s.px++;
          if((k.has("ArrowUp")||k.has("w"))&&s.py>0) s.py--;
          if((k.has("ArrowDown")||k.has("s"))&&s.py<GRID-1) s.py++;
        }
        // Move people around randomly
        s.people.forEach(p=>{
          if(!p.signed&&Math.random()<0.006){
            p.x=Math.max(0,Math.min(GRID-1,p.x+(Math.random()<0.5?-1:1)));
            p.y=Math.max(0,Math.min(GRID-1,p.y+(Math.random()<0.5?-1:1)));
          }
        });
        // Collect nearby signatures
        s.people.forEach(p=>{
          if(!p.signed&&Math.abs(p.x-s.px)<=0&&Math.abs(p.y-s.py)<=0){
            p.signed=true;
            s.sigs += p.type==="parent"?5:1;
            setSigs(s.sigs);
          }
        });
        if(s.sigs>=s.goal){
          s.playing=false; clearInterval(timerRef.current); setGameState("win");
        }
      }
      // Draw
      drawBackground(ctx);
      // Grid cells
      for(let x=0;x<GRID;x++) for(let y=0;y<GRID;y++){
        ctx.strokeStyle="rgba(180,200,220,0.3)"; ctx.lineWidth=0.5;
        ctx.strokeRect(x*CELL,y*CELL,CELL,CELL);
      }
      // People
      s.people.forEach(p=>{
        drawPerson(ctx, p, p.x*CELL+CELL/2, p.y*CELL+CELL/2);
      });
      // Player
      drawPlayer(ctx, s.px*CELL+CELL/2, s.py*CELL+CELL/2, s.t);
      // HUD
      ctx.fillStyle="rgba(255,248,220,0.92)";
      ctx.beginPath(); ctx.roundRect(45,8,W-55,42,10); ctx.fill();
      ctx.strokeStyle="#c8a050"; ctx.lineWidth=1.5; ctx.strokeRect(45,8,W-55,42);
      ctx.fillStyle="#4a2e1b"; ctx.font="bold 17px 'Patrick Hand',cursive"; ctx.textAlign="left";
      ctx.fillText(`✍ Signatures: ${s.sigs}/${s.goal}`, 58,32);
      const barW = (W-90)*Math.min(1,s.sigs/s.goal);
      ctx.fillStyle="#e8e0c8"; ctx.beginPath(); ctx.roundRect(58,36,W-90,8,4); ctx.fill();
      ctx.fillStyle="#9b59b6"; ctx.beginPath(); ctx.roundRect(58,36,barW,8,4); ctx.fill();
      ctx.fillStyle="#e74c3c"; ctx.textAlign="right";
      ctx.fillText(`TIME ${s.timeLeft}s`, W-12, 32);
      s.frameId=requestAnimationFrame(loop);
    }
    s.frameId=requestAnimationFrame(loop);
    return()=>{ window.removeEventListener("keydown",onKey); window.removeEventListener("keyup",offKey); cancelAnimationFrame(s.frameId); };
  },[]);

  const start=()=>{
    const s=stateRef.current;
    // Spawn people randomly
    const people:Person[]=[];
    for(let i=0;i<20;i++){
      const type:PersonType=i<14?"student":"parent";
      people.push({x:Math.floor(Math.random()*GRID),y:Math.floor(Math.random()*GRID),type,signed:false,vx:0,vy:0});
    }
    s.people=people; s.px=4; s.py=4; s.sigs=0; s.timeLeft=25; s.playing=true;
    setSigs(0); setTimeLeft(25); setGameState("playing");
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      s.timeLeft--;
      setTimeLeft(s.timeLeft);
      if(s.timeLeft<=0){ s.playing=false; clearInterval(timerRef.current); setGameState("lose"); }
    },1000);
    s.lastTime=performance.now();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f0ead0]"
      style={{backgroundImage:"repeating-linear-gradient(transparent,transparent 19px,#b8d0e8 19px,#b8d0e8 20px)"}}>
      <BackButton />
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-6 pt-20 gap-8 max-w-6xl mx-auto items-center">
        <div className="flex-1 max-w-sm">
          <h1 className="font-display text-6xl text-slate-700 mb-4">The Petition</h1>
          <img
            src={`${import.meta.env.BASE_URL}images/petition-hero.png`}
            alt="The Petition hero"
            className="w-full h-44 object-cover rounded-2xl border-2 border-stone-200 mb-4"
            draggable={false}
          />
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-l-4 border-yellow-400 text-slate-700 font-body text-lg leading-relaxed space-y-3">
            <p><em>Walled Lake Western High School.</em></p>
            <p>I petitioned to replace styrofoam trays with paper plates. First try: student signatures. Wrong audience. Second try: parents — and I found sponsors. It passed.</p>
            <div className="mt-3 p-3 bg-purple-50 rounded-xl text-sm">
              <p className="font-bold text-purple-700 mb-1">Collect signatures!</p>
              <p>Students = +1 pt</p>
              <p>Parents = +5 pts (target them!)</p>
              <p className="mt-1">WASD / Arrows to move</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H} className="rounded-2xl shadow-2xl border-4 border-yellow-200"/>
            {gameState==="idle"&&(
              <div className="absolute inset-0 rounded-2xl bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-slate-700 font-display text-4xl">Signature Drive</p>
                <p className="text-slate-500 font-body">Collect 30 pts in 25 seconds!</p>
                <p className="text-purple-600 font-body text-sm">Parents = +5. Students = +1</p>
                <button onClick={start} className="px-10 py-4 bg-purple-500 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">Start!</button>
              </div>
            )}
            {gameState==="win"&&(
              <div className="absolute inset-0 rounded-2xl bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-green-600 font-display text-5xl">Petition Passed!</p>
                <p className="text-slate-600 font-body text-xl">The cafeteria got paper plates!</p>
                <button onClick={start} className="px-10 py-4 bg-purple-500 text-white font-display text-2xl rounded-full shadow-lg hover:scale-105">Play Again</button>
              </div>
            )}
            {gameState==="lose"&&(
              <div className="absolute inset-0 rounded-2xl bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-red-500 font-display text-4xl">Not enough sigs...</p>
                <p className="text-slate-600 font-body">Got {sigs}/{30} — target the parents next time!</p>
                <button onClick={start} className="px-10 py-4 bg-purple-500 text-white font-display text-2xl rounded-full shadow-lg hover:scale-105">Try Again</button>
              </div>
            )}
          </div>
          {gameState==="playing"&&(
            <div className="grid grid-cols-3 gap-2 w-36">
              <div/><button onPointerDown={()=>stateRef.current.keys.add("ArrowUp")} onPointerUp={()=>stateRef.current.keys.delete("ArrowUp")} className="aspect-square bg-yellow-100 rounded-xl text-2xl font-bold shadow active:bg-yellow-200">↑</button><div/>
              <button onPointerDown={()=>stateRef.current.keys.add("ArrowLeft")} onPointerUp={()=>stateRef.current.keys.delete("ArrowLeft")} className="aspect-square bg-yellow-100 rounded-xl text-2xl font-bold shadow active:bg-yellow-200">←</button>
              <button onPointerDown={()=>stateRef.current.keys.add("ArrowDown")} onPointerUp={()=>stateRef.current.keys.delete("ArrowDown")} className="aspect-square bg-yellow-100 rounded-xl text-2xl font-bold shadow active:bg-yellow-200">↓</button>
              <button onPointerDown={()=>stateRef.current.keys.add("ArrowRight")} onPointerUp={()=>stateRef.current.keys.delete("ArrowRight")} className="aspect-square bg-yellow-100 rounded-xl text-2xl font-bold shadow active:bg-yellow-200">→</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
