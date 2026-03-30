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
    <div className="flex flex-col min-h-full" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <header className="px-8 pt-12 pb-4">
        <p className="label-upper" style={{ marginBottom: 10 }}>
          {formatDate(new Date())}
        </p>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Cadeia DBT
        </h1>
      </header>

      {/* Action buttons */}
      <div className="px-8 pt-4 pb-3 flex gap-3">
        <button
          onClick={() => navigate('/chain/new')}
          className="flex-1 py-3.5 btn-accent text-sm"
          style={{ minHeight: 48 }}
        >
          + Analise em Cadeia
        </button>
        <button
          onClick={() => navigate('/note/new')}
          className="flex-1 py-3.5 btn-ghost text-sm font-medium"
          style={{ minHeight: 48 }}
        >
          + Nota Rapida
        </button>
      </div>

      {/* Filter tabs */}
      <div className="px-8 py-4 flex gap-2">
        {filters.map(f => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-4 py-2 text-sm"
              style={{
                background: active ? 'var(--bg-elevated)' : 'transparent',
                backdropFilter: active ? 'blur(8px)' : 'none',
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                border: active ? '1px solid var(--border-default)' : '1px solid transparent',
                cursor: 'pointer',
                minHeight: 40,
                borderRadius: 10,
                transition: 'all 250ms ease',
                fontWeight: active ? 600 : 400,
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Items list */}
      <div className="px-8 flex flex-col gap-4 flex-1">
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
