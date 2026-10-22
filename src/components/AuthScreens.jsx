// Auth screens: Landing → Register → Login → Forgot Password
import { useState } from 'react'
import StarField from './StarField'
import Mascot from './Mascot'
import { AVATARS, getAvatar } from '../data/avatarData'

// ── Icon-labelled input ──
function RpgInput({ id, label, type = 'text', value, onChange, icon, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="font-pixel text-[0.5rem] text-amber tracking-widest uppercase"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`rpg-input ${icon ? 'pl-9' : ''}`}
        />
      </div>
    </div>
  )
}

// ── SCREEN 1 – Landing ──
function LandingScreen({ onLogin, onRegister }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 fade-in">
      <LogoBlock />

      <div className="flex flex-col gap-4 w-52">
        <button
          id="btn-go-login"
          className="btn-amber w-full text-center"
          onClick={onLogin}
        >
          LOGIN
        </button>
        <button
          id="btn-go-register"
          className="btn-orange w-full text-center"
          onClick={onRegister}
        >
          REGISTER
        </button>
      </div>

      {/* Decorative corner icons (like the reference) */}
      <CornerDecorations />
    </div>
  )
}

// ── SCREEN 2 – Register ──
function RegisterScreen({ onBack, onSuccess }) {
  const [email,    setEmail]    = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [avatar,   setAvatar]   = useState('warrior')
  const [error,    setError]    = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !username || !password) {
      setError('All fields are required.')
      return
    }
    // Store in localStorage (no backend)
    const users = JSON.parse(localStorage.getItem('lq_users') || '[]')
    if (users.find(u => u.username === username)) {
      setError('Username already taken.')
      return
    }
    users.push({ email, username, password, avatar, xp: 0, level: 1 })
    localStorage.setItem('lq_users', JSON.stringify(users))
    onSuccess({ username, avatar, xp: 0, level: 1 })
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 fade-in">
      <LogoBlock />

      <div className="rpg-panel scanlines w-full max-w-sm p-6 flex flex-col gap-5">
        {/* Avatar header icon */}
        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-amber shadow-[0_0_15px_rgba(245,166,35,0.4)] flex items-center justify-center overflow-hidden">
            <img
              src={getAvatar(avatar).image}
              alt={getAvatar(avatar).label}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-pixel text-[8.5px] text-amber">
            {getAvatar(avatar).label} • {getAvatar(avatar).title}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <RpgInput id="reg-email"    label="Your Email"        type="email"    value={email}    onChange={setEmail}    placeholder="hero@quest.com" />
          <RpgInput id="reg-username" label="Create Username"   type="text"     value={username} onChange={setUsername} placeholder="QuestMaster99"  />
          <RpgInput id="reg-password" label="Password"          type="password" value={password} onChange={setPassword} placeholder="••••••••"        />

          {/* Avatar grid */}
          <div className="flex flex-col gap-2">
            <span className="font-pixel text-[0.5rem] text-amber tracking-widest uppercase">
              Select Character Avatar
            </span>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  id={`avatar-${av.id}`}
                  onClick={() => setAvatar(av.id)}
                  className={`avatar-option w-11 h-11 rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                    avatar === av.id
                      ? 'border-amber shadow-[0_0_12px_rgba(245,166,35,0.7)] scale-105 ring-1 ring-amber'
                      : 'border-slate-700/80 hover:border-slate-500 opacity-75'
                  }`}
                  title={`${av.label} — ${av.title}`}
                >
                  <img
                    src={av.image}
                    alt={av.label}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="font-inter text-xs text-red-400 text-center">{error}</p>
          )}

          <button id="btn-register-submit" type="submit" className="btn-amber w-full mt-1">
            REGISTER
          </button>
        </form>

        <button id="btn-back-from-register" className="btn-ghost w-full" onClick={onBack}>
          ← BACK
        </button>
      </div>
    </div>
  )
}

