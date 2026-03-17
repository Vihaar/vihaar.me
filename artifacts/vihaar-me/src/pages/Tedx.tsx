import { useEffect, useRef, useState, useCallback } from "react";
import { BackButton } from "@/components/BackButton";

const W = 500, H = 380;

const PROMPTS = [
  "What's the most important lesson you learned from failure?",
  "Describe a moment that changed everything.",
  "If you could tell your younger self one thing, what would it be?",
  "What does home mean to you?",
  "Name your biggest fear and how you've faced it.",
  "What motivates you when things get hard?",
  "Describe yourself in three words.",
  "What's something you believed that turned out to be wrong?",
  "Tell me about someone who changed your life.",
  "What does it mean to be brave?",
  "What would you do if you couldn't fail?",
  "What are you proud of?",
  "Describe a moment of pure joy.",
  "What does family mean to you?",
  "What's a skill you never knew you had?",
];

function drawStage(ctx: CanvasRenderingContext2D, t: number) {
  // Dark auditorium
  const bg = ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,"#0a0a14"); bg.addColorStop(1,"#140a0a");
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  // Stage floor
  ctx.fillStyle="#1a1008"; ctx.fillRect(0,H-90,W,90);
  ctx.fillStyle="#221408"; ctx.fillRect(0,H-92,W,4);
  // Stage area (lighter)
  ctx.fillStyle="#1e1008"; ctx.fillRect(60,H-90,W-120,90);
  // Spotlight from above
  const spot=ctx.createRadialGradient(W/2,0,0,W/2,0,200);
  spot.addColorStop(0,"rgba(255,220,150,0.25)"); spot.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=spot; ctx.fillRect(0,0,W,H);
  // Curtains
  ctx.fillStyle="#3a0808"; ctx.fillRect(0,0,70,H);
  ctx.fillStyle="#3a0808"; ctx.fillRect(W-70,0,70,H);
  // Curtain folds
  for(let i=0;i<5;i++){
    ctx.fillStyle=`rgba(0,0,0,0.${i*2+1})`;
    ctx.fillRect(i*14,0,8,H); ctx.fillRect(W-i*14-8,0,8,H);
  }
  // TED logo on stage
  ctx.fillStyle="#e74c3c";
  ctx.font="bold 28px 'Arial', sans-serif"; ctx.textAlign="center";
  ctx.fillText("TED", W/2, H-58);
  ctx.fillStyle="rgba(231,76,60,0.15)";
  ctx.beginPath(); ctx.ellipse(W/2,H-62,40,14,0,0,Math.PI*2); ctx.fill();
  // Audience (rows of heads)
  for(let row=0;row<3;row++){
    const ay = H + row*25 - 26;
    const count = 10 + row*2;
    for(let i=0;i<count;i++){
      const headX = 30 + i*(W-60)/count + (W-60)/(count*2);
      const wobble = Math.sin(t*1.5 + i*0.7 + row)*2;
      ctx.fillStyle=`hsl(${30+i*17},${30+row*10}%,${25+row*8}%)`;
      ctx.beginPath(); ctx.arc(headX, ay+wobble, 9+row, 0, Math.PI*2); ctx.fill();
    }
  }
  // Microphone
  ctx.fillStyle="#888"; ctx.fillRect(W/2-3,H-160,6,70);
  ctx.fillStyle="#999"; ctx.beginPath(); ctx.arc(W/2,H-165,12,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#444"; ctx.beginPath(); ctx.arc(W/2,H-165,10,0,Math.PI*2); ctx.fill();
  // Mic grid lines
  ctx.strokeStyle="#666"; ctx.lineWidth=0.8;
  for(let i=-8;i<=8;i+=4){
    ctx.beginPath(); ctx.moveTo(W/2+i,H-175); ctx.lineTo(W/2+i,H-155); ctx.stroke();
  }
  for(let j=0;j<3;j++){
    ctx.beginPath(); ctx.arc(W/2,H-165,j*4+1,0,Math.PI*2); ctx.stroke();
  }
}

