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
          <StepIndicator current={step} total={TOTAL_STEPS} />
        </div>
      </header>

      {/* Step content */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
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
        className="px-8 pt-5 flex gap-3"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingBottom: 'max(88px, calc(88px + env(safe-area-inset-bottom)))',
        }}
      >
        {step > 1 && (
          <button onClick={goPrev} className="flex-1 py-3.5 btn-ghost text-sm font-medium" style={{ minHeight: 48 }}>
            Voltar
          </button>
        )}
        {step < TOTAL_STEPS && (
          <button onClick={goNext} className="flex-1 py-3.5 btn-accent text-sm" style={{ minHeight: 48 }}>
            Próximo
          </button>
        )}
      </div>
    </div>
  )
}

type UpdateFn = <K extends keyof Omit<ChainEntry, 'id'>>(key: K, value: Omit<ChainEntry, 'id'>[K]) => void

interface StepProps {
  form: Omit<ChainEntry, 'id'>
  update: UpdateFn
}

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
      <label className="label-upper block mb-4">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full input-glass text-sm"
        style={{ lineHeight: 1.7 }}
      />
      {hint && (
        <p className="mt-2" style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  )
}

function Step1({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
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
          <span className="label-upper">Intensidade</span>
          <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
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
        <div className="flex justify-between mt-1">
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>Leve</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>Moderado</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>Extremo</span>
        </div>
      </div>
    </div>
  )
}

function Step2({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
        Evento Disparador
      </h2>
      <TextArea
        label="O que aconteceu que iniciou a cadeia?"
        hint="O que aconteceu de diferente nesse dia comparado ao dia anterior?"
        value={form.promptingEvent}
        onChange={v => update('promptingEvent', v)}
      />
      <div>
        <label className="label-upper block mb-3">Quando aconteceu?</label>
        <input
          type="date"
          value={form.promptingEventDate}
          onChange={e => update('promptingEventDate', e.target.value)}
          className="w-full input-glass text-sm"
          style={{ minHeight: 44 }}
        />
      </div>
    </div>
  )
}

function Step3({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
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
    <div className="flex flex-col gap-8">
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
        Elos da Cadeia
      </h2>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
        Detalhe cada pensamento, sentimento e ação entre o disparador e o comportamento-problema.
      </p>

      {links.map((link, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center pt-3">
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', opacity: 0.6 }} />
            {i < links.length - 1 && (
              <div style={{ width: 1, flex: 1, background: 'var(--border-subtle)' }} />
            )}
          </div>
          <div className="flex-1 glass p-5" style={{ borderRadius: 16 }}>
            <div className="flex flex-wrap gap-2 mb-4">
              {CHAIN_LINK_TYPES.map(t => {
                const active = link.type === t.key
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => updateLink(i, 'type', t.key)}
                    className="px-3 py-1.5"
                    style={{
                      fontSize: 11,
                      background: active ? 'var(--accent-glow)' : 'transparent',
                      border: `1px solid ${active ? 'var(--border-active)' : 'var(--border-subtle)'}`,
                      color: active ? 'var(--accent)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      borderRadius: 8,
                      fontWeight: active ? 600 : 400,
                      transition: 'all 200ms',
                    }}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-2">
              <textarea
                value={link.content}
                onChange={e => updateLink(i, 'content', e.target.value)}
                rows={2}
                placeholder="Descreva este elo..."
                className="flex-1 input-glass text-sm"
                style={{ borderRadius: 10, lineHeight: 1.5 }}
              />
              <button
                onClick={() => removeLink(i)}
                className="btn-ghost flex items-center justify-center"
                style={{ width: 40, height: 40, borderRadius: 10, padding: 0, flexShrink: 0 }}
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
        className="w-full py-3.5 text-sm font-semibold"
        style={{
          background: 'transparent',
          border: '1px dashed var(--border-default)',
          color: 'var(--accent)',
          cursor: 'pointer',
          minHeight: 48,
          borderRadius: 14,
          transition: 'all 250ms ease',
        }}
      >
        + Adicionar elo
      </button>
    </div>
  )
}

function Step5({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Consequências</h2>
      <TextArea label="Consequências externas — curto prazo" value={form.consequencesShortTerm} onChange={v => update('consequencesShortTerm', v)} rows={3} />
      <TextArea label="Consequências externas — longo prazo" value={form.consequencesLongTerm} onChange={v => update('consequencesLongTerm', v)} rows={3} />
      <TextArea label="Consequências internas — curto prazo" value={form.consequencesInternal} onChange={v => update('consequencesInternal', v)} rows={3} />
      <TextArea label="Consequências internas — longo prazo" value={form.consequencesExternal} onChange={v => update('consequencesExternal', v)} rows={3} />
    </div>
  )
}

function Step6({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Habilidades Alternativas</h2>
      <TextArea
        label="Que habilidades DBT poderiam substituir os elos problemáticos?"
        hint="Pense em Mindfulness, Tolerância ao Mal-Estar, Regulação Emocional, Efetividade Interpessoal."
        value={form.skillfulBehaviors}
        onChange={v => update('skillfulBehaviors', v)}
      />
    </div>
  )
}

function Step7({ form, update }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Plano de Prevenção</h2>
      <TextArea
        label="Como reduzir sua vulnerabilidade para que a cadeia nem comece?"
        hint="Pense em rotinas, autocuidado, limites e estratégias preventivas."
        value={form.preventionPlan}
        onChange={v => update('preventionPlan', v)}
      />
    </div>
  )
}

function Step8({
  form,
  update,
  onFinish,
}: StepProps & { onFinish: () => void }) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Reparação e Fechamento</h2>
      <TextArea
        label="O que você pode fazer para reparar as consequências?"
        hint="Repare o dano real. Reconstrua confiança com ações, não com palavras."
        value={form.repairPlan}
        onChange={v => update('repairPlan', v)}
      />

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Reparação realizada?
        </span>
        <button
          type="button"
          onClick={() => update('repairDone', !form.repairDone)}
          className="relative"
          style={{
            width: 52,
            height: 30,
            background: form.repairDone ? 'var(--success)' : 'rgba(255,255,255,0.08)',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 15,
            transition: 'background 250ms',
            padding: 0,
            boxShadow: form.repairDone ? '0 0 12px rgba(52, 211, 153, 0.3)' : 'none',
          }}
        >
          <span
            className="absolute"
            style={{
              width: 22,
              height: 22,
              background: '#fff',
              borderRadius: '50%',
              top: 4,
              left: form.repairDone ? 26 : 4,
              transition: 'left 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </button>
      </div>

      <MoodSlider label="Humor antes do registro" value={form.moodBefore} onChange={v => update('moodBefore', v)} />
      <MoodSlider label="Humor agora" value={form.moodAfter} onChange={v => update('moodAfter', v)} />

      <TextArea label="Notas adicionais" value={form.notes} onChange={v => update('notes', v)} rows={3} placeholder="Opcional" />

      <button
        onClick={onFinish}
        className="w-full py-3.5 text-sm font-semibold"
        style={{
          background: 'linear-gradient(135deg, #34D399, #10B981)',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          minHeight: 48,
          borderRadius: 14,
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.2)',
        }}
      >
        Finalizar Análise
      </button>
    </div>
  )
}
