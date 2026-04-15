import { getAllTotals, getWinner } from '../utils/scoring'

export function CelebrationScreen({ players, scores, courseName, date }) {
  const winner = getWinner(scores, players)
  const totals = getAllTotals(scores, players)
  const sorted = [...players].sort((a, b) => totals[a] - totals[b])

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: '3rem' }}>🏆</div>
      <h1>Grattis {winner}!</h1>
      <p style={{ color: 'var(--text-muted)' }}>{courseName} · {date}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map((player, i) => (
          <div
            key={player}
            className="card row"
            style={{ justifyContent: 'space-between', opacity: i === 0 ? 1 : 0.75 }}
          >
            <span>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {player}
            </span>
            <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{totals[player]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
