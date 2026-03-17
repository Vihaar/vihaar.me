import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface Chapter {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  game: string;
  cx: number;
  cy: number;
  color: string;
}

const CHAPTERS: Chapter[] = [
  { id: "family",   path: "/family",   title: "Family",            subtitle: "Lake life & roots",       game: "Pass the Love",      cx: 50,  cy: 44, color: "#e67e22" },
  { id: "kitchen",  path: "/kitchen",  title: "Michelin star restaurant", subtitle: "Max Cekot, Riga",  game: "Plate Up",           cx: 86,  cy: 40, color: "#e67e22" },
  { id: "skiing",   path: "/skiing",   title: "Skiing",            subtitle: "Growing up on slopes",    game: "Downhill Dash",      cx: 18,  cy: 22, color: "#3498db" },
  { id: "boxing",   path: "/boxing",   title: "Boxing",            subtitle: "One amateur fight",       game: "Punch Out",          cx: 14,  cy: 58, color: "#e74c3c" },
  { id: "iceland",  path: "/iceland",  title: "Iceland",           subtitle: "Rock climbing",          game: "Basalt Climber",     cx: 30,  cy: 78, color: "#1abc9c" },
  { id: "marathon", path: "/marathon", title: "Ann Arbor Marathon",subtitle: "26.2 miles",             game: "Race Day",           cx: 58,  cy: 82, color: "#f39c12" },
  { id: "petition", path: "/petition", title: "The Petition",      subtitle: "Styrofoam to paper",     game: "Sig Drive",          cx: 80,  cy: 68, color: "#9b59b6" },
  { id: "tedx",     path: "/tedx",     title: "TEDxYouth",         subtitle: "Finding a voice",        game: "Think Fast",         cx: 66,  cy: 18, color: "#e74c3c" },
  { id: "acting",   path: "/acting",   title: "Child Actor",       subtitle: "My Step Kids sitcom",    game: "Lights, Camera!",    cx: 38,  cy: 18, color: "#f1c40f" },
];

// Hand-drawn island SVG paths (normalized 0-100 coordinate space, offset by cx/cy)
// Each island is unique in shape
const ISLAND_SHAPES: Record<string, string> = {
  family:   "M0,-14 C4,-16 10,-15 12,-11 C15,-6 14,0 11,5 C8,10 3,13 -2,13 C-8,13 -14,9 -14,3 C-14,-4 -10,-12 0,-14Z",
  skiing:   "M0,-11 C5,-13 11,-10 12,-5 C13,1 9,8 4,10 C-1,12 -8,10 -10,5 C-12,0 -9,-9 0,-11Z",
  boxing:   "M0,-10 C6,-12 12,-8 12,-2 C12,5 7,10 1,11 C-5,12 -11,8 -12,2 C-13,-5 -8,-9 0,-10Z",
  iceland:  "M0,-12 C4,-14 9,-12 11,-7 C13,-1 10,6 5,9 C0,12 -6,11 -10,6 C-13,0 -11,-9 0,-12Z",
  marathon: "M0,-10 C5,-13 11,-9 12,-3 C13,3 8,9 2,11 C-3,12 -10,8 -11,1 C-12,-6 -8,-8 0,-10Z",
  petition: "M0,-11 C6,-13 12,-9 12,-3 C12,4 7,11 1,12 C-5,13 -11,8 -11,1 C-11,-6 -8,-10 0,-11Z",
  kitchen:  "M0,-10 C5,-12 11,-8 12,-2 C12,5 8,11 2,12 C-4,13 -10,8 -11,1 C-12,-5 -8,-9 0,-10Z",
  tedx:     "M0,-12 C5,-14 11,-10 12,-4 C13,2 9,9 3,11 C-2,13 -9,9 -11,3 C-13,-4 -9,-10 0,-12Z",
  acting:   "M0,-11 C5,-13 11,-9 11,-3 C11,4 6,10 0,12 C-6,12 -11,7 -11,0 C-11,-7 -7,-10 0,-11Z",
};

