import type {
  GDPRComplianceProps,
  GDPRRequest,
  GDPRRequestStatus,
  GDPRRequestType,
} from '@/../product/sections/user-management/types'

// Status styles
const statusStyles: Record<GDPRRequestStatus, { bg: string; text: string; label: string }> = {
  pending: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'Pending',
  },
  processing: {
    bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    text: 'text-sky-700 dark:text-sky-400',
    label: 'Processing',
  },
  completed: {
    bg: 'bg-lime-500/10 dark:bg-lime-500/20',
    text: 'text-lime-700 dark:text-lime-400',
    label: 'Completed',
  },
  cancelled: {
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    text: 'text-slate-700 dark:text-slate-400',
    label: 'Cancelled',
  },
}

// Type styles
const typeStyles: Record<GDPRRequestType, { bg: string; text: string; icon: string }> = {
  export: {
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    text: 'text-sky-700 dark:text-sky-400',
    icon: '📥',
  },
  deletion: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    icon: '🗑️',
  },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getDaysRemaining(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

// Icons
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function DocumentDownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ExclamationCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  )
}

// Stats Card
interface StatsCardProps {
  label: string
  count: number
  icon: React.ReactNode
  color: 'lime' | 'amber' | 'sky' | 'red' | 'slate'
}

function StatsCard({ label, count, icon, color }: StatsCardProps) {
  const colorStyles = {
    lime: 'bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-800',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    sky: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    slate: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700',
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

// Request Row Component
interface RequestRowProps {
  request: GDPRRequest
  onView?: () => void
  onGenerateExport?: () => void
  onProcessDeletion?: () => void
  onCancelDeletion?: () => void
}

function RequestRow({
  request,
  onView,
  onGenerateExport,
  onProcessDeletion,
  onCancelDeletion,
}: RequestRowProps) {
  const status = statusStyles[request.status]
  const type = typeStyles[request.requestType]
  const daysRemaining = request.gracePeriodEnds ? getDaysRemaining(request.gracePeriodEnds) : null
  const isUrgent = daysRemaining !== null && daysRemaining <= 3 && request.status === 'pending'

  return (
    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      {/* User */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{request.playerName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{request.playerEmail}</p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="py-4 px-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${type.bg}`}>
          <span className="text-lg">{type.icon}</span>
          <span className={`text-sm font-medium ${type.text}`}>
            {request.requestType === 'export' ? 'Data Export' : 'Account Deletion'}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
          {request.status === 'completed' && <CheckCircleIcon className="w-3.5 h-3.5" />}
          {request.status === 'pending' && <ClockIcon className="w-3.5 h-3.5" />}
          {request.status === 'processing' && <ClockIcon className="w-3.5 h-3.5 animate-spin" />}
          {request.status === 'cancelled' && <XCircleIcon className="w-3.5 h-3.5" />}
          {status.label}
        </span>
      </td>

      {/* Requested */}
      <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
        {formatDate(request.requestedAt)}
      </td>

      {/* Deadline / Completed */}
      <td className="py-4 px-4">
        {request.status === 'completed' && request.processedAt ? (
          <span className="text-sm text-lime-600 dark:text-lime-400">
            {formatDate(request.processedAt)}
          </span>
        ) : request.gracePeriodEnds && request.requestType === 'deletion' ? (
          <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
            {isUrgent && <ExclamationCircleIcon className="w-4 h-4" />}
            <span className="text-sm">
              {daysRemaining !== null && daysRemaining > 0
                ? `${daysRemaining} days left`
                : daysRemaining === 0
                ? 'Today'
                : 'Overdue'}
            </span>
          </div>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onView}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="View details"
          >
            <UserIcon className="w-4 h-4" />
          </button>

          {request.status === 'pending' && request.requestType === 'export' && (
            <button
              onClick={onGenerateExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-lime-700 dark:text-lime-400 bg-lime-100 dark:bg-lime-900/30 hover:bg-lime-200 dark:hover:bg-lime-900/50 rounded-lg transition-colors"
            >
              <DocumentDownloadIcon className="w-4 h-4" />
              Generate
            </button>
          )}

          {request.status === 'pending' && request.requestType === 'deletion' && (
            <>
              <button
                onClick={onProcessDeletion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Process
              </button>
              <button
                onClick={onCancelDeletion}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {request.status === 'completed' && request.dataExportUrl && (
            <a
              href={request.dataExportUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 hover:bg-sky-200 dark:hover:bg-sky-900/50 rounded-lg transition-colors"
            >
              <DocumentDownloadIcon className="w-4 h-4" />
              Download
            </a>
          )}
        </div>
      </td>
    </tr>
  )
}

// Main Component
export function GDPRCompliance({
  requests,
  statusFilter,
  typeFilter,
  isLoading,
  onFilterChange,
  onViewRequest,
  onGenerateExport,
  onProcessDeletion,
  onCancelDeletion,
}: GDPRComplianceProps) {
  // Calculate stats
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    exports: requests.filter((r) => r.requestType === 'export').length,
    deletions: requests.filter((r) => r.requestType === 'deletion').length,
    urgent: requests.filter(
      (r) =>
        r.status === 'pending' &&
        r.gracePeriodEnds &&
        getDaysRemaining(r.gracePeriodEnds) <= 3
    ).length,
  }

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (typeFilter !== 'all' && r.requestType !== typeFilter) return false
    return true
  })

  // Sort: pending first, then by date (newest first)
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    // Pending first
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (b.status === 'pending' && a.status !== 'pending') return 1
    // Then by date
    return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 text-lime-600 dark:text-lime-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                GDPR Compliance
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Data export and deletion requests
              </p>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl">
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-sky-900 dark:text-sky-300">Compliance Reminder</p>
                <p className="text-sky-700 dark:text-sky-400 mt-1">
                  GDPR/CCPA requires data export requests to be processed within 30 days.
                  Deletion requests have a 14-day grace period for user cancellation.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
            <StatsCard
              label="Total"
              count={stats.total}
              icon={<InboxIcon className="w-6 h-6" />}
              color="slate"
            />
            <StatsCard
              label="Pending"
              count={stats.pending}
              icon={<ClockIcon className="w-6 h-6" />}
              color="amber"
            />
            <StatsCard
              label="Exports"
              count={stats.exports}
              icon={<DocumentDownloadIcon className="w-6 h-6" />}
              color="sky"
            />
            <StatsCard
              label="Deletions"
              count={stats.deletions}
              icon={<TrashIcon className="w-6 h-6" />}
              color="red"
            />
            {stats.urgent > 0 && (
              <StatsCard
                label="Urgent"
                count={stats.urgent}
                icon={<ExclamationCircleIcon className="w-6 h-6" />}
                color="red"
              />
            )}
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
              {(['all', 'pending', 'processing', 'completed', 'cancelled'] as const).map((status) => {
                const isActive = statusFilter === status
                return (
                  <button
                    key={status}
                    onClick={() => onFilterChange?.(status, typeFilter)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-lime-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Type:</span>
            <div className="flex gap-1">
              {(['all', 'export', 'deletion'] as const).map((type) => {
                const isActive = typeFilter === type
                return (
                  <button
                    key={type}
                    onClick={() => onFilterChange?.(statusFilter, type)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? type === 'deletion'
                          ? 'bg-red-600 text-white'
                          : type === 'export'
                          ? 'bg-sky-600 text-white'
                          : 'bg-lime-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'export' ? 'Export' : 'Deletion'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-lime-200 dark:border-lime-800 border-t-lime-600 dark:border-t-lime-400 rounded-full animate-spin" />
            </div>
          ) : sortedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
              <ShieldCheckIcon className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-lg font-medium">No requests found</p>
              <p className="text-sm mt-1">
                {statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No GDPR requests have been submitted'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      User
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Request Type
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Requested
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Deadline
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sortedRequests.map((request) => (
                    <RequestRow
                      key={request.id}
                      request={request}
                      onView={() => onViewRequest?.(request.id)}
                      onGenerateExport={() => onGenerateExport?.(request.id)}
                      onProcessDeletion={() => onProcessDeletion?.(request.id)}
                      onCancelDeletion={() => onCancelDeletion?.(request.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Legal Note */}
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            All GDPR/CCPA actions are logged for compliance audit. Data exports are encrypted and links expire after 7 days.
            Deletion requests anonymize match history and preserve aggregate statistics.
          </p>
        </div>
      </div>
    </div>
  )
}
