import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { PlayerScoreRow } from '../components/PlayerScoreRow'
import { ScorePanel } from '../components/ScorePanel'
import { Scorecard } from '../components/Scorecard'

export default function Game() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()
  const [showScorecard, setShowScorecard] = useState(false)

  if (!state) {
    navigate('/')
    return null
  }

  const { players, scores, currentHole, holes, courseName } = state

  function getScore(player) {
    return scores[player][currentHole]
  }

  function setScore(player, newScore) {
    dispatch({ type: 'SET_SCORE', payload: { player, holeIndex: currentHole, score: newScore } })
  }

  function handleIncrement(player) {
    setScore(player, (getScore(player) ?? 0) + 1)
  }

  function handleDecrement(player) {
    const s = getScore(player)
    if (s === null || s <= 1) return
    setScore(player, s - 1)
  }

  function handleEnd() {
    navigate('/summary')
  }

  const isLastHole = currentHole === holes - 1

  return (
    <div className="page">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{courseName}</div>
          <h1>Hål {currentHole + 1} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem' }}>/ {holes}</span></h1>
        </div>
        <button
          className="btn-ghost"
          style={{ fontSize: '0.8rem' }}
          onClick={() => setShowScorecard(s => !s)}
        >
          {showScorecard ? 'Poängvy' : 'Scorekort'}
        </button>
      </div>

      {showScorecard ? (
        <div
          style={{
            animation: 'flipIn 0.3s ease',
          }}
        >
          <style>{`@keyframes flipIn { from { opacity: 0; transform: scaleX(0.8); } to { opacity: 1; transform: scaleX(1); } }`}</style>
          <Scorecard scores={scores} players={players} holes={holes} currentHole={currentHole} />
        </div>
      ) : (
        <>
          {players.map(player => (
            <PlayerScoreRow
              key={player}
              player={player}
              score={getScore(player)}
              onIncrement={() => handleIncrement(player)}
              onDecrement={() => handleDecrement(player)}
            />
          ))}
          <ScorePanel scores={scores} players={players} />
        </>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <button
          className="btn-ghost"
          style={{ flex: 1 }}
          disabled={currentHole === 0}
          onClick={() => dispatch({ type: 'PREV_HOLE' })}
        >
          Föregående hål
        </button>
        {isLastHole ? (
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleEnd}>
            Avsluta runda
          </button>
        ) : (
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => dispatch({ type: 'NEXT_HOLE' })}>
            Nästa hål
          </button>
        )}
      </div>
    </div>
  )
}
