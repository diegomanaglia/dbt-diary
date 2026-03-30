import type { ChainEntry } from '../db'
import { relativeDate } from '../utils/dates'
import { intensityColor } from '../utils/constants'

interface Props {
  entry: ChainEntry
  onClick: () => void
}

export default function ChainCard({ entry, onClick }: Props) {
  const preview = entry.problemBehavior
    ? entry.problemBehavior.slice(0, 90) + (entry.problemBehavior.length > 90 ? '...' : '')
    : 'Sem descricao'

  const color = intensityColor(entry.behaviorIntensity)

  return (
    <button
      onClick={onClick}
      className="w-full text-left glass glass-hover p-4 flex gap-4"
      style={{ cursor: 'pointer', minHeight: 44 }}
    >
      <div className="shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
        <div style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${color}60`,
        }} />
        <div style={{
          width: 2,
          flex: 1,
          minHeight: 20,
          borderRadius: 1,
          background: `linear-gradient(to bottom, ${color}40, transparent)`,
        }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
            {relativeDate(entry.createdAt)}
          </span>
          <span className="badge" style={{ background: `${color}15`, color }}>
            {entry.behaviorIntensity}/10
          </span>
          {!entry.isComplete && (
            <span className="badge" style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--warning)' }}>
              Rascunho
            </span>
          )}
        </div>
        <p className="text-sm truncate" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {preview}
        </p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="shrink-0 self-center" style={{ opacity: 0.5 }}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )
}
