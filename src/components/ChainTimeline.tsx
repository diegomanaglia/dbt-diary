import type { ChainLink } from '../db'

const typeColors: Record<string, string> = {
  pensamento: '#3B82F6',
  sentimento: '#F59E0B',
  sensacao: '#8B5CF6',
  acao: '#EF4444',
  evento: '#10B981',
}

const typeLabels: Record<string, string> = {
  pensamento: 'Pensamento',
  sentimento: 'Sentimento',
  sensacao: 'Sensação',
  acao: 'Ação',
  evento: 'Evento',
}

interface Props {
  links: ChainLink[]
}

export default function ChainTimeline({ links }: Props) {
  if (links.length === 0) {
    return (
      <p className="text-sm" style={{ color: '#6B6B6B' }}>
        Nenhum elo adicionado.
      </p>
    )
  }

  return (
    <div className="flex flex-col">
      {links.map((link, i) => {
        const color = typeColors[link.type] || '#6B6B6B'
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="rounded-full shrink-0"
                style={{
                  width: 12,
                  height: 12,
                  background: color,
                  marginTop: 4,
                }}
              />
              {i < links.length - 1 && (
                <div
                  className="flex-1"
                  style={{ width: 2, background: '#1E1E1E', minHeight: 24 }}
                />
              )}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <span
                className="text-xs font-medium"
                style={{ color }}
              >
                {typeLabels[link.type]}
              </span>
              <p className="text-sm mt-1" style={{ color: '#E5E5E5' }}>
                {link.content}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
