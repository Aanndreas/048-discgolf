export function PlayerScoreRow({ player, score, onIncrement, onDecrement }) {
  return (
    <div className="card row" style={{ justifyContent: 'space-between' }}>
      <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{player}</span>
      <div className="row" style={{ gap: 16 }}>
        <button
          onClick={onDecrement}
          disabled={score === null || score <= 1}
          style={{ width: 44, height: 44, padding: 0, fontSize: '1.5rem' }}
        >
          −
        </button>
        <span style={{ fontSize: '2rem', fontWeight: 700, minWidth: 32, textAlign: 'center' }}>
          {score ?? '–'}
        </span>
        <button
          onClick={onIncrement}
          style={{ width: 44, height: 44, padding: 0, fontSize: '1.5rem' }}
        >
          +
        </button>
      </div>
    </div>
  )
}
