// Surrounding UI HUD matching design-reference.png:
// Top-Left: "← Europe" pill button
// Top-Center: True-centered Objective & XP banner
// Top-Right: Zoom/Audio controls + "4/7" progress card with teal bar & "✕"
import { useState, useRef, useEffect } from 'react'

export function MapHUD({
  currentWorld = 'Europe',
  completedCount = 4,
  totalCount = 7,
  userXp = 420,
  activeObjective = 'Summit Falls',
  onClose,
  onResetView,
  onZoomIn,
  onZoomOut,
  onWorldChange,
  onOpenLessonSelect,
  isAudioOn,
  onToggleAudio
}) {
  const [showWorldMenu, setShowWorldMenu] = useState(false)
  const menuRef = useRef(null)
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const WORLDS = [
    { id: 'Europe', label: 'Europe (Active)', icon: '🏰', unlocked: true },
    { id: 'Asia', label: 'Asia - Eastern Peaks', icon: '🏯', unlocked: false },
    { id: 'Americas', label: 'Americas - Rainforest', icon: '🌿', unlocked: false },
    { id: 'Cosmos', label: 'Cosmos - Deep Space', icon: '🌌', unlocked: false }
  ]

  // Close world menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowWorldMenu(false)
      }
    }
    if (showWorldMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showWorldMenu])

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {/* ── Top-Left: "← Europe" Pill (Exact match from reference) ── */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-auto" ref={menuRef}>
        <button
          id="btn-world-title"
          onClick={() => setShowWorldMenu(!showWorldMenu)}
          className="flex items-center gap-2 bg-white/95 hover:bg-white text-slate-800 font-bold text-xs sm:text-sm px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-lg border border-slate-200/80 transition-all duration-150 active:scale-95 group"
          title="Switch Learning Realm"
          aria-label={`World: ${currentWorld}. Click to switch realm.`}
        >
          <span className="text-slate-700 group-hover:-translate-x-0.5 transition-transform font-bold text-sm sm:text-base">
            ←
          </span>
          <span className="tracking-tight text-slate-900 font-extrabold">{currentWorld}</span>
          <span className="text-xs text-slate-400 group-hover:text-slate-600">▼</span>
        </button>

        {/* Dropdown Realm Switcher */}
        {showWorldMenu && (
          <div className="absolute left-0 mt-2 w-60 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-md animate-in fade-in zoom-in-95">
            <div className="px-3 py-1.5 text-[9px] font-pixel text-amber uppercase tracking-wider">
              Learning Realms
            </div>
            {WORLDS.map((w) => (
              <button
                key={w.id}
                disabled={!w.unlocked}
                onClick={() => {
                  onWorldChange?.(w.id)
                  setShowWorldMenu(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                  w.id === currentWorld
                    ? 'bg-amber/20 text-amber border border-amber/30'
                    : w.unlocked
                    ? 'hover:bg-slate-800 text-slate-200'
                    : 'opacity-50 cursor-not-allowed text-slate-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{w.icon}</span>
                  <span>{w.label}</span>
                </span>
                {!w.unlocked && <span className="text-[10px]">🔒</span>}
              </button>
            ))}

            <div className="pt-2 mt-1 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowWorldMenu(false)
                  onOpenLessonSelect?.()
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal text-xs font-bold text-left flex items-center justify-between"
              >
                <span>📂 Upload PDF / Switch...</span>
                <span className="text-[10px]">➔</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Top-Center: True-Centered Objective Banner (Hidden on <lg to prevent collisions) ── */}
      <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 pointer-events-auto hidden lg:flex flex-col items-center">
        <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber"></span>
          </span>
          <span className="text-[10px] font-pixel text-amber tracking-wide whitespace-nowrap">
            OBJECTIVE: <span className="text-white">{activeObjective}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] font-pixel text-teal flex items-center gap-1 whitespace-nowrap">
            ⚡ {userXp} XP
          </span>
        </div>
      </div>

      {/* ── Top-Right: Map Controls & "4/7" Progress Pill ── */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 pointer-events-auto flex items-center gap-2">
        {/* Quick Map Controls (Zoom / Audio) */}
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-900/80 border border-slate-700/70 rounded-xl p-1 shadow-md">
          <button
            onClick={onZoomIn}
            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-bold transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            +
          </button>
          <button
            onClick={onZoomOut}
            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-bold transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            -
          </button>
          <button
            onClick={onResetView}
            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors"
            title="Reset Map Fit"
            aria-label="Reset Map Fit"
          >
            ⛶
          </button>
          <button
            onClick={onToggleAudio}
            className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg text-xs transition-colors ${
              isAudioOn ? 'text-teal hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
            }`}
            title={isAudioOn ? 'Mute Atmosphere' : 'Play Atmosphere'}
            aria-label="Toggle Atmosphere Sound"
          >
            {isAudioOn ? '🔊' : '🔇'}
          </button>
        </div>

        {/* The White Progress Card from Reference */}
        <div
          id="hud-progress-pill"
          className="flex items-center gap-2 sm:gap-2.5 bg-white/95 text-slate-900 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-lg border border-slate-200/80 backdrop-blur-sm"
        >
          {/* Fraction: 4/7 */}
          <span className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight select-none">
            {completedCount}/{totalCount}
          </span>

          {/* Smooth Teal Progress Bar */}
          <div
            className="w-16 sm:w-24 h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5"
            title={`${progressPercent}% realm completed`}
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: '#2dd4bf'
              }}
            />
          </div>

          {/* Close ✕ Button */}
          <button
            id="btn-hud-close"
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full text-xs font-bold transition-colors"
            title="Close Realm Map"
            aria-label="Close Realm Map"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