const BASE = import.meta.env.BASE_URL;

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#f5ead6] relative font-body">
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")" }} />

      {/* Main SVG Map */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <defs>
          {/* Water pattern */}
          <pattern id="waves" x="0" y="0" width="8" height="4" patternUnits="userSpaceOnUse">
            <path d="M0,2 Q2,0 4,2 Q6,4 8,2" fill="none" stroke="#a8cfe0" strokeWidth="0.4" opacity="0.6"/>
          </pattern>
          {/* Parchment bg gradient */}
          <radialGradient id="parchment" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#f9f0dc"/>
            <stop offset="100%" stopColor="#e8d5a3"/>
          </radialGradient>
          {/* Shadow filter */}
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0.5" stdDeviation="1.5" floodColor="#6b4c1e" floodOpacity="0.3"/>
          </filter>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Island green gradient */}
          <radialGradient id="greenIsland" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#c8e6a0"/>
            <stop offset="100%" stopColor="#7ab648"/>
          </radialGradient>
          <radialGradient id="snowIsland" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e8f4ff"/>
            <stop offset="100%" stopColor="#b8d8ef"/>
          </radialGradient>
          <radialGradient id="darkIsland" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4a6274"/>
            <stop offset="100%" stopColor="#2c3e50"/>
          </radialGradient>
          <radialGradient id="warmIsland" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f5c87a"/>
            <stop offset="100%" stopColor="#e67e22"/>
          </radialGradient>
        </defs>

        {/* Background - ocean */}
        <rect width="100" height="100" fill="#c8e8f5"/>
        <rect width="100" height="100" fill="url(#waves)"/>

        {/* Subtle parchment map area */}
        <ellipse cx="50" cy="52" rx="46" ry="40" fill="#e8d5a0" opacity="0.5"/>

        {/* ---- DECORATIVE ELEMENTS ---- */}
        {/* Sun */}
        <g transform="translate(90,8)">
          <circle r="4" fill="#ffd54f" opacity="0.9"/>
          {[0,45,90,135,180,225,270,315].map((a,i) => (
            <line key={i} x1="0" y1="0" x2={5.5*Math.cos(a*Math.PI/180)} y2={5.5*Math.sin(a*Math.PI/180)}
              stroke="#ffd54f" strokeWidth="0.5" strokeLinecap="round"/>
          ))}
        </g>

        {/* Compass rose */}
        <g transform="translate(8,88)">
          <circle r="4" fill="#f9f0dc" stroke="#8b6914" strokeWidth="0.4"/>
          <text x="0" y="-3" textAnchor="middle" fontSize="1.8" fill="#8b6914" fontWeight="bold">N</text>
          <text x="0" y="4.5" textAnchor="middle" fontSize="1.5" fill="#8b6914">S</text>
          <text x="-3.5" y="1" textAnchor="middle" fontSize="1.5" fill="#8b6914">W</text>
          <text x="3.5" y="1" textAnchor="middle" fontSize="1.5" fill="#8b6914">E</text>
          <line x1="0" y1="-2" x2="0" y2="2" stroke="#8b6914" strokeWidth="0.4"/>
          <line x1="-2" y1="0" x2="2" y2="0" stroke="#8b6914" strokeWidth="0.4"/>
        </g>

        {/* Clouds */}
        {[[15,8],[55,6],[75,12],[42,9]].map(([cx,cy],i) => (
          <g key={i} transform={`translate(${cx},${cy})`} opacity="0.75">
            <ellipse rx="4" ry="2.5" fill="white"/>
            <ellipse cx="-2.5" cy="0.5" rx="2.5" ry="1.8" fill="white"/>
            <ellipse cx="2.5" cy="0.5" rx="2.5" ry="1.8" fill="white"/>
          </g>
        ))}

        {/* Fish in water */}
        {[[8,40],[12,65],[90,30],[85,75]].map(([fx,fy],i) => (
          <g key={i} transform={`translate(${fx},${fy})`} opacity="0.5">
            <ellipse rx="1.5" ry="0.7" fill="#5ba3c9"/>
            <path d="M1.5,0 L2.5,-0.7 L2.5,0.7Z" fill="#5ba3c9"/>
          </g>
        ))}

        {/* Sailboat */}
        <g transform="translate(22,55)" opacity="0.7">
          <rect x="-1.5" y="0.5" width="3" height="1" rx="0.5" fill="#e8d5a0" stroke="#8b6914" strokeWidth="0.2"/>
          <line x1="0" y1="-4" x2="0" y2="0.5" stroke="#8b6914" strokeWidth="0.3"/>
          <path d="M0,-3.5 L2.5,0.5 L0,0.5Z" fill="white" opacity="0.9"/>
          <path d="M0,-2 L-2,0.5 L0,0.5Z" fill="#f9c74f" opacity="0.9"/>
        </g>

        {/* Little sea monster */}
        <g transform="translate(70,90)" opacity="0.6">
          <ellipse cx="0" cy="0" rx="3" ry="1.5" fill="#6dbf8c"/>
          <path d="M-2,-1 L-1,-3 L0,-1" fill="#6dbf8c"/>
          <path d="M0,-1 L1,-2.5 L2,-1" fill="#6dbf8c"/>
          <circle cx="2.5" cy="-0.5" r="0.5" fill="#6dbf8c"/>
          <circle cx="2.3" cy="-0.7" r="0.2" fill="white"/>
        </g>

        {/* ---- DASHED CONNECTING PATHS ---- */}
        {/* Paths from family island to each other */}
        {CHAPTERS.filter(c => c.id !== "family").map((ch) => {
          const fam = CHAPTERS.find(c => c.id === "family")!;
          return (
            <motion.path
              key={`path-${ch.id}`}
              d={`M${fam.cx},${fam.cy} Q${(fam.cx + ch.cx)/2 + (Math.random()*10-5)},${(fam.cy + ch.cy)/2 + (Math.random()*10-5)} ${ch.cx},${ch.cy}`}
              fill="none"
              stroke="#c8964a"
              strokeWidth="0.6"
              strokeDasharray="1.5 1.5"
              opacity="0.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
            />
          );
        })}

        {/* ---- ISLANDS ---- */}
        {CHAPTERS.map((ch, idx) => {
          const isHov = hovered === ch.id;
          const isFamily = ch.id === "family";

          // Color scheme per island
          const fillMap: Record<string,string> = {
            family: "#e8b86d",
            skiing: "#d0e8f5",
            boxing: "#c8a0a0",
            iceland: "#3d5a6c",
            marathon: "#c8d890",
            petition: "#e0cce8",
            kitchen: "#f0d8a0",
            tedx: "#f0b0a0",
            acting: "#f5dca0",
          };
          const fill = fillMap[ch.id] || "#c8d8a0";

          return (
            <g key={ch.id} style={{ cursor: "pointer" }}>
              <Link href={ch.path}>
                <g
                  transform={`translate(${ch.cx},${ch.cy})`}
                  onMouseEnter={() => setHovered(ch.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Glow ring on hover */}
                  {isHov && (
                    <circle
                      r={isFamily ? 17 : 14}
                      fill={ch.color}
                      opacity="0.15"
                      filter="url(#glow)"
                    />
                  )}

                  {/* Island shadow */}
                  <ellipse
                    cx="1" cy={isFamily ? 15 : 12}
                    rx={isFamily ? 15 : 11}
                    ry={isFamily ? 5 : 3.5}
                    fill="#6b4c1e"
                    opacity="0.15"
                  />

                  {/* Island body - scaled up on hover */}
                  <motion.g
                    animate={{ scale: isHov ? 1.08 : 1, y: isHov ? -1 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Main island shape */}
                    <motion.path
                      d={isFamily
                        ? "M0,-16 C6,-18 14,-14 16,-7 C18,0 15,9 8,13 C2,17 -6,17 -12,12 C-17,7 -17,-2 -14,-9 C-10,-16 -6,-14 0,-16Z"
                        : ISLAND_SHAPES[ch.id]
                      }
                      fill={fill}
                      stroke={isHov ? ch.color : "#a07840"}
                      strokeWidth={isHov ? "0.6" : "0.4"}
                      filter="url(#shadow)"
                    />

                    {/* Water edge detail */}
                    <motion.path
                      d={isFamily
                        ? "M0,-16 C6,-18 14,-14 16,-7 C18,0 15,9 8,13 C2,17 -6,17 -12,12 C-17,7 -17,-2 -14,-9 C-10,-16 -6,-14 0,-16Z"
                        : ISLAND_SHAPES[ch.id]
                      }
                      fill="none"
                      stroke="#87ceeb"
                      strokeWidth="1.5"
                      opacity="0.3"
                      transform="scale(1.08)"
                    />

                    {/* ---- Chapter-specific illustrations ---- */}
                    {ch.id === "family" && <FamilyIslandIllustration />}
                    {ch.id === "skiing" && <SkiingIslandIllustration />}
                    {ch.id === "boxing" && <BoxingIslandIllustration />}
                    {ch.id === "iceland" && <IcelandIslandIllustration />}
                    {ch.id === "marathon" && <MarathonIslandIllustration />}
                    {ch.id === "petition" && <PetitionIslandIllustration />}
                    {ch.id === "kitchen" && <KitchenIslandIllustration />}
                    {ch.id === "tedx" && <TedxIslandIllustration />}
                    {ch.id === "acting" && <ActingIslandIllustration />}
                  </motion.g>

                  {/* Label */}
                  <text
                    y={isFamily ? 22 : 17}
                    textAnchor="middle"
                    fontSize={isFamily ? "3" : "2.2"}
                    fontWeight="bold"
                    fill="#4a2e1b"
                    stroke="#f5ead6"
                    strokeWidth="0.8"
                    paintOrder="stroke"
                    style={{ fontFamily: "'Patrick Hand', cursive" }}
                  >
                    {ch.title}
                  </text>
                  {isFamily && (
                    <text y="26" textAnchor="middle" fontSize="2" fill="#8b4513" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                      + love
                    </text>
                  )}

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {isHov && (
                      <motion.g
                        initial={{ opacity: 0, y: 2, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 2, scale: 0.9 }}
                        transform={`translate(0,${isFamily ? -22 : -17})`}
                      >
                        <rect x="-20" y="-11" width="40" height="10" rx="2"
                          fill="#fffcf5" stroke={ch.color} strokeWidth="0.5" filter="url(#shadow)"/>
                        <text y="-5" textAnchor="middle" fontSize="2" fill="#4a2e1b" fontWeight="bold"
                          style={{ fontFamily: "'Patrick Hand', cursive" }}>{ch.subtitle}</text>
                        <text y="-1" textAnchor="middle" fontSize="1.6" fill={ch.color}
                          style={{ fontFamily: "'Patrick Hand', cursive" }}>▶ {ch.game}</text>
                      </motion.g>
                    )}
                  </AnimatePresence>
                </g>
              </Link>
            </g>
          );
        })}

        {/* ---- TITLE ---- */}
        <text x="50" y="5.5" textAnchor="middle" fontSize="5.5" fontWeight="bold"
          fill="#4a2e1b" stroke="#f5ead6" strokeWidth="1" paintOrder="stroke"
          style={{ fontFamily: "'Patrick Hand', cursive" }}>
          vihaar.me
        </text>
        <text x="50" y="9" textAnchor="middle" fontSize="2.2"
          fill="#8b6340" style={{ fontFamily: "'Patrick Hand', cursive", fontStyle: "italic" }}>
        </text>

      </svg>
    </div>
  );
}

