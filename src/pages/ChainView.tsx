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
      <header className="px-5 pt-5 pb-3 flex items-center gap-3">
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
        <div className="flex-1">
          <p className="text-sm" style={{ color: '#6B6B6B' }}>
            {relativeDate(entry.createdAt)}
          </p>
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: intensityColor(entry.behaviorIntensity) + '20',
                color: intensityColor(entry.behaviorIntensity),
              }}
            >
              Intensidade {entry.behaviorIntensity} — {intensityLabel(entry.behaviorIntensity)}
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
        </div>
      </header>

      {/* Action buttons */}
      <div className="px-5 flex gap-3 mb-5">
        <button
          onClick={() => navigate(`/chain/${entry.id}/edit`)}
          className="flex-1 py-2.5 rounded-xl text-sm"
          style={{
            background: '#1A1A1A',
            border: '1px solid #2A2A2A',
            color: '#E5E5E5',
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          Editar
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="py-2.5 px-4 rounded-xl text-sm"
          style={{
            background: '#1A1A1A',
            border: '1px solid #2A2A2A',
            color: '#EF4444',
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          Excluir
        </button>
      </div>

      {/* Content sections */}
      <div className="px-5 flex flex-col gap-6">
        <Section title="1. Comportamento-Problema">
          <p className="text-sm" style={{ color: '#E5E5E5' }}>
            {entry.problemBehavior || '—'}
          </p>
        </Section>

        <Section title="2. Evento Disparador">
          <p className="text-sm" style={{ color: '#E5E5E5' }}>
            {entry.promptingEvent || '—'}
          </p>
          {entry.promptingEventDate && (
            <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
              Data: {entry.promptingEventDate}
            </p>
          )}
        </Section>

        <Section title="3. Fatores de Vulnerabilidade">
          {entry.vulnerabilityChecklist.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {entry.vulnerabilityChecklist.map(v => (
                <span
                  key={v}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: '#3B82F620', color: '#3B82F6' }}
                >
                  {vulnLabel(v)}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm" style={{ color: '#E5E5E5' }}>
            {entry.vulnerabilityFactors || '—'}
          </p>
        </Section>

        <Section title="4. Elos da Cadeia">
          <ChainTimeline links={entry.chainLinks} />
        </Section>

        <Section title="5. Consequências">
          <SubSection label="Externas — curto prazo" text={entry.consequencesShortTerm} />
          <SubSection label="Externas — longo prazo" text={entry.consequencesLongTerm} />
          <SubSection label="Internas — curto prazo" text={entry.consequencesInternal} />
          <SubSection label="Internas — longo prazo" text={entry.consequencesExternal} />
        </Section>

        <Section title="6. Habilidades Alternativas">
          <p className="text-sm" style={{ color: '#E5E5E5' }}>
            {entry.skillfulBehaviors || '—'}
          </p>
        </Section>

        <Section title="7. Plano de Prevenção">
          <p className="text-sm" style={{ color: '#E5E5E5' }}>
            {entry.preventionPlan || '—'}
          </p>
        </Section>

        <Section title="8. Reparação">
          <p className="text-sm" style={{ color: '#E5E5E5' }}>
            {entry.repairPlan || '—'}
          </p>
          <p className="text-xs mt-2" style={{ color: entry.repairDone ? '#10B981' : '#F59E0B' }}>
            {entry.repairDone ? 'Reparação realizada' : 'Reparação pendente'}
          </p>
        </Section>

        {/* Mood */}
        <div
          className="p-4 rounded-xl flex justify-around"
          style={{ background: '#141414', border: '1px solid #1E1E1E' }}
        >
          <div className="text-center">
            <p className="text-xs" style={{ color: '#6B6B6B' }}>Humor antes</p>
            <p className="text-xl font-semibold" style={{ color: '#E5E5E5' }}>
              {entry.moodBefore}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: '#6B6B6B' }}>Humor depois</p>
            <p className="text-xl font-semibold" style={{ color: '#3B82F6' }}>
              {entry.moodAfter}
            </p>
          </div>
        </div>

        {entry.notes && (
          <Section title="Notas">
            <p className="text-sm" style={{ color: '#E5E5E5' }}>
              {entry.notes}
            </p>
          </Section>
        )}
      </div>

      {showDelete && (
        <ConfirmModal
          title="Excluir análise"
          message="Tem certeza que deseja excluir esta análise? Esta ação não pode ser desfeita."
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
      <h3 className="text-sm font-medium mb-3" style={{ color: '#6B6B6B' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function SubSection({ label, text }: { label: string; text: string }) {
  return (
    <div className="mb-3">
      <p className="text-xs mb-1" style={{ color: '#6B6B6B' }}>
        {label}
      </p>
      <p className="text-sm" style={{ color: '#E5E5E5' }}>
        {text || '—'}
      </p>
    </div>
  )
}
