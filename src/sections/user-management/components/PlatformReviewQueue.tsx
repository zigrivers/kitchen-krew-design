import type {
  PlatformReviewQueueProps,
  EscalationCase,
  EscalationStatus,
  EscalationPriority,
  ActionReason,
} from '@/../product/sections/user-management/types'

// Reason labels for display
const reasonLabels: Record<ActionReason, string> = {
  code_of_conduct: 'Code of Conduct',
  unsportsmanlike_behavior: 'Unsportsmanlike Behavior',
  no_show_abuse: 'No-Show Abuse',
  harassment: 'Harassment',
  threats_violence: 'Threats/Violence',
  fraud: 'Fraud',
  illegal_activity: 'Illegal Activity',
  tos_violation: 'ToS Violation',
  other: 'Other',
}

// Status styles
const statusStyles: Record<EscalationStatus, { bg: string; text: string; label: string }> = {
  new: {
    bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    text: 'text-sky-700 dark:text-sky-400',
    label: 'New',
  },
  in_review: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'In Review',
  },
  resolved: {
    bg: 'bg-lime-500/10 dark:bg-lime-500/20',
    text: 'text-lime-700 dark:text-lime-400',
    label: 'Resolved',
  },
}

// Priority styles
const priorityStyles: Record<EscalationPriority, { bg: string; text: string; border: string }> = {
  standard: {
    bg: 'bg-slate-50 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700',
  },
  urgent: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

// Icons
function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  )
}

function HandRaisedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 05l1-1m4 0l1 1m-4 0v9m0-9a2 2 0 114 0m-4 0a2 2 0 10-4 0m4 9a4 4 0 01-4-4v-1m8 5a4 4 0 004-4v-1m-8-4V4a2 2 0 114 0v1m-4 0a2 2 0 10-4 0v1m0 0v5a4 4 0 004 4m4-9V5a2 2 0 114 0v1m0 4v4a4 4 0 01-4 4" />
    </svg>
  )
}

// Case Card Component
interface CaseCardProps {
  escalationCase: EscalationCase
  onSelect?: () => void
  onAssignToSelf?: () => void
}

