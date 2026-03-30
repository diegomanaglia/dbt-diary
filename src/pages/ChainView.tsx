import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChain, deleteChain } from '../db/useChains'
import ChainTimeline from '../components/ChainTimeline'
import ConfirmModal from '../components/ConfirmModal'
import { relativeDate } from '../utils/dates'
import { intensityLabel, intensityColor, VULNERABILITY_OPTIONS } from '../utils/constants'

export default function ChainView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry = useChain(Number(id))
  const [showDelete, setShowDelete] = useState(false)

  if (!entry) return null

  const handleDelete = async () => {
    await deleteChain(entry.id!)
    navigate('/')
  }

  const vulnLabel = (key: string) =>
    VULNERABILITY_OPTIONS.find(v => v.key === key)?.label || key

  const iColor = intensityColor(entry.behaviorIntensity)

  return (
    <div className="flex flex-col min-h-full" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <header className="px-8 pt-8 pb-5 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="btn-ghost flex items-center justify-center"
          style={{ width: 44, height: 44, borderRadius: 12, padding: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex-1">
          <p className="label-upper" style={{ marginBottom: 4 }}>
            {relativeDate(entry.createdAt)}
          </p>
          <div className="flex items-center gap-2">
            <span className="badge" style={{ background: `${iColor}15`, color: iColor }}>
              {entry.behaviorIntensity}/10 -- {intensityLabel(entry.behaviorIntensity)}
            </span>
            {!entry.isComplete && (
              <span className="badge" style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--warning)' }}>
                Rascunho
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Action buttons */}
      <div className="px-8 flex gap-3 mb-8">
        <button
          onClick={() => navigate(`/chain/${entry.id}/edit`)}
          className="flex-1 py-3 btn-ghost text-sm font-medium"
          style={{ minHeight: 44 }}
        >
          Editar
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="py-3 px-5 text-sm font-medium"
          style={{
            background: 'rgba(248, 113, 113, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
            color: 'var(--error)',
            cursor: 'pointer',
            minHeight: 44,
            borderRadius: 14,
            transition: 'all 250ms ease',
          }}
        >
          Excluir
        </button>
      </div>

      {/* Content sections */}
      <div className="px-8 flex flex-col gap-10">
        <Section title="1. Comportamento-Problema">
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {entry.problemBehavior || '--'}
          </p>
        </Section>

        <Section title="2. Evento Disparador">
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {entry.promptingEvent || '--'}
          </p>
          {entry.promptingEventDate && (
            <p className="mt-2 label-upper">Data: {entry.promptingEventDate}</p>
          )}
        </Section>

        <Section title="3. Fatores de Vulnerabilidade">
          {entry.vulnerabilityChecklist.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {entry.vulnerabilityChecklist.map(v => (
                <span key={v} className="badge" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                  {vulnLabel(v)}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {entry.vulnerabilityFactors || '--'}
          </p>
        </Section>

        <Section title="4. Elos da Cadeia">
          <ChainTimeline links={entry.chainLinks} />
        </Section>

        <Section title="5. Consequencias">
          <div className="flex flex-col gap-5">
            <SubSection label="Externas -- curto prazo" text={entry.consequencesShortTerm} />
            <SubSection label="Externas -- longo prazo" text={entry.consequencesLongTerm} />
            <SubSection label="Internas -- curto prazo" text={entry.consequencesInternal} />
            <SubSection label="Internas -- longo prazo" text={entry.consequencesExternal} />
          </div>
        </Section>

        <Section title="6. Habilidades Alternativas">
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {entry.skillfulBehaviors || '--'}
          </p>
        </Section>

        <Section title="7. Plano de Prevencao">
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {entry.preventionPlan || '--'}
          </p>
        </Section>

        <Section title="8. Reparacao">
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {entry.repairPlan || '--'}
          </p>
          <div className="mt-3">
            <span className="badge" style={{
              background: entry.repairDone ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 191, 36, 0.1)',
              color: entry.repairDone ? 'var(--success)' : 'var(--warning)',
            }}>
              {entry.repairDone ? 'Reparacao realizada' : 'Reparacao pendente'}
            </span>
          </div>
        </Section>

        {/* Mood comparison */}
        <div className="glass p-8 flex justify-around">
          <div className="text-center">
            <p className="label-upper mb-2">Antes</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-secondary)', letterSpacing: '-0.03em' }}>
              {entry.moodBefore}
            </p>
          </div>
          <div style={{ width: 1, background: 'var(--border-subtle)' }} />
          <div className="text-center">
            <p className="label-upper mb-2">Depois</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--accent)', letterSpacing: '-0.03em' }}>
              {entry.moodAfter}
            </p>
          </div>
        </div>

        {entry.notes && (
          <Section title="Notas">
            <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {entry.notes}
            </p>
          </Section>
        )}
      </div>

      {showDelete && (
        <ConfirmModal
          title="Excluir analise"
          message="Tem certeza que deseja excluir esta analise? Esta acao nao pode ser desfeita."
          confirmLabel="Excluir"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="section-title mb-5">{title}</h3>
      {children}
    </div>
  )
}

function SubSection({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="label-upper mb-1.5">{label}</p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {text || '--'}
      </p>
    </div>
  )
}
