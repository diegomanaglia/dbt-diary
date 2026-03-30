interface DataPoint {
  date: Date
  mood: number
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
}

export default function MiniChart({ data, width = 320, height = 160 }: Props) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{ height, background: '#111113', border: '1px solid #1A1A1D' }}
      >
        <p className="text-sm" style={{ color: '#3F3F46' }}>
          Sem dados de humor
        </p>
      </div>
    )
  }

  const padding = { top: 20, right: 16, bottom: 30, left: 32 }
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

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ maxWidth: width }}
    >
      {/* Grid lines */}
      {[1, 3, 5, 7, 10].map(val => {
        const y = padding.top + h - ((val - minMood) / (maxMood - minMood)) * h
        return (
          <g key={val}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#1A1A1D"
              strokeWidth={1}
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fill="#3F3F46"
              fontSize={10}
              fontFamily="Inter, sans-serif"
            >
              {val}
            </text>
          </g>
        )
      })}

      {/* Gradient fill under the line */}
      <defs>
        <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0891B2" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0891B2" stopOpacity="0" />
        </linearGradient>
      </defs>
      {points.length > 1 && (
        <path
          d={`${linePath} L ${points[points.length - 1].x} ${padding.top + h} L ${points[0].x} ${padding.top + h} Z`}
          fill="url(#moodGradient)"
        />
      )}

      {/* Line */}
      <path d={linePath} fill="none" stroke="#0891B2" strokeWidth={1.5} />

      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#0891B2" />
      ))}
    </svg>
  )
}