/* ---- Island Illustrations (SVG micro-art) ---- */

function FamilyIslandIllustration() {
  return (
    <g>
      {/* Trees */}
      <g transform="translate(-8,-8)">
        <rect x="-1" y="0" width="2" height="4" fill="#8b6914"/>
        <ellipse cy="-2" rx="3.5" ry="3" fill="#5a9a30"/>
      </g>
      <g transform="translate(7,-9)">
        <rect x="-1" y="0" width="2" height="3" fill="#8b6914"/>
        <ellipse cy="-1.5" rx="2.5" ry="2.5" fill="#4a8a25"/>
      </g>
      {/* House */}
      <g transform="translate(0,-2)">
        <rect x="-4" y="-1" width="8" height="6" fill="#f0d8b0" stroke="#a07840" strokeWidth="0.3"/>
        <path d="M-5,-1 L0,-6 L5,-1Z" fill="#c04040" stroke="#a03030" strokeWidth="0.3"/>
        <rect x="-1" y="2" width="2.5" height="3" fill="#a0704a"/>
        <rect x="1.5" y="0" width="2" height="2" fill="#87ceeb" stroke="#a07840" strokeWidth="0.2"/>
      </g>
      {/* Beating heart */}
      <motion.g
        transform="translate(0,8)"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <path d="M0,2.5 C0,2.5 -4,-1 -4,-3 C-4,-5 -2,-6 0,-4 C2,-6 4,-5 4,-3 C4,-1 0,2.5 0,2.5Z"
          fill="#e74c3c" opacity="0.85"/>
      </motion.g>
      {/* Lake shimmer */}
      <ellipse cx="5" cy="10" rx="4" ry="2" fill="#87ceeb" opacity="0.5"/>
    </g>
  );
}

