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

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <header className="px-5 pt-5 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#FAFAFA',
            cursor: 'pointer',
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex-1">
          <p style={{ fontSize: 11, color: '#52525B', fontWeight: 500 }}>
            {relativeDate(entry.createdAt)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="px-2 py-0.5 rounded-md"
              style={{
                fontSize: 10,
                fontWeight: 500,
                background: intensityColor(entry.behaviorIntensity) + '15',
                color: intensityColor(entry.behaviorIntensity),
              }}
            >
              {entry.behaviorIntensity} -- {intensityLabel(entry.behaviorIntensity)}
            </span>
            {!entry.isComplete && (
              <span
                className="px-2 py-0.5 rounded-md"
                style={{ fontSize: 10, fontWeight: 500, background: '#F59E0B15', color: '#F59E0B' }}
              >
                Rascunho
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Action buttons */}
      <div className="px-5 flex gap-2 mb-6">
        <button
          onClick={() => navigate(`/chain/${entry.id}/edit`)}
          className="flex-1 py-2.5 rounded-xl text-sm"
          style={{
            background: '#111113',
            border: '1px solid #1A1A1D',
            color: '#A1A1AA',
            cursor: 'pointer',
            minHeight: 44,
            fontWeight: 500,
            transition: 'border-color 200ms',
          }}
        >
          Editar
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="py-2.5 px-4 rounded-xl text-sm"
          style={{
            background: '#111113',
            border: '1px solid #1A1A1D',
            color: '#EF4444',
            cursor: 'pointer',
            minHeight: 44,
            fontWeight: 500,
            transition: 'border-color 200ms',
          }}
        >
          Excluir
        </button>
      </div>

      {/* Content sections */}
      <div className="px-5 flex flex-col gap-8">
        <Section title="1. Comportamento-Problema">
          <p className="text-sm" style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
            {entry.problemBehavior || '--'}
          </p>
        </Section>

        <Section title="2. Evento Disparador">
          <p className="text-sm" style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
            {entry.promptingEvent || '--'}
          </p>
          {entry.promptingEventDate && (
            <p className="mt-1" style={{ fontSize: 11, color: '#3F3F46' }}>
              Data: {entry.promptingEventDate}
            </p>
          )}
        </Section>

        <Section title="3. Fatores de Vulnerabilidade">
          {entry.vulnerabilityChecklist.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {entry.vulnerabilityChecklist.map(v => (
                <span
                  key={v}
                  className="px-2 py-1 rounded-md"
                  style={{ fontSize: 11, background: '#0891B210', color: '#0891B2', fontWeight: 500 }}
                >
                  {vulnLabel(v)}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm" style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
            {entry.vulnerabilityFactors || '--'}
          </p>
        </Section>

        <Section title="4. Elos da Cadeia">
          <ChainTimeline links={entry.chainLinks} />
        </Section>

        <Section title="5. Consequencias">
          <SubSection label="Externas -- curto prazo" text={entry.consequencesShortTerm} />
          <SubSection label="Externas -- longo prazo" text={entry.consequencesLongTerm} />
          <SubSection label="Internas -- curto prazo" text={entry.consequencesInternal} />
          <SubSection label="Internas -- longo prazo" text={entry.consequencesExternal} />
        </Section>

        <Section title="6. Habilidades Alternativas">
          <p className="text-sm" style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
            {entry.skillfulBehaviors || '--'}
          </p>
        </Section>

        <Section title="7. Plano de Prevencao">
          <p className="text-sm" style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
            {entry.preventionPlan || '--'}
          </p>
        </Section>

        <Section title="8. Reparacao">
          <p className="text-sm" style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
            {entry.repairPlan || '--'}
          </p>
          <p className="mt-2" style={{ fontSize: 11, color: entry.repairDone ? '#10B981' : '#F59E0B', fontWeight: 500 }}>
            {entry.repairDone ? 'Reparacao realizada' : 'Reparacao pendente'}
          </p>
        </Section>

        {/* Mood comparison */}
        <div
          className="p-5 rounded-2xl flex justify-around"
          style={{ background: '#111113', border: '1px solid #1A1A1D' }}
        >
          <div className="text-center">
            <p style={{ fontSize: 10, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Antes</p>
            <p className="text-2xl font-semibold" style={{ color: '#A1A1AA', letterSpacing: '-0.02em' }}>
              {entry.moodBefore}
            </p>
          </div>
          <div style={{ width: 1, background: '#1A1A1D' }} />
          <div className="text-center">
            <p style={{ fontSize: 10, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Depois</p>
            <p className="text-2xl font-semibold" style={{ color: '#0891B2', letterSpacing: '-0.02em' }}>
              {entry.moodAfter}
            </p>
          </div>
        </div>

        {entry.notes && (
          <Section title="Notas">
            <p className="text-sm" style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
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
      <h3 className="mb-3" style={{ fontSize: 11, color: '#52525B', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function SubSection({ label, text }: { label: string; text: string }) {
  return (
    <div className="mb-3">
      <p className="mb-1" style={{ fontSize: 11, color: '#3F3F46', fontWeight: 500 }}>
        {label}
      </p>
      <p className="text-sm" style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
        {text || '--'}
      </p>
    </div>
  )
}
