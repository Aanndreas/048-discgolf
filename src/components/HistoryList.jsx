import { useNavigate } from 'react-router-dom'

export function HistoryList({ history, onDelete, onDeleteAll }) {
  const navigate = useNavigate()

  if (history.length === 0) {
    return (
      <p style={{ color: 'var(--text-2)', textAlign: 'center', paddingTop: 32 }}>
        Inga sparade rundor ännu.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {history.map(entry => (
        <div
          key={entry.id}
          className="history-entry"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/history/${entry.id}`)}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'var(--text)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}>
                  {entry.courseName}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>
                  {entry.date}
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>
                <span style={{ color: 'var(--winner)', fontWeight: 600 }}>🥇 {entry.winner}</span>
                <span style={{ color: 'var(--text-3)' }}> · {entry.players.filter(p => p !== entry.winner).join(', ')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>→</span>
              <button
                className="btn-ghost"
                style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--red)' }}
                onClick={e => { e.stopPropagation(); onDelete(entry.id) }}
              >
                Ta bort
              </button>
            </div>
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
