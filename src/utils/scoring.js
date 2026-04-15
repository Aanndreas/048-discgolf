export function getTotal(scores, player) {
  return (scores[player] ?? []).reduce((sum, s) => sum + (s ?? 0), 0)
}

export function getAllTotals(scores, players) {
  return Object.fromEntries(players.map(p => [p, getTotal(scores, p)]))
}

export function getPlayerStats(scores, player, par = null) {
  const holeScores = scores[player] ?? []
  const played = holeScores.filter(s => s !== null)
  if (played.length === 0) {
    return { total: 0, avg: 0, best: null, worst: null, holesPlayed: 0,
             relativePar: null, underPar: 0, onPar: 0, overPar: 0 }
  }
  const total = played.reduce((s, n) => s + n, 0)

  let relativePar = null
  let underPar = 0
  let onPar = 0
  let overPar = 0

  if (par) {
    let parSum = 0
    holeScores.forEach((s, i) => {
      if (s === null || par[i] == null) return
      parSum += par[i]
      if (s < par[i]) underPar++
      else if (s === par[i]) onPar++
      else overPar++
    })
    relativePar = total - parSum
  }

  return {
    total,
    avg: total / played.length,
    best: Math.min(...played),
    worst: Math.max(...played),
    holesPlayed: played.length,
    relativePar,
    underPar,
    onPar,
    overPar,
  }
}

export function getWinner(scores, players) {
  const totals = getAllTotals(scores, players)
  return players.reduce((best, p) => totals[p] < totals[best] ? p : best)
}
