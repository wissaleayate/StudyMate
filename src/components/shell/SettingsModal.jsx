// SettingsModal: Audio toggles, progress reset, shortcuts, and character avatar
import { useStudy } from '../../context/useStudy'
import { AVATARS, getAvatar } from '../../data/avatarData'
import { Volume2, VolumeX, Keyboard, X } from 'lucide-react'

export function SettingsModal({ onClose }) {
  const {
    user,
    setAvatar,
    audioEnabled,
    setAudioEnabled,
    resetProgress,
    onLogout
  } = useStudy()

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] text-amber uppercase">SYSTEM SETTINGS</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Character Avatar Switcher */}
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-pixel text-amber uppercase tracking-wider">
              Student Character Avatar
            </span>
            <span className="text-[11px] text-teal font-bold font-pixel">
              {getAvatar(user?.avatar).label}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2 pt-1">
            {AVATARS.map((av) => (
              <button
                key={av.id}
                onClick={() => setAvatar(av.id)}
                className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                  user?.avatar === av.id
                    ? 'border-amber shadow-[0_0_12px_rgba(245,166,35,0.7)] scale-105 ring-1 ring-amber'
                    : 'border-slate-700 hover:border-slate-500 opacity-70'
                }`}
                title={`${av.label} — ${av.title}`}
              >
                <img
                  src={av.image}
                  alt={av.label}
                  className="w-full h-full object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-3">
            {audioEnabled ? <Volume2 className="w-5 h-5 text-teal" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            <div>
              <p className="text-xs font-bold text-white">Synthesized Audio Effects</p>
              <p className="text-[10px] text-slate-400">Node chimes and victory fanfares</p>
            </div>
          </div>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-pixel transition-colors ${
              audioEnabled ? 'bg-teal text-slate-950 font-bold' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {audioEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Shortcuts */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
          <span className="text-[10px] font-pixel text-slate-400 uppercase flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keyboard Shortcuts</span>
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div><kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px]">Tab</kbd> Jump nodes</div>
            <div><kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px]">Enter</kbd> Open node</div>
            <div><kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px]">Space</kbd> Flip flashcard</div>
            <div><kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px]">Esc</kbd> Close modal</div>
          </div>
        </div>

        {/* Reset Realm Progress */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-red-950/30 border border-red-500/30">
          <div>
            <p className="text-xs font-bold text-red-200">Reset Realm Progress</p>
            <p className="text-[10px] text-red-300/70">Restore initial node states for testing</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all objectives to initial state?')) {
                resetProgress()
                onClose()
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-100 text-xs font-semibold border border-red-500/50"
          >
            Reset
          </button>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => {
              onClose()
              onLogout?.()
            }}
            className="text-xs text-slate-400 hover:text-white underline font-pixel"
          >
            Log Out
          </button>
          <button
            onClick={onClose}
            className="btn-amber text-xs px-5 py-2.5"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  )
}
