import type { ChainLink } from '../db'

const typeConfig: Record<string, { color: string; label: string }> = {
  pensamento: { color: '#06B6D4', label: 'Pensamento' },
  sentimento: { color: '#FBBF24', label: 'Sentimento' },
  sensacao: { color: '#A78BFA', label: 'Sensacao' },
  acao: { color: '#F87171', label: 'Acao' },
  evento: { color: '#34D399', label: 'Evento' },
}

interface Props {
  links: ChainLink[]
}

export default function ChainTimeline({ links }: Props) {
  if (links.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Nenhum elo adicionado.
      </p>
    )
  }

  return (
    <div className="flex flex-col">
      {links.map((link, i) => {
        const config = typeConfig[link.type] || { color: '#94A3B8', label: link.type }
        return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: config.color, boxShadow: `0 0 8px ${config.color}50`,
                marginTop: 4, border: '2px solid var(--bg-base)',
              }} />
              {i < links.length - 1 && (
                <div style={{ width: 2, flex: 1, minHeight: 20, borderRadius: 1, background: `linear-gradient(to bottom, ${config.color}30, rgba(255,255,255,0.04))` }} />
              )}
            </div>
            <div className="pb-5 flex-1 min-w-0">
              <span className="badge" style={{ background: `${config.color}15`, color: config.color, marginBottom: 6 }}>
                {config.label}
              </span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {link.content}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
