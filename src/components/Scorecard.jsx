import { getAllTotals } from '../utils/scoring'

export function Scorecard({ scores, players, holes, currentHole }) {
  const totals = getAllTotals(scores, players)
  const holeNumbers = Array.from({ length: holes }, (_, i) => i)

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table className="scorecard-table">
        <thead>
          <tr>
            <th className="player-col">Spelare</th>
            {holeNumbers.map(i => (
              <th key={i} className={i === currentHole ? 'active-col' : ''}>
                {i + 1}
              </th>
            ))}
            <th>Tot</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player}>
              <td className="player-col">{player}</td>
              {holeNumbers.map(i => (
                <td
                  key={i}
                  className={[
                    i === currentHole ? 'active-col' : '',
                    scores[player][i] === null ? 'empty-score' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {scores[player][i] ?? '·'}
                </td>
              ))}
              <td className="total-col">{totals[player]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
