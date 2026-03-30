import type { QuickNote } from '../db'
import { relativeDate } from '../utils/dates'

const tagColors: Record<string, string> = {
  geral: '#6B6B6B',
  insight: '#3B82F6',
  gatilho: '#F59E0B',
  conquista: '#10B981',
  sessao: '#8B5CF6',
}

const tagLabels: Record<string, string> = {
  geral: 'Geral',
  insight: 'Insight',
  gatilho: 'Gatilho',
  conquista: 'Conquista',
  sessao: 'Sessão',
}

interface Props {
  note: QuickNote
  onClick: () => void
}

export default function NoteCard({ note, onClick }: Props) {
  const preview = note.content
    ? note.content.slice(0, 100) + (note.content.length > 100 ? '...' : '')
    : 'Sem conteúdo'

  const color = tagColors[note.tag] || '#6B6B6B'

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex gap-3 p-4 rounded-xl"
      style={{
        background: '#141414',
        border: '1px solid #1E1E1E',
        cursor: 'pointer',
        transition: 'background 200ms',
        minHeight: 44,
      }}
    >
      <div
        className="rounded-full shrink-0"
        style={{ width: 4, minHeight: 40, background: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs" style={{ color: '#6B6B6B' }}>
            {relativeDate(note.createdAt)}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: color + '20', color }}
          >
            {tagLabels[note.tag]}
          </span>
        </div>
        <p className="text-sm truncate" style={{ color: '#E5E5E5' }}>
          {preview}
        </p>
      </div>
    </button>
  )
}