function SkiingIslandIllustration() {
  return (
    <g>
      {/* Snow-covered mountain */}
      <path d="M0,-12 L-8,0 L8,0Z" fill="#e8f4ff" stroke="#b0c8e0" strokeWidth="0.3"/>
      <path d="M0,-12 L-3,-6 L3,-6Z" fill="white"/>
      {/* Trees */}
      <g transform="translate(-5,2)">
        <rect x="-0.5" y="0" width="1" height="2.5" fill="#5a4a28"/>
        <path d="M0,-3 L-2.5,1 L2.5,1Z" fill="#3a7a30"/>
        <path d="M0,-5 L-2,0 L2,0Z" fill="#4a9a40"/>
      </g>
      <g transform="translate(5,2)">
        <rect x="-0.5" y="0" width="1" height="2.5" fill="#5a4a28"/>
        <path d="M0,-3 L-2.5,1 L2.5,1Z" fill="#3a7a30"/>
        <path d="M0,-5 L-2,0 L2,0Z" fill="#4a9a40"/>
      </g>
      {/* Skier figure */}
      <g transform="translate(0,-4)">
        <circle cy="-2" r="1.2" fill="#ffdab9"/>
        <rect x="-0.8" y="-1" width="1.6" height="2.5" rx="0.5" fill="#3498db"/>
        <line x1="-2.5" y1="1.5" x2="-1" y2="1.5" stroke="#555" strokeWidth="0.4"/>
        <line x1="2.5" y1="1.5" x2="1" y2="1.5" stroke="#555" strokeWidth="0.4"/>
      </g>
    </g>
  );
}

