import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Mountain, Target, Camera, Utensils, PenTool, Flame, Users, Footprints } from "lucide-react";

interface NodeData {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  game: string;
  x: number; // percentage
  y: number; // percentage
  icon: React.ElementType;
}

const NODES: NodeData[] = [
  { id: "family", path: "/family", title: "Family", subtitle: "Lake life & roots", game: "Pass the Love", x: 65, y: 25, icon: Users },
  { id: "skiing", path: "/skiing", title: "Skiing", subtitle: "Fear & joy", game: "Downhill Dodge", x: 25, y: 20, icon: Mountain },
  { id: "boxing", path: "/boxing", title: "Boxing", subtitle: "135-lb weight class", game: "Punch Out", x: 15, y: 50, icon: Target },
  { id: "iceland", path: "/iceland", title: "Batman Mountain", subtitle: "Icelandic basalt", game: "Basalt Climber", x: 25, y: 80, icon: Flame },
  { id: "marathon", path: "/marathon", title: "Ann Arbor Marathon", subtitle: "Pushing the wall", game: "Pacer", x: 50, y: 85, icon: Footprints },
  { id: "petition", path: "/petition", title: "The Petition", subtitle: "Walled Lake Western", game: "Signature Drive", x: 75, y: 75, icon: PenTool },
  { id: "kitchen", path: "/kitchen", title: "Max Cekot Kitchen", subtitle: "Michelin star Riga", game: "Plate Up", x: 85, y: 50, icon: Utensils },
  { id: "tedx", path: "/tedx", title: "TEDxYouth", subtitle: "Finding a voice", game: "Keep the Beat", x: 50, y: 15, icon: Map },
  { id: "acting", path: "/acting", title: "Child Actor", subtitle: "IMDb credits", game: "Simon Says", x: 80, y: 35, icon: Camera },
];

export default function Home() {
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-[#Fdfbf7] flex items-center justify-center cursor-default"
      ref={containerRef}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/map-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Dotted Paths from center */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-20">
        <defs>
          <radialGradient id="fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8c4a24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8c4a24" stopOpacity="0" />
          </radialGradient>
        </defs>
        {NODES.map((node) => (
          <path
            key={`path-${node.id}`}
            d={`M 50 ${50} Q ${50 + (node.x - 50) / 2} ${node.y}, ${node.x} ${node.y}`}
            fill="none"
            stroke="url(#fade)"
            strokeWidth="3"
            strokeDasharray="8 8"
            className="vector-path-anim"
            vectorEffect="non-scaling-stroke"
            transform="scale(10) translate(-45 -45)" 
            // The transform is a hacky way to map 0-100 coords to full screen without complex math, 
            // but let's use actual % coordinates for SVG lines instead
          />
        ))}
      </svg>
      
      {/* Absolute percentage based SVG for lines */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-30" preserveAspectRatio="none">
        {NODES.map((node) => (
          <motion.line
            key={`line-${node.id}`}
            x1="50%" y1="50%"
            x2={`${node.x}%`} y2={`${node.y}%`}
            stroke="#8c4a24"
            strokeWidth="2"
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
        <h1 className="font-display text-5xl md:text-7xl text-[#4a2e1b] drop-shadow-sm">vihaar.me</h1>
        <p className="font-body text-xl md:text-2xl text-[#8c4a24] italic mt-2">a life in chapters</p>
      </div>

      {/* Center Heart */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse group-hover:bg-red-500/40 transition-all duration-500" />
          <img 
            src={`${import.meta.env.BASE_URL}images/heart.png`}
            alt="Family Heart"
            className="w-24 h-24 md:w-32 md:h-32 object-contain animate-heartbeat drop-shadow-2xl relative z-10"
          />
        </div>
        <span className="font-display text-2xl text-red-800 mt-4 bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm border border-red-900/10">+ love</span>
      </div>

      {/* Map Nodes */}
      {NODES.map((node, i) => {
        const isHovered = hoveredNode?.id === node.id;
        const delay = i * 0.1;
        
        return (
          <Link key={node.id} href={node.path} className="absolute z-30" style={{ top: `${node.y}%`, left: `${node.x}%`, transform: 'translate(-50%, -50%)' }}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay, type: "spring", stiffness: 200 }}
              onHoverStart={() => setHoveredNode(node)}
              onHoverEnd={() => setHoveredNode(null)}
              className="relative cursor-pointer group flex flex-col items-center animate-float"
              style={{ animationDelay: `${delay}s` }}
            >
              {/* Node Icon/Island */}
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-4 border-white/80 backdrop-blur-md ${isHovered ? 'bg-[#8c4a24] scale-110 shadow-xl shadow-[#8c4a24]/30' : 'bg-[#e8dbc5]'}`}>
                <node.icon className={`w-8 h-8 md:w-10 md:h-10 transition-colors ${isHovered ? 'text-white' : 'text-[#8c4a24]'}`} strokeWidth={1.5} />
              </div>
              
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute top-full mt-4 w-48 bg-[#fffcf5] border-2 border-[#8c4a24]/20 p-3 rounded-xl shadow-xl pointer-events-none z-50 text-center"
                  >
                    <div className="font-display text-2xl text-[#4a2e1b] leading-none mb-1">{node.title}</div>
                    <div className="font-body text-sm text-[#8c4a24] italic mb-2">{node.subtitle}</div>
                    <div className="bg-[#8c4a24]/10 rounded px-2 py-1 text-xs font-bold text-[#8c4a24] uppercase tracking-wider">
                      Play: {node.game}
                    </div>
                    {/* Tooltip triangle */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#fffcf5] border-t-2 border-l-2 border-[#8c4a24]/20 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
