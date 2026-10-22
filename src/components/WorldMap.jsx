// Main Learning World Map Component
// Faithfully reproduces the composition, perspective, and UI of design-reference.png
// Consumes shared StudyContext for seamless synchronization with the surrounding AppShell

import { useState, useEffect, useCallback, useRef } from 'react'
import { MAP_DIMENSIONS } from '../data/nodesData'
import { MapNode } from './map/MapNode'
import { MapConnectors } from './map/MapConnectors'
import { MapHUD } from './map/MapHUD'
import { NodeDetailDrawer } from './map/NodeDetailDrawer'
import { QuestPlayerModal } from './map/QuestPlayerModal'
import { CurrentQuestPanel } from './shell/CurrentQuestPanel'
import { useStudy } from '../context/useStudy'
import { playSound } from '../services/soundEffects'

export default function WorldMap({ onBackToAuth }) {
  const {
    nodes,
    nodesMap,
    connections,
    currentLesson,
    totalXp,
    completedCount,
    totalCount,
    currentQuest,
    selectedNode,
    setSelectedNode,
    activeQuestNode,
    setActiveQuestNode,
    completeNode,
    audioEnabled,
    setAudioEnabled,
    setIsLessonSelectOpen
  } = useStudy()

  // Local canvas controls
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [currentWorld, setCurrentWorld] = useState('Europe')

  const mapContainerRef = useRef(null)

  // Node selection handler
  const handleSelectNode = useCallback(
    (node) => {
      if (audioEnabled) playSound('select')
      setSelectedNode(node)
    },
    [audioEnabled, setSelectedNode]
  )

  // Start quest from detail drawer
  const handleStartQuest = useCallback(
    (node) => {
      setSelectedNode(null)
      setActiveQuestNode(node)
    },
    [setSelectedNode, setActiveQuestNode]
  )

  // Review completed quest
  const handleReviewQuest = useCallback(
    (node) => {
      setSelectedNode(null)
      setActiveQuestNode(node)
    },
    [setSelectedNode, setActiveQuestNode]
  )

  // Quest completion handler
  const handleCompleteNode = useCallback(
    (nodeId, earnedXp) => {
      if (audioEnabled) playSound('victory')
      completeNode(nodeId, earnedXp)
    },
    [audioEnabled, completeNode]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedNode(null)
        setActiveQuestNode(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSelectedNode, setActiveQuestNode])

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.15, 1.8))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.15, 0.75))
  const handleResetView = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  const activeObjectiveTitle = currentQuest?.subtitle || currentQuest?.label || 'Summit Falls'

  return (
    <div
      ref={mapContainerRef}
      className="relative w-full h-full min-h-0 bg-[#0d1222] overflow-hidden select-none flex items-center justify-center"
    >
      {/* ── Atmospheric Vignette & Ocean Horizon Lighting ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 48%, transparent 45%, rgba(10, 15, 30, 0.45) 85%, rgba(6, 9, 20, 0.85) 100%)'
        }}
        aria-hidden="true"
      />

      {/* ── Top HUD (Exact match from design-reference.png) ── */}
      <MapHUD
        currentWorld={currentLesson?.realm || currentWorld}
        completedCount={completedCount}
        totalCount={totalCount}
        userXp={totalXp}
        activeObjective={activeObjectiveTitle}
        onClose={() => {
          if (onBackToAuth) onBackToAuth()
          else setSelectedNode(null)
        }}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onWorldChange={setCurrentWorld}
        onOpenLessonSelect={() => setIsLessonSelectOpen(true)}
        isAudioOn={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
      />

      {/* ── Main Map Canvas Container (Aspect Ratio 1280:936 Preserved without Clipping) ── */}
      <main
        className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 min-h-0 overflow-hidden"
        role="region"
        aria-label="Interactive Learning World Map"
      >
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out origin-center select-none"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {/* Master SVG World Canvas - Sized to fit both width and height */}
          <svg
            viewBox={`0 0 ${MAP_DIMENSIONS.width} ${MAP_DIMENSIONS.height}`}
            className="block rounded-xl md:rounded-2xl shadow-2xl overflow-hidden select-none drop-shadow-2xl"
            preserveAspectRatio="xMidYMid meet"
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
              aspectRatio: `${MAP_DIMENSIONS.width} / ${MAP_DIMENSIONS.height}`
            }}
          >
            {/* Base 3D Island Artwork Layer */}
            <image
              href="/island-clean.jpg"
              width={MAP_DIMENSIONS.width}
              height={MAP_DIMENSIONS.height}
              preserveAspectRatio="xMidYMid meet"
            />

            {/* Directed Connectors & Flowing Progression Paths */}
            <MapConnectors
              connections={connections}
              nodesMap={nodesMap}
            />

            {/* Reusable Learning Nodes Layer */}
            <g className="map-nodes">
              {nodes.map((node) => (
                <MapNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  onSelect={handleSelectNode}
                />
              ))}
            </g>
          </svg>
        </div>
      </main>

      {/* Floating Active Objective Panel in Lower-Left of Map Viewport */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20 pointer-events-auto">
        <CurrentQuestPanel />
      </div>

      {/* Slide-over Concept Details Drawer */}
      {selectedNode && !activeQuestNode && (
        <NodeDetailDrawer
          node={selectedNode}
          nodesMap={nodesMap}
          onClose={() => setSelectedNode(null)}
          onStartQuest={handleStartQuest}
          onReviewQuest={handleReviewQuest}
        />
      )}

      {/* Full Interactive Learning & Quiz Experience Modal */}
      {activeQuestNode && (
        <QuestPlayerModal
          node={activeQuestNode}
          onClose={() => setActiveQuestNode(null)}
          onCompleteNode={handleCompleteNode}
        />
      )}
    </div>
  )
}
