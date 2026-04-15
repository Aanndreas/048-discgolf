import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GameProvider } from '../context/GameContext'
import Setup from '../pages/Setup'

beforeEach(() => localStorage.clear())

function renderSetup() {
  return render(
    <GameProvider>
      <MemoryRouter>
        <Setup />
      </MemoryRouter>
    </GameProvider>
  )
}

test('shows built-in courses', () => {
  renderSetup()
  expect(screen.getByText('Mora')).toBeInTheDocument()
  expect(screen.getByText('Orsa')).toBeInTheDocument()
})

test('Starta runda button is disabled when no players added', () => {
  renderSetup()
  fireEvent.click(screen.getByText('Mora'))
  expect(screen.getByText(/starta runda/i)).toBeDisabled()
})

test('can add a player and enable start button', () => {
  renderSetup()
  fireEvent.click(screen.getByText('Mora'))
  const input = screen.getByPlaceholderText(/lägg till spelare/i)
  fireEvent.change(input, { target: { value: 'Anton' } })
  fireEvent.click(screen.getByText('Lägg till'))
  expect(screen.getByText('Anton')).toBeInTheDocument()
  expect(screen.getByText(/starta runda/i)).not.toBeDisabled()
})
