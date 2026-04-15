import { useRef, useState } from 'react'

function formatTime(date) {
  return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function PlayerScoreRow({ player, score, lastChanged, onIncrement, onDecrement, onSetScore }) {
  const [editing, setEditing] = useState(false)
  const [rawVal, setRawVal] = useState('')
  const holdTimerRef = useRef(null)
  const holdFiredRef = useRef(false)

  function startEdit() {
    setRawVal(score !== null ? String(score) : '')
    setEditing(true)
  }

  function commitEdit() {
    const n = parseInt(rawVal, 10)
    if (!isNaN(n) && n >= 1 && onSetScore) onSetScore(n)
    setEditing(false)
  }

  function handleIncrementStart() {
    holdFiredRef.current = false
    holdTimerRef.current = setTimeout(() => {
      holdFiredRef.current = true
      holdTimerRef.current = null
      onIncrement(5)
    }, 1500)
  }

  function handleIncrementEnd() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
      if (!holdFiredRef.current) onIncrement(1)
    }
  }

  function handleIncrementCancel() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
      holdFiredRef.current = false
    }
  }

  return (
    <div className="score-row">
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="score-player-name">{player}</span>
        {lastChanged && (
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)', letterSpacing: '0.02em' }}>
            Senast registrerat: {formatTime(lastChanged)}
          </span>
        )}
      </div>

      <div className="score-controls">
        <button
          className="score-btn"
          onClick={onDecrement}
          disabled={score === null || score <= 1}
        >
          −
        </button>

        {editing ? (
          <input
            type="number"
            min={1}
            max={99}
            className="score-input-inline"
            value={rawVal}
            autoFocus
            onChange={e => setRawVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') setEditing(false)
            }}
          />
        ) : (
          <span
            key={score}
            className={`score-value ${score === null ? 'is-empty' : 'score-pop'}`}
            data-empty={score === null ? 'true' : undefined}
            onClick={startEdit}
            style={{ cursor: 'text' }}
          >
            {score ?? '–'}
          </span>
        )}

        <button
          className="score-btn increment"
          onPointerDown={handleIncrementStart}
          onPointerUp={handleIncrementEnd}
          onPointerLeave={handleIncrementCancel}
        >
          +
        </button>
      </div>
    </div>
  )
}
