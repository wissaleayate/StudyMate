// PlayerStatus: Student avatar, level, total XP, and next level progress
import { useStudy } from '../../context/useStudy'
import { CharacterAvatar } from '../common/CharacterAvatar'
import { Zap } from 'lucide-react'

export function PlayerStatus({ compact = false }) {
  const {
    user,
    totalXp,
    currentLevel,
    xpInCurrentLevel,
    xpRequiredForNextLevel,
    levelProgressPercent
  } = useStudy()

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1 shadow-md shrink-0">
        <CharacterAvatar
          avatarId={user?.avatar}
          size={24}
          showBorder={false}
          className="rounded-full ring-1 ring-amber/50"
        />
        <div className="flex items-center gap-1.5 text-xs pr-1">
          <span className="font-pixel text-[9px] text-amber font-bold">LVL {currentLevel}</span>
          <span className="text-slate-500">•</span>
          <span className="font-pixel text-[9px] text-teal font-bold">{totalXp} XP</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-2.5 sm:gap-3 bg-slate-900/95 border border-slate-700/80 rounded-xl p-2 sm:p-2.5 shadow-md backdrop-blur-md shrink-0"
      role="region"
      aria-label="Player Status"
    >
      {/* ── Avatar Circle with Level Badge ── */}
      <div className="relative shrink-0">
        <CharacterAvatar
          avatarId={user?.avatar}
          size={38}
          showBorder={true}
          className="rounded-xl shadow-[0_0_12px_rgba(245,166,35,0.35)]"
        />

        {/* Level badge pip */}
        <span
          className="absolute -bottom-1 -right-1 bg-amber text-slate-950 font-pixel text-[7.5px] font-black px-1 py-0.5 rounded shadow-sm border border-slate-900 z-10"
          title={`Level ${currentLevel}`}
        >
          L{currentLevel}
        </span>
      </div>

      {/* ── Medium Screen Stats (Hidden on xl) ── */}
      <div className="flex xl:hidden flex-col gap-0.5">
        <span className="font-extrabold text-slate-100 tracking-tight text-xs truncate max-w-[90px]">
          {user?.username || 'QuestMaster'}
        </span>
        <span className="font-pixel text-[9px] text-amber flex items-center gap-0.5">
          <Zap className="w-2.5 h-2.5 text-amber fill-amber" />
          {totalXp} XP
        </span>
      </div>

      {/* ── Full Desktop Progress Bar (Visible on xl+) ── */}
      <div className="hidden xl:flex flex-col gap-1 min-w-[130px]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-100 tracking-tight text-xs truncate max-w-[90px]">
            {user?.username || 'QuestMaster'}
          </span>
          <span className="font-pixel text-[9px] text-amber flex items-center gap-0.5">
            <Zap className="w-3 h-3 text-amber fill-amber" />
            {totalXp} XP
          </span>
        </div>

        {/* XP Next Level Progress Bar */}
        <div className="flex flex-col gap-0.5">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 p-px">
            <div
              className="h-full bg-gradient-to-r from-amber to-yellow-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(245,166,35,0.6)]"
              style={{ width: `${levelProgressPercent}%` }}
              role="progressbar"
              aria-valuenow={levelProgressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex items-center justify-between text-[8px] font-pixel text-slate-400">
            <span>LVL {currentLevel}</span>
            <span>
              {xpInCurrentLevel}/{xpRequiredForNextLevel} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
