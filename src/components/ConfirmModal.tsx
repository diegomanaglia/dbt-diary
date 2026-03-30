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
      className="fixed inset-0 flex items-center justify-center z-50 px-6"
      style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#111113', border: '1px solid #1A1A1D' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-base font-medium mb-2" style={{ color: '#FAFAFA' }}>
          {title}
        </h3>
        <p className="text-sm mb-6" style={{ color: '#52525B', lineHeight: 1.6 }}>
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{
              background: '#1A1A1D',
              border: '1px solid #27272A',
              color: '#A1A1AA',
              cursor: 'pointer',
              minHeight: 44,
              transition: 'border-color 200ms',
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
              transition: 'opacity 200ms',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
