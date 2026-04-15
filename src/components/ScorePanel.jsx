import { useState } from 'react'
import { getAllTotals } from '../utils/scoring'

export function ScorePanel({ scores, players }) {
  const [open, setOpen] = useState(false)
  const totals = getAllTotals(scores, players)

  return (
    <div style={{ marginTop: 4 }}>
      <button
        className="btn-ghost"
        style={{ width: '100%', fontSize: '0.8125rem' }}
        onClick={() => setOpen(o => !o)}
      >
        {open ? '▲ Dölj totalpoäng' : '▼ Visa totalpoäng'}
      </button>

      {open && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '14px 16px',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          marginTop: 8,
        }}>
          {players.map(p => (
            <div key={p} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: 4 }}>
                {p}
              </div>
              <div className="num-xl" style={{ fontSize: '2rem', color: 'var(--text)' }}>
                {totals[p]}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
