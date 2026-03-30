interface Props {
  label: string
  value: number
  onChange: (val: number) => void
}

export default function MoodSlider({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm" style={{ color: '#E5E5E5' }}>
          {label}
        </span>
        <span className="text-sm font-medium" style={{ color: '#3B82F6' }}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{
          accentColor: '#3B82F6',
          height: 44,
        }}
      />
      <div className="flex justify-between">
        <span className="text-xs" style={{ color: '#6B6B6B' }}>1</span>
        <span className="text-xs" style={{ color: '#6B6B6B' }}>10</span>
      </div>
    </div>
  )
}
