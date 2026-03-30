interface Props {
  label: string
  value: number
  onChange: (val: number) => void
}

export default function MoodSlider({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm" style={{ color: '#A1A1AA' }}>
          {label}
        </span>
        <span className="text-sm font-semibold" style={{ color: '#0891B2' }}>
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
        style={{ height: 44 }}
      />
      <div className="flex justify-between">
        <span style={{ fontSize: 10, color: '#3F3F46', fontWeight: 500 }}>1</span>
        <span style={{ fontSize: 10, color: '#3F3F46', fontWeight: 500 }}>10</span>
      </div>
    </div>
  )
}
