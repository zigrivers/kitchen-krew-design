import { useState } from 'react'
import type {
  EventDetailProps,
  AuditEvent,
  Actor,
  AuditSeverity,
  EntityType,
} from '@/../product/sections/audit-logs/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface SeverityBadgeProps {
  severity: AuditSeverity
  size?: 'sm' | 'md'
}

function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const styles = {
    info: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    critical: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded border ${styles[severity]} ${sizeStyles[size]}`}>
      <span className={`w-2 h-2 rounded-full ${
        severity === 'info' ? 'bg-sky-500' : severity === 'warning' ? 'bg-amber-500' : 'bg-red-500'
      }`} />
      <span className="capitalize">{severity}</span>
    </span>
  )
}

interface CopyButtonProps {
  value: string
  onCopy?: (value: string) => void
  label?: string
}

function CopyButton({ value, onCopy, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    onCopy?.(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-lime-500">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  )
}

interface MetadataItemProps {
  label: string
  value: string | React.ReactNode
  mono?: boolean
  copyable?: boolean
  onCopy?: (value: string) => void
}

function MetadataItem({ label, value, mono, copyable, onCopy }: MetadataItemProps) {
  return (
    <div className="py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
      <dt className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</dt>
      <dd className={`flex items-center gap-2 text-sm text-slate-900 dark:text-white ${mono ? 'font-mono' : ''}`}>
        <span className="truncate">{value}</span>
        {copyable && typeof value === 'string' && <CopyButton value={value} onCopy={onCopy} />}
      </dd>
    </div>
  )
}

interface ActorCardProps {
  actor: Actor
  timestamp: string
  onViewActor?: () => void
}

function ActorCard({ actor, timestamp, onViewActor }: ActorCardProps) {
  const roleColors: Record<string, string> = {
    super_admin: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    support_admin: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    club_admin: 'bg-lime-500/15 text-lime-600 dark:text-lime-400 border-lime-500/30',
    player: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
  }

  const formatDate = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-white font-semibold text-lg">
          {actor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 dark:text-white truncate">{actor.name}</h4>
            {onViewActor && (
              <button
                onClick={onViewActor}
                className="text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{actor.email}</p>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${roleColors[actor.role] || roleColors.player}`}>
              {actor.role.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Permissions at time of action */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">Permissions at time of action</p>
        <div className="flex flex-wrap gap-1.5">
          {actor.permissions.slice(0, 5).map((perm, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
            >
              {perm}
            </span>
          ))}
          {actor.permissions.length > 5 && (
            <span className="px-2 py-0.5 text-xs text-slate-500 dark:text-slate-500">
              +{actor.permissions.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Timestamp</p>
        <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{formatDate(timestamp)}</p>
      </div>
    </div>
  )
}

interface DiffViewerProps {
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
}

function DiffViewer({ before, after }: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')

  const getAllKeys = () => {
    const keys = new Set<string>()
    if (before) Object.keys(before).forEach(k => keys.add(k))
    if (after) Object.keys(after).forEach(k => keys.add(k))
    return Array.from(keys).sort()
  }

  const getChangeType = (key: string): 'added' | 'removed' | 'changed' | 'unchanged' => {
    const inBefore = before && key in before
    const inAfter = after && key in after

    if (!inBefore && inAfter) return 'added'
    if (inBefore && !inAfter) return 'removed'
    if (inBefore && inAfter && JSON.stringify(before[key]) !== JSON.stringify(after[key])) return 'changed'
    return 'unchanged'
  }

  const formatValue = (val: unknown): string => {
    if (val === null) return 'null'
    if (val === undefined) return 'undefined'
    if (typeof val === 'object') return JSON.stringify(val, null, 2)
    return String(val)
  }

  const keys = getAllKeys()

  if (!before && !after) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg">
        No data changes recorded for this event
      </div>
    )
  }

  return (
    <div>
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Data Changes</h3>
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              viewMode === 'split'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => setViewMode('unified')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              viewMode === 'unified'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Unified
          </button>
        </div>
      </div>

      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Before</span>
            </div>
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
              {before ? (
                <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(before, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">No previous value</p>
              )}
            </div>
          </div>

          {/* After */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-lime-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">After</span>
            </div>
            <div className="p-4 bg-lime-500/5 border border-lime-500/20 rounded-lg">
              {after ? (
                <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(after, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">No new value</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">Field</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">Before</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {keys.map((key) => {
                const changeType = getChangeType(key)
                const rowBg = {
                  added: 'bg-lime-500/5',
                  removed: 'bg-red-500/5',
                  changed: 'bg-amber-500/5',
                  unchanged: '',
                }[changeType]

                return (
                  <tr key={key} className={rowBg}>
                    <td className="px-4 py-2 font-mono text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        {changeType === 'added' && <span className="w-2 h-2 rounded-full bg-lime-500" />}
                        {changeType === 'removed' && <span className="w-2 h-2 rounded-full bg-red-500" />}
                        {changeType === 'changed' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                        {key}
                      </div>
                    </td>
                    <td className="px-4 py-2 font-mono text-slate-600 dark:text-slate-400">
                      {before && key in before ? (
                        <span className={changeType === 'removed' || changeType === 'changed' ? 'line-through text-red-600 dark:text-red-400' : ''}>
                          {formatValue(before[key])}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2 font-mono text-slate-600 dark:text-slate-400">
                      {after && key in after ? (
                        <span className={changeType === 'added' || changeType === 'changed' ? 'text-lime-600 dark:text-lime-400 font-medium' : ''}>
                          {formatValue(after[key])}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

interface RelatedEventsTimelineProps {
  events: AuditEvent[]
  currentEventId: string
  onViewEvent?: (eventId: string) => void
}

function RelatedEventsTimeline({ events, currentEventId, onViewEvent }: RelatedEventsTimelineProps) {
  const formatTime = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (events.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg">
        No related events found
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />

      <div className="space-y-4">
        {events.map((event, index) => {
          const isCurrent = event.id === currentEventId

          return (
            <div
              key={event.id}
              className={`relative pl-10 ${isCurrent ? '' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-2 px-12 py-2 rounded-lg'}`}
              onClick={() => !isCurrent && onViewEvent?.(event.id)}
            >
              {/* Timeline dot */}
              <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                isCurrent
                  ? 'bg-lime-500 border-lime-500'
                  : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-600'
              }`} />

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className={`text-sm truncate ${isCurrent ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {event.action.replace(/\./g, ' › ').replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{event.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs font-mono text-slate-600 dark:text-slate-400">{formatTime(event.timestamp)}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(event.timestamp)}</p>
                </div>
              </div>

              {isCurrent && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-lime-500/15 text-lime-600 dark:text-lime-400 rounded">
                  Current
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function EventDetail({
  event,
  actor,
  relatedEvents = [],
  displayMode = 'inline',
  onClose,
  onViewRelated,
  onViewResource,
  onExport,
  onCopyValue,
}: EventDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'changes' | 'related'>('details')

  const formatAction = (action: string) => {
    return action.replace(/\./g, ' › ').replace(/_/g, ' ')
  }

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    })
  }

  const content = (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                <button
                  onClick={onClose}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Audit Logs
                </button>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-mono">{event.id}</span>
              </div>

              {/* Title */}
              <h1 className="text-xl lg:text-2xl font-semibold text-slate-900 dark:text-white capitalize">
                {formatAction(event.action)}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{event.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <SeverityBadge severity={event.severity} size="md" />
                <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                  {event.entityType}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onExport?.('json')}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Export</span>
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4 -mb-px">
            {(['details', 'changes', 'related'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab === 'details' && 'Details'}
                {tab === 'changes' && 'Changes'}
                {tab === 'related' && `Related (${relatedEvents.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'details' && (
              <>
                {/* Event Metadata */}
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Event Information</h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <MetadataItem label="Event ID" value={event.id} mono copyable onCopy={onCopyValue} />
                    <MetadataItem label="Timestamp" value={formatTimestamp(event.timestamp)} />
                    <MetadataItem label="Session ID" value={event.sessionId || '—'} mono copyable={!!event.sessionId} onCopy={onCopyValue} />
                    <MetadataItem label="IP Address" value={event.ipAddress} mono copyable onCopy={onCopyValue} />
                    <div className="sm:col-span-2">
                      <MetadataItem label="User Agent" value={event.userAgent} />
                    </div>
                  </dl>
                </div>

                {/* Resource Information */}
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Target Resource</h3>
                  <dl>
                    <MetadataItem label="Entity Type" value={event.entityType} />
                    <MetadataItem label="Resource ID" value={event.resourceId} mono copyable onCopy={onCopyValue} />
                    <MetadataItem label="Resource Label" value={event.resourceLabel} />
                  </dl>
                  {onViewResource && (
                    <button
                      onClick={() => onViewResource(event.entityType, event.resourceId)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 bg-lime-500/10 hover:bg-lime-500/20 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View {event.entityType}
                    </button>
                  )}
                </div>

                {/* Additional Metadata */}
                {Object.keys(event.metadata).length > 0 && (
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Additional Context</h3>
                    <pre className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                      {JSON.stringify(event.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}

            {activeTab === 'changes' && (
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                <DiffViewer before={event.beforeValue} after={event.afterValue} />
              </div>
            )}

            {activeTab === 'related' && (
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Related Events</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Events from the same session or affecting the same resource
                </p>
                <RelatedEventsTimeline
                  events={[event, ...relatedEvents]}
                  currentEventId={event.id}
                  onViewEvent={onViewRelated}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actor Card */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-3">
                Performed By
              </h3>
              <ActorCard actor={actor} timestamp={event.timestamp} />
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => onCopyValue?.(event.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Event ID
                </button>
                <button
                  onClick={() => onCopyValue?.(JSON.stringify(event, null, 2))}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Copy Full Event
                </button>
                <button
                  onClick={() => onExport?.('json')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export as JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (displayMode === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div className="w-full max-w-5xl my-8 bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden">
          {content}
        </div>
      </div>
    )
  }

  return content
}
