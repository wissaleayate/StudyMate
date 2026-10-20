// HUD Sidebar — player stats panel (slides in from the right)
import { useState } from 'react'
import Mascot from './Mascot'
import { MAP_NODES } from '../data/nodeData'

function StatBar({ label, value, max, color }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="font-pixel text-[0.45rem] text-[var(--text-muted)] uppercase">{label}</span>
        <span className="font-pixel text-[0.45rem]" style={{ color }}>{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--bg-input)] border border-[var(--border-dim)] overflow-hidden">
        <div
          className="h-full rounded-full xp-bar-fill"
          style={{ width: `${(value/max)*100}%`, background: color }}
        />
      </div>
    </div>
  )
}

export default function HUDSidebar({ user, onLogout }) {
  const [open, setOpen] = useState(false)

  const completed  = MAP_NODES.filter(n => n.status === 'completed').length
  const totalXP    = MAP_NODES.filter(n => n.status === 'completed').reduce((sum, n) => sum + n.xp, 0)
  const level      = Math.floor(totalXP / 200) + 1
  const nextLvlXP  = level * 200
  const progress   = totalXP % 200

  const avatarColors = {
    warrior: ['#e5643c', '#f5a623'],
    mage:    ['#8b5cf6', '#2dd4bf'],
    archer:  ['#22c55e', '#f5a623'],
    scholar: ['#3b82f6', '#f0f1ff'],
    rogue:   ['#6b7280', '#e5643c'],
    paladin: ['#f5a623', '#fff'],
  }
  const colors = avatarColors[user?.avatar] ?? ['#f5a623', '#e5643c']

  return (
    <>
      {/* Toggle button */}
      <button
        id="btn-toggle-hud"
        onClick={() => setOpen(o => !o)}
        className="fixed top-14 right-4 z-30 w-10 h-10 rounded-full bg-[var(--bg-panel)] border border-[var(--border-dim)] flex items-center justify-center text-amber hover:border-amber transition-colors shadow-lg"
        title="Player stats"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 15c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full z-40 w-72 rpg-panel scanlines flex flex-col gap-4 p-5 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ borderLeft: '1px solid var(--border-dim)' }}
      >
        <div className="flex items-center justify-between">
          <span className="font-pixel text-[0.6rem] text-amber">PLAYER STATS</span>
          <button id="btn-close-hud" onClick={() => setOpen(false)} className="text-[var(--text-muted)] hover:text-red-400 text-xs">✕</button>
        </div>

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-2 py-3 border-y border-[var(--border-dim)]">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-input)] border-2 border-amber flex items-center justify-center"
               style={{ boxShadow: 'var(--shadow-amber)' }}>
            <svg width="48" height="48" viewBox="0 0 44 44">
              <rect x="14" y="4" width="16" height="14" rx="4" fill={colors[0]} />
              <rect x="16" y="8" width="4"  height="4"  rx="1" fill="#fff" opacity="0.85" />
              <rect x="24" y="8" width="4"  height="4"  rx="1" fill="#fff" opacity="0.85" />
              <rect x="16" y="15" width="12" height="2"  rx="1" fill="#fff" opacity="0.6" />
              <rect x="11" y="19" width="22" height="16" rx="3" fill={colors[1]} />
              <rect x="4"  y="20" width="6"  height="12" rx="3" fill={colors[1]} opacity="0.85" />
              <rect x="34" y="20" width="6"  height="12" rx="3" fill={colors[1]} opacity="0.85" />
              <rect x="15" y="35" width="6"  height="8"  rx="2" fill={colors[1]} opacity="0.9" />
              <rect x="23" y="35" width="6"  height="8"  rx="2" fill={colors[1]} opacity="0.9" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-pixel text-[0.65rem] text-[var(--text-bright)]">{user?.username ?? 'Adventurer'}</p>
            <p className="font-pixel text-[0.45rem] text-amber mt-1">LEVEL {level} SCHOLAR</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3">
          <StatBar label="Experience" value={progress} max={200} color="#f5a623" />
          <StatBar label="Quests"     value={completed}  max={MAP_NODES.length} color="#2dd4bf" />
          <StatBar label="Mastery"    value={Math.round(completed/MAP_NODES.length*100)} max={100} color="#8b5cf6" />
        </div>

        {/* Achievement badges */}
        <div className="flex flex-col gap-2">
          <span className="font-pixel text-[0.45rem] text-[var(--text-muted)]">ACHIEVEMENTS</span>
          <div className="flex gap-2 flex-wrap">
            {completed >= 1 && <Badge icon="⭐" label="First Quest" />}
            {completed >= 3 && <Badge icon="🔥" label="On Fire" />}
            {completed >= 5 && <Badge icon="🏆" label="Champion" />}
            {completed === 0 && <span className="font-inter text-xs text-[var(--text-muted)]">Complete quests to earn badges!</span>}
          </div>
        </div>

        <div className="mt-auto">
          <button id="btn-logout" onClick={onLogout} className="btn-ghost w-full text-[0.5rem]">
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Overlay when open */}
      {open && (
        <div className="fixed inset-0 z-35 bg-black/30" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
    </>
  )
}

function Badge({ icon, label }) {
  return (
    <div className="flex items-center gap-1 bg-[var(--bg-input)] border border-[var(--border-dim)] rounded px-2 py-1" title={label}>
      <span className="text-sm">{icon}</span>
      <span className="font-pixel text-[0.38rem] text-[var(--text-muted)]">{label}</span>
    </div>
  )
}
