// =============================================================================
// Data Types
// =============================================================================

export type AccountStatus = 'active' | 'suspended' | 'banned' | 'pending_deletion'

export type UserRole = 'player' | 'game_manager' | 'club_admin' | 'club_owner' | 'super_admin'

export type NoteCategory = 'general' | 'positive' | 'concern' | 'incident'

export type WarningType =
  | 'code_of_conduct'
  | 'unsportsmanlike_behavior'
  | 'no_show_abuse'
  | 'harassment'
  | 'other'

export type ActionType = 'warning' | 'suspension' | 'ban'

export type ActionReason =
  | 'code_of_conduct'
  | 'unsportsmanlike_behavior'
  | 'no_show_abuse'
  | 'harassment'
  | 'threats_violence'
  | 'fraud'
  | 'illegal_activity'
  | 'tos_violation'
  | 'other'

export type ActionDuration =
  | '1_day'
  | '7_days'
  | '14_days'
  | '30_days'
  | '90_days'
  | '180_days'
  | '1_year'
  | 'permanent'

export type AppealStatus = 'none' | 'pending' | 'approved' | 'denied'

export type EscalationStatus = 'new' | 'in_review' | 'resolved'

export type EscalationPriority = 'standard' | 'urgent'

export type EscalationResolution =
  | 'no_action'
  | 'platform_warning'
  | 'platform_suspension'
  | 'platform_ban'

export type GDPRRequestType = 'export' | 'deletion'

export type GDPRRequestStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export type ActivityEventType =
  | 'account_created'
  | 'profile_updated'
  | 'login'
  | 'password_changed'
  | 'email_changed'
  | 'club_joined'
  | 'club_left'
  | 'role_changed'
  | 'event_registered'
  | 'event_attended'
  | 'warning_received'
  | 'suspension_started'
  | 'suspension_ended'
  | 'club_ban'
  | 'platform_warning'
  | 'platform_suspension'
  | 'platform_ban'
  | 'deletion_requested'
  | 'deletion_cancelled'
  | 'account_deleted'

// -----------------------------------------------------------------------------
// Core Entities
// -----------------------------------------------------------------------------

export interface UserAccount {
  id: string
  email: string
  displayName: string
  photoUrl: string | null
  phone: string | null
  accountStatus: AccountStatus
  isEmailVerified: boolean
  skillRating: number
  duprId: string | null
  registeredAt: string
  lastActiveAt: string
  lastLoginAt: string
  loginCount: number
  clubCount: number
  eventCount: number
  reportCount: number
  warningCount: number
  roles: UserRole[]
  location: string | null
  // Present when suspended
  suspendedUntil?: string
  suspensionReason?: string
  // Present when banned
  bannedAt?: string
  banReason?: string
  // Present when pending deletion
  deletionRequestedAt?: string
  deletionScheduledFor?: string
}