function drawSpeaker(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, thinking: boolean) {
  ctx.save(); ctx.translate(x, y);
  const breath=Math.sin(t*1.8)*1.5;
  // Shadow
  ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.ellipse(0,85,22,8,0,0,Math.PI*2); ctx.fill();
  // Legs
  ctx.fillStyle="#1a1a1a"; ctx.fillRect(-12,48,11,35); ctx.fillRect(2,48,11,35);
  // Shoes
  ctx.fillStyle="#111"; ctx.beginPath(); ctx.roundRect(-16,80,17,8,3); ctx.fill();
  ctx.beginPath(); ctx.roundRect(0,80,17,8,3); ctx.fill();
  // Body (suit)
  ctx.fillStyle="#222"; ctx.beginPath(); ctx.roundRect(-14,10+breath,28,40,6); ctx.fill();
  // Red tie
  ctx.fillStyle="#e74c3c";
  ctx.beginPath(); ctx.moveTo(-3,14); ctx.lineTo(3,14); ctx.lineTo(1,36); ctx.lineTo(-1,36); ctx.closePath(); ctx.fill();
  // Lapels
  ctx.fillStyle="#111";
  ctx.beginPath(); ctx.moveTo(-14,14); ctx.lineTo(-4,28); ctx.lineTo(-14,28); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(14,14); ctx.lineTo(4,28); ctx.lineTo(14,28); ctx.closePath(); ctx.fill();
  // Arms - thinking pose or relaxed
  ctx.fillStyle="#222";
  if(thinking){
    // Hand to chin
    ctx.save(); ctx.translate(-14,20); ctx.rotate(-0.3);
    ctx.roundRect(0,-6,12,30,6); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.translate(2,20); ctx.rotate(0.3);
    ctx.roundRect(0,-6,12,30,6); ctx.fill();
    ctx.restore();
  } else {
    ctx.save(); ctx.translate(-14,20); ctx.rotate(-0.1);
    ctx.roundRect(0,-6,12,30,6); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.translate(2,20); ctx.rotate(0.1);
    ctx.roundRect(0,-6,12,30,6); ctx.fill();
    ctx.restore();
  }
  // Head
  ctx.fillStyle="#ffdab9"; ctx.beginPath(); ctx.arc(0,-4+breath,16,0,Math.PI*2); ctx.fill();
  // Hair
  ctx.fillStyle="#3a2010"; ctx.beginPath(); ctx.arc(0,-10+breath,14,Math.PI,0); ctx.fill();
  // Eyes
  ctx.fillStyle="#333";
  if(thinking){
    // Thoughtful expression
    ctx.beginPath(); ctx.arc(-6,-4+breath,3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(6,-4+breath,3,0,Math.PI*2); ctx.fill();
    // Mouth thinking
    ctx.strokeStyle="#8B1a1a"; ctx.lineWidth=2; ctx.lineCap="round";
    ctx.beginPath(); ctx.moveTo(-2,6+breath); ctx.bezierCurveTo(0,4+breath,2,6+breath,0,8+breath); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(-6,-4+breath,3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(6,-4+breath,3,0,Math.PI*2); ctx.fill();
    // Mouth smiling
    ctx.strokeStyle="#8B1a1a"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,6+breath,5,0.2,Math.PI-0.2); ctx.stroke();
  }
  // Thinking bubble (if thinking)
  if(thinking){
    ctx.fillStyle="rgba(255,255,255,0.8)";
    ctx.beginPath(); ctx.arc(-30,-30,8,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-22,-32,5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-28,-42,6,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

export default function Tedx() {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const stateRef=useRef({
    t:0, frameId:0, lastTime:0, playing:false,
    prompt:null as string|null, promptIdx:-1, score:0, thinking:false,
    usedPrompts:new Set<number>(),
  });
  const [gameState,setGameState]=useState<"idle"|"playing"|"done">("idle");
  const [score,setScore]=useState(0);
  const [prompt,setPrompt]=useState<string|null>(null);

  const nextPrompt=useCallback(()=>{
    const s=stateRef.current;
    if(s.usedPrompts.size>=PROMPTS.length){
      s.playing=false; setGameState("done"); return;
    }
    let idx;
    do { idx=Math.floor(Math.random()*PROMPTS.length); } while(s.usedPrompts.has(idx));
    s.usedPrompts.add(idx);
    s.prompt=PROMPTS[idx];
    s.thinking=true;
    setPrompt(PROMPTS[idx]);
    setTimeout(()=>{ s.thinking=false; },1500);
  },[]);

  const respond=useCallback(()=>{
    const s=stateRef.current;
    if(!s.playing||!s.prompt) return;
    s.score++; setScore(s.score);
    s.prompt=null; setPrompt(null);
    setTimeout(nextPrompt,400);
  },[nextPrompt]);

  useEffect(()=>{
    const s=stateRef.current;
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d")!;
    function loop(ts:number){
      const dt=Math.min((ts-s.lastTime)/1000,0.05); s.lastTime=ts; s.t+=dt;
      drawStage(ctx, s.t);
      drawSpeaker(ctx, W/2, H-145, s.t, s.thinking);
      // Prompt display
      const cx=W/2, cy=120, bw=320, bh=80;
      ctx.fillStyle="rgba(10,10,20,0.8)";
      ctx.beginPath(); ctx.roundRect(cx-bw/2,cy-bh/2,bw,bh,12); ctx.fill();
      ctx.strokeStyle="#e74c3c"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.roundRect(cx-bw/2,cy-bh/2,bw,bh,12); ctx.stroke();
      if(s.prompt){
        ctx.fillStyle="#e74c3c"; ctx.font="18px 'Patrick Hand',cursive"; ctx.textAlign="center";
        const lines=wrapText(ctx, s.prompt, bw-20);
        let y=cy-lines.length*10;
        lines.forEach((line,i)=>{
          ctx.fillText(line, cx, y+i*18);
        });
      } else {
        ctx.fillStyle="#666"; ctx.font="italic 16px 'Patrick Hand',cursive"; ctx.textAlign="center";
        ctx.fillText("Waiting for next prompt...", cx, cy);
      }
      // Score
      ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.beginPath(); ctx.roundRect(10,10,130,42,10); ctx.fill();
      ctx.fillStyle="#ffd700"; ctx.font="bold 18px 'Patrick Hand',cursive"; ctx.textAlign="left";
      ctx.fillText(`★ ${s.score} prompts`, 20, 36);
      s.frameId=requestAnimationFrame(loop);
    }
    s.frameId=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(s.frameId);
  },[]);

  function wrapText(ctx:CanvasRenderingContext2D, txt:string, maxW:number):string[]{
    const words=txt.split(" ");
    const lines:string[]=[];
    let line="";
    words.forEach(w=>{
      const test=line+(line?" ":"")+w;
      if(ctx.measureText(test).width>maxW&&line){
        lines.push(line); line=w;
      } else {
        line=test;
      }
    });
    if(line) lines.push(line);
    return lines;
  }

  const start=()=>{
    const s=stateRef.current;
    s.score=0; s.playing=true; s.usedPrompts.clear(); s.prompt=null;
    s.lastTime=performance.now();
    setScore(0); setPrompt(null); setGameState("playing");
    nextPrompt();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a14]">
      <div className="absolute inset-0 opacity-25"
        style={{backgroundImage:`url(${import.meta.env.BASE_URL}images/bg-tedx.png)`,backgroundSize:"cover",backgroundPosition:"center"}}/>
      <BackButton />
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-6 pt-20 gap-8 max-w-6xl mx-auto items-center">
        <div className="flex-1 max-w-sm">
          <h1 className="font-display text-7xl text-red-400 mb-4">TEDxYouth</h1>
          <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-red-900/40 text-red-100 font-body text-lg leading-relaxed space-y-3">
            <p><em>I founded a TEDxYouth event.</em></p>
            <p>Years organizing, curating speakers — and more importantly, helping others find their voice under those red letters.</p>
            <div className="mt-4 p-3 bg-red-900/30 rounded-xl text-sm">
              <p className="font-bold text-red-300 mb-1">Think on your feet:</p>
              <p>Random prompts appear. Take a moment to think, then hit Respond. See how many you can handle!</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H}
              className="rounded-2xl shadow-2xl border-2 border-red-900/50 cursor-pointer"/>
            {gameState==="idle"&&(
              <div className="absolute inset-0 rounded-2xl bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-red-400 font-display text-5xl">Think Fast</p>
                <p className="text-red-200 font-body text-lg">Random questions. Improv answers. How many can you handle?</p>
                <button onClick={start} className="px-10 py-4 bg-red-600 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">Take the Stage!</button>
              </div>
            )}
            {gameState==="done"&&(
              <div className="absolute inset-0 rounded-2xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-red-400 font-display text-4xl">Amazing!</p>
                <p className="text-white font-body text-2xl">You handled <span className="text-red-400 font-bold">{score}</span> prompts ★</p>
                <button onClick={start} className="px-10 py-4 bg-red-600 text-white font-display text-2xl rounded-full shadow-lg hover:scale-105">Go Again!</button>
              </div>
            )}
          </div>
          {gameState==="playing"&&(
            <div className="flex gap-4">
              <button onClick={respond} disabled={!prompt}
                className="px-12 py-5 bg-red-600/80 text-white font-display text-2xl rounded-full shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                Respond →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
