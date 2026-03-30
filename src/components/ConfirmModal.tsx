interface Props {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirmar',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-5"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl p-5"
        style={{ background: '#141414', border: '1px solid #1E1E1E' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-base font-medium mb-2" style={{ color: '#E5E5E5' }}>
          {title}
        </h3>
        <p className="text-sm mb-5" style={{ color: '#6B6B6B' }}>
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              color: '#E5E5E5',
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{
              background: '#EF4444',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
