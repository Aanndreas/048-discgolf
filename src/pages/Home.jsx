import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useGroupCode } from '../hooks/useGroupCode'
import logo from '../assets/images/048_logo_png.png'

export default function Home() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()
  const { code, saveCode, isSet } = useGroupCode()
  const [inputCode, setInputCode] = useState('')
  const [showCodeChange, setShowCodeChange] = useState(false)

  function handleAbandon() {
    if (confirm('Avbryta pågående runda? Poängen sparas inte.')) {
      dispatch({ type: 'CLEAR_GAME' })
    }
  }

  function handleCodeSubmit(e) {
    e.preventDefault()
    if (inputCode.trim().length > 0) {
      saveCode(inputCode)
      setShowCodeChange(false)
      setInputCode('')
    }
  }

  // First-time setup screen
  if (!isSet) {
    return (
      <div className="page" style={{ justifyContent: 'center', minHeight: '100dvh' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <img src={logo} alt="048 Disc Golf"
            style={{ width: 140, height: 'auto', display: 'block', margin: '0 auto',
              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }} />
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 4 }}>Vad är er gruppkod?</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>
              Tre tecken som identifierar ert gäng. Alla med samma kod delar historik.
            </div>
          </div>
          <form onSubmit={handleCodeSubmit} style={{ display: 'flex', gap: 8 }}>
            <input
              autoFocus
              maxLength={3}
              placeholder="048"
              value={inputCode}
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-display)',
                fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.15em' }}
            />
            <button className="btn-primary" type="submit" style={{ flexShrink: 0 }}>
              Kör!
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ justifyContent: 'center', minHeight: '100dvh' }}>

      {/* ── Logo ── */}
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <img
          src={logo}
          alt="048 Disc Golf"
          style={{ width: 200, height: 'auto', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 }}>
          <div style={{
            fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--text-3)',
          }}>
            Disc Golf · Dalarna
          </div>
          <button
            onClick={() => { setShowCodeChange(s => !s); setInputCode(code) }}
            style={{ background: 'var(--accent-dim)', border: '1px solid rgba(46,232,122,0.2)',
              borderRadius: 100, padding: '2px 8px', fontSize: '0.6875rem', fontWeight: 700,
              letterSpacing: '0.12em', color: 'var(--accent)', lineHeight: 1.6 }}
          >
            {code}
          </button>
        </div>
        {showCodeChange && (
          <form onSubmit={handleCodeSubmit}
            style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'center' }}>
            <input maxLength={3} value={inputCode} autoFocus
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              style={{ width: 80, textAlign: 'center', fontFamily: 'var(--font-display)',
                fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.15em', padding: '6px 10px' }}
            />
            <button className="btn-primary" type="submit" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>
              Spara
            </button>
          </form>
        )}
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
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                flex: 1,
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
            <button
              onClick={handleAbandon}
              style={{
                padding: '0 14px',
                borderRadius: 'var(--r-lg)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-hi)',
                color: 'var(--red)',
                fontSize: '1.1rem',
                flexShrink: 0,
              }}
              aria-label="Avbryt runda"
            >
              ✕
            </button>
          </div>
        )}

        <button
          className="btn-ghost"
          style={{ width: '100%', padding: '13px 20px', borderRadius: 'var(--r-lg)' }}
          onClick={() => navigate('/history')}
        >
          Historik
        </button>
      </div>

      {/* ── Credit ── */}
      <div style={{ marginTop: 'auto', paddingTop: 24, textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.6875rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-3)',
          lineHeight: 1.7,
        }}>
          Ihopkastad av Andreas Lundin · 2026 · Dalarna
        </div>
      </div>

    </div>
  )
}
