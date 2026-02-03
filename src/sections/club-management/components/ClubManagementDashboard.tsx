import type {
  ClubManagementDashboardProps,
  SuspiciousActivityAlert,
  AuditLogEntry,
  AlertSeverity,
  AuditAction,
} from '@/../product/sections/club-management/types'

// =============================================================================
// Design Tokens: lime (primary), sky (secondary), slate (neutral)
// Typography: Outfit (heading/body), JetBrains Mono (mono)
// =============================================================================

// Severity styles for alerts
const severityStyles: Record<AlertSeverity, { bg: string; text: string; dot: string; border: string }> = {
  high: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
    border: 'border-red-200 dark:border-red-800',
  },
  medium: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    border: 'border-amber-200 dark:border-amber-800',
  },
  low: {
    bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    text: 'text-sky-700 dark:text-sky-400',
    dot: 'bg-sky-500',
    border: 'border-sky-200 dark:border-sky-800',
  },
}

// Audit action labels for display
const auditActionLabels: Record<AuditAction, string> = {
  club_suspended: 'Club Suspended',
  club_unsuspended: 'Club Unsuspended',
  club_deleted: 'Club Deleted',
  club_ownership_transferred: 'Ownership Transferred',
  club_ownership_contacted: 'Owner Contacted',
  nonprofit_approved: 'Non-Profit Approved',
  nonprofit_rejected: 'Non-Profit Rejected',
  nonprofit_info_requested: 'Info Requested',
  override_created: 'Override Created',
  override_expired: 'Override Expired',
  override_removed: 'Override Removed',
  dispute_assigned: 'Dispute Assigned',
  dispute_resolved: 'Dispute Resolved',
  escalation_assigned: 'Escalation Assigned',
  escalation_resolved: 'Escalation Resolved',
  platform_warning_issued: 'Warning Issued',
  platform_suspension_issued: 'Suspension Issued',
  platform_ban_issued: 'Ban Issued',
  alert_resolved: 'Alert Resolved',
  rate_limit_exception_granted: 'Exception Granted',
  rate_limit_exception_revoked: 'Exception Revoked',
  rate_limit_config_updated: 'Config Updated',
}

// Audit action colors
const getAuditActionColor = (action: AuditAction): string => {
  if (action.includes('banned') || action.includes('ban') || action.includes('deleted') || action.includes('rejected')) {
    return 'text-red-600 dark:text-red-400'
  }
  if (action.includes('suspended') || action.includes('suspension') || action.includes('warning')) {
    return 'text-amber-600 dark:text-amber-400'
  }
  if (action.includes('approved') || action.includes('resolved') || action.includes('granted')) {
    return 'text-lime-600 dark:text-lime-400'
  }
  return 'text-sky-600 dark:text-sky-400'
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// =============================================================================
// Icons
// =============================================================================

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    </svg>
  )
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
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

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
    </svg>
  )
}

function UserGroupIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  )
}

function BellAlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
    </svg>
  )
}

function DocumentTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  )
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
    </svg>
  )
}

// =============================================================================
// Sub-Components
// =============================================================================

// Stat Card Component
interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  trend?: { value: number; label: string }
  variant?: 'default' | 'warning' | 'danger' | 'success'
  onClick?: () => void
}

