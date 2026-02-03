import { useState } from 'react'
import type {
  ReportsQueueProps,
  UserReport,
  ReportStatus,
  ReportPriority,
  ReportCategory,
  Moderator,
} from '@/../product/sections/content-moderation/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface StatusTabsProps {
  activeStatus: ReportStatus | 'all'
  counts: { all: number; new: number; in_review: number; resolved: number; dismissed: number }
  onChange: (status: ReportStatus | 'all') => void
}

function StatusTabs({ activeStatus, counts, onChange }: StatusTabsProps) {
  const tabs: { value: ReportStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'in_review', label: 'In Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'dismissed', label: 'Dismissed' },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
      {tabs.map((tab) => {
        const count = counts[tab.value]
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
              activeStatus === tab.value
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeStatus === tab.value
                  ? 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

interface PriorityBadgeProps {
  priority: ReportPriority
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
  const styles = {
    urgent: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 animate-pulse',
    high: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    medium: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    low: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
  }

  const icons = {
    urgent: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    high: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M5 15l7-7 7 7" />
      </svg>
    ),
    medium: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M5 12h14" />
      </svg>
    ),
    low: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M19 9l-7 7-7-7" />
      </svg>
    ),
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${styles[priority]}`}>
      {icons[priority]}
      <span className="capitalize">{priority}</span>
    </span>
  )
}

interface SlaIndicatorProps {
  deadline: string
  status: ReportStatus
}

function SlaIndicator({ deadline, status }: SlaIndicatorProps) {
  if (status === 'resolved' || status === 'dismissed') {
    return null
  }

  const deadlineDate = new Date(deadline)
  const now = new Date()
  const hoursRemaining = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  let color = 'text-lime-500 bg-lime-500/10'
  let label = `${Math.round(hoursRemaining)}h`

  if (hoursRemaining < 0) {
    color = 'text-red-500 bg-red-500/10 font-semibold'
    label = `${Math.abs(Math.round(hoursRemaining))}h overdue`
  } else if (hoursRemaining < 2) {
    color = 'text-red-500 bg-red-500/10'
  } else if (hoursRemaining < 8) {
    color = 'text-amber-500 bg-amber-500/10'
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md ${color}`}>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {label}
    </span>
  )
}

interface CategoryBadgeProps {
  category: ReportCategory
}

function CategoryBadge({ category }: CategoryBadgeProps) {
  const labels: Record<ReportCategory, string> = {
    harassment: 'Harassment',
    cheating: 'Cheating',
    inappropriate_content: 'Inappropriate',
    spam: 'Spam',
    impersonation: 'Impersonation',
    other: 'Other',
  }

  const colors: Record<ReportCategory, string> = {
    harassment: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300',
    cheating: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300',
    inappropriate_content: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300',
    spam: 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300',
    impersonation: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',
    other: 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300',
  }

  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[category]}`}>{labels[category]}</span>
}

interface ReporterReputationProps {
  reputation: 'trusted' | 'good' | 'fair' | 'poor'
}

function ReporterReputation({ reputation }: ReporterReputationProps) {
  const styles = {
    trusted: 'text-lime-600 dark:text-lime-400',
    good: 'text-sky-600 dark:text-sky-400',
    fair: 'text-amber-600 dark:text-amber-400',
    poor: 'text-red-600 dark:text-red-400',
  }

  const icons = {
    trusted: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    good: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    fair: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    poor: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${styles[reputation]}`} title={`Reporter: ${reputation}`}>
      {icons[reputation]}
    </span>
  )
}

interface ReportRowProps {
  report: UserReport
  isSelected: boolean
  onSelect: () => void
  onView: () => void
  onAssign: (moderatorId: string) => void
  onAction: (action: 'warn' | 'suspend' | 'ban' | 'dismiss') => void
  moderators: Moderator[]
}

