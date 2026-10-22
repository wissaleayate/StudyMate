// Reusable Learning Node Component for StudyMate World Map
// Supports: Mastered, Available, In Progress, and Locked states with high visual fidelity

import { memo } from 'react'

export const MapNode = memo(function MapNode({
  node,
  isSelected,
  onSelect,
  onHover,
  onLeave
}) {
  const {
    id,
    label,
    subtitle,
    status,
    x,
    y,
    hasNotificationDot,
    bonusXpLabel
  } = node

  const isMastered = status === 'mastered'
  const isInProgress = status === 'in_progress'
  const isAvailable = status === 'available'
  const isLocked = status === 'locked'

  // Geometry constants calibrated to match reference image (radius ~ 34px)
  const RADIUS = 34
  const OUTER_GLOW_RADIUS = RADIUS + 10

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(node)
    }
  }

  return (
    <g
      id={`node-${id}`}
      transform={`translate(${x}, ${y})`}
      className={`group select-none outline-none transition-transform duration-200 ${
        isLocked ? 'cursor-not-allowed opacity-65' : 'cursor-pointer hover:scale-105'
      }`}
      onClick={() => onSelect(node)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHover?.(node)}
      onMouseLeave={() => onLeave?.(node)}
      tabIndex={0}
      role="button"
      aria-label={`${label}: ${subtitle || ''} (${status.replace('_', ' ')})`}
      aria-pressed={isSelected}
    >
      {/* ── Active Quest Floating Indicator Marker ── */}
      {isInProgress && (
        <g transform={`translate(0, -${RADIUS + 16})`} className="mascot-float">
          {/* Beacon Diamond */}
          <polygon
            points="0,-8 6,-1 0,6 -6,-1"
            fill="#ea580c"
            stroke="#fed7aa"
            strokeWidth="1.5"
            className="drop-shadow-[0_0_8px_rgba(234,88,12,0.9)]"
          />
          {/* Subtle downward pointer */}
          <polygon points="-3,5 3,5 0,9" fill="#ea580c" />
        </g>
      )}

      {/* ── Selection Focus / Target Halo ── */}
      {isSelected && (
        <circle
          r={RADIUS + 14}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeDasharray="6 4"
          className="animate-spin-slow origin-center opacity-90 drop-shadow-[0_0_12px_#38bdf8]"
        />
      )}

      {/* ── In Progress Restrained Breathing Outer Aura ── */}
      {isInProgress && (
        <>
          <circle
            r={OUTER_GLOW_RADIUS}
            fill="none"
            stroke="#ea580c"
            strokeWidth="2"
            className="aura-breathe origin-center"
          />
          <circle
            r={RADIUS + 5}
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            opacity="0.85"
            className="drop-shadow-[0_0_12px_rgba(234,88,12,0.7)]"
          />
        </>
      )}

      {/* ── Available Pulsing Aura ── */}
      {isAvailable && (
        <circle
          r={RADIUS + 5}
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="2.5"
          opacity="0.75"
          className="drop-shadow-[0_0_10px_rgba(45,212,191,0.7)]"
        />
      )}

      {/* ── Mastered Outer Ring (like Europe reference) ── */}
      {isMastered && (
        <circle
          r={RADIUS + 4}
          fill="none"
          stroke={id === 'intro' ? '#0284c7' : id === 'quiz' ? '#f97316' : '#2dd4bf'}
          strokeWidth="2.5"
          opacity="0.85"
          className="drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"
        />
      )}

      {/* ── Locked Outer Ring ── */}
      {isLocked && (
        <circle
          r={RADIUS + 4}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          opacity="0.4"
        />
      )}

      {/* ── Main Node Plate Background ── */}
      <circle
        r={RADIUS}
        fill={
          isMastered
            ? '#10b981'
            : isInProgress
            ? '#ffffff'
            : isAvailable
            ? '#ffffff'
            : 'rgba(30, 41, 59, 0.75)'
        }
        stroke={
          isMastered
            ? '#ffffff'
            : isInProgress
            ? '#ea580c'
            : isAvailable
            ? '#2dd4bf'
            : '#64748b'
        }
        strokeWidth={isInProgress ? 5 : isAvailable ? 4 : 3}
        className="transition-colors duration-200 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
      />

      {/* ── Inner Accent Fill ── */}
      {isMastered && (
        <circle
          r={RADIUS - 4}
          fill="#10b981"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
        />
      )}

      {/* ── Icon Renderings ── */}
      {/* 1. Mastered Checkmark */}
      {isMastered && (
        <g transform="translate(0, 0)">
          <path
            d="M -11 -1 L -3 8 L 12 -7"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
          />
        </g>
      )}

      {/* 2. In Progress Question Mark (Bold Orange ? like reference) */}
      {isInProgress && (
        <text
          x="0"
          y="10"
          textAnchor="middle"
          fill="#ea580c"
          fontSize="30"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          className="select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
        >
          ?
        </text>
      )}

      {/* 3. Available Clipboard Icon (for Homework) */}
      {isAvailable && (
        <g transform="translate(-14, -15)">
          <rect
            x="4"
            y="6"
            width="20"
            height="23"
            rx="3"
            fill="#0f172a"
            stroke="#2dd4bf"
            strokeWidth="1.5"
          />
          {/* Clipboard Clip */}
          <rect x="9" y="3" width="10" height="5" rx="1.5" fill="#2dd4bf" />
          <circle cx="14" cy="5.5" r="1" fill="#0f172a" />
          {/* Checklist Lines */}
          <line x1="8" y1="12" x2="20" y2="12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="17" x2="20" y2="17" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="22" x2="16" y2="22" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {/* 4. Locked Padlock Icon */}
      {isLocked && (
        <g transform="translate(-13, -13)">
          {/* Shackle */}
          <path
            d="M 8 13 L 8 8 A 5 5 0 0 1 18 8 L 18 13"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Body */}
          <rect
            x="5"
            y="12"
            width="16"
            height="13"
            rx="2.5"
            fill="#475569"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          {/* Keyhole */}
          <circle cx="13" cy="17" r="1.5" fill="#0f172a" />
          <path d="M 12.2 18.5 L 13.8 18.5 L 13.5 21.5 L 12.5 21.5 Z" fill="#0f172a" />
        </g>
      )}

      {/* ── Label Pill Below Node ── */}
      <g transform={`translate(0, ${RADIUS + 16})`}>
        {/* Background rounded pill */}
        <rect
          x={-(label.length * 5.2 + 14)}
          y="-11"
          width={(label.length * 5.2 + 14) * 2}
          height="22"
          rx="6"
          fill="rgba(15, 23, 42, 0.88)"
          stroke={
            isSelected
              ? '#38bdf8'
              : isInProgress
              ? 'rgba(234, 88, 12, 0.6)'
              : 'rgba(255, 255, 255, 0.18)'
          }
          strokeWidth="1"
          className="drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)] backdrop-blur-sm"
        />

        {/* Text */}
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill={isLocked ? '#94a3b8' : '#f8fafc'}
          fontSize="11.5"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.2px"
          className="select-none"
        >
          {label}
        </text>

        {/* Small red notification indicator (seen on Intro in reference) */}
        {hasNotificationDot && (
          <circle
            cx="0"
            y="17"
            r="3.5"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="1"
            className="animate-pulse"
          />
        )}

        {/* Bonus XP label (seen as green +30 xp under Homework in reference) */}
        {bonusXpLabel && (
          <text
            x="0"
            y="23"
            textAnchor="middle"
            fill="#22c55e"
            fontSize="10"
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          >
            {bonusXpLabel}
          </text>
        )}
      </g>
    </g>
  )
})