function BoxingIslandIllustration() {
  return (
    <g>
      {/* Boxing ring floor */}
      <rect x="-6" y="-2" width="12" height="8" rx="1" fill="#d4a878" stroke="#8b6914" strokeWidth="0.3"/>
      {/* Ring ropes */}
      <line x1="-6" y1="0" x2="6" y2="0" stroke="#e74c3c" strokeWidth="0.5"/>
      <line x1="-6" y1="2" x2="6" y2="2" stroke="#e74c3c" strokeWidth="0.5"/>
      {/* Corner posts */}
      {[[-6,-2],[6,-2],[-6,6],[6,6]].map(([px,py],i) => (
        <rect key={i} x={px-0.5} y={py-0.5} width="1" height="1" fill="#8b6914"/>
      ))}
      {/* Two boxers */}
      <g transform="translate(-2.5,-6)">
        <circle cy="-2.5" r="1.2" fill="#ffdab9"/>
        <rect x="-1" y="-1.5" width="2" height="3" rx="0.5" fill="#3498db"/>
        <rect x="1" y="-1" width="1.5" height="1.5" rx="0.5" fill="#e74c3c"/>
      </g>
      <g transform="translate(2.5,-6)">
        <circle cy="-2.5" r="1.2" fill="#ffdab9"/>
        <rect x="-1" y="-1.5" width="2" height="3" rx="0.5" fill="#e74c3c"/>
        <rect x="-2.5" y="-1" width="1.5" height="1.5" rx="0.5" fill="#3498db"/>
      </g>
      {/* Stars from hit */}
      {[-1,0,1].map(i => (
        <text key={i} x={i*2} y="-9" textAnchor="middle" fontSize="2" fill="#ffd700">★</text>
      ))}
    </g>
  );
}

