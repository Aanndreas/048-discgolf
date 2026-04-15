import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GameProvider, gameReducer } from '../context/GameContext'
import Game from '../pages/Game'

beforeEach(() => {
  localStorage.clear()
  const game = gameReducer(null, {
    type: 'START_GAME',
    payload: { courseId: 'mora', courseName: 'Mora', holes: 3, players: ['Anton', 'Ludde'] },
  })
  localStorage.setItem('udisk_active_game', JSON.stringify(game))
})

function renderGame() {
  return render(
    <GameProvider>
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    </GameProvider>
  )
}

test('shows hole number and player names', () => {
  renderGame()
  expect(screen.getByText(/hål 1/i)).toBeInTheDocument()
  expect(screen.getByText('Anton')).toBeInTheDocument()
  expect(screen.getByText('Ludde')).toBeInTheDocument()
})

test('clicking + increments score', () => {
  renderGame()
  const buttons = screen.getAllByText('+')
  fireEvent.click(buttons[0])
  expect(screen.getByText('1')).toBeInTheDocument()
})

test('clicking Nästa hål advances the hole', () => {
  renderGame()
  fireEvent.click(screen.getByText(/nästa hål/i))
  expect(screen.getByText(/hål 2/i)).toBeInTheDocument()
})

test('Föregående hål button is disabled on first hole', () => {
  renderGame()
  expect(screen.getByText(/föregående hål/i)).toBeDisabled()
})
