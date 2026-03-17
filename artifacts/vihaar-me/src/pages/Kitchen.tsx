import { useEffect, useRef, useState, useCallback } from "react";
import { BackButton } from "@/components/BackButton";

const W = 460, H = 400;

interface Dish { name: string; ingredients: string[]; color: string; }
const DISHES: Dish[] = [
  { name: "Duck Confit", ingredients: ["🦆","🌿","🧄","🍷"], color: "#8B0000" },
  { name: "Sea Bass", ingredients: ["🐟","🍋","🫙","🌱"], color: "#00688B" },
  { name: "Foie Gras", ingredients: ["🍞","🍇","🫙","🟡"], color: "#8B6914" },
  { name: "Dessert", ingredients: ["🍫","🍓","🌸","⚪"], color: "#5B0050" },
];

interface PlateState { placed: string[]; target: Dish; timeLeft: number; }

function drawKitchen(ctx: CanvasRenderingContext2D) {
  // Kitchen background
  const bg = ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,"#1a0a00"); bg.addColorStop(1,"#2a1200");
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  // Counter
  ctx.fillStyle="#3a2010"; ctx.fillRect(0,H-120,W,120);
  ctx.fillStyle="#4a2a14"; ctx.fillRect(0,H-122,W,4);
  // Tile backsplash
  for(let tx=0;tx<W;tx+=30) for(let ty=0;ty<H-120;ty+=30){
    ctx.strokeStyle="rgba(80,40,10,0.6)"; ctx.lineWidth=0.5;
    ctx.strokeRect(tx,ty,30,30);
    ctx.fillStyle="rgba(40,20,5,0.5)"; ctx.fillRect(tx,ty,30,30);
  }
  // Warm overhead light
  const lamp=ctx.createRadialGradient(W/2,0,0,W/2,0,W*0.6);
  lamp.addColorStop(0,"rgba(255,200,80,0.15)"); lamp.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=lamp; ctx.fillRect(0,0,W,H);
  // Michelin star
  ctx.fillStyle="#ffd700";
  ctx.font="22px serif"; ctx.textAlign="center";
  ctx.fillText("★", W-30, 30);
  ctx.fillStyle="rgba(255,215,0,0.2)";
  ctx.beginPath(); ctx.arc(W-30,22,16,0,Math.PI*2); ctx.fill();
}

function drawPlate(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, placed: string[]) {
  // Plate rim
  ctx.fillStyle="#e8e0d0"; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#c0b090"; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(x,y,r-4,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle="#f5f0e8"; ctx.beginPath(); ctx.arc(x,y,r-8,0,Math.PI*2); ctx.fill();
  // Placed ingredients arranged in circle
  placed.forEach((ing,i)=>{
    const angle = (i/placed.length)*Math.PI*2 - Math.PI/2;
    const ir = (r-20)*0.6;
    const ix = x + Math.cos(angle)*ir;
    const iy = y + Math.sin(angle)*ir;
    ctx.font="22px serif"; ctx.textAlign="center";
    ctx.fillText(ing, ix, iy+8);
  });
  // Sauce swoosh (decoration)
  if(placed.length===0){
    ctx.strokeStyle="rgba(139,0,0,0.2)"; ctx.lineWidth=3; ctx.lineCap="round";
    ctx.beginPath();
    ctx.moveTo(x-20,y+10); ctx.bezierCurveTo(x-10,y-15,x+10,y+15,x+20,y-10);
    ctx.stroke();
  }
}

function drawIngredientBtn(ctx: CanvasRenderingContext2D, x: number, y: number, emoji: string, highlighted: boolean) {
  ctx.fillStyle = highlighted ? "#c09040" : "#2a1a08";
  ctx.shadowColor = highlighted ? "#ffd700" : "transparent";
  ctx.shadowBlur = highlighted ? 12 : 0;
  ctx.beginPath(); ctx.roundRect(x-28,y-28,56,56,10); ctx.fill();
  ctx.shadowBlur=0;
  ctx.strokeStyle = highlighted ? "#ffd700" : "#6a4020";
  ctx.lineWidth=2; ctx.beginPath(); ctx.roundRect(x-28,y-28,56,56,10); ctx.stroke();
  ctx.font="26px serif"; ctx.textAlign="center";
  ctx.fillText(emoji, x, y+10);
}

