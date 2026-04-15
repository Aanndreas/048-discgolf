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

      <section>
        <h2 style={{ marginBottom: 8 }}>Välj bana</h2>
        <CourseSelector
          courses={allCourses}
          onSelect={setSelectedCourse}
          onAddCourse={handleAddCourse}
        />
        {selectedCourse && (
          <p style={{ marginTop: 8, color: 'var(--highlight)' }}>
            ✓ {selectedCourse.name} ({selectedCourse.holes} hål)
          </p>
        )}
      </section>

      <section>
        <h2 style={{ marginBottom: 8 }}>Spelare</h2>
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
