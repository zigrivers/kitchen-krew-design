import {
  Calendar,
  Play,
  Users,
  Building2,
  BarChart3,
  UserCog,
  Building,
  Ticket,
  ScrollText,
  Shield,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  isActive?: boolean
}

export interface MainNavProps {
  items: NavItem[]
  onNavigate?: (href: string) => void
  variant?: 'default' | 'admin'
}

const defaultIcons: Record<string, LucideIcon> = {
  // Player navigation
  Events: Calendar,
  'Live Play': Play,
  Players: Users,
  'Clubs & Venues': Building2,
  'Stats & Leaderboards': BarChart3,
  // Admin navigation
  'User Management': UserCog,
  'Club Management': Building,
  'Support Tickets': Ticket,
  'Audit Logs': ScrollText,
  'Content Moderation': Shield,
  'System Settings': Settings,
}

export function MainNav({ items, onNavigate, variant = 'default' }: MainNavProps) {
  const isAdmin = variant === 'admin'

  // Color schemes for default (lime) and admin (sky) variants
  const activeClasses = isAdmin
    ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border-l-3 border-sky-500 -ml-0.5 pl-3.5'
    : 'bg-lime-50 dark:bg-lime-950 text-lime-700 dark:text-lime-400 border-l-3 border-lime-500 -ml-0.5 pl-3.5'

  const activeIconClasses = isAdmin
    ? 'text-sky-600 dark:text-sky-400'
    : 'text-lime-600 dark:text-lime-400'

  return (
    <ul className="space-y-1 px-2">
      {items.map((item) => {
        const IconComponent = defaultIcons[item.label]
        const icon = item.icon || (IconComponent ? <IconComponent className="w-5 h-5" /> : null)

        return (
          <li key={item.href}>
            <button
              onClick={() => onNavigate?.(item.href)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                transition-colors duration-150
                ${
                  item.isActive
                    ? activeClasses
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
              `}
            >
              {icon && (
                <span
                  className={
                    item.isActive
                      ? activeIconClasses
                      : 'text-slate-500 dark:text-slate-400'
                  }
                >
                  {icon}
                </span>
              )}
              <span className="font-medium">{item.label}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
