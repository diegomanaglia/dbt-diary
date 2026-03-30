import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import type { ChainEntry, QuickNote } from '../db'
import ChainCard from '../components/ChainCard'
import NoteCard from '../components/NoteCard'
import EmptyState from '../components/EmptyState'
import { formatDate } from '../utils/dates'

type Filter = 'todos' | 'cadeias' | 'notas'

type TimelineItem =
  | { type: 'chain'; data: ChainEntry; date: Date }
  | { type: 'note'; data: QuickNote; date: Date }

export default function Home() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('todos')

  const chains = useLiveQuery(() =>
    db.chainEntries.orderBy('createdAt').reverse().toArray()
  )
  const notes = useLiveQuery(() =>
    db.quickNotes.orderBy('createdAt').reverse().toArray()
  )

  const items: TimelineItem[] = []
  if (filter !== 'notas' && chains) {
    chains.forEach(c => items.push({ type: 'chain', data: c, date: c.createdAt }))
  }
  if (filter !== 'cadeias' && notes) {
    notes.forEach(n => items.push({ type: 'note', data: n, date: n.createdAt }))
  }
  items.sort((a, b) => b.date.getTime() - a.date.getTime())

  const filters: { key: Filter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'cadeias', label: 'Cadeias' },
    { key: 'notas', label: 'Notas' },
  ]

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <header className="px-5 pt-8 pb-6">
        <p style={{ fontSize: 11, color: '#52525B', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          {formatDate(new Date())}
        </p>
        <h1 className="text-xl font-semibold" style={{ color: '#FAFAFA', letterSpacing: '-0.02em' }}>
          Cadeia DBT
        </h1>
      </header>

      {/* Action buttons */}
      <div className="px-5 flex gap-3 mb-5">
        <button
          onClick={() => navigate('/chain/new')}
          className="flex-1 py-3 rounded-xl text-sm font-medium"
          style={{
            background: '#0891B2',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            minHeight: 44,
            transition: 'opacity 200ms',
          }}
        >
          + Analise em Cadeia
        </button>
        <button
          onClick={() => navigate('/note/new')}
          className="flex-1 py-3 rounded-xl text-sm font-medium"
          style={{
            background: 'transparent',
            color: '#A1A1AA',
            border: '1px solid #27272A',
            cursor: 'pointer',
            minHeight: 44,
            transition: 'border-color 200ms',
          }}
        >
          + Nota Rapida
        </button>
      </div>

      {/* Filter tabs */}
      <div className="px-5 flex gap-1 mb-4">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              background: filter === f.key ? '#1A1A1D' : 'transparent',
              color: filter === f.key ? '#FAFAFA' : '#52525B',
              border: 'none',
              cursor: 'pointer',
              minHeight: 44,
              transition: 'all 200ms',
              fontWeight: filter === f.key ? 500 : 400,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="px-5 flex flex-col gap-2 flex-1">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          items.map(item =>
            item.type === 'chain' ? (
              <ChainCard
                key={`chain-${item.data.id}`}
                entry={item.data}
                onClick={() => navigate(`/chain/${item.data.id}`)}
              />
            ) : (
              <NoteCard
                key={`note-${item.data.id}`}
                note={item.data}
                onClick={() => {}}
              />
            )
          )
        )}
      </div>
    </div>
  )
}
