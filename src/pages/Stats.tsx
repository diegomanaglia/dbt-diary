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
    <div className="flex flex-col min-h-full" style={{ paddingBottom: 100 }}>
      <header className="px-6 pt-10 pb-2">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Estatisticas
        </h1>
      </header>

      {/* Period selector */}
      <div className="px-6 py-5 flex gap-2">
        {periods.map(p => {
          const active = period === p.key
          return (
            <button
              key={String(p.key)}
              onClick={() => setPeriod(p.key)}
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
              {p.label}
            </button>
          )
        })}
      </div>

      <div className="px-6 flex flex-col gap-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Analises" value={stats.totalChains} />
          <StatCard
            label="Intensidade media"
            value={stats.avgIntensity > 0 ? stats.avgIntensity.toFixed(1) : '--'}
          />
          <StatCard label="Finalizadas" value={stats.completeChains} color="var(--success)" />
          <StatCard label="Rascunhos" value={stats.draftChains} color="var(--warning)" />
        </div>

        {/* Mood chart */}
        <div>
          <h2 className="section-title mb-4">Humor ao longo do tempo</h2>
          <MiniChart data={stats.moodData} />
        </div>

        {/* Vulnerability factors */}
        {vulnEntries.length > 0 && (
          <div>
            <h2 className="section-title mb-4">Fatores de vulnerabilidade</h2>
            <div className="flex flex-col gap-4">
              {vulnEntries.map(([key, count]) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {vulnLabel(key)}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>
                      {count}
                    </span>
                  </div>
                  <div className="overflow-hidden" style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{
                      height: '100%',
                      borderRadius: 2,
                      width: `${(count / maxVuln) * 100}%`,
                      background: 'linear-gradient(90deg, var(--accent), var(--accent-strong))',
                      boxShadow: '0 0 6px var(--accent-glow)',
                      transition: 'width 400ms ease',
                    }} />
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
    <div className="p-5 glass">
      <p className="label-upper mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color: color || 'var(--text-primary)', letterSpacing: '-0.03em' }}>
        {value}
      </p>
    </div>
  )
}
