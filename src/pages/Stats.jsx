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
        <button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/history')}>← Historik</button>
        <p style={{ color: 'var(--text-2)', textAlign: 'center', paddingTop: 32 }}>Laddar...</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="page">
        <button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/history')}>← Historik</button>
        <p style={{ color: 'var(--text-2)', textAlign: 'center', paddingTop: 32 }}>Inga rundor ännu.</p>
      </div>
    )
  }

  // Aggregate per course
  const courseMap = {}
  for (const entry of history) {
    const key = entry.courseName
    if (!courseMap[key]) courseMap[key] = { name: key, rounds: [] }
    courseMap[key].rounds.push(entry)
  }

  // Per-player aggregates across all rounds
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
      <button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/history')}>← Historik</button>
      <h1>Statistik</h1>

      {/* ── Per player ── */}
      <section>
        <h2 style={{ marginBottom: 10 }}>Spelare</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {playerEntries.map(([player, s], i) => (
            <div key={player} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem',
                color: i === 0 ? 'var(--winner)' : 'var(--text-3)', width: 20, textAlign: 'center',
              }}>{i + 1}</span>
              <span style={{ flex: 1, fontWeight: 600, color: 'var(--text)' }}>{player}</span>
              <div style={{ display: 'flex', gap: 16, textAlign: 'center' }}>
                {[
                  { label: 'Vinster', val: s.wins },
                  { label: 'Rundor', val: s.rounds },
                  { label: 'Snitt', val: s.rounds > 0 ? Math.round(s.totalKast / s.rounds) : '—' },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900,
                      fontSize: '1.1rem', color: 'var(--text)' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Per course ── */}
      <section>
        <h2 style={{ marginBottom: 10 }}>Per bana</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.values(courseMap).map(({ name, rounds }) => {
            // Per-player stats on this course
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
              <div key={name} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{rounds.length} {rounds.length === 1 ? 'runda' : 'rundor'}</span>
                </div>
                {best && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>
                    Bäst snitt: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{best.player}</span>
                    <span style={{ color: 'var(--text-3)' }}> · {best.avg.toFixed(1)} kast/runda</span>
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
                  {Object.entries(coursePlayerMap)
                    .sort((a, b) => (a[1].totalKast / a[1].rounds) - (b[1].totalKast / b[1].rounds))
                    .map(([player, s]) => (
                      <div key={player} style={{ fontSize: '0.75rem', background: 'var(--surface-3)',
                        borderRadius: 8, padding: '3px 8px', color: 'var(--text-2)' }}>
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
