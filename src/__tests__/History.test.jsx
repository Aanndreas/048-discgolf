import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import History from '../pages/History'

const mockHistory = [
  { id: '1', courseName: 'Mora', date: '2026-04-14', winner: 'Anton', players: ['Anton', 'Ludde'], scores: {} },
  { id: '2', courseName: 'Orsa', date: '2026-04-13', winner: 'Ludde', players: ['Anton', 'Ludde'], scores: {} },
]

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('udisk_history', JSON.stringify(mockHistory))
})

function renderHistory() {
  return render(<MemoryRouter><History /></MemoryRouter>)
}

test('shows saved rounds', () => {
  renderHistory()
  expect(screen.getByText('Mora')).toBeInTheDocument()
  expect(screen.getByText('Orsa')).toBeInTheDocument()
})

test('can delete a single round', () => {
  renderHistory()
  const deleteButtons = screen.getAllByText('Ta bort')
  fireEvent.click(deleteButtons[0])
  const history = JSON.parse(localStorage.getItem('udisk_history'))
  expect(history).toHaveLength(1)
  expect(history[0].id).toBe('2')
})

test('can clear all history', () => {
  renderHistory()
  fireEvent.click(screen.getByText('Rensa all historik'))
  expect(JSON.parse(localStorage.getItem('udisk_history'))).toHaveLength(0)
})

test('shows empty message when no history', () => {
  localStorage.setItem('udisk_history', JSON.stringify([]))
  renderHistory()
  expect(screen.getByText(/inga sparade rundor/i)).toBeInTheDocument()
})
