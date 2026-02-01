import {
  MapPin,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import type { Club } from '@/../product/sections/clubs-and-venues/types'

// =============================================================================
// Props
// =============================================================================

export interface ClubCardProps {
  club: Club
  onView?: () => void
  onJoin?: () => void
  onLeave?: () => void
  onCancelRequest?: () => void
}

// =============================================================================
// Sub-Components
// =============================================================================

function ClubLogo({
  name,
  logoUrl,
  size = 'md',
}: {
  name: string
  logoUrl: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-xl object-cover ring-2 ring-white dark:ring-slate-900`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-lime-400 via-lime-500 to-sky-500 flex items-center justify-center ring-2 ring-white dark:ring-slate-900`}
    >
      <span className="font-bold text-white">{initials}</span>
    </div>
  )
}

function MembershipBadge({ type }: { type: 'open' | 'closed' }) {
  if (type === 'open') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400">
        Open
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400">
      <Lock className="w-3 h-3" />
      Invite Only
    </span>
  )
}

function RoleBadge({ role }: { role: 'admin' | 'member' | null }) {
  if (!role) return null

  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-400">
        Admin
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
      Member
    </span>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ClubCard({
  club,
  onView,
  onJoin,
  onLeave,
  onCancelRequest,
}: ClubCardProps) {
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (club.isUserMember) {
      onLeave?.()
    } else if (club.pendingRequest) {
      onCancelRequest?.()
    } else {
      onJoin?.()
    }
  }

  return (
    <div
      onClick={onView}
      className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-lime-300 dark:hover:border-lime-700 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <ClubLogo name={club.name} logoUrl={club.logoUrl} size="md" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with name and badges */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                {club.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {club.location.city}, {club.location.state}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-lime-500 dark:group-hover:text-lime-400 flex-shrink-0 transition-colors" />
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-2 mt-2">
            <MembershipBadge type={club.membershipType} />
            <RoleBadge role={club.userRole} />
          </div>

          {/* Description */}
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {club.description}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {club.memberCount} members
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-lime-500" />
              {club.activeThisMonth} active
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {club.upcomingEvents} upcoming
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        {club.isUserMember ? (
          <button
            onClick={handleActionClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Leave Club
          </button>
        ) : club.pendingRequest ? (
          <button
            onClick={handleActionClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            Request Pending
          </button>
        ) : club.membershipType === 'open' ? (
          <button
            onClick={handleActionClick}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Join Club
          </button>
        ) : (
          <button
            onClick={handleActionClick}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium border border-lime-300 dark:border-lime-700 text-lime-700 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            Request to Join
          </button>
        )}
      </div>
    </div>
  )
}
