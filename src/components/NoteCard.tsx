import type { QuickNote } from '../db'
import { relativeDate } from '../utils/dates'

const tagColors: Record<string, string> = {
  geral: '#52525B',
  insight: '#0891B2',
  gatilho: '#F59E0B',
  conquista: '#10B981',
  sessao: '#8B5CF6',
}

const tagLabels: Record<string, string> = {
  geral: 'Geral',
  insight: 'Insight',
  gatilho: 'Gatilho',
  conquista: 'Conquista',
  sessao: 'Sessao',
}

interface Props {
  note: QuickNote
  onClick: () => void
}

export default function NoteCard({ note, onClick }: Props) {
  const preview = note.content
    ? note.content.slice(0, 100) + (note.content.length > 100 ? '...' : '')
    : 'Sem conteudo'

  const color = tagColors[note.tag] || '#52525B'

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex gap-3 p-4 rounded-2xl"
      style={{
        background: '#111113',
        border: '1px solid #1A1A1D',
        cursor: 'pointer',
        transition: 'border-color 200ms',
        minHeight: 44,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#27272A')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A1A1D')}
    >
      <div
        className="rounded-full shrink-0"
        style={{ width: 3, minHeight: 36, background: color, opacity: 0.8 }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ fontSize: 11, color: '#52525B', fontWeight: 500 }}>
            {relativeDate(note.createdAt)}
          </span>
          <span
            className="px-2 py-0.5 rounded-full"
            style={{ fontSize: 10, background: color + '15', color, fontWeight: 500 }}
          >
            {tagLabels[note.tag]}
          </span>
        </div>
        <p className="text-sm truncate" style={{ color: '#A1A1AA', fontWeight: 400 }}>
          {preview}
        </p>
      </div>
    </button>
  )
}
