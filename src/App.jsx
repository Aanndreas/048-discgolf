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

function ThemeToggle({ theme, onToggleTheme }) {
  const { pathname } = useLocation()
  const isGame = pathname === '/game'
  return (
    <button
      onClick={onToggleTheme}
      aria-label="Byt tema"
      style={{
        position: 'fixed',
        bottom: 10,
        right: 14,
        zIndex: 50,
        background: 'none',
        border: 'none',
        padding: '4px',
        fontSize: '1rem',
        lineHeight: 1,
        opacity: isGame ? 0.25 : 0.45,
        cursor: 'pointer',
        color: 'var(--text-3)',
      }}
    >
      {theme === 'dark' ? '☀︎' : '☽'}
    </button>
  )
}

function AppInner() {
  const { theme, toggle } = useTheme()
  return (
    <>
      <ThemeToggle theme={theme} onToggleTheme={toggle} />
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
