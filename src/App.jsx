import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GameProvider } from './context/GameContext'
import { BottomNav } from './components/BottomNav'
import Home from './pages/Home'
import Setup from './pages/Setup'
import Game from './pages/Game'
import Summary from './pages/Summary'
import History from './pages/History'
import HistoryDetail from './pages/HistoryDetail'
import Stats from './pages/Stats'

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
      className="theme-toggle"
      style={{ opacity: isGame ? 0.25 : 0.45 }}
    >
      {theme === 'dark' ? '☀︎' : '☽'}
    </button>
  )
}

const NO_NAV_PATHS = ['/game']

function AppInner() {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const showNav = !NO_NAV_PATHS.includes(pathname)

  return (
    <>
      <ThemeToggle theme={theme} onToggleTheme={toggle} />
      {showNav && <BottomNav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<HistoryDetail />} />
        <Route path="/stats" element={<Stats />} />
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