export default function Kitchen() {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const stateRef=useRef({
    dish:DISHES[0], placed:[] as string[], score:0, timeLeft:15,
    playing:false, frameId:0, lastTime:0, t:0,
    nextExpected:"",
  });
  const [gameState,setGameState]=useState<"idle"|"playing"|"score">("idle");
  const [score,setScore]=useState(0);
  const [timeLeft,setTimeLeft]=useState(15);
  const [dish,setDish]=useState<Dish>(DISHES[0]);
  const timerRef=useRef<ReturnType<typeof setInterval>>();

  const getNextDish=()=>DISHES[Math.floor(Math.random()*DISHES.length)];

  const nextRound=useCallback(()=>{
    const s=stateRef.current;
    const d=getNextDish();
    s.dish=d; s.placed=[]; s.timeLeft=15; s.nextExpected=d.ingredients[0];
    setDish(d); setTimeLeft(15);
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      s.timeLeft--;
      setTimeLeft(s.timeLeft);
      if(s.timeLeft<=0){
        clearInterval(timerRef.current);
        s.playing=false;
        setGameState("score");
      }
    },1000);
  },[]);

  const handleClick=useCallback((e:React.MouseEvent<HTMLCanvasElement>)=>{
    const s=stateRef.current;
    if(!s.playing) return;
    const rect=canvasRef.current!.getBoundingClientRect();
    const scale=W/rect.width;
    const cx=(e.clientX-rect.left)*scale;
    const cy=(e.clientY-rect.top)*scale;
    // Check ingredient buttons
    const btns=getIngredientPositions();
    btns.forEach((b,i)=>{
      const dx=Math.abs(cx-b.x),dy=Math.abs(cy-b.y);
      if(dx<32&&dy<32){
        const expected=s.dish.ingredients[s.placed.length];
        if(b.emoji===expected){
          s.placed=[...s.placed,b.emoji];
          if(s.placed.length===s.dish.ingredients.length){
            // Completed dish!
            s.score++;
            setScore(s.score);
            setTimeout(nextRound,600);
          }
        } else {
          // Wrong ingredient — flash
          s.timeLeft=Math.max(0,s.timeLeft-3);
          setTimeLeft(s.timeLeft);
        }
      }
    });
  },[nextRound]);

  function getIngredientPositions():{x:number,y:number,emoji:string}[]{
    const s=stateRef.current;
    return s.dish.ingredients.map((ing,i)=>({
      x: 60+i*90, y: H-55, emoji:ing
    }));
  }

  useEffect(()=>{
    const s=stateRef.current;
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d")!;
    function loop(ts:number){
      const dt=Math.min((ts-s.lastTime)/1000,0.05); s.lastTime=ts; s.t+=dt;
      drawKitchen(ctx);
      // Draw plate in center
      drawPlate(ctx, W/2, H/2-30, 90, s.placed);
      // Dish name
      ctx.fillStyle="#ffd700"; ctx.font="bold 20px 'Patrick Hand',cursive"; ctx.textAlign="center";
      ctx.fillText(s.dish.name, W/2, 35);
      // Order tickets on left
      ctx.fillStyle="#fffef5"; ctx.beginPath(); ctx.roundRect(10,45,120,s.dish.ingredients.length*26+30,6); ctx.fill();
      ctx.fillStyle="#555"; ctx.font="bold 11px monospace"; ctx.textAlign="left";
      ctx.fillText("ORDER:", 18, 62);
      s.dish.ingredients.forEach((ing,i)=>{
        const done=i<s.placed.length;
        ctx.fillStyle=done?"#2ecc71":"#333";
        ctx.font="16px serif"; ctx.fillText(ing, 18, 80+i*24);
        ctx.font="11px monospace"; ctx.fillStyle=done?"#2ecc71":"#888";
        ctx.fillText(done?"✓ done":"← next", 42, 80+i*24);
      });
      // Timer arc
      const prog=s.timeLeft/15;
      ctx.strokeStyle="#3a2010"; ctx.lineWidth=8;
      ctx.beginPath(); ctx.arc(W-45,45,28,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle=prog>0.4?"#ffd700":prog>0.2?"#e67e22":"#e74c3c"; ctx.lineWidth=6;
      ctx.beginPath(); ctx.arc(W-45,45,28,-Math.PI/2,-Math.PI/2+prog*Math.PI*2); ctx.stroke();
      ctx.fillStyle="#ffd700"; ctx.font="bold 14px Arial"; ctx.textAlign="center";
      ctx.fillText(`${s.timeLeft}s`, W-45, 50);
      // Score
      ctx.fillStyle="#ffd700"; ctx.font="bold 18px 'Patrick Hand',cursive";
      ctx.fillText(`★ ${s.score} dishes`, W-45, 90);
      // Ingredient buttons
      const btns=getIngredientPositions();
      btns.forEach((b,i)=>{
        const done=i<s.placed.length;
        const isNext=i===s.placed.length;
        if(!done) drawIngredientBtn(ctx, b.x, b.y, b.emoji, isNext&&!done);
      });
      s.frameId=requestAnimationFrame(loop);
    }
    s.frameId=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(s.frameId);
  },[]);

  const start=()=>{
    const s=stateRef.current;
    s.score=0; s.playing=true; s.lastTime=performance.now();
    setScore(0); setGameState("playing"); nextRound();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#1a0a00]">
      <div className="absolute inset-0 opacity-25"
        style={{backgroundImage:`url(${import.meta.env.BASE_URL}images/bg-kitchen.png)`,backgroundSize:"cover",backgroundPosition:"center"}}/>
      <BackButton />
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-6 pt-20 gap-8 max-w-6xl mx-auto items-center">
        <div className="flex-1 max-w-sm">
          <h1 className="font-display text-5xl text-amber-300 mb-4 leading-tight">Max Cekot<br/>Kitchen</h1>
          <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-900/40 text-amber-100 font-body text-lg leading-relaxed space-y-3">
            <p><em>Riga, Latvia. The only Michelin star in Latvia at the time.</em></p>
            <p>I came in as a stagière and was quickly promoted. Fine dining taught me that precision and patience are the same thing.</p>
            <p className="text-amber-400 text-sm font-semibold mt-3">Tap ingredients IN ORDER to plate the dish before time runs out! ★</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H} onClick={handleClick}
              className="rounded-2xl shadow-2xl border-2 border-amber-900/50 cursor-pointer"/>
            {gameState==="idle"&&(
              <div className="absolute inset-0 rounded-2xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-amber-300 font-display text-4xl">★ Plate Up ★</p>
                <p className="text-amber-200 font-body">Tap ingredients in the right order!</p>
                <button onClick={start} className="px-10 py-4 bg-amber-600 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">Enter Kitchen</button>
              </div>
            )}
            {gameState==="score"&&(
              <div className="absolute inset-0 rounded-2xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-amber-300 font-display text-4xl">Service Over</p>
                <p className="text-white font-body text-2xl">You plated <span className="text-amber-400 font-bold">{score}</span> dishes ★</p>
                <button onClick={start} className="px-10 py-4 bg-amber-600 text-white font-display text-2xl rounded-full shadow-lg hover:scale-105">Again!</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
