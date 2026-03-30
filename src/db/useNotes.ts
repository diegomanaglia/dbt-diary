import { useLiveQuery } from 'dexie-react-hooks'
import { db, type QuickNote } from './index'

export function useNotes() {
  return useLiveQuery(() =>
    db.quickNotes.orderBy('createdAt').reverse().toArray()
  )
}

export async function saveNote(note: Omit<QuickNote, 'id'>): Promise<number> {
  return await db.quickNotes.add(note)
}

export async function deleteNote(id: number) {
  await db.quickNotes.delete(id)
}
