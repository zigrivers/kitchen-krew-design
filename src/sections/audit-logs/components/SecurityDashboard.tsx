import { useState } from 'react'
import type {
  SecurityDashboardProps,
  AuditEvent,
  Actor,
  AuditSeverity,
  DateRangePreset,
  SecurityMetrics,
  ActivityHeatmap,
  SuspiciousPattern,
  ActorActivity,
} from '@/../product/sections/audit-logs/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface PeriodSelectorProps {
  value: DateRangePreset
  onChange: (value: DateRangePreset) => void
}

function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const options: { value: DateRangePreset; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'last_24h', label: '24 Hours' },
    { value: 'last_7d', label: '7 Days' },
    { value: 'last_30d', label: '30 Days' },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            value === option.value
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  color?: 'default' | 'warning' | 'critical' | 'success'
  onClick?: () => void
}

function MetricCard({ label, value, icon, trend, color = 'default', onClick }: MetricCardProps) {
  const colorStyles = {
    default: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800',
    warning: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20',
    critical: 'bg-red-500/5 dark:bg-red-500/10 border-red-500/20',
    success: 'bg-lime-500/5 dark:bg-lime-500/10 border-lime-500/20',
  }

  const iconColors = {
    default: 'text-slate-400 dark:text-slate-500',
    warning: 'text-amber-500',
    critical: 'text-red-500',
    success: 'text-lime-500',
  }

  return (
    <div
      className={`p-5 rounded-xl border ${colorStyles[color]} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${color === 'default' ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>
          <div className={iconColors[color]}>{icon}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend.isPositive ? 'text-lime-600 dark:text-lime-400' : 'text-red-600 dark:text-red-400'}`}>
            <svg className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

interface HeatmapProps {
  data: ActivityHeatmap
}

function Heatmap({ data }: HeatmapProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const hourLabels = ['12a', '', '', '3a', '', '', '6a', '', '', '9a', '', '', '12p', '', '', '3p', '', '', '6p', '', '', '9p', '', '']

  const getIntensity = (value: number) => {
    if (value === 0) return 'bg-slate-100 dark:bg-slate-800'
    const ratio = value / data.maxValue
    if (ratio < 0.25) return 'bg-lime-200 dark:bg-lime-900/50'
    if (ratio < 0.5) return 'bg-lime-400 dark:bg-lime-700'
    if (ratio < 0.75) return 'bg-lime-500 dark:bg-lime-600'
    return 'bg-lime-600 dark:bg-lime-500'
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Hour labels */}
        <div className="flex items-center mb-2 ml-12">
          {hours.map((hour, i) => (
            <div key={hour} className="flex-1 text-center text-xs text-slate-400 dark:text-slate-500">
              {hourLabels[i]}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="space-y-1">
          {data.data.map((day) => (
            <div key={day.day} className="flex items-center gap-2">
              <div className="w-10 text-xs text-slate-500 dark:text-slate-400 text-right">{day.day}</div>
              <div className="flex-1 flex gap-0.5">
                {day.hours.map((value, hourIndex) => (
                  <div
                    key={hourIndex}
                    className={`flex-1 h-5 rounded-sm ${getIntensity(value)} transition-colors hover:ring-2 hover:ring-lime-500/50`}
                    title={`${day.day} ${hourIndex}:00 - ${value} events`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Less</span>
          <div className="flex gap-0.5">
            <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800" />
            <div className="w-4 h-4 rounded-sm bg-lime-200 dark:bg-lime-900/50" />
            <div className="w-4 h-4 rounded-sm bg-lime-400 dark:bg-lime-700" />
            <div className="w-4 h-4 rounded-sm bg-lime-500 dark:bg-lime-600" />
            <div className="w-4 h-4 rounded-sm bg-lime-600 dark:bg-lime-500" />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">More</span>
        </div>
      </div>
    </div>
  )
}

interface TopActorsChartProps {
  actors: ActorActivity[]
  maxCount: number
  onViewActor?: (actorId: string) => void
}

function TopActorsChart({ actors, maxCount, onViewActor }: TopActorsChartProps) {
  return (
    <div className="space-y-3">
      {actors.map((actor, index) => {
        const percentage = (actor.actionCount / maxCount) * 100

        return (
          <div
            key={actor.actorId}
            className={`group ${onViewActor ? 'cursor-pointer' : ''}`}
            onClick={() => onViewActor?.(actor.actorId)}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                  {actor.name}
                </span>
              </div>
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
                {actor.actionCount.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all group-hover:from-lime-500 group-hover:to-lime-600"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface SuspiciousPatternAlertProps {
  pattern: SuspiciousPattern
  onInvestigate?: () => void
}

function SuspiciousPatternAlert({ pattern, onInvestigate }: SuspiciousPatternAlertProps) {
  const formatTime = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-4 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-red-500/10 rounded-lg">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">{pattern.description}</h4>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-mono">{pattern.ipAddress}</span>
            <span>{pattern.occurrences} occurrences</span>
            <span>First: {formatTime(pattern.firstSeen)}</span>
            <span>Last: {formatTime(pattern.lastSeen)}</span>
          </div>
        </div>
        {onInvestigate && (
          <button
            onClick={onInvestigate}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            Investigate
          </button>
        )}
      </div>
    </div>
  )
}

interface SeverityBadgeProps {
  severity: AuditSeverity
}

function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    info: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    critical: 'bg-red-500/15 text-red-600 dark:text-red-400',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${styles[severity]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        severity === 'info' ? 'bg-sky-500' : severity === 'warning' ? 'bg-amber-500' : 'bg-red-500'
      }`} />
      {severity}
    </span>
  )
}

interface CriticalEventsListProps {
  events: AuditEvent[]
  actors: Actor[]
  onViewEvent?: (eventId: string) => void
}

function CriticalEventsList({ events, actors, onViewEvent }: CriticalEventsListProps) {
  const getActor = (actorId: string) => actors.find((a) => a.id === actorId)

  const formatTime = (ts: string) => {
    const date = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (events.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-lime-500/10 mb-3">
          <svg className="w-6 h-6 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">No critical events in this period</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {events.slice(0, 5).map((event) => {
        const actor = getActor(event.actorId)

        return (
          <div
            key={event.id}
            className={`p-4 ${onViewEvent ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''} transition-colors`}
            onClick={() => onViewEvent?.(event.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <SeverityBadge severity={event.severity} />
                  <span className="text-xs text-slate-400 dark:text-slate-500">{formatTime(event.timestamp)}</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {event.action.replace(/\./g, ' › ').replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {actor?.name || 'Unknown'} • {event.resourceLabel}
                </p>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface EntityBreakdownProps {
  entities: { entityType: string; count: number }[]
  total: number
}

function EntityBreakdown({ entities, total }: EntityBreakdownProps) {
  const colors = [
    'bg-lime-500',
    'bg-sky-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-slate-400',
  ]

  return (
    <div>
      {/* Bar */}
      <div className="h-3 flex rounded-full overflow-hidden mb-4">
        {entities.map((entity, index) => {
          const percentage = (entity.count / total) * 100
          return (
            <div
              key={entity.entityType}
              className={`${colors[index % colors.length]} transition-all hover:opacity-80`}
              style={{ width: `${percentage}%` }}
              title={`${entity.entityType}: ${entity.count} (${percentage.toFixed(1)}%)`}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {entities.map((entity, index) => (
          <div key={entity.entityType} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
            <span className="text-sm text-slate-600 dark:text-slate-400">{entity.entityType}</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white ml-auto">{entity.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function SecurityDashboard({
  metrics,
  heatmap,
  recentCriticalEvents,
  actors,
  selectedPeriod = 'last_7d',
  isLoading,
  onPeriodChange,
  onDrillDown,
  onViewEvent,
  onViewActor,
  onInvestigatePattern,
  onRefresh,
  onExport,
}: SecurityDashboardProps) {
  const [period, setPeriod] = useState<DateRangePreset>(selectedPeriod)

  const handlePeriodChange = (newPeriod: DateRangePreset) => {
    setPeriod(newPeriod)
    onPeriodChange?.(newPeriod)
  }

  const maxActorCount = metrics.topActors.length > 0 ? Math.max(...metrics.topActors.map((a) => a.actionCount)) : 1

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Security Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor security events and suspicious activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PeriodSelector value={period} onChange={handlePeriodChange} />
          <button
            onClick={() => onRefresh?.()}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Refresh"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => onExport?.('pdf')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading security data...</span>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Suspicious Patterns Alert */}
          {metrics.suspiciousPatterns.length > 0 && (
            <div className="mb-6 space-y-3">
              {metrics.suspiciousPatterns.map((pattern) => (
                <SuspiciousPatternAlert
                  key={pattern.id}
                  pattern={pattern}
                  onInvestigate={() => onInvestigatePattern?.(pattern.id)}
                />
              ))}
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Total Events"
              value={metrics.totalEvents}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              onClick={() => onDrillDown?.('totalEvents')}
            />
            <MetricCard
              label="Failed Logins"
              value={metrics.failedLogins}
              color={metrics.failedLogins > 20 ? 'warning' : 'default'}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              onClick={() => onDrillDown?.('failedLogins')}
            />
            <MetricCard
              label="Escalations"
              value={metrics.permissionEscalations}
              color={metrics.permissionEscalations > 5 ? 'critical' : 'default'}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              onClick={() => onDrillDown?.('escalations')}
            />
            <MetricCard
              label="Impersonations"
              value={metrics.impersonationSessions}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              onClick={() => onDrillDown?.('impersonations')}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Critical Events</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{metrics.criticalEvents}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Warning Events</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{metrics.warningEvents}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Bulk Operations</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{metrics.bulkOperations}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Config Changes</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{metrics.configChanges}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Activity Heatmap */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Activity Heatmap</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {heatmap.totalActions.toLocaleString()} total actions • {heatmap.timezone}
                  </p>
                </div>
              </div>
              <Heatmap data={heatmap} />
            </div>

            {/* Top Actors */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Top Actors</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Most active admins by action count</p>
                </div>
              </div>
              <TopActorsChart actors={metrics.topActors} maxCount={maxActorCount} onViewActor={onViewActor} />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Critical Events */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Critical Events</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Events requiring attention</p>
                  </div>
                  <button
                    onClick={() => onDrillDown?.('criticalEvents')}
                    className="text-xs font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300"
                  >
                    View all
                  </button>
                </div>
              </div>
              <CriticalEventsList events={recentCriticalEvents} actors={actors} onViewEvent={onViewEvent} />
            </div>

            {/* Entity Breakdown */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Events by Entity Type</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Distribution of audited actions</p>
                </div>
              </div>
              <EntityBreakdown entities={metrics.topEntityTypes} total={metrics.totalEvents} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
