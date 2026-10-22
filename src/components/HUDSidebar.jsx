// HUD Sidebar — player stats panel (slides in from the right)
import { useState } from 'react'
import { INITIAL_NODES } from '../data/nodesData'
import { CharacterAvatar } from './common/CharacterAvatar'

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
          style={{ width: `${Math.min((value/max)*100, 100)}%`, background: color }}
        />
      </div>
    </div>
  )
}

export default function HUDSidebar({ user, onLogout }) {
  const [open, setOpen] = useState(false)

  // Read live nodes state if available
  const savedNodes = (() => {
    try {
      const saved = localStorage.getItem('studymate_nodes_state')
      return saved ? JSON.parse(saved) : INITIAL_NODES
    } catch {
      return INITIAL_NODES
    }
  })()

  const completed = savedNodes.filter(n => n.status === 'mastered').length
  const totalXP = user?.xp ?? savedNodes.filter(n => n.status === 'mastered').reduce((sum, n) => sum + n.xp, 0)
  const level = Math.floor(totalXP / 200) + 1
  const progress = totalXP % 200

  return (
    <>
      {/* Toggle button */}
      <button
        id="btn-toggle-hud"
        onClick={() => setOpen(o => !o)}
        className="fixed top-16 right-4 z-30 w-10 h-10 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center text-amber hover:border-amber transition-colors shadow-xl backdrop-blur-md"
        title="Player profile & stats"
        aria-label="Toggle Player Profile"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 15c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full z-50 w-72 rpg-panel scanlines flex flex-col gap-4 p-5 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ borderLeft: '1px solid var(--border-dim)' }}
        aria-label="Player Stats Drawer"
      >
        <div className="flex items-center justify-between">
          <span className="font-pixel text-[0.6rem] text-amber">PLAYER PROFILE</span>
          <button
            id="btn-close-hud"
            onClick={() => setOpen(false)}
            className="text-[var(--text-muted)] hover:text-red-400 text-xs p-1"
            aria-label="Close Profile"
          >
            ✕
          </button>
        </div>

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-2 py-3 border-y border-[var(--border-dim)]">
          <CharacterAvatar
            avatarId={user?.avatar}
            size={64}
            className="rounded-2xl"
          />
          <div className="text-center">
            <p className="font-pixel text-[0.65rem] text-[var(--text-bright)]">{user?.username ?? 'Adventurer'}</p>
            <p className="font-pixel text-[0.45rem] text-amber mt-1">LEVEL {level} EXPLORER</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3">
          <StatBar label="Experience" value={progress} max={200} color="#f5a623" />
          <StatBar label="Objectives" value={completed} max={savedNodes.length} color="#2dd4bf" />
          <StatBar label="Realm Mastery" value={Math.round((completed / savedNodes.length) * 100)} max={100} color="#8b5cf6" />
        </div>

        {/* Achievement badges */}
        <div className="flex flex-col gap-2">
          <span className="font-pixel text-[0.45rem] text-[var(--text-muted)]">REALM BADGES</span>
          <div className="flex gap-2 flex-wrap">
            {completed >= 1 && <Badge icon="⭐" label="Europe Pioneer" />}
            {completed >= 3 && <Badge icon="🔥" label="Ecosystem Guru" />}
            {completed >= 4 && <Badge icon="🛡️" label="Checkpoint Passed" />}
            {completed >= 6 && <Badge icon="👑" label="Summit Conqueror" />}
            {completed >= 7 && <Badge icon="🏆" label="Grandmaster" />}
            {completed === 0 && <span className="font-inter text-xs text-[var(--text-muted)]">Complete objectives to earn badges!</span>}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <button
            id="btn-reset-progress"
            onClick={() => {
              if (window.confirm('Reset realm objective progress to initial state?')) {
                localStorage.removeItem('studymate_nodes_state')
                localStorage.removeItem('studymate_connections_state')
                window.location.reload()
              }
            }}
            className="text-[9px] text-slate-500 hover:text-slate-300 font-pixel py-1 underline"
          >
            RESET MAP DATA
          </button>
          <button id="btn-logout" onClick={onLogout} className="btn-ghost w-full text-[0.5rem]">
            LOGOUT TO TITLE
          </button>
        </div>
      </aside>

      {/* Overlay when open */}
      {open && (
        <div className="fixed inset-0 z-45 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
    </>
  )
}

function Badge({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 bg-[var(--bg-input)] border border-[var(--border-dim)] rounded-md px-2 py-1 shadow-sm" title={label}>
      <span className="text-sm">{icon}</span>
      <span className="font-pixel text-[0.38rem] text-[var(--text-bright)]">{label}</span>
    </div>
  )
}
