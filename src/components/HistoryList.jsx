import { useNavigate } from 'react-router-dom'

export function HistoryList({ history, onDelete, onDeleteAll }) {
  const navigate = useNavigate()

  if (history.length === 0) {
    return <p className="empty-state">Inga sparade rundor ännu.</p>
  }

  return (
    <div className="col">
      {history.map(entry => (
        <div
          key={entry.id}
          className="history-entry"
          onClick={() => navigate(`/history/${entry.id}`)}
        >
          <div className="history-entry-row">
            <div className="history-entry-main">
              <div className="history-title-row">
                <span className="history-course-name">{entry.courseName}</span>
                <span className="history-date">{entry.date}</span>
              </div>
              <div className="history-meta">
                <span className="history-winner">🥇 {entry.winner}</span>
                <span className="history-others"> · {entry.players.filter(p => p !== entry.winner).join(', ')}</span>
              </div>
            </div>

            <div className="history-entry-actions">
              <span className="history-arrow">→</span>
              <button
                className="btn-ghost btn-sm-danger"
                onClick={e => { e.stopPropagation(); onDelete(entry.id) }}
              >
                Ta bort
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        className="btn-danger btn-full"
        style={{ marginTop: 8 }}
        onClick={onDeleteAll}
      >
        Rensa all historik
      </button>
    </div>
  )
}
