import { NavLink } from 'react-router-dom'

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M3 10.5L11 3l8 7.5V19a1 1 0 01-1 1H5a1 1 0 01-1-1v-8.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M8.5 20v-6h5v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

function IconHistory() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M11 7v4.5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconStats() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="3" y="12" width="4" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="9" y="7" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="15" y="3" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  )
}

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Huvudnavigation">
      <NavLink to="/" end className={({ isActive }) => `bottom-nav-item${isActive ? ' is-active' : ''}`}>
        <IconHome />
        <span>Hem</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => `bottom-nav-item${isActive ? ' is-active' : ''}`}>
        <IconHistory />
        <span>Historik</span>
      </NavLink>
      <NavLink to="/stats" className={({ isActive }) => `bottom-nav-item${isActive ? ' is-active' : ''}`}>
        <IconStats />
        <span>Statistik</span>
      </NavLink>
    </nav>
  )
}
