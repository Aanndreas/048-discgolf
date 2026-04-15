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
  // data-testid container holds "Hål" label + hole number span
  const holeDisplay = screen.getByTestId('hole-display')
  expect(holeDisplay.textContent).toMatch(/hål/i)
  // The hole number span is a child of the container
  expect(holeDisplay.textContent).toMatch(/1/)
  // Player names appear in score rows and the hidden scorecard table
  expect(screen.getAllByText('Anton').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Ludde').length).toBeGreaterThan(0)
})

test('clicking + increments score', () => {
  renderGame()
  // Click Anton's + button (first player, first + in DOM)
  const btn = screen.getAllByText('+')[0]
  fireEvent.pointerDown(btn)
  fireEvent.pointerUp(btn)
  // After incrementing, Anton has 1 throw. Find by value content.
  const scoreEls = document.querySelectorAll('.score-value')
  const values = Array.from(scoreEls).map(el => el.textContent)
  expect(values).toContain('1')
})

test('clicking Nästa hål advances the hole', () => {
  renderGame()
  fireEvent.click(screen.getByText(/nästa hål/i))
  const holeDisplay = screen.getByTestId('hole-display')
  expect(holeDisplay.textContent).toMatch(/hål/i)
  expect(holeDisplay.textContent).toMatch(/2/)
})

test('Föregående hål button is disabled on first hole', () => {
  renderGame()
  expect(screen.getByText(/föregående hål/i)).toBeDisabled()
})
