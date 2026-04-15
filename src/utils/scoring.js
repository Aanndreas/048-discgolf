export function getTotal(scores, player) {
  return (scores[player] ?? []).reduce((sum, s) => sum + (s ?? 0), 0)
}

export function getAllTotals(scores, players) {
  return Object.fromEntries(players.map(p => [p, getTotal(scores, p)]))
}

export function getPlayerStats(scores, player) {
  const played = (scores[player] ?? []).filter(s => s !== null)
  if (played.length === 0) {
    return { total: 0, avg: 0, best: null, worst: null, holesPlayed: 0 }
  }
  const total = played.reduce((s, n) => s + n, 0)
  return {
    total,
    avg: total / played.length,
    best: Math.min(...played),
    worst: Math.max(...played),
    holesPlayed: played.length,
  }
}

export function getWinner(scores, players) {
  const totals = getAllTotals(scores, players)
  return players.reduce((best, p) => totals[p] < totals[best] ? p : best)
}
