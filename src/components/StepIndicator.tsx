interface Props {
  current: number
  total: number
}

export default function StepIndicator({ current, total }: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <span style={{ fontSize: 11, color: '#52525B', fontWeight: 500 }}>
          {current} / {total}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 2, background: '#1A1A1D' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${(current / total) * 100}%`,
            background: '#0891B2',
            transition: 'width 300ms ease',
          }}
        />
      </div>
    </div>
  )
}
