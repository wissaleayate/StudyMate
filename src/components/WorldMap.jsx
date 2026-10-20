// WorldMap.jsx — pixel-accurate reproduction of the isometric island map reference
// Single SVG canvas; nodes and edges are data-driven from nodeData.js
import { useState, useCallback, useRef, useEffect } from 'react'
import { MAP_NODES, MAP_EDGES } from '../data/nodeData'
import NodePanel from './NodePanel'

// ─── Re-export for HUDSidebar backward compat ────────────────────────────────
export { MAP_NODES }

// ─── SVG canvas dimensions (internal coordinate space) ───────────────────────
const W = 1200
const H = 800

// ─── Island terrain ───────────────────────────────────────────────────────────
function IslandTerrain() {
  return (
    <g>
      <defs>
        {/* Purple-blue ocean gradient matching reference */}
        <radialGradient id="ig-ocean" cx="50%" cy="55%" r="70%">
          <stop offset="0%"   stopColor="#6d6db5" stopOpacity="0.75" />
          <stop offset="45%"  stopColor="#4a4a8a" stopOpacity="0.9"  />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="1"    />
        </radialGradient>

        {/* Main island terra-cotta surface */}
        <radialGradient id="ig-surface" cx="48%" cy="42%" r="58%">
          <stop offset="0%"   stopColor="#d4874a" />
          <stop offset="40%"  stopColor="#b5621e" />
          <stop offset="100%" stopColor="#8b3f0d" />
        </radialGradient>

        {/* Cliff face (lit side) */}
        <linearGradient id="ig-cliff-lit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#e0935c" />
          <stop offset="100%" stopColor="#b5621e" />
        </linearGradient>

        {/* Cliff face (shadow side) */}
        <linearGradient id="ig-cliff-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#7a3610" />
          <stop offset="100%" stopColor="#4a1f06" />
        </linearGradient>

        {/* Valley floor sandy */}
        <radialGradient id="ig-valley" cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="#c8874a" />
          <stop offset="100%" stopColor="#9a5523" />
        </radialGradient>

        {/* Top-left plateau rocky grey */}
        <radialGradient id="ig-plateau-tl" cx="50%" cy="40%" r="60%">
          <stop offset="0%"  stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#4b5563" />
        </radialGradient>

        {/* Top-right plateau sandy */}
        <radialGradient id="ig-plateau-tr" cx="50%" cy="40%" r="60%">
          <stop offset="0%"  stopColor="#d4a566" />
          <stop offset="100%" stopColor="#8b5e2a" />
        </radialGradient>

        {/* Drop shadow filter */}
        <filter id="ig-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000" floodOpacity="0.45" />
        </filter>

        {/* Glow filter for active nodes */}
        <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Soft inner shadow for island */}
        <filter id="ig-inner" x="-5%" y="-5%" width="110%" height="120%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Tree blur for depth */}
        <filter id="tree-far" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* ── OCEAN ── */}
      <rect x="0" y="0" width={W} height={H} fill="url(#ig-ocean)" />

      {/* Ocean surface shimmer */}
      {[0.25, 0.38, 0.50, 0.62, 0.75, 0.87].map((yf, i) => (
        <ellipse
          key={`shimmer-${i}`}
          cx={W * 0.50} cy={H * yf}
          rx={W * (0.38 + i * 0.05)} ry={H * 0.018}
          fill="none" stroke="#8080cc" strokeWidth="1.2" opacity="0.18"
        />
      ))}

      {/* Scattered rock outcroppings in the sea */}
      {[
        [0.07, 0.70, 22, 10], [0.93, 0.65, 18, 9],
        [0.05, 0.45, 16, 8],  [0.92, 0.42, 14, 7],
        [0.12, 0.85, 12, 6],  [0.88, 0.82, 20, 9],
      ].map(([xf, yf, rw, rh], i) => (
        <ellipse key={`rock-${i}`} cx={W*xf} cy={H*yf} rx={rw} ry={rh}
          fill="#8b5e2a" opacity="0.6" />
      ))}

      {/* ── MAIN ISLAND BODY ── diamond/shield shape ── */}
      {/* This matches the reference: wide in the mid-section, tapers top and bottom */}
      <polygon
        filter="url(#ig-shadow)"
        fill="url(#ig-surface)"
        points={`
          ${W*0.50},${H*0.06}
          ${W*0.65},${H*0.11}
          ${W*0.80},${H*0.20}
          ${W*0.90},${H*0.33}
          ${W*0.90},${H*0.50}
          ${W*0.86},${H*0.63}
          ${W*0.78},${H*0.76}
          ${W*0.65},${H*0.86}
          ${W*0.50},${H*0.92}
          ${W*0.35},${H*0.86}
          ${W*0.22},${H*0.76}
          ${W*0.14},${H*0.63}
          ${W*0.10},${H*0.50}
          ${W*0.10},${H*0.33}
          ${W*0.20},${H*0.20}
          ${W*0.35},${H*0.11}
        `}
      />

      {/* ── TERRAIN SURFACE VARIATION ── */}
      {/* Central valley — lighter sandy terracotta */}
      <ellipse cx={W*0.50} cy={H*0.55} rx={W*0.22} ry={H*0.16}
        fill="url(#ig-valley)" opacity="0.6" />
      <ellipse cx={W*0.52} cy={H*0.48} rx={W*0.14} ry={H*0.10}
        fill="#c8874a" opacity="0.4" />

      {/* Path/road across island (sandy trail) */}
      <path
        d={`M${W*0.62},${H*0.75} Q${W*0.55},${H*0.65} ${W*0.50},${H*0.56}
            Q${W*0.45},${H*0.48} ${W*0.40},${H*0.38} Q${W*0.35},${H*0.32} ${W*0.28},${H*0.28}`}
        fill="none" stroke="#d4a566" strokeWidth="6" strokeLinecap="round" opacity="0.35"
      />

      {/* ── CLIFF FACES (isometric depth) ── */}
      {/* Front/bottom cliff faces — lit (warmer, lighter) */}
      <polygon fill="url(#ig-cliff-lit)" opacity="0.88"
        points={`
          ${W*0.22},${H*0.76}
          ${W*0.35},${H*0.86}
          ${W*0.35},${H*0.79}
          ${W*0.24},${H*0.70}
        `}
      />
      <polygon fill="#c97a3a" opacity="0.8"
        points={`
          ${W*0.35},${H*0.86}
          ${W*0.50},${H*0.92}
          ${W*0.50},${H*0.84}
          ${W*0.36},${H*0.79}
        `}
      />
      <polygon fill="url(#ig-cliff-lit)" opacity="0.82"
        points={`
          ${W*0.50},${H*0.92}
          ${W*0.65},${H*0.86}
          ${W*0.64},${H*0.78}
          ${W*0.50},${H*0.84}
        `}
      />
      <polygon fill="#b06828" opacity="0.85"
        points={`
          ${W*0.65},${H*0.86}
          ${W*0.78},${H*0.76}
          ${W*0.76},${H*0.67}
          ${W*0.64},${H*0.78}
        `}
      />

      {/* Left side cliff — shadowed */}
      <polygon fill="url(#ig-cliff-shadow)" opacity="0.75"
        points={`
          ${W*0.10},${H*0.50}
          ${W*0.14},${H*0.63}
          ${W*0.22},${H*0.76}
          ${W*0.24},${H*0.70}
          ${W*0.17},${H*0.58}
          ${W*0.12},${H*0.48}
        `}
      />

      {/* Right side cliff — shadowed */}
      <polygon fill="url(#ig-cliff-shadow)" opacity="0.7"
        points={`
          ${W*0.90},${H*0.50}
          ${W*0.86},${H*0.63}
          ${W*0.78},${H*0.76}
          ${W*0.76},${H*0.67}
          ${W*0.84},${H*0.55}
          ${W*0.88},${H*0.44}
        `}
      />

      {/* ── TOP-LEFT ELEVATED PLATEAU (grey rocky — matches reference upper-left) ── */}
      <polygon fill="url(#ig-plateau-tl)"
        points={`
          ${W*0.35},${H*0.11}
          ${W*0.20},${H*0.20}
          ${W*0.14},${H*0.36}
          ${W*0.18},${H*0.46}
          ${W*0.28},${H*0.42}
          ${W*0.35},${H*0.32}
          ${W*0.42},${H*0.25}
          ${W*0.42},${H*0.15}
        `}
      />
      {/* Plateau cliff face */}
      <polygon fill="#374151" opacity="0.7"
        points={`
          ${W*0.14},${H*0.36}
          ${W*0.18},${H*0.46}
          ${W*0.16},${H*0.48}
          ${W*0.10},${H*0.38}
        `}
      />
      {/* Rocky jagged top detail */}
      <polygon fill="#6b7280" opacity="0.9"
        points={`
          ${W*0.20},${H*0.20}
          ${W*0.24},${H*0.16}
          ${W*0.26},${H*0.19}
          ${W*0.30},${H*0.14}
          ${W*0.33},${H*0.18}
          ${W*0.30},${H*0.22}
          ${W*0.25},${H*0.21}
        `}
      />
      <polygon fill="#9ca3af" opacity="0.8"
        points={`
          ${W*0.24},${H*0.16}
          ${W*0.28},${H*0.12}
          ${W*0.32},${H*0.11}
          ${W*0.35},${H*0.14}
          ${W*0.33},${H*0.18}
          ${W*0.30},${H*0.14}
        `}
      />

      {/* ── TOP-RIGHT PLATEAU (sandy fortress plateau — matches reference upper-right) ── */}
      <polygon fill="url(#ig-plateau-tr)"
        points={`
          ${W*0.65},${H*0.11}
          ${W*0.58},${H*0.15}
          ${W*0.58},${H*0.26}
          ${W*0.65},${H*0.34}
          ${W*0.72},${H*0.30}
          ${W*0.80},${H*0.22}
          ${W*0.84},${H*0.14}
          ${W*0.78},${H*0.10}
        `}
      />
      {/* Plateau cliff */}
      <polygon fill="#7a4a1a" opacity="0.8"
        points={`
          ${W*0.65},${H*0.34}
          ${W*0.72},${H*0.30}
          ${W*0.70},${H*0.36}
          ${W*0.63},${H*0.40}
        `}
      />

      {/* ── RIVER / WATER CHANNEL ── */}
      {/* Main river through central valley */}
      <path
        d={`M${W*0.46},${H*0.28} Q${W*0.50},${H*0.38} ${W*0.49},${H*0.46}
            Q${W*0.48},${H*0.54} ${W*0.52},${H*0.62}`}
        fill="none" stroke="#4fa8c8" strokeWidth="7" strokeLinecap="round" opacity="0.55"
      />
      <path
        d={`M${W*0.46},${H*0.28} Q${W*0.50},${H*0.38} ${W*0.49},${H*0.46}
            Q${W*0.48},${H*0.54} ${W*0.52},${H*0.62}`}
        fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" opacity="0.4"
      />
      {/* River pond/lake in valley */}
      <ellipse cx={W*0.50} cy={H*0.66} rx={W*0.03} ry={H*0.02}
        fill="#4fa8c8" opacity="0.5" />

      {/* ── TREE CANOPIES ── placed carefully not to overlap node positions ── */}
      {[
        // [xFraction, yFraction, radius, opacity, farAway]
        // Top-left plateau trees
        [0.16, 0.22, 18, 1.0, false],
        [0.22, 0.17, 14, 1.0, false],
        [0.19, 0.30, 12, 0.9, false],
        [0.29, 0.20, 16, 1.0, false],
        // Central left
        [0.20, 0.42, 14, 0.9, false],
        [0.22, 0.52, 12, 0.85, false],
        // Top-right plateau trees
        [0.70, 0.15, 16, 1.0, false],
        [0.76, 0.12, 14, 1.0, false],
        [0.80, 0.20, 12, 0.9, false],
        [0.74, 0.22, 10, 0.9, false],
        // Central trees
        [0.37, 0.38, 15, 0.9, false],
        [0.42, 0.32, 12, 0.85, false],
        [0.55, 0.36, 13, 0.9, false],
        [0.58, 0.42, 10, 0.85, false],
        [0.40, 0.52, 12, 0.85, false],
        [0.36, 0.58, 14, 0.9, false],
        // Lower right area
        [0.66, 0.58, 12, 0.9, false],
        [0.60, 0.64, 10, 0.85, false],
        [0.58, 0.56, 12, 0.9, false],
        // Lower left
        [0.30, 0.72, 10, 0.8, false],
        [0.24, 0.66, 12, 0.85, false],
        // Right mid
        [0.76, 0.44, 14, 0.9, false],
        [0.80, 0.52, 12, 0.85, false],
        // Far background smaller (depth effect)
        [0.50, 0.18, 10, 0.7, true],
        [0.55, 0.14, 8,  0.7, true],
        [0.43, 0.22, 9,  0.7, true],
      ].map(([xf, yf, r, op, far], i) => {
        const cx = W * xf
        const cy = H * yf
        const filt = far ? 'url(#tree-far)' : undefined
        return (
          <g key={`tree-${i}`} filter={filt} opacity={op}>
            {/* Ground shadow */}
            <ellipse cx={cx + r * 0.5} cy={cy + r * 0.7} rx={r * 0.85} ry={r * 0.28}
              fill="#000" opacity="0.18" />
            {/* Trunk */}
            <rect x={cx - 2} y={cy} width={4} height={r * 0.6} fill="#5c3317" opacity="0.9" />
            {/* Three canopy tiers — dark green like reference */}
            <circle cx={cx} cy={cy - r * 0.15} r={r}      fill="#1a5e2e" />
            <circle cx={cx} cy={cy - r * 0.45} r={r * 0.73} fill="#22773a" />
            <circle cx={cx} cy={cy - r * 0.72} r={r * 0.48} fill="#2da44e" />
            {/* Highlight spot */}
            <circle cx={cx - r*0.25} cy={cy - r*0.55} r={r * 0.18}
              fill="#4ade80" opacity="0.35" />
          </g>
        )
      })}

      {/* ── TOP-LEFT CASTLE RUINS (matches reference — grey stone) ── */}
      <g transform={`translate(${W*0.155},${H*0.165})`} opacity="0.82">
        {/* Main walls */}
        <rect x={-2} y={14} width={52} height={24} rx={2} fill="#4b5563" />
        {/* Left tower */}
        <rect x={-6} y={4}  width={16} height={18} rx={2} fill="#6b7280" />
        {/* Right tower */}
        <rect x={40} y={4}  width={16} height={18} rx={2} fill="#6b7280" />
        {/* Battlements left */}
        {[0,5,10].map(dx => <rect key={dx} x={-6+dx} y={0} width={4} height={6} rx={1} fill="#9ca3af" />)}
        {/* Battlements right */}
        {[0,5,10].map(dx => <rect key={`r${dx}`} x={40+dx} y={0} width={4} height={6} rx={1} fill="#9ca3af" />)}
        {/* Gate arch */}
        <rect x={18} y={22} width={14} height={16} rx={2} fill="#1f2937" />
        {/* Top of arch */}
        <path d="M18,24 Q25,16 32,24" fill="#1f2937" />
        {/* Window slits */}
        <rect x={4}  y={16} width={4} height={8} rx={1} fill="#1f2937" opacity="0.8" />
        <rect x={42} y={16} width={4} height={8} rx={1} fill="#1f2937" opacity="0.8" />
      </g>

      {/* ── TOP-RIGHT FORTRESS (sandy stone) ── */}
      <g transform={`translate(${W*0.655},${H*0.125})`} opacity="0.80">
        {/* Platform base */}
        <rect x={0} y={18} width={68} height={28} rx={2} fill="#a37a3a" />
        {/* Left tower */}
        <rect x={-4} y={6}  width={18} height={20} rx={2} fill="#c4964e" />
        {/* Right tower */}
        <rect x={54} y={6}  width={18} height={20} rx={2} fill="#c4964e" />
        {/* Battlements */}
        {[0,5,10].map(dx => <rect key={dx}    x={-4+dx} y={2} width={4} height={6} rx={1} fill="#e0b46c" />)}
        {[0,5,10].map(dx => <rect key={`r${dx}`} x={54+dx} y={2} width={4} height={6} rx={1} fill="#e0b46c" />)}
        {/* Gate */}
        <rect x={24} y={26} width={18} height={20} rx={2} fill="#2d1a00" />
        <path d="M24,30 Q33,20 42,30" fill="#2d1a00" />
        {/* Windows */}
        <rect x={5}  y={14} width={5} height={8} rx={1} fill="#2d1a00" opacity="0.7" />
        <rect x={58} y={14} width={5} height={8} rx={1} fill="#2d1a00" opacity="0.7" />
      </g>

      {/* ── SHORELINE FOAM EDGES ── */}
      {[
        `M${W*0.10},${H*0.42} Q${W*0.12},${H*0.38} ${W*0.16},${H*0.32}`,
        `M${W*0.10},${H*0.58} Q${W*0.12},${H*0.65} ${W*0.18},${H*0.70}`,
        `M${W*0.82},${H*0.42} Q${W*0.88},${H*0.48} ${W*0.90},${H*0.55}`,
        `M${W*0.78},${H*0.72} Q${W*0.83},${H*0.78} ${W*0.78},${H*0.82}`,
        `M${W*0.35},${H*0.87} Q${W*0.42},${H*0.92} ${W*0.50},${H*0.93}`,
      ].map((d, i) => (
        <path key={`foam-${i}`} d={d}
          fill="none" stroke="#c8d8f0" strokeWidth="3"
          strokeLinecap="round" opacity="0.22" />
      ))}
    </g>
  )
}

