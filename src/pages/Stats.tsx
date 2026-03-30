import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStats } from '../db/useStats'
import MiniChart from '../components/MiniChart'
import { VULNERABILITY_OPTIONS } from '../utils/constants'

type Period = 7 | 30 | null

export default function Stats() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<Period>(30)
  const stats = useStats(period)

  const periods: { key: Period; label: string }[] = [
    { key: 7, label: '7 dias' },
    { key: 30, label: '30 dias' },
    { key: null, label: 'Todos' },
  ]

  if (!stats) return null

  const vulnEntries = Object.entries(stats.vulnCounts).sort(
    (a, b) => b[1] - a[1]
  )
  const maxVuln = vulnEntries.length > 0 ? vulnEntries[0][1] : 1

  const vulnLabel = (key: string) =>
    VULNERABILITY_OPTIONS.find(v => v.key === key)?.label || key

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <header className="px-5 pt-8 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#E5E5E5',
            cursor: 'pointer',
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-xl font-bold" style={{ color: '#E5E5E5' }}>
          Estatísticas
        </h1>
      </header>

      {/* Period selector */}
      <div className="px-5 py-4 flex gap-2">
        {periods.map(p => (
          <button
            key={String(p.key)}
            onClick={() => setPeriod(p.key)}
            className="px-4 py-2.5 rounded-lg text-sm"
            style={{
              background: period === p.key ? '#1E1E1E' : 'transparent',
              color: period === p.key ? '#E5E5E5' : '#6B6B6B',
              border: 'none',
              cursor: 'pointer',
              minHeight: 44,
              transition: 'all 200ms',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="px-5 flex flex-col gap-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Análises" value={stats.totalChains} />
          <StatCard
            label="Intensidade média"
            value={stats.avgIntensity > 0 ? stats.avgIntensity.toFixed(1) : '—'}
          />
          <StatCard label="Finalizadas" value={stats.completeChains} color="#10B981" />
          <StatCard label="Rascunhos" value={stats.draftChains} color="#F59E0B" />
        </div>

        {/* Mood chart */}
        <div>
          <h2 className="text-sm font-medium mb-4" style={{ color: '#E5E5E5' }}>
            Humor ao longo do tempo
          </h2>
          <MiniChart data={stats.moodData} />
        </div>

        {/* Vulnerability factors */}
        {vulnEntries.length > 0 && (
          <div>
            <h2 className="text-sm font-medium mb-4" style={{ color: '#E5E5E5' }}>
              Fatores de vulnerabilidade
            </h2>
            <div className="flex flex-col gap-4">
              {vulnEntries.map(([key, count]) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" style={{ color: '#E5E5E5' }}>
                      {vulnLabel(key)}
                    </span>
                    <span className="text-sm" style={{ color: '#6B6B6B' }}>
                      {count}
                    </span>
                  </div>
                  <div
                    className="rounded-full overflow-hidden"
                    style={{ height: 6, background: '#1E1E1E' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(count / maxVuln) * 100}%`,
                        background: '#3B82F6',
                        transition: 'width 300ms',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: '#141414', border: '1px solid #1E1E1E' }}
    >
      <p className="text-xs mb-2" style={{ color: '#6B6B6B' }}>
        {label}
      </p>
      <p
        className="text-2xl font-semibold"
        style={{ color: color || '#E5E5E5' }}
      >
        {value}
      </p>
    </div>
  )
}
