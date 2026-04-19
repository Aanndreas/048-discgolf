import { useNavigate, useParams } from 'react-router-dom'
import { useHistory } from '../hooks/useHistory'
import { CelebrationScreen } from '../components/CelebrationScreen'
import { Scorecard } from '../components/Scorecard'
import { getPlayerStats, getAllTotals } from '../utils/scoring'
import { BUILT_IN_COURSES } from '../data/courses'
import { useState } from 'react'
import { PageCredit } from '../components/PageCredit'

function formatRelPar(n) {
  if (n === null) return null
  if (n === 0) return { label: 'E', color: 'var(--text-2)' }
  if (n < 0) return { label: `${n}`, color: 'var(--accent)' }
  return { label: `+${n}`, color: 'var(--red)' }
}

export default function HistoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { history } = useHistory()
  const [showStats, setShowStats] = useState(false)
  const [showScorecard, setShowScorecard] = useState(false)

  const entry = history.find(e => e.id === id)

  if (!entry) {
    return (
      <div className="page page--center">
        <p className="text-secondary">Rundan hittades inte.</p>
        <button className="btn-ghost" style={{ marginTop: 16 }} onClick={() => navigate('/history')}>
          ← Tillbaka
        </button>
      </div>
    )
  }

  const { players, scores, courseName, courseId, date, holes } = entry
  const courseData = BUILT_IN_COURSES.find(c => c.id === courseId)
  const par = courseData?.par ?? null
  const totals = getAllTotals(scores, players)
  const sortedPlayers = [...players].sort((a, b) => totals[a] - totals[b])
  const holeCount = holes ?? (scores[players[0]]?.length ?? 18)

  return (
    <div className="page">

      {/* ── Back ── */}
      <button className="btn-ghost btn-back" onClick={() => navigate('/history')}>
        ← Historik
      </button>

      {/* ── Celebration ── */}
      <CelebrationScreen
        players={players}
        scores={scores}
        courseName={courseName}
        date={date}
      />

      {/* ── Stats ── */}
      <button className="btn-ghost btn-full" onClick={() => setShowStats(s => !s)}>
        {showStats ? '▲ Dölj statistik' : '▼ Visa statistik per spelare'}
      </button>

      {showStats && (
        <div className="col" style={{ gap: 10 }}>
          {sortedPlayers.map((player, rank) => {
            const stats = getPlayerStats(scores, player, par)
            const rel = formatRelPar(stats.relativePar)
            return (
              <div key={player} className="card col" style={{ gap: 12 }}>
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
                    {rel && <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: rel.color, marginLeft: 2 }}>{rel.label}</span>}
                  </div>
                </div>

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
        <Scorecard scores={scores} players={players} holes={holeCount} currentHole={-1} />
      )}

      <button className="btn-ghost btn-full mt-auto" onClick={() => navigate('/history')}>
        ← Tillbaka till historik
      </button>
      <PageCredit />
    </div>
  )
}
