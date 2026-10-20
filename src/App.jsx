// StudyMate – LearnQuest root application
import { useState, useEffect } from 'react'
import AuthScreens from './components/AuthScreens'
import WorldMap    from './components/WorldMap'
import HUDSidebar  from './components/HUDSidebar'
import StarField   from './components/StarField'
import './index.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('auth') // 'auth' | 'map'

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lq_current_user')
      if (saved) {
        const parsed = JSON.parse(saved)
        setUser(parsed)
        setView('map')
      }
    } catch {
      // ignore
    }
  }, [])

  function handleAuthenticated(userData) {
    setUser(userData)
    setView('map')
  }

  function handleLogout() {
    localStorage.removeItem('lq_current_user')
    setUser(null)
    setView('auth')
  }

  return (
    <div className="fixed inset-0 bg-space overflow-hidden" id="app-root">
      {view === 'auth' && (
        <AuthScreens onAuthenticated={handleAuthenticated} />
      )}

      {view === 'map' && (
        <>
          <StarField count={60} />
          <div className="relative w-full h-full z-10">
            <WorldMap user={user} />
            <HUDSidebar user={user} onLogout={handleLogout} />
          </div>
        </>
      )}
    </div>
  )
}
