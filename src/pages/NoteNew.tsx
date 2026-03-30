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
    <div className="flex flex-col min-h-screen">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
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
        <h1 className="text-lg font-semibold" style={{ color: '#E5E5E5' }}>
          Nova Nota Rápida
        </h1>
      </header>

      <div className="px-5 flex flex-col gap-6 flex-1 py-2">
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: '#E5E5E5' }}>
            Conteúdo
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            placeholder="O que está em mente?"
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
        </div>

        <MoodSlider label="Humor" value={mood} onChange={setMood} />

        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: '#E5E5E5' }}>
            Tag
          </label>
          <div className="flex flex-wrap gap-2">
            {NOTE_TAGS.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTag(t.key as QuickNote['tag'])}
                className="px-4 py-2.5 rounded-full text-sm"
                style={{
                  background: tag === t.key ? '#3B82F620' : '#1A1A1A',
                  border: `1px solid ${tag === t.key ? '#3B82F6' : '#2A2A2A'}`,
                  color: tag === t.key ? '#3B82F6' : '#E5E5E5',
                  cursor: 'pointer',
                  minHeight: 44,
                  transition: 'all 200ms',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="px-5 py-4"
        style={{
          borderTop: '1px solid #1E1E1E',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className="w-full py-3.5 rounded-xl text-sm font-medium"
          style={{
            background: content.trim() ? '#3B82F6' : '#1E1E1E',
            color: content.trim() ? '#fff' : '#6B6B6B',
            border: 'none',
            cursor: content.trim() ? 'pointer' : 'default',
            minHeight: 48,
          }}
        >
          Salvar
        </button>
      </div>
    </div>
  )
}
