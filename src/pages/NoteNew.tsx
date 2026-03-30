import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveNote } from '../db/useNotes'
import MoodSlider from '../components/MoodSlider'
import { NOTE_TAGS } from '../utils/constants'
import type { QuickNote } from '../db'

export default function NoteNew() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [mood, setMood] = useState(5)
  const [tag, setTag] = useState<QuickNote['tag']>('geral')

  const handleSave = async () => {
    if (!content.trim()) return
    await saveNote({
      createdAt: new Date(),
      content: content.trim(),
      mood,
      tag,
    })
    navigate('/')
  }

  return (
    <div className="flex flex-col min-h-full" style={{ paddingBottom: 100 }}>
      <header className="px-8 pt-8 pb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="btn-ghost flex items-center justify-center"
          style={{ width: 44, height: 44, borderRadius: 12, padding: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Nova Nota
        </h1>
      </header>

      <div className="px-8 flex flex-col gap-8 flex-1">
        <div>
          <label className="label-upper block mb-4">Conteudo</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            placeholder="O que esta em mente?"
            className="w-full input-glass text-sm"
            style={{ lineHeight: 1.7 }}
          />
        </div>

        <MoodSlider label="Humor" value={mood} onChange={setMood} />

        <div>
          <label className="label-upper block mb-4">Tag</label>
          <div className="flex flex-wrap gap-2">
            {NOTE_TAGS.map(t => {
              const active = tag === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTag(t.key as QuickNote['tag'])}
                  className="px-4 py-2.5 text-sm"
                  style={{
                    background: active ? 'var(--accent-glow)' : 'var(--bg-surface)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${active ? 'var(--border-active)' : 'var(--border-subtle)'}`,
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    minHeight: 44,
                    borderRadius: 12,
                    transition: 'all 250ms ease',
                    fontWeight: active ? 600 : 400,
                    boxShadow: active ? '0 0 12px var(--accent-glow)' : 'none',
                  }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="px-8 py-5">
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className="w-full py-3.5 text-sm font-semibold"
          style={{
            background: content.trim()
              ? 'linear-gradient(135deg, #06B6D4, #0891B2)'
              : 'rgba(255,255,255,0.04)',
            color: content.trim() ? '#fff' : 'var(--text-muted)',
            border: 'none',
            cursor: content.trim() ? 'pointer' : 'default',
            minHeight: 48,
            borderRadius: 14,
            transition: 'all 250ms ease',
            boxShadow: content.trim() ? '0 0 20px rgba(6, 182, 212, 0.2)' : 'none',
          }}
        >
          Salvar
        </button>
      </div>
    </div>
  )
}