function IcelandIslandIllustration() {
  return (
    <g>
      {/* Night sky tint on island */}
      <ellipse rx="9" ry="7" fill="#2c3e50" opacity="0.5"/>
      {/* Basalt columns */}
      {[-5,-2,1,4].map((x, i) => (
        <rect key={i} x={x} y={-8+i%2*2} width="2" height={8+i%2} rx="0.3"
          fill={["#4a6274","#3d5a6c","#5a7080","#4a6274"][i]} stroke="#2c3e50" strokeWidth="0.2"/>
      ))}
      {/* Northern lights */}
      <path d="M-8,-10 Q-4,-14 0,-10 Q4,-14 8,-10" stroke="#1abc9c" strokeWidth="0.8" fill="none" opacity="0.7"/>
      <path d="M-7,-8 Q-3,-12 1,-8 Q5,-12 9,-8" stroke="#9b59b6" strokeWidth="0.5" fill="none" opacity="0.5"/>
      {/* Climber */}
      <g transform="translate(0,-7)">
        <circle cy="-1.5" r="1" fill="#ffdab9"/>
        <rect x="-0.7" y="-0.8" width="1.4" height="2" rx="0.3" fill="#e67e22"/>
        <line x1="-2" y1="0" x2="0" y2="0" stroke="#8b6914" strokeWidth="0.4"/>
      </g>
      {/* Stars */}
      {[[-3,-12],[-6,-11],[4,-13],[6,-11]].map(([sx,sy],i) => (
        <circle key={i} cx={sx} cy={sy} r="0.3" fill="white" opacity="0.8"/>
      ))}
    </g>
  );
}

function MarathonIslandIllustration() {
  return (
    <g>
      {/* Road */}
      <path d="M-8,3 Q0,1 8,3" fill="none" stroke="#808080" strokeWidth="2.5" opacity="0.6"/>
      <path d="M-8,3 Q0,1 8,3" fill="none" stroke="#f5ead6" strokeWidth="0.3" strokeDasharray="1 1"/>
      {/* Trees lining road */}
      {[-6,-3,0,3,6].map((x,i) => (
        <g key={i} transform={`translate(${x},-2)`}>
          <rect x="-0.4" y="0" width="0.8" height="3" fill="#7a5a30"/>
          <ellipse cy="-1.5" rx="2" ry="2" fill={i%2===0?"#4a9a30":"#5aaa40"} opacity="0.8"/>
        </g>
      ))}
      {/* Runner */}
      <g transform="translate(-4,0)">
        <circle cy="-7" r="1.2" fill="#ffdab9"/>
        <rect x="-0.8" y="-6" width="1.6" height="2.5" rx="0.5" fill="#e74c3c"/>
        {/* Running legs */}
        <line x1="-0.8" y1="-3.5" x2="-2" y2="-1" stroke="#333" strokeWidth="0.5"/>
        <line x1="0.8" y1="-3.5" x2="0.5" y2="-1" stroke="#333" strokeWidth="0.5"/>
        {/* Arms */}
        <line x1="-0.8" y1="-5.5" x2="-2.5" y2="-4" stroke="#ffdab9" strokeWidth="0.5"/>
        <line x1="0.8" y1="-5.5" x2="2" y2="-4.5" stroke="#ffdab9" strokeWidth="0.5"/>
      </g>
      {/* Finish line flag */}
      <line x1="7" y1="-5" x2="7" y2="3" stroke="#333" strokeWidth="0.3"/>
      <rect x="7" y="-5" width="3" height="2" fill="#e74c3c" opacity="0.9"/>
      <text x="8.5" y="-3.7" textAnchor="middle" fontSize="1.2" fill="white">FIN</text>
    </g>
  );
}

