// Navigation component: World/Map, Flashcards, Progress, and Settings
import { useStudy } from '../../context/useStudy'
import { Map, Layers, TrendingUp, Settings } from 'lucide-react'

export function Navigation({ onOpenSettings }) {
  const { currentView, setCurrentView } = useStudy()

  const NAV_ITEMS = [
    { id: 'world', label: 'World Map', shortLabel: 'World', icon: Map },
    { id: 'flashcards', label: 'Flashcards', shortLabel: 'Cards', icon: Layers },
    { id: 'progress', label: 'Progress', shortLabel: 'Progress', icon: TrendingUp },
    { id: 'settings', label: 'Settings', shortLabel: 'Settings', icon: Settings }
  ]

  const handleNavClick = (id) => {
    if (id === 'settings') {
      onOpenSettings?.()
    } else {
      setCurrentView(id)
    }
  }

  return (
    <nav
      className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 shadow-lg backdrop-blur-md shrink-0"
      role="navigation"
      aria-label="Main Navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = currentView === item.id && item.id !== 'settings'

        return (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => handleNavClick(item.id)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 whitespace-nowrap ${
              isActive
                ? 'bg-amber text-slate-950 shadow-md font-extrabold scale-102'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            aria-current={isActive ? 'page' : undefined}
            title={item.label}
          >
            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
            <span className="hidden md:inline lg:hidden">{item.shortLabel}</span>
            <span className="hidden lg:inline">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
