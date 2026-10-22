// LessonHeader: Sleek, non-colliding header component displaying Realm, Title, and Mastery
// Clicking the info button opens a floating detail popover without altering the header height
import { useState, useRef, useEffect } from 'react'
import { useStudy } from '../../context/useStudy'
import { BookOpen, CheckCircle2, Circle, ChevronDown, Trophy, X } from 'lucide-react'

export function LessonHeader() {
  const {
    currentLesson,
    completedCount,
    remainingCount,
    masteryPercent,
    setIsLessonSelectOpen
  } = useStudy()

  const [showPopover, setShowPopover] = useState(false)
  const popoverRef = useRef(null)

  // Close popover on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false)
      }
    }
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPopover])

  return (
    <div className="relative inline-flex items-center max-w-full min-w-0" ref={popoverRef}>
      {/* ── Main Compact Header Pill ── */}
      <div
        className="flex items-center gap-2 sm:gap-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-md backdrop-blur-md min-w-0 max-w-full"
        role="region"
        aria-label="Lesson Information"
      >
        {/* Realm Button */}
        <button
          onClick={() => setIsLessonSelectOpen(true)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal/15 hover:bg-teal/25 border border-teal/40 text-teal text-[9px] font-pixel tracking-wider shrink-0 transition-colors"
          title="Switch Realm or Upload PDF"
          aria-label={`Realm: ${currentLesson.realm}. Click to switch.`}
        >
          <span>{currentLesson.realm}</span>
          <span className="text-amber font-bold text-[10px]">⇄</span>
        </button>

        {/* Title & Category (Flex shrink with truncate) */}
        <div className="flex flex-col min-w-0 max-w-[120px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[260px]">
          <span
            className="text-xs sm:text-sm font-bold text-white truncate tracking-tight leading-tight"
            title={currentLesson.title}
          >
            {currentLesson.title}
          </span>
          <span className="text-[9px] text-slate-400 font-medium truncate hidden xl:inline">
            {currentLesson.category}
          </span>
        </div>

        {/* Mastery Percentage Pill */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800 shrink-0">
          <Trophy className="w-3.5 h-3.5 text-amber shrink-0" />
          <span className="font-pixel text-[10px] sm:text-[11px] text-amber font-bold">
            {masteryPercent}%
          </span>
          <span className="hidden 2xl:inline text-[9px] text-slate-400 font-pixel">
            ({completedCount}/{completedCount + remainingCount})
          </span>
        </div>

        {/* Info Toggle Button */}
        <button
          onClick={() => setShowPopover(!showPopover)}
          className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
          title={showPopover ? 'Close overview' : 'View lesson overview'}
          aria-expanded={showPopover}
          aria-label="Toggle Lesson Details Popover"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showPopover ? 'rotate-180 text-teal' : ''}`} />
        </button>
      </div>

      {/* ── Floating Details Popover (Non-disruptive to header layout) ── */}
      {showPopover && (
        <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-slate-900/95 border border-slate-700/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 text-slate-200">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal/20 text-teal flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="font-pixel text-[8px] text-teal uppercase tracking-wider">
                  {currentLesson.realm} REALM
                </span>
                <h3 className="text-sm font-bold text-white tracking-tight leading-tight">
                  {currentLesson.title}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setShowPopover(false)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
            {currentLesson.description}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-slate-800/50 rounded-xl text-[10px] font-pixel text-slate-300">
            <div>
              <span className="text-slate-400">DIFFICULTY:</span>{' '}
              <strong className="text-amber">{currentLesson.difficulty}</strong>
            </div>
            <div>
              <span className="text-slate-400">EST. TIME:</span>{' '}
              <strong className="text-teal">{currentLesson.estimatedDuration}</strong>
            </div>
          </div>

          {/* Mastery Breakdown */}
          <div className="flex items-center justify-between text-xs mt-3 pt-2.5 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{completedCount} Mastered</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Circle className="w-3.5 h-3.5 text-slate-500" />
              <span>{remainingCount} Remaining</span>
            </div>
          </div>

          <button
            onClick={() => {
              setShowPopover(false)
              setIsLessonSelectOpen(true)
            }}
            className="w-full mt-3 py-2 rounded-xl bg-teal/15 hover:bg-teal/25 border border-teal/40 text-teal text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <span>Switch Realm or Upload PDF ➔</span>
          </button>
        </div>
      )}
    </div>
  )
}
