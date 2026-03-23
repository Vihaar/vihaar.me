import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'

function SnowBackground() {
  const flakes = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 8,
    size: 2 + Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map(f => (
        <div
          key={f.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            top: '-10px',
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animation: `snowFall ${f.duration}s ${f.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

interface Obstacle {
  id: number
  x: number
  y: number
  type: 'tree' | 'rock'
}

function SkiGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const playerRef = useRef({ x: 150, lane: 1 })
  const obstaclesRef = useRef<Obstacle[]>([])
  const scoreRef = useRef(0)
  const frameRef = useRef(0)
  const gameOverRef = useRef(false)

  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    scoreRef.current = 0
    gameOverRef.current = false
    playerRef.current = { x: 150, lane: 1 }
    obstaclesRef.current = []
  }, [])

  useEffect(() => {
    if (!gameStarted || gameOver) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 300, H = 400
    canvas.width = W
    canvas.height = H
    const lanes = [60, 150, 240]

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && playerRef.current.lane > 0) playerRef.current.lane--
      if (e.key === 'ArrowRight' && playerRef.current.lane < 2) playerRef.current.lane++
      playerRef.current.x = lanes[playerRef.current.lane]
    }
    window.addEventListener('keydown', handleKey)

    let animId: number
    const loop = () => {
      if (gameOverRef.current) return
      frameRef.current++

      if (frameRef.current % 40 === 0) {
        const lane = Math.floor(Math.random() * 3)
        obstaclesRef.current.push({
          id: frameRef.current,
          x: lanes[lane],
          y: -30,
          type: Math.random() > 0.5 ? 'tree' : 'rock',
        })
      }

      ctx.fillStyle = '#e8f4f8'
      ctx.fillRect(0, 0, W, H)

      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = 'rgba(148,163,184,0.3)'
        ctx.setLineDash([8, 8])
        ctx.beginPath()
        ctx.moveTo(lanes[i], 0)
        ctx.lineTo(lanes[i], H)
        ctx.stroke()
        ctx.setLineDash([])
      }

      const speed = 3 + scoreRef.current * 0.15
      obstaclesRef.current = obstaclesRef.current.filter(o => {
        o.y += speed
        if (o.type === 'tree') {
          ctx.fillStyle = '#166534'
          ctx.beginPath()
          ctx.moveTo(o.x, o.y - 15)
          ctx.lineTo(o.x - 10, o.y + 10)
          ctx.lineTo(o.x + 10, o.y + 10)
          ctx.closePath()
          ctx.fill()
          ctx.fillStyle = '#92400e'
          ctx.fillRect(o.x - 2, o.y + 10, 4, 6)
        } else {
          ctx.fillStyle = '#6b7280'
          ctx.beginPath()
          ctx.ellipse(o.x, o.y, 12, 8, 0, 0, Math.PI * 2)
          ctx.fill()
        }

        const px = playerRef.current.x
        const py = H - 60
        if (Math.abs(o.x - px) < 20 && Math.abs(o.y - py) < 20) {
          gameOverRef.current = true
          setGameOver(true)
          setScore(scoreRef.current)
          return false
        }
        return o.y < H + 30
      })

      if (frameRef.current % 20 === 0) {
        scoreRef.current++
        setScore(scoreRef.current)
      }

      const px = playerRef.current.x
      const py = H - 60
      ctx.fillStyle = '#0ea5e9'
      ctx.beginPath()
      ctx.moveTo(px, py - 12)
      ctx.lineTo(px - 8, py + 12)
      ctx.lineTo(px + 8, py + 12)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#0369a1'
      ctx.beginPath()
      ctx.moveTo(px - 12, py + 8)
      ctx.lineTo(px - 4, py + 4)
      ctx.lineTo(px + 4, py + 4)
      ctx.lineTo(px + 12, py + 8)
      ctx.closePath()
      ctx.fill()

      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('keydown', handleKey)
      cancelAnimationFrame(animId)
    }
  }, [gameStarted, gameOver])

  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-lg overflow-hidden border-2 border-stone-300/60 shadow-sm">
        <canvas ref={canvasRef} width={300} height={400} className="block" />
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-sky-50/90">
            <p className="font-display text-xl text-sky-800 mb-2">Downhill Dodge</p>
            <p className="text-sky-600 text-sm mb-4 font-body">use ← → arrow keys</p>
            <button onClick={startGame} className="px-6 py-2 bg-sky-500 text-white rounded-full font-display hover:bg-sky-600 transition-colors">
              start skiing
            </button>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-sky-50/90">
            <p className="font-display text-xl text-sky-800 mb-1">crashed!</p>
            <p className="text-sky-600 text-sm mb-4 font-body">distance: {score}</p>
            <button onClick={startGame} className="px-6 py-2 bg-sky-500 text-white rounded-full font-display hover:bg-sky-600 transition-colors">
              try again
            </button>
          </div>
        )}
      </div>
      {gameStarted && !gameOver && (
        <p className="mt-3 text-sky-700 font-display text-sm">distance: {score}</p>
      )}
    </div>
  )
}

export default function SkiingPage() {
  return (
    <PageShell bg="#f0f9ff">
      <SnowBackground />
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-5xl font-bold text-sky-800 text-center">Skiing</h1>
          <p className="font-hand text-xl text-sky-600/60 text-center mt-2">carving through the cold</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 rounded-lg overflow-hidden shadow-sm border-2 border-stone-300/70"
        >
          <img src="/images/skiing-hero.png" alt="Skiing adventure" className="w-full h-64 object-cover" draggable={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-6 max-w-xl mx-auto text-center font-body text-sky-900/80 text-lg leading-relaxed"
        >
          <p>
            There's something about the mountain that makes everything else disappear.
            The cold biting your face, the edges carving into packed snow, the speed
            building until you're flying.
          </p>
          <p>
            Skiing taught me that fear and joy can live in the same moment.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <h2 className="font-display text-2xl text-sky-700 text-center mt-16 mb-4">Downhill Dodge</h2>
          <SkiGame />
        </motion.div>
      </div>
    </PageShell>
  )
}
