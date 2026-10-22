// RecoveryQuestView: Targeted practice, misconception breakdown, and follow-up challenge
import { useState } from 'react'
import {
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen
} from 'lucide-react'

export function RecoveryQuestView({
  node,
  onRecoveryCompleted,
  onReturnToMap
}) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFollowUpCorrect, setIsFollowUpCorrect] = useState(false)

  if (!node || !node.recoveryQuest) return null

  const { subtitle, label, recoveryQuest } = node
  const displayTitle = subtitle || label
  const { misconception, targetedConcept, practiceTask, followUpQuestion } = recoveryQuest

  const handleSelectOption = (index) => {
    if (isSubmitted || isSubmitting) return
    setSelectedOptionIndex(index)
  }

  const handleConfirmSubmit = () => {
    if (selectedOptionIndex === null || isSubmitted || isSubmitting) return

    setIsSubmitting(true)
    const correct = selectedOptionIndex === followUpQuestion.correctIndex
    setIsFollowUpCorrect(correct)
    setIsSubmitted(true)
    setIsSubmitting(false)

    if (correct) {
      onRecoveryCompleted?.({
        nodeId: node.id,
        selectedOptionIndex,
        isCorrect: true,
        isRecovery: true,
        timestamp: Date.now()
      })
    }
  }

  const handleRetryFollowUp = () => {
    setIsSubmitted(false)
    setSelectedOptionIndex(null)
    setIsFollowUpCorrect(false)
  }

  return (
    <div
      className="w-full flex flex-col gap-5 text-slate-100 select-none animate-in fade-in duration-200"
      role="region"
      aria-label={`Recovery Quest for ${displayTitle}`}
    >
      {/* ── Recovery Quest Banner ── */}
      <div className="bg-amber-950/60 border border-amber/50 rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[8.5px] px-2 py-0.5 rounded bg-amber text-slate-950 font-bold uppercase tracking-wider">
              ACTIVE RECOVERY QUEST
            </span>
            <span className="font-pixel text-[8.5px] text-teal">
              ⚡ 5 XP RECOVERY AWARD
            </span>
          </div>

          <span className="text-xs text-slate-400 font-pixel">
            TARGETED DRILL
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-black text-white">
            {displayTitle}: Conceptual Recovery
          </h3>
          <p className="text-xs text-amber-300 font-semibold mt-0.5">
            Focus Concept: {targetedConcept}
          </p>
        </div>
      </div>

      {/* ── Misconception Breakdown ── */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg">
        <div className="flex items-center gap-2 text-red-400 text-xs font-pixel font-bold">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>MISCONCEPTION BREAKDOWN</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          {misconception}
        </p>
      </div>

      {/* ── Targeted Practice Task ── */}
      <div className="bg-slate-900/90 border border-teal/40 rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 shadow-lg">
        <div className="flex items-center gap-2 text-teal text-xs font-pixel font-bold">
          <BookOpen className="w-4 h-4 text-teal shrink-0" />
          <span>TARGETED PRACTICE TASK: {practiceTask.title}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {practiceTask.instruction}
        </p>
        <div className="bg-teal/10 border border-teal/30 p-3 rounded-xl text-xs text-teal-200 font-medium">
          💡 <strong>Key Takeaway:</strong> {practiceTask.keyModel}
        </div>
      </div>

      {/* ── Follow-Up Challenge Question ── */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-amber text-xs font-pixel font-bold">
          <HelpCircle className="w-4 h-4 text-amber shrink-0" />
          <span>FOLLOW-UP MASTERY QUESTION</span>
        </div>

        <p className="text-sm sm:text-base font-extrabold text-white leading-relaxed">
          {followUpQuestion.question}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2 pt-1">
          {followUpQuestion.options.map((option, index) => {
            const isSelected = selectedOptionIndex === index
            let btnStyle =
              'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700 hover:border-slate-600'

            if (isSubmitted) {
              if (index === followUpQuestion.correctIndex) {
                btnStyle =
                  'bg-emerald-950/90 border-emerald-500 text-emerald-100 font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]'
              } else if (isSelected && !isFollowUpCorrect) {
                btnStyle =
                  'bg-red-950/90 border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
              } else {
                btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
              }
            } else if (isSelected) {
              btnStyle =
                'bg-amber-950/70 border-amber text-amber font-semibold shadow-[0_0_15px_rgba(245,166,35,0.35)] scale-[1.01]'
            }

            return (
              <button
                key={index}
                disabled={isSubmitted || isSubmitting}
                onClick={() => handleSelectOption(index)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all duration-150 flex items-center gap-3.5 ${btnStyle}`}
                role="radio"
                aria-checked={isSelected}
              >
                <span
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center font-pixel text-[10px] shrink-0 ${
                    isSubmitted && index === followUpQuestion.correctIndex
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                      : isSelected
                      ? 'bg-amber text-slate-950 border-amber font-black'
                      : 'bg-slate-900/90 border-slate-700 text-slate-300'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="flex-1 leading-snug">{option}</span>

                {isSubmitted && index === followUpQuestion.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isSubmitted && isSelected && !isFollowUpCorrect && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Submit / Next Actions ── */}
      {!isSubmitted && (
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[11px] font-pixel text-slate-400">
            {selectedOptionIndex === null ? 'SELECT AN ANSWER' : 'READY TO SUBMIT'}
          </span>

          <button
            id="btn-confirm-recovery-submit"
            disabled={selectedOptionIndex === null || isSubmitting}
            onClick={handleConfirmSubmit}
            className={`btn-amber px-7 py-3 text-xs flex items-center gap-2 shadow-xl ${
              selectedOptionIndex === null || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>SUBMIT FOLLOW-UP ANSWER</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </div>
      )}

      {isSubmitted && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div
            className={`p-4 rounded-xl border leading-relaxed text-xs sm:text-sm ${
              isFollowUpCorrect
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                : 'bg-red-950/70 border-red-500/60 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
            }`}
          >
            <div className="flex items-center gap-2 font-pixel text-[11px] mb-1 font-bold">
              {isFollowUpCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">RECOVERY QUEST COMPLETE (+5 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">FOLLOW-UP INCORRECT</span>
                </>
              )}
            </div>

            <p className="mt-1 text-slate-200">{followUpQuestion.explanation}</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            {isFollowUpCorrect ? (
              <button
                id="btn-recovery-return-map"
                onClick={onReturnToMap}
                className="btn-amber px-7 py-3.5 text-xs flex items-center gap-2 shadow-2xl font-bold"
              >
                <span>RETURN TO REALM MAP</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            ) : (
              <button
                id="btn-retry-recovery"
                onClick={handleRetryFollowUp}
                className="btn-ghost px-6 py-3 text-xs flex items-center gap-2 font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>TRY FOLLOW-UP AGAIN</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
