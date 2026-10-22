// ProgressOverview: Completed concepts, In-progress, Locked concepts, and mastery progress
import { useState } from 'react'
import { useStudy } from '../../context/useStudy'
import {
  CheckCircle2,
  Clock,
  Lock,
  Trophy,
  Zap,
  ArrowRight,
  RotateCcw
} from 'lucide-react'

export function ProgressOverview() {
  const {
    nodes,
    nodesMap,
    totalCount,
    completedCount,
    inProgressCount,
    lockedCount,
    masteryPercent,
    totalXp,
    currentLevel,
    awardedXpMap = {},
    setSelectedNode,
    setActiveQuestNode,
    setCurrentView
  } = useStudy()

  const [activeTab, setActiveTab] = useState('all') // 'all' | 'completed' | 'active' | 'locked'

  const filteredNodes = nodes.filter((n) => {
    if (activeTab === 'completed') return n.status === 'mastered'
    if (activeTab === 'active') return n.status === 'in_progress' || n.status === 'available'
    if (activeTab === 'locked') return n.status === 'locked'
    return true
  })

  const handleInspect = (node) => {
    setCurrentView('world')
    setSelectedNode(node)
  }

  const handleLaunchQuest = (node) => {
    setActiveQuestNode(node)
  }

  return (
    <div
      className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6 text-slate-100 animate-in fade-in duration-200"
      role="region"
      aria-label="Realm Progress Overview"
    >
      {/* ── Top Header & Mastery Summary ── */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] text-teal px-2 py-0.5 rounded bg-teal/15 border border-teal/30 uppercase">
              REALM MASTERY REPORT
            </span>
            <span className="text-xs text-slate-400 font-pixel">LEVEL {currentLevel}</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Europe Knowledge Tree</span>
            <Trophy className="w-5 h-5 text-amber" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track your progress across coastal biomes, river hydrologic basins, and limestone formations.
          </p>
        </div>

        {/* Big Mastery Dial / Meter */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-5 py-3 flex items-center gap-4 shrink-0 shadow-inner">
          <div className="flex flex-col">
            <span className="text-[10px] font-pixel text-slate-400 uppercase">REALM MASTERY</span>
            <span className="text-2xl font-extrabold text-amber tracking-tight font-pixel">
              {masteryPercent}%
            </span>
          </div>
          <div className="w-16 h-2.5 bg-slate-700 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Status Metrics Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-pixel text-slate-400 uppercase">MASTERED</p>
            <p className="text-lg font-bold text-emerald-400 font-pixel">{completedCount}/{totalCount}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-amber/40 rounded-xl p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber/50 flex items-center justify-center text-amber shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-pixel text-slate-400 uppercase">ACTIVE / OPEN</p>
            <p className="text-lg font-bold text-amber font-pixel">{inProgressCount + nodes.filter(n=>n.status==='available').length}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-pixel text-slate-400 uppercase">SEALED</p>
            <p className="text-lg font-bold text-slate-300 font-pixel">{lockedCount}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-teal/40 rounded-xl p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-9 h-9 rounded-lg bg-teal/15 border border-teal/40 flex items-center justify-center text-teal shrink-0">
            <Zap className="w-5 h-5 fill-teal text-teal" />
          </div>
          <div>
            <p className="text-[10px] font-pixel text-slate-400 uppercase">TOTAL XP</p>
            <p className="text-lg font-bold text-teal font-pixel">{totalXp}</p>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-pixel transition-colors ${
            activeTab === 'all'
              ? 'bg-amber text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          ALL CONCEPTS ({totalCount})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-pixel transition-colors ${
            activeTab === 'completed'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          MASTERED ({completedCount})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-pixel transition-colors ${
            activeTab === 'active'
              ? 'bg-amber text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          READY / IN PROGRESS ({inProgressCount + nodes.filter(n=>n.status==='available').length})
        </button>
        <button
          onClick={() => setActiveTab('locked')}
          className={`px-3 py-1.5 rounded-lg text-xs font-pixel transition-colors ${
            activeTab === 'locked'
              ? 'bg-slate-600 text-white font-bold shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          LOCKED ({lockedCount})
        </button>
      </div>

      {/* ── Concepts Node Grid ── */}
      <div className="grid gap-3">
        {filteredNodes.map((node) => {
          const isMastered = node.status === 'mastered'
          const isInProgress = node.status === 'in_progress'
          const isAvailable = node.status === 'available'
          const isLocked = node.status === 'locked'

          const missingPrereqs = (node.prerequisites || [])
            .map((pId) => nodesMap[pId])
            .filter((p) => p && p.status !== 'mastered')

          return (
            <div
              key={node.id}
              className={`p-4 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isMastered
                  ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/60'
                  : isInProgress
                  ? 'bg-slate-900/95 border-amber/60 hover:border-amber shadow-[0_0_15px_rgba(245,166,35,0.15)]'
                  : isAvailable
                  ? 'bg-slate-900/90 border-teal/40 hover:border-teal/70'
                  : 'bg-slate-900/60 border-slate-800 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Status icon disc */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isMastered
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400'
                      : isInProgress
                      ? 'bg-amber-950/80 border-amber text-amber animate-pulse'
                      : isAvailable
                      ? 'bg-teal/15 border-teal/40 text-teal'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {isMastered && <CheckCircle2 className="w-5 h-5" />}
                  {isInProgress && <span className="font-pixel text-base font-bold">?</span>}
                  {isAvailable && <span className="font-pixel text-xs font-bold">★</span>}
                  {isLocked && <Lock className="w-5 h-5" />}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-pixel text-[8.5px] text-slate-400 uppercase tracking-wider">
                      {node.category}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="font-pixel text-[8.5px] text-amber">
                      +{node.xp} XP {node.bonusXpLabel && `(${node.bonusXpLabel})`}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight mt-0.5 truncate">
                    {node.subtitle ? `${node.subtitle} (${node.label})` : node.label}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {node.summary || node.desc}
                  </p>

                  {/* Quiz Attempts & Recovery Badge */}
                  {awardedXpMap[node.id]?.firstTryAwarded && (
                    <span className="text-[10px] text-emerald-400 font-pixel mt-1 flex items-center gap-1">
                      <span>★</span>
                      <span>FIRST-TRY ACCURACY (+10 XP)</span>
                    </span>
                  )}
                  {awardedXpMap[node.id]?.recoveryAwarded && (
                    <span className="text-[10px] text-teal font-pixel mt-1 flex items-center gap-1">
                      <span>↺</span>
                      <span>RECOVERY QUEST MASTERED (+5 XP)</span>
                    </span>
                  )}

                  {isLocked && missingPrereqs.length > 0 && (
                    <span className="text-[10px] text-amber-300 font-medium mt-1">
                      🔒 Requires: {missingPrereqs.map((p) => p.subtitle || p.label).join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {isMastered && (
                  <button
                    onClick={() => handleLaunchQuest(node)}
                    className="btn-ghost py-2 px-3 text-[10px] flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>REVIEW</span>
                  </button>
                )}

                {(isAvailable || isInProgress) && (
                  <button
                    onClick={() => handleLaunchQuest(node)}
                    className="btn-amber py-2 px-3.5 text-[10px] flex items-center gap-1.5 shadow-md"
                  >
                    <span>START</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={() => handleInspect(node)}
                  className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700/60"
                  title="View position on realm map"
                >
                  MAP ➔
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
