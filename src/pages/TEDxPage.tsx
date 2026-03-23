import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'

const CUES = ['Wave', 'Mic', 'Clap', 'Raise', 'Point']

function SpeechGame() {
  const [pattern, setPattern] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [isShowingPattern, setIsShowingPattern] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const nextRound = useCallback(() => {
    const newPattern = [...pattern, Math.floor(Math.random() * CUES.length)]
    setPattern(newPattern)
    setPlayerInput([])
    setIsShowingPattern(true)

    newPattern.forEach((cue, i) => {
      setTimeout(() => setActiveIdx(cue), i * 600)
      setTimeout(() => setActiveIdx(-1), i * 600 + 400)
    })
    setTimeout(() => setIsShowingPattern(false), newPattern.length * 600 + 200)
  }, [pattern])

  const start = useCallback(() => {
    setPattern([])
    setPlayerInput([])
    setScore(0)
    setGameStarted(true)
    setGameOver(false)
    const firstPattern = [Math.floor(Math.random() * CUES.length)]
    setPattern(firstPattern)
    setIsShowingPattern(true)
    setTimeout(() => { setActiveIdx(firstPattern[0]) }, 300)
    setTimeout(() => { setActiveIdx(-1) }, 700)
    setTimeout(() => setIsShowingPattern(false), 1000)
  }, [])

  const handlePress = (cueIdx: number) => {
    if (isShowingPattern || gameOver) return
    const newInput = [...playerInput, cueIdx]
    setPlayerInput(newInput)

    if (cueIdx !== pattern[newInput.length - 1]) {
      setGameOver(true)
      return
    }

    if (newInput.length === pattern.length) {
      setScore(s => s + 1)
      setTimeout(nextRound, 500)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-8">
      <div className="relative rounded-xl bg-red-950/30 border border-red-900/20 p-6 min-h-[280px]">
        {!gameStarted && (
          <div className="flex flex-col items-center justify-center min-h-[240px]">
            <p className="font-display text-lg text-red-200 mb-2">Keep the Rhythm</p>
            <p className="text-red-200/50 text-sm font-body mb-4">repeat the pattern of gestures</p>
            <button onClick={start} className="px-6 py-2 bg-red-600 text-white rounded-full font-display hover:bg-red-700 transition-colors">
              take the stage
            </button>
          </div>
        )}
        {gameStarted && !gameOver && (
          <div className="text-center">
            <p className="text-red-300 font-display text-sm mb-4">
              {isShowingPattern ? 'watch...' : 'your turn!'}
              <span className="ml-3">round {score + 1}</span>
            </p>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {CUES.map((cue, i) => (
                <button
                  key={i}
                  onClick={() => handlePress(i)}
                  disabled={isShowingPattern}
                  className={`text-xs font-bold p-3 rounded-xl transition-all
                    ${activeIdx === i ? 'bg-red-500/40 scale-105 shadow-sm text-red-200' : 'bg-red-900/20 border border-red-800/20 hover:bg-red-800/30 text-red-300/70'}
                    ${isShowingPattern ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  {cue}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-1">
              {pattern.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i < playerInput.length ? 'bg-red-400' : 'bg-red-900/30'}`}
                />
              ))}
            </div>
          </div>
        )}
        {gameOver && (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <p className="font-display text-xl text-red-200">{score > 5 ? 'standing ovation!' : 'off beat!'}</p>
            <p className="text-red-300/50 text-sm font-body mt-1">{score} rounds completed</p>
            <button onClick={start} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full font-display hover:bg-red-700 transition-colors">
              try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TEDxPage() {
  return (
    <PageShell bg="#1a0505">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1/2 bg-gradient-to-b from-red-500/5 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-5xl font-bold text-red-300 text-center">TEDxYouth</h1>
          <p className="font-hand text-xl text-red-200/50 text-center mt-2">got good at talking</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 rounded-lg overflow-hidden shadow-sm border-2 border-stone-300/70"
        >
          <img src="/images/tedx-hero.png" alt="TEDxYouth speaker" className="w-full h-64 object-cover" draggable={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-6 max-w-xl mx-auto text-center font-body text-red-100/80 text-lg leading-relaxed"
        >
          <p>
            I founded a TEDxYouth event. Two years of organizing, curating speakers,
            and learning how to stand on a stage and talk to a room full of people.
          </p>
          <p>
            More than anything, it taught me that the best thing you can do is
            help other people find their voice. Getting good at talking is nice.
            Helping others talk is better.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <h2 className="font-display text-2xl text-red-300/80 text-center mt-16 mb-4">Keep the Rhythm</h2>
          <SpeechGame />
        </motion.div>
      </div>
    </PageShell>
  )
}
