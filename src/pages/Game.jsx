import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { PlayerScoreRow } from '../components/PlayerScoreRow'
import { ScorePanel } from '../components/ScorePanel'
import { Scorecard } from '../components/Scorecard'
import { getAllTotals } from '../utils/scoring'
import { BUILT_IN_COURSES } from '../data/courses'
import { PageCredit } from '../components/PageCredit'

export default function Game() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()
  const [showScorecard, setShowScorecard] = useState(false)
  const [lastChanged, setLastChanged] = useState({})

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
    <div className="page" style={{ gap: 0 }}>

      {/* ── Status bar ── */}
      <div style={{ paddingTop: 8, paddingBottom: 16 }}>
        <button
          className="btn-ghost"
          style={{ alignSelf: 'flex-start', padding: '2px 0', fontSize: '0.75rem', opacity: 0.5, marginBottom: 6 }}
          onClick={() => navigate('/')}
        >
          ← Hem
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          padding: '10px 14px',
        }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 2 }}>
              Plats
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
              {courseName}
            </div>
          </div>
          <div data-testid="hole-display" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 2 }}>
              Hål{holePar ? ` · Par ${holePar}` : ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, justifyContent: 'flex-end' }}>
              <span className="num-xl" style={{ fontSize: '1.5rem', color: 'var(--text)' }}>
                {currentHole + 1}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-3)', fontWeight: 400 }}>
                / {holes}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 2,
          background: 'var(--surface-3)',
          borderRadius: 2,
          overflow: 'hidden',
          marginTop: 8,
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'var(--accent)',
            borderRadius: 2,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* ── Spacer — pushes interactive zone toward bottom ── */}
      <div style={{ flex: 1 }} />

      {/* ── Interactive zone — all thumb-reachable ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 0 }}>

        {/* Flip container — dog-ear in bottom-right corner toggles scorecard */}
        <div style={{ position: 'relative' }}>
          <div className="flip-viewport">
            <div
              className={`flip-inner ${showScorecard ? 'is-flipped' : ''}`}
              style={{ minHeight: flipMinHeight }}
            >
              {/* Front face — score rows, sorted leader first */}
              <div className="flip-face" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                <div style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)',
                  overflow: 'hidden',
                }}>
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
          className="btn-ghost"
          style={{ width: '100%', color: 'var(--red)', opacity: 0.6, fontSize: '0.8125rem' }}
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
