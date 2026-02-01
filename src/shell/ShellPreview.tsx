import { AppShell } from './components/AppShell'

export default function ShellPreview() {
  const navigationItems = [
    { label: 'Events', href: '/events', isActive: true },
    { label: 'Live Play', href: '/live-play' },
    { label: 'Players', href: '/players' },
    { label: 'Clubs & Venues', href: '/clubs-venues' },
    { label: 'Stats & Leaderboards', href: '/stats' },
  ]

  const user = {
    name: 'Alex Morgan',
    avatarUrl: undefined,
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Events
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Discover and manage pickleball events near you.
        </p>

        {/* Sample content placeholder */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg mb-3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
