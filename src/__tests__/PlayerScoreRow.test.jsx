import { render, screen, fireEvent } from '@testing-library/react'
import { PlayerScoreRow } from '../components/PlayerScoreRow'

test('displays player name and current score', () => {
  render(<PlayerScoreRow player="Anton" score={4} onIncrement={() => {}} onDecrement={() => {}} />)
  expect(screen.getByText('Anton')).toBeInTheDocument()
  expect(screen.getByText('4')).toBeInTheDocument()
})

test('shows dash when score is null', () => {
  render(<PlayerScoreRow player="Anton" score={null} onIncrement={() => {}} onDecrement={() => {}} />)
  expect(screen.getByText('–')).toBeInTheDocument()
})

test('calls onIncrement when + is pressed and released', () => {
  const onIncrement = vi.fn()
  render(<PlayerScoreRow player="Anton" score={3} onIncrement={onIncrement} onDecrement={() => {}} />)
  const btn = screen.getByText('+')
  fireEvent.pointerDown(btn)
  fireEvent.pointerUp(btn)
  expect(onIncrement).toHaveBeenCalledTimes(1)
})

test('calls onDecrement when − is clicked', () => {
  const onDecrement = vi.fn()
  render(<PlayerScoreRow player="Anton" score={3} onIncrement={() => {}} onDecrement={onDecrement} />)
  fireEvent.click(screen.getByText('−'))
  expect(onDecrement).toHaveBeenCalledTimes(1)
})

test('decrement button is disabled when score is 1 or null', () => {
  const { rerender } = render(
    <PlayerScoreRow player="Anton" score={1} onIncrement={() => {}} onDecrement={() => {}} />
  )
  expect(screen.getByText('−')).toBeDisabled()

  rerender(<PlayerScoreRow player="Anton" score={null} onIncrement={() => {}} onDecrement={() => {}} />)
  expect(screen.getByText('−')).toBeDisabled()
})
