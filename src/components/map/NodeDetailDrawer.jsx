// Slide-over / Modal concept information panel for the selected node

export function NodeDetailDrawer({
  node,
  nodesMap,
  onClose,
  onStartQuest,
  onReviewQuest
}) {
  if (!node) return null

  const {
    label,
    subtitle,
    category,
    status,
    xp,
    desc,
    keyTakeaways = [],
    prerequisites = [],
    bonusXpLabel
  } = node

  const isMastered = status === 'mastered'
  const isInProgress = status === 'in_progress'
  const isAvailable = status === 'available'
  const isLocked = status === 'locked'

  // Look up missing prerequisites
  const missingPrereqs = prerequisites
    .map((pId) => nodesMap[pId])
    .filter((p) => p && p.status !== 'mastered')

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="node-drawer-title"
      className="fixed inset-y-0 right-0 z-40 w-full max-w-md p-4 sm:p-6 flex flex-col justify-end sm:justify-center pointer-events-none"
    >
      {/* Backdrop for click-away */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Card */}
      <div className="relative pointer-events-auto bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col gap-4 text-slate-100 backdrop-blur-xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-200 overflow-y-auto max-h-[85vh]">
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-slate-800 text-teal border border-teal/30 uppercase tracking-wider">
                {category}
              </span>

              {isMastered && (
                <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  ✓ MASTERED
                </span>
              )}
              {isInProgress && (
                <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-amber-950 text-amber border border-amber/40 animate-pulse">
                  ▶ CURRENT OBJECTIVE
                </span>
              )}
              {isAvailable && (
                <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  ★ AVAILABLE
                </span>
              )}
              {isLocked && (
                <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-600">
                  🔒 LOCKED
                </span>
              )}
            </div>

            <h2 id="node-drawer-title" className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {subtitle ? `${subtitle}` : label}
            </h2>
            <p className="text-xs text-slate-400 font-pixel">NODE: {label}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-sm font-bold"
            aria-label="Close concept details"
          >
            ✕
          </button>
        </div>

        {/* Reward & Info Pills */}
        <div className="grid grid-cols-2 gap-2.5 py-1">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-[10px] font-pixel text-slate-400 uppercase">XP REWARD</p>
              <p className="text-sm font-bold text-amber">
                +{xp} XP {bonusXpLabel && <span className="text-emerald-400 text-xs">({bonusXpLabel})</span>}
              </p>
            </div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">⏱</span>
            <div>
              <p className="text-[10px] font-pixel text-slate-400 uppercase">EST. TIME</p>
              <p className="text-sm font-bold text-slate-200">~3-5 Mins</p>
            </div>
          </div>
        </div>

        {/* Concept Description */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[11px] font-pixel text-slate-300 uppercase tracking-wider">
            Concept Briefing
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
            {desc}
          </p>
        </div>

        {/* Key Takeaways */}
        {keyTakeaways.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-[11px] font-pixel text-slate-300 uppercase tracking-wider">
              Learning Focus
            </h3>
            <ul className="flex flex-col gap-1.5">
              {keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-teal font-bold mt-0.5">◆</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Locked Explanation */}
        {isLocked && (
          <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-amber text-xs font-bold font-pixel">
              <span>⚠️</span>
              <span>PREREQUISITE REQUIRED</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {missingPrereqs.length > 0
                ? `You must complete "${missingPrereqs.map((p) => p.subtitle || p.label).join(', ')}" before this objective unlocks.`
                : 'Follow the connected learning path from previous objectives to break the seal on this fortress.'}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-2 flex flex-col sm:flex-row items-center gap-2.5">
          {isMastered && (
            <button
              onClick={() => onReviewQuest(node)}
              className="w-full btn-ghost py-3 text-xs flex items-center justify-center gap-2"
            >
              <span>↺</span>
              <span>REVIEW CONCEPT & QUIZ</span>
            </button>
          )}

          {(isAvailable || isInProgress) && (
            <button
              onClick={() => onStartQuest(node)}
              className="w-full btn-amber py-3 text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <span>⚔️</span>
              <span>START OBJECTIVE</span>
            </button>
          )}

          {isLocked && (
            <button
              disabled
              className="w-full py-3 rounded-lg bg-slate-800 text-slate-500 font-pixel text-[10px] cursor-not-allowed border border-slate-700/60"
            >
              SEALED OBJECTIVE
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700/60"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
