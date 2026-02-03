import { useState } from 'react'
import type {
  AuditLogViewerProps,
  AuditEvent,
  Actor,
  AuditSeverity,
  DateRangePreset,
  AuditFilters,
  ActionTypeOption,
  EntityTypeOption,
  FilterPreset,
} from '@/../product/sections/audit-logs/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface SeverityBadgeProps {
  severity: AuditSeverity
}

function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    info: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    critical: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
  }

  const icons = {
    info: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    warning: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    critical: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${styles[severity]}`}>
      {icons[severity]}
      <span className="capitalize">{severity}</span>
    </span>
  )
}

interface DateRangePickerProps {
  value: DateRangePreset
  onChange: (value: DateRangePreset) => void
}

function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const presets: { value: DateRangePreset; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'last_24h', label: '24h' },
    { value: 'last_7d', label: '7d' },
    { value: 'last_30d', label: '30d' },
    { value: 'custom', label: 'Custom' },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      {presets.map((preset) => (
        <button
          key={preset.value}
          onClick={() => onChange(preset.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            value === preset.value
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}

interface FilterDropdownProps {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  icon?: React.ReactNode
}

function FilterDropdown({ label, options, selected, onChange, icon }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all ${
          selected.length > 0
            ? 'border-lime-500/50 bg-lime-500/10 text-lime-700 dark:text-lime-400'
            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        {icon}
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-lime-500 text-white rounded-full">
            {selected.length}
          </span>
        )}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 max-h-64 overflow-y-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20">
            <div className="p-2">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface PresetChipProps {
  preset: FilterPreset
  isActive?: boolean
  onApply: () => void
  onDelete?: () => void
}

function PresetChip({ preset, isActive, onApply, onDelete }: PresetChipProps) {
  return (
    <div
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
        isActive
          ? 'bg-lime-500 text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      <span onClick={onApply}>{preset.name}</span>
      {onDelete && !preset.isDefault && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className={`opacity-0 group-hover:opacity-100 transition-opacity ${
            isActive ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

interface CopyButtonProps {
  value: string
  onCopy?: (value: string) => void
}

function CopyButton({ value, onCopy }: CopyButtonProps) {
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
      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

interface EventRowProps {
  event: AuditEvent
  actor?: Actor
  isExpanded: boolean
  onToggle: () => void
  onView?: () => void
  onCopyValue?: (value: string) => void
}

function EventRow({ event, actor, isExpanded, onToggle, onView, onCopyValue }: EventRowProps) {
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }
  }

  const { date, time } = formatTimestamp(event.timestamp)

  const formatAction = (action: string) => {
    return action.replace(/\./g, ' › ').replace(/_/g, ' ')
  }

  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
      {/* Main Row */}
      <div
        className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
          isExpanded ? 'bg-slate-50 dark:bg-slate-800/50' : ''
        }`}
        onClick={onToggle}
      >
        {/* Expand Arrow */}
        <button className="flex-shrink-0 p-1 text-slate-400">
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Timestamp */}
        <div className="flex-shrink-0 w-20 text-right">
          <div className="text-xs font-medium text-slate-900 dark:text-white font-mono">{time}</div>
          <div className="text-xs text-slate-500 dark:text-slate-500">{date}</div>
        </div>

        {/* Severity */}
        <div className="flex-shrink-0 w-24">
          <SeverityBadge severity={event.severity} />
        </div>

        {/* Action */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-900 dark:text-white capitalize truncate">
            {formatAction(event.action)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{event.description}</div>
        </div>

        {/* Actor */}
        <div className="hidden md:block flex-shrink-0 w-36">
          <div className="text-sm text-slate-700 dark:text-slate-300 truncate">{actor?.name || 'Unknown'}</div>
          <div className="text-xs text-slate-500 dark:text-slate-500 capitalize">{actor?.role.replace(/_/g, ' ')}</div>
        </div>

        {/* Entity */}
        <div className="hidden lg:block flex-shrink-0 w-32">
          <div className="text-sm text-slate-700 dark:text-slate-300">{event.entityType}</div>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500 font-mono truncate">
            <span className="truncate">{event.resourceId.slice(0, 12)}</span>
            <CopyButton value={event.resourceId} onCopy={onCopyValue} />
          </div>
        </div>

        {/* IP Address */}
        <div className="hidden xl:flex flex-shrink-0 w-32 items-center gap-1">
          <span className="text-xs text-slate-500 dark:text-slate-500 font-mono">{event.ipAddress}</span>
          <CopyButton value={event.ipAddress} onCopy={onCopyValue} />
        </div>

        {/* View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onView?.()
          }}
          className="flex-shrink-0 p-2 text-slate-400 hover:text-lime-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 ml-10 mr-4">
          <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg space-y-4">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Event ID</div>
                <div className="flex items-center gap-1 font-mono text-slate-700 dark:text-slate-300">
                  <span>{event.id}</span>
                  <CopyButton value={event.id} onCopy={onCopyValue} />
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Session ID</div>
                <div className="flex items-center gap-1 font-mono text-slate-700 dark:text-slate-300">
                  <span>{event.sessionId || '—'}</span>
                  {event.sessionId && <CopyButton value={event.sessionId} onCopy={onCopyValue} />}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Resource</div>
                <div className="text-slate-700 dark:text-slate-300 truncate">{event.resourceLabel}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">User Agent</div>
                <div className="text-slate-700 dark:text-slate-300 truncate text-xs">{event.userAgent.slice(0, 40)}...</div>
              </div>
            </div>

            {/* Before/After Values */}
            {(event.beforeValue || event.afterValue) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.beforeValue && (
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="4" />
                      </svg>
                      Before
                    </div>
                    <pre className="p-3 bg-red-500/5 border border-red-500/20 rounded-md text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                      {JSON.stringify(event.beforeValue, null, 2)}
                    </pre>
                  </div>
                )}
                {event.afterValue && (
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                      <svg className="w-3 h-3 text-lime-500" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="4" />
                      </svg>
                      After
                    </div>
                    <pre className="p-3 bg-lime-500/5 border border-lime-500/20 rounded-md text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                      {JSON.stringify(event.afterValue, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function AuditLogViewer({
  events,
  actors,
  actionTypes,
  entityTypes,
  filterPresets,
  currentFilters,
  isLoading,
  totalCount,
  onViewEvent,
  onFilterChange,
  onApplyPreset,
  onSavePreset,
  onDeletePreset,
  onExport,
  onCopyValue,
  onLoadMore,
  onRefresh,
}: AuditLogViewerProps) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangePreset>(currentFilters?.dateRange || 'last_7d')
  const [selectedActions, setSelectedActions] = useState<string[]>(currentFilters?.action || [])
  const [selectedEntities, setSelectedEntities] = useState<string[]>((currentFilters?.entityType || []) as string[])
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>((currentFilters?.severity || []) as string[])

  const getActorById = (id: string) => actors.find((a) => a.id === id)

  const handleFilterChange = () => {
    const filters: AuditFilters = {
      dateRange: selectedDateRange,
      action: selectedActions.length > 0 ? selectedActions : undefined,
      entityType: selectedEntities.length > 0 ? (selectedEntities as AuditFilters['entityType']) : undefined,
      severity: selectedSeverities.length > 0 ? (selectedSeverities as AuditFilters['severity']) : undefined,
      searchQuery: searchQuery || undefined,
    }
    onFilterChange?.(filters)
  }

  const clearAllFilters = () => {
    setSelectedActions([])
    setSelectedEntities([])
    setSelectedSeverities([])
    setSearchQuery('')
    setSelectedDateRange('last_7d')
    onFilterChange?.({ dateRange: 'last_7d' })
  }

  const hasActiveFilters = selectedActions.length > 0 || selectedEntities.length > 0 || selectedSeverities.length > 0 || searchQuery

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 lg:px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Audit Logs</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {totalCount?.toLocaleString() || events.length.toLocaleString()} events
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onRefresh?.()}
                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Refresh"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="relative">
                <button
                  onClick={() => {}}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search events, IDs, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Date Range */}
            <DateRangePicker value={selectedDateRange} onChange={setSelectedDateRange} />

            {/* Filter Dropdowns */}
            <FilterDropdown
              label="Severity"
              options={[
                { value: 'info', label: 'Info' },
                { value: 'warning', label: 'Warning' },
                { value: 'critical', label: 'Critical' },
              ]}
              selected={selectedSeverities}
              onChange={setSelectedSeverities}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />

            <FilterDropdown
              label="Action"
              options={actionTypes.map((t) => ({ value: t.value, label: t.label }))}
              selected={selectedActions}
              onChange={setSelectedActions}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />

            <FilterDropdown
              label="Entity"
              options={entityTypes.map((t) => ({ value: t.value, label: t.label }))}
              selected={selectedEntities}
              onChange={setSelectedEntities}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />

            {/* Apply / Clear */}
            <button
              onClick={handleFilterChange}
              className="px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors"
            >
              Apply
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filter Presets */}
          {filterPresets.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider">Presets:</span>
              <div className="flex flex-wrap gap-2">
                {filterPresets.map((preset) => (
                  <PresetChip
                    key={preset.id}
                    preset={preset}
                    onApply={() => onApplyPreset?.(preset.id)}
                    onDelete={() => onDeletePreset?.(preset.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {/* Column Headers (Desktop) */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
          <div className="w-6" /> {/* Expand arrow spacer */}
          <div className="w-20 text-right">Time</div>
          <div className="w-24">Severity</div>
          <div className="flex-1">Action</div>
          <div className="w-36">Actor</div>
          <div className="hidden lg:block w-32">Entity</div>
          <div className="hidden xl:block w-32">IP Address</div>
          <div className="w-10" /> {/* View button spacer */}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading audit events...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && events.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No events found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {hasActiveFilters ? 'Try adjusting your filters to see more results.' : 'Audit events will appear here as actions are performed.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Event Rows */}
        {!isLoading &&
          events.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              actor={getActorById(event.actorId)}
              isExpanded={expandedEventId === event.id}
              onToggle={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
              onView={() => onViewEvent?.(event.id)}
              onCopyValue={onCopyValue}
            />
          ))}

        {/* Load More */}
        {!isLoading && events.length > 0 && onLoadMore && (
          <div className="p-4 text-center">
            <button
              onClick={onLoadMore}
              className="px-6 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Load more events
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
