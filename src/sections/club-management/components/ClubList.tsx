import { useState } from 'react'
import type {
  ClubListProps,
  AdminClub,
  AdminClubStatus,
  ClubTier,
  ClubFlag,
} from '@/../product/sections/club-management/types'

// =============================================================================
// Design Tokens: lime (primary), sky (secondary), slate (neutral)
// Typography: Outfit (heading/body), JetBrains Mono (mono)
// =============================================================================

// Status badge styles
const statusStyles: Record<AdminClubStatus, { bg: string; text: string; dot: string }> = {
  active: {
    bg: 'bg-lime-500/10 dark:bg-lime-500/20',
    text: 'text-lime-700 dark:text-lime-400',
    dot: 'bg-lime-500',
  },
  suspended: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
  under_review: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  flagged: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
    text: 'text-orange-700 dark:text-orange-400',
    dot: 'bg-orange-500',
  },
  archived: {
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    text: 'text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
}

// Tier badge styles
const tierStyles: Record<ClubTier, { bg: string; text: string; label: string }> = {
  free: {
    bg: 'bg-slate-100 dark:bg-slate-700',
    text: 'text-slate-600 dark:text-slate-400',
    label: 'Free',
  },
  pro: {
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    text: 'text-sky-700 dark:text-sky-400',
    label: 'Pro',
  },
  elite: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
    label: 'Elite',
  },
  community_impact: {
    bg: 'bg-lime-100 dark:bg-lime-900/30',
    text: 'text-lime-700 dark:text-lime-400',
    label: 'Community',
  },
}

// Flag labels
const flagLabels: Record<ClubFlag, string> = {
  rapid_creation: 'Rapid Creation',
  temp_email: 'Temp Email',
  no_events: 'No Events',
  approaching_event_limit: 'Near Limit',
  ownership_dispute: 'Dispute',
  low_activity: 'Low Activity',
  no_admin: 'No Admin',
  inactive_90_days: 'Inactive 90d',
  orphaned: 'Orphaned',
}

// =============================================================================
// Utility Functions
// =============================================================================

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// =============================================================================
// Icons
// =============================================================================

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    </svg>
  )
}

function ExclamationTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  )
}

function EllipsisVerticalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}

// =============================================================================
// Sub-Components
// =============================================================================

