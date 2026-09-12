import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  CalendarCheck,
  History,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'

const NAV = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/classes', label: 'Classes', icon: Building2 },
    { to: '/teachers', label: 'Teachers', icon: GraduationCap },
    { to: '/students', label: 'Students', icon: Users },
    { to: '/attendance', label: 'Mark Attendance', icon: CalendarCheck },
    { to: '/attendance/history', label: 'Attendance History', icon: History },
  ],
  teacher: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/classes', label: 'Classes', icon: Building2 },
    { to: '/students', label: 'Students', icon: Users },
    { to: '/attendance', label: 'Mark Attendance', icon: CalendarCheck },
    { to: '/attendance/history', label: 'Attendance History', icon: History },
  ],
  student: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/classes', label: 'Classes', icon: Building2 },
    { to: '/teachers', label: 'Teachers', icon: GraduationCap },
    { to: '/attendance/history', label: 'Attendance History', icon: History },
  ],
}

export default function Sidebar({ open = false, onClose }) {
  const { user, logout } = useAuth()
  const role = user?.role || 'admin'
  const items = NAV[role] || NAV.admin

  return (
    <>
      {/* Overlay - mobile only, shown when drawer is open */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 bg-sidebar h-screen flex flex-col text-white transition-transform duration-200 ease-out
          lg:sticky lg:top-0 lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-white/10">
          <Logo dark />
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-sm font-semibold shrink-0">
              {(user?.name || 'U')
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-white/50 capitalize">{role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
