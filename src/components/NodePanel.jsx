// NodePanel — slide-in info panel that appears when a node is selected
// Replaces the old full-screen modal with a non-blocking side panel
import { useState, useEffect } from 'react'
import { MAP_NODES } from '../data/nodeData'

const TYPE_META = {
  learn:     { label: 'LEARN',     color: '#2dd4bf', bg: 'rgba(45,212,191,0.15)',   icon: '📖' },
  quiz:      { label: 'QUIZ',      color: '#f5a623', bg: 'rgba(245,166,35,0.15)',   icon: '❓' },
  homework:  { label: 'HOMEWORK',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)',   icon: '📋' },
  objective: { label: 'OBJECTIVE', color: '#e5643c', bg: 'rgba(229,100,60,0.15)',   icon: '🎯' },
}

const STATUS_META = {
  completed: { label: '✓ COMPLETED',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  active:    { label: '▶ IN PROGRESS', color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
  available: { label: '◆ AVAILABLE',   color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)' },
  locked:    { label: '🔒 LOCKED',     color: '#6b7280', bg: 'rgba(55,65,81,0.12)'   },
}

function QuizView({ node, onClose }) {
  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [answered,  setAnswered]  = useState(false)
  const [score,     setScore]     = useState(0)
  const [finished,  setFinished]  = useState(false)

  const qs = node.questions ?? []

  if (qs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <span style={{ fontSize: '2.5rem' }}>🏗️</span>
        <p className="font-pixel text-center" style={{ fontSize: '0.55rem', color: '#f5a623', lineHeight: '1.8' }}>
          CONTENT<br />COMING SOON
        </p>
        <button id="btn-quiz-close" className="btn-ghost w-full" onClick={onClose}>
          BACK TO MAP
        </button>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / qs.length) * 100)
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <span style={{ fontSize: '2.5rem' }}>{pct >= 70 ? '🏆' : '📚'}</span>
        <p className="font-pixel" style={{ fontSize: '0.7rem', color: pct >= 70 ? '#22c55e' : '#f5a623' }}>
          {pct >= 70 ? 'QUEST COMPLETE!' : 'KEEP STUDYING!'}
        </p>
        <p className="font-inter text-center" style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          {score}/{qs.length} correct ({pct}%)
        </p>
        <button id="btn-quiz-done" className="btn-amber w-full" onClick={onClose}>
          BACK TO MAP
        </button>
      </div>
    )
  }

  const q = qs[current]
  const choices = [q.a, 'Wrong answer A', 'Wrong answer B', 'Wrong answer C']
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(4, qs.length > 1 ? 4 : 2))

  function handleAnswer(choice) {
    if (answered) return
    setSelected(choice)
    setAnswered(true)
    if (choice === q.a) setScore(s => s + 1)
  }

  function handleNext() {
    if (current + 1 < qs.length) {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="font-pixel" style={{ fontSize: '0.45rem', color: '#6b7280' }}>
          Q {current + 1}/{qs.length}
        </span>
        <div style={{ width: '80px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }}>
          <div style={{
            width: `${((current + 1) / qs.length) * 100}%`,
            height: '100%', borderRadius: '2px',
            background: '#2dd4bf',
          }} />
        </div>
      </div>

      {/* Question */}
      <p className="font-inter" style={{ fontSize: '0.85rem', color: '#e0e0f0', lineHeight: '1.5' }}>
        {q.q}
      </p>

      {/* Choices */}
      <div className="flex flex-col gap-2">
        {choices.map((ch, i) => {
          const isCorrect = ch === q.a
          let bg    = 'rgba(255,255,255,0.05)'
          let border = 'rgba(255,255,255,0.12)'
          let color  = '#c8c9d8'
          if (answered) {
            if (isCorrect)         { bg = 'rgba(34,197,94,0.18)';  border = '#22c55e'; color = '#bbf7d0' }
            else if (ch === selected) { bg = 'rgba(239,68,68,0.18)'; border = '#ef4444'; color = '#fca5a5' }
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(ch)}
              className="font-inter text-left rounded-md px-3 py-2.5 transition-all"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                color,
                fontSize: '0.8rem',
                cursor: answered ? 'default' : 'pointer',
              }}
            >
              {ch}
            </button>
          )
        })}
      </div>

      {answered && (
        <button id="btn-quiz-next" className="btn-amber w-full" onClick={handleNext}>
          {current + 1 < qs.length ? 'NEXT →' : 'FINISH'}
        </button>
      )}
    </div>
  )
}

