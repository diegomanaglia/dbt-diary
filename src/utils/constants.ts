export const VULNERABILITY_OPTIONS = [
  { key: 'sono', label: 'Sono desregulado' },
  { key: 'alimentacao', label: 'Alimentação inadequada' },
  { key: 'doenca', label: 'Doença física / dor' },
  { key: 'substancias', label: 'Uso de substâncias' },
  { key: 'estresse', label: 'Estresse no ambiente' },
  { key: 'emocoes', label: 'Emoções intensas prévias' },
  { key: 'comportamentos', label: 'Comportamentos estressantes recentes' },
  { key: 'outro', label: 'Outro' },
] as const

export const CHAIN_LINK_TYPES = [
  { key: 'pensamento', label: 'Pensamento' },
  { key: 'sentimento', label: 'Sentimento' },
  { key: 'sensacao', label: 'Sensação' },
  { key: 'acao', label: 'Ação' },
  { key: 'evento', label: 'Evento' },
] as const

export const NOTE_TAGS = [
  { key: 'geral', label: 'Geral' },
  { key: 'insight', label: 'Insight' },
  { key: 'gatilho', label: 'Gatilho' },
  { key: 'conquista', label: 'Conquista' },
  { key: 'sessao', label: 'Sessão' },
] as const

export function intensityColor(intensity: number): string {
  if (intensity <= 3) return '#10B981'
  if (intensity <= 6) return '#F59E0B'
  return '#EF4444'
}

export function intensityLabel(intensity: number): string {
  if (intensity <= 3) return 'Leve'
  if (intensity <= 6) return 'Moderado'
  return 'Extremo'
}
