import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'

const HOLDS = [
  { id: 0, x: 50, y: 90 },
  { id: 1, x: 35, y: 78 },
  { id: 2, x: 60, y: 68 },
  { id: 3, x: 40, y: 56 },
  { id: 4, x: 55, y: 44 },
  { id: 5, x: 30, y: 34 },
  { id: 6, x: 65, y: 24 },
  { id: 7, x: 45, y: 14 },
  { id: 8, x: 50, y: 5 },
]

function ClimbGame() {
  const [currentHold, setCurrentHold] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [clickWindow, setClickWindow] = useState(false)
  const [windowTimer, setWindowTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const start = useCallback(() => {
    setCurrentHold(0)
    setGameStarted(true)
    setGameOver(false)
    setWon(false)
    openWindow()
  }, [])

  const openWindow = () => {
    const delay = 500 + Math.random() * 1500
    const timer = setTimeout(() => {
      setClickWindow(true)
      const closeTimer = setTimeout(() => {
        setClickWindow(false)
        setGameOver(true)
      }, 1200 - currentHold * 80)
      setWindowTimer(closeTimer)
    }, delay)
    setWindowTimer(timer)
  }

  const grab = (holdId: number) => {
    if (!gameStarted || gameOver) return
    if (holdId !== currentHold + 1) return
    if (!clickWindow) { setGameOver(true); return }

    if (windowTimer) clearTimeout(windowTimer)
    setClickWindow(false)

    if (holdId === HOLDS.length - 1) {
      setCurrentHold(holdId)
      setWon(true)
      setGameOver(true)
    } else {
      setCurrentHold(holdId)
      setTimeout(openWindow, 300)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-8">
      <div className="relative rounded-xl bg-gray-900/50 border border-gray-700/30 h-96 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'repeating-linear-gradient(90deg, transparent 0, transparent 19px, rgba(107,114,128,0.2) 19px, rgba(107,114,128,0.2) 20px)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-800/40 to-transparent" />

        {HOLDS.map((hold) => (
          <motion.button
            key={hold.id}
            onClick={() => grab(hold.id)}
            className={`absolute w-8 h-8 rounded-full transition-all cursor-pointer flex items-center justify-center text-xs font-bold
              ${hold.id === currentHold ? 'bg-green-500/60 border-2 border-green-400 shadow-sm' : ''}
              ${hold.id === currentHold + 1 && clickWindow ? 'bg-yellow-400/60 border-2 border-yellow-300 animate-pulse shadow-sm' : ''}
              ${hold.id === currentHold + 1 && !clickWindow ? 'bg-gray-600/40 border border-gray-500/30' : ''}
              ${hold.id < currentHold ? 'bg-green-500/20 border border-green-500/20' : ''}
              ${hold.id > currentHold + 1 ? 'bg-gray-700/20 border border-gray-600/10' : ''}
            `}
            style={{ left: `${hold.x}%`, top: `${hold.y}%`, transform: 'translate(-50%, -50%)' }}
            whileTap={{ scale: 0.8 }}
          >
            {hold.id === currentHold ? '\u25B2' : hold.id === HOLDS.length - 1 ? '\u2302' : ''}
          </motion.button>
        ))}

        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80">
            <p className="font-display text-lg text-gray-200 mb-2">Climb the Spire</p>
            <p className="text-gray-400 text-sm font-body mb-4">click glowing holds at the right moment</p>
            <button onClick={start} className="px-6 py-2 bg-gray-600 text-white rounded-full font-display hover:bg-gray-500 transition-colors">
              start climbing
            </button>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80">
            <p className="font-display text-xl text-gray-200">{won ? 'summit reached!' : 'slipped!'}</p>
            <p className="text-gray-400 text-sm font-body mt-1">reached hold {currentHold}/{HOLDS.length - 1}</p>
            <button onClick={start} className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-full font-display hover:bg-gray-500 transition-colors">
              climb again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BatmanMountainPage() {
  return (
    <PageShell bg="#0a0a0f">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(107,114,128,0.08),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/2 opacity-10"
          style={{ background: 'linear-gradient(180deg, rgba(156,163,175,0.1) 0%, transparent 100%)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-5xl font-bold text-gray-300 text-center">Batman Mountain</h1>
          <p className="font-hand text-xl text-gray-400/60 text-center mt-2">basalt spires, Iceland</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 rounded-lg overflow-hidden shadow-sm border-2 border-stone-300/70"
        >
          <img src="/images/batman-mountain-hero.png" alt="Batman Mountain basalt spires" className="w-full h-64 object-cover" draggable={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-6 max-w-xl mx-auto text-center font-body text-gray-300/80 text-lg leading-relaxed"
        >
          <p>
            Bátsfjörður. Iceland. Basalt Spires rising out of volcanic rock like
            columns from another world. I free soloed a section of it.
          </p>
          <p>
            No ropes. Just hands, rock, and the vertigo of looking down at
            Iceland stretching out below. The basalt is cold and sharp. Every
            hold matters.
          </p>
          <p className="text-gray-400/60 italic font-hand text-xl">
            "The mountain doesn't care about your plans. You adapt or you fall."
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <h2 className="font-display text-2xl text-gray-300/80 text-center mt-16 mb-4">Climb the Spire</h2>
          <ClimbGame />
        </motion.div>
      </div>
    </PageShell>
  )
}
