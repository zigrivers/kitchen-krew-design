// =============================================================================
// Data Types
// =============================================================================

/** Severity level for audit events */
export type AuditSeverity = 'info' | 'warning' | 'critical'

/** Categories of audited actions */
export type ActionCategory = 'security' | 'user' | 'event' | 'match' | 'financial' | 'system'

/** Entity types that can be audited */
export type EntityType = 'Player' | 'Club' | 'Venue' | 'Event' | 'Match' | 'Registration' | 'System'

/** Admin roles in the system */
export type AdminRole = 'super_admin' | 'support_admin' | 'club_admin' | 'player'

/** Date range presets for filtering */
export type DateRangePreset = 'today' | 'last_24h' | 'last_7d' | 'last_30d' | 'custom'

/** The user who performed an audited action */
export interface Actor {
  id: string
  userId: string
  name: string
  email: string
  role: AdminRole
  permissions: string[]
  avatarUrl: string | null
}

/** A single audit event recording an action in the system */
export interface AuditEvent {
  id: string
  timestamp: string
  severity: AuditSeverity
  action: string
  description: string
  actorId: string
  entityType: EntityType
  resourceId: string
  resourceLabel: string
  ipAddress: string
  userAgent: string
  sessionId: string | null
  beforeValue: Record<string, unknown> | null
  afterValue: Record<string, unknown> | null
  metadata: Record<string, unknown>
}

/** A saved filter combination for quick access */
export interface FilterPreset {
  id: string
  name: string
  description: string
  filters: {
    action: string[] | null
    dateRange: DateRangePreset | string
    severity: AuditSeverity[] | null
    entityType?: EntityType[] | null
    actorId?: string | null
    ipAddress?: string | null
  }
  createdBy: string
  createdAt: string
  isDefault: boolean
}

/** Actor activity ranking for dashboard */
export interface ActorActivity {
  actorId: string
  name: string
  actionCount: number
}

/** Entity type activity for dashboard */
export interface EntityActivity {
  entityType: EntityType
  count: number
}

/** Suspicious activity pattern detected by the system */
export interface SuspiciousPattern {
  id: string
  type: string
  description: string
  ipAddress: string
  occurrences: number
  firstSeen: string
  lastSeen: string
}

/** Aggregated security metrics for the dashboard */
export interface SecurityMetrics {
  period: string
  totalEvents: number
  criticalEvents: number
  warningEvents: number
  infoEvents: number
  failedLogins: number
  successfulLogins: number
  permissionEscalations: number
  impersonationSessions: number
  suspendedAccounts: number
  bulkOperations: number
  configChanges: number
  topActors: ActorActivity[]
  topEntityTypes: EntityActivity[]
  suspiciousPatterns: SuspiciousPattern[]
}

/** Activity data for a single day in the heatmap */
export interface HeatmapDay {
  day: string
  hours: number[]
}

/** Hour-by-day activity matrix for pattern detection */
export interface ActivityHeatmap {
  period: string
  timezone: string
  data: HeatmapDay[]
  maxValue: number
  totalActions: number
}

/** Action type option for filter dropdowns */
export interface ActionTypeOption {
  value: string
  label: string
  category: ActionCategory
}

/** Entity type option for filter dropdowns */
export interface EntityTypeOption {
  value: EntityType
  label: string
}

/** Current filter state for the audit log viewer */
export interface AuditFilters {
  dateRange: DateRangePreset
  startDate?: string
  endDate?: string
  action?: string[]
  entityType?: EntityType[]
  severity?: AuditSeverity[]
  actorId?: string
  resourceId?: string
  ipAddress?: string
  searchQuery?: string
}

// =============================================================================
// Component Props
// =============================================================================

/** Props for the main Audit Log Viewer screen */
export interface AuditLogViewerProps {
  /** List of audit events to display */
  events: AuditEvent[]
  /** All actors for filtering and display */
  actors: Actor[]
  /** Available action types for filtering */
  actionTypes: ActionTypeOption[]
  /** Available entity types for filtering */
  entityTypes: EntityTypeOption[]
  /** Saved filter presets */
  filterPresets: FilterPreset[]
  /** Current filter state */
  currentFilters?: AuditFilters
  /** Whether data is currently loading */
  isLoading?: boolean
  /** Total number of events (for pagination) */
  totalCount?: number
  /** Called when user views event details */
  onViewEvent?: (eventId: string) => void
  /** Called when filters change */
  onFilterChange?: (filters: AuditFilters) => void
  /** Called when user applies a preset */
  onApplyPreset?: (presetId: string) => void
  /** Called when user saves current filters as preset */
  onSavePreset?: (name: string, description: string) => void
  /** Called when user deletes a preset */
  onDeletePreset?: (presetId: string) => void
  /** Called when user exports filtered results */
  onExport?: (format: 'csv' | 'json') => void
  /** Called when user copies a value to clipboard */
  onCopyValue?: (value: string) => void
  /** Called when user loads more events (infinite scroll) */
  onLoadMore?: () => void
  /** Called when user refreshes the list */
  onRefresh?: () => void
}

/** Props for the Event Detail view/modal */
export interface EventDetailProps {
  /** The audit event to display */
  event: AuditEvent
  /** The actor who performed the action */
  actor: Actor
  /** Related events (same session or resource) */
  relatedEvents?: AuditEvent[]
  /** Whether to show as modal or inline */
  displayMode?: 'modal' | 'inline'
  /** Called when user closes the detail view */
  onClose?: () => void
  /** Called when user navigates to related event */
  onViewRelated?: (eventId: string) => void
  /** Called when user navigates to the resource */
  onViewResource?: (entityType: EntityType, resourceId: string) => void
  /** Called when user exports the event */
  onExport?: (format: 'json') => void
  /** Called when user copies a value */
  onCopyValue?: (value: string) => void
}

/** Props for the Security Dashboard screen */
export interface SecurityDashboardProps {
  /** Aggregated security metrics */
  metrics: SecurityMetrics
  /** Activity heatmap data */
  heatmap: ActivityHeatmap
  /** Recent critical events */
  recentCriticalEvents: AuditEvent[]
  /** Actors for display */
  actors: Actor[]
  /** Currently selected time period */
  selectedPeriod?: DateRangePreset
  /** Whether data is loading */
  isLoading?: boolean
  /** Called when user changes the time period */
  onPeriodChange?: (period: DateRangePreset) => void
  /** Called when user clicks on a metric to drill down */
  onDrillDown?: (metricType: string) => void
  /** Called when user views event details */
  onViewEvent?: (eventId: string) => void
  /** Called when user views actor details */
  onViewActor?: (actorId: string) => void
  /** Called when user investigates a suspicious pattern */
  onInvestigatePattern?: (patternId: string) => void
  /** Called when user refreshes data */
  onRefresh?: () => void
  /** Called when user exports dashboard data */
  onExport?: (format: 'csv' | 'json' | 'pdf') => void
}