export interface PlayerNote {
  id: string
  playerId: string
  clubId: string
  clubName: string
  category: NoteCategory
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

export interface PlayerWarning {
  id: string
  playerId: string
  clubId: string
  clubName: string
  warningType: WarningType
  description: string
  incidentDate: string
  expectedAction: string
  issuedById: string
  issuedByName: string
  issuedAt: string
  acknowledgedAt: string | null
  playerResponse: string | null
}

export interface MemberAction {
  id: string
  playerId: string
  clubId: string
  clubName: string
  actionType: 'suspension' | 'ban'
  reason: ActionReason
  description: string
  duration: ActionDuration
  startDate: string
  endDate: string | null
  issuedById: string
  issuedByName: string
  issuedAt: string
  appealStatus: AppealStatus
  appealNote: string | null
  liftedEarly: boolean
  liftedAt: string | null
  liftedById: string | null
}

export interface PlatformAction {
  id: string
  playerId: string
  actionType: ActionType
  reason: ActionReason
  description: string
  duration: ActionDuration | null
  startDate: string
  endDate: string | null
  issuedById: string
  issuedByName: string
  approvedById: string | null
  approvedByName: string | null
  issuedAt: string
  relatedEscalationId: string | null
}

export interface EscalationCase {
  id: string
  playerId: string
  playerName: string
  clubId: string
  clubName: string
  escalatedById: string
  escalatedByName: string
  escalatedAt: string
  reason: ActionReason
  description: string
  evidence: string[]
  clubActionTaken: string
  status: EscalationStatus
  priority: EscalationPriority
  assignedToId: string | null
  assignedToName: string | null
  reviewStartedAt: string | null
  resolvedAt: string | null
  resolution: EscalationResolution | null
  resolutionNotes: string | null
}

export interface GDPRRequest {
  id: string
  playerId: string
  playerName: string
  playerEmail: string
  requestType: GDPRRequestType
  requestedAt: string
  status: GDPRRequestStatus
  gracePeriodEnds: string | null
  dataExportGenerated: boolean
  dataExportUrl: string | null
  dataExportGeneratedAt: string | null
  processedAt: string | null
  processedById: string | null
  notes: string | null
}

export interface AdminNote {
  id: string
  playerId: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

export interface ActivityEvent {
  id: string
  playerId: string
  eventType: ActivityEventType
  description: string
  metadata: Record<string, unknown>
  occurredAt: string
}

export interface SavedSearch {
  id: string
  name: string
  description: string
  filters: Record<string, unknown>
  createdById: string
  createdByName: string
  createdAt: string
  isShared: boolean
}

// =============================================================================
// Search & Filter Types
// =============================================================================

export interface UserSearchFilters {
  query?: string
  accountStatus?: AccountStatus[]
  isEmailVerified?: boolean
  roles?: UserRole[]
  registeredAfter?: string
  registeredBefore?: string
  lastActiveAfter?: string
  lastActiveBefore?: string
  reportCountMin?: number
  warningCountMin?: number
  location?: string
}

export type UserSortField =
  | 'displayName'
  | 'email'
  | 'registeredAt'
  | 'lastActiveAt'
  | 'reportCount'
  | 'warningCount'

export type SortDirection = 'asc' | 'desc'

// =============================================================================
// Component Props
// =============================================================================

/**
 * Props for the Club Admin member management views
 */
export interface ClubMemberManagementProps {
  /** The player being viewed/managed */
  player: UserAccount
  /** Notes about this player at this club */
  notes: PlayerNote[]
  /** Warnings issued to this player at this club */
  warnings: PlayerWarning[]
  /** Suspensions/bans issued to this player at this club */
  actions: MemberAction[]
  /** Activity events for this player */
  activityEvents: ActivityEvent[]
  /** Current club context */
  clubId: string
  clubName: string
  /** Whether the current user can issue warnings */
  canWarn?: boolean
  /** Whether the current user can suspend/ban */
  canSuspend?: boolean
  /** Whether the current user can escalate to platform */
  canEscalate?: boolean
  /** Called when adding a new note */
  onAddNote?: (note: Omit<PlayerNote, 'id' | 'createdAt' | 'authorId' | 'authorName'>) => void
  /** Called when issuing a warning */
  onIssueWarning?: (warning: Omit<PlayerWarning, 'id' | 'issuedAt' | 'issuedById' | 'issuedByName' | 'acknowledgedAt' | 'playerResponse'>) => void
  /** Called when suspending a member */
  onSuspend?: (action: Omit<MemberAction, 'id' | 'issuedAt' | 'issuedById' | 'issuedByName' | 'appealStatus' | 'appealNote' | 'liftedEarly' | 'liftedAt' | 'liftedById'>) => void
  /** Called when banning a member */
  onBan?: (action: Omit<MemberAction, 'id' | 'issuedAt' | 'issuedById' | 'issuedByName' | 'appealStatus' | 'appealNote' | 'liftedEarly' | 'liftedAt' | 'liftedById'>) => void
  /** Called when lifting a suspension early */
  onLiftSuspension?: (actionId: string) => void
  /** Called when escalating to platform review */
  onEscalate?: (escalation: Omit<EscalationCase, 'id' | 'escalatedAt' | 'escalatedById' | 'escalatedByName' | 'status' | 'priority' | 'assignedToId' | 'assignedToName' | 'reviewStartedAt' | 'resolvedAt' | 'resolution' | 'resolutionNotes'>) => void
}

/**
 * Props for the Super Admin user search and list view
 */
export interface UserSearchProps {
  /** List of users matching current search/filters */
  users: UserAccount[]
  /** Total count of matching users (for pagination) */
  totalCount: number
  /** Current page number (1-indexed) */
  currentPage: number
  /** Number of results per page */
  pageSize: number
  /** Current search filters */
  filters: UserSearchFilters
  /** Current sort field */
  sortField: UserSortField
  /** Current sort direction */
  sortDirection: SortDirection
  /** Saved search presets */
  savedSearches: SavedSearch[]
  /** Whether search is currently loading */
  isLoading?: boolean
  /** Called when filters change */
  onFilterChange?: (filters: UserSearchFilters) => void
  /** Called when sort changes */
  onSortChange?: (field: UserSortField, direction: SortDirection) => void
  /** Called when page changes */
  onPageChange?: (page: number) => void
  /** Called when selecting a user to view details */
  onSelectUser?: (userId: string) => void
  /** Called when saving current search as preset */
  onSaveSearch?: (name: string, description: string) => void
  /** Called when loading a saved search */
  onLoadSearch?: (searchId: string) => void
  /** Called when deleting a saved search */
  onDeleteSearch?: (searchId: string) => void
  /** Called when exporting search results */
  onExportResults?: () => void
}

/**
 * Props for the Super Admin user detail view
 */
export interface UserDetailProps {
  /** The user being viewed */
  user: UserAccount
  /** Complete activity timeline */
  activityEvents: ActivityEvent[]
  /** Platform-level admin notes */
  adminNotes: AdminNote[]
  /** Platform-level actions taken */
  platformActions: PlatformAction[]
  /** Club-level notes (aggregated from all clubs) */
  clubNotes: PlayerNote[]
  /** Club-level warnings (aggregated from all clubs) */
  clubWarnings: PlayerWarning[]
  /** Club-level actions (aggregated from all clubs) */
  clubActions: MemberAction[]
  /** Escalation cases involving this user */
  escalationCases: EscalationCase[]
  /** GDPR requests from this user */
  gdprRequests: GDPRRequest[]
  /** Whether the current admin can issue platform actions */
  canTakeAction?: boolean
  /** Whether the current admin can impersonate */
  canImpersonate?: boolean
  /** Whether the current admin can process GDPR requests */
  canProcessGDPR?: boolean
  /** Called when adding an admin note */
  onAddNote?: (content: string) => void
  /** Called when issuing a platform warning */
  onIssuePlatformWarning?: (action: Omit<PlatformAction, 'id' | 'issuedAt' | 'issuedById' | 'issuedByName' | 'approvedById' | 'approvedByName'>) => void
  /** Called when issuing a platform suspension */
  onIssuePlatformSuspension?: (action: Omit<PlatformAction, 'id' | 'issuedAt' | 'issuedById' | 'issuedByName' | 'approvedById' | 'approvedByName'>) => void
  /** Called when issuing a platform ban (requires approval) */
  onIssuePlatformBan?: (action: Omit<PlatformAction, 'id' | 'issuedAt' | 'issuedById' | 'issuedByName' | 'approvedById' | 'approvedByName'>) => void
  /** Called when resetting user's password */
  onResetPassword?: () => void
  /** Called when starting impersonation session */
  onImpersonate?: () => void
  /** Called when initiating account merge */
  onMergeAccount?: (targetUserId: string) => void
  /** Called when processing a GDPR export request */
  onProcessGDPRExport?: (requestId: string) => void
  /** Called when processing a GDPR deletion request */
  onProcessGDPRDeletion?: (requestId: string) => void
  /** Called when navigating back to search */
  onBack?: () => void
}

/**
 * Props for the Platform Review Queue
 */
export interface PlatformReviewQueueProps {
  /** List of escalation cases */
  cases: EscalationCase[]
  /** Current filter (status) */
  statusFilter: EscalationStatus | 'all'
  /** Current filter (priority) */
  priorityFilter: EscalationPriority | 'all'
  /** Whether data is loading */
  isLoading?: boolean
  /** Called when filter changes */
  onFilterChange?: (status: EscalationStatus | 'all', priority: EscalationPriority | 'all') => void
  /** Called when selecting a case to review */
  onSelectCase?: (caseId: string) => void
  /** Called when assigning a case to self */
  onAssignToSelf?: (caseId: string) => void
}

/**
 * Props for the Escalation Case Detail view
 */
export interface EscalationCaseDetailProps {
  /** The escalation case */
  escalationCase: EscalationCase
  /** The user being reviewed */
  user: UserAccount
  /** User's activity timeline */
  activityEvents: ActivityEvent[]
  /** User's club memberships and status at each */
  clubMemberships: Array<{
    clubId: string
    clubName: string
    status: 'active' | 'suspended' | 'banned'
    warnings: number
  }>
  /** Previous escalations for this user */
  previousEscalations: EscalationCase[]
  /** Whether the admin can resolve the case */
  canResolve?: boolean
  /** Called when requesting more info from club admin */
  onRequestMoreInfo?: (message: string) => void
  /** Called when adding internal note */
  onAddInternalNote?: (note: string) => void
  /** Called when resolving with no platform action */
  onResolveNoAction?: (notes: string) => void
  /** Called when resolving with platform warning */
  onResolveWithWarning?: (action: Omit<PlatformAction, 'id' | 'issuedAt' | 'issuedById' | 'issuedByName' | 'approvedById' | 'approvedByName'>, notes: string) => void
  /** Called when resolving with platform suspension */
  onResolveWithSuspension?: (action: Omit<PlatformAction, 'id' | 'issuedAt' | 'issuedById' | 'issuedByName' | 'approvedById' | 'approvedByName'>, notes: string) => void
  /** Called when resolving with platform ban */
  onResolveWithBan?: (action: Omit<PlatformAction, 'id' | 'issuedAt' | 'issuedById' | 'issuedByName' | 'approvedById' | 'approvedByName'>, notes: string) => void
  /** Called when navigating back to queue */
  onBack?: () => void
}

/**
 * Props for the GDPR Compliance view
 */
export interface GDPRComplianceProps {
  /** List of GDPR requests */
  requests: GDPRRequest[]
  /** Current filter (status) */
  statusFilter: GDPRRequestStatus | 'all'
  /** Current filter (type) */
  typeFilter: GDPRRequestType | 'all'
  /** Whether data is loading */
  isLoading?: boolean
  /** Called when filter changes */
  onFilterChange?: (status: GDPRRequestStatus | 'all', type: GDPRRequestType | 'all') => void
  /** Called when viewing request details */
  onViewRequest?: (requestId: string) => void
  /** Called when generating data export */
  onGenerateExport?: (requestId: string) => void
  /** Called when processing deletion */
  onProcessDeletion?: (requestId: string) => void
  /** Called when cancelling a pending deletion (user-initiated) */
  onCancelDeletion?: (requestId: string) => void
}
