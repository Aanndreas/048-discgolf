import {
  getTotal,
  getAllTotals,
  getPlayerStats,
  getWinner,
} from '../utils/scoring'

const scores = {
  Anton: [3, 4, 3, null, null],
  Ludde: [4, 3, 4, null, null],
  Maja:  [3, 3, 5, null, null],
}

test('getTotal sums non-null scores', () => {
  expect(getTotal(scores, 'Anton')).toBe(10)
  expect(getTotal(scores, 'Ludde')).toBe(11)
})

test('getTotal returns 0 when all scores are null', () => {
  expect(getTotal({ X: [null, null] }, 'X')).toBe(0)
})

test('getAllTotals returns totals for all players', () => {
  expect(getAllTotals(scores, ['Anton', 'Ludde', 'Maja'])).toEqual({
    Anton: 10, Ludde: 11, Maja: 11,
  })
})

test('getPlayerStats returns avg, best, worst for played holes', () => {
  const stats = getPlayerStats(scores, 'Anton')
  expect(stats.total).toBe(10)
  expect(stats.avg).toBeCloseTo(10 / 3)
  expect(stats.best).toBe(3)
  expect(stats.worst).toBe(4)
  expect(stats.holesPlayed).toBe(3)
})

test('getPlayerStats handles all nulls', () => {
  const stats = getPlayerStats({ X: [null, null] }, 'X')
  expect(stats.total).toBe(0)
  expect(stats.avg).toBe(0)
  expect(stats.best).toBe(null)
  expect(stats.worst).toBe(null)
  expect(stats.holesPlayed).toBe(0)
})

test('getWinner returns player with lowest total', () => {
  expect(getWinner(scores, ['Anton', 'Ludde', 'Maja'])).toBe('Anton')
})

test('getWinner returns first player on tie', () => {
  expect(getWinner(scores, ['Ludde', 'Maja'])).toBe('Ludde')
})
