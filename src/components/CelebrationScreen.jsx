import { getAllTotals, getWinner } from '../utils/scoring'

export function CelebrationScreen({ players, scores, courseName, date }) {
  const winner = getWinner(scores, players)
  const totals = getAllTotals(scores, players)
  const sorted = [...players].sort((a, b) => totals[a] - totals[b])

  const rankClass = ['rank-1', 'rank-2', 'rank-3', '', '', '']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Celebration hero ── */}
      <div data-testid="celebration-hero" style={{ textAlign: 'center', paddingTop: 8 }}>
        <span className="course-badge" style={{ marginBottom: 20, display: 'inline-flex' }}>
          {courseName} · {date}
        </span>

        <div className="celebrate-block">
          <div className="celebrate-label">Grattis</div>
          <div className="celebrate-name">{winner}!</div>
          <div className="celebrate-kast">{totals[winner]} kast</div>
        </div>

        <div className="celebrate-line" />
      </div>

      {/* ── Leaderboard ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map((player, i) => (
          <div key={player} className={`leaderboard-row ${i === 0 ? 'is-winner' : ''}`}>
            <span className={`rank-badge ${rankClass[i] || ''}`}>
              {i + 1}
            </span>
            <span className="leaderboard-name">{player}</span>
            <span className="leaderboard-score">{totals[player]}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
