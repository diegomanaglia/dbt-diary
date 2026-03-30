interface Props {
  message?: string
}

export default function EmptyState({ message = 'Nenhum registro ainda.' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#27272A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <p className="text-sm" style={{ color: '#3F3F46' }}>
        {message}
      </p>
    </div>
  )
}