function ReportRow({ report, isSelected, onSelect, onView, onAssign, onAction, moderators }: ReportRowProps) {
  const [showAssignMenu, setShowAssignMenu] = useState(false)
  const [showActionMenu, setShowActionMenu] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (hours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const statusDot = {
    new: 'bg-lime-500',
    in_review: 'bg-amber-500',
    resolved: 'bg-slate-400',
    dismissed: 'bg-slate-300',
  }

  return (
    <div
      className={`group relative flex items-center gap-4 px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
        isSelected ? 'bg-lime-500/5' : ''
      }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500"
      />

      {/* Status Dot */}
      <div className={`w-2 h-2 rounded-full ${statusDot[report.status]}`} />

      {/* Priority & SLA */}
      <div className="w-32 flex items-center gap-2">
        <PriorityBadge priority={report.priority} />
        <SlaIndicator deadline={report.slaDeadline} status={report.status} />
      </div>

      {/* Category */}
      <div className="w-28">
        <CategoryBadge category={report.category} />
      </div>

      {/* Reported User */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onView}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{report.reportedUser.name}</span>
          {report.reportedUser.priorWarnings > 0 && (
            <span
              className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded"
              title={`${report.reportedUser.priorWarnings} prior warning(s)`}
            >
              {report.reportedUser.priorWarnings}W
            </span>
          )}
          {report.reportedUser.priorSuspensions > 0 && (
            <span
              className="px-1.5 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded"
              title={`${report.reportedUser.priorSuspensions} prior suspension(s)`}
            >
              {report.reportedUser.priorSuspensions}S
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{report.description}</div>
      </div>

      {/* Reporter */}
      <div className="hidden lg:flex items-center gap-2 w-32">
        <span className="text-sm text-slate-600 dark:text-slate-400 truncate">{report.reporter.name}</span>
        <ReporterReputation reputation={report.reporter.reputation} />
      </div>

      {/* Assigned To */}
      <div className="hidden md:block w-28 relative">
        {report.assignedTo ? (
          <span className="text-sm text-slate-600 dark:text-slate-400">{report.assignedTo}</span>
        ) : (
          <div>
            <button
              onClick={() => setShowAssignMenu(!showAssignMenu)}
              className="text-xs text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 font-medium"
            >
              Assign
            </button>
            {showAssignMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAssignMenu(false)} />
                <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1">
                  {moderators.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        onAssign(mod.id)
                        setShowAssignMenu(false)
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      {mod.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Time */}
      <div className="hidden sm:block w-20 text-xs text-slate-500 dark:text-slate-400 text-right">{formatDate(report.createdAt)}</div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button onClick={onView} className="p-2 text-slate-400 hover:text-lime-500 transition-colors" title="View details">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <div className="relative">
          <button
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title="Take action"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          {showActionMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(false)} />
              <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1">
                <button
                  onClick={() => {
                    onAction('warn')
                    setShowActionMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Warn
                </button>
                <button
                  onClick={() => {
                    onAction('suspend')
                    setShowActionMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Suspend
                </button>
                <button
                  onClick={() => {
                    onAction('ban')
                    setShowActionMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Ban
                </button>
                <hr className="my-1 border-slate-100 dark:border-slate-700" />
                <button
                  onClick={() => {
                    onAction('dismiss')
                    setShowActionMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Dismiss
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ReportsQueue({
  reports,
  moderators,
  categories,
  priorities,
  isLoading,
  totalCount,
  onViewReport,
  onAssign,
  onTakeAction,
  onFilterChange,
  onLoadMore,
  onRefresh,
}: ReportsQueueProps) {
  const [activeStatus, setActiveStatus] = useState<ReportStatus | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set())

  // Filter reports
  const filteredReports = reports.filter((report) => {
    if (activeStatus !== 'all' && report.status !== activeStatus) return false
    if (selectedCategory !== 'all' && report.category !== selectedCategory) return false
    if (selectedPriority !== 'all' && report.priority !== selectedPriority) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        report.reportedUser.name.toLowerCase().includes(q) ||
        report.reporter.name.toLowerCase().includes(q) ||
        report.description.toLowerCase().includes(q) ||
        report.id.toLowerCase().includes(q)
      )
    }
    return true
  })

  // Calculate status counts
  const statusCounts = {
    all: reports.length,
    new: reports.filter((r) => r.status === 'new').length,
    in_review: reports.filter((r) => r.status === 'in_review').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    dismissed: reports.filter((r) => r.status === 'dismissed').length,
  }

  const toggleSelectAll = () => {
    if (selectedReports.size === filteredReports.length) {
      setSelectedReports(new Set())
    } else {
      setSelectedReports(new Set(filteredReports.map((r) => r.id)))
    }
  }

  const toggleSelectReport = (id: string) => {
    const newSet = new Set(selectedReports)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedReports(newSet)
  }

  const handleFilterChange = () => {
    onFilterChange?.({
      status: activeStatus,
      category: selectedCategory,
      priority: selectedPriority,
      search: searchQuery,
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 lg:px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Reports Queue</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {totalCount || filteredReports.length} reports • {statusCounts.new} new • {statusCounts.in_review} in review
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onRefresh}
                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="mb-4">
            <StatusTabs activeStatus={activeStatus} counts={statusCounts} onChange={setActiveStatus} />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500"
            >
              <option value="all">All Priorities</option>
              {priorities.map((pri) => (
                <option key={pri.value} value={pri.value}>
                  {pri.label} ({pri.slaHours}h SLA)
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedReports.size > 0 && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-lime-500/10 border border-lime-500/20 rounded-lg">
              <span className="text-sm font-medium text-lime-700 dark:text-lime-400">{selectedReports.size} selected</span>
              <div className="flex-1" />
              <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Assign
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
                Warn All
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Dismiss All
              </button>
              <button onClick={() => setSelectedReports(new Set())} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Report List */}
      <div>
        {/* Column Headers */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <input
            type="checkbox"
            checked={selectedReports.size === filteredReports.length && filteredReports.length > 0}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500"
          />
          <div className="w-2" />
          <div className="w-32">Priority / SLA</div>
          <div className="w-28">Category</div>
          <div className="flex-1">Reported User</div>
          <div className="hidden lg:block w-32">Reporter</div>
          <div className="hidden md:block w-28">Assigned</div>
          <div className="hidden sm:block w-20 text-right">Created</div>
          <div className="w-20">Actions</div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading reports...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No reports found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all'
                ? 'Try adjusting your filters.'
                : 'Reports will appear here when users submit them.'}
            </p>
          </div>
        )}

        {/* Report Rows */}
        {!isLoading &&
          filteredReports.map((report) => (
            <ReportRow
              key={report.id}
              report={report}
              isSelected={selectedReports.has(report.id)}
              onSelect={() => toggleSelectReport(report.id)}
              onView={() => onViewReport?.(report.id)}
              onAssign={(modId) => onAssign?.(report.id, modId)}
              onAction={(action) => onTakeAction?.(report.id, action)}
              moderators={moderators}
            />
          ))}

        {/* Load More */}
        {!isLoading && filteredReports.length > 0 && onLoadMore && (
          <div className="p-4 text-center">
            <button
              onClick={onLoadMore}
              className="px-6 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Load more reports
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
