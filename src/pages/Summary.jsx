import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { PageCredit } from '../components/PageCredit'
import { useHistory } from '../hooks/useHistory'
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
  const { saveRound } = useHistory()
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
    saveRound(entry)
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

  async function handleShare() {
    const lines = sortedPlayers.map((p, i) => {
      const medals = ['🥇', '🥈', '🥉']
      const medal = medals[i] ?? `${i + 1}.`
      return `${medal} ${p} — ${totals[p]} kast`
    })
    const text = `048 Disc Golf · ${courseName} · ${date}\n\n${lines.join('\n')}`
    if (navigator.share) {
      await navigator.share({ title: '048 Disc Golf', text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Resultat kopierat!')
    }
  }

  return (
    <div className="page">
      <button className="btn-ghost btn-back" onClick={() => navigate('/')}>← Hem</button>
      <CelebrationScreen players={players} scores={scores} courseName={courseName} date={date} />

      {/* ── Per-player stats ── */}
      <button className="btn-ghost btn-full" onClick={() => setShowDetail(d => !d)}>
        {showDetail ? '▲ Dölj statistik' : '▼ Visa statistik per spelare'}
      </button>

      {showDetail && (
        <div className="col" style={{ gap: 10 }}>
          {sortedPlayers.map((player, rank) => {
            const stats = getPlayerStats(scores, player, par)
            const rel = formatRelPar(stats.relativePar)

            return (
              <div key={player} className="card col" style={{ gap: 12 }}>

                {/* ── Top row: name + total ── */}
                <div className="player-stat-header">
                  <div className="row">
                    <span className="stats-rank" style={{ color: rank === 0 ? 'var(--winner)' : 'var(--text-3)' }}>
                      {rank + 1}
                    </span>
                    <span className="player-name">{player}</span>
                  </div>
                  <div className="total-display">
                    <span className="stat-num-lg">{stats.total}</span>
                    <span className="kast-label">kast</span>
                    {rel && (
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: rel.color, marginLeft: 2 }}>
                        {rel.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Par distribution (only when par data exists) ── */}
                {par && (
                  <div className="stat-pills-row">
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
                <div className="stats-footer">
                  {[
                    { label: 'Snitt', val: stats.avg.toFixed(1) },
                    { label: 'Bäst', val: stats.best ?? '—' },
                    { label: 'Sämst', val: stats.worst ?? '—' },
                    { label: 'Hål', val: stats.holesPlayed },
                  ].map(({ label, val }) => (
                    <div key={label} className="stat-col">
                      <div className="stat-label" style={{ marginBottom: 3 }}>{label}</div>
                      <div className="stat-num">{val}</div>
                    </div>
                  ))}
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* ── Poängkort ── */}
      <button className="btn-ghost btn-full" onClick={() => setShowScorecard(s => !s)}>
        {showScorecard ? '▲ Dölj poängkort' : '▼ Visa poängkort'}
      </button>

      {showScorecard && (
        <Scorecard scores={scores} players={players} holes={holes} currentHole={-1} />
      )}

      <div className="row mt-auto">
        <button className="btn-ghost flex-1" onClick={handleShare}>
          Dela resultat 📤
        </button>
        <button className="btn-primary flex-1" onClick={handleNewGame}>
          Ny runda
        </button>
      </div>
      <PageCredit />
    </div>
  )
}
