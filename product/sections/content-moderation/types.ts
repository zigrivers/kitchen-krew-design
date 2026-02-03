// =============================================================================
// Data Types
// =============================================================================

/** Report status in the moderation workflow */
export type ReportStatus = 'new' | 'in_review' | 'resolved' | 'dismissed'

/** Priority levels for reports with SLA implications */
export type ReportPriority = 'urgent' | 'high' | 'medium' | 'low'

/** Categories of user reports */
export type ReportCategory = 'harassment' | 'cheating' | 'inappropriate_content' | 'spam' | 'impersonation' | 'other'

/** Escalation severity levels */
export type EscalationSeverity = 'critical' | 'high' | 'medium'

/** Categories for platform escalations */
export type EscalationCategory = 'severe_harassment' | 'threats_violence' | 'fraud_impersonation' | 'illegal_activity' | 'pattern_abuse'

/** Types of moderation actions */
export type ActionType = 'warning' | 'suspension' | 'ban'

/** Status of a moderation action */
export type ActionStatus = 'pending_approval' | 'active' | 'completed' | 'expired' | 'appealed'

/** Reason categories for moderation actions */
export type ActionReasonCategory = 'harassment' | 'fraud' | 'safety_threat' | 'tos_violation' | 'other'

/** Status of flagged content */
export type FlaggedContentStatus = 'pending' | 'approved' | 'removed'

/** Types of content that can be flagged */
export type ContentType = 'profile_photo' | 'bio' | 'club_description' | 'event_description'

/** Source of the content flag */
export type FlagSource = 'auto' | 'manual'

/** Appeal decision outcomes */
export type AppealDecision = 'pending' | 'upheld' | 'modified' | 'overturned'

/** Reporter reputation based on report accuracy */
export type ReporterReputation = 'trusted' | 'good' | 'fair' | 'poor'

/** Moderator role levels */
export type ModeratorRole = 'super_admin' | 'moderator'

/** Escalation resolution status */
export type EscalationStatus = 'new' | 'in_review' | 'resolved'

// -----------------------------------------------------------------------------
// Reporter & Reported User
// -----------------------------------------------------------------------------

export interface Reporter {
  id: string
  name: string
  email: string
  reportsSubmitted: number
  falseReports: number
  reputation: ReporterReputation
}

export interface ReportedUser {
  id: string
  name: string
  email: string
  memberSince: string
  priorWarnings: number
  priorSuspensions: number
  clubs: string[]
}

// -----------------------------------------------------------------------------
// Evidence
// -----------------------------------------------------------------------------

export interface Evidence {
  type: 'screenshot' | 'video' | 'document' | 'link'
  url: string
  description: string
}

// -----------------------------------------------------------------------------
// Report Context
// -----------------------------------------------------------------------------

export interface ReportContext {
  location: string
  relatedEvent: string | null
  relatedMatch: string | null
}

// -----------------------------------------------------------------------------
// Internal Note
// -----------------------------------------------------------------------------

export interface InternalNote {
  author: string
  timestamp: string
  note: string
}

// -----------------------------------------------------------------------------
// Report Resolution
// -----------------------------------------------------------------------------

export interface ReportResolution {
  action: 'warning' | 'suspension' | 'ban' | 'dismissed'
  resolvedBy: string
  resolvedAt: string
  notes: string
  reporterNotified: boolean
}

// -----------------------------------------------------------------------------
// User Report
// -----------------------------------------------------------------------------

export interface UserReport {
  id: string
  status: ReportStatus
  priority: ReportPriority
  category: ReportCategory
  createdAt: string
  updatedAt: string
  slaDeadline: string
  assignedTo: string | null
  reporter: Reporter
  reportedUser: ReportedUser
  description: string
  evidence: Evidence[]
  context: ReportContext
  internalNotes: InternalNote[]
  resolution: ReportResolution | null
}

// -----------------------------------------------------------------------------
// Flagged Content
// -----------------------------------------------------------------------------

export interface FlaggedContentUser {
  id: string
  name: string
  email: string
  memberSince: string
  priorViolations: number
}

