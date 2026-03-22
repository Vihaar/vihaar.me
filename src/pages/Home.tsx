import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface Hotspot {
  slug: string
  title: string
  subtitle: string
  gameTitle: string
  route: string
  color: string
  x: number
  y: number
  w: number
  h: number
}

const hotspots: Hotspot[] = [
  { slug: 'skiing', title: 'Skiing', subtitle: 'Carving through the cold', gameTitle: 'Downhill Dodge', route: '/skiing', color: '#3b82f6', x: 2, y: 2, w: 22, h: 40 },
  { slug: 'family', title: 'Family', subtitle: 'The heart of everything', gameTitle: 'Pass the Love', route: '/family', color: '#dc2626', x: 28, y: 2, w: 24, h: 42 },
  { slug: 'batman-mountain', title: 'Batman Mountain', subtitle: 'Free soloing basalt spires', gameTitle: 'Climb the Spire', route: '/batman-mountain', color: '#6b7280', x: 64, y: 2, w: 34, h: 42 },
  { slug: 'max-cekot', title: 'Max Cekot Kitchen', subtitle: 'Michelin star in Riga', gameTitle: 'Plate It Up', route: '/max-cekot', color: '#d97706', x: 6, y: 38, w: 24, h: 24 },
  { slug: 'tedx', title: 'TEDxYouth', subtitle: 'Got good at talking', gameTitle: 'Keep the Rhythm', route: '/tedx', color: '#dc2626', x: 50, y: 30, w: 22, h: 28 },
  { slug: 'child-actor', title: 'Child Actor', subtitle: 'Lights, camera, action', gameTitle: 'Simon Says', route: '/child-actor', color: '#a16207', x: 2, y: 60, w: 22, h: 38 },
  { slug: 'boxing', title: 'Boxing', subtitle: '135 lbs of heart', gameTitle: 'Punch Out', route: '/boxing', color: '#ef4444', x: 26, y: 58, w: 22, h: 38 },
  { slug: 'marathon', title: 'Ann Arbor Marathon', subtitle: '26.2 miles of grit', gameTitle: 'Run & Dodge', route: '/marathon', color: '#ea580c', x: 48, y: 62, w: 22, h: 34 },
  { slug: 'petition', title: 'The Petition', subtitle: 'Paper plates over styrofoam', gameTitle: 'Collect Signatures', route: '/petition', color: '#b45309', x: 70, y: 50, w: 28, h: 46 },
]

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null)

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setImageAspectRatio(img.naturalWidth / img.naturalHeight)
    setLoaded(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const hoveredSpot = hotspots.find(h => h.slug === hovered)

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f5efe6]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-center"
      >
        <h1 className="font-hand text-2xl md:text-3xl font-bold text-stone-800">
          vihaar<span className="text-red-500">.</span>me
        </h1>
        <p className="font-hand text-sm md:text-base text-stone-500 mt-0.5">life so far &ensp;+ love</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.95 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center p-2 pt-14 pb-10"
      >
        <div className="relative w-full h-full max-w-[1600px] max-h-[85vh] flex items-center justify-center">
          <div
            className="relative w-full h-full max-w-full max-h-full"
            style={imageAspectRatio ? { aspectRatio: imageAspectRatio } : undefined}
          >
            <img
              src="/images/life-map.png"
              alt="Life Map"
              className="absolute inset-0 w-full h-full object-contain rounded-lg border-2 border-stone-300/80"
              onLoad={handleImageLoad}
              draggable={false}
            />

            {loaded && hotspots.map((spot) => {
            const isActive = hovered === spot.slug
            return (
              <Link
                key={spot.slug}
                to={spot.route}
                className="absolute block"
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: `${spot.w}%`,
                  height: `${spot.h}%`,
                }}
                onMouseEnter={() => setHovered(spot.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                <motion.div
                  className="w-full h-full rounded-lg transition-all duration-200"
                  animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                  style={{
                    border: isActive ? `2px dashed ${spot.color}` : '2px dashed transparent',
                    background: isActive ? `${spot.color}08` : 'transparent',
                  }}
                />
              </Link>
            )
          })}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {hoveredSpot && (
          <motion.div
            key={hoveredSpot.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-40 pointer-events-none"
            style={{
              left: mousePos.x + 20,
              top: mousePos.y - 10,
            }}
          >
            <div className="px-4 py-3 rounded min-w-[180px] bg-amber-50/95 border-2 border-stone-400 font-hand shadow-sm">
              <p className="text-sm font-bold text-stone-800">{hoveredSpot.title}</p>
              <p className="text-xs text-stone-600 mt-0.5">{hoveredSpot.subtitle}</p>
              <p className="text-xs mt-2 pt-2 border-t border-stone-300" style={{ color: hoveredSpot.color }}>
                {hoveredSpot.gameTitle}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-stone-400 text-xs font-hand z-30"
      >
        hover to explore &middot; click to enter
      </motion.p>
    </div>
  )
}
