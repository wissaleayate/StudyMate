// Starfield background — deterministically placed twinkling stars
const STATIC_STARS = Array.from({ length: 120 }, (_, i) => {
  const x = (i * 37.13) % 100
  const y = (i * 73.41) % 100
  const size = ((i * 17) % 25) / 10 + 0.8
  const dur = (((i * 23) % 40) / 10 + 2).toFixed(1) + 's'
  const delay = (((i * 31) % 50) / 10).toFixed(1) + 's'
  const opacity = (((i * 19) % 50) / 100 + 0.3).toFixed(2)

  return { id: i, x, y, size, dur, delay, opacity }
})

export default function StarField({ count = 80 }) {
  const visibleStars = STATIC_STARS.slice(0, count)

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {visibleStars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            left: s.x + '%',
            top: s.y + '%',
            width: s.size + 'px',
            height: s.size + 'px',
            opacity: s.opacity,
            '--dur': s.dur,
            '--delay': s.delay
          }}
        />
      ))}
    </div>
  )
}
