// StudyMate root application
import { useState } from 'react'
import AuthScreens from './components/AuthScreens'
import { AppShell } from './components/shell/AppShell'
import { StudyProvider } from './context/StudyContext'
import './index.css'

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lq_current_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [view, setView] = useState(() => {
    try {
      const saved = localStorage.getItem('lq_current_user')
      return saved ? 'app' : 'auth'
    } catch {
      return 'auth'
    }
  })

  function handleAuthenticated(userData) {
    setUser(userData)
    setView('app')
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

      {view === 'app' && (
        <StudyProvider initialUser={user} onLogout={handleLogout}>
          <AppShell />
        </StudyProvider>
      )}
    </div>
  )
}
