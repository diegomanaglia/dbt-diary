import type { QuickNote } from '../db'
import { relativeDate } from '../utils/dates'

const tagConfig: Record<string, { color: string; label: string }> = {
  geral: { color: '#94A3B8', label: 'Geral' },
  insight: { color: '#06B6D4', label: 'Insight' },
  gatilho: { color: '#FBBF24', label: 'Gatilho' },
  conquista: { color: '#34D399', label: 'Conquista' },
  sessao: { color: '#A78BFA', label: 'Sessão' },
}

interface Props {
  note: QuickNote
  onClick: () => void
}

export default function NoteCard({ note, onClick }: Props) {
  const preview = note.content
    ? note.content.slice(0, 90) + (note.content.length > 90 ? '...' : '')
    : 'Sem conteúdo'

  const tag = tagConfig[note.tag] || tagConfig.geral

  return (
    <button
      onClick={onClick}
      className="w-full text-left glass glass-hover p-5 flex gap-4"
      style={{ cursor: 'pointer', minHeight: 44 }}
    >
      <div className="shrink-0 pt-1">
        <div style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: tag.color,
          boxShadow: `0 0 8px ${tag.color}40`,
        }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
            {relativeDate(note.createdAt)}
          </span>
          <span className="badge" style={{ background: `${tag.color}15`, color: tag.color }}>
            {tag.label}
          </span>
        </div>
        <p className="text-sm truncate" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {preview}
        </p>
      </div>
    </button>
  )
}
