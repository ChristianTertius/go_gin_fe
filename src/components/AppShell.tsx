import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'

type AppShellProps = {
  children: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen w-full bg-transparent text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute right-10 top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <header className="relative z-10 flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 shadow-glass backdrop-blur-md sm:px-6">
          <Link to="/" className="flex items-center gap-3 text-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 text-xl font-black text-slate-900 shadow-lg shadow-cyan-900/40">
              GG
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[3px] text-cyan-200">Go Gin</p>
              <p className="text-lg font-semibold text-slate-50">Tweetboard</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-200 sm:flex">
            <NavLink to="/" label="Beranda" active={location.pathname === '/'} />
            {!isAuthenticated && (
              <>
                <NavLink to="/login" label="Masuk" active={location.pathname === '/login'} />
                <NavLink to="/register" label="Daftar" active={location.pathname === '/register'} />
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 shadow-glass">
                  @{user.username}
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Keluar
                </Button>
              </div>
            ) : !isAuthPage ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Masuk
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Daftar
                </Button>
              </div>
            ) : null}
          </div>
        </header>

        <main className="relative z-10 mt-8 flex-1">{children}</main>
      </div>
    </div>
  )
}

const NavLink = ({ to, label, active }: { to: string; label: string; active: boolean }) => (
  <Link
    to={to}
    className={cn(
      'rounded-lg px-3 py-2 transition-colors',
      active ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white',
    )}
  >
    {label}
  </Link>
)
