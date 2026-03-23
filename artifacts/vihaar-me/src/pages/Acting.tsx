import { useEffect, useRef, useState, useCallback } from "react";
import { BackButton } from "@/components/BackButton";

const W = 460, H = 400;

type ActionType = "LOOK_LEFT"|"LOOK_RIGHT"|"CLAP"|"FREEZE"|"WAVE"|"BOW";
interface Cue { text: string; action: ActionType; isSimon: boolean; }

const ACTION_MAP: Record<ActionType,{ label:string; color:string; key:string; }> = {
  LOOK_LEFT:  { label:"Look Left",  color:"#3498db", key:"a" },
  LOOK_RIGHT: { label:"Look Right", color:"#9b59b6", key:"d" },
  CLAP:       { label:"Clap",       color:"#e67e22", key:"s" },
  FREEZE:     { label:"Freeze",     color:"#1abc9c", key:"w" },
  WAVE:       { label:"Wave",       color:"#e74c3c", key:"q" },
  BOW:        { label:"Bow",        color:"#f39c12", key:"e" },
};
const ACTIONS = Object.keys(ACTION_MAP) as ActionType[];

function drawFilmSet(ctx: CanvasRenderingContext2D, t: number) {
  // Warm film studio
  const bg = ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,"#1a1005"); bg.addColorStop(1,"#0a0805");
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  // Backdrop/cyclorama
  ctx.fillStyle="#ede0c8"; ctx.beginPath(); ctx.roundRect(60,20,W-120,H-70,30); ctx.fill();
  const scrim=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,180);
  scrim.addColorStop(0,"rgba(255,250,230,0.9)"); scrim.addColorStop(1,"rgba(210,190,150,0.8)");
  ctx.fillStyle=scrim; ctx.beginPath(); ctx.roundRect(60,20,W-120,H-70,30); ctx.fill();
  // Stage floor
  ctx.fillStyle="#c8a878"; ctx.fillRect(60,H-70,W-120,50);
  ctx.fillStyle="#b89868"; ctx.fillRect(60,H-70,W-120,3);
  // Film lights (top)
  [[90,15],[W/2,10],[W-90,15]].forEach(([lx,ly])=>{
    ctx.fillStyle="#444"; ctx.fillRect(lx-8,0,16,ly+8);
    ctx.fillStyle="#666"; ctx.beginPath(); ctx.roundRect(lx-14,ly,28,20,3); ctx.fill();
    const beam=ctx.createRadialGradient(lx,ly+10,0,lx,H*0.5,100);
    beam.addColorStop(0,"rgba(255,240,180,0.15)"); beam.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=beam; ctx.fillRect(0,0,W,H);
  });
  // Clapperboard in corner
  ctx.save(); ctx.translate(80,30); ctx.rotate(-0.1);
  ctx.fillStyle="#222"; ctx.fillRect(-20,-15,40,30); ctx.fillStyle="#444"; ctx.fillRect(-20,-25,40,12);
  [0,8,16,24].forEach(x=>{ ctx.fillStyle=x%16===0?"#fff":"#222"; ctx.fillRect(-20+x,-25,8,12); });
  ctx.fillStyle="#fff"; ctx.font="7px monospace"; ctx.textAlign="center"; ctx.fillText("TAKE 1",0,8);
  ctx.restore();
  // Camera on tripod (right side)
  ctx.save(); ctx.translate(W-85, H-80);
  ctx.fillStyle="#333"; ctx.fillRect(-6,-50,12,50);
  ctx.fillStyle="#444"; ctx.fillRect(-8,-52,16,5);
  ctx.fillStyle="#555"; ctx.beginPath(); ctx.roundRect(-14,-65,28,18,4); ctx.fill();
  ctx.fillStyle="#2c85c8"; ctx.beginPath(); ctx.arc(14,-56,7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#5aaeea"; ctx.beginPath(); ctx.arc(14,-56,4,0,Math.PI*2); ctx.fill();
  // Recording light
  const blink = Math.sin(t*4)>0;
  ctx.fillStyle=blink?"#e74c3c":"#800000";
  ctx.beginPath(); ctx.arc(-10,-68,4,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawActor(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, action: ActionType|null, reacting: boolean) {
  ctx.save(); ctx.translate(x, y);
  const bob = Math.sin(t*2)*1.5;
  ctx.translate(0, bob);
  // Shadow
  ctx.fillStyle="rgba(0,0,0,0.15)"; ctx.ellipse(0,88,22,7,0,0,Math.PI*2); ctx.fill();
  // Legs
  let leftLeg=0, rightLeg=0;
  if(action==="BOW") { leftLeg=20; rightLeg=20; }
  ctx.fillStyle="#2c2c2c"; ctx.fillRect(-12,48,10,36+leftLeg); ctx.fillRect(3,48,10,36+rightLeg);
  ctx.fillStyle="#1a1a1a"; ctx.beginPath(); ctx.roundRect(-16,82+leftLeg,15,8,3); ctx.fill();
  ctx.beginPath(); ctx.roundRect(2,82+rightLeg,15,8,3); ctx.fill();
  // Body
  ctx.fillStyle="#f1c40f";
  ctx.beginPath(); ctx.roundRect(-14,10,28,40,6); ctx.fill();
  // Star on shirt
  ctx.fillStyle="#f39c12"; ctx.font="14px serif"; ctx.textAlign="center"; ctx.fillText("★",0,34);
  // Arms
  let leftRot=0, rightRot=0;
  if(action==="CLAP"){ leftRot=-60; rightRot=60; }
  else if(action==="WAVE"){ rightRot=-90; }
  else if(action==="BOW"){ leftRot=40; rightRot=40; }
  else if(action==="LOOK_LEFT"){ leftRot=-30; }
  else if(action==="LOOK_RIGHT"){ rightRot=-30; }
  // Left arm
  ctx.save(); ctx.translate(-14,20); ctx.rotate(leftRot*Math.PI/180);
  ctx.fillStyle="#f1c40f"; ctx.fillRect(-10,-5,10,28); ctx.restore();
  // Right arm
  ctx.save(); ctx.translate(14,20); ctx.rotate(rightRot*Math.PI/180);
  ctx.fillStyle="#f1c40f"; ctx.fillRect(0,-5,10,28); ctx.restore();
  // Head
  const headTilt = action==="LOOK_LEFT"?-12:action==="LOOK_RIGHT"?12:0;
  ctx.save(); ctx.translate(0,-3); ctx.rotate(headTilt*Math.PI/180);
  ctx.fillStyle="#ffdab9"; ctx.beginPath(); ctx.arc(0,-14,16,0,Math.PI*2); ctx.fill();
  // Hair
  ctx.fillStyle="#3a2010"; ctx.beginPath(); ctx.arc(0,-20,14,Math.PI,0); ctx.fill();
  // Eyes (based on action)
  if(action==="FREEZE"){
    // Wide eyes
    ctx.fillStyle="white"; ctx.beginPath(); ctx.arc(-6,-14,5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(6,-14,5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#333"; ctx.beginPath(); ctx.arc(-5,-14,2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(7,-14,2,0,Math.PI*2); ctx.fill();
  } else {
    ctx.fillStyle="white"; ctx.beginPath(); ctx.arc(-6,-14,4,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(6,-14,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#333"; ctx.beginPath(); ctx.arc(-5,-14,2.5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(7,-14,2.5,0,Math.PI*2); ctx.fill();
  }
  // Expression
  if(reacting){
    ctx.strokeStyle="#e74c3c"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,-10,6,0,Math.PI); ctx.stroke();
  } else if(action){
    ctx.strokeStyle="#333"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,-10,5,0.1,Math.PI-0.1); ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
}

function drawCueDisplay(ctx: CanvasRenderingContext2D, cue: Cue|null, timeProgress: number) {
  const cx=W/2, cy=175, bw=280, bh=64;
  // Board
  ctx.fillStyle=cue?.isSimon?"#2c2c2c":"#1a1a1a";
  ctx.beginPath(); ctx.roundRect(cx-bw/2, cy-bh/2, bw, bh, 10); ctx.fill();
  ctx.strokeStyle=cue?.isSimon?"#e74c3c":"#555";
  ctx.lineWidth=2.5; ctx.beginPath(); ctx.roundRect(cx-bw/2, cy-bh/2, bw, bh, 10); ctx.stroke();
  if(cue){
    const color = cue.isSimon ? "#e74c3c" : "#888";
    ctx.fillStyle=color; ctx.font=`bold 22px 'Patrick Hand',cursive`; ctx.textAlign="center";
    ctx.fillText(cue.text, cx, cy+8);
    // Timer bar
    const tw = (bw-20)*timeProgress;
    ctx.fillStyle="rgba(255,255,255,0.1)"; ctx.fillRect(cx-bw/2+10,cy+bh/2-14,bw-20,8);
    ctx.fillStyle=cue.isSimon?"#e74c3c":"#555"; ctx.fillRect(cx-bw/2+10,cy+bh/2-14,tw,8);
  } else {
    ctx.fillStyle="#555"; ctx.font="italic 18px 'Patrick Hand',cursive"; ctx.textAlign="center";
    ctx.fillText("Waiting for direction...", cx, cy+8);
  }
}

export default function Acting() {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const stateRef=useRef({
    t:0, frameId:0, lastTime:0, playing:false,
    cue:null as Cue|null, cueTime:0, cueDuration:2.5,
    score:0, failed:false, currentAction:null as ActionType|null,
    actionTimer:0,
  });
  const [gameState,setGameState]=useState<"idle"|"playing"|"over">("idle");
  const [score,setScore]=useState(0);
  const [wrongFlash,setWrongFlash]=useState(false);

  const generateCue=useCallback(()=>{
    const s=stateRef.current;
    const action=ACTIONS[Math.floor(Math.random()*ACTIONS.length)];
    const isSimon=Math.random()>0.3;
    const text = isSimon ? `Director says: ${ACTION_MAP[action].label.toUpperCase()}!` : `${ACTION_MAP[action].label.toUpperCase()}!`;
    s.cue={text,action,isSimon};
    s.cueTime=s.t;
    s.cueDuration=Math.max(1.2, 2.5-s.score*0.08);
  },[]);

  const doAction=useCallback((action:ActionType)=>{
    const s=stateRef.current;
    if(!s.playing||!s.cue) return;
    s.currentAction=action; s.actionTimer=s.t;
    if(s.cue.isSimon&&s.cue.action===action){
      s.score++; setScore(s.score);
      s.cue=null;
      setTimeout(()=>generateCue(), 500);
    } else if(!s.cue.isSimon&&false){
      // Correctly ignored — handled by timeout
    } else {
      // Wrong! 
      setWrongFlash(true);
      setTimeout(()=>setWrongFlash(false),600);
      s.playing=false; setGameState("over");
    }
  },[generateCue]);

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      ACTIONS.forEach(a=>{ if(e.key===ACTION_MAP[a].key) doAction(a); });
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[doAction]);

  useEffect(()=>{
    const s=stateRef.current;
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d")!;
    function loop(ts:number){
      const dt=Math.min((ts-s.lastTime)/1000,0.05); s.lastTime=ts; s.t+=dt;
      if(s.playing&&s.cue){
        const elapsed=s.t-s.cueTime;
        if(elapsed>s.cueDuration){
          if(s.cue.isSimon){ s.playing=false; setGameState("over"); }
          else { s.cue=null; setTimeout(()=>generateCue(),400); }
        }
      }
      if(s.actionTimer>0&&s.t-s.actionTimer>0.6) s.currentAction=null;
      const timeProgress = s.cue ? Math.max(0,1-(s.t-s.cueTime)/s.cueDuration) : 0;
      drawFilmSet(ctx, s.t);
      drawActor(ctx, W/2, H-160, s.t, s.currentAction, wrongFlash);
      drawCueDisplay(ctx, s.cue, timeProgress);
      // Score
      ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.beginPath(); ctx.roundRect(10,10,130,42,10); ctx.fill();
      ctx.fillStyle="#ffd700"; ctx.font="bold 18px 'Patrick Hand',cursive"; ctx.textAlign="left";
      ctx.fillText(`★ ${s.score} takes`, 20,36);
      s.frameId=requestAnimationFrame(loop);
    }
    s.frameId=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(s.frameId);
  },[generateCue,wrongFlash]);

  const start=()=>{
    const s=stateRef.current;
    s.score=0; s.failed=false; s.playing=true; s.cue=null; s.currentAction=null;
    s.lastTime=performance.now();
    setScore(0); setGameState("playing");
    setTimeout(()=>generateCue(), 800);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#1a1005]">
      <div className="absolute inset-0 opacity-25"
        style={{backgroundImage:`url(${import.meta.env.BASE_URL}images/bg-acting.png)`,backgroundSize:"cover",backgroundPosition:"center"}}/>
      <BackButton />
      <div className="relative z-10 flex flex-col md:flex-row h-screen p-6 pt-20 gap-8 max-w-6xl mx-auto items-center">
        <div className="flex-1 max-w-sm">
          <h1 className="font-display text-6xl text-yellow-400 mb-4">Child Actor</h1>
          <img
            src={`${import.meta.env.BASE_URL}images/child-actor-hero.png`}
            alt="Child actor hero"
            className="w-full h-44 object-cover rounded-2xl border-2 border-stone-200 mb-4"
            draggable={false}
          />
          <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-yellow-900/40 text-yellow-100 font-body text-lg leading-relaxed space-y-3">
            <p><em>Between middle school and high school, I spent a year acting.</em></p>
            <p>Modeling, commercials, short films, and a sitcom called "My Step Kids" — a crash course in taking direction under a rolling camera.</p>
            <a href="https://www.imdb.com/name/nm9990820/" target="_blank" rel="noreferrer"
              className="inline-block mt-3 px-4 py-2 border border-yellow-500 rounded-full text-yellow-400 hover:bg-yellow-900/30 transition-colors text-sm uppercase tracking-widest">
              IMDb Profile ↗
            </a>
            <div className="mt-3 p-3 bg-yellow-900/30 rounded-xl text-sm text-yellow-200">
              <p className="font-bold mb-1">Director says:</p>
              <p>Only respond when the Director says so! Use A/D/S/W/Q/E keys or the on-screen buttons.</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H}
              className={`rounded-2xl shadow-2xl border-2 border-yellow-900/50 transition-all ${wrongFlash?"border-red-500 shadow-red-500/50":""}`}/>
            {gameState==="idle"&&(
              <div className="absolute inset-0 rounded-2xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-yellow-400 font-display text-4xl">Director's Game</p>
                <p className="text-yellow-200 font-body">Only act when the Director says!</p>
                <button onClick={start} className="px-10 py-4 bg-yellow-600 text-black font-display text-3xl rounded-full shadow-lg hover:scale-105 transition-transform">ACTION!</button>
              </div>
            )}
            {gameState==="over"&&(
              <div className="absolute inset-0 rounded-2xl bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <p className="text-red-400 font-display text-5xl">CUT!</p>
                <p className="text-yellow-200 font-body text-xl">You nailed <span className="text-yellow-400 font-bold">{score}</span> takes ★</p>
                <button onClick={start} className="px-10 py-4 bg-yellow-600 text-black font-display text-2xl rounded-full shadow-lg hover:scale-105">Take Two</button>
              </div>
            )}
          </div>
          {gameState==="playing"&&(
            <div className="flex gap-2 flex-wrap justify-center max-w-[480px]">
              {ACTIONS.map(a=>(
                <button key={a} onClick={()=>doAction(a)}
                  className="px-4 py-3 font-display text-lg rounded-2xl border-2 hover:scale-105 active:scale-95 transition-transform flex flex-col items-center leading-tight min-w-[7.5rem]"
                  style={{background:ACTION_MAP[a].color+"33",borderColor:ACTION_MAP[a].color,color:ACTION_MAP[a].color}}>
                  <span>{ACTION_MAP[a].label}</span>
                  <span className="text-xs font-mono opacity-70 mt-0.5">[{ACTION_MAP[a].key.toUpperCase()}]</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
