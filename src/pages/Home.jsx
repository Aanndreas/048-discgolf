import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'

export default function Home() {
  const navigate = useNavigate()
  const { state } = useGame()

  return (
    <div className="page" style={{ justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: 8 }}>🥏</h1>
        <h1>uDisk</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Disc Golf Dalarna</p>
      </div>

      <button
        className="btn-primary"
        style={{ width: '100%', padding: '16px' }}
        onClick={() => navigate('/setup')}
      >
        Ny runda
      </button>

      {state && (
        <button
          style={{ width: '100%' }}
          onClick={() => navigate('/game')}
        >
          Fortsätt pågående runda
          <br />
          <small style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            {state.courseName} · Hål {state.currentHole + 1}/{state.holes}
          </small>
        </button>
      )}

      <button
        className="btn-ghost"
        style={{ width: '100%' }}
        onClick={() => navigate('/history')}
      >
        Historik
      </button>
    </div>
  )
}
