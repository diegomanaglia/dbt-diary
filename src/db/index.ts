import Dexie, { type Table } from 'dexie'

export interface ChainLink {
  type: 'pensamento' | 'sentimento' | 'sensacao' | 'acao' | 'evento'
  content: string
}

export interface ChainEntry {
  id?: number
  createdAt: Date
  updatedAt: Date

  // Passo 1: Comportamento-problema
  problemBehavior: string
  behaviorIntensity: number

  // Passo 2: Evento disparador
  promptingEvent: string
  promptingEventDate: string

  // Passo 3: Fatores de vulnerabilidade
  vulnerabilityFactors: string
  vulnerabilityChecklist: string[]

  // Passo 4: Elos da cadeia
  chainLinks: ChainLink[]

  // Passo 5: Consequências
  consequencesShortTerm: string
  consequencesLongTerm: string
  consequencesInternal: string
  consequencesExternal: string

  // Passo 6: Habilidades alternativas
  skillfulBehaviors: string

  // Passo 7: Plano de prevenção
  preventionPlan: string

  // Passo 8: Reparação
  repairPlan: string
  repairDone: boolean

  // Metadados
  moodBefore: number
  moodAfter: number
  notes: string
  isComplete: boolean
}

export interface QuickNote {
  id?: number
  createdAt: Date
  content: string
  mood: number
  tag: 'geral' | 'insight' | 'gatilho' | 'conquista' | 'sessao'
}

class CadeiaDbtDatabase extends Dexie {
  chainEntries!: Table<ChainEntry>
  quickNotes!: Table<QuickNote>

  constructor() {
    super('cadeia-dbt')
    this.version(1).stores({
      chainEntries: '++id, createdAt, isComplete',
      quickNotes: '++id, createdAt, tag',
    })
  }
}

export const db = new CadeiaDbtDatabase()
