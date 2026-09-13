import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Topbar from '../components/Topbar.jsx'

const TITLES = {
  '/dashboard': 'Dashboard',
  '/classes': 'Classrooms',
  '/teachers': 'Teachers',
  '/students': 'Students',
  '/attendance': 'Mark Attendance',
  '/attendance/history': 'Attendance History',
  '/pending-approvals': 'Pending Approvals',
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={TITLES[pathname] || 'SchoolMS'} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
