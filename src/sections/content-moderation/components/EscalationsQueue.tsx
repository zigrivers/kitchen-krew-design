import { useState } from 'react'
import type {
  EscalationsQueueProps,
  PlatformEscalation,
  EscalationStatus,
  EscalationSeverity,
  EscalationCategory,
  Moderator,
} from '@/../product/sections/content-moderation/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface SeverityBadgeProps {
  severity: EscalationSeverity
}

function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    critical: 'bg-red-500 text-white animate-pulse',
    high: 'bg-orange-500 text-white',
    medium: 'bg-amber-500 text-white',
  }

  const icons = {
    critical: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    high: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    medium: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded ${styles[severity]}`}>
      {icons[severity]}
      <span className="uppercase tracking-wider">{severity}</span>
    </span>
  )
}

interface StatusBadgeProps {
  status: EscalationStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    new: 'bg-lime-500/15 text-lime-700 dark:text-lime-400 border border-lime-500/30',
    in_review: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
    resolved: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30',
  }

  const labels = {
    new: 'New',
    in_review: 'In Review',
    resolved: 'Resolved',
  }

  return <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[status]}`}>{labels[status]}</span>
}

interface CategoryBadgeProps {
  category: EscalationCategory
}

function CategoryBadge({ category }: CategoryBadgeProps) {
  const labels: Record<EscalationCategory, string> = {
    severe_harassment: 'Severe Harassment',
    threats_violence: 'Threats/Violence',
    fraud_impersonation: 'Fraud',
    illegal_activity: 'Illegal Activity',
    pattern_abuse: 'Pattern Abuse',
  }

  const colors: Record<EscalationCategory, string> = {
    severe_harassment: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300',
    threats_violence: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
    fraud_impersonation: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    illegal_activity: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300',
    pattern_abuse: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300',
  }

  return <span className={`px-2 py-0.5 text-xs font-medium rounded ${colors[category]}`}>{labels[category]}</span>
}

interface CrossClubIndicatorProps {
  count: number
}

function CrossClubIndicator({ count }: CrossClubIndicatorProps) {
  if (count <= 1) return null

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded"
      title={`Active in ${count} clubs`}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {count} clubs
    </span>
  )
}

interface EscalationCardProps {
  escalation: PlatformEscalation
  onView: () => void
  onAssign: (moderatorId: string) => void
  moderators: Moderator[]
}

