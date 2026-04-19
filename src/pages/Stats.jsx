import { useNavigate } from 'react-router-dom'
import { useHistory } from '../hooks/useHistory'
import { getAllTotals } from '../utils/scoring'
import { PageCredit } from '../components/PageCredit'

export default function Stats() {
  const navigate = useNavigate()
  const { history, loading } = useHistory()

  if (loading) {
    return (
      <div className="page">
        <p className="empty-state">Laddar...</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="page">
        <p className="empty-state">Inga rundor ännu.</p>
      </div>
    )
  }

  const courseMap = {}
  for (const entry of history) {
    const key = entry.courseName
    if (!courseMap[key]) courseMap[key] = { name: key, rounds: [] }
    courseMap[key].rounds.push(entry)
  }

  const playerMap = {}
  for (const entry of history) {
    const totals = getAllTotals(entry.scores, entry.players)
    for (const player of entry.players) {
      if (!playerMap[player]) playerMap[player] = { wins: 0, rounds: 0, totalKast: 0 }
      playerMap[player].rounds++
      playerMap[player].totalKast += totals[player] ?? 0
      if (player === entry.winner) playerMap[player].wins++
    }
  }
  const playerEntries = Object.entries(playerMap).sort((a, b) => b[1].wins - a[1].wins)

  return (
    <div className="page">
      <h1>Statistik</h1>

      <section>
        <h2 style={{ marginBottom: 10 }}>Spelare</h2>
        <div className="col">
          {playerEntries.map(([player, s], i) => (
            <div key={player} className="card stats-player-row">
              <span className="stats-rank" style={{ color: i === 0 ? 'var(--winner)' : 'var(--text-3)' }}>
                {i + 1}
              </span>
              <span className="player-name flex-1">{player}</span>
              <div className="stats-nums">
                {[
                  { label: 'Vinster', val: s.wins },
                  { label: 'Rundor', val: s.rounds },
                  { label: 'Snitt', val: s.rounds > 0 ? Math.round(s.totalKast / s.rounds) : '—' },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div className="stats-num-label">{label}</div>
                    <div className="stats-num-val">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 10 }}>Per bana</h2>
        <div className="col">
          {Object.values(courseMap).map(({ name, rounds }) => {
            const coursePlayerMap = {}
            for (const entry of rounds) {
              const totals = getAllTotals(entry.scores, entry.players)
              for (const player of entry.players) {
                if (!coursePlayerMap[player]) coursePlayerMap[player] = { rounds: 0, totalKast: 0, wins: 0 }
                coursePlayerMap[player].rounds++
                coursePlayerMap[player].totalKast += totals[player] ?? 0
                if (player === entry.winner) coursePlayerMap[player].wins++
              }
            }
            const best = Object.entries(coursePlayerMap)
              .map(([p, s]) => ({ player: p, avg: s.totalKast / s.rounds }))
              .sort((a, b) => a.avg - b.avg)[0]

            return (
              <div key={name} className="card col">
                <div className="course-card-header">
                  <span className="course-card-name">{name}</span>
                  <span className="course-card-count">{rounds.length} {rounds.length === 1 ? 'runda' : 'rundor'}</span>
                </div>
                {best && (
                  <div className="course-best-info">
                    Bäst snitt: <span className="course-best-player">{best.player}</span>
                    <span className="course-best-avg"> · {best.avg.toFixed(1)} kast/runda</span>
                  </div>
                )}
                <div className="player-pills">
                  {Object.entries(coursePlayerMap)
                    .sort((a, b) => (a[1].totalKast / a[1].rounds) - (b[1].totalKast / b[1].rounds))
                    .map(([player, s]) => (
                      <div key={player} className="player-pill">
                        {player} · {(s.totalKast / s.rounds).toFixed(1)} · {s.wins}🏆
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <PageCredit />
    </div>
  )
}
