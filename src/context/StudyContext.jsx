// Shared Study & World Map Application State Context
import { useState, useEffect, useMemo, useCallback } from 'react'
import { StudyContext } from './StudyContextInstance'
import { INITIAL_NODES, MAP_CONNECTIONS } from '../data/nodesData.js'
import { CURRENT_LESSON } from '../data/lessonData.js'
import {
  evaluateXpAward,
  evaluateGraphProgression
} from '../services/progressionRules.js'

export function StudyProvider({ children, initialUser, onLogout }) {
  // ── User Session ──
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lq_current_user')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return initialUser || { username: 'QuestMaster', avatar: 'warrior', xp: 420, level: 2 }
  })

  // ── Node States ──
  const [nodes, setNodes] = useState(() => {
    try {
      const saved = localStorage.getItem('studymate_nodes_state')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return INITIAL_NODES
  })

  // ── Connection Edges ──
  const [connections, setConnections] = useState(() => {
    try {
      const saved = localStorage.getItem('studymate_connections_state')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return MAP_CONNECTIONS
  })

  // ── Quiz Attempts History ──
  const [quizAttempts, setQuizAttempts] = useState(() => {
    try {
      const saved = localStorage.getItem('studymate_quiz_attempts')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // ── Awarded XP Map to strictly prevent duplicate awards ──
  const [awardedXpMap, setAwardedXpMap] = useState(() => {
    try {
      const saved = localStorage.getItem('studymate_awarded_xp')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // ── Navigation View: 'world' | 'flashcards' | 'progress' | 'settings' ──
  const [currentView, setCurrentView] = useState('world')
  const [currentLesson, setCurrentLessonState] = useState(CURRENT_LESSON)
  const [isLessonSelectOpen, setIsLessonSelectOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  // ── Selection & Active Quest ──
  const [selectedNode, setSelectedNode] = useState(null)
  const [activeQuestNode, setActiveQuestNode] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [xpToast, setXpToast] = useState(null)

  // Clear XP Toast after 2.5s
  useEffect(() => {
    if (!xpToast) return
    const timer = setTimeout(() => {
      setXpToast(null)
    }, 2500)
    return () => clearTimeout(timer)
  }, [xpToast])

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('studymate_nodes_state', JSON.stringify(nodes))
      localStorage.setItem('studymate_connections_state', JSON.stringify(connections))
      localStorage.setItem('studymate_quiz_attempts', JSON.stringify(quizAttempts))
      localStorage.setItem('studymate_awarded_xp', JSON.stringify(awardedXpMap))
      if (user) {
        localStorage.setItem('lq_current_user', JSON.stringify(user))
      }
    } catch {
      // ignore
    }
  }, [nodes, connections, quizAttempts, awardedXpMap, user])

  // Switch Lesson Handler
  const setCurrentLesson = useCallback((lesson) => {
    setCurrentLessonState(lesson)
    if (lesson.nodes) {
      setNodes(lesson.nodes)
    }
    if (lesson.connections) {
      setConnections(lesson.connections)
    }
    setSelectedNode(null)
    setActiveQuestNode(null)
  }, [])

  // ── Derived Level & XP Metrics ──
  const totalXp = user?.xp ?? 420
  const currentLevel = Math.max(1, Math.floor(totalXp / 200) + 1)
  const xpInCurrentLevel = totalXp % 200
  const xpRequiredForNextLevel = 200
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100))

  // ── Derived Objective Counts ──
  const totalCount = nodes.length
  const completedCount = useMemo(() => nodes.filter((n) => n.status === 'mastered').length, [nodes])
  const inProgressCount = useMemo(() => nodes.filter((n) => n.status === 'in_progress').length, [nodes])
  const availableCount = useMemo(() => nodes.filter((n) => n.status === 'available').length, [nodes])
  const lockedCount = useMemo(() => nodes.filter((n) => n.status === 'locked').length, [nodes])
  const remainingCount = totalCount - completedCount
  const masteryPercent = Math.round((completedCount / totalCount) * 100)

  // Current primary active quest objective
  const currentQuest = useMemo(() => {
    return (
      nodes.find((n) => n.status === 'in_progress') ||
      nodes.find((n) => n.status === 'available') ||
      nodes[0]
    )
  }, [nodes])

  // Nodes map by ID
  const nodesMap = useMemo(() => {
    return Object.fromEntries(nodes.map((n) => [n.id, n]))
  }, [nodes])

  // Mastered map by ID
  const masteredMap = useMemo(() => {
    return Object.fromEntries(nodes.map((n) => [n.id, n.status === 'mastered']))
  }, [nodes])

  // ── Record Quiz Attempt & Enforce Pure Progression Rules ──
  const recordQuizAttempt = useCallback(
    ({ nodeId, selectedOptionIndex, isCorrect, isRecovery = false }) => {
      const { xpToAward, updatedRecord } = evaluateXpAward(
        nodeId,
        isCorrect,
        isRecovery,
        awardedXpMap
      )

      setAwardedXpMap((prev) => ({
        ...prev,
        [nodeId]: updatedRecord
      }))

      if (xpToAward > 0) {
        setUser((prev) => {
          const nextXp = (prev?.xp ?? 0) + xpToAward
          const nextLvl = Math.floor(nextXp / 200) + 1
          return { ...prev, xp: nextXp, level: nextLvl }
        })

        setXpToast({
          id: Date.now(),
          amount: xpToAward,
          title: isRecovery ? 'RECOVERY COMPLETE' : 'OBJECTIVE MASTERED',
          isRecovery
        })
      }

      const newAttempt = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        nodeId,
        selectedOptionIndex,
        isCorrect,
        isRecovery,
        xpAwarded: xpToAward,
        timestamp: Date.now()
      }

      setQuizAttempts((prev) => [newAttempt, ...prev])

      if (isCorrect) {
        const nextMasteredMap = { ...masteredMap, [nodeId]: true }
        const { updatedNodes, updatedConnections } = evaluateGraphProgression(
          nodes,
          connections,
          nextMasteredMap
        )

        setNodes(updatedNodes)
        setConnections(updatedConnections)
      } else {
        setNodes((prevNodes) =>
          prevNodes.map((n) => (n.id === nodeId ? { ...n, status: 'in_progress' } : n))
        )
      }

      return {
        xpToAward,
        isCorrect,
        isRecovery
      }
    },
    [awardedXpMap, masteredMap, nodes, connections]
  )

  // ── Manual complete node backward compatibility ──
  const completeNode = useCallback(
    (nodeId) => {
      recordQuizAttempt({
        nodeId,
        selectedOptionIndex: 0,
        isCorrect: true,
        isRecovery: false
      })
    },
    [recordQuizAttempt]
  )

  // ── Set User Avatar ──
  const setAvatar = useCallback((avatarId) => {
    setUser((prev) => ({
      ...prev,
      avatar: avatarId
    }))
  }, [])

  // ── Reset Progress Action ──
  const resetProgress = useCallback(() => {
    localStorage.removeItem('studymate_nodes_state')
    localStorage.removeItem('studymate_connections_state')
    localStorage.removeItem('studymate_quiz_attempts')
    localStorage.removeItem('studymate_awarded_xp')
    setNodes(INITIAL_NODES)
    setConnections(MAP_CONNECTIONS)
    setQuizAttempts([])
    setAwardedXpMap({})
    setUser((prev) => ({ ...prev, xp: 420, level: 2 }))
    setSelectedNode(null)
    setActiveQuestNode(null)
  }, [])

  const value = {
    user,
    nodes,
    nodesMap,
    masteredMap,
    connections,
    currentLesson,
    setCurrentLesson,
    isLessonSelectOpen,
    setIsLessonSelectOpen,
    uploadedFile,
    setUploadedFile,
    quizAttempts,
    awardedXpMap,
    recordQuizAttempt,
    currentView,
    setCurrentView,
    selectedNode,
    setSelectedNode,
    activeQuestNode,
    setActiveQuestNode,
    totalXp,
    currentLevel,
    xpInCurrentLevel,
    xpRequiredForNextLevel,
    levelProgressPercent,
    totalCount,
    completedCount,
    inProgressCount,
    availableCount,
    lockedCount,
    remainingCount,
    masteryPercent,
    currentQuest,
    audioEnabled,
    setAudioEnabled,
    xpToast,
    setXpToast,
    setAvatar,
    completeNode,
    resetProgress,
    onLogout
  }

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
}
