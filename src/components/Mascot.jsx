// LearnQuest pixel-art robot mascot (SVG)
export default function Mascot({ size = 48, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`mascot-float ${className}`}
      aria-label="LearnQuest mascot robot"
    >
      {/* Antenna */}
      <rect x="22" y="2" width="4" height="6" fill="#f5a623" rx="1" />
      <circle cx="24" cy="2" r="2.5" fill="#f5a623" />

      {/* Head */}
      <rect x="10" y="8" width="28" height="20" rx="4" fill="#2d3060" stroke="#f5a623" strokeWidth="1.5" />

      {/* Eyes */}
      <rect x="15" y="13" width="6" height="6" rx="1" fill="#2dd4bf" />
      <rect x="27" y="13" width="6" height="6" rx="1" fill="#2dd4bf" />
      <rect x="16" y="14" width="2" height="2" fill="#fff" opacity="0.9" />
      <rect x="28" y="14" width="2" height="2" fill="#fff" opacity="0.9" />

      {/* Mouth */}
      <rect x="18" y="22" width="12" height="2" rx="1" fill="#f5a623" />
      <rect x="20" y="24" width="2" height="2" rx="0.5" fill="#f5a623" />
      <rect x="26" y="24" width="2" height="2" rx="0.5" fill="#f5a623" />

      {/* Body */}
      <rect x="13" y="30" width="22" height="14" rx="3" fill="#1e2050" stroke="#f5a623" strokeWidth="1.5" />

      {/* Chest panel */}
      <rect x="19" y="33" width="10" height="7" rx="2" fill="#2d3060" />
      <circle cx="22" cy="37" r="1.5" fill="#f5a623" />
      <circle cx="26" cy="37" r="1.5" fill="#2dd4bf" />

      {/* Arms */}
      <rect x="4"  y="30" width="7" height="10" rx="3" fill="#1e2050" stroke="#f5a623" strokeWidth="1.5" />
      <rect x="37" y="30" width="7" height="10" rx="3" fill="#1e2050" stroke="#f5a623" strokeWidth="1.5" />

      {/* Legs */}
      <rect x="15" y="44" width="7" height="3" rx="1.5" fill="#f5a623" />
      <rect x="26" y="44" width="7" height="3" rx="1.5" fill="#f5a623" />
    </svg>
  )
}
