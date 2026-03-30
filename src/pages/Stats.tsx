import { useState } from 'react'
import { useStats } from '../db/useStats'
import MiniChart from '../components/MiniChart'
import { VULNERABILITY_OPTIONS } from '../utils/constants'

type Period = 7 | 30 | null

export default function Stats() {
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
    <div className="flex flex-col min-h-full pb-20">
      <header className="px-5 pt-8 pb-6">
        <h1 className="text-xl font-semibold" style={{ color: '#FAFAFA', letterSpacing: '-0.02em' }}>
          Estatisticas
        </h1>
      </header>

      {/* Period selector */}
      <div className="px-5 flex gap-1 mb-6">
        {periods.map(p => (
          <button
            key={String(p.key)}
            onClick={() => setPeriod(p.key)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              background: period === p.key ? '#1A1A1D' : 'transparent',
              color: period === p.key ? '#FAFAFA' : '#52525B',
              border: 'none',
              cursor: 'pointer',
              minHeight: 44,
              transition: 'all 200ms',
              fontWeight: period === p.key ? 500 : 400,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="px-5 flex flex-col gap-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Analises" value={stats.totalChains} />
          <StatCard
            label="Intensidade media"
            value={stats.avgIntensity > 0 ? stats.avgIntensity.toFixed(1) : '--'}
          />
          <StatCard label="Finalizadas" value={stats.completeChains} color="#10B981" />
          <StatCard label="Rascunhos" value={stats.draftChains} color="#F59E0B" />
        </div>

        {/* Mood chart */}
        <div>
          <h2 className="mb-3" style={{ fontSize: 11, color: '#52525B', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Humor ao longo do tempo
          </h2>
          <MiniChart data={stats.moodData} />
        </div>

        {/* Vulnerability factors */}
        {vulnEntries.length > 0 && (
          <div>
            <h2 className="mb-3" style={{ fontSize: 11, color: '#52525B', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Fatores de vulnerabilidade
            </h2>
            <div className="flex flex-col gap-3">
              {vulnEntries.map(([key, count]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: '#A1A1AA' }}>
                      {vulnLabel(key)}
                    </span>
                    <span style={{ fontSize: 11, color: '#52525B', fontWeight: 500 }}>
                      {count}
                    </span>
                  </div>
                  <div
                    className="rounded-full overflow-hidden"
                    style={{ height: 3, background: '#1A1A1D' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(count / maxVuln) * 100}%`,
                        background: '#0891B2',
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
      className="p-4 rounded-2xl"
      style={{ background: '#111113', border: '1px solid #1A1A1D' }}
    >
      <p className="mb-1" style={{ fontSize: 11, color: '#52525B', fontWeight: 500 }}>
        {label}
      </p>
      <p
        className="text-2xl font-semibold"
        style={{ color: color || '#FAFAFA', letterSpacing: '-0.02em' }}
      >
        {value}
      </p>
    </div>
  )
}