export interface FlaggedContentData {
  url: string | null
  thumbnailUrl: string | null
  originalText: string | null
}

export interface FlaggedContent {
  id: string
  status: FlaggedContentStatus
  contentType: ContentType
  flagSource: FlagSource
  flaggedAt: string
  resolvedAt?: string
  resolvedBy?: string
  user: FlaggedContentUser
  content: FlaggedContentData
  flagReason: string
  confidence: number | null
  resolutionNotes?: string
}

// -----------------------------------------------------------------------------
// Platform Escalation
// -----------------------------------------------------------------------------

export interface EscalatingClub {
  id: string
  name: string
  adminName: string
  adminEmail: string
}

export interface EscalatedUser {
  id: string
  name: string
  email: string
  memberSince: string
  priorPlatformWarnings: number
  priorPlatformSuspensions: number
  clubs: string[]
}

export interface CrossClubActivity {
  club: string
  status: 'active_member' | 'suspended' | 'banned'
  incidents: number
  notes: string | null
}

export interface EscalationResolution {
  action: 'no_action' | 'warning' | 'suspension' | 'ban'
  duration?: string
  resolvedBy: string
  resolvedAt: string
  notes: string
  clubNotified: boolean
}

export interface PlatformEscalation {
  id: string
  status: EscalationStatus
  severity: EscalationSeverity
  category: EscalationCategory
  createdAt: string
  updatedAt: string
  assignedTo: string | null
  escalatingClub: EscalatingClub
  reportedUser: EscalatedUser
  description: string
  evidence: Evidence[]
  clubActionTaken: string
  requestedAction: string
  crossClubActivity: CrossClubActivity[]
  internalNotes: InternalNote[]
  resolution: EscalationResolution | null
}

// -----------------------------------------------------------------------------
// Moderation Action
// -----------------------------------------------------------------------------

export interface ActionTargetUser {
  id: string
  name: string
  email: string
}

export interface ModerationAction {
  id: string
  actionType: ActionType
  status: ActionStatus
  createdAt: string
  executedAt: string | null
  expiresAt: string | null
  targetUser: ActionTargetUser
  issuedBy: string
  approvedBy: string | null
  pendingApprover?: string
  reason: string
  reasonCategory: ActionReasonCategory
  description: string
  relatedReport?: string
  relatedEscalation?: string
  userNotified: boolean
  clubsNotified: string[]
  appealStatus: 'pending' | 'resolved' | null
  approvalDeadline?: string
}

// -----------------------------------------------------------------------------
// Appeal
// -----------------------------------------------------------------------------

export interface Appellant {
  id: string
  name: string
  email: string
}

export interface OriginalAction {
  type: ActionType
  duration?: string
  reason: string
  issuedAt: string
}

export interface Appeal {
  id: string
  status: AppealDecision
  createdAt: string
  updatedAt: string
  relatedAction: string
  appellant: Appellant
  originalAction: OriginalAction
  appealStatement: string
  supportingEvidence: Evidence[]
  assignedTo: string | null
  decision: AppealDecision | null
  decisionReason: string | null
  decisionBy: string | null
  decisionAt: string | null
}

// -----------------------------------------------------------------------------
// Moderator
// -----------------------------------------------------------------------------

export interface ModeratorStats {
  reportsAssigned: number
  reportsResolved: number
  avgResolutionHours: number
  actionsThisWeek: number
}

export interface Moderator {
  id: string
  name: string
  email: string
  role: ModeratorRole
  avatarUrl: string | null
  stats: ModeratorStats
}

// -----------------------------------------------------------------------------
// Metrics
// -----------------------------------------------------------------------------

export interface ReportMetrics {
  total: number
  new: number
  inReview: number
  resolved: number
  dismissed: number
  byCategory: Record<ReportCategory, number>
  byPriority: Record<ReportPriority, number>
}

export interface FlaggedContentMetrics {
  total: number
  pending: number
  approved: number
  removed: number
  byType: Record<ContentType, number>
  bySource: Record<FlagSource, number>
}

