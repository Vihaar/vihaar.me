import { useEffect, useRef, useState, useCallback } from "react";
import { BackButton } from "@/components/BackButton";

const W = 500, H = 380;

const WORDS = [
  "Ideas","Worth","Spreading","Change","Inspire","Speak","Voice",
  "Story","Connect","Lead","Passion","Create","Dream","Together",
];

interface Beat { word: string; time: number; hit: boolean; missed: boolean; }

function drawStage(ctx: CanvasRenderingContext2D, t: number, audienceAnim: number) {
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
      const wobble = Math.sin(t*1.5 + i*0.7 + row)*2*audienceAnim;
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

function drawSpeaker(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, armAnim: number) {
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
  // Arms - animated based on speech
  const leftArm=Math.sin(armAnim)*25, rightArm=Math.sin(armAnim+1)*20;
  ctx.fillStyle="#222";
  ctx.save(); ctx.translate(-14,20); ctx.rotate((leftArm-20)*Math.PI/180);
  ctx.roundRect(0,-6,12,30,6); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.translate(2,20); ctx.rotate((rightArm+20)*Math.PI/180);
  ctx.roundRect(0,-6,12,30,6); ctx.fill();
  ctx.restore();
  // Head
  ctx.fillStyle="#ffdab9"; ctx.beginPath(); ctx.arc(0,-4+breath,16,0,Math.PI*2); ctx.fill();
  // Hair
  ctx.fillStyle="#3a2010"; ctx.beginPath(); ctx.arc(0,-10+breath,14,Math.PI,0); ctx.fill();
  // Eyes (engaged!)
  ctx.fillStyle="#333";
  ctx.beginPath(); ctx.arc(-6,-4+breath,3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(6,-4+breath,3,0,Math.PI*2); ctx.fill();
  // Mouth (open talking)
  const mouthOpen=Math.abs(Math.sin(armAnim*2))*4;
  ctx.fillStyle="#8B1a1a";
  ctx.beginPath(); ctx.ellipse(0,4+breath,5,mouthOpen+1,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawWordBar(ctx: CanvasRenderingContext2D, beats: Beat[], currentTime: number) {
  // Beat track bar
  const barY = 50, barH = 60, barX = 70, barW = W-140;
  ctx.fillStyle="rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.roundRect(barX,barY,barW,barH,12); ctx.fill();
  ctx.strokeStyle="#e74c3c"; ctx.lineWidth=2; ctx.beginPath(); ctx.roundRect(barX,barY,barW,barH,12); ctx.stroke();
  // Hit zone
  const hitX = barX + barW * 0.2;
  ctx.fillStyle="rgba(231,76,60,0.2)"; ctx.fillRect(hitX-20,barY,40,barH);
  ctx.strokeStyle="#e74c3c"; ctx.lineWidth=1.5; ctx.setLineDash([3,3]);
  ctx.beginPath(); ctx.moveTo(hitX,barY); ctx.lineTo(hitX,barY+barH); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle="#e74c3c"; ctx.font="10px 'Patrick Hand',cursive"; ctx.textAlign="center";
  ctx.fillText("TAP", hitX, barY+barH+14);
  // Draw beats
  beats.forEach(b=>{
    const bx = barX + barW * 0.8 - (currentTime - b.time) * 160;
    if(bx < barX-50 || bx > barX+barW+50) return;
    if(b.hit){
      ctx.fillStyle="rgba(46,204,113,0.6)";
      ctx.beginPath(); ctx.roundRect(bx-30,barY+10,60,barH-20,8); ctx.fill();
    } else if(b.missed){
      ctx.fillStyle="rgba(231,76,60,0.4)";
      ctx.beginPath(); ctx.roundRect(bx-30,barY+10,60,barH-20,8); ctx.fill();
    } else {
      ctx.fillStyle="rgba(255,255,255,0.9)";
      ctx.beginPath(); ctx.roundRect(bx-30,barY+10,60,barH-20,8); ctx.fill();
      ctx.fillStyle="#1a0a0a"; ctx.font="bold 12px 'Patrick Hand',cursive"; ctx.textAlign="center";
      ctx.fillText(b.word, bx, barY+barH/2+5);
    }
  });
}

export default function Tedx() {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const stateRef=useRef({
    t:0, frameId:0, lastTime:0, playing:false,
    beats:[] as Beat[], score:0, missed:0, armAnim:0,
    audienceAnim:0, spawnTimer:0, beatInterval:1.2,
  });
  const [gameState,setGameState]=useState<"idle"|"playing"|"over">("idle");
  const [score,setScore]=useState(0);
  const [combo,setCombo]=useState(0);
  const comboRef=useRef(0);

  const tapBeat=useCallback(()=>{
    const s=stateRef.current;
    if(!s.playing) return;
    const now=s.t;
    // Find closest un-hit beat in window ±0.35s near "hit zone"
    const hitZoneTime = now - 0.25;
    let best:Beat|null=null, bestDist=Infinity;
    s.beats.forEach(b=>{
      if(!b.hit&&!b.missed){
        const dist=Math.abs(b.time-hitZoneTime);
        if(dist<0.35&&dist<bestDist){ bestDist=dist; best=b; }
      }
    });
    if(best){
      best.hit=true;
      s.score++;
      s.armAnim=s.t;
      s.audienceAnim=Math.min(1,s.audienceAnim+0.2);
      comboRef.current++;
      setCombo(comboRef.current);
      setScore(s.score);
    } else {
      comboRef.current=0; setCombo(0);
    }
  },[]);

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{ if(e.key===" "||e.key==="Enter") { e.preventDefault(); tapBeat(); } };
    window.addEventListener("keydown",onKey,{passive:false});
    return()=>window.removeEventListener("keydown",onKey);
  },[tapBeat]);

  useEffect(()=>{
    const s=stateRef.current;
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d")!;
    function loop(ts:number){
      const dt=Math.min((ts-s.lastTime)/1000,0.05); s.lastTime=ts; s.t+=dt;
      if(s.playing){
        s.armAnim+=dt*3;
        s.audienceAnim=Math.max(0,s.audienceAnim-dt*0.3);
        // Spawn beats
        s.spawnTimer+=dt;
        if(s.spawnTimer>=s.beatInterval){
          s.spawnTimer=0;
          const word=WORDS[Math.floor(Math.random()*WORDS.length)];
          s.beats.push({word,time:s.t+1.4,hit:false,missed:false});
          // Speed up over time
          s.beatInterval=Math.max(0.6,s.beatInterval-0.008);
        }
        // Mark missed
        s.beats.forEach(b=>{
          if(!b.hit&&!b.missed&&s.t>b.time+0.35){
            b.missed=true; s.missed++;
            comboRef.current=0; setCombo(0);
            if(s.missed>=5){ s.playing=false; setGameState("over"); }
          }
        });
        // Cleanup old
        s.beats=s.beats.filter(b=>b.time>s.t-3);
      }
      drawStage(ctx, s.t, s.audienceAnim);
      drawWordBar(ctx, s.beats, s.t);
      drawSpeaker(ctx, W/2, H-145, s.t, s.armAnim);
      // Score
      ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.beginPath(); ctx.roundRect(8,120,130,52,10); ctx.fill();
      ctx.fillStyle="#e74c3c"; ctx.font="bold 18px 'Patrick Hand',cursive"; ctx.textAlign="left";
      ctx.fillText(`★ ${s.score} delivered`, 18,143);
      const cc=comboRef.current;
      if(cc>1){ ctx.fillStyle="#ffd700"; ctx.font=`bold ${Math.min(16,11+cc)}px 'Patrick Hand',cursive`; ctx.fillText(`${cc}x COMBO!`,18,162); }
      // Miss indicator
      ctx.fillStyle="#444"; ctx.fillRect(W-90,126,70,14);
      ctx.fillStyle="#e74c3c"; ctx.fillRect(W-90,126,(s.missed/5)*70,14);
      ctx.fillStyle="#fff"; ctx.font="10px Arial"; ctx.textAlign="right";
      ctx.fillText(`Misses: ${s.missed}/5`,W-14,138);
      s.frameId=requestAnimationFrame(loop);
    }
    s.frameId=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(s.frameId);
  },[]);

  const start=()=>{
    const s=stateRef.current;
    s.beats=[]; s.score=0; s.missed=0; s.playing=true;
    s.spawnTimer=0; s.beatInterval=1.2; s.audienceAnim=0; s.armAnim=0;
    s.lastTime=performance.now();
    comboRef.current=0;
    setScore(0); setCombo(0); setGameState("playing");
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
            <p>Years organizing, curating speakers, "getting good at talking" — and more importantly, helping others find their voice under those red letters.</p>
            <div className="mt-4 p-3 bg-red-900/30 rounded-xl text-sm">
              <p className="font-bold text-red-300 mb-1">Deliver the speech:</p>
              <p>Press Space when words enter the red zone!</p>
              <p>5 misses and the speech falls apart 😬</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H} onClick={tapBeat}
              className="rounded-2xl shadow-2xl border-2 border-red-900/50 cursor-pointer"/>
            {gameState==="idle"&&(
              <div className="absolute inset-0 rounded-2xl bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-red-400 font-display text-5xl">Stage Rhythm</p>
                <p className="text-red-200 font-body text-lg">Tap when words hit the red zone</p>
                <p className="text-red-300 font-body text-sm">Space key or tap the canvas</p>
                <button onClick={start} className="px-10 py-4 bg-red-600 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">Take the Stage!</button>
              </div>
            )}
            {gameState==="over"&&(
              <div className="absolute inset-0 rounded-2xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-red-400 font-display text-4xl">Speech Over</p>
                <p className="text-white font-body text-2xl">You delivered <span className="text-red-400 font-bold">{score}</span> words! ★</p>
                <button onClick={start} className="px-10 py-4 bg-red-600 text-white font-display text-2xl rounded-full shadow-lg hover:scale-105">Go Again!</button>
              </div>
            )}
          </div>
          {gameState==="playing"&&(
            <button onClick={tapBeat} className="px-14 py-5 bg-red-600/80 text-white font-display text-3xl rounded-full shadow-lg hover:scale-105 active:scale-95 md:hidden">TAP!</button>
          )}
        </div>
      </div>
    </div>
  );
}
