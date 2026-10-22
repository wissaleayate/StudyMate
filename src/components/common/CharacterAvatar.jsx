// Reusable character avatar component for StudyMate
// Renders user-provided pixel-art character portraits with responsive sizing and crisp frame
import { getAvatar } from '../../data/avatarData'

export function CharacterAvatar({
  avatarId = 'warrior',
  size = 40,
  className = '',
  showBorder = true,
  alt
}) {
  const avatar = getAvatar(avatarId)
  const dimension = typeof size === 'number' ? `${size}px` : size

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-xl bg-slate-900 transition-transform ${
        showBorder ? 'border-2 border-amber/70 shadow-[0_0_12px_rgba(245,166,35,0.35)]' : ''
      } ${className}`}
      style={{
        width: dimension,
        height: dimension
      }}
      title={avatar.title || avatar.label}
    >
      <img
        src={avatar.image}
        alt={alt || `${avatar.label} avatar`}
        className="w-full h-full object-cover select-none"
        style={{
          imageRendering: 'auto'
        }}
        loading="lazy"
        onError={(e) => {
          // Fallback if image path has issue
          e.currentTarget.style.display = 'none'
        }}
      />
    </div>
  )
}