// Activity Score Indicator
function ActivityScore({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return 'text-lime-600 dark:text-lime-400'
    if (score >= 50) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getBgColor = () => {
    if (score >= 80) return 'bg-lime-500'
    if (score >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-[60px]">
        <div
          className={`h-full ${getBgColor()} rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${getColor()}`}>{score}</span>
    </div>
  )
}

// Club Row Component
interface ClubRowProps {
  club: AdminClub
  onView?: () => void
  onSuspend?: () => void
  onUnsuspend?: () => void
  onDelete?: () => void
}

function ClubRow({ club, onView, onSuspend, onUnsuspend, onDelete }: ClubRowProps) {
  const [showActions, setShowActions] = useState(false)
  const status = statusStyles[club.status]
  const tier = tierStyles[club.tier]

  return (
    <tr
      onClick={onView}
      className="group cursor-pointer border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    >
      {/* Club Info */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shadow-sm">
            <BuildingIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
              {club.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {club.ownerName}
              </p>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <MapPinIcon className="w-3 h-3" />
                {club.location.city}, {club.location.state}
              </div>
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {club.status.replace('_', ' ')}
        </div>
      </td>

      {/* Tier */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tier.bg} ${tier.text}`}>
            {tier.label}
          </span>
          {club.tierSource === 'override' && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wider">
              Override
            </span>
          )}
          {club.tierSource === 'approved_nonprofit' && (
            <span className="text-[10px] text-lime-600 dark:text-lime-400 font-medium uppercase tracking-wider">
              Non-Profit
            </span>
          )}
        </div>
      </td>

      {/* Members */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <UsersIcon className="w-4 h-4 text-slate-400" />
          <span>{club.memberCount.toLocaleString()}</span>
        </div>
      </td>

      {/* Events */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <span>{club.eventCount}</span>
          <span className="text-xs text-slate-400">({club.eventsThisMonth}/mo)</span>
        </div>
      </td>

      {/* Activity Score */}
      <td className="py-4 px-4">
        <ActivityScore score={club.activityScore} />
      </td>

      {/* Flags */}
      <td className="py-4 px-4">
        {club.flags.length > 0 ? (
          <div className="flex items-center gap-1 flex-wrap">
            {club.flags.slice(0, 2).map((flag) => (
              <span
                key={flag}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              >
                <ExclamationTriangleIcon className="w-3 h-3" />
                {flagLabels[flag]}
              </span>
            ))}
            {club.flags.length > 2 && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                +{club.flags.length - 2}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
        )}
      </td>

      {/* Last Activity */}
      <td className="py-4 px-4 text-sm text-slate-500 dark:text-slate-400">
        {formatRelativeTime(club.lastActivityAt)}
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <EllipsisVerticalIcon className="w-5 h-5 text-slate-400" />
          </button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowActions(false)
                }}
              />
              <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onView?.()
                    setShowActions(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  View Details
                </button>
                {club.status === 'suspended' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onUnsuspend?.()
                      setShowActions(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-lime-600 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors"
                  >
                    Unsuspend Club
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSuspend?.()
                      setShowActions(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                  >
                    Suspend Club
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.()
                    setShowActions(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete Club
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

// Sortable Column Header
type SortField = 'name' | 'memberCount' | 'eventCount' | 'activityScore' | 'lastActivityAt' | 'createdAt'

interface SortableHeaderProps {
  label: string
  field: SortField
  currentField: SortField
  direction: 'asc' | 'desc'
  onSort: (field: SortField) => void
}

function SortableHeader({ label, field, currentField, direction, onSort }: SortableHeaderProps) {
  const isActive = currentField === field

  return (
    <th
      onClick={() => onSort(field)}
      className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive && (
          direction === 'asc' ? (
            <ChevronUpIcon className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
          ) : (
            <ChevronDownIcon className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
          )
        )}
      </div>
    </th>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ClubList({
  clubs,
  onViewClub,
  onSuspendClub,
  onUnsuspendClub,
  onDeleteClub,
  onTransferOwnership,
  onSearch,
  onFilterByStatus,
  onFilterByTier,
  onFilterByFlag,
  onExport,
}: ClubListProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<AdminClubStatus | 'all'>('all')
  const [selectedTier, setSelectedTier] = useState<ClubTier | 'all'>('all')
  const [selectedFlag, setSelectedFlag] = useState<ClubFlag | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('lastActivityAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSearch = () => {
    onSearch?.(searchQuery)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleStatusFilter = (status: AdminClubStatus | 'all') => {
    setSelectedStatus(status)
    onFilterByStatus?.(status)
  }

  const handleTierFilter = (tier: ClubTier | 'all') => {
    setSelectedTier(tier)
    onFilterByTier?.(tier)
  }

  const handleFlagFilter = (flag: ClubFlag | 'all') => {
    setSelectedFlag(flag)
    onFilterByFlag?.(flag)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedStatus('all')
    setSelectedTier('all')
    setSelectedFlag('all')
    onSearch?.('')
    onFilterByStatus?.('all')
    onFilterByTier?.('all')
    onFilterByFlag?.('all')
  }

  const hasActiveFilters = selectedStatus !== 'all' || selectedTier !== 'all' || selectedFlag !== 'all' || searchQuery.length > 0

  // Sort clubs
  const sortedClubs = [...clubs].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1
    switch (sortField) {
      case 'name':
        return a.name.localeCompare(b.name) * modifier
      case 'memberCount':
        return (a.memberCount - b.memberCount) * modifier
      case 'eventCount':
        return (a.eventCount - b.eventCount) * modifier
      case 'activityScore':
        return (a.activityScore - b.activityScore) * modifier
      case 'lastActivityAt':
        return (new Date(a.lastActivityAt).getTime() - new Date(b.lastActivityAt).getTime()) * modifier
      case 'createdAt':
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * modifier
      default:
        return 0
    }
  })

  // Get counts for each status
  const statusCounts = {
    all: clubs.length,
    active: clubs.filter(c => c.status === 'active').length,
    suspended: clubs.filter(c => c.status === 'suspended').length,
    under_review: clubs.filter(c => c.status === 'under_review').length,
    flagged: clubs.filter(c => c.status === 'flagged').length,
    archived: clubs.filter(c => c.status === 'archived').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                All Clubs
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {clubs.length.toLocaleString()} clubs total
              </p>
            </div>
            <button
              onClick={onExport}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <DownloadIcon className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['all', 'active', 'suspended', 'under_review', 'flagged'] as const).map((status) => {
            const isActive = selectedStatus === status
            const count = statusCounts[status]
            const styles = status === 'all' ? null : statusStyles[status]

            return (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {styles && <span className={`w-2 h-2 rounded-full ${styles.dot}`} />}
                <span className="capitalize">{status.replace('_', ' ')}</span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                  isActive
                    ? 'bg-white/20 dark:bg-slate-900/20'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by club name, owner email, or ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-lime-50 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-800'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
              }`}
            >
              <FilterIcon className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-lime-500" />
              )}
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 rounded-lg shadow-sm hover:shadow transition-all"
            >
              Search
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tier Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Subscription Tier
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'free', 'pro', 'elite', 'community_impact'] as const).map((tier) => {
                      const isSelected = selectedTier === tier
                      const styles = tier === 'all' ? null : tierStyles[tier]
                      return (
                        <button
                          key={tier}
                          onClick={() => handleTierFilter(tier)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow'
                              : styles
                              ? `${styles.bg} ${styles.text} hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600`
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {tier === 'all' ? 'All Tiers' : styles?.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Flag Filter */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Flags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleFlagFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedFlag === 'all'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      All
                    </button>
                    {(['rapid_creation', 'temp_email', 'no_events', 'low_activity', 'ownership_dispute', 'orphaned'] as ClubFlag[]).map((flag) => {
                      const isSelected = selectedFlag === flag
                      return (
                        <button
                          key={flag}
                          onClick={() => handleFlagFilter(flag)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-red-600 text-white shadow'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                          }`}
                        >
                          <ExclamationTriangleIcon className="w-3 h-3" />
                          {flagLabels[flag]}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              {hasActiveFilters && (
                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    <XIcon className="w-4 h-4" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {sortedClubs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
              <BuildingIcon className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-lg font-medium">No clubs found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <SortableHeader
                      label="Club"
                      field="name"
                      currentField={sortField}
                      direction={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Tier
                    </th>
                    <SortableHeader
                      label="Members"
                      field="memberCount"
                      currentField={sortField}
                      direction={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Events"
                      field="eventCount"
                      currentField={sortField}
                      direction={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Activity"
                      field="activityScore"
                      currentField={sortField}
                      direction={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Flags
                    </th>
                    <SortableHeader
                      label="Last Active"
                      field="lastActivityAt"
                      currentField={sortField}
                      direction={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedClubs.map((club) => (
                    <ClubRow
                      key={club.id}
                      club={club}
                      onView={() => onViewClub?.(club.id)}
                      onSuspend={() => {
                        const reason = prompt('Enter suspension reason:')
                        if (reason) onSuspendClub?.(club.id, reason)
                      }}
                      onUnsuspend={() => onUnsuspendClub?.(club.id)}
                      onDelete={() => {
                        if (confirm(`Are you sure you want to delete "${club.name}"? This cannot be undone.`)) {
                          onDeleteClub?.(club.id)
                        }
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
              <UsersIcon className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Members</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {clubs.reduce((sum, c) => sum + c.memberCount, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Events</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {clubs.reduce((sum, c) => sum + c.eventCount, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
              <ChartBarIcon className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Avg Activity</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {Math.round(clubs.reduce((sum, c) => sum + c.activityScore, 0) / clubs.length || 0)}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Flagged</span>
            </div>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {clubs.filter(c => c.flags.length > 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
