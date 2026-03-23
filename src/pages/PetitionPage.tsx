import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'

function CollectSignaturesGame() {
  const [signatures, setSignatures] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [people, setPeople] = useState<{ id: number; x: number; y: number; signed: boolean; isParent: boolean }[]>([])
  const goal = 20

  const spawnPeople = () => {
    const newPeople = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      signed: false,
      isParent: Math.random() > 0.5,
    }))
    setPeople(newPeople)
  }

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setSignatures(0)
    setTimeLeft(30)
    spawnPeople()
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameOver(true)
          clearInterval(timer)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (signatures >= goal && gameStarted) {
      setGameOver(true)
    }
  }, [signatures, gameStarted])

  const handleSign = (id: number, isParent: boolean) => {
    if (gameOver) return
    setPeople(prev => prev.map(p => p.id === id ? { ...p, signed: true } : p))
    setSignatures(s => s + (isParent ? 2 : 1))
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="relative rounded-xl bg-amber-900/10 border border-amber-700/20 p-4 h-80 overflow-hidden">
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display text-lg text-amber-300 mb-2">Collect Signatures</p>
            <p className="text-amber-200/50 text-sm font-body mb-1">click people to get them to sign</p>
            <p className="text-amber-200/50 text-xs font-hand mb-4">parents count for 2!</p>
            <button onClick={startGame} className="px-6 py-2 bg-amber-600 text-white rounded-full font-display hover:bg-amber-700 transition-colors">
              start collecting
            </button>
          </div>
        )}
        {gameStarted && (
          <>
            <div className="flex justify-between mb-3">
              <span className="text-amber-300 font-display text-sm">{signatures}/{goal} signatures</span>
              <span className="text-amber-300 font-display text-sm">{timeLeft}s</span>
            </div>
            <div className="relative h-56">
              {people.map(p => (
                <motion.button
                  key={p.id}
                  onClick={() => !p.signed && handleSign(p.id, p.isParent)}
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all
                    ${p.signed ? 'opacity-30 scale-75 bg-green-600/40 border-green-500/40' : 'hover:scale-110'}
                    ${p.isParent ? 'bg-amber-600/40 border-2 border-amber-500/40 text-amber-200' : 'bg-amber-800/30 border border-amber-600/20 text-amber-300'}
                  `}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  whileTap={{ scale: 0.9 }}
                  disabled={p.signed}
                >
                  {p.signed ? '\u2713' : p.isParent ? 'P' : 'S'}
                </motion.button>
              ))}
            </div>
          </>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-900/75">
            <p className="font-display text-xl text-amber-200">
              {signatures >= goal ? 'petition passed!' : 'not enough signatures...'}
            </p>
            <p className="text-amber-300/60 text-sm font-body mt-1">{signatures} signatures collected</p>
            <button onClick={startGame} className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-full font-display hover:bg-amber-700 transition-colors">
              try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PetitionPage() {
  return (
    <PageShell bg="#1a1408">
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(217,119,6,0.3) 31px, rgba(217,119,6,0.3) 32px)`,
      }} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-5xl font-bold text-amber-300 text-center">The Petition</h1>
          <p className="font-hand text-xl text-amber-200/50 text-center mt-2">paper plates over styrofoam</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 rounded-lg overflow-hidden shadow-sm border-2 border-stone-300/70"
        >
          <img src="/images/petition-hero.png" alt="The Petition" className="w-full h-64 object-cover" draggable={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-6 max-w-xl mx-auto text-center font-body text-amber-100/80 text-lg leading-relaxed"
        >
          <p>
            Walled Lake Western High School. Walled Lake Consolidated School District.
            I wanted to swap styrofoam trays for paper plates.
          </p>
          <p>
            The first attempt failed badly. I collected student signatures, but that
            didn't matter — you needed parent signatures. Taxpayers. Way more useful.
            And there was no money to pay for the switch.
          </p>
          <p>
            So I pivoted. Found sponsors to put ads on the back of the trays. Got
            funding. Got my friends to help print sheets and collect parent signatures.
            The second time, it passed.
          </p>
          <p>
            The most memorable moment? First day of junior year. Walking into the
            cafeteria and seeing the paper plates. 90% of the school had no idea
            anything changed. But I knew.
          </p>
          <p className="text-amber-300/60 italic font-hand text-xl">
            "As long as you have a noble mission, people will get behind and push."
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <h2 className="font-display text-2xl text-amber-300/80 text-center mt-16 mb-4">Collect Signatures</h2>
          <CollectSignaturesGame />
        </motion.div>
      </div>
    </PageShell>
  )
}
