import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { PlayerScoreRow } from '../components/PlayerScoreRow'
import { ScorePanel } from '../components/ScorePanel'
import { Scorecard } from '../components/Scorecard'
import { getAllTotals } from '../utils/scoring'
import { BUILT_IN_COURSES } from '../data/courses'
import { PageCredit } from '../components/PageCredit'

function fmtElapsed(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`
  return `${s}s`
}

export default function Game() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()
  const [showScorecard, setShowScorecard] = useState(false)
  const [lastChanged, setLastChanged] = useState({})
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!state) return
    const t0 = new Date(state.startedAt).getTime()
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 1000)
    return () => clearInterval(id)
  }, [state?.startedAt])

  if (!state) {
    navigate('/')
    return null
  }

  const { players, scores, currentHole, holes, courseName } = state

  function getScore(player) {
    return scores[player][currentHole]
  }

  function handleIncrement(player, amount = 1) {
    const s = getScore(player)
    dispatch({ type: 'SET_SCORE', payload: { player, holeIndex: currentHole, score: (s ?? 0) + amount } })
    setLastChanged(prev => ({ ...prev, [player]: new Date() }))
  }

  function handleDecrement(player) {
    const s = getScore(player)
    if (s === null || s <= 1) return
    dispatch({ type: 'SET_SCORE', payload: { player, holeIndex: currentHole, score: s - 1 } })
    setLastChanged(prev => ({ ...prev, [player]: new Date() }))
  }

  function handleSetScore(player, val) {
    dispatch({ type: 'SET_SCORE', payload: { player, holeIndex: currentHole, score: val } })
    setLastChanged(prev => ({ ...prev, [player]: new Date() }))
  }

  const isLastHole = currentHole === holes - 1
  const progress = ((currentHole) / holes) * 100

  // Sort by total excluding the current hole — order locks in mid-hole,
  // updates only when advancing to the next hole.
  const totals = getAllTotals(scores, players)
  const totalsBeforeCurrentHole = Object.fromEntries(
    players.map(p => [p, scores[p].reduce((sum, s, i) => i !== currentHole ? sum + (s ?? 0) : sum, 0)])
  )
  const sortedPlayers = [...players].sort((a, b) => totalsBeforeCurrentHole[a] - totalsBeforeCurrentHole[b])

  // Par for current hole (if course data available)
  const courseData = BUILT_IN_COURSES.find(c => c.id === state.courseId)
  const holePar = courseData?.par?.[currentHole] ?? null

  // Height for the flip container
  const flipMinHeight = players.length * 96 + 72

  return (
    <div className="page page--no-gap">

      {/* ── Status bar ── */}
      <div className="game-header">
        <button
          className="btn-ghost btn-back-game"
          onClick={() => navigate('/')}
        >
          ← Hem
        </button>
        <div className="game-info-card">
          <div>
            <div className="game-stat-label">Plats</div>
            <div className="game-info-value">{courseName}</div>
          </div>
          <div className="game-timer-col">
            <div className="game-stat-label">Tid</div>
            <div className="game-timer-val">{fmtElapsed(elapsed)}</div>
          </div>
          <div data-testid="hole-display" className="hole-display">
            <div className="game-stat-label">Hål{holePar ? ` · Par ${holePar}` : ''}</div>
            <div className="hole-number-row">
              <span className="num-xl hole-num">{currentHole + 1}</span>
              <span className="hole-total">/ {holes}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Spacer — pushes interactive zone toward bottom ── */}
      <div className="flex-1" />

      {/* ── Interactive zone — all thumb-reachable ── */}
      <div className="game-interactive">

        {/* Flip container — dog-ear in bottom-right corner toggles scorecard */}
        <div className="flip-container">
          <div className="flip-viewport">
            <div
              className={`flip-inner ${showScorecard ? 'is-flipped' : ''}`}
              style={{ minHeight: flipMinHeight }}
            >
              {/* Front face — score rows, sorted leader first */}
              <div className="flip-face flip-face-front">
                {sortedPlayers.map(player => (
                  <PlayerScoreRow
                    key={player}
                    player={player}
                    score={getScore(player)}
                    lastChanged={lastChanged[player] ?? null}
                    onIncrement={(amount) => handleIncrement(player, amount)}
                    onDecrement={() => handleDecrement(player)}
                    onSetScore={(val) => handleSetScore(player, val)}
                  />
                ))}
                <ScorePanel scores={scores} players={players} />
              </div>

              {/* Back face — poängkort */}
              <div className="flip-face flip-face-back">
                <div className="scorecard-wrapper">
                  <Scorecard scores={scores} players={players} holes={holes} currentHole={currentHole} />
                </div>
              </div>
            </div>
          </div>

          {/* Dog-ear fold tab */}
          <button
            className="fold-tab"
            onClick={() => setShowScorecard(s => !s)}
            aria-label={showScorecard ? 'Visa poäng' : 'Visa poängkort'}
          >
            <span className="fold-tab-icon">≡</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="nav-strip">
          <button
            className="btn-ghost"
            disabled={currentHole === 0}
            onClick={() => dispatch({ type: 'PREV_HOLE' })}
          >
            Föregående hål
          </button>
          {isLastHole ? (
            <button className="btn-primary" onClick={() => navigate('/summary')}>
              Avsluta runda
            </button>
          ) : (
            <button className="btn-primary" onClick={() => dispatch({ type: 'NEXT_HOLE' })}>
              Nästa hål
            </button>
          )}
        </div>

        {/* Abandon */}
        <button
          className="btn-ghost btn-abandon"
          onClick={() => {
            if (confirm('Avbryta rundan? Poängen sparas inte.')) {
              dispatch({ type: 'CLEAR_GAME' })
              navigate('/')
            }
          }}
        >
          Avbryt runda
        </button>
        <PageCredit />
      </div>

    </div>
  )
}