export default function NodePanel({ node, onClose }) {
  const [view, setView] = useState('info') // 'info' | 'quiz'

  // Reset to info view when node changes
  useEffect(() => {
    setView('info')
  }, [node?.id])

  const visible = !!node

  const typeMeta   = TYPE_META[node?.type]   ?? TYPE_META.objective
  const statusMeta = STATUS_META[node?.status] ?? STATUS_META.locked

  const canStart = node?.status === 'active' || node?.status === 'available'
  const isDone   = node?.status === 'completed'
  const isLocked = node?.status === 'locked'

  const prereqLabels = (node?.prereqs ?? []).map(id => {
    return MAP_NODES.find(n => n.id === id)?.label ?? id
  })

  return (
    <>
      {/* ── Panel ── */}
      <aside
        role="complementary"
        aria-label="Node information panel"
        className="absolute top-0 right-0 h-full z-20 flex flex-col"
        style={{
          width: 'clamp(280px, 30vw, 360px)',
          background: 'rgba(11,12,30,0.94)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: visible ? 'auto' : 'none',
          overflowY: 'auto',
        }}
      >
        {node && (
          <div className="flex flex-col gap-0 h-full">
            {/* ── Header ── */}
            <div className="flex items-start justify-between p-4 pb-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* Type badge */}
                  <span className="font-pixel px-2 py-0.5 rounded"
                    style={{ fontSize: '0.45rem', color: typeMeta.color, background: typeMeta.bg }}>
                    {typeMeta.icon} {typeMeta.label}
                  </span>
                  {/* Status badge */}
                  <span className="font-pixel px-2 py-0.5 rounded"
                    style={{ fontSize: '0.42rem', color: statusMeta.color, background: statusMeta.bg }}>
                    {statusMeta.label}
                  </span>
                </div>
                <h2 className="font-pixel" style={{ fontSize: '0.75rem', color: '#f0f1ff', lineHeight: '1.6', margin: 0 }}>
                  {node.label}
                </h2>
              </div>
              <button
                id="btn-close-node-panel"
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-md flex-shrink-0 ml-2 transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#6b7280',
                  fontSize: '0.7rem',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">

              {view === 'info' ? (
                <>
                  {/* Description */}
                  <p className="font-inter" style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: '1.6' }}>
                    {node.desc}
                  </p>

                  {/* XP reward card */}
                  <div className="flex items-center gap-3 rounded-lg px-4 py-3"
                    style={{
                      background: 'rgba(245,166,35,0.08)',
                      border: '1px solid rgba(245,166,35,0.25)',
                    }}>
                    <span style={{ fontSize: '1.5rem' }}>⚡</span>
                    <div>
                      <p className="font-pixel" style={{ fontSize: '0.42rem', color: '#6b7280', marginBottom: '3px' }}>
                        XP REWARD
                      </p>
                      <p className="font-pixel" style={{ fontSize: '0.9rem', color: '#f5a623' }}>
                        {node.xp} XP
                      </p>
                    </div>
                  </div>

                  {/* Prerequisite info for locked nodes */}
                  {isLocked && prereqLabels.length > 0 && (
                    <div className="rounded-lg px-4 py-3"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <p className="font-pixel mb-2" style={{ fontSize: '0.42rem', color: '#f87171' }}>
                        🔒 PREREQUISITES NEEDED
                      </p>
                      {prereqLabels.map(label => (
                        <p key={label} className="font-inter" style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                          • Complete <strong style={{ color: '#e0e0f0' }}>{label}</strong> first
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Progress indicator for completed/in-progress */}
                  {(isDone || node.status === 'active') && (
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-pixel" style={{ fontSize: '0.42rem', color: '#6b7280' }}>PROGRESS</span>
                        <span className="font-pixel" style={{ fontSize: '0.42rem', color: isDone ? '#22c55e' : '#f5a623' }}>
                          {isDone ? '100%' : '60%'}
                        </span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{
                          width: isDone ? '100%' : '60%',
                          height: '100%',
                          borderRadius: '3px',
                          background: isDone
                            ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                            : 'linear-gradient(90deg, #f5a623, #fbbf24)',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Quiz / learning view */
                <QuizView node={node} onClose={() => { setView('info'); onClose() }} />
              )}
            </div>

            {/* ── Actions ── */}
            {view === 'info' && (
              <div className="p-4 flex flex-col gap-2.5"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {canStart && (
                  <button
                    id="btn-start-quest"
                    className="btn-amber w-full"
                    onClick={() => setView('quiz')}
                  >
                    START QUEST
                  </button>
                )}
                {isDone && (
                  <button
                    id="btn-review-quest"
                    className="btn-ghost w-full"
                    onClick={() => setView('quiz')}
                  >
                    REVIEW
                  </button>
                )}
                {isLocked && (
                  <div className="font-pixel text-center"
                    style={{ fontSize: '0.45rem', color: '#6b7280', lineHeight: '1.8' }}>
                    COMPLETE PREREQUISITES<br />TO UNLOCK THIS NODE
                  </div>
                )}
                <button
                  id="btn-close-panel-footer"
                  className="btn-ghost w-full"
                  onClick={onClose}
                >
                  BACK TO MAP
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Subtle backdrop tint (doesn't block map interaction, just dims slightly) */}
      {visible && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'rgba(0,0,0,0.12)' }}
          aria-hidden="true"
        />
      )}
    </>
  )
}
