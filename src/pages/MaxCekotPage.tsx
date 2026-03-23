import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'

const MAX_PIECES = 10
const ROUND_SECONDS = 45

type Garnish = { id: string; label: string; color: string; idealR: number }

const GARNISHES: Garnish[] = [
  { id: 'beef', label: 'Beef', color: '#8B3A3A', idealR: 0.42 },
  { id: 'onion', label: 'Onion', color: '#c9b896', idealR: 0.55 },
  { id: 'carrot', label: 'Carrot', color: '#e67e22', idealR: 0.38 },
  { id: 'herb', label: 'Herb', color: '#1e6b3a', idealR: 0.72 },
  { id: 'citrus', label: 'Citrus', color: '#f1c40f', idealR: 0.68 },
  { id: 'butter', label: 'Butter', color: '#f5e6c8', idealR: 0.5 },
]

type PlacedPiece = { key: string; garnishId: string; nx: number; ny: number }

type ScoreBreakdown = { variety: number; spread: number; finesse: number }

function garnishById(id: string) {
  return GARNISHES.find((g) => g.id === id)!
}

function computeScore(pieces: PlacedPiece[]): { total: number; breakdown: ScoreBreakdown; verdict: string } {
  if (pieces.length === 0) {
    return {
      total: 0,
      breakdown: { variety: 0, spread: 0, finesse: 0 },
      verdict: 'The plate is empty — even a stage needs something on the pass.',
    }
  }

  const unique = new Set(pieces.map((p) => p.garnishId))
  const variety = Math.min(25, unique.size * 5 + Math.min(5, pieces.length))

  const minDist = 0.14
  let overlapPenalty = 0
  for (let i = 0; i < pieces.length; i++) {
    for (let j = i + 1; j < pieces.length; j++) {
      const d = Math.hypot(pieces[i].nx - pieces[j].nx, pieces[i].ny - pieces[j].ny)
      if (d < minDist) overlapPenalty += (minDist - d) * 55
    }
  }
  const spread = Math.max(0, Math.round(38 - overlapPenalty))

  let finesseSum = 0
  for (const p of pieces) {
    const g = garnishById(p.garnishId)
    const r = Math.min(1, Math.hypot(p.nx, p.ny))
    const err = Math.abs(r - g.idealR)
    finesseSum += Math.max(0, 1 - err / 0.55)
  }
  const finesse = Math.round((finesseSum / pieces.length) * 37)

  const total = Math.min(100, variety + spread + finesse)

  let verdict: string
  if (total >= 92) verdict = 'Michelin energy — send it to the dining room.'
  else if (total >= 80) verdict = 'Strong pass. The chef might actually smile.'
  else if (total >= 65) verdict = 'Solid home cook — tighten the spacing.'
  else if (total >= 45) verdict = 'Edible, but the GM is raising an eyebrow.'
  else verdict = 'Back to family meal — rearrange and try again.'

  return { total, breakdown: { variety, spread, finesse }, verdict }
}

function starsFromScore(total: number): number {
  if (total >= 90) return 5
  if (total >= 75) return 4
  if (total >= 55) return 3
  if (total >= 35) return 2
  return 1
}

