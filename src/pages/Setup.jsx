import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CourseSelector } from '../components/CourseSelector'
import { PlayerSelector } from '../components/PlayerSelector'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useGame } from '../context/GameContext'
import { BUILT_IN_COURSES } from '../data/courses'

export default function Setup() {
  const navigate = useNavigate()
  const { dispatch } = useGame()
  const [customCourses, setCustomCourses] = useLocalStorage('udisk_custom_courses', [])
  const [playerData, setPlayerData] = useLocalStorage('udisk_players', { favorites: [], lastUsed: [] })

  const allCourses = [...BUILT_IN_COURSES, ...customCourses]

  const [selectedCourse, setSelectedCourse] = useState(null)
  const [players, setPlayers] = useState(playerData.lastUsed ?? [])

  function handleAddCourse(course) {
    setCustomCourses(prev => [...prev, course])
  }

  function handleAddPlayer(name) {
    setPlayers(prev => [...prev, name])
  }

  function handleRemovePlayer(name) {
    setPlayers(prev => prev.filter(p => p !== name))
  }

  function handleToggleFavorite(name) {
    setPlayerData(prev => {
      const isFav = prev.favorites.includes(name)
      return {
        ...prev,
        favorites: isFav
          ? prev.favorites.filter(f => f !== name)
          : [...prev.favorites, name],
      }
    })
  }

  function handleStart() {
    setPlayerData(prev => ({ ...prev, lastUsed: players }))
    dispatch({
      type: 'START_GAME',
      payload: {
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
        holes: selectedCourse.holes,
        players,
      },
    })
    navigate('/game')
  }

  return (
    <div className="page">
      <h1>Ny runda</h1>

      {/* ── Course selection ── */}
      <section>
        <h2 style={{ marginBottom: 12 }}>Välj bana</h2>
        <CourseSelector
          courses={allCourses}
          onSelect={setSelectedCourse}
          onAddCourse={handleAddCourse}
        />
        <div style={{
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: selectedCourse ? 'var(--accent-dim)' : 'var(--surface-2)',
          border: `1px solid ${selectedCourse ? 'rgba(46,232,122,0.2)' : 'var(--border)'}`,
          borderRadius: 'var(--r-lg)',
          padding: '12px 16px',
          transition: 'background 0.2s, border-color 0.2s',
        }}>
          {selectedCourse ? (
            <>
              <span style={{ color: 'var(--accent)', fontSize: '1rem', lineHeight: 1 }}>✓</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1 }}>
                  {selectedCourse.name}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--accent)', marginTop: 4, fontWeight: 500 }}>
                  {selectedCourse.holes} hål
                </div>
              </div>
            </>
          ) : (
            <>
              <span style={{ fontSize: '1rem', lineHeight: 1, color: 'var(--text-3)' }}>○</span>
              <div style={{ fontSize: '0.9375rem', color: 'var(--text-3)', fontStyle: 'italic' }}>
                Vald bana: —
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Extra breathing room between sections ── */}
      <div style={{ height: 8 }} />

      {/* ── Player selection ── */}
      <section>
        <h2 style={{ marginBottom: 12 }}>Spelare</h2>
        <PlayerSelector
          players={players}
          favorites={playerData.favorites}
          onAdd={handleAddPlayer}
          onRemove={handleRemovePlayer}
          onToggleFavorite={handleToggleFavorite}
        />
      </section>

      <button
        className="btn-primary"
        style={{ width: '100%', marginTop: 'auto', padding: '16px' }}
        disabled={!selectedCourse || players.length === 0}
        onClick={handleStart}
      >
        Starta runda
      </button>
    </div>
  )
}
