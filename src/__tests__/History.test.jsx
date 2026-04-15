import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, beforeEach } from 'vitest'
import History from '../pages/History'
import { useHistory } from '../hooks/useHistory'

const mockDelete = vi.fn()
const mockDeleteAll = vi.fn()

const mockHistoryData = [
  { id: '1', courseName: 'Hemus', date: '2026-04-14', winner: 'Anton', players: ['Anton', 'Ludde'], scores: {} },
  { id: '2', courseName: 'Orsa', date: '2026-04-13', winner: 'Ludde', players: ['Anton', 'Ludde'], scores: {} },
]

vi.mock('../hooks/useHistory', () => ({
  useHistory: vi.fn(),
}))

beforeEach(() => {
  vi.mocked(useHistory).mockReturnValue({
    history: mockHistoryData,
    loading: false,
    deleteRound: mockDelete,
    deleteAllRounds: mockDeleteAll,
  })
})

function renderHistory() {
  return render(<MemoryRouter><History /></MemoryRouter>)
}

test('shows saved rounds', () => {
  renderHistory()
  expect(screen.getByText('Hemus')).toBeInTheDocument()
  expect(screen.getByText('Orsa')).toBeInTheDocument()
})

test('can delete a single round', () => {
  renderHistory()
  fireEvent.click(screen.getAllByText('Ta bort')[0])
  expect(mockDelete).toHaveBeenCalledWith('1')
})

test('can clear all history', () => {
  renderHistory()
  fireEvent.click(screen.getByText('Rensa all historik'))
  expect(mockDeleteAll).toHaveBeenCalled()
})

test('shows empty message when no history', () => {
  vi.mocked(useHistory).mockReturnValue({
    history: [],
    loading: false,
    deleteRound: mockDelete,
    deleteAllRounds: mockDeleteAll,
  })
  renderHistory()
  expect(screen.getByText(/inga sparade rundor/i)).toBeInTheDocument()
})
