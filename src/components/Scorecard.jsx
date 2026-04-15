import { getAllTotals } from '../utils/scoring'

export function Scorecard({ scores, players, holes, currentHole }) {
  const totals = getAllTotals(scores, players)
  const holeNumbers = Array.from({ length: holes }, (_, i) => i)

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr>
            <th style={thStyle}>Spelare</th>
            {holeNumbers.map(i => (
              <th
                key={i}
                style={{ ...thStyle, background: i === currentHole ? 'var(--highlight)' : undefined }}
              >
                {i + 1}
              </th>
            ))}
            <th style={thStyle}>Tot</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player}>
              <td style={tdStyle}>{player}</td>
              {holeNumbers.map(i => (
                <td
                  key={i}
                  style={{ ...tdStyle, background: i === currentHole ? 'rgba(233,69,96,0.1)' : undefined }}
                >
                  {scores[player][i] ?? '·'}
                </td>
              ))}
              <td style={{ ...tdStyle, fontWeight: 700 }}>{totals[player]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const thStyle = {
  padding: '6px 8px',
  background: 'var(--accent)',
  textAlign: 'center',
  fontWeight: 600,
}

const tdStyle = {
  padding: '6px 8px',
  textAlign: 'center',
  borderBottom: '1px solid var(--accent)',
}
