// StudyMate character emblem and mascot component
import { getAvatar } from '../data/avatarData'

export default function Mascot({ size = 40, className = '', avatarId = 'paladin' }) {
  const avatar = getAvatar(avatarId)
  const dimension = typeof size === 'number' ? `${size}px` : size

  return (
    <div
      className={`mascot-float relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden border-2 border-amber/80 shadow-[0_0_14px_rgba(245,166,35,0.45)] bg-slate-900 ${className}`}
      style={{ width: dimension, height: dimension }}
      aria-label="StudyMate character emblem"
      role="img"
    >
      <img
        src={avatar.image}
        alt="StudyMate Character"
        className="w-full h-full object-cover select-none"
        loading="eager"
      />
    </div>
  )
}
