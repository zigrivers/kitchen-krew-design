import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

export interface NavigationItem {
  label: string
  href: string
  icon?: React.ReactNode
  isActive?: boolean
}

export interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: {
    name: string
    avatarUrl?: string
  }
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-[Outfit]">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-lg font-semibold text-slate-900 dark:text-white">
          KitchenKrew
        </span>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-lime-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">KK</span>
              </div>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                KitchenKrew
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <MainNav
              items={navigationItems}
              onNavigate={(href) => {
                onNavigate?.(href)
                setSidebarOpen(false)
              }}
            />
          </nav>

          {/* User menu */}
          {user && (
            <div className="border-t border-slate-200 dark:border-slate-800">
              <UserMenu user={user} onLogout={onLogout} />
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-60 pt-14 lg:pt-0 min-h-screen">
        <div className="h-full">{children}</div>
      </main>
    </div>
  )
}
