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
    : 'Sem descrição'

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
        style={{
          width: 4,
          minHeight: 40,
          background: intensityColor(entry.behaviorIntensity),
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs" style={{ color: '#6B6B6B' }}>
            {relativeDate(entry.createdAt)}
          </span>
          {!entry.isComplete && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: '#F59E0B20', color: '#F59E0B' }}
            >
              Rascunho
            </span>
          )}
        </div>
        <p className="text-sm truncate" style={{ color: '#E5E5E5' }}>
          {preview}
        </p>
      </div>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6B6B6B"
        strokeWidth="2"
        className="shrink-0 self-center"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )
}
