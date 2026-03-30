import { useLiveQuery } from 'dexie-react-hooks'
import { db, type ChainEntry } from './index'

export function useChains(filter?: 'all' | 'complete' | 'draft') {
  return useLiveQuery(() => {
    let collection = db.chainEntries.orderBy('createdAt').reverse()
    if (filter === 'complete') return collection.filter(c => c.isComplete).toArray()
    if (filter === 'draft') return collection.filter(c => !c.isComplete).toArray()
    return collection.toArray()
  }, [filter])
}

export function useChain(id: number | undefined) {
  return useLiveQuery(
    () => (id != null ? db.chainEntries.get(id) : undefined),
    [id]
  )
}

export function emptyChainEntry(): Omit<ChainEntry, 'id'> {
  const now = new Date()
  return {
    createdAt: now,
    updatedAt: now,
    problemBehavior: '',
    behaviorIntensity: 5,
    promptingEvent: '',
    promptingEventDate: new Date().toISOString().slice(0, 10),
    vulnerabilityFactors: '',
    vulnerabilityChecklist: [],
    chainLinks: [],
    consequencesShortTerm: '',
    consequencesLongTerm: '',
    consequencesInternal: '',
    consequencesExternal: '',
    skillfulBehaviors: '',
    preventionPlan: '',
    repairPlan: '',
    repairDone: false,
    moodBefore: 5,
    moodAfter: 5,
    notes: '',
    isComplete: false,
  }
}

export async function saveChain(entry: Omit<ChainEntry, 'id'> & { id?: number }): Promise<number> {
  const data = { ...entry, updatedAt: new Date() }
  if (data.id) {
    await db.chainEntries.put(data as ChainEntry)
    return data.id
  }
  return await db.chainEntries.add(data)
}

export async function deleteChain(id: number) {
  await db.chainEntries.delete(id)
}
