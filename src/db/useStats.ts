import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './index'

export function useStats(days: number | null) {
  return useLiveQuery(async () => {
    const since = days ? new Date(Date.now() - days * 86400000) : new Date(0)

    const chains = await db.chainEntries
      .where('createdAt')
      .above(since)
      .toArray()

    const notes = await db.quickNotes
      .where('createdAt')
      .above(since)
      .toArray()

    const totalChains = chains.length
    const completeChains = chains.filter(c => c.isComplete).length
    const draftChains = totalChains - completeChains

    const avgIntensity = totalChains > 0
      ? chains.reduce((sum, c) => sum + c.behaviorIntensity, 0) / totalChains
      : 0

    // Vulnerability frequency
    const vulnCounts: Record<string, number> = {}
    chains.forEach(c => {
      c.vulnerabilityChecklist.forEach(v => {
        vulnCounts[v] = (vulnCounts[v] || 0) + 1
      })
    })

    // Mood over time (chains + notes combined)
    const moodData: { date: Date; mood: number }[] = []
    chains.forEach(c => {
      if (c.moodAfter > 0) moodData.push({ date: c.createdAt, mood: c.moodAfter })
    })
    notes.forEach(n => {
      if (n.mood > 0) moodData.push({ date: n.createdAt, mood: n.mood })
    })
    moodData.sort((a, b) => a.date.getTime() - b.date.getTime())

    return {
      totalChains,
      completeChains,
      draftChains,
      avgIntensity,
      vulnCounts,
      moodData,
    }
  }, [days])
}