export interface EscalationMetrics {
  total: number
  new: number
  inReview: number
  resolved: number
  byCategory: Record<EscalationCategory, number>
}

export interface ActionMetrics {
  total: number
  warnings: number
  suspensions: number
  bans: number
  pendingApproval: number
}

export interface AppealMetrics {
  total: number
  pending: number
  upheld: number
  modified: number
  overturned: number
  successRate: number
}

export interface SlaMetrics {
  complianceRate: number
  avgFirstResponseHours: number
  avgResolutionHours: number
  overdueReports: number
}

export interface ModeratorWorkload {
  moderatorId: string
  name: string
  assigned: number
  resolved: number
}

export interface RepeatOffender {
  userId: string
  name: string
  incidents: number
}

export interface TrendData {
  reportsPerDay: number[]
  resolutionTimePerDay: number[]
}

export interface ModerationMetrics {
  period: string
  reports: ReportMetrics
  flaggedContent: FlaggedContentMetrics
  escalations: EscalationMetrics
  actions: ActionMetrics
  appeals: AppealMetrics
  sla: SlaMetrics
  moderatorWorkload: ModeratorWorkload[]
  repeatOffenders: RepeatOffender[]
  trendData: TrendData
}

// -----------------------------------------------------------------------------
// Option Types (for dropdowns)
// -----------------------------------------------------------------------------

export interface CategoryOption {
  value: string
  label: string
}

export interface PriorityOption {
  value: ReportPriority
  label: string
  slaHours: number
}

// =============================================================================
// Component Props
// =============================================================================

/** Props for the Moderation Dashboard screen */
export interface ModerationDashboardProps {
  /** Aggregated moderation metrics */
  metrics: ModerationMetrics
  /** List of moderators with workload */
  moderators: Moderator[]
  /** Recent reports for quick access */
  recentReports?: UserReport[]
  /** Currently selected time period */
  selectedPeriod?: string
  /** Whether data is loading */
  isLoading?: boolean
  /** Called when user changes the time period */
  onPeriodChange?: (period: string) => void
  /** Called when user clicks on a metric to drill down */
  onDrillDown?: (metricType: string) => void
  /** Called when user views a report */
  onViewReport?: (reportId: string) => void
  /** Called when user views an escalation */
  onViewEscalation?: (escalationId: string) => void
  /** Called when user refreshes data */
  onRefresh?: () => void
}

/** Props for the Reports Queue screen */
export interface ReportsQueueProps {
  /** List of user reports */
  reports: UserReport[]
  /** List of moderators for assignment */
  moderators: Moderator[]
  /** Available report categories for filtering */
  categories: CategoryOption[]
  /** Available priority levels */
  priorities: PriorityOption[]
  /** Whether data is loading */
  isLoading?: boolean
  /** Total count for pagination */
  totalCount?: number
  /** Called when user views a report */
  onViewReport?: (reportId: string) => void
  /** Called when user assigns a report to a moderator */
  onAssign?: (reportId: string, moderatorId: string) => void
  /** Called when user takes action on a report */
  onTakeAction?: (reportId: string, action: 'warn' | 'suspend' | 'ban' | 'dismiss') => void
  /** Called when filters change */
  onFilterChange?: (filters: Record<string, unknown>) => void
  /** Called when user loads more reports */
  onLoadMore?: () => void
  /** Called when user refreshes the list */
  onRefresh?: () => void
}

/** Props for the Report Detail screen */
export interface ReportDetailProps {
  /** The report to display */
  report: UserReport
  /** The assigned moderator (if any) */
  assignedModerator?: Moderator
  /** List of moderators for assignment */
  moderators: Moderator[]
  /** Called when user closes the detail view */
  onClose?: () => void
  /** Called when user assigns the report */
  onAssign?: (moderatorId: string) => void
  /** Called when user contacts the reported user */
  onContactUser?: (userId: string) => void
  /** Called when user adds an internal note */
  onAddNote?: (note: string) => void
  /** Called when user takes action */
  onTakeAction?: (action: 'warn' | 'suspend' | 'ban' | 'dismiss', details: Record<string, unknown>) => void
  /** Called when user views the reporter's profile */
  onViewReporter?: (userId: string) => void
  /** Called when user views the reported user's profile */
  onViewReportedUser?: (userId: string) => void
}

