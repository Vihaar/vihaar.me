import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'

const ACTIONS = [
  { icon: 'W', label: 'wave' },
  { icon: 'S', label: 'smile' },
  { icon: 'B', label: 'bow' },
  { icon: 'T', label: 'think' },
  { icon: 'G', label: 'gasp' },
]

function SimonSaysGame() {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [isDirecting, setIsDirecting] = useState(false)
  const [activeAction, setActiveAction] = useState(-1)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')

  const directorSays = [
    'Director says...', 'And action!', 'One more time...', 'Feel it!',
    'From the top!', 'Give me more!', 'Beautiful!', 'Again!',
  ]

  const nextRound = useCallback(() => {
    const newSeq = [...sequence, Math.floor(Math.random() * ACTIONS.length)]
    setSequence(newSeq)
    setPlayerInput([])
    setIsDirecting(true)
    setMessage(directorSays[Math.min(score, directorSays.length - 1)])

    newSeq.forEach((action, i) => {
      setTimeout(() => setActiveAction(action), i * 700 + 400)
      setTimeout(() => setActiveAction(-1), i * 700 + 900)
    })
    setTimeout(() => {
      setIsDirecting(false)
      setMessage('your turn!')
    }, newSeq.length * 700 + 600)
  }, [sequence, score])

  const start = useCallback(() => {
    setSequence([])
    setPlayerInput([])
    setScore(0)
    setGameStarted(true)
    setGameOver(false)
    const first = [Math.floor(Math.random() * ACTIONS.length)]
    setSequence(first)
    setIsDirecting(true)
    setMessage('Director says...')
    setTimeout(() => setActiveAction(first[0]), 400)
    setTimeout(() => setActiveAction(-1), 900)
    setTimeout(() => { setIsDirecting(false); setMessage('your turn!') }, 1200)
  }, [])

  const handleAction = (actionIdx: number) => {
    if (isDirecting || gameOver) return
    const newInput = [...playerInput, actionIdx]
    setPlayerInput(newInput)

    if (actionIdx !== sequence[newInput.length - 1]) {
      setGameOver(true)
      setMessage('CUT! Wrong action!')
      return
    }

    if (newInput.length === sequence.length) {
      setScore(s => s + 1)
      setMessage('perfect take!')
      setTimeout(nextRound, 800)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-8">
      <div className="relative rounded-xl bg-yellow-900/10 border border-yellow-700/20 p-6 min-h-[300px]">
        {!gameStarted && (
          <div className="flex flex-col items-center justify-center min-h-[260px]">
            <p className="font-display text-lg text-yellow-200 mb-2">Simon Says</p>
            <p className="text-yellow-200/50 text-sm font-body mb-4">watch the director, repeat the actions</p>
            <button onClick={start} className="px-6 py-2 bg-yellow-600 text-white rounded-full font-display hover:bg-yellow-700 transition-colors">
              action!
            </button>
          </div>
        )}
        {gameStarted && !gameOver && (
          <div className="text-center">
            <p className="text-yellow-300 font-hand text-lg mb-1">{message}</p>
            <p className="text-yellow-200/40 text-xs font-display mb-4">take {score + 1}</p>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(i)}
                  disabled={isDirecting}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all
                    ${activeAction === i ? 'bg-yellow-400/30 scale-105 shadow-sm' : 'bg-yellow-900/20 border border-yellow-800/20'}
                    ${isDirecting ? 'cursor-default' : 'cursor-pointer hover:bg-yellow-800/30'}
                  `}
                >
                  <span className="text-lg font-bold text-yellow-300">{action.icon}</span>
                  <span className="text-xs text-yellow-200/40 mt-1">{action.label}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-1">
              {sequence.map((_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < playerInput.length ? 'bg-yellow-400' : 'bg-yellow-900/30'}`} />
              ))}
            </div>
          </div>
        )}
        {gameOver && (
          <div className="flex flex-col items-center justify-center min-h-[220px]">
            <p className="font-display text-xl text-yellow-200">{score > 5 ? "that's a wrap!" : 'CUT!'}</p>
            <p className="text-yellow-300/50 text-sm font-body mt-1">{score} perfect takes</p>
            <button onClick={start} className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-full font-display hover:bg-yellow-700 transition-colors">
              take {score + 1}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChildActorPage() {
  return (
    <PageShell bg="#1a1608">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-[60%] bg-gradient-to-b from-yellow-400/5 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-5xl font-bold text-yellow-200 text-center">Child Actor</h1>
          <p className="font-hand text-xl text-yellow-300/50 text-center mt-2">lights, camera, action</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 rounded-lg overflow-hidden shadow-sm border-2 border-stone-300/70"
        >
          <img src="/images/child-actor-hero.png" alt="Child actor on set" className="w-full h-64 object-cover" draggable={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-6 max-w-xl mx-auto text-center font-body text-yellow-100/80 text-lg leading-relaxed"
        >
          <p>
            Between middle school and high school, I spent a year as a child actor.
            Modeling. Commercials. Short films. TV.
          </p>
          <p>
            I was in a TV show sitcom called <strong>"My Step Kids."</strong>
            Standing under the lights, hitting your mark, remembering your lines
            while the camera rolls — it's a different kind of pressure than anything else.
          </p>
          <p>
            <a
              href="https://www.imdb.com/name/nm9990820/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 underline underline-offset-4 hover:text-yellow-300 transition-colors"
            >
              check my IMDb →
            </a>
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <h2 className="font-display text-2xl text-yellow-200/80 text-center mt-16 mb-4">Simon Says</h2>
          <SimonSaysGame />
        </motion.div>
      </div>
    </PageShell>
  )
}