function EscalationCard({ escalation, onView, onAssign, moderators }: EscalationCardProps) {
  const [showAssignMenu, setShowAssignMenu] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (hours < 48) return 'Yesterday'
    return `${Math.floor(hours / 24)}d ago`
  }

  const severityBorder = {
    critical: 'border-l-4 border-l-red-500',
    high: 'border-l-4 border-l-orange-500',
    medium: 'border-l-4 border-l-amber-500',
  }

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all ${severityBorder[escalation.severity]}`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SeverityBadge severity={escalation.severity} />
              <StatusBadge status={escalation.status} />
            </div>
            <CategoryBadge category={escalation.category} />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{getTimeAgo(escalation.createdAt)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-4">
        {/* Reported User */}
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Reported User</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold text-sm">
              {escalation.reportedUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{escalation.reportedUser.name}</span>
                <CrossClubIndicator count={escalation.reportedUser.clubs.length} />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {escalation.reportedUser.priorPlatformWarnings > 0 && (
                  <span className="text-amber-600 dark:text-amber-400">{escalation.reportedUser.priorPlatformWarnings} warning(s)</span>
                )}
                {escalation.reportedUser.priorPlatformSuspensions > 0 && (
                  <span className="text-red-600 dark:text-red-400">{escalation.reportedUser.priorPlatformSuspensions} suspension(s)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Escalating Club */}
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Escalated By</div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm text-slate-700 dark:text-slate-300">{escalation.escalatingClub.name}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Admin: {escalation.escalatingClub.adminName}</p>
        </div>

        {/* Description */}
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Summary</div>
          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">{escalation.description}</p>
        </div>

        {/* Club Action */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Club Action Taken</div>
          <p className="text-sm text-slate-700 dark:text-slate-300">{escalation.clubActionTaken}</p>
        </div>

        {/* Cross-Club Activity */}
        {escalation.crossClubActivity.length > 0 && (
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cross-Club Activity</div>
            <div className="space-y-2">
              {escalation.crossClubActivity.slice(0, 3).map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{activity.club}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 text-xs rounded ${
                        activity.status === 'banned'
                          ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                          : activity.status === 'suspended'
                            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                            : 'bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-300'
                      }`}
                    >
                      {activity.status.replace(/_/g, ' ')}
                    </span>
                    {activity.incidents > 0 && <span className="text-xs text-slate-500">{activity.incidents} incidents</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Count */}
        {escalation.evidence.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>{escalation.evidence.length} attachment(s)</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        {/* Assigned To */}
        <div className="relative">
          {escalation.assignedTo ? (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Assigned to <span className="font-medium text-slate-900 dark:text-white">{escalation.assignedTo}</span>
            </span>
          ) : (
            <>
              <button
                onClick={() => setShowAssignMenu(!showAssignMenu)}
                className="text-sm font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300"
              >
                Assign moderator
              </button>
              {showAssignMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowAssignMenu(false)} />
                  <div className="absolute bottom-full left-0 mb-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1">
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
                        <span className="text-slate-400 ml-1">({mod.stats.reportsAssigned} assigned)</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* View Button */}
        <button
          onClick={onView}
          className="px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>Review</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function EscalationsQueue({
  escalations,
  moderators,
  categories,
  isLoading,
  totalCount,
  onViewEscalation,
  onAssign,
  onFilterChange,
  onLoadMore,
  onRefresh,
}: EscalationsQueueProps) {
  const [activeStatus, setActiveStatus] = useState<EscalationStatus | 'all'>('all')
  const [activeSeverity, setActiveSeverity] = useState<EscalationSeverity | 'all'>('all')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Filter escalations
  const filteredEscalations = escalations.filter((esc) => {
    if (activeStatus !== 'all' && esc.status !== activeStatus) return false
    if (activeSeverity !== 'all' && esc.severity !== activeSeverity) return false
    if (activeCategory !== 'all' && esc.category !== activeCategory) return false
    return true
  })

  // Calculate counts
  const statusCounts = {
    all: escalations.length,
    new: escalations.filter((e) => e.status === 'new').length,
    in_review: escalations.filter((e) => e.status === 'in_review').length,
    resolved: escalations.filter((e) => e.status === 'resolved').length,
  }

  const severityCounts = {
    critical: escalations.filter((e) => e.severity === 'critical').length,
    high: escalations.filter((e) => e.severity === 'high').length,
    medium: escalations.filter((e) => e.severity === 'medium').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 lg:px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Platform Escalations</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {totalCount || filteredEscalations.length} escalations from club admins
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

          {/* Severity Summary */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-bold">{severityCounts.critical}</span> Critical
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-bold">{severityCounts.high}</span> High
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-bold">{severityCounts.medium}</span> Medium
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['all', 'new', 'in_review', 'resolved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                    activeStatus === status
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'in_review' ? 'In Review' : status.charAt(0).toUpperCase() + status.slice(1)}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeStatus === status
                        ? 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {statusCounts[status]}
                  </span>
                </button>
              ))}
            </div>

            {/* Severity Filter */}
            <select
              value={activeSeverity}
              onChange={(e) => setActiveSeverity(e.target.value as EscalationSeverity | 'all')}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
            </select>

            {/* Category Filter */}
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Escalation Cards */}
      <div className="px-4 lg:px-6 py-6">
        {/* Loading */}
        {isLoading && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading escalations...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredEscalations.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime-100 dark:bg-lime-500/20 mb-4">
              <svg className="w-8 h-8 text-lime-600 dark:text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No escalations found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {activeStatus !== 'all' || activeSeverity !== 'all' || activeCategory !== 'all'
                ? 'Try adjusting your filters.'
                : 'Club admin escalations will appear here.'}
            </p>
          </div>
        )}

        {/* Escalation Cards Grid */}
        {!isLoading && filteredEscalations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEscalations.map((escalation) => (
              <EscalationCard
                key={escalation.id}
                escalation={escalation}
                onView={() => onViewEscalation?.(escalation.id)}
                onAssign={(modId) => onAssign?.(escalation.id, modId)}
                moderators={moderators}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && filteredEscalations.length > 0 && onLoadMore && (
          <div className="mt-6 text-center">
            <button
              onClick={onLoadMore}
              className="px-6 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              Load more escalations
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
