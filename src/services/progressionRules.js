// Progression Rules: Pure JavaScript functions for XP, quiz attempts, and prerequisite unlocks
// Separated from UI components to maintain strict, deterministic progression logic

export const XP_AWARDS = {
  FIRST_TRY_CORRECT: 10,
  RECOVERY_CORRECT: 5
}

/**
 * Calculates whether XP should be awarded for a quiz or recovery attempt.
 * Guarantees zero duplicate XP awards if an objective is retried or revisited.
 *
 * @param {string} nodeId - The concept node identifier
 * @param {boolean} isCorrect - Whether the submitted answer was correct
 * @param {boolean} isRecovery - Whether this attempt was part of a recovery quest
 * @param {Record<string, { earnedXp: number, firstTryAwarded: boolean, recoveryAwarded: boolean }>} awardedXpMap
 * @returns {{ xpToAward: number, updatedRecord: object }}
 */
export function evaluateXpAward(nodeId, isCorrect, isRecovery, awardedXpMap = {}) {
  const currentRecord = awardedXpMap[nodeId] || {
    earnedXp: 0,
    firstTryAwarded: false,
    recoveryAwarded: false
  }

  if (!isCorrect) {
    return {
      xpToAward: 0,
      updatedRecord: currentRecord
    }
  }

  let xpToAward = 0
  const updatedRecord = { ...currentRecord }

  if (!isRecovery) {
    // Standard First-Try Quiz
    if (!currentRecord.firstTryAwarded) {
      xpToAward = XP_AWARDS.FIRST_TRY_CORRECT
      updatedRecord.firstTryAwarded = true
      updatedRecord.earnedXp += xpToAward
    }
  } else {
    // Recovery Quest Follow-up
    if (!currentRecord.recoveryAwarded && !currentRecord.firstTryAwarded) {
      xpToAward = XP_AWARDS.RECOVERY_CORRECT
      updatedRecord.recoveryAwarded = true
      updatedRecord.earnedXp += xpToAward
    }
  }

  return {
    xpToAward,
    updatedRecord
  }
}

/**
 * Determines whether a concept has reached mastered status based on attempts history.
 *
 * @param {Array<{ isCorrect: boolean }>} attempts
 * @returns {boolean}
 */
export function isConceptMastered(attempts = []) {
  if (!attempts || attempts.length === 0) return false
  return attempts.some((att) => att.isCorrect)
}

/**
 * Evaluates node unlock requirements across the knowledge graph.
 * A node is unlocked if and only if all of its prerequisite node IDs are mastered.
 *
 * @param {Array<object>} nodes - Current array of nodes
 * @param {Array<object>} connections - Current array of graph edges
 * @param {Record<string, boolean>} masteredMap - Map of nodeId -> isMastered
 * @returns {{ updatedNodes: Array<object>, updatedConnections: Array<object> }}
 */
export function evaluateGraphProgression(nodes, connections, masteredMap) {
  const updatedNodes = nodes.map((node) => {
    // If already mastered, keep mastered
    if (masteredMap[node.id]) {
      return { ...node, status: 'mastered' }
    }

    // Check prerequisites
    const prereqs = node.prerequisites || []
    if (prereqs.length === 0) {
      // Root node with no prerequisites remains available/in_progress
      return node.status === 'locked' ? { ...node, status: 'available' } : node
    }

    const allPrereqsMastered = prereqs.every((pId) => Boolean(masteredMap[pId]))

    if (allPrereqsMastered) {
      // Promoted from locked to available
      return node.status === 'locked' ? { ...node, status: 'available' } : node
    }

    // Still locked
    return { ...node, status: 'locked' }
  })

  // Update edges based on node states
  const nodeStatusMap = Object.fromEntries(updatedNodes.map((n) => [n.id, n.status]))

  const updatedConnections = connections.map((conn) => {
    const fromStatus = nodeStatusMap[conn.from]
    const toStatus = nodeStatusMap[conn.to]

    if (fromStatus === 'mastered' && toStatus === 'mastered') {
      return { ...conn, status: 'completed' }
    }
    if (toStatus === 'available' || toStatus === 'in_progress') {
      return { ...conn, status: 'available' }
    }
    if (toStatus === 'locked') {
      return { ...conn, status: 'locked' }
    }
    return conn
  })

  return {
    updatedNodes,
    updatedConnections
  }
}
