// AppShell: Master application layout, responsive navigation, and cohesive game world framing
import { useState } from 'react'
import { useStudy } from '../../context/useStudy'
import { Navigation } from './Navigation'
import { PlayerStatus } from './PlayerStatus'
import { LessonHeader } from './LessonHeader'
import { ProgressOverview } from './ProgressOverview'
import { FlashcardsView } from './FlashcardsView'
import { SettingsModal } from './SettingsModal'
import { LessonSelectModal } from '../upload/LessonSelectModal'
import WorldMap from '../WorldMap'
import StarField from '../StarField'
import Mascot from '../Mascot'

export function AppShell() {
  const {
    user,
    currentView,
    setCurrentView,
    onLogout,
    isLessonSelectOpen,
    setIsLessonSelectOpen,
    xpToast
  } = useStudy()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="relative w-full h-screen min-h-screen bg-[#070914] text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* ── Global Floating XP Gain Notification Toast ── */}
      {xpToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 z-50 pointer-events-none xp-float-toast"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/95 border-2 border-amber shadow-[0_0_25px_rgba(245,166,35,0.7)] backdrop-blur-md">
            <span className="text-2xl animate-bounce">⚡</span>
            <div className="flex flex-col">
              <span className="font-pixel text-[9px] text-teal tracking-wider uppercase">
                {xpToast.title}
              </span>
              <span className="font-pixel text-base sm:text-lg text-amber font-extrabold tracking-wide">
                +{xpToast.amount} XP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Background Starfield ── */}
      <StarField count={45} />

      {/* ── Top Application App Bar ── */}
      <header className="relative z-30 w-full px-3 sm:px-5 py-2 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between gap-2 sm:gap-3 shrink-0">
        {/* Left: Brand & Compact Lesson Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setCurrentView('world')}
            className="flex items-center gap-2 text-left group shrink-0"
            title="Return to World Map"
          >
            <Mascot size={32} avatarId={user?.avatar} className="shrink-0" />
            <div className="hidden sm:flex flex-col">
              <span
                className="font-pixel text-xs sm:text-[13px] leading-tight text-amber font-bold group-hover:text-yellow-400 transition-colors"
                style={{ textShadow: '0 0 12px rgba(245,166,35,0.4)' }}
              >
                StudyMate
              </span>
              <span className="text-[7.5px] font-pixel text-slate-400 uppercase tracking-widest hidden md:inline">
                RPG LEARNING REALM
              </span>
            </div>
          </button>

          {/* Lesson Header Badge - always clean, non-colliding */}
          <div className="min-w-0">
            <LessonHeader />
          </div>
        </div>

        {/* Center: Main Navigation (Desktop & Tablet) */}
        <div className="hidden md:flex items-center justify-center min-w-0">
          <Navigation onOpenSettings={() => setShowSettings(true)} />
        </div>

        {/* Right: Quick Action & Player Status */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Select Lesson / Upload Button */}
          <button
            onClick={() => setIsLessonSelectOpen(true)}
            className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal/15 hover:bg-teal/25 border border-teal/40 text-teal text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Choose Curated Realm or Upload PDF"
          >
            <span>📜</span>
            <span>Realms & PDF</span>
          </button>

          {/* Player Status Profile Widget */}
          <PlayerStatus compact={false} />
        </div>
      </header>

      {/* ── Main Content Viewport ── */}
      <main className="relative flex-1 min-h-0 w-full overflow-hidden flex flex-col">
        {currentView === 'world' && (
          <div className="relative w-full h-full min-h-0 flex-1 overflow-hidden">
            <WorldMap onBackToAuth={onLogout} />
          </div>
        )}

        {currentView === 'flashcards' && (
          <div className="relative w-full h-full flex-1 overflow-y-auto p-4 sm:p-6 z-10 flex items-center justify-center">
            <FlashcardsView />
          </div>
        )}

        {currentView === 'progress' && (
          <div className="relative w-full h-full flex-1 overflow-y-auto p-4 sm:p-6 z-10 flex items-center justify-center">
            <ProgressOverview onClose={() => setCurrentView('world')} />
          </div>
        )}
      </main>

      {/* ── Mobile Bottom Navigation Bar (Thumbs-friendly on phone 390px) ── */}
      <nav
        className="sm:hidden relative z-30 w-full bg-slate-950/95 border-t border-slate-800/80 px-4 py-2 flex items-center justify-around backdrop-blur-lg shrink-0"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        <Navigation onOpenSettings={() => setShowSettings(true)} />
      </nav>

      {/* ── Global Settings Modal ── */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {/* ── Lesson & PDF Upload Exploration Portal ── */}
      <LessonSelectModal
        isOpen={isLessonSelectOpen}
        onClose={() => setIsLessonSelectOpen(false)}
      />
    </div>
  )
}
