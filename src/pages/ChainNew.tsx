import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { emptyChainEntry, saveChain, useChain } from '../db/useChains'
import type { ChainEntry, ChainLink } from '../db'
import StepIndicator from '../components/StepIndicator'
import MoodSlider from '../components/MoodSlider'
import VulnerabilityChips from '../components/VulnerabilityChips'
import { CHAIN_LINK_TYPES } from '../utils/constants'

const TOTAL_STEPS = 8

interface ChainFormProps {
  editId?: number
}

export default function ChainNewPage() {
  return <ChainForm />
}

export function ChainEditPage() {
  const { id } = useParams()
  return <ChainForm editId={Number(id)} />
}

function ChainForm({ editId }: ChainFormProps) {
  const navigate = useNavigate()
  const existing = useChain(editId)
  const [step, setStep] = useState(1)
  const [entryId, setEntryId] = useState<number | undefined>(editId)
  const [form, setForm] = useState<Omit<ChainEntry, 'id'>>(() => emptyChainEntry())
  const [loaded, setLoaded] = useState(!editId)

  useEffect(() => {
    if (editId && existing && !loaded) {
      const { id: _, ...rest } = existing as ChainEntry
      setForm(rest)
      setEntryId(editId)
      setLoaded(true)
    }
  }, [editId, existing, loaded])

  const update = useCallback(<K extends keyof Omit<ChainEntry, 'id'>>(
    key: K,
    value: Omit<ChainEntry, 'id'>[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }, [])

  const autoSave = useCallback(async () => {
    const id = await saveChain({ ...form, id: entryId })
    if (!entryId) setEntryId(id)
  }, [form, entryId])

  const goNext = async () => {
    await autoSave()
    if (step < TOTAL_STEPS) setStep(step + 1)
  }

  const goPrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFinish = async () => {
    await saveChain({ ...form, id: entryId, isComplete: true })
    navigate('/')
  }

  if (editId && !loaded) return null

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="px-5 pt-5 pb-3 flex items-center gap-3">
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
          <StepIndicator current={step} total={TOTAL_STEPS} />
        </div>
      </header>

      {/* Step content */}
      <div className="flex-1 px-5 py-4 overflow-y-auto">
        {step === 1 && <Step1 form={form} update={update} />}
        {step === 2 && <Step2 form={form} update={update} />}
        {step === 3 && <Step3 form={form} update={update} />}
        {step === 4 && <Step4 form={form} update={update} />}
        {step === 5 && <Step5 form={form} update={update} />}
        {step === 6 && <Step6 form={form} update={update} />}
        {step === 7 && <Step7 form={form} update={update} />}
        {step === 8 && (
          <Step8 form={form} update={update} onFinish={handleFinish} />
        )}
      </div>

      {/* Footer navigation */}
      <div
        className="px-5 py-4 flex gap-3"
        style={{
          borderTop: '1px solid #1A1A1D',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        {step > 1 && (
          <button
            onClick={goPrev}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{
              background: '#111113',
              border: '1px solid #1A1A1D',
              color: '#A1A1AA',
              cursor: 'pointer',
              minHeight: 44,
              transition: 'border-color 200ms',
            }}
          >
            Voltar
          </button>
        )}
        {step < TOTAL_STEPS && (
          <button
            onClick={goNext}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{
              background: '#0891B2',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              minHeight: 44,
              transition: 'opacity 200ms',
            }}
          >
            Proximo
          </button>
        )}
      </div>
    </div>
  )
}

// Shared types
type UpdateFn = <K extends keyof Omit<ChainEntry, 'id'>>(
  key: K,
  value: Omit<ChainEntry, 'id'>[K]
) => void

interface StepProps {
  form: Omit<ChainEntry, 'id'>
  update: UpdateFn
}