// ─── Node icon SVGs ────────────────────────────────────────────────────────────
// Each icon is drawn in a 28×28 coordinate space, centered at (14,14)
function NodeIcon({ type, status }) {
  const S = 28
  const C = S / 2  // 14

  if (status === 'completed') {
    return (
      <g>
        <circle cx={C} cy={C} r={C - 1} fill="#22c55e" />
        {/* White checkmark */}
        <polyline
          points={`${S*0.22},${C} ${S*0.44},${S*0.68} ${S*0.78},${S*0.28}`}
          fill="none" stroke="#fff" strokeWidth="3.2"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
    )
  }

  if (status === 'active') {
    return (
      <g>
        <circle cx={C} cy={C} r={C - 1} fill="#e5643c" />
        <text x={C} y={C + 5.5} textAnchor="middle"
          fill="#fff" fontSize="15" fontWeight="900"
          fontFamily="Georgia, serif" style={{ fontStyle: 'italic' }}>
          ?
        </text>
      </g>
    )
  }

  if (status === 'locked') {
    return (
      <g>
        <circle cx={C} cy={C} r={C - 1} fill="#374151" opacity="0.9" />
        {/* Lock shackle */}
        <path d={`M${C-5},${C+1} L${C-5},${C-3} Q${C},${C-8.5} ${C+5},${C-3} L${C+5},${C+1}`}
          fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" />
        {/* Lock body */}
        <rect x={C-5.5} y={C} width="11" height="9" rx="2" fill="#6b7280" />
        {/* Keyhole */}
        <circle cx={C} cy={C+4} r="2" fill="#374151" />
        <rect x={C-1} y={C+4} width="2" height="3" fill="#374151" />
      </g>
    )
  }

  // Available status — render type-specific icon
  if (type === 'homework') {
    return (
      <g>
        <circle cx={C} cy={C} r={C - 1} fill="#1e2050" />
        {/* Clipboard */}
        <rect x={C-6} y={C-7.5} width="12" height="15" rx="2" fill="#9ca3af" />
        <rect x={C-4} y={C-5} width="8" height="2" rx="0.5" fill="#fff" />
        <rect x={C-4} y={C-2} width="8" height="2" rx="0.5" fill="#fff" />
        <rect x={C-4} y={C+1} width="5" height="2" rx="0.5" fill="#fff" />
        {/* Clip at top */}
        <rect x={C-3} y={C-9} width="6" height="3.5" rx="1" fill="#6b7280" />
      </g>
    )
  }
  if (type === 'quiz') {
    return (
      <g>
        <circle cx={C} cy={C} r={C - 1} fill="#1e2050" />
        <text x={C} y={C + 5.5} textAnchor="middle"
          fill="#f5a623" fontSize="15" fontWeight="900"
          fontFamily="Arial, sans-serif">
          Q
        </text>
      </g>
    )
  }
  // learn / objective fallback
  return (
    <g>
      <circle cx={C} cy={C} r={C - 1} fill="#1e2050" />
      <path d={`M${C-5},${C} L${C-1},${C+5} L${C+6},${C-5}`}
        fill="none" stroke="#f5a623" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

// ─── Single map node badge ─────────────────────────────────────────────────────
const NODE_R       = 24  // outer badge radius
const ICON_SIZE    = 28  // icon viewBox size

// Ring colors by status
const RING_CFG = {
  completed: { outer: '#2dd4bf', inner: '#22c55e', fill: 'rgba(34,197,94,0.15)',  glow: 'rgba(34,197,94,0.6)'  },
  active:    { outer: '#f5a623', inner: '#e5643c', fill: 'rgba(229,100,60,0.15)', glow: 'rgba(245,166,35,0.8)' },
  available: { outer: '#2dd4bf', inner: '#2dd4bf', fill: 'rgba(45,212,191,0.12)', glow: 'rgba(45,212,191,0.5)' },
  locked:    { outer: '#4b5563', inner: '#374151', fill: 'rgba(55,65,81,0.5)',     glow: 'none'                 },
}

function MapNodeBadge({ node, svgW, svgH, onSelect, selectedId }) {
  const [hovered, setHovered] = useState(false)

  const cx = (node.x / 100) * svgW
  const cy = (node.y / 100) * svgH

  const cfg        = RING_CFG[node.status] ?? RING_CFG.locked
  const isLocked   = node.status === 'locked'
  const isActive   = node.status === 'active'
  const isSelected = selectedId === node.id

  // Keyboard handler
  function handleKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
      e.preventDefault()
      onSelect(node)
    }
  }

  return (
    <g
      transform={`translate(${cx},${cy})`}
      onClick={() => !isLocked && onSelect(node)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-label={`${node.label} — ${node.status}`}
      aria-pressed={isSelected}
      style={{ cursor: isLocked ? 'not-allowed' : 'pointer', outline: 'none' }}
    >
      {/* Pulsing glow ring for active node */}
      {isActive && (
        <circle r={NODE_R + 12} fill="none"
          stroke={cfg.glow} strokeWidth="2" opacity="0.35"
          className="node-glow-pulse"
        />
      )}

      {/* Selection ring */}
      {isSelected && (
        <circle r={NODE_R + 9} fill="none"
          stroke="#f5a623" strokeWidth="2.5" opacity="0.85"
          strokeDasharray="5 3"
        />
      )}

      {/* Hover ring */}
      {hovered && !isLocked && !isSelected && (
        <circle r={NODE_R + 8} fill="none"
          stroke={cfg.outer} strokeWidth="1.5" opacity="0.5" />
      )}

      {/* Outer teal/white border ring (thick, matches reference) */}
      <circle r={NODE_R + 4}
        fill="rgba(11,12,26,0.7)"
        stroke={cfg.outer}
        strokeWidth={isActive ? 4 : 3}
      />

      {/* Inner coloured ring */}
      <circle r={NODE_R}
        fill={cfg.fill}
        stroke={cfg.inner}
        strokeWidth={2}
      />

      {/* Icon centered */}
      <g transform={`translate(${-ICON_SIZE/2},${-ICON_SIZE/2})`}>
        <NodeIcon type={node.type} status={node.status} />
      </g>

      {/* Label pill below node — dark background chip */}
      <g transform={`translate(0,${NODE_R + 12})`}>
        {/* Pill background */}
        <rect
          x={-Math.max(node.label.length * 4.8, 36) / 2}
          y={-8}
          width={Math.max(node.label.length * 4.8, 36)}
          height={16}
          rx={4}
          fill="rgba(11,12,26,0.82)"
          stroke={isLocked ? 'rgba(75,85,99,0.4)' : 'rgba(255,255,255,0.12)'}
          strokeWidth="0.8"
        />
        <text
          textAnchor="middle"
          y={4}
          fill={isLocked ? '#6b7280' : '#f0f1ff'}
          fontSize="9.5"
          fontFamily="'Press Start 2P', monospace"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {node.label}
        </text>
      </g>
    </g>
  )
}

// ─── Connection paths ─────────────────────────────────────────────────────────
function MapPaths({ svgW, svgH, selectedId }) {
  const nodeMap = Object.fromEntries(MAP_NODES.map(n => [n.id, n]))

  return (
    <g>
      <defs>
        <marker id="arrow-teal" markerWidth="9" markerHeight="7"
          refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 9 3.5, 0 7" fill="#2dd4bf" opacity="0.9" />
        </marker>
        <marker id="arrow-dim" markerWidth="9" markerHeight="7"
          refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 9 3.5, 0 7" fill="#4b5563" opacity="0.6" />
        </marker>
      </defs>

      {MAP_EDGES.map(({ from: fromId, to: toId }, i) => {
        const from = nodeMap[fromId]
        const to   = nodeMap[toId]
        if (!from || !to) return null

        const x1 = (from.x / 100) * svgW
        const y1 = (from.y / 100) * svgH
        const x2 = (to.x   / 100) * svgW
        const y2 = (to.y   / 100) * svgH

        const edgeCompleted = from.status !== 'locked'
        const edgeActive    = from.status !== 'locked' && to.status !== 'locked'

        // Shorten line ends so they don't overdraw into node circles
        const dx  = x2 - x1
        const dy  = y2 - y1
        const len = Math.sqrt(dx*dx + dy*dy)
        const trim = NODE_R + 7
        const ux  = dx / len
        const uy  = dy / len
        const sx1 = x1 + ux * (trim + 2)
        const sy1 = y1 + uy * (trim + 2)
        const sx2 = x2 - ux * (trim + 6)
        const sy2 = y2 - uy * (trim + 6)

        return (
          <line
            key={i}
            x1={sx1} y1={sy1} x2={sx2} y2={sy2}
            stroke={edgeActive ? '#2dd4bf' : '#374151'}
            strokeWidth={edgeActive ? 3 : 1.5}
            strokeLinecap="round"
            opacity={edgeActive ? 0.85 : 0.35}
            markerEnd={edgeActive ? 'url(#arrow-teal)' : 'url(#arrow-dim)'}
            className={edgeCompleted && edgeActive ? 'path-active' : ''}
            // No dash — reference uses solid teal lines
          />
        )
      })}
    </g>
  )
}

// ─── Main WorldMap component ───────────────────────────────────────────────────
export default function WorldMap({ user }) {
  const [selectedNode, setSelectedNode] = useState(null)
  const svgRef = useRef(null)

  const completedCount = MAP_NODES.filter(n => n.status === 'completed').length
  const totalXP        = MAP_NODES.filter(n => n.status === 'completed').reduce((s, n) => s + n.xp, 0)
  const progressPct    = Math.round((completedCount / MAP_NODES.length) * 100)

  // Close panel on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setSelectedNode(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleSelect = useCallback((node) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: '#0c1220' }}>

      {/* ── TOP HUD BAR (matches reference layout) ── */}
      <header
        className="relative z-20 flex items-center justify-between px-3 py-2"
        style={{
          background: 'rgba(11,12,30,0.88)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Left: back button + world title */}
        <div className="flex items-center gap-3">
          <button
            id="btn-world-back"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#e0e0f0',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            aria-label="Back to world select"
          >
            <span style={{ fontFamily: 'sans-serif', fontSize: '12px' }}>←</span>
            <span className="font-pixel" style={{ fontSize: '0.55rem' }}>Europe</span>
          </button>

          {/* Current objective label */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-inter text-xs" style={{ color: '#9ca3af' }}>
              Current: <span style={{ color: '#f5a623' }}>New Objective</span>
            </span>
          </div>
        </div>

        {/* Right: XP + progress + close */}
        <div className="flex items-center gap-3">
          {/* XP pill */}
          <div className="hidden sm:flex items-center gap-1.5"
            style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: '20px', padding: '4px 10px' }}>
            <span className="font-pixel text-amber" style={{ fontSize: '0.48rem' }}>⚡</span>
            <span className="font-pixel text-amber" style={{ fontSize: '0.5rem' }}>{totalXP} XP</span>
          </div>

          {/* Progress pill — "4/7" + bar */}
          <div className="flex items-center gap-2"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '5px 12px',
            }}>
            <span className="font-pixel" style={{ fontSize: '0.55rem', color: '#f0f1ff' }}>
              {completedCount}/{MAP_NODES.length}
            </span>
            <div style={{ width: '80px', height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
              <div style={{
                width: `${progressPct}%`,
                height: '100%',
                borderRadius: '4px',
                background: 'linear-gradient(90deg, #2dd4bf, #06b6d4)',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>

          {/* Close / X */}
          <button
            id="btn-map-close"
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors font-pixel"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#6b7280',
              fontSize: '0.6rem',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            aria-label="Close map"
          >
            ✕
          </button>
        </div>
      </header>

      {/* ── MAP CANVAS ── */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          role="main"
          aria-label="Learning world map"
          style={{ display: 'block', touchAction: 'manipulation' }}
        >
          {/* Terrain */}
          <IslandTerrain />

          {/* Paths — rendered before nodes so nodes appear on top */}
          <MapPaths svgW={W} svgH={H} selectedId={selectedNode?.id} />

          {/* Nodes */}
          {MAP_NODES.map(node => (
            <MapNodeBadge
              key={node.id}
              node={node}
              svgW={W}
              svgH={H}
              onSelect={handleSelect}
              selectedId={selectedNode?.id}
            />
          ))}
        </svg>

        {/* Vignette — soft edge darkening */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 48%, transparent 52%, rgba(6,8,24,0.65) 100%)',
          }}
          aria-hidden="true"
        />

        {/* ── NODE INFO PANEL ── slides in from the right ── */}
        <NodePanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  )
}
