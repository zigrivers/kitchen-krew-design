import { useState } from 'react'
import type {
  ModerationDashboardProps,
  ReportCategory,
  ReportPriority,
  EscalationCategory,
  UserReport,
  Moderator,
} from '@/../product/sections/content-moderation/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface MetricCardProps {
  label: string
  value: number | string
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  color: 'lime' | 'sky' | 'amber' | 'red' | 'slate'
  onClick?: () => void
}

function MetricCard({ label, value, change, changeLabel, icon, color, onClick }: MetricCardProps) {
  const colorStyles = {
    lime: 'bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  }

  const iconBgStyles = {
    lime: 'bg-lime-500/20',
    sky: 'bg-sky-500/20',
    amber: 'bg-amber-500/20',
    red: 'bg-red-500/20',
    slate: 'bg-slate-500/20',
  }

  return (
    <button
      onClick={onClick}
      className={`group relative p-5 rounded-xl border ${colorStyles[color]} transition-all hover:scale-[1.02] hover:shadow-lg text-left w-full`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${iconBgStyles[color]}`}>{icon}</div>
        {change !== undefined && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              change > 0
                ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                : change < 0
                  ? 'bg-lime-500/15 text-lime-600 dark:text-lime-400'
                  : 'bg-slate-500/15 text-slate-500'
            }`}
          >
            {change > 0 ? '+' : ''}
            {change}% {changeLabel}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
      </div>
      <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-current opacity-20 transition-all" />
    </button>
  )
}

interface PriorityBreakdownProps {
  data: Record<ReportPriority, number>
}

function PriorityBreakdown({ data }: PriorityBreakdownProps) {
  const priorities: { key: ReportPriority; label: string; color: string }[] = [
    { key: 'urgent', label: 'Urgent', color: 'bg-red-500' },
    { key: 'high', label: 'High', color: 'bg-amber-500' },
    { key: 'medium', label: 'Medium', color: 'bg-sky-500' },
    { key: 'low', label: 'Low', color: 'bg-slate-400' },
  ]

  const total = Object.values(data).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">By Priority</h4>
      <div className="h-3 flex rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {priorities.map(({ key, color }) => {
          const width = total > 0 ? (data[key] / total) * 100 : 0
          return width > 0 ? <div key={key} className={`${color} transition-all`} style={{ width: `${width}%` }} /> : null
        })}
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {priorities.map(({ key, label, color }) => (
          <div key={key}>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{data[key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface CategoryBreakdownProps {
  data: Record<ReportCategory, number>
}

function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const categories: { key: ReportCategory; label: string }[] = [
    { key: 'harassment', label: 'Harassment' },
    { key: 'cheating', label: 'Cheating' },
    { key: 'inappropriate_content', label: 'Inappropriate' },
    { key: 'spam', label: 'Spam' },
    { key: 'impersonation', label: 'Impersonation' },
    { key: 'other', label: 'Other' },
  ]

  const maxValue = Math.max(...Object.values(data))

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">By Category</h4>
      <div className="space-y-2">
        {categories.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 w-24 truncate">{label}</span>
            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-lime-500 to-lime-400 rounded-full transition-all"
                style={{ width: maxValue > 0 ? `${(data[key] / maxValue) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-8 text-right">{data[key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface EscalationBreakdownProps {
  data: Record<EscalationCategory, number>
}

function EscalationBreakdown({ data }: EscalationBreakdownProps) {
  const categories: { key: EscalationCategory; label: string; color: string }[] = [
    { key: 'severe_harassment', label: 'Severe Harassment', color: 'bg-red-500' },
    { key: 'threats_violence', label: 'Threats/Violence', color: 'bg-rose-500' },
    { key: 'fraud_impersonation', label: 'Fraud', color: 'bg-amber-500' },
    { key: 'illegal_activity', label: 'Illegal Activity', color: 'bg-purple-500' },
    { key: 'pattern_abuse', label: 'Pattern Abuse', color: 'bg-orange-500' },
  ]

  const total = Object.values(data).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Escalation Categories</h4>
      <div className="space-y-2">
        {categories.map(({ key, label, color }) => {
          const count = data[key] || 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{pct}%</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white w-6 text-right">{count}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface SlaGaugeProps {
  complianceRate: number
  avgFirstResponse: number
  avgResolution: number
  overdueCount: number
}

function SlaGauge({ complianceRate, avgFirstResponse, avgResolution, overdueCount }: SlaGaugeProps) {
  const getGaugeColor = (rate: number) => {
    if (rate >= 90) return 'text-lime-500'
    if (rate >= 70) return 'text-amber-500'
    return 'text-red-500'
  }

  const circumference = 2 * Math.PI * 45
  const progress = (complianceRate / 100) * circumference

  return (
    <div className="flex items-center gap-6">
      {/* Gauge */}
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className={`${getGaugeColor(complianceRate)} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className={`text-2xl font-bold ${getGaugeColor(complianceRate)}`}>{complianceRate}%</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">SLA</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Avg First Response</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{avgFirstResponse}h</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Avg Resolution</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{avgResolution}h</div>
        </div>
        {overdueCount > 0 && (
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{overdueCount} overdue</span>
          </div>
        )}
      </div>
    </div>
  )
}

interface ModeratorCardProps {
  moderator: Moderator
  onView?: () => void
}

function ModeratorCard({ moderator, onView }: ModeratorCardProps) {
  const getWorkloadColor = (assigned: number) => {
    if (assigned >= 10) return 'text-red-500'
    if (assigned >= 5) return 'text-amber-500'
    return 'text-lime-500'
  }

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      onClick={onView}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-white font-semibold text-sm">
        {moderator.name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{moderator.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{moderator.role.replace(/_/g, ' ')}</div>
      </div>
      <div className="text-right">
        <div className={`text-lg font-bold ${getWorkloadColor(moderator.stats.reportsAssigned)}`}>{moderator.stats.reportsAssigned}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">assigned</div>
      </div>
    </div>
  )
}

interface RecentReportRowProps {
  report: UserReport
  onView?: () => void
}

function RecentReportRow({ report, onView }: RecentReportRowProps) {
  const priorityStyles = {
    urgent: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
    high: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    medium: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    low: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
  }

  const statusStyles = {
    new: 'bg-lime-500',
    in_review: 'bg-amber-500',
    resolved: 'bg-slate-400',
    dismissed: 'bg-slate-300',
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
      onClick={onView}
    >
      <div className={`w-2 h-2 rounded-full ${statusStyles[report.status]}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{report.reportedUser.name}</span>
          <span className={`px-1.5 py-0.5 text-xs font-medium rounded border ${priorityStyles[report.priority]}`}>
            {report.priority}
          </span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
          {report.category.replace(/_/g, ' ')} • {formatTime(report.createdAt)}
        </div>
      </div>
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

interface TrendChartProps {
  data: number[]
  label: string
}

function TrendChart({ data, label }: TrendChartProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 80 - 10
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <svg className="w-full h-12" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} className="text-lime-500" />
        {data.map((_, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - ((data[i] - min) / range) * 80 - 10
          return <circle key={i} cx={x} cy={y} r="2" className="fill-lime-500" />
        })}
      </svg>
      <div className="flex justify-between text-xs text-slate-400">
        <span>7 days ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ModerationDashboard({
  metrics,
  moderators,
  recentReports,
  selectedPeriod,
  isLoading,
  onPeriodChange,
  onDrillDown,
  onViewReport,
  onViewEscalation,
  onRefresh,
}: ModerationDashboardProps) {
  const [activePeriod, setActivePeriod] = useState(selectedPeriod || 'last_7d')

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'last_7d', label: '7 Days' },
    { value: 'last_30d', label: '30 Days' },
    { value: 'last_90d', label: '90 Days' },
  ]

  const handlePeriodChange = (period: string) => {
    setActivePeriod(period)
    onPeriodChange?.(period)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading moderation dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 lg:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Content Moderation</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Platform-wide moderation overview for {metrics.period}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Period Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {periods.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => handlePeriodChange(period.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activePeriod === period.value
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
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
        </div>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Open Reports"
            value={metrics.reports.new + metrics.reports.inReview}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            color="amber"
            onClick={() => onDrillDown?.('reports')}
          />
          <MetricCard
            label="Flagged Content"
            value={metrics.flaggedContent.pending}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            }
            color="sky"
            onClick={() => onDrillDown?.('flaggedContent')}
          />
          <MetricCard
            label="Escalations"
            value={metrics.escalations.new + metrics.escalations.inReview}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            color="red"
            onClick={() => onDrillDown?.('escalations')}
          />
          <MetricCard
            label="Pending Appeals"
            value={metrics.appeals.pending}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
            color="slate"
            onClick={() => onDrillDown?.('appeals')}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Reports & SLA */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reports Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Report Breakdown</h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {metrics.reports.total} total reports
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PriorityBreakdown data={metrics.reports.byPriority} />
                <CategoryBreakdown data={metrics.reports.byCategory} />
              </div>
            </div>

            {/* SLA & Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SLA Compliance */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">SLA Compliance</h3>
                <SlaGauge
                  complianceRate={metrics.sla.complianceRate}
                  avgFirstResponse={metrics.sla.avgFirstResponseHours}
                  avgResolution={metrics.sla.avgResolutionHours}
                  overdueCount={metrics.sla.overdueReports}
                />
              </div>

              {/* Trends */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Trends</h3>
                <div className="space-y-6">
                  <TrendChart data={metrics.trendData.reportsPerDay} label="Reports per Day" />
                  <TrendChart data={metrics.trendData.resolutionTimePerDay} label="Avg Resolution (hours)" />
                </div>
              </div>
            </div>

            {/* Actions & Escalations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Actions */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Actions This Week</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{metrics.actions.warnings}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Warnings</div>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{metrics.actions.suspensions}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Suspensions</div>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{metrics.actions.bans}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bans</div>
                  </div>
                </div>
                {metrics.actions.pendingApproval > 0 && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-amber-700 dark:text-amber-400">
                      {metrics.actions.pendingApproval} action(s) pending approval
                    </span>
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Escalation Categories */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Escalations</h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{metrics.escalations.total} total</span>
                </div>
                <EscalationBreakdown data={metrics.escalations.byCategory} />
              </div>
            </div>
          </div>

          {/* Right Column - Team & Recent */}
          <div className="space-y-6">
            {/* Team Workload */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Team Workload</h3>
              <div className="space-y-2">
                {moderators.map((mod) => (
                  <ModeratorCard key={mod.id} moderator={mod} />
                ))}
              </div>
            </div>

            {/* Repeat Offenders Alert */}
            {metrics.repeatOffenders.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Repeat Offenders</h3>
                </div>
                <div className="space-y-2">
                  {metrics.repeatOffenders.slice(0, 3).map((offender) => (
                    <div key={offender.userId} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">{offender.name}</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">{offender.incidents} incidents</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Reports */}
            {recentReports && recentReports.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Reports</h3>
                  <button
                    onClick={() => onDrillDown?.('reports')}
                    className="text-xs font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-1">
                  {recentReports.slice(0, 5).map((report) => (
                    <RecentReportRow key={report.id} report={report} onView={() => onViewReport?.(report.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* Appeals Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Appeals</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{metrics.appeals.upheld}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Upheld</div>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{metrics.appeals.overturned}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Overturned</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Success rate</span>
                <span className="font-medium text-slate-900 dark:text-white">{Math.round(metrics.appeals.successRate * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
