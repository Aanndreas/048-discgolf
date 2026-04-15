import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import logo from '../assets/images/048_logo_png.png'

export default function Home() {
  const navigate = useNavigate()
  const { state } = useGame()

  return (
    <div className="page" style={{ justifyContent: 'center', minHeight: '100dvh' }}>

      {/* ── Logo ── */}
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <img
          src={logo}
          alt="048 Disc Golf"
          style={{ width: 200, height: 'auto', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }}
        />

        <div style={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-3)',
          marginTop: 14,
        }}>
          Disc Golf · Dalarna
        </div>
      </div>

      {/* ── Accent line ── */}
      <div style={{
        width: 40,
        height: 2,
        background: 'var(--accent)',
        borderRadius: 2,
        margin: '12px auto 28px',
      }} />

      {/* ── Actions ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="btn-primary"
          style={{ width: '100%', padding: '17px 20px', fontSize: '1rem', borderRadius: 'var(--r-lg)' }}
          onClick={() => navigate('/setup')}
        >
          Ny runda
        </button>

        {state && (
          <button
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 'var(--r-lg)',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-hi)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
            onClick={() => navigate('/game')}
          >
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>Fortsätt pågående runda</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-2)', fontWeight: 400 }}>
              {state.courseName} · Hål {state.currentHole + 1} / {state.holes}
            </span>
          </button>
        )}

        <button
          className="btn-ghost"
          style={{ width: '100%', padding: '13px 20px', borderRadius: 'var(--r-lg)' }}
          onClick={() => navigate('/history')}
        >
          Historik
        </button>
      </div>

    </div>
  )
}
