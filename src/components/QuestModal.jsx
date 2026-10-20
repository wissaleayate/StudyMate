// Quest Modal — shown when a node is clicked on the map
import { useState } from 'react'

const TYPE_LABELS = {
  learn:     { label: 'LEARN',     color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)' },
  quiz:      { label: 'QUIZ',      color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
  homework:  { label: 'HOMEWORK',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  objective: { label: 'OBJECTIVE', color: '#e5643c', bg: 'rgba(229,100,60,0.12)' },
}

const STATUS_LABELS = {
  completed: { text: '✓ COMPLETED', color: '#22c55e' },
  active:    { text: '▶ IN PROGRESS', color: '#f5a623' },
  available: { text: '◆ AVAILABLE',  color: '#2dd4bf' },
  locked:    { text: '🔒 LOCKED',    color: '#6b7280' },
}

export default function QuestModal({ node, onClose, user }) {
  const [started, setStarted] = useState(false)
  const typeInfo   = TYPE_LABELS[node.type]   ?? TYPE_LABELS.objective
  const statusInfo = STATUS_LABELS[node.status] ?? STATUS_LABELS.locked

  function handleStart() {
    setStarted(true)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        {/* Panel */}
        <div
          className="rpg-panel scanlines w-full max-w-md p-6 flex flex-col gap-5 fade-in"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span
                className="font-pixel text-[0.5rem] px-2 py-1 rounded"
                style={{ color: typeInfo.color, background: typeInfo.bg }}
              >
                {typeInfo.label}
              </span>
              <h2 className="font-pixel text-sm text-[var(--text-bright)] leading-relaxed">
                {node.label}
              </h2>
            </div>
            <button
              id="btn-close-modal"
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-red-400 transition-colors font-pixel text-xs"
            >
              ✕
            </button>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span
              className="font-pixel text-[0.45rem]"
              style={{ color: statusInfo.color }}
            >
              {statusInfo.text}
            </span>
          </div>

          {/* Description */}
          <p className="font-inter text-sm text-[var(--text-base)] leading-relaxed">
            {node.desc}
          </p>

          {/* XP reward */}
          <div className="flex items-center gap-3 bg-[var(--bg-input)] border border-[var(--border-dim)] rounded px-4 py-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-pixel text-[0.5rem] text-[var(--text-muted)]">XP REWARD</p>
              <p className="font-pixel text-base text-amber">{node.xp} XP</p>
            </div>
          </div>

          {/* Action */}
          {!started ? (
            <div className="flex flex-col gap-2">
              {node.status === 'completed' && (
                <button id="btn-review-quest" className="btn-ghost w-full" onClick={handleStart}>
                  REVIEW
                </button>
              )}
              {(node.status === 'active' || node.status === 'available') && (
                <button id="btn-start-quest" className="btn-amber w-full" onClick={handleStart}>
                  START QUEST
                </button>
              )}
              {node.status === 'locked' && (
                <div className="font-pixel text-[0.5rem] text-[var(--text-muted)] text-center">
                  COMPLETE PREVIOUS OBJECTIVES TO UNLOCK
                </div>
              )}
              <button id="btn-cancel-modal" className="btn-ghost w-full" onClick={onClose}>
                CLOSE
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="text-4xl">🎯</div>
              <p className="font-pixel text-[0.6rem] text-teal text-center leading-relaxed">
                QUEST STARTED!
              </p>
              <p className="font-inter text-xs text-[var(--text-muted)] text-center">
                Full quest UI coming in Stage 2. For now, enjoy the map!
              </p>
              <button id="btn-back-to-map-modal" className="btn-ghost w-full" onClick={onClose}>
                BACK TO MAP
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
