import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'

const familyMembers = [
  { id: 'mom', label: 'Mom', x: 30, y: 30 },
  { id: 'dad', label: 'Dad', x: 70, y: 30 },
  { id: 'vihaar', label: 'Vihaar', x: 50, y: 60 },
  { id: 'sibling', label: 'Sibling', x: 50, y: 20 },
]

function PassTheLoveGame() {
  const [heartAt, setHeartAt] = useState(0)
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(2000)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [targetIdx, setTargetIdx] = useState(1)

  const nextTarget = useCallback(() => {
    let next: number
    do {
      next = Math.floor(Math.random() * familyMembers.length)
    } while (next === heartAt)
    setTargetIdx(next)
  }, [heartAt])

  useEffect(() => {
    if (!gameStarted || gameOver) return
    const timer = setTimeout(() => {
      setGameOver(true)
    }, speed)
    return () => clearTimeout(timer)
  }, [heartAt, gameStarted, gameOver, speed])

  const handleClick = (idx: number) => {
    if (!gameStarted) {
      setGameStarted(true)
      setHeartAt(0)
      nextTarget()
      return
    }
    if (gameOver) return
    if (idx === targetIdx) {
      setScore(s => s + 1)
      setHeartAt(idx)
      setSpeed(s => Math.max(600, s - 100))
      nextTarget()
    } else {
      setGameOver(true)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-72 mt-8">
      <div className="absolute inset-0 rounded-2xl bg-red-900/10 border border-red-900/20" />
      {familyMembers.map((member, idx) => (
        <motion.button
          key={member.id}
          onClick={() => handleClick(idx)}
          className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-xs font-display font-bold transition-all cursor-pointer
            ${idx === targetIdx && gameStarted && !gameOver ? 'ring-2 ring-red-400 ring-offset-2 ring-offset-transparent' : ''}
            ${idx === heartAt && gameStarted ? 'bg-red-500/40 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}
          `}
          style={{ left: `${member.x}%`, top: `${member.y}%`, transform: 'translate(-50%, -50%)' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {idx === heartAt && gameStarted && <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
          {!(idx === heartAt && gameStarted) && member.label}
        </motion.button>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        {!gameStarted && (
          <p className="text-red-300/60 text-sm font-hand">click anyone to start passing the love</p>
        )}
        {gameStarted && !gameOver && (
          <p className="text-red-300 text-sm font-display">score: {score} &middot; pass to the glowing one!</p>
        )}
        {gameOver && (
          <div>
            <p className="text-red-300 text-sm font-display">love shared {score} times!</p>
            <button
              onClick={() => { setGameOver(false); setGameStarted(false); setScore(0); setSpeed(2000) }}
              className="mt-2 px-4 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300 hover:bg-red-500/30 transition-colors"
            >
              play again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FamilyPage() {
  return (
    <PageShell bg="#1a0a0a">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-5xl font-bold text-red-300 text-center">Family</h1>
          <p className="font-hand text-xl text-red-200/60 text-center mt-2">the heart of everything</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 rounded-lg overflow-hidden shadow-sm border-2 border-stone-300/70"
        >
          <img src="/images/family-hero.png" alt="Family" className="w-full h-64 object-cover" draggable={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-6 max-w-xl mx-auto text-center font-body text-red-100/80 text-lg leading-relaxed"
        >
          <p>
            Everything I reach for comes back to the people who believed in me first.
          </p>
          <p>
            Raised in Michigan — suburbs, on a lake. Home is quiet water and family
            more than a zip code.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <h2 className="font-display text-2xl text-red-300/80 text-center mt-16 mb-2">Pass the Love</h2>
          <p className="text-center text-red-200/40 text-sm font-hand">click to pass the heart before time runs out</p>
          <PassTheLoveGame />
        </motion.div>
      </div>
    </PageShell>
  )
}
