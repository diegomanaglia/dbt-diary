interface Props {
  label: string
  value: number
  onChange: (val: number) => void
}

export default function MoodSlider({ label, value, onChange }: Props) {
  const getLabel = (v: number) => {
    if (v <= 2) return 'Muito baixo'
    if (v <= 4) return 'Baixo'
    if (v <= 6) return 'Neutro'
    if (v <= 8) return 'Bom'
    return 'Otimo'
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{getLabel(value)}</span>
          <span className="text-lg font-bold" style={{ color: 'var(--accent)', minWidth: 24, textAlign: 'right' }}>
            {value}
          </span>
        </div>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{ height: 44 }}
      />
      <div className="flex justify-between">
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>1</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>5</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>10</span>
      </div>
    </div>
  )
}
