import { ChevronDown, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Topbar({ title, onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="h-16 shrink-0 bg-white border-b border-ink-100 flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-ink-500 hover:text-ink-900 transition-colors shrink-0"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <h1 className="text-lg font-semibold text-ink-900 truncate flex-1 min-w-0">{title}</h1>

      <button className="flex items-center gap-2 pl-2 shrink-0">
        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-semibold">
          {(user?.name || 'U')
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className="text-left leading-tight hidden sm:block">
          <p className="text-sm font-medium text-ink-900">{user?.name || 'User'}</p>
          <p className="text-xs text-ink-500 capitalize">{user?.role || 'admin'}</p>
        </div>
        <ChevronDown size={16} className="text-ink-500 hidden sm:block" />
      </button>
    </header>
  )
}