function CaseCard({ escalationCase, onSelect, onAssignToSelf }: CaseCardProps) {
  const status = statusStyles[escalationCase.status]
  const priority = priorityStyles[escalationCase.priority]
  const isUrgent = escalationCase.priority === 'urgent'
  const isUnassigned = !escalationCase.assignedToId

  return (
    <div
      className={`relative rounded-xl border-2 ${priority.border} ${priority.bg} overflow-hidden transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer group`}
      onClick={onSelect}
    >
      {/* Urgent indicator bar */}
      {isUrgent && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500" />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {isUrgent && (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
                {isUrgent && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                    Urgent
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {escalationCase.playerName}
              </h3>
            </div>
          </div>

          <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-lime-600 dark:group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Reason Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {reasonLabels[escalationCase.reason]}
          </span>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
          {escalationCase.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <BuildingIcon className="w-4 h-4" />
            <span>{escalationCase.clubName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="w-4 h-4" />
            <span>{formatRelativeTime(escalationCase.escalatedAt)}</span>
          </div>
          {escalationCase.evidence.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 font-medium">
                {escalationCase.evidence.length} evidence
              </span>
            </div>
          )}
        </div>

        {/* Club Action Taken */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Club Action
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {escalationCase.clubActionTaken}
          </p>
        </div>

        {/* Assignment / Actions */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          {escalationCase.assignedToName ? (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                <UserIcon className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              </div>
              <span className="text-slate-600 dark:text-slate-400">
                Assigned to <span className="font-medium text-slate-900 dark:text-white">{escalationCase.assignedToName}</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span>Unassigned</span>
            </div>
          )}

          {isUnassigned && escalationCase.status !== 'resolved' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAssignToSelf?.()
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-lime-700 dark:text-lime-400 bg-lime-100 dark:bg-lime-900/30 hover:bg-lime-200 dark:hover:bg-lime-900/50 rounded-lg transition-colors"
            >
              <HandRaisedIcon className="w-4 h-4" />
              Claim
            </button>
          )}
        </div>

        {/* Resolution (if resolved) */}
        {escalationCase.status === 'resolved' && escalationCase.resolution && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-lime-700 dark:text-lime-400">
                Resolution
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 capitalize">
              {escalationCase.resolution.replace(/_/g, ' ')}
            </p>
            {escalationCase.resolutionNotes && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {escalationCase.resolutionNotes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Stats Card Component
interface StatsCardProps {
  label: string
  count: number
  icon: React.ReactNode
  color: 'lime' | 'amber' | 'sky' | 'red'
}

function StatsCard({ label, count, icon, color }: StatsCardProps) {
  const colorStyles = {
    lime: 'bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-800',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    sky: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colorStyles[color]}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-xs font-medium uppercase tracking-wider opacity-75">{label}</p>
      </div>
    </div>
  )
}

// Main Component
export function PlatformReviewQueue({
  cases,
  statusFilter,
  priorityFilter,
  isLoading,
  onFilterChange,
  onSelectCase,
  onAssignToSelf,
}: PlatformReviewQueueProps) {
  // Calculate stats
  const stats = {
    total: cases.length,
    new: cases.filter((c) => c.status === 'new').length,
    inReview: cases.filter((c) => c.status === 'in_review').length,
    urgent: cases.filter((c) => c.priority === 'urgent' && c.status !== 'resolved').length,
  }

  // Filter cases
  const filteredCases = cases.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false
    return true
  })

  // Sort: urgent first, then by date
  const sortedCases = [...filteredCases].sort((a, b) => {
    // Urgent cases first
    if (a.priority === 'urgent' && b.priority !== 'urgent') return -1
    if (b.priority === 'urgent' && a.priority !== 'urgent') return 1
    // Then by status (new > in_review > resolved)
    const statusOrder = { new: 0, in_review: 1, resolved: 2 }
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status]
    }
    // Then by date (newest first)
    return new Date(b.escalatedAt).getTime() - new Date(a.escalatedAt).getTime()
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Platform Review Queue
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Cases escalated from club admins for platform-wide review
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatsCard
              label="Total Cases"
              count={stats.total}
              icon={<InboxIcon className="w-6 h-6" />}
              color="sky"
            />
            <StatsCard
              label="New"
              count={stats.new}
              icon={<ClockIcon className="w-6 h-6" />}
              color="sky"
            />
            <StatsCard
              label="In Review"
              count={stats.inReview}
              icon={<UserIcon className="w-6 h-6" />}
              color="amber"
            />
            <StatsCard
              label="Urgent"
              count={stats.urgent}
              icon={<AlertTriangleIcon className="w-6 h-6" />}
              color="red"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Status:</span>
            <div className="flex gap-1">
              {(['all', 'new', 'in_review', 'resolved'] as const).map((status) => {
                const isActive = statusFilter === status
                return (
                  <button
                    key={status}
                    onClick={() => onFilterChange?.(status, priorityFilter)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-lime-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {status === 'all' ? 'All' : status === 'in_review' ? 'In Review' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Priority:</span>
            <div className="flex gap-1">
              {(['all', 'urgent', 'standard'] as const).map((priority) => {
                const isActive = priorityFilter === priority
                return (
                  <button
                    key={priority}
                    onClick={() => onFilterChange?.(statusFilter, priority)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? priority === 'urgent'
                          ? 'bg-red-600 text-white'
                          : 'bg-lime-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-lime-200 dark:border-lime-800 border-t-lime-600 dark:border-t-lime-400 rounded-full animate-spin" />
          </div>
        ) : sortedCases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <InboxIcon className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-lg font-medium">No cases found</p>
            <p className="text-sm mt-1">
              {statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'The review queue is empty'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedCases.map((escalationCase) => (
              <CaseCard
                key={escalationCase.id}
                escalationCase={escalationCase}
                onSelect={() => onSelectCase?.(escalationCase.id)}
                onAssignToSelf={() => onAssignToSelf?.(escalationCase.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
