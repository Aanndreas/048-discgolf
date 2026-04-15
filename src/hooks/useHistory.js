import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function rowToEntry(row) {
  return {
    id: row.id,
    courseId: row.course_id,
    courseName: row.course_name,
    date: row.date,
    players: row.players,
    scores: row.scores,
    winner: row.winner,
    holes: row.holes,
  }
}

function entryToRow(entry) {
  const holes = entry.holes
    ?? (entry.players ? Object.values(entry.scores)[0]?.length ?? 18 : 18)
  return {
    id: entry.id,
    course_id: entry.courseId ?? null,
    course_name: entry.courseName,
    date: entry.date,
    players: entry.players,
    scores: entry.scores,
    winner: entry.winner,
    holes,
  }
}

export function useHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      // One-time migration from localStorage
      try {
        const raw = localStorage.getItem('udisk_history')
        if (raw) {
          const entries = JSON.parse(raw)
          if (Array.isArray(entries) && entries.length > 0) {
            const rows = entries.map(entryToRow)
            const { error } = await supabase.from('rounds').upsert(rows, { onConflict: 'id' })
            if (!error) localStorage.removeItem('udisk_history')
          }
        }
      } catch {}

      // Fetch all rounds
      const { data, error } = await supabase
        .from('rounds')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) setHistory(data.map(rowToEntry))
      setLoading(false)
    }

    init()
  }, [])

  async function saveRound(entry) {
    const { error } = await supabase.from('rounds').insert(entryToRow(entry))
    if (!error) setHistory(prev => [entry, ...prev])
  }

  async function deleteRound(id) {
    const { error } = await supabase.from('rounds').delete().eq('id', id)
    if (!error) setHistory(prev => prev.filter(e => e.id !== id))
  }

  async function deleteAllRounds() {
    const { error } = await supabase.from('rounds').delete().neq('id', '')
    if (!error) setHistory([])
  }

  return { history, loading, saveRound, deleteRound, deleteAllRounds }
}
