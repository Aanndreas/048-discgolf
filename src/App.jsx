import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GameProvider } from './context/GameContext'
import Home from './pages/Home'
import Setup from './pages/Setup'
import Game from './pages/Game'
import Summary from './pages/Summary'
import History from './pages/History'
import HistoryDetail from './pages/HistoryDetail'

function useTheme() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('udisk_theme') ?? 'dark'
  )
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('udisk_theme', theme)
  }, [theme])
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  return { theme, toggle }
}

function GlobalFooter({ theme, onToggleTheme }) {
  const { pathname } = useLocation()
  const isGame = pathname === '/game'
  const isHome = pathname === '/'
  return (
    <div style={{
      position: 'fixed',
      bottom: 8,
      left: 0,
      right: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      {!isHome && (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.5625rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-3)',
          opacity: isGame ? 0.35 : 0.7,
        }}>
          Ihopkastad av Andreas Lundin · 2026 · Dalarna
        </span>
      )}
      <button
        onClick={onToggleTheme}
        aria-label="Byt tema"
        style={{
          pointerEvents: 'all',
          background: 'none',
          border: 'none',
          padding: '2px 4px',
          fontSize: '0.85rem',
          lineHeight: 1,
          opacity: isGame ? 0.35 : 0.55,
          cursor: 'pointer',
          color: 'var(--text-3)',
        }}
      >
        {theme === 'dark' ? '☀︎' : '☽'}
      </button>
    </div>
  )
}

function AppInner() {
  const { theme, toggle } = useTheme()
  return (
    <>
      <GlobalFooter theme={theme} onToggleTheme={toggle} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<HistoryDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </GameProvider>
  )
}
