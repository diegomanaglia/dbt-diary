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
    <div className="flex flex-col min-h-full pb-20">
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
        <h1 className="text-base font-medium" style={{ color: '#FAFAFA' }}>
          Nova Nota
        </h1>
      </header>

      <div className="px-5 flex flex-col gap-6 flex-1">
        <div>
          <label className="block mb-2" style={{ fontSize: 11, color: '#52525B', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Conteudo
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            placeholder="O que esta em mente?"
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
        </div>

        <MoodSlider label="Humor" value={mood} onChange={setMood} />

        <div>
          <label className="block mb-2" style={{ fontSize: 11, color: '#52525B', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Tag
          </label>
          <div className="flex flex-wrap gap-2">
            {NOTE_TAGS.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTag(t.key as QuickNote['tag'])}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  background: tag === t.key ? '#0891B212' : '#111113',
                  border: `1px solid ${tag === t.key ? '#0891B2' : '#27272A'}`,
                  color: tag === t.key ? '#0891B2' : '#A1A1AA',
                  cursor: 'pointer',
                  minHeight: 44,
                  transition: 'all 200ms',
                  fontWeight: tag === t.key ? 500 : 400,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className="w-full py-3 rounded-xl text-sm font-medium"
          style={{
            background: content.trim() ? '#0891B2' : '#1A1A1D',
            color: content.trim() ? '#fff' : '#3F3F46',
            border: 'none',
            cursor: content.trim() ? 'pointer' : 'default',
            minHeight: 44,
            transition: 'all 200ms',
          }}
        >
          Salvar
        </button>
      </div>
    </div>
  )
}