function StatCard({ title, value, icon, trend, variant = 'default', onClick }: StatCardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    success: 'bg-lime-50 dark:bg-lime-900/20 border-lime-200 dark:border-lime-800',
  }

  const iconBgStyles = {
    default: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
    warning: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    success: 'bg-lime-100 dark:bg-lime-900/40 text-lime-600 dark:text-lime-400',
  }

  return (
    <button
      onClick={onClick}
      className={`group relative p-5 rounded-xl border ${variantStyles[variant]} hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-left w-full`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value.toLocaleString()}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className={trend.value >= 0 ? 'text-lime-600 dark:text-lime-400' : 'text-red-600 dark:text-red-400'}>
                {trend.value >= 0 ? '+' : ''}{trend.value}
              </span>{' '}
              {trend.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgStyles[variant]} transition-colors`}>
          {icon}
        </div>
      </div>
      <ArrowRightIcon className="absolute bottom-4 right-4 w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </button>
  )
}

// Quick Action Button
interface QuickActionProps {
  label: string
  icon: React.ReactNode
  badge?: number
  onClick?: () => void
  variant?: 'default' | 'warning' | 'danger'
}

function QuickAction({ label, icon, badge, onClick, variant = 'default' }: QuickActionProps) {
  const variantStyles = {
    default: 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700',
    warning: 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    danger: 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800',
  }

  const badgeStyles = {
    default: 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300',
    warning: 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-300',
    danger: 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-300',
  }

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border ${variantStyles[variant]} transition-all hover:scale-[1.02]`}
    >
      <span className="text-slate-600 dark:text-slate-400">{icon}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${badgeStyles[variant]}`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}

// Alert Card Component
interface AlertCardProps {
  alert: SuspiciousActivityAlert
  onInvestigate?: () => void
}

function AlertCard({ alert, onInvestigate }: AlertCardProps) {
  const severity = severityStyles[alert.severity]

  return (
    <div
      className={`p-4 rounded-xl border ${severity.border} ${severity.bg} hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onInvestigate}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${severity.text} ${severity.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`} />
              {alert.severity.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatRelativeTime(alert.detectedAt)}
            </span>
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-white truncate">
            {alert.title}
          </h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {alert.description}
          </p>
          {alert.userName && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              User: <span className="font-medium text-slate-700 dark:text-slate-300">{alert.userName}</span>
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onInvestigate?.()
          }}
          className="shrink-0 p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm hover:shadow transition-shadow"
        >
          <ArrowRightIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        </button>
      </div>
    </div>
  )
}

// Audit Log Row Component
interface AuditLogRowProps {
  entry: AuditLogEntry
  onViewTarget?: () => void
}

function AuditLogRow({ entry, onViewTarget }: AuditLogRowProps) {
  return (
    <div
      onClick={onViewTarget}
      className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors group"
    >
      <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {entry.adminName.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900 dark:text-white">
          <span className="font-medium">{entry.adminName}</span>{' '}
          <span className={getAuditActionColor(entry.action)}>
            {auditActionLabels[entry.action].toLowerCase()}
          </span>{' '}
          <span className="font-medium group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
            {entry.targetName}
          </span>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
          {entry.details}
        </p>
      </div>
      <div className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
        {formatRelativeTime(entry.timestamp)}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ClubManagementDashboard({
  stats,
  recentAuditLog,
  pendingAlerts,
  currentAdmin,
  onViewAllClubs,
  onViewNonProfitQueue,
  onViewDisputes,
  onViewEscalations,
  onViewAlerts,
  onViewAuditLog,
}: ClubManagementDashboardProps) {
  // Sort alerts by severity and date
  const sortedAlerts = [...pendingAlerts]
    .filter(a => a.status === 'pending' || a.status === 'investigating')
    .sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 }
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity]
      }
      return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    })
    .slice(0, 4)

  // Get urgent counts
  const urgentAlertsCount = pendingAlerts.filter(a => a.severity === 'high' && a.status === 'pending').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-lime-100 dark:bg-lime-900/30">
                  <ShieldCheckIcon className="w-6 h-6 text-lime-600 dark:text-lime-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Club Management
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Welcome back, <span className="font-medium text-slate-700 dark:text-slate-300">{currentAdmin.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Today's Date</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-white font-bold shadow-lg shadow-lime-500/25">
                {currentAdmin.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Clubs"
            value={stats.totalClubs}
            icon={<BuildingIcon className="w-6 h-6" />}
            trend={{ value: stats.clubsCreatedThisWeek, label: 'this week' }}
            onClick={onViewAllClubs}
          />
          <StatCard
            title="Pending Alerts"
            value={stats.pendingAlerts}
            icon={<BellAlertIcon className="w-6 h-6" />}
            variant={urgentAlertsCount > 0 ? 'danger' : stats.pendingAlerts > 0 ? 'warning' : 'default'}
            onClick={onViewAlerts}
          />
          <StatCard
            title="Open Escalations"
            value={stats.openEscalations}
            icon={<FireIcon className="w-6 h-6" />}
            variant={stats.openEscalations > 0 ? 'warning' : 'default'}
            onClick={onViewEscalations}
          />
          <StatCard
            title="Open Disputes"
            value={stats.openDisputes}
            icon={<ScaleIcon className="w-6 h-6" />}
            variant={stats.openDisputes > 0 ? 'warning' : 'default'}
            onClick={onViewDisputes}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active</p>
            <p className="mt-1 text-xl font-bold text-lime-600 dark:text-lime-400">{stats.activeClubs}</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Suspended</p>
            <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">{stats.suspendedClubs}</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Under Review</p>
            <p className="mt-1 text-xl font-bold text-sky-600 dark:text-sky-400">{stats.underReviewClubs}</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Flagged</p>
            <p className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">{stats.flaggedClubs}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-slate-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <QuickAction
              label="All Clubs"
              icon={<BuildingIcon className="w-5 h-5" />}
              onClick={onViewAllClubs}
            />
            <QuickAction
              label="Non-Profit Queue"
              icon={<DocumentTextIcon className="w-5 h-5" />}
              badge={stats.pendingNonProfitApplications}
              variant={stats.pendingNonProfitApplications > 0 ? 'warning' : 'default'}
              onClick={onViewNonProfitQueue}
            />
            <QuickAction
              label="Escalations"
              icon={<FireIcon className="w-5 h-5" />}
              badge={stats.openEscalations}
              variant={stats.openEscalations > 0 ? 'danger' : 'default'}
              onClick={onViewEscalations}
            />
            <QuickAction
              label="Disputes"
              icon={<ScaleIcon className="w-5 h-5" />}
              badge={stats.openDisputes}
              onClick={onViewDisputes}
            />
            <QuickAction
              label="Alerts"
              icon={<ExclamationTriangleIcon className="w-5 h-5" />}
              badge={stats.pendingAlerts}
              variant={urgentAlertsCount > 0 ? 'danger' : 'default'}
              onClick={onViewAlerts}
            />
            <QuickAction
              label="Audit Log"
              icon={<ChartBarIcon className="w-5 h-5" />}
              onClick={onViewAuditLog}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Pending Alerts - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <BellAlertIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">
                      Pending Alerts
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {urgentAlertsCount > 0 ? `${urgentAlertsCount} urgent` : 'No urgent alerts'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onViewAlerts}
                  className="text-sm font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 transition-colors"
                >
                  View All →
                </button>
              </div>
              <div className="p-4">
                {sortedAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mb-4">
                      <ShieldCheckIcon className="w-8 h-8 text-lime-600 dark:text-lime-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">All clear!</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">No pending alerts to review</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedAlerts.map(alert => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onInvestigate={() => onViewAlerts?.()}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                    <ChartBarIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Recent Activity
                  </h2>
                </div>
                <button
                  onClick={onViewAuditLog}
                  className="text-sm font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 transition-colors"
                >
                  View All →
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {recentAuditLog.slice(0, 6).map(entry => (
                  <AuditLogRow
                    key={entry.id}
                    entry={entry}
                    onViewTarget={onViewAuditLog}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-lime-100 dark:bg-lime-900/30">
                <DocumentTextIcon className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Non-Profit Applications</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.pendingNonProfitApplications}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pending review</p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                <ChartBarIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Overrides</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.activeOverrides}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tier overrides in effect</p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <BuildingIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">New This Month</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.clubsCreatedThisMonth}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Clubs created</p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <UserGroupIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">New This Week</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.clubsCreatedThisWeek}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Clubs created</p>
          </div>
        </div>
      </div>
    </div>
  )
}
