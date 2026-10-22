// Full Interactive Learning & Quiz Experience for a Selected Objective
// Coordinates Phase 1: Briefing, Phase 2: QuizView, Phase 3: RecoveryQuestView, and Phase 4: Victory Screen
import { useState } from 'react'
import { QuizView } from '../quiz/QuizView'
import { RecoveryQuestView } from '../quiz/RecoveryQuestView'
import { useStudy } from '../../context/useStudy'
import { playSound } from '../../services/soundEffects'
import { CharacterAvatar } from '../common/CharacterAvatar'
import { ArrowRight, X, BookOpen } from 'lucide-react'

export function QuestPlayerModal({ node, onClose }) {
  const { user, recordQuizAttempt, audioEnabled } = useStudy()
  const [step, setStep] = useState('briefing') // 'briefing' | 'quiz' | 'recovery' | 'victory'
  const [earnedXpTotal, setEarnedXpTotal] = useState(0)

  if (!node) return null

  const { id, label, subtitle, category, keyTakeaways = [], desc } = node
  const displayTitle = subtitle || label

  // Main Quiz Submission
  const handleQuizAnswerSubmitted = (attemptResult) => {
    const outcome = recordQuizAttempt({
      nodeId: id,
      selectedOptionIndex: attemptResult.selectedOptionIndex,
      isCorrect: attemptResult.isCorrect,
      isRecovery: false
    })

    if (attemptResult.isCorrect) {
      playSound('correct', audioEnabled)
    } else {
      playSound('incorrect', audioEnabled)
    }

    if (outcome.xpToAward > 0) {
      setEarnedXpTotal(outcome.xpToAward)
    }
  }

  // Recovery Quest Follow-up Submission
  const handleRecoveryCompleted = (recoveryResult) => {
    const outcome = recordQuizAttempt({
      nodeId: id,
      selectedOptionIndex: recoveryResult.selectedOptionIndex,
      isCorrect: true,
      isRecovery: true
    })

    playSound('correct', audioEnabled)

    if (outcome.xpToAward > 0) {
      setEarnedXpTotal(outcome.xpToAward)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col gap-5 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* ── Modal Header ── */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[8.5px] px-2 py-0.5 rounded bg-teal/20 text-teal border border-teal/30 uppercase tracking-wider">
                {category}
              </span>
              <span className="text-[10px] text-slate-400 font-pixel">
                {step === 'briefing'
                  ? 'STAGE 1: CONCEPT STUDY'
                  : step === 'quiz'
                  ? 'STAGE 2: CHECKPOINT QUIZ'
                  : step === 'recovery'
                  ? 'RECOVERY QUEST'
                  : 'OBJECTIVE MASTERED'}
              </span>
            </div>
            <h2 id="quest-modal-title" className="text-xl sm:text-2xl font-black text-white mt-1">
              {displayTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold transition-colors"
            aria-label="Close quest"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── STAGE 1: Briefing & Core Concept Study ── */}
        {step === 'briefing' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex flex-col gap-2">
              <h3 className="font-pixel text-[10px] text-amber uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber" />
                <span>Concept Overview</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {desc}
              </p>
            </div>

            {keyTakeaways.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="font-pixel text-[10px] text-slate-300 uppercase tracking-wider">
                  Key Insights:
                </h3>
                <div className="grid gap-2">
                  {keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 bg-slate-800/40 p-3 rounded-lg border border-slate-700/40 text-xs text-slate-300"
                    >
                      <span className="w-5 h-5 rounded-full bg-teal/20 text-teal flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] font-pixel text-slate-400">
                POTENTIAL XP: <span className="text-amber">+10 XP</span>
              </span>

              <button
                id="btn-start-checkpoint-quiz"
                onClick={() => setStep('quiz')}
                className="btn-amber px-6 py-3 text-xs flex items-center gap-2 shadow-xl"
              >
                <span>ENTER CHECKPOINT QUIZ</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 2: Interactive QuizView ── */}
        {step === 'quiz' && (
          <QuizView
            node={node}
            onAnswerSubmitted={handleQuizAnswerSubmitted}
            onLaunchRecovery={() => setStep('recovery')}
            onProceedVictory={() => {
              playSound('victory', audioEnabled)
              setStep('victory')
            }}
          />
        )}

        {/* ── STAGE 3: RecoveryQuestView (Triggered on incorrect attempt) ── */}
        {step === 'recovery' && (
          <RecoveryQuestView
            node={node}
            onRecoveryCompleted={handleRecoveryCompleted}
            onReturnToMap={() => {
              onClose()
            }}
          />
        )}

        {/* ── STAGE 4: Victory Celebration Screen ── */}
        {step === 'victory' && (
          <div className="flex flex-col items-center justify-center text-center gap-5 py-4 animate-in zoom-in-95">
            <div className="relative flex items-center justify-center gap-3">
              <CharacterAvatar
                avatarId={user?.avatar}
                size={70}
                className="rounded-2xl shadow-[0_0_20px_rgba(245,166,35,0.4)]"
              />
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                🏆
              </div>
            </div>

            <div>
              <span className="font-pixel text-[11px] text-teal uppercase tracking-widest">
                OBJECTIVE MASTERED
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {displayTitle} Completed!
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm">
                You have demonstrated mastery on the first attempt and unlocked connected pathways across the realm.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-amber/50 rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg">
              <span className="text-2xl">⚡</span>
              <span className="font-pixel text-base text-amber">
                +{earnedXpTotal || 10} XP AWARDED
              </span>
            </div>

            <button
              id="btn-victory-return-map"
              onClick={onClose}
              className="btn-amber px-8 py-3.5 text-xs font-bold mt-2 shadow-xl"
            >
              RETURN TO WORLD MAP ➔
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
