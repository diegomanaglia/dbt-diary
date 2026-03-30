import { useState, useEffect, useRef } from 'react'
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

  // Keep refs in sync to avoid stale closures
  const formRef = useRef(form)
  formRef.current = form
  const entryIdRef = useRef(entryId)
  entryIdRef.current = entryId

  // Load existing entry for edit
  useEffect(() => {
    if (editId && existing && !loaded) {
      const { id: _, ...rest } = existing as ChainEntry
      setForm(rest)
      setEntryId(editId)
      setLoaded(true)
    }
  }, [editId, existing, loaded])

  const update = <K extends keyof Omit<ChainEntry, 'id'>>(
    key: K,
    value: Omit<ChainEntry, 'id'>[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const autoSave = async () => {
    const currentForm = formRef.current
    const currentId = entryIdRef.current
    const id = await saveChain({ ...currentForm, id: currentId })
    if (!currentId) setEntryId(id)
  }

  const goNext = async () => {
    await autoSave()
    setStep(prev => (prev < TOTAL_STEPS ? prev + 1 : prev))
  }

  const goPrev = async () => {
    await autoSave()
    setStep(prev => (prev > 1 ? prev - 1 : prev))
  }

  const handleFinish = async () => {
    const currentForm = formRef.current
    const currentId = entryIdRef.current
    await saveChain({ ...currentForm, id: currentId, isComplete: true })
    navigate('/')
  }

  if (editId && !loaded) return null

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className="px-5 pt-6 pb-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid #1E1E1E' }}
      >
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
          <StepIndicator current={step} total={TOTAL_STEPS} />
        </div>
      </header>

      {/* Step content */}
      <div className="flex-1 px-5 py-6 overflow-y-auto">
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
          borderTop: '1px solid #1E1E1E',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        {step > 1 && (
          <button
            onClick={goPrev}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              color: '#E5E5E5',
              cursor: 'pointer',
              minHeight: 44,
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
              background: '#3B82F6',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            Próximo
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
      <label className="block text-sm font-medium mb-3" style={{ color: '#E5E5E5' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full p-4 rounded-xl text-sm leading-relaxed"
        style={{
          background: '#1A1A1A',
          border: '1px solid #2A2A2A',
          color: '#E5E5E5',
          outline: 'none',
          transition: 'border-color 200ms',
        }}
        onFocus={e => (e.target.style.borderColor = '#3B82F6')}
        onBlur={e => (e.target.style.borderColor = '#2A2A2A')}
      />
      {hint && (
        <p className="text-xs mt-3 leading-relaxed" style={{ color: '#6B6B6B' }}>
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
      <h2 className="text-lg font-semibold" style={{ color: '#E5E5E5' }}>
        Comportamento-Problema
      </h2>
      <TextArea
        label="Descreva o comportamento-problema com detalhes"
        hint="Seja específico. Descreva como se um ator precisasse reproduzir a cena."
        value={form.problemBehavior}
        onChange={v => update('problemBehavior', v)}
        placeholder="O que você fez, disse, pensou ou sentiu?"
      />
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium" style={{ color: '#E5E5E5' }}>
            Intensidade
          </span>
          <span className="text-sm font-medium" style={{ color: '#3B82F6' }}>
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
          style={{ accentColor: '#3B82F6', height: 44 }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: '#6B6B6B' }}>Leve</span>
          <span className="text-xs" style={{ color: '#6B6B6B' }}>Moderado</span>
          <span className="text-xs" style={{ color: '#6B6B6B' }}>Extremo</span>
        </div>
      </div>
    </div>
  )
}

// --- Step 2: Evento Disparador ---
function Step2({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold" style={{ color: '#E5E5E5' }}>
        Evento Disparador
      </h2>
      <TextArea
        label="O que aconteceu que iniciou a cadeia?"
        hint="O que aconteceu de diferente nesse dia comparado ao dia anterior?"
        value={form.promptingEvent}
        onChange={v => update('promptingEvent', v)}
      />
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#E5E5E5' }}>
          Quando aconteceu?
        </label>
        <input
          type="date"
          value={form.promptingEventDate}
          onChange={e => update('promptingEventDate', e.target.value)}
          className="w-full p-4 rounded-xl text-sm"
          style={{
            background: '#1A1A1A',
            border: '1px solid #2A2A2A',
            color: '#E5E5E5',
            outline: 'none',
            minHeight: 44,
            transition: 'border-color 200ms',
          }}
          onFocus={e => (e.target.style.borderColor = '#3B82F6')}
          onBlur={e => (e.target.style.borderColor = '#2A2A2A')}
        />
      </div>
    </div>
  )
}

// --- Step 3: Fatores de Vulnerabilidade ---
function Step3({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold" style={{ color: '#E5E5E5' }}>
        Fatores de Vulnerabilidade
      </h2>
      <VulnerabilityChips
        selected={form.vulnerabilityChecklist}
        onChange={v => update('vulnerabilityChecklist', v)}
      />
      <TextArea
        label="Descreva o que te deixou mais vulnerável"
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
      <div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: '#E5E5E5' }}>
          Elos da Cadeia
        </h2>
        <p className="text-xs leading-relaxed" style={{ color: '#6B6B6B' }}>
          Detalhe cada pensamento, sentimento e ação entre o disparador e o comportamento-problema.
        </p>
      </div>

      {links.map((link, i) => (
        <div key={i} className="flex gap-3">
          {/* Timeline dot + line */}
          <div className="flex flex-col items-center pt-4">
            <div
              className="rounded-full shrink-0"
              style={{ width: 10, height: 10, background: '#3B82F6' }}
            />
            {i < links.length - 1 && (
              <div className="flex-1" style={{ width: 2, background: '#1E1E1E', minHeight: 20 }} />
            )}
          </div>

          <div
            className="flex-1 p-4 rounded-xl"
            style={{ background: '#141414', border: '1px solid #1E1E1E' }}
          >
            {/* Type selector */}
            <div className="flex flex-wrap gap-2 mb-4">
              {CHAIN_LINK_TYPES.map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => updateLink(i, 'type', t.key)}
                  className="px-3 py-2 rounded-full text-xs"
                  style={{
                    background: link.type === t.key ? '#3B82F620' : '#1A1A1A',
                    border: `1px solid ${link.type === t.key ? '#3B82F6' : '#2A2A2A'}`,
                    color: link.type === t.key ? '#3B82F6' : '#6B6B6B',
                    cursor: 'pointer',
                    minHeight: 36,
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
                className="flex-1 p-3 rounded-xl text-sm leading-relaxed"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                  color: '#E5E5E5',
                  outline: 'none',
                  transition: 'border-color 200ms',
                }}
                onFocus={e => (e.target.style.borderColor = '#3B82F6')}
                onBlur={e => (e.target.style.borderColor = '#2A2A2A')}
              />
              <button
                onClick={() => removeLink(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B6B6B',
                  cursor: 'pointer',
                  minWidth: 44,
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          border: '1px dashed #2A2A2A',
          color: '#3B82F6',
          cursor: 'pointer',
          minHeight: 44,
        }}
      >
        + Adicionar elo
      </button>
    </div>
  )
}

// --- Step 5: Consequências ---
function Step5({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold" style={{ color: '#E5E5E5' }}>
        Consequências
      </h2>
      <TextArea
        label="Consequências externas — curto prazo"
        value={form.consequencesShortTerm}
        onChange={v => update('consequencesShortTerm', v)}
        rows={3}
      />
      <TextArea
        label="Consequências externas — longo prazo"
        value={form.consequencesLongTerm}
        onChange={v => update('consequencesLongTerm', v)}
        rows={3}
      />
      <TextArea
        label="Consequências internas — curto prazo"
        value={form.consequencesInternal}
        onChange={v => update('consequencesInternal', v)}
        rows={3}
      />
      <TextArea
        label="Consequências internas — longo prazo"
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
      <h2 className="text-lg font-semibold" style={{ color: '#E5E5E5' }}>
        Habilidades Alternativas
      </h2>
      <TextArea
        label="Que habilidades DBT poderiam substituir os elos problemáticos?"
        hint="Pense em Mindfulness, Tolerância ao Mal-Estar, Regulação Emocional, Efetividade Interpessoal."
        value={form.skillfulBehaviors}
        onChange={v => update('skillfulBehaviors', v)}
      />
    </div>
  )
}

// --- Step 7: Plano de Prevenção ---
function Step7({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold" style={{ color: '#E5E5E5' }}>
        Plano de Prevenção
      </h2>
      <TextArea
        label="Como reduzir sua vulnerabilidade para que a cadeia nem comece?"
        hint="Pense em rotinas, autocuidado, limites e estratégias preventivas."
        value={form.preventionPlan}
        onChange={v => update('preventionPlan', v)}
      />
    </div>
  )
}

// --- Step 8: Reparação e Fechamento ---
function Step8({
  form,
  update,
  onFinish,
}: StepProps & { onFinish: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold" style={{ color: '#E5E5E5' }}>
        Reparação e Fechamento
      </h2>
      <TextArea
        label="O que você pode fazer para reparar as consequências?"
        hint="Repare o dano real. Reconstrua confiança com ações, não com palavras."
        value={form.repairPlan}
        onChange={v => update('repairPlan', v)}
      />

      {/* Toggle reparação */}
      <div
        className="flex items-center justify-between p-4 rounded-xl"
        style={{ background: '#141414', border: '1px solid #1E1E1E' }}
      >
        <span className="text-sm" style={{ color: '#E5E5E5' }}>
          Reparação realizada?
        </span>
        <button
          type="button"
          onClick={() => update('repairDone', !form.repairDone)}
          className="relative rounded-full"
          style={{
            width: 52,
            height: 32,
            background: form.repairDone ? '#10B981' : '#2A2A2A',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 200ms',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <span
            className="absolute rounded-full"
            style={{
              width: 24,
              height: 24,
              background: '#fff',
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
        className="w-full py-4 rounded-xl text-sm font-semibold"
        style={{
          background: '#10B981',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          minHeight: 48,
        }}
      >
        Finalizar Análise
      </button>
    </div>
  )
}
