import { createContext, useContext, useReducer, useEffect } from 'react'

const STORAGE_KEY = 'udisk_active_game'

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const { courseId, courseName, holes, players } = action.payload
      const scores = {}
      players.forEach(p => { scores[p] = Array(holes).fill(null) })
      return {
        courseId,
        courseName,
        holes,
        currentHole: 0,
        players,
        scores,
        startedAt: new Date().toISOString(),
      }
    }
    case 'SET_SCORE': {
      const { player, holeIndex, score } = action.payload
      return {
        ...state,
        scores: {
          ...state.scores,
          [player]: state.scores[player].map((s, i) => i === holeIndex ? score : s),
        },
      }
    }
    case 'NEXT_HOLE':
      return { ...state, currentHole: Math.min(state.currentHole + 1, state.holes - 1) }
    case 'PREV_HOLE':
      return { ...state, currentHole: Math.max(state.currentHole - 1, 0) }
    case 'CLEAR_GAME':
      return null
    default:
      return state
  }
}

function loadPersistedGame() {
  try {
    const item = localStorage.getItem(STORAGE_KEY)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, loadPersistedGame)

  useEffect(() => {
    if (state) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [state])

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (ctx === null) throw new Error('useGame must be used within a GameProvider')
  return ctx
}
