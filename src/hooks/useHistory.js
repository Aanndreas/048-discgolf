import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const LS_KEY = 'udisk_history'
const GROUP_KEY = 'udisk_group'

function getGroupCode() {
  return localStorage.getItem(GROUP_KEY) || '048'
}

function lsLoad() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function lsSave(entries) {
  localStorage.setItem(LS_KEY, JSON.stringify(entries))
}

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

function entryToRow(entry, groupCode) {
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
    group_code: groupCode,
  }
}

export function useHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saving' | 'saved' | 'error'

  useEffect(() => {
    if (!supabase) {
      setHistory(lsLoad())
      setLoading(false)
      return
    }

    const groupCode = getGroupCode()

    async function init() {
      // One-time migration from localStorage
      try {
        const raw = localStorage.getItem(LS_KEY)
        if (raw) {
          const entries = JSON.parse(raw)
          if (Array.isArray(entries) && entries.length > 0) {
            const rows = entries.map(e => entryToRow(e, groupCode))
            const { error } = await supabase.from('rounds').upsert(rows, { onConflict: 'id' })
            if (!error) localStorage.removeItem(LS_KEY)
          }
        }
      } catch {}

      const { data, error } = await supabase
        .from('rounds')
        .select('*')
        .eq('group_code', groupCode)
        .order('created_at', { ascending: false })

      if (!error && data) setHistory(data.map(rowToEntry))
      setLoading(false)
    }

    init()
  }, [])

  async function saveRound(entry) {
    setSaveStatus('saving')
    try {
      if (!supabase) {
        const updated = [entry, ...lsLoad()]
        lsSave(updated)
        setHistory(updated)
        setSaveStatus('saved')
        return
      }
      const groupCode = getGroupCode()
      const { error } = await supabase.from('rounds').insert(entryToRow(entry, groupCode))
      if (error) throw error
      setHistory(prev => [entry, ...prev])
      setSaveStatus('saved')
    } catch {
      // Supabase failed — fall back to localStorage so the round is never lost
      const updated = [entry, ...lsLoad()]
      lsSave(updated)
      setHistory(updated)
      setSaveStatus('error')
    }
  }

  async function deleteRound(id) {
    if (!supabase) {
      const updated = lsLoad().filter(e => e.id !== id)
      lsSave(updated)
      setHistory(updated)
      return
    }
    const { error } = await supabase.from('rounds').delete().eq('id', id)
    if (!error) setHistory(prev => prev.filter(e => e.id !== id))
  }

  async function deleteAllRounds() {
    if (!supabase) {
      lsSave([])
      setHistory([])
      return
    }
    const groupCode = getGroupCode()
    const { error } = await supabase.from('rounds').delete().eq('group_code', groupCode)
    if (!error) setHistory([])
  }

  return { history, loading, saveRound, deleteRound, deleteAllRounds, saveStatus }
}
