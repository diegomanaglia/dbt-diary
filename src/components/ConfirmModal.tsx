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
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm p-8 glass"
        style={{ borderRadius: 20, boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 btn-ghost text-sm font-medium"
            style={{ minHeight: 48 }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-sm font-semibold"
            style={{
              background: 'var(--error)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              minHeight: 48,
              borderRadius: 14,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