function PlatingGame() {
  const plateRef = useRef<HTMLDivElement>(null)
  const [pieces, setPieces] = useState<PlacedPiece[]>([])
  const [phase, setPhase] = useState<'idle' | 'playing' | 'results'>('idle')
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [pickupId, setPickupId] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof computeScore> | null>(null)

  const start = () => {
    setPieces([])
    setPhase('playing')
    setTimeLeft(ROUND_SECONDS)
    setPickupId(null)
    setResult(null)
  }

  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) return 0
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing' || timeLeft > 0) return
    setPhase('results')
  }, [phase, timeLeft])

  useEffect(() => {
    if (phase !== 'results') return
    setResult(computeScore(pieces))
  }, [phase, pieces])

  const finishRound = useCallback(() => {
    setTimeLeft(0)
    setPhase('results')
  }, [])

  const normFromClient = (clientX: number, clientY: number): { nx: number; ny: number } | null => {
    const el = plateRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const half = Math.min(rect.width, rect.height) / 2
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const nx = (clientX - cx) / half
    const ny = (clientY - cy) / half
    if (Math.hypot(nx, ny) > 1) return null
    return { nx, ny }
  }

  const placeGarnish = (garnishId: string, clientX: number, clientY: number) => {
    if (phase !== 'playing' || pieces.length >= MAX_PIECES) return
    const pos = normFromClient(clientX, clientY)
    if (!pos) return
    setPieces((prev) => [
      ...prev,
      { key: `${garnishId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, garnishId, ...pos },
    ])
  }

  const onPlateDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const onPlateDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('garnishId')
    if (!id) return
    placeGarnish(id, e.clientX, e.clientY)
  }

  const onPlateClick = (e: React.MouseEvent) => {
    if (phase !== 'playing' || !pickupId) return
    placeGarnish(pickupId, e.clientX, e.clientY)
    setPickupId(null)
  }

  const removePiece = (key: string) => {
    if (phase !== 'playing') return
    setPieces((p) => p.filter((x) => x.key !== key))
  }

  const stars = result ? starsFromScore(result.total) : 0

  return (
    <div className="max-w-md mx-auto mt-8">
      <div
        className="relative rounded-xl overflow-hidden border border-amber-700/25 min-h-[420px]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26, 20, 8, 0.92), rgba(26, 20, 8, 0.92)),
            linear-gradient(90deg, rgba(80, 50, 20, 0.12) 1px, transparent 1px),
            linear-gradient(rgba(80, 50, 20, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 14px 14px, 14px 14px',
        }}
      >
        <div className="p-5">
          {phase === 'idle' && (
            <div className="flex flex-col items-center justify-center min-h-[360px]">
              <p className="font-display text-lg text-amber-200 mb-2">Fancy Plating</p>
              <p className="text-amber-200/55 text-sm font-body text-center mb-6 px-4">
                Drag garnishes onto the plate, or tap a garnish then tap the plate. Spread things out — the judge scores
                variety, spacing, and how well each element sits in its &quot;sweet spot&quot; on the rim or center.
              </p>
              <button
                type="button"
                onClick={start}
                className="px-6 py-2 bg-amber-600 text-white rounded-full font-display hover:bg-amber-700 transition-colors"
              >
                start plating
              </button>
            </div>
          )}

          {phase === 'playing' && (
            <>
              <div className="flex justify-between items-start mb-3">
                <p className="text-amber-100/70 text-xs font-body max-w-[55%] text-left">
                  {pickupId ? (
                    <span className="text-amber-300">Tap the plate to place {garnishById(pickupId).label}.</span>
                  ) : (
                    'Drag from the tray, or tap a garnish then the plate.'
                  )}
                </p>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36" aria-hidden>
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#3d2814" strokeWidth="3" />
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke={timeLeft > 12 ? '#ffd700' : timeLeft > 6 ? '#e67e22' : '#e74c3c'}
                        strokeWidth="3"
                        strokeDasharray={`${(timeLeft / ROUND_SECONDS) * 94.2} 94.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-amber-200 font-display text-sm relative z-10">{timeLeft}s</span>
                  </div>
                  <span className="text-amber-300/80 font-display text-xs">{pieces.length}/{MAX_PIECES} pieces</span>
                </div>
              </div>

              <div className="flex justify-center my-4">
                <div
                  ref={plateRef}
                  role="application"
                  aria-label="Plate — drop garnishes here"
                  onDragOver={onPlateDragOver}
                  onDrop={onPlateDrop}
                  onClick={onPlateClick}
                  className="relative w-[min(100%,280px)] aspect-square rounded-full cursor-crosshair ring-2 ring-amber-900/40 shadow-inner"
                  style={{
                    background: 'radial-gradient(circle at 35% 30%, #faf6ef 0%, #e8e0d0 45%, #d4cbb8 100%)',
                    boxShadow: 'inset 0 8px 24px rgba(255,255,255,0.35), 0 4px 20px rgba(0,0,0,0.35)',
                  }}
                >
                  <div
                    className="absolute inset-[10%] rounded-full border border-amber-900/10 pointer-events-none"
                    style={{
                      background:
                        'repeating-conic-gradient(from 0deg, transparent 0deg 8deg, rgba(139,90,43,0.03) 8deg 9deg)',
                    }}
                  />
                  {pieces.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="w-[45%] h-3 rounded-full opacity-25"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #c0392b55, transparent)',
                          transform: 'rotate(-8deg)',
                        }}
                      />
                    </div>
                  )}
                  {pieces.map((p) => {
                    const g = garnishById(p.garnishId)
                    const left = 50 + p.nx * 42
                    const top = 50 + p.ny * 42
                    return (
                      <button
                        key={p.key}
                        type="button"
                        title="Remove from plate"
                        onClick={(ev) => {
                          ev.stopPropagation()
                          removePiece(p.key)
                        }}
                        className="absolute w-9 h-9 -ml-[18px] -mt-[18px] rounded-full border-2 border-amber-900/25 shadow-md text-[10px] font-bold font-body text-amber-950/90 flex items-center justify-center hover:scale-110 transition-transform"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          backgroundColor: g.color,
                        }}
                      >
                        {g.label.slice(0, 2)}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {GARNISHES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('garnishId', g.id)
                      e.dataTransfer.effectAllowed = 'copy'
                    }}
                    onClick={() => setPickupId((cur) => (cur === g.id ? null : g.id))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold font-body border-2 transition-all min-w-[4.5rem] ${
                      pickupId === g.id
                        ? 'border-amber-300 shadow-[0_0_12px_rgba(255,215,0,0.45)] scale-105'
                        : 'border-amber-800/40 hover:border-amber-600/50'
                    }`}
                    style={{ backgroundColor: `${g.color}cc`, color: '#1a1208' }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={finishRound}
                  className="px-5 py-2 rounded-full bg-amber-500/90 text-amber-950 font-display text-sm hover:bg-amber-400 transition-colors"
                >
                  call the judge
                </button>
                {pickupId && (
                  <button
                    type="button"
                    onClick={() => setPickupId(null)}
                    className="px-4 py-2 rounded-full border border-amber-700/40 text-amber-200/80 text-sm font-body hover:bg-amber-900/20"
                  >
                    cancel pick up
                  </button>
                )}
              </div>
            </>
          )}

          {phase === 'results' && result && (
            <div className="flex flex-col items-center py-4 px-2 min-h-[360px] justify-center">
              <p className="font-display text-2xl text-amber-200 mb-1">{result.total}/100</p>
              <p className="text-amber-300 text-lg mb-2" aria-hidden>
                {'★'.repeat(stars)}
                <span className="text-amber-800/40">{'★'.repeat(5 - stars)}</span>
              </p>
              <p className="text-amber-100/75 text-sm font-body text-center mb-4 max-w-sm">{result.verdict}</p>
              <div className="text-xs text-amber-200/50 font-mono space-y-0.5 mb-6 text-left">
                <p>variety {result.breakdown.variety}</p>
                <p>spacing {result.breakdown.spread}</p>
                <p>placement {result.breakdown.finesse}</p>
              </div>
              <button
                type="button"
                onClick={start}
                className="px-6 py-2 bg-amber-600 text-white rounded-full font-display hover:bg-amber-700 transition-colors"
              >
                plate again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MaxCekotPage() {
  return (
    <PageShell bg="#1a1408">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-900/10 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-5xl font-bold text-amber-200 text-center">Max Cekot Kitchen</h1>
          <p className="font-hand text-xl text-amber-300/50 text-center mt-2">the only Michelin star in Latvia</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 rounded-lg overflow-hidden shadow-sm border-2 border-stone-300/70"
        >
          <img src="/images/max-cekot-hero.png" alt="Max Cekot Kitchen" className="w-full h-64 object-cover" draggable={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-6 max-w-xl mx-auto text-center font-body text-amber-100/80 text-lg leading-relaxed"
        >
          <p>
            Riga, Latvia. Max Cekot Kitchen. The only Michelin-starred restaurant
            in the country. I walked in as a stage chef and got promoted to
            Commis de Cuisine in less than a month.
          </p>
          <p>
            The kitchen is a different world. Precision, speed, and heat. Every plate
            has to be perfect. There's no room for almost.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <h2 className="font-display text-2xl text-amber-200/80 text-center mt-16 mb-4">Plate It Up</h2>
          <PlatingGame />
        </motion.div>
      </div>
    </PageShell>
  )
}
