import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import Home from './pages/Home'
import Setup from './pages/Setup'
import Game from './pages/Game'
import Summary from './pages/Summary'
import History from './pages/History'
import HistoryDetail from './pages/HistoryDetail'

function GlobalFooter() {
  const { pathname } = useLocation()
  if (pathname === '/') return null
  const isGame = pathname === '/game'
  return (
    <div style={{
      position: 'fixed',
      bottom: 8,
      left: 0,
      right: 0,
      textAlign: 'center',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '0.5625rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: isGame ? 'var(--text-3)' : 'var(--text-3)',
        opacity: isGame ? 0.35 : 0.7,
      }}>
        Ihopkastad av Andreas Lundin · 2026 · Dalarna
      </span>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <GlobalFooter />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/game" element={<Game />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:id" element={<HistoryDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  )
}
