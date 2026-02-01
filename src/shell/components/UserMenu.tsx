import { useState, useRef, useEffect } from 'react'
import { Settings, HelpCircle, LogOut, ChevronUp } from 'lucide-react'

export interface UserMenuProps {
  user: {
    name: string
    avatarUrl?: string
  }
  onLogout?: () => void
  onSettings?: () => void
  onHelp?: () => void
}

export function UserMenu({ user, onLogout, onSettings, onHelp }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Get initials from name
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={menuRef} className="relative">
      {/* Dropdown menu (appears above) */}
      {isOpen && (
        <div className="absolute bottom-full left-2 right-2 mb-1 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              onSettings?.()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => {
              onHelp?.()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
          <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
          <button
            onClick={() => {
              onLogout?.()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      )}

      {/* User button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {/* Avatar */}
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
            <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
              {initials}
            </span>
          </div>
        )}

        {/* Name */}
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {user.name}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Player
          </div>
        </div>

        {/* Chevron */}
        <ChevronUp
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? '' : 'rotate-180'
          }`}
        />
      </button>
    </div>
  )
}
