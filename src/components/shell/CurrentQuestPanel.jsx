// CurrentQuestPanel: Current active quest, description, primary continue action, and map focus
// Sized and positioned to never obscure learning map nodes
import { useState } from 'react'
import { useStudy } from '../../context/useStudy'
import { Compass, Play, MapPin, ChevronDown, ChevronUp, Zap } from 'lucide-react'

export function CurrentQuestPanel({ onFocusNodeOnMap }) {
  const {
    currentQuest,
    setActiveQuestNode,
    setSelectedNode,
    setCurrentView
  } = useStudy()

  const [minimized, setMinimized] = useState(false)

  if (!currentQuest) return null

  const handleContinue = () => {
    setActiveQuestNode(currentQuest)
  }

  const handleInspectOnMap = () => {
    setCurrentView('world')
    setSelectedNode(currentQuest)
    onFocusNodeOnMap?.(currentQuest)
  }

  if (minimized) {
    return (
      <div className="flex items-center gap-2 bg-slate-900/95 border border-amber/50 rounded-xl px-3 py-1.5 shadow-2xl backdrop-blur-md">
        <span className="flex h-2.5 w-2.5 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber"></span>
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-[7.5px] font-pixel text-slate-400 uppercase leading-none">ACTIVE</span>
          <span className="font-pixel text-[9px] text-amber font-bold truncate max-w-[120px] sm:max-w-[160px]">
            {currentQuest.subtitle || currentQuest.label}
          </span>
        </div>
        <button
          onClick={handleContinue}
          className="btn-amber text-[8.5px] px-2.5 py-1 rounded-md shrink-0 shadow-sm"
          title="Start checkpoint quiz"
        >
          PLAY
        </button>
        <button
          onClick={() => setMinimized(false)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
          title="Expand Objective Panel"
          aria-label="Expand Objective Panel"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div
      className="bg-slate-900/95 border border-amber/50 rounded-2xl p-3 sm:p-3.5 shadow-2xl backdrop-blur-md flex flex-col gap-2 w-full max-w-[280px] sm:max-w-[320px] transition-all duration-200"
      role="region"
      aria-label="Current Quest Objective"
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber/20 border border-amber/50 flex items-center justify-center text-amber shrink-0">
            <Compass className="w-3.5 h-3.5 text-amber animate-spin-slow" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[7.5px] text-amber tracking-wider uppercase font-bold">
                OBJECTIVE
              </span>
              <span className="text-[8px] font-pixel text-teal flex items-center gap-0.5">
                <Zap className="w-2 h-2 fill-teal text-teal" />
                +{currentQuest.xp} XP
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-tight truncate leading-tight mt-0.5">
              {currentQuest.subtitle || currentQuest.label}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setMinimized(true)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 shrink-0"
          title="Minimize Quest Dock"
          aria-label="Minimize Quest Dock"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Short Description ── */}
      <p className="text-[11px] text-slate-300 leading-snug bg-slate-800/60 p-2 rounded-lg border border-slate-700/50 line-clamp-2">
        {currentQuest.desc}
      </p>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2 pt-0.5">
        <button
          id="btn-current-quest-continue"
          onClick={handleContinue}
          className="flex-1 btn-amber py-2 text-[10px] flex items-center justify-center gap-1.5 font-bold shadow-md"
        >
          <Play className="w-3 h-3 fill-slate-950 text-slate-950" />
          <span>START</span>
        </button>

        <button
          id="btn-current-quest-map"
          onClick={handleInspectOnMap}
          className="btn-ghost py-2 px-2.5 text-[10px] flex items-center justify-center gap-1"
          title="Focus this objective on the map"
        >
          <MapPin className="w-3 h-3 text-teal" />
          <span className="hidden sm:inline">VIEW</span>
        </button>
      </div>
    </div>
  )
}
