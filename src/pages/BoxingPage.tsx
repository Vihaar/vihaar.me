import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'

type Move = 'idle' | 'high' | 'low' | 'punch'

function PunchOutGame() {
  const [playerHealth, setPlayerHealth] = useState(100)
  const [opponentHealth, setOpponentHealth] = useState(100)
  const [opponentMove, setOpponentMove] = useState<Move>('idle')
  const [playerMove, setPlayerMove] = useState<Move>('idle')
  const [message, setMessage] = useState('dodge or punch!')
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [round, setRound] = useState(1)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const reset = useCallback(() => {
    setPlayerHealth(100)
    setOpponentHealth(100)
    setOpponentMove('idle')
    setPlayerMove('idle')
    setMessage('dodge or punch!')
    setGameOver(false)
    setGameStarted(true)
    setRound(1)
  }, [])

  useEffect(() => {
    if (!gameStarted || gameOver) return
    timerRef.current = setInterval(() => {
      const moves: Move[] = ['high', 'low', 'idle']
      const move = moves[Math.floor(Math.random() * moves.length)]
      setOpponentMove(move)
      if (move !== 'idle') {
        setTimeout(() => {
          setPlayerMove(prev => {
            if (prev === 'idle' || (move === 'high' && prev !== 'high') || (move === 'low' && prev !== 'low')) {
              setPlayerHealth(h => {
                const newH = Math.max(0, h - 15)
                if (newH <= 0) { setGameOver(true); setMessage('knocked out!') }
                return newH
              })
              setMessage(move === 'high' ? 'hit high!' : 'hit low!')
            } else {
              setMessage('dodged!')
            }
            return prev
          })
          setOpponentMove('idle')
        }, 800)
      }
    }, 1500 - round * 50)
    return () => clearInterval(timerRef.current)
  }, [gameStarted, gameOver, round])

  const handleDodge = (dir: 'high' | 'low') => {
    if (gameOver) return
    setPlayerMove(dir)
    setTimeout(() => setPlayerMove('idle'), 600)
  }

  const handlePunch = () => {
    if (gameOver) return
    setPlayerMove('punch')
    if (opponentMove === 'idle') {
      setOpponentHealth(h => {
        const newH = Math.max(0, h - 20)
        if (newH <= 0) {
          if (round < 3) {
            setRound(r => r + 1)
            setOpponentHealth(100)
            setMessage(`round ${round + 1}!`)
          } else {
            setGameOver(true)
            setMessage('you win!')
          }
        } else {
          setMessage('nice hit!')
        }
        return newH
      })
    } else {
      setMessage('blocked!')
    }
    setTimeout(() => setPlayerMove('idle'), 400)
  }

  return (
    <div className="max-w-sm mx-auto mt-8">
      <div className="relative rounded-xl bg-black/50 border border-red-900/30 p-6 min-h-[300px] flex flex-col items-center justify-between">
        <div className="w-full flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-red-400 font-hand">opponent</p>
            <div className="w-32 h-3 bg-red-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${opponentHealth}%` }} />
            </div>
          </div>
          <span className="text-red-400 font-display text-sm">round {round}</span>
        </div>

        <div className="flex-1 flex items-center justify-center gap-12 my-4">
          <div className={`text-5xl transition-transform ${opponentMove === 'high' ? '-translate-y-2' : opponentMove === 'low' ? 'translate-y-2' : ''}`}>
            {opponentMove === 'high' ? 'JAB' : opponentMove === 'low' ? 'LOW' : 'READY'}
          </div>
          <div className="text-red-500 font-display text-lg">VS</div>
          <div className={`text-5xl transition-transform ${playerMove === 'punch' ? '-translate-x-2' : playerMove === 'high' ? '-translate-y-4' : playerMove === 'low' ? 'translate-y-4' : ''}`}>
            {playerMove === 'punch' ? 'HIT!' : 'YOU'}
          </div>
        </div>

        <p className="text-red-300/80 font-hand text-lg mb-4">{message}</p>

        <div className="w-full">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs text-red-400 font-hand">you (135 lb)</p>
            <div className="w-32 h-3 bg-red-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${playerHealth}%` }} />
            </div>
          </div>
        </div>

        {!gameStarted && (
          <button onClick={reset} className="px-6 py-2 bg-red-600 text-white rounded-full font-display hover:bg-red-700 transition-colors">
            fight!
          </button>
        )}
        {gameStarted && !gameOver && (
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => handleDodge('high')} className="px-4 py-2 bg-red-900/30 border border-red-600/30 text-red-300 rounded-lg font-display text-sm hover:bg-red-900/50 transition-colors">
              dodge high ↑
            </button>
            <button onClick={handlePunch} className="px-4 py-2 bg-red-600 text-white rounded-lg font-display text-sm hover:bg-red-700 transition-colors">
              punch!
            </button>
            <button onClick={() => handleDodge('low')} className="px-4 py-2 bg-red-900/30 border border-red-600/30 text-red-300 rounded-lg font-display text-sm hover:bg-red-900/50 transition-colors">
              dodge low ↓
            </button>
          </div>
        )}
        {gameOver && (
          <button onClick={reset} className="px-6 py-2 bg-red-600 text-white rounded-full font-display hover:bg-red-700 transition-colors">
            rematch
          </button>
        )}
      </div>
    </div>
  )
}

export default function BoxingPage() {
  return (
    <PageShell bg="#0a0a0a">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.05),transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-5xl font-bold text-red-400 text-center">Boxing</h1>
          <p className="font-hand text-xl text-red-300/50 text-center mt-2">135 lbs of heart</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 rounded-lg overflow-hidden shadow-sm border-2 border-stone-300/70"
        >
          <img src="/images/boxing-hero.png" alt="Boxing ring" className="w-full h-64 object-cover" draggable={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-6 max-w-xl mx-auto text-center font-body text-red-100/80 text-lg leading-relaxed"
        >
          <p>
            Freshman year. University boxing team. A senior I knew from AP Calculus
            in high school pulled me in — he was like an older brother.
          </p>
          <p>
            135 pound weight class. One Saturday amateur fight, one club fight
            against Grand Valley State. I broke my nose in my first fight. After that,
            I stopped. But it taught me a lot about myself.
          </p>
          <p className="text-red-300/60 italic font-hand text-xl">
            "It's a brutal sport, but nothing shows you who you are faster."
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <h2 className="font-display text-2xl text-red-400/80 text-center mt-16 mb-4">Punch Out</h2>
          <PunchOutGame />
        </motion.div>
      </div>
    </PageShell>
  )
}
