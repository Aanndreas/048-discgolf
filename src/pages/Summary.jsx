import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CelebrationScreen } from '../components/CelebrationScreen'
import { Scorecard } from '../components/Scorecard'
import { getPlayerStats, getWinner } from '../utils/scoring'

export default function Summary() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()
  const [history, setHistory] = useLocalStorage('udisk_history', [])
  const [showDetail, setShowDetail] = useState(false)
  const [showScorecard, setShowScorecard] = useState(false)
  const savedRef = useRef(false)

  useEffect(() => {
    if (!state || savedRef.current) return
    savedRef.current = true
    const winner = getWinner(state.scores, state.players)
    const entry = {
      id: crypto.randomUUID(),
      courseId: state.courseId,
      courseName: state.courseName,
      date: new Date().toISOString().slice(0, 10),
      players: state.players,
      scores: state.scores,
      winner,
    }
    setHistory(prev => [entry, ...prev])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!state) {
    navigate('/')
    return null
  }

  const { players, scores, courseName, holes } = state
  const date = new Date().toISOString().slice(0, 10)

  function handleNewGame() {
    dispatch({ type: 'CLEAR_GAME' })
    navigate('/')
  }

  return (
    <div className="page">
      <CelebrationScreen players={players} scores={scores} courseName={courseName} date={date} />

      <button className="btn-ghost" onClick={() => setShowDetail(d => !d)}>
        {showDetail ? '▲ Dölj statistik' : '▼ Visa statistik per spelare'}
      </button>

      {showDetail && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {players.map(player => {
            const stats = getPlayerStats(scores, player)
            return (
              <div key={player} className="card">
                <strong>{player}</strong>
                <div style={{ display: 'flex', gap: 16, marginTop: 8, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <span>Snitt: <strong style={{ color: 'var(--text)' }}>{stats.avg.toFixed(1)}</strong></span>
                  <span>Bäst: <strong style={{ color: 'var(--text)' }}>{stats.best}</strong></span>
                  <span>Sämst: <strong style={{ color: 'var(--text)' }}>{stats.worst}</strong></span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button className="btn-ghost" onClick={() => setShowScorecard(s => !s)}>
        {showScorecard ? '▲ Dölj scorekort' : '▼ Visa scorekort'}
      </button>

      {showScorecard && (
        <Scorecard scores={scores} players={players} holes={holes} currentHole={-1} />
      )}

      <button className="btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={handleNewGame}>
        Ny runda
      </button>
    </div>
  )
}
