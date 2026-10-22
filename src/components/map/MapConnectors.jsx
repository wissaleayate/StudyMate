// SVG Connectors and Directed Progression Arrows between Learning Nodes
import { memo } from 'react'

export const MapConnectors = memo(function MapConnectors({
  connections,
  nodesMap
}) {
  const NODE_RADIUS = 35
  const ARROW_HEAD_LENGTH = 10

  return (
    <g className="map-connectors select-none pointer-events-none">
      <defs>
        {/* Teal arrowhead for completed & active paths */}
        <marker
          id="arrow-teal"
          viewBox="0 0 12 12"
          refX="10"
          refY="6"
          markerWidth="9"
          markerHeight="9"
          orient="auto-start-reverse"
        >
          <path d="M 1 2 L 11 6 L 1 10 L 3 6 Z" fill="#2dd4bf" />
        </marker>

        {/* Orange arrowhead for current quest in-progress path */}
        <marker
          id="arrow-orange"
          viewBox="0 0 12 12"
          refX="10"
          refY="6"
          markerWidth="9"
          markerHeight="9"
          orient="auto-start-reverse"
        >
          <path d="M 1 2 L 11 6 L 1 10 L 3 6 Z" fill="#f97316" />
        </marker>

        {/* Muted arrowhead for locked future routes */}
        <marker
          id="arrow-muted"
          viewBox="0 0 12 12"
          refX="10"
          refY="6"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 1 2 L 11 6 L 1 10 L 3 6 Z" fill="#64748b" />
        </marker>

        {/* Glow filter for active paths */}
        <filter id="path-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {connections.map((conn, idx) => {
        const fromNode = nodesMap[conn.from]
        const toNode = nodesMap[conn.to]

        if (!fromNode || !toNode) return null

        // Vector math to offset line start and end by node radius
        const dx = toNode.x - fromNode.x
        const dy = toNode.y - fromNode.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= NODE_RADIUS * 2) return null

        const ux = dx / distance
        const uy = dy / distance

        // Offset from circle centers
        const startX = fromNode.x + ux * NODE_RADIUS
        const startY = fromNode.y + uy * NODE_RADIUS
        const endX = toNode.x - ux * (NODE_RADIUS + ARROW_HEAD_LENGTH * 0.8)
        const endY = toNode.y - uy * (NODE_RADIUS + ARROW_HEAD_LENGTH * 0.8)

        const isCompleted = conn.status === 'completed'
        const isInProgress = conn.status === 'in_progress'
        const isAvailable = conn.status === 'available'
        const isLocked = conn.status === 'locked'

        let strokeColor = '#2dd4bf'
        let strokeWidth = 3.5
        let strokeDasharray = 'none'
        let marker = 'url(#arrow-teal)'
        let lineClass = ''

        if (isInProgress) {
          strokeColor = '#f97316'
          strokeWidth = 3.5
          strokeDasharray = '8 6'
          marker = 'url(#arrow-orange)'
          lineClass = 'path-active'
        } else if (isAvailable) {
          strokeColor = '#2dd4bf'
          strokeWidth = 3
          strokeDasharray = '8 6'
          marker = 'url(#arrow-teal)'
          lineClass = 'path-active'
        } else if (isLocked) {
          strokeColor = '#64748b'
          strokeWidth = 2
          strokeDasharray = '6 6'
          marker = 'url(#arrow-muted)'
        }

        return (
          <g key={`edge-${conn.from}-${conn.to}-${idx}`}>
            {/* Subtle shadow track under path */}
            <line
              x1={startX}
              y1={startY + 2}
              x2={endX}
              y2={endY + 2}
              stroke="rgba(0, 0, 0, 0.4)"
              strokeWidth={strokeWidth + 2}
              strokeLinecap="round"
            />

            {/* Glowing path line */}
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              markerEnd={marker}
              className={lineClass}
              filter={isCompleted || isInProgress ? 'url(#path-glow)' : undefined}
            />
          </g>
        )
      })}
    </g>
  )
})
