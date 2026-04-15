import { gameReducer } from '../context/GameContext'

const startPayload = {
  courseId: 'mora',
  courseName: 'Mora',
  holes: 3,
  players: ['Anton', 'Ludde'],
}

function startedState() {
  return gameReducer(null, { type: 'START_GAME', payload: startPayload })
}

test('START_GAME creates initial state', () => {
  const state = startedState()
  expect(state.courseId).toBe('mora')
  expect(state.players).toEqual(['Anton', 'Ludde'])
  expect(state.currentHole).toBe(0)
  expect(state.scores.Anton).toEqual([null, null, null])
  expect(state.scores.Ludde).toEqual([null, null, null])
})

test('SET_SCORE updates correct player and hole', () => {
  const state = gameReducer(startedState(), {
    type: 'SET_SCORE',
    payload: { player: 'Anton', holeIndex: 0, score: 4 },
  })
  expect(state.scores.Anton[0]).toBe(4)
  expect(state.scores.Ludde[0]).toBe(null)
})

test('NEXT_HOLE advances currentHole', () => {
  const state = gameReducer(startedState(), { type: 'NEXT_HOLE' })
  expect(state.currentHole).toBe(1)
})

test('NEXT_HOLE does not exceed last hole', () => {
  let state = startedState()
  state = gameReducer(state, { type: 'NEXT_HOLE' })
  state = gameReducer(state, { type: 'NEXT_HOLE' })
  state = gameReducer(state, { type: 'NEXT_HOLE' }) // should clamp
  expect(state.currentHole).toBe(2)
})

test('PREV_HOLE decrements currentHole', () => {
  let state = gameReducer(startedState(), { type: 'NEXT_HOLE' })
  state = gameReducer(state, { type: 'PREV_HOLE' })
  expect(state.currentHole).toBe(0)
})

test('PREV_HOLE does not go below 0', () => {
  const state = gameReducer(startedState(), { type: 'PREV_HOLE' })
  expect(state.currentHole).toBe(0)
})

test('CLEAR_GAME returns null', () => {
  const state = gameReducer(startedState(), { type: 'CLEAR_GAME' })
  expect(state).toBe(null)
})
