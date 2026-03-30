interface Props {
  message?: string
}

export default function EmptyState({ message = 'Nenhum registro ainda.' }: Props) {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-sm" style={{ color: '#6B6B6B' }}>
        {message}
      </p>
    </div>
  )
}
