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

  if (!isSet) {
    return (
      <div className="page page--centered">
        <div className="logo-wrap--setup">
          <img src={logo} alt="048 Disc Golf" className="logo-img logo-img--sm" />
        </div>
        <div className="card col" style={{ gap: 14 }}>
          <div>
            <div className="code-prompt-title">Vad är er gruppkod?</div>
            <div className="code-prompt-desc">
              Tre tecken som identifierar ert gäng. Alla med samma kod delar historik.
            </div>
          </div>
          <form onSubmit={handleCodeSubmit} className="code-form">
            <input
              autoFocus
              maxLength={3}
              placeholder="048"
              value={inputCode}
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              className="code-input"
            />
            <button className="btn-primary flex-shrink-0" type="submit">
              Kör!
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="page page--centered">

      <div className="logo-wrap">
        <img src={logo} alt="048 Disc Golf" className="logo-img" />

        <div className="location-bar">
          <div className="location-label">Disc Golf · Dalarna</div>
          <button
            className="group-badge"
            onClick={() => { setShowCodeChange(s => !s); setInputCode(code) }}
          >
            {code}
          </button>
        </div>
        {showCodeChange && (
          <form onSubmit={handleCodeSubmit} className="code-change-form">
            <input
              maxLength={3}
              value={inputCode}
              autoFocus
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              className="code-input-sm"
            />
            <button className="btn-primary btn-sm" type="submit">
              Spara
            </button>
          </form>
        )}
      </div>

      <div className="accent-line" />

      <div className="actions-list">
        <button
          className="btn-primary btn-ny-runda"
          onClick={() => navigate('/setup')}
        >
          Ny runda
        </button>

        {state && (
          <div className="row">
            <button className="btn-resume" onClick={() => navigate('/game')}>
              <span className="btn-resume-title">Fortsätt pågående runda</span>
              <span className="btn-resume-subtitle">
                {state.courseName} · Hål {state.currentHole + 1} / {state.holes}
              </span>
            </button>
            <button
              onClick={handleAbandon}
              className="btn-abandon-small"
              aria-label="Avbryt runda"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="page-credit">
        <div className="page-credit-text">
          Ihopkastad av Andreas Lundin · 2026 · Dalarna
        </div>
      </div>

    </div>
  )
}
