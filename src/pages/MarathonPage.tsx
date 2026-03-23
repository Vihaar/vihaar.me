import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'

function RunGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [distance, setDistance] = useState(0)
  const [stamina, setStamina] = useState(100)
  const [lane, setLane] = useState(1)
  const obstaclesRef = useRef<{ id: number; lane: number; y: number }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const distRef = useRef(0)
  const staminaRef = useRef(100)
  const laneRef = useRef(1)
  const gameOverRef = useRef(false)

  const start = () => {
    setGameStarted(true)
    setGameOver(false)
    setDistance(0)
    setStamina(100)
    setLane(1)
    distRef.current = 0
    staminaRef.current = 100
    laneRef.current = 1
    gameOverRef.current = false
    obstaclesRef.current = []
    frameRef.current = 0
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = 300, H = 400
    canvas.width = W; canvas.height = H
    const lanes = [75, 150, 225]

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && laneRef.current > 0) { laneRef.current--; setLane(laneRef.current) }
      if (e.key === 'ArrowRight' && laneRef.current < 2) { laneRef.current++; setLane(laneRef.current) }
      if (e.key === ' ' || e.key === 'ArrowUp') { staminaRef.current = Math.min(100, staminaRef.current + 5) }
    }
    window.addEventListener('keydown', handleKey)

    let animId: number
    const loop = () => {
      if (gameOverRef.current) return
      frameRef.current++

      staminaRef.current -= 0.15
      if (staminaRef.current <= 0) { gameOverRef.current = true; setGameOver(true); return }
      setStamina(Math.round(staminaRef.current))

      if (frameRef.current % 50 === 0) {
        obstaclesRef.current.push({ id: frameRef.current, lane: Math.floor(Math.random() * 3), y: -20 })
      }

      ctx.fillStyle = '#1a0f08'
      ctx.fillRect(0, 0, W, H)

      ctx.strokeStyle = 'rgba(249,115,22,0.15)'
      for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        ctx.setLineDash([20, 15])
        ctx.moveTo(37.5 + i * 75, 0)
        ctx.lineTo(37.5 + i * 75, H)
        ctx.stroke()
      }
      ctx.setLineDash([])

      obstaclesRef.current = obstaclesRef.current.filter(o => {
        o.y += 3 + distRef.current * 0.02
        ctx.fillStyle = '#92400e'
        ctx.fillRect(lanes[o.lane] - 12, o.y - 8, 24, 16)
        ctx.fillStyle = '#f59e0b'
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('X', lanes[o.lane], o.y + 4)

        if (Math.abs(lanes[o.lane] - lanes[laneRef.current]) < 20 && Math.abs(o.y - (H - 50)) < 18) {
          staminaRef.current -= 20
          if (staminaRef.current <= 0) { gameOverRef.current = true; setGameOver(true) }
          return false
        }
        return o.y < H + 20
      })

      if (frameRef.current % 10 === 0) { distRef.current++; setDistance(distRef.current) }

      if (distRef.current >= 262) { gameOverRef.current = true; setGameOver(true); setDistance(262) }

      ctx.fillStyle = '#f97316'
      const px = lanes[laneRef.current]
      ctx.beginPath()
      ctx.arc(px, H - 50, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ea580c'
      ctx.beginPath()
      ctx.moveTo(px - 3, H - 38)
      ctx.lineTo(px + 3, H - 38)
      ctx.lineTo(px + 5, H - 25)
      ctx.lineTo(px - 5, H - 25)
      ctx.fill()

      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => { window.removeEventListener('keydown', handleKey); cancelAnimationFrame(animId) }
  }, [gameStarted, gameOver])

  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-lg overflow-hidden border-2 border-stone-300/60 shadow-sm">
        <canvas ref={canvasRef} width={300} height={400} className="block" />
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-orange-950/90">
            <p className="font-display text-xl text-orange-300 mb-2">Run & Dodge</p>
            <p className="text-orange-200/50 text-sm mb-4 font-body">← → to dodge, ↑ to sprint</p>
            <button onClick={start} className="px-6 py-2 bg-orange-600 text-white rounded-full font-display hover:bg-orange-700 transition-colors">
              start running
            </button>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-orange-950/90">
            <p className="font-display text-xl text-orange-300">{distRef.current >= 262 ? 'finish line!' : 'bonked!'}</p>
            <p className="text-orange-200/50 text-sm font-body">{distance / 10} / 26.2 miles</p>
            <button onClick={start} className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-full font-display hover:bg-orange-700 transition-colors">
              run again
            </button>
          </div>
        )}
      </div>
      {gameStarted && !gameOver && (
        <div className="mt-3 flex justify-center gap-6 text-sm font-display">
          <span className="text-orange-300">mile {(distance / 10).toFixed(1)}/26.2</span>
          <span className="text-orange-300">stamina {stamina}%</span>
        </div>
      )}
    </div>
  )
}

export default function MarathonPage() {
  return (
    <PageShell bg="#1a0f08">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-orange-900/10 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-5xl font-bold text-orange-300 text-center">Ann Arbor Marathon</h1>
          <p className="font-hand text-xl text-orange-200/50 text-center mt-2">26.2 miles of grit</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 rounded-lg overflow-hidden shadow-sm border-2 border-stone-300/70"
        >
          <img src="/images/marathon-hero.png" alt="Ann Arbor Marathon" className="w-full h-64 object-cover" draggable={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-6 max-w-xl mx-auto text-center font-body text-orange-100/80 text-lg leading-relaxed"
        >
          <p>
            Running a marathon is one of those things you say yes to before you
            understand what it means. 26.2 miles. Ann Arbor.
          </p>
          <p>
            The wall hits around mile 20. Everything in your body says stop.
            And then you keep going anyway.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <h2 className="font-display text-2xl text-orange-300/80 text-center mt-16 mb-4">Run & Dodge</h2>
          <RunGame />
        </motion.div>
      </div>
    </PageShell>
  )
}
