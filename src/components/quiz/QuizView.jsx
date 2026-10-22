// Reusable QuizView Component
// Features concept context, multiple-choice questions, submission validation, feedback, and explanation
import { useState } from 'react'
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react'

export function QuizView({
  node,
  onAnswerSubmitted,
  onLaunchRecovery,
  onProceedVictory
}) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attemptResult, setAttemptResult] = useState(null)

  if (!node || !node.quiz) return null

  const { subtitle, label, category, quiz, summary } = node
  const displayTitle = subtitle || label

  const handleSelectOption = (index) => {
    if (isSubmitted || isSubmitting) return
    setSelectedOptionIndex(index)
  }

  const handleConfirmSubmit = () => {
    if (selectedOptionIndex === null || isSubmitted || isSubmitting) return

    setIsSubmitting(true)
    const isCorrect = selectedOptionIndex === quiz.correctIndex

    const result = {
      nodeId: node.id,
      selectedOptionIndex,
      isCorrect,
      isRecovery: false,
      timestamp: Date.now()
    }

    // Record attempt in shared application state
    onAnswerSubmitted?.(result)

    setAttemptResult(result)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <div
      className="w-full flex flex-col gap-5 text-slate-100 select-none animate-in fade-in duration-200"
      role="region"
      aria-label={`Quiz for ${displayTitle}`}
    >
      {/* ── Context & Concept Header ── */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[8.5px] px-2 py-0.5 rounded bg-teal/20 text-teal border border-teal/30 uppercase tracking-wider">
              {category}
            </span>
            <span className="font-pixel text-[8.5px] text-amber">
              ⚡ 10 XP FIRST-TRY CHALLENGE
            </span>
          </div>

          <span className="text-xs text-slate-400 font-pixel">
            QUESTION 1 OF 1
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white mt-1">
          {displayTitle}
        </h3>

        {summary && (
          <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
            {summary}
          </p>
        )}
      </div>

      {/* ── Question Card ── */}
      <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-xl flex flex-col gap-2">
        <div className="flex items-center gap-2 text-amber text-xs font-pixel font-bold">
          <HelpCircle className="w-4 h-4 text-amber shrink-0" />
          <span>CHECKPOINT QUESTION</span>
        </div>

        <p className="text-sm sm:text-base font-extrabold text-white leading-relaxed">
          {quiz.question}
        </p>
      </div>

      {/* ── Multiple Choice Options ── */}
      <div className="flex flex-col gap-2.5">
        {quiz.options.map((option, index) => {
          const isSelected = selectedOptionIndex === index
          let btnStyle =
            'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700/90 hover:border-slate-600'

          if (isSubmitted) {
            if (index === quiz.correctIndex) {
              btnStyle =
                'bg-emerald-950/90 border-emerald-500 text-emerald-100 font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]'
            } else if (isSelected && !attemptResult?.isCorrect) {
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
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all duration-150 flex items-center gap-3.5 ${btnStyle}`}
              role="radio"
              aria-checked={isSelected}
            >
              <span
                className={`w-7 h-7 rounded-lg border flex items-center justify-center font-pixel text-[10px] shrink-0 ${
                  isSubmitted && index === quiz.correctIndex
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                    : isSelected
                    ? 'bg-amber text-slate-950 border-amber font-black'
                    : 'bg-slate-900/90 border-slate-700 text-slate-300'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>

              <span className="flex-1 leading-snug">{option}</span>

              {isSubmitted && index === quiz.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {isSubmitted && isSelected && !attemptResult?.isCorrect && (
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Pre-submission Confirmation ── */}
      {!isSubmitted && (
        <div className="pt-2 flex items-center justify-between gap-3">
          <span className="text-[11px] font-pixel text-slate-400">
            {selectedOptionIndex === null ? 'SELECT AN ANSWER TO CONTINUE' : 'READY TO CONFIRM'}
          </span>

          <button
            id="btn-confirm-quiz-submit"
            disabled={selectedOptionIndex === null || isSubmitting}
            onClick={handleConfirmSubmit}
            className={`btn-amber px-7 py-3 text-xs flex items-center gap-2 shadow-xl ${
              selectedOptionIndex === null || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>CONFIRM ANSWER</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </div>
      )}

      {/* ── Post-submission Feedback & Next Actions ── */}
      {isSubmitted && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div
            className={`p-4 rounded-xl border leading-relaxed text-xs sm:text-sm ${
              attemptResult?.isCorrect
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                : 'bg-red-950/70 border-red-500/60 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
            }`}
          >
            <div className="flex items-center gap-2 font-pixel text-[11px] mb-1.5 font-bold">
              {attemptResult?.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">CORRECT! CONCEPT MASTERED (+10 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">INCORRECT ATTEMPT</span>
                </>
              )}
            </div>

            <p className="mt-1 text-slate-200">{quiz.explanation}</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            {attemptResult?.isCorrect ? (
              <button
                id="btn-quiz-proceed-victory"
                onClick={() => onProceedVictory?.(node)}
                className="btn-amber px-7 py-3.5 text-xs flex items-center gap-2 shadow-2xl font-bold"
              >
                <span>CLAIM VICTORY & PROCEED</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            ) : (
              <button
                id="btn-quiz-launch-recovery"
                onClick={() => onLaunchRecovery?.(node)}
                className="btn-orange px-7 py-3.5 text-xs flex items-center gap-2 shadow-2xl font-bold"
              >
                <span>LAUNCH RECOVERY QUEST</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
