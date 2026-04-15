import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage'

beforeEach(() => localStorage.clear())

test('returns default value when key is not set', () => {
  const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
  expect(result.current[0]).toBe('default')
})

test('persists value to localStorage', () => {
  const { result } = renderHook(() => useLocalStorage('test-key', null))
  act(() => result.current[1]('hello'))
  expect(result.current[0]).toBe('hello')
  expect(JSON.parse(localStorage.getItem('test-key'))).toBe('hello')
})

test('reads existing localStorage value on mount', () => {
  localStorage.setItem('test-key', JSON.stringify({ x: 1 }))
  const { result } = renderHook(() => useLocalStorage('test-key', null))
  expect(result.current[0]).toEqual({ x: 1 })
})

test('supports functional updates', () => {
  const { result } = renderHook(() => useLocalStorage('count', 0))
  act(() => result.current[1](n => n + 1))
  expect(result.current[0]).toBe(1)
})
