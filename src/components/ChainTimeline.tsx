import type { ChainLink } from '../db'

const typeColors: Record<string, string> = {
  pensamento: '#0891B2',
  sentimento: '#F59E0B',
  sensacao: '#8B5CF6',
  acao: '#EF4444',
  evento: '#10B981',
}

const typeLabels: Record<string, string> = {
  pensamento: 'Pensamento',
  sentimento: 'Sentimento',
  sensacao: 'Sensacao',
  acao: 'Acao',
  evento: 'Evento',
}

interface Props {
  links: ChainLink[]
}

export default function ChainTimeline({ links }: Props) {
  if (links.length === 0) {
    return (
      <p className="text-sm" style={{ color: '#3F3F46' }}>
        Nenhum elo adicionado.
      </p>
    )
  }

  return (
    <div className="flex flex-col">
      {links.map((link, i) => {
        const color = typeColors[link.type] || '#52525B'
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="rounded-full shrink-0"
                style={{
                  width: 8,
                  height: 8,
                  background: color,
                  marginTop: 6,
                  opacity: 0.8,
                }}
              />
              {i < links.length - 1 && (
                <div
                  className="flex-1"
                  style={{ width: 1, background: '#1A1A1D', minHeight: 24 }}
                />
              )}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <span
                style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: '0.02em' }}
              >
                {typeLabels[link.type]}
              </span>
              <p className="text-sm mt-1" style={{ color: '#A1A1AA', lineHeight: 1.5 }}>
                {link.content}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
