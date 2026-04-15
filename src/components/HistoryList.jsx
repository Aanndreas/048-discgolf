export function HistoryList({ history, onDelete, onDeleteAll }) {
  if (history.length === 0) {
    return <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Inga sparade rundor ännu.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {history.map(entry => (
        <div key={entry.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <strong>{entry.courseName}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 8 }}>{entry.date}</span>
            </div>
            <button
              className="btn-ghost"
              style={{ padding: '4px 10px', color: 'var(--highlight)', fontSize: '0.8rem' }}
              onClick={() => onDelete(entry.id)}
            >
              Ta bort
            </button>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            🏆 {entry.winner} ·{' '}
            {entry.players.join(', ')}
          </div>
        </div>
      ))}

      <button
        className="btn-danger"
        style={{ width: '100%', marginTop: 8 }}
        onClick={onDeleteAll}
      >
        Rensa all historik
      </button>
    </div>
  )
}
