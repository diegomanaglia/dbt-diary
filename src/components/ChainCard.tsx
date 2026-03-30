import type { ChainEntry } from '../db'
import { relativeDate } from '../utils/dates'
import { intensityColor } from '../utils/constants'

interface Props {
  entry: ChainEntry
  onClick: () => void
}

export default function ChainCard({ entry, onClick }: Props) {
  const preview = entry.problemBehavior
    ? entry.problemBehavior.slice(0, 100) + (entry.problemBehavior.length > 100 ? '...' : '')
    : 'Sem descricao'

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
        style={{
          width: 3,
          minHeight: 36,
          background: intensityColor(entry.behaviorIntensity),
          opacity: 0.8,
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ fontSize: 11, color: '#52525B', fontWeight: 500 }}>
            {relativeDate(entry.createdAt)}
          </span>
          {!entry.isComplete && (
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ fontSize: 10, background: '#F59E0B15', color: '#F59E0B', fontWeight: 500 }}
            >
              Rascunho
            </span>
          )}
        </div>
        <p className="text-sm truncate" style={{ color: '#A1A1AA', fontWeight: 400 }}>
          {preview}
        </p>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3F3F46"
        strokeWidth="1.5"
        className="shrink-0 self-center"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )
}