/** Props for the Flagged Content Queue screen */
export interface FlaggedContentQueueProps {
  /** List of flagged content items */
  content: FlaggedContent[]
  /** Whether data is loading */
  isLoading?: boolean
  /** Total count for pagination */
  totalCount?: number
  /** Called when user approves content */
  onApprove?: (contentId: string) => void
  /** Called when user removes content */
  onRemove?: (contentId: string, warnUser: boolean) => void
  /** Called when user views content details */
  onViewDetails?: (contentId: string) => void
  /** Called when filters change */
  onFilterChange?: (filters: Record<string, unknown>) => void
  /** Called when user loads more content */
  onLoadMore?: () => void
  /** Called when user refreshes the list */
  onRefresh?: () => void
}

/** Props for the Platform Escalations screen */
export interface EscalationsQueueProps {
  /** List of platform escalations */
  escalations: PlatformEscalation[]
  /** List of moderators for assignment */
  moderators: Moderator[]
  /** Available escalation categories */
  categories: CategoryOption[]
  /** Whether data is loading */
  isLoading?: boolean
  /** Total count for pagination */
  totalCount?: number
  /** Called when user views an escalation */
  onViewEscalation?: (escalationId: string) => void
  /** Called when user assigns an escalation */
  onAssign?: (escalationId: string, moderatorId: string) => void
  /** Called when filters change */
  onFilterChange?: (filters: Record<string, unknown>) => void
  /** Called when user loads more escalations */
  onLoadMore?: () => void
  /** Called when user refreshes the list */
  onRefresh?: () => void
}

/** Props for the Escalation Detail screen */
export interface EscalationDetailProps {
  /** The escalation to display */
  escalation: PlatformEscalation
  /** The assigned moderator (if any) */
  assignedModerator?: Moderator
  /** List of moderators for assignment */
  moderators: Moderator[]
  /** Called when user closes the detail view */
  onClose?: () => void
  /** Called when user assigns the escalation */
  onAssign?: (moderatorId: string) => void
  /** Called when user adds an internal note */
  onAddNote?: (note: string) => void
  /** Called when user contacts the escalating club */
  onContactClub?: (clubId: string) => void
  /** Called when user contacts other clubs */
  onContactOtherClub?: (clubName: string) => void
  /** Called when user resolves the escalation */
  onResolve?: (action: 'no_action' | 'warning' | 'suspension' | 'ban', details: Record<string, unknown>) => void
  /** Called when user requests second approval for bans */
  onRequestApproval?: (approverId: string) => void
  /** Called when user views the reported user's profile */
  onViewUser?: (userId: string) => void
}

/** Props for the Appeals screen */
export interface AppealsQueueProps {
  /** List of appeals */
  appeals: Appeal[]
  /** List of moderators for assignment */
  moderators: Moderator[]
  /** Whether data is loading */
  isLoading?: boolean
  /** Called when user views an appeal */
  onViewAppeal?: (appealId: string) => void
  /** Called when user assigns an appeal */
  onAssign?: (appealId: string, moderatorId: string) => void
  /** Called when user makes a decision */
  onDecide?: (appealId: string, decision: 'uphold' | 'modify' | 'overturn', reason: string) => void
  /** Called when user refreshes the list */
  onRefresh?: () => void
}

/** Props for the User Action Modal */
export interface UserActionModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** The user being acted upon */
  targetUser: ActionTargetUser
  /** Available reason categories */
  reasons: CategoryOption[]
  /** List of moderators for ban approval */
  moderators?: Moderator[]
  /** Called when user cancels */
  onCancel?: () => void
  /** Called when user confirms the action */
  onConfirm?: (action: ActionType, details: {
    reason: ActionReasonCategory
    duration?: string
    notes: string
    approverId?: string
  }) => void
}
