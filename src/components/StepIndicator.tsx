interface Props {
  current: number
  total: number
}

export default function StepIndicator({ current, total }: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <span className="label-upper">
          Passo {current} de {total}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div className="w-full overflow-hidden" style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{
          height: '100%',
          borderRadius: 2,
          width: `${(current / total) * 100}%`,
          background: 'linear-gradient(90deg, var(--accent), var(--accent-strong))',
          boxShadow: '0 0 8px var(--accent-glow)',
          transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
    </div>
  )
}
