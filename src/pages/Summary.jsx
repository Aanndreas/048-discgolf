import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CelebrationScreen } from '../components/CelebrationScreen'
import { Scorecard } from '../components/Scorecard'
import { getPlayerStats, getWinner, getAllTotals } from '../utils/scoring'
import { BUILT_IN_COURSES } from '../data/courses'

function formatRelPar(n) {
  if (n === null) return null
  if (n === 0) return { label: 'E', color: 'var(--text-2)' }
  if (n < 0) return { label: `${n}`, color: 'var(--accent)' }
  return { label: `+${n}`, color: 'var(--red)' }
}

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

  const courseData = BUILT_IN_COURSES.find(c => c.id === state.courseId)
  const par = courseData?.par ?? null

  // Sort players by total for stats — leaderboard order
  const totals = getAllTotals(scores, players)
  const sortedPlayers = [...players].sort((a, b) => totals[a] - totals[b])

  function handleNewGame() {
    dispatch({ type: 'CLEAR_GAME' })
    navigate('/')
  }

  return (
    <div className="page">
      <button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/')}>← Hem</button>
      <CelebrationScreen players={players} scores={scores} courseName={courseName} date={date} />

      {/* ── Per-player stats ── */}
      <button className="btn-ghost" style={{ width: '100%' }} onClick={() => setShowDetail(d => !d)}>
        {showDetail ? '▲ Dölj statistik' : '▼ Visa statistik per spelare'}
      </button>

      {showDetail && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sortedPlayers.map((player, rank) => {
            const stats = getPlayerStats(scores, player, par)
            const rel = formatRelPar(stats.relativePar)

            return (
              <div key={player} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* ── Top row: name + total ── */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 900,
                      fontSize: '1rem', color: rank === 0 ? 'var(--winner)' : 'var(--text-3)',
                      width: 18, textAlign: 'center',
                    }}>
                      {rank + 1}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>
                      {player}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', color: 'var(--text)', lineHeight: 1 }}>
                      {stats.total}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>kast</span>
                    {rel && (
                      <span style={{
                        fontSize: '0.8125rem', fontWeight: 700,
                        color: rel.color, marginLeft: 2,
                      }}>
                        {rel.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Par distribution (only when par data exists) ── */}
                {par && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div className="stat-pill stat-pill--under">
                      <span className="stat-pill-val">{stats.underPar}</span>
                      <span className="stat-pill-lbl">under</span>
                    </div>
                    <div className="stat-pill stat-pill--on">
                      <span className="stat-pill-val">{stats.onPar}</span>
                      <span className="stat-pill-lbl">par</span>
                    </div>
                    <div className="stat-pill stat-pill--over">
                      <span className="stat-pill-val">{stats.overPar}</span>
                      <span className="stat-pill-lbl">över</span>
                    </div>
                  </div>
                )}

                {/* ── Secondary stats row ── */}
                <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  {[
                    { label: 'Snitt', val: stats.avg.toFixed(1) },
                    { label: 'Bäst', val: stats.best ?? '—' },
                    { label: 'Sämst', val: stats.worst ?? '—' },
                    { label: 'Hål', val: stats.holesPlayed },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 3 }}>
                        {label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem', color: 'var(--text)' }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* ── Poängkort ── */}
      <button className="btn-ghost" style={{ width: '100%' }} onClick={() => setShowScorecard(s => !s)}>
        {showScorecard ? '▲ Dölj poängkort' : '▼ Visa poängkort'}
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
