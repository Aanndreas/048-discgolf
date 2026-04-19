import { useState } from 'react'
import { getAllTotals } from '../utils/scoring'

export function ScorePanel({ scores, players }) {
  const [open, setOpen] = useState(false)
  const totals = getAllTotals(scores, players)

  return (
    <div className="score-panel">
      <button
        className="btn-ghost btn-full"
        style={{ fontSize: '0.8125rem' }}
        onClick={() => setOpen(o => !o)}
      >
        {open ? '▲ Dölj totalpoäng' : '▼ Visa totalpoäng'}
      </button>

      {open && (
        <div className="score-panel-body">
          {players.map(p => (
            <div key={p} className="score-panel-player">
              <div className="score-panel-label">{p}</div>
              <div className="num-xl score-panel-total">{totals[p]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