function PetitionIslandIllustration() {
  return (
    <g>
      {/* School building */}
      <rect x="-6" y="-4" width="12" height="8" fill="#f0e0d0" stroke="#a07840" strokeWidth="0.3"/>
      <path d="M-7,-4 L0,-9 L7,-4Z" fill="#cc4444" stroke="#aa3333" strokeWidth="0.3"/>
      {/* Windows */}
      {[-4,0,4].map(x => (
        <rect key={x} x={x-1} y="-2" width="2" height="2" fill="#87ceeb" stroke="#a07840" strokeWidth="0.2"/>
      ))}
      <rect x="-1.5" y="1" width="3" height="3" fill="#8b6914"/>
      {/* Petition paper floating */}
      <g transform="translate(7,-6)" style={{ transform: "rotate(-10deg)" }}>
        <rect x="-1.5" y="-2" width="3" height="4" rx="0.2" fill="white" stroke="#ccc" strokeWidth="0.2"/>
        <line x1="-1" y1="-1" x2="1" y2="-1" stroke="#ccc" strokeWidth="0.2"/>
        <line x1="-1" y1="0" x2="1" y2="0" stroke="#ccc" strokeWidth="0.2"/>
        <line x1="-1" y1="1" x2="0.5" y2="1" stroke="#ccc" strokeWidth="0.2"/>
      </g>
      {/* People signing */}
      {[-4,0,4].map((x,i) => (
        <g key={i} transform={`translate(${x},7)`}>
          <circle cy="-2" r="1" fill="#ffdab9"/>
          <rect x="-0.8" y="-1" width="1.6" height="2" rx="0.5" fill={["#3498db","#e74c3c","#9b59b6"][i]} opacity="0.8"/>
        </g>
      ))}
    </g>
  );
}

function KitchenIslandIllustration() {
  return (
    <g>
      {/* Restaurant backdrop */}
      <rect x="-7" y="-3" width="14" height="9" fill="#f5e6c8" stroke="#c09040" strokeWidth="0.3"/>
      {/* Counter */}
      <rect x="-7" y="3" width="14" height="3" fill="#c09040"/>
      {/* Pots on stove */}
      {[-4,0,4].map((x,i) => (
        <g key={i} transform={`translate(${x},1)`}>
          <ellipse cy="0.5" rx="2.5" ry="1" fill={["#3498db","#e74c3c","#2ecc71"][i]} opacity="0.8"/>
          <rect x="-2" y="-2" width="4" height="3" rx="0.5" fill={["#2980b9","#c0392b","#27ae60"][i]}/>
          <path d="M-2,-2 L2,-2" stroke="#aaa" strokeWidth="0.3"/>
        </g>
      ))}
      {/* Chef */}
      <g transform="translate(-5,-6)">
        <circle cy="-2" r="1.2" fill="#ffdab9"/>
        {/* Chef hat */}
        <rect x="-1.2" y="-3.5" width="2.4" height="1.5" rx="0.5" fill="white"/>
        <ellipse cy="-3.5" rx="1.8" ry="0.7" fill="white"/>
        <rect x="-0.8" y="-0.8" width="1.6" height="2.5" rx="0.5" fill="white"/>
      </g>
      {/* Michelin star */}
      <text x="5" y="-7" fontSize="3" fill="#ffd700" textAnchor="middle">★</text>
    </g>
  );
}

