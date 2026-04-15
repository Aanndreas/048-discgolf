import { useState } from 'react'
import { getAllTotals } from '../utils/scoring'

export function ScorePanel({ scores, players }) {
  const [open, setOpen] = useState(false)
  const totals = getAllTotals(scores, players)

  return (
    <div>
      <button
        className="btn-ghost"
        style={{ width: '100%', fontSize: '0.875rem' }}
        onClick={() => setOpen(o => !o)}
      >
        {open ? '▲ Dölj totalpoäng' : '▼ Visa totalpoäng'}
      </button>
      {open && (
        <div
          className="card"
          style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}
        >
          {players.map(p => (
            <div key={p} style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totals[p]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
