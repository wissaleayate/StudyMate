// Starfield background — randomly placed twinkling stars
import { useMemo } from 'react'

export default function StarField({ count = 120 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      dur: (Math.random() * 4 + 2).toFixed(1) + 's',
      delay: (Math.random() * 5).toFixed(1) + 's',
      opacity: Math.random() * 0.5 + 0.2,
    }))
  }, [count])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map(s => (
        <span
          key={s.id}
          className="star"
          style={{
            left: s.x + '%',
            top:  s.y + '%',
            width:  s.size + 'px',
            height: s.size + 'px',
            opacity: s.opacity,
            '--dur':   s.dur,
            '--delay': s.delay,
          }}
        />
      ))}
    </div>
  )
}
