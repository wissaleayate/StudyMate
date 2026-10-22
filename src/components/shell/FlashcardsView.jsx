// FlashcardsView: RPG study cards for active recall and concept reinforcement
import { useState } from 'react'
import { FLASHCARD_DECKS } from '../../data/flashcardsData'
import { Rotate3D, CheckCircle2, RotateCcw, Zap } from 'lucide-react'

export function FlashcardsView() {
  const deck = FLASHCARD_DECKS[0]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredCards, setMasteredCards] = useState(() => new Set(['fc_1', 'fc_2', 'fc_4', 'fc_5']))
  const [sessionXp, setSessionXp] = useState(0)

  const currentCard = deck.cards[currentIndex]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = (mastered) => {
    if (mastered && !masteredCards.has(currentCard.id)) {
      setMasteredCards((prev) => new Set([...prev, currentCard.id]))
      setSessionXp((x) => x + 15)
    }
    setIsFlipped(false)
    setCurrentIndex((i) => (i + 1) % deck.cards.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex((i) => (i - 1 + deck.cards.length) % deck.cards.length)
  }

  return (
    <div
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center gap-6 text-slate-100 animate-in fade-in duration-200"
      role="region"
      aria-label="Flashcards Study Deck"
    >
      {/* ── Deck Header ── */}
      <div className="w-full flex items-center justify-between bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div>
          <span className="font-pixel text-[8.5px] text-teal px-2 py-0.5 rounded bg-teal/15 border border-teal/30 uppercase">
            ACTIVE RECALL DRILL
          </span>
          <h2 className="text-lg font-bold text-white mt-1">{deck.title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{deck.description}</p>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="font-pixel text-xs text-amber flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-amber text-amber" />
            +{sessionXp} XP EARNED
          </span>
          <span className="text-xs text-slate-400 mt-1">
            Card {currentIndex + 1} of {deck.cards.length}
          </span>
        </div>
      </div>

      {/* ── 3D Flip Card ── */}
      <div
        className="w-full min-h-[300px] sm:min-h-[340px] cursor-pointer perspective-1000 select-none group"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleFlip()}
        aria-label="Flashcard. Press space or click to flip."
      >
        <div
          className={`relative w-full h-full min-h-[300px] sm:min-h-[340px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 shadow-2xl ${
            isFlipped
              ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/60 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
              : 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-amber/40 shadow-[0_0_25px_rgba(245,166,35,0.15)] group-hover:border-amber/70'
          }`}
        >
          {/* Card Top Pill */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-pixel text-[9px] text-slate-400 uppercase tracking-wider">
              TOPIC: <strong className="text-white">{currentCard.topic}</strong>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-pixel">
              <Rotate3D className="w-4 h-4 text-slate-400 group-hover:text-amber transition-colors" />
              <span>{isFlipped ? 'ANSWER' : 'QUESTION (CLICK TO FLIP)'}</span>
            </div>
          </div>

          {/* Card Main Content */}
          <div className="my-auto py-6 flex flex-col items-center text-center justify-center">
            <span className="text-3xl mb-3">{isFlipped ? '💡' : '❓'}</span>
            <p className="text-base sm:text-xl font-bold text-white leading-relaxed max-w-lg">
              {isFlipped ? currentCard.back : currentCard.front}
            </p>
          </div>

          {/* Card Bottom Mastery Pill */}
          <div className="flex items-center justify-between text-[11px] border-t border-slate-800 pt-3 text-slate-400">
            <span className="flex items-center gap-1 font-pixel text-[9px]">
              {masteredCards.has(currentCard.id) ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> MASTERED
                </span>
              ) : (
                <span className="text-amber flex items-center gap-1">
                  ★ IN TRAINING
                </span>
              )}
            </span>
            <span className="text-xs text-slate-500">Tap anywhere to flip card</span>
          </div>
        </div>
      </div>

      {/* ── Control Actions ── */}
      <div className="flex items-center justify-center gap-3 w-full">
        <button
          onClick={handlePrev}
          className="btn-ghost py-3 px-4 text-xs font-pixel"
        >
          ◀ PREV
        </button>

        <button
          onClick={() => handleNext(false)}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>NEEDS REVIEW</span>
        </button>

        <button
          onClick={() => handleNext(true)}
          className="btn-amber py-3 px-6 text-xs flex items-center gap-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>GOT IT (+15 XP)</span>
        </button>

        <button
          onClick={() => handleNext(false)}
          className="btn-ghost py-3 px-4 text-xs font-pixel"
        >
          NEXT ▶
        </button>
      </div>
    </div>
  )
}
