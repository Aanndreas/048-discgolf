import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GameProvider, gameReducer } from '../context/GameContext'
import Summary from '../pages/Summary'

function makeGame() {
  let state = gameReducer(null, {
    type: 'START_GAME',
    payload: { courseId: 'mora', courseName: 'Mora', holes: 2, players: ['Anton', 'Ludde'] },
  })
  state = gameReducer(state, { type: 'SET_SCORE', payload: { player: 'Anton', holeIndex: 0, score: 3 } })
  state = gameReducer(state, { type: 'SET_SCORE', payload: { player: 'Anton', holeIndex: 1, score: 4 } })
  state = gameReducer(state, { type: 'SET_SCORE', payload: { player: 'Ludde', holeIndex: 0, score: 4 } })
  state = gameReducer(state, { type: 'SET_SCORE', payload: { player: 'Ludde', holeIndex: 1, score: 5 } })
  return state
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('udisk_active_game', JSON.stringify(makeGame()))
})

function renderSummary() {
  return render(
    <GameProvider>
      <MemoryRouter>
        <Summary />
      </MemoryRouter>
    </GameProvider>
  )
}

test('shows winner name', () => {
  renderSummary()
  expect(screen.getByText(/grattis anton/i)).toBeInTheDocument()
})

test('shows all player totals', () => {
  renderSummary()
  expect(screen.getByText('7')).toBeInTheDocument() // Anton total
  expect(screen.getByText('9')).toBeInTheDocument() // Ludde total
})

test('saves to history on render', () => {
  renderSummary()
  const history = JSON.parse(localStorage.getItem('udisk_history') ?? '[]')
  expect(history).toHaveLength(1)
  expect(history[0].winner).toBe('Anton')
})
