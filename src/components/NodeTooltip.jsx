// NodeTooltip — floating tooltip above a node (unused for now, kept for future use)
export default function NodeTooltip({ node, x, y }) {
  if (!node) return null
  return (
    <div
      className="node-tooltip fade-in"
      style={{ position: 'fixed', left: x, top: y - 60 }}
    >
      <span className="font-pixel text-[0.5rem] text-amber">{node.label}</span>
      <br />
      <span className="text-[var(--text-muted)] text-xs">{node.xp} XP</span>
    </div>
  )
}
