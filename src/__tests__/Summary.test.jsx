import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { GameProvider, gameReducer } from '../context/GameContext'
import Summary from '../pages/Summary'

const mockSaveRound = vi.fn()
vi.mock('../hooks/useHistory', () => ({
  useHistory: () => ({ history: [], loading: false, saveRound: mockSaveRound, deleteRound: vi.fn(), deleteAllRounds: vi.fn() }),
}))

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
  mockSaveRound.mockClear()
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
  const hero = screen.getByTestId('celebration-hero')
  expect(hero.textContent).toMatch(/grattis/i)
  expect(hero.textContent).toMatch(/Anton/i)
})

test('shows all player totals', () => {
  renderSummary()
  expect(screen.getByText('7')).toBeInTheDocument() // Anton total
  expect(screen.getByText('9')).toBeInTheDocument() // Ludde total
})

test('saves to history on render', () => {
  renderSummary()
  expect(mockSaveRound).toHaveBeenCalledOnce()
  expect(mockSaveRound.mock.calls[0][0].winner).toBe('Anton')
})
