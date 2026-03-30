interface DataPoint {
  date: Date
  mood: number
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
}

export default function MiniChart({ data, width = 320, height = 180 }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center glass" style={{ height }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sem dados de humor</p>
      </div>
    )
  }

  const padding = { top: 24, right: 16, bottom: 32, left: 36 }
  const w = width - padding.left - padding.right
  const h = height - padding.top - padding.bottom
  const minMood = 1
  const maxMood = 10

  const points = data.map((d, i) => {
    const x = padding.left + (data.length === 1 ? w / 2 : (i / (data.length - 1)) * w)
    const y = padding.top + h - ((d.mood - minMood) / (maxMood - minMood)) * h
    return { x, y, mood: d.mood }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  const curvePath = points.length > 2
    ? points.reduce((path, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`
        const prev = points[i - 1]
        const cpx1 = prev.x + (p.x - prev.x) * 0.4
        const cpx2 = p.x - (p.x - prev.x) * 0.4
        return `${path} C ${cpx1} ${prev.y} ${cpx2} ${p.y} ${p.x} ${p.y}`
      }, '')
    : linePath

  return (
    <div className="glass" style={{ padding: '4px 0', borderRadius: 16 }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxWidth: width }}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {[1, 3, 5, 7, 10].map(val => {
          const y = padding.top + h - ((val - minMood) / (maxMood - minMood)) * h
          return (
            <g key={val}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" fill="#475569" fontSize={10} fontFamily="Inter, sans-serif" fontWeight="500">{val}</text>
            </g>
          )
        })}
        {points.length > 1 && (
          <path d={`${curvePath} L ${points[points.length - 1].x} ${padding.top + h} L ${points[0].x} ${padding.top + h} Z`} fill="url(#chartGradient)" />
        )}
        <path d={curvePath} fill="none" stroke="#06B6D4" strokeWidth={3} strokeOpacity={0.3} filter="url(#glow)" />
        <path d={curvePath} fill="none" stroke="url(#lineGradient)" strokeWidth={2} strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill="#06B6D4" fillOpacity={0.2} />
            <circle cx={p.x} cy={p.y} r={3} fill="#06B6D4" />
          </g>
        ))}
      </svg>
    </div>
  )
}
