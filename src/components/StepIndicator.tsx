interface Props {
  current: number
  total: number
}

export default function StepIndicator({ current, total }: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <span className="text-xs" style={{ color: '#6B6B6B' }}>
          Passo {current} / {total}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 4, background: '#1E1E1E' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${(current / total) * 100}%`,
            background: '#3B82F6',
            transition: 'width 300ms ease',
          }}
        />
      </div>
    </div>
  )
}