// --- Textarea input ---
function TextArea({
  label,
  hint,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <div>
      <label className="block mb-2" style={{ fontSize: 11, color: '#52525B', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full p-4 rounded-xl text-sm"
        style={{
          background: '#111113',
          border: '1px solid #1A1A1D',
          color: '#FAFAFA',
          outline: 'none',
          lineHeight: 1.6,
          transition: 'border-color 200ms',
        }}
        onFocus={e => (e.target.style.borderColor = '#0891B2')}
        onBlur={e => (e.target.style.borderColor = '#1A1A1D')}
      />
      {hint && (
        <p className="mt-2" style={{ fontSize: 11, color: '#3F3F46', lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  )
}

// --- Step 1: Comportamento-Problema ---
function Step1({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-medium" style={{ color: '#FAFAFA' }}>
        Comportamento-Problema
      </h2>
      <TextArea
        label="Descreva o comportamento-problema com detalhes"
        hint="Seja especifico. Descreva como se um ator precisasse reproduzir a cena."
        value={form.problemBehavior}
        onChange={v => update('problemBehavior', v)}
        placeholder="O que voce fez, disse, pensou ou sentiu?"
      />
      <div>
        <div className="flex justify-between items-center mb-2">
          <span style={{ fontSize: 11, color: '#52525B', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Intensidade
          </span>
          <span className="text-sm font-semibold" style={{ color: '#0891B2' }}>
            {form.behaviorIntensity}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={form.behaviorIntensity}
          onChange={e => update('behaviorIntensity', Number(e.target.value))}
          className="w-full"
          style={{ height: 44 }}
        />
        <div className="flex justify-between">
          <span style={{ fontSize: 10, color: '#3F3F46', fontWeight: 500 }}>Leve</span>
          <span style={{ fontSize: 10, color: '#3F3F46', fontWeight: 500 }}>Moderado</span>
          <span style={{ fontSize: 10, color: '#3F3F46', fontWeight: 500 }}>Extremo</span>
        </div>
      </div>
    </div>
  )
}

// --- Step 2: Evento Disparador ---
function Step2({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-medium" style={{ color: '#FAFAFA' }}>
        Evento Disparador
      </h2>
      <TextArea
        label="O que aconteceu que iniciou a cadeia?"
        hint="O que aconteceu de diferente nesse dia comparado ao dia anterior?"
        value={form.promptingEvent}
        onChange={v => update('promptingEvent', v)}
      />
      <div>
        <label className="block mb-2" style={{ fontSize: 11, color: '#52525B', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Quando aconteceu?
        </label>
        <input
          type="date"
          value={form.promptingEventDate}
          onChange={e => update('promptingEventDate', e.target.value)}
          className="w-full p-4 rounded-xl text-sm"
          style={{
            background: '#111113',
            border: '1px solid #1A1A1D',
            color: '#FAFAFA',
            outline: 'none',
            minHeight: 44,
            transition: 'border-color 200ms',
          }}
          onFocus={e => (e.target.style.borderColor = '#0891B2')}
          onBlur={e => (e.target.style.borderColor = '#1A1A1D')}
        />
      </div>
    </div>
  )
}

// --- Step 3: Fatores de Vulnerabilidade ---
function Step3({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-medium" style={{ color: '#FAFAFA' }}>
        Fatores de Vulnerabilidade
      </h2>
      <VulnerabilityChips
        selected={form.vulnerabilityChecklist}
        onChange={v => update('vulnerabilityChecklist', v)}
      />
      <TextArea
        label="Descreva o que te deixou mais vulneravel"
        value={form.vulnerabilityFactors}
        onChange={v => update('vulnerabilityFactors', v)}
      />
    </div>
  )
}

// --- Step 4: Elos da Cadeia ---
function Step4({ form, update }: StepProps) {
  const links = form.chainLinks

  const addLink = () => {
    update('chainLinks', [...links, { type: 'pensamento', content: '' }])
  }

  const removeLink = (index: number) => {
    update('chainLinks', links.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, field: keyof ChainLink, value: string) => {
    const updated = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    )
    update('chainLinks', updated)
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-medium" style={{ color: '#FAFAFA' }}>
        Elos da Cadeia
      </h2>
      <p style={{ fontSize: 11, color: '#3F3F46', lineHeight: 1.5 }}>
        Detalhe cada pensamento, sentimento e acao entre o disparador e o comportamento-problema.
      </p>

      {links.map((link, i) => (
        <div key={i} className="flex gap-3">
          {/* Timeline line */}
          <div className="flex flex-col items-center pt-2">
            <div
              className="rounded-full shrink-0"
              style={{ width: 8, height: 8, background: '#0891B2', opacity: 0.6 }}
            />
            {i < links.length - 1 && (
              <div className="flex-1" style={{ width: 1, background: '#1A1A1D' }} />
            )}
          </div>

          <div
            className="flex-1 p-4 rounded-xl"
            style={{ background: '#111113', border: '1px solid #1A1A1D' }}
          >
            {/* Type selector */}
            <div className="flex flex-wrap gap-1 mb-3">
              {CHAIN_LINK_TYPES.map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => updateLink(i, 'type', t.key)}
                  className="px-3 py-1.5 rounded-md"
                  style={{
                    fontSize: 11,
                    background: link.type === t.key ? '#0891B212' : 'transparent',
                    border: `1px solid ${link.type === t.key ? '#0891B2' : '#27272A'}`,
                    color: link.type === t.key ? '#0891B2' : '#52525B',
                    cursor: 'pointer',
                    minHeight: 32,
                    fontWeight: link.type === t.key ? 500 : 400,
                    transition: 'all 200ms',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex gap-2">
              <textarea
                value={link.content}
                onChange={e => updateLink(i, 'content', e.target.value)}
                rows={2}
                placeholder="Descreva este elo..."
                className="flex-1 p-3 rounded-lg text-sm"
                style={{
                  background: '#09090B',
                  border: '1px solid #1A1A1D',
                  color: '#FAFAFA',
                  outline: 'none',
                  lineHeight: 1.5,
                  transition: 'border-color 200ms',
                }}
                onFocus={e => (e.target.style.borderColor = '#0891B2')}
                onBlur={e => (e.target.style.borderColor = '#1A1A1D')}
              />
              <button
                onClick={() => removeLink(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3F3F46',
                  cursor: 'pointer',
                  minWidth: 44,
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 200ms',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addLink}
        className="w-full py-3 rounded-xl text-sm font-medium"
        style={{
          background: 'transparent',
          border: '1px dashed #27272A',
          color: '#0891B2',
          cursor: 'pointer',
          minHeight: 44,
          transition: 'border-color 200ms',
        }}
      >
        + Adicionar elo
      </button>
    </div>
  )
}

// --- Step 5: Consequencias ---
function Step5({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-medium" style={{ color: '#FAFAFA' }}>
        Consequencias
      </h2>
      <TextArea
        label="Consequencias externas -- curto prazo"
        value={form.consequencesShortTerm}
        onChange={v => update('consequencesShortTerm', v)}
        rows={3}
      />
      <TextArea
        label="Consequencias externas -- longo prazo"
        value={form.consequencesLongTerm}
        onChange={v => update('consequencesLongTerm', v)}
        rows={3}
      />
      <TextArea
        label="Consequencias internas -- curto prazo"
        value={form.consequencesInternal}
        onChange={v => update('consequencesInternal', v)}
        rows={3}
      />
      <TextArea
        label="Consequencias internas -- longo prazo"
        value={form.consequencesExternal}
        onChange={v => update('consequencesExternal', v)}
        rows={3}
      />
    </div>
  )
}

// --- Step 6: Habilidades Alternativas ---
function Step6({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-medium" style={{ color: '#FAFAFA' }}>
        Habilidades Alternativas
      </h2>
      <TextArea
        label="Que habilidades DBT poderiam substituir os elos problematicos?"
        hint="Pense em Mindfulness, Tolerancia ao Mal-Estar, Regulacao Emocional, Efetividade Interpessoal."
        value={form.skillfulBehaviors}
        onChange={v => update('skillfulBehaviors', v)}
      />
    </div>
  )
}

// --- Step 7: Plano de Prevencao ---
function Step7({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-medium" style={{ color: '#FAFAFA' }}>
        Plano de Prevencao
      </h2>
      <TextArea
        label="Como reduzir sua vulnerabilidade para que a cadeia nem comece?"
        hint="Pense em rotinas, autocuidado, limites e estrategias preventivas."
        value={form.preventionPlan}
        onChange={v => update('preventionPlan', v)}
      />
    </div>
  )
}

// --- Step 8: Reparacao e Fechamento ---
function Step8({
  form,
  update,
  onFinish,
}: StepProps & { onFinish: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-medium" style={{ color: '#FAFAFA' }}>
        Reparacao e Fechamento
      </h2>
      <TextArea
        label="O que voce pode fazer para reparar as consequencias?"
        hint="Repare o dano real. Reconstrua confianca com acoes, nao com palavras."
        value={form.repairPlan}
        onChange={v => update('repairPlan', v)}
      />

      {/* Toggle reparacao */}
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: '#A1A1AA' }}>
          Reparacao realizada?
        </span>
        <button
          type="button"
          onClick={() => update('repairDone', !form.repairDone)}
          className="relative rounded-full"
          style={{
            width: 48,
            height: 28,
            background: form.repairDone ? '#10B981' : '#27272A',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 200ms',
            minHeight: 44,
            padding: 0,
          }}
        >
          <span
            className="absolute rounded-full"
            style={{
              width: 20,
              height: 20,
              background: '#FAFAFA',
              top: 4,
              left: form.repairDone ? 24 : 4,
              transition: 'left 200ms',
            }}
          />
        </button>
      </div>

      <MoodSlider
        label="Humor antes do registro"
        value={form.moodBefore}
        onChange={v => update('moodBefore', v)}
      />
      <MoodSlider
        label="Humor agora"
        value={form.moodAfter}
        onChange={v => update('moodAfter', v)}
      />

      <TextArea
        label="Notas adicionais"
        value={form.notes}
        onChange={v => update('notes', v)}
        rows={3}
        placeholder="Opcional"
      />

      <button
        onClick={onFinish}
        className="w-full py-3 rounded-xl text-sm font-medium"
        style={{
          background: '#10B981',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          minHeight: 44,
          transition: 'opacity 200ms',
        }}
      >
        Finalizar Analise
      </button>
    </div>
  )
}