function TedxIslandIllustration() {
  return (
    <g>
      {/* Stage */}
      <rect x="-8" y="2" width="16" height="5" fill="#2c2c2c" rx="1"/>
      <rect x="-7" y="0" width="14" height="3" fill="#3a3a3a" rx="0.5"/>
      {/* Spotlight */}
      <path d="M0,-12 L-5,0 L5,0Z" fill="#ffd700" opacity="0.15"/>
      <circle cy="-12" r="1.5" fill="#ffd700" opacity="0.6"/>
      {/* Speaker figure */}
      <g transform="translate(0,-2)">
        <circle cy="-3" r="1.3" fill="#ffdab9"/>
        <rect x="-1" y="-2" width="2" height="3" rx="0.5" fill="#e74c3c"/>
        {/* Arms outstretched */}
        <line x1="-1" y1="-1" x2="-3.5" y2="-0.5" stroke="#ffdab9" strokeWidth="0.5"/>
        <line x1="1" y1="-1" x2="3.5" y2="-0.5" stroke="#ffdab9" strokeWidth="0.5"/>
      </g>
      {/* Audience dots */}
      {[-5,-2.5,0,2.5,5].map((x,i) => (
        <circle key={i} cx={x} cy="5.5" r="0.8" fill={["#ffdab9","#3498db","#e74c3c","#f39c12","#9b59b6"][i]} opacity="0.6"/>
      ))}
      {/* TED text */}
      <text x="0" y="-8" textAnchor="middle" fontSize="3.5" fontWeight="bold" fill="#e74c3c"
        stroke="white" strokeWidth="0.4" paintOrder="stroke"
        style={{ fontFamily: "Arial, sans-serif", letterSpacing: "-0.1em" }}>TED</text>
    </g>
  );
}

function ActingIslandIllustration() {
  return (
    <g>
      {/* Film set backdrop */}
      <rect x="-8" y="-6" width="16" height="12" rx="1" fill="#2b2518" opacity="0.7"/>
      {/* Film clapperboard */}
      <g transform="translate(-4,-9)">
        <rect x="-3" y="-2" width="6" height="4" rx="0.5" fill="#222" stroke="#444" strokeWidth="0.3"/>
        <rect x="-3" y="-4" width="6" height="2" rx="0.3" fill="#444"/>
        {/* Clapper stripes */}
        {[-2,0,2].map(x => (
          <line key={x} x1={x} y1="-4" x2={x+1} y2="-2" stroke="white" strokeWidth="0.5" opacity="0.6"/>
        ))}
        <text x="0" y="1" textAnchor="middle" fontSize="1" fill="white">TAKE 1</text>
      </g>
      {/* Camera */}
      <g transform="translate(5,-7)">
        <rect x="-1.5" y="-1" width="3" height="2" rx="0.3" fill="#555"/>
        <circle cx="2" cy="0" r="1" fill="#444" stroke="#666" strokeWidth="0.2"/>
        <circle cx="2" cy="0" r="0.4" fill="#87ceeb" opacity="0.8"/>
      </g>
      {/* Child actor on set */}
      <g transform="translate(0,1)">
        <circle cy="-7" r="1.5" fill="#ffdab9"/>
        <rect x="-1.2" y="-5.5" width="2.4" height="3.5" rx="0.5" fill="#f1c40f"/>
        <line x1="-1.2" y1="-2" x2="-3" y2="0" stroke="#ffdab9" strokeWidth="0.5"/>
        <line x1="1.2" y1="-2" x2="2.5" y2="-1" stroke="#ffdab9" strokeWidth="0.5"/>
        <line x1="-1" y1="2" x2="-1.5" y2="5" stroke="#333" strokeWidth="0.5"/>
        <line x1="1" y1="2" x2="1.5" y2="5" stroke="#333" strokeWidth="0.5"/>
      </g>
      {/* Spotlight */}
      <path d="M0,-15 L-4,-6 L4,-6Z" fill="#ffd700" opacity="0.1"/>
      {/* Stars */}
      {[[-6,-10],[6,-12],[0,-14]].map(([sx,sy],i) => (
        <text key={i} x={sx} y={sy} fontSize="2" fill="#ffd700" opacity="0.8">★</text>
      ))}
    </g>
  );
}
