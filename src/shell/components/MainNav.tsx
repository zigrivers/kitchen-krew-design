import {
  Calendar,
  Play,
  Users,
  Building2,
  BarChart3,
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
}

const defaultIcons: Record<string, LucideIcon> = {
  Events: Calendar,
  'Live Play': Play,
  Players: Users,
  'Clubs & Venues': Building2,
  'Stats & Leaderboards': BarChart3,
}

export function MainNav({ items, onNavigate }: MainNavProps) {
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
                    ? 'bg-lime-50 dark:bg-lime-950 text-lime-700 dark:text-lime-400 border-l-3 border-lime-500 -ml-0.5 pl-3.5'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
              `}
            >
              {icon && (
                <span
                  className={
                    item.isActive
                      ? 'text-lime-600 dark:text-lime-400'
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