// ── SCREEN 3 – Login ──
function LoginScreen({ onBack, onSuccess, onForgot }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [shaking,  setShaking]  = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('lq_users') || '[]')
    const user = users.find(u => u.username === username && u.password === password)
    if (!user) {
      setError('Invalid credentials. Try again.')
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      return
    }
    onSuccess(user)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 fade-in">
      <LogoBlock />

      <div className={`rpg-panel scanlines w-full max-w-xs p-6 flex flex-col gap-5 ${shaking ? 'shake' : ''}`}>
        {/* Key icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-input)] border border-[var(--border-dim)] flex items-center justify-center text-amber text-2xl">
            🗝
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <RpgInput id="login-username" label="Username" value={username} onChange={setUsername} placeholder="QuestMaster99" />
          <RpgInput id="login-password" label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

          {error && (
            <p className="font-inter text-xs text-red-400 text-center">{error}</p>
          )}

          <button id="btn-login-submit" type="submit" className="btn-amber w-full mt-1">
            LOGIN
          </button>
        </form>

        <div className="flex flex-col gap-2">
          <button
            id="btn-forgot-password"
            className="font-pixel text-[0.45rem] text-[var(--text-muted)] hover:text-amber transition-colors"
            onClick={onForgot}
          >
            FORGOT PASSWORD?
          </button>
          <button id="btn-back-from-login" className="btn-ghost w-full" onClick={onBack}>
            ← BACK
          </button>
        </div>
      </div>
    </div>
  )
}

// ── SCREEN 4 – Forgot Password ──
function ForgotScreen({ onBack }) {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 fade-in">
      <LogoBlock />

      <div className="rpg-panel scanlines w-full max-w-xs p-6 flex flex-col gap-5">
        {/* Mail icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-input)] border border-[var(--border-dim)] flex items-center justify-center text-amber text-2xl">
            ✉
          </div>
        </div>

        {sent ? (
          <div className="text-center flex flex-col gap-4">
            <p className="font-pixel text-[0.55rem] text-amber leading-relaxed">RESET LINK SENT!</p>
            <p className="font-inter text-xs text-[var(--text-muted)]">Check your inbox for the reset link.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <RpgInput id="forgot-email" label="Enter Email or Username" type="email" value={email} onChange={setEmail} placeholder="hero@quest.com" />
            <p className="font-pixel text-[0.4rem] text-[var(--text-muted)] leading-relaxed text-center">
              A RESET LINK WILL BE SENT TO YOUR EMAIL
            </p>
            <button id="btn-send-reset" type="submit" className="btn-amber w-full">
              SEND RESET LINK
            </button>
            <p className="font-pixel text-[0.4rem] text-[var(--teal)] text-center cursor-pointer" onClick={onBack}>
              BACK TO LOGIN
            </p>
          </form>
        )}

        <button id="btn-back-from-forgot" className="btn-ghost w-full" onClick={onBack}>
          ← BACK
        </button>
      </div>
    </div>
  )
}

// ── Shared: Logo block ──
function LogoBlock() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <Mascot size={46} avatarId="paladin" />
        <h1 className="font-pixel text-2xl sm:text-3xl leading-none tracking-wider"
            style={{ color: '#f5a623', textShadow: '0 0 20px rgba(245,166,35,0.5), 3px 3px 0 rgba(180,100,0,0.8)' }}>
          StudyMate
        </h1>
      </div>
      <p className="font-pixel text-[0.45rem] tracking-[0.25em] text-[var(--text-muted)] uppercase mt-1">
        Ready your mind. Start your quest
      </p>
    </div>
  )
}

// ── Shared: Corner decorations (icons like the reference image) ──
function CornerDecorations() {
  const items = [
    { pos: 'top-6 left-6',      icon: '⚔', opacity: 0.35 },
    { pos: 'top-6 right-6',     icon: '🛡', opacity: 0.3  },
    { pos: 'bottom-6 left-6',   icon: '📜', opacity: 0.3  },
    { pos: 'bottom-6 right-6',  icon: '🎮', opacity: 0.3  },
    { pos: 'top-1/2 left-4',    icon: '⭐', opacity: 0.2  },
    { pos: 'top-1/2 right-4',   icon: '⭐', opacity: 0.2  },
  ]
  return (
    <>
      {items.map((item, i) => (
        <span
          key={i}
          className={`fixed ${item.pos} text-[var(--text-muted)] text-lg pointer-events-none select-none`}
          style={{ opacity: item.opacity }}
          aria-hidden="true"
        >
          {item.icon}
        </span>
      ))}
    </>
  )
}

// ── Auth container ──
export default function AuthScreens({ onAuthenticated }) {
  const [screen, setScreen] = useState('landing') // landing | register | login | forgot

  function handleSuccess(user) {
    localStorage.setItem('lq_current_user', JSON.stringify(user))
    onAuthenticated(user)
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-space">
      <StarField />

      {/* Dark vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)'
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md">
        {screen === 'landing'  && <LandingScreen onLogin={() => setScreen('login')} onRegister={() => setScreen('register')} />}
        {screen === 'register' && <RegisterScreen onBack={() => setScreen('landing')} onSuccess={handleSuccess} />}
        {screen === 'login'    && <LoginScreen    onBack={() => setScreen('landing')} onSuccess={handleSuccess} onForgot={() => setScreen('forgot')} />}
        {screen === 'forgot'   && <ForgotScreen   onBack={() => setScreen('login')} />}
      </div>
    </div>
  )
}
