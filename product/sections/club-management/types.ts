// =============================================================================
// Core Admin Types
// =============================================================================

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin'
  photoUrl: string
  lastActiveAt: string
}

export interface Location {
  city: string
  state: string
}

// =============================================================================
// Club Management Types
// =============================================================================

export type ClubTier = 'free' | 'pro' | 'elite' | 'community_impact'
export type ClubTierSource = 'subscription' | 'override' | 'approved_nonprofit'
export type AdminClubStatus = 'active' | 'suspended' | 'under_review' | 'flagged' | 'archived'
export type ClubFlag =
  | 'rapid_creation'
  | 'temp_email'
  | 'no_events'
  | 'approaching_event_limit'
  | 'ownership_dispute'
  | 'low_activity'
  | 'no_admin'
  | 'inactive_90_days'
  | 'orphaned'

export interface AdminClub {
  id: string
  name: string
  slug: string
  ownerName: string
  ownerEmail: string
  ownerId: string
  location: Location
  tier: ClubTier
  tierSource: ClubTierSource
  status: AdminClubStatus
  suspendedAt?: string
  suspendedReason?: string
  suspendedById?: string
  reviewReason?: string
  flaggedReason?: string
  memberCount: number
  eventCount: number
  eventsThisMonth: number
  revenueThisMonth: number
  activityScore: number
  flags: ClubFlag[]
  createdAt: string
  lastActivityAt: string
  nonProfitVerifiedAt?: string
  nonProfitReVerifyDate?: string
}

// =============================================================================
// Non-Profit Application Types
// =============================================================================

export type OrganizationType = '501c3' | 'parks_rec' | 'ymca' | 'community_center' | 'library' | 'other'
export type NonProfitApplicationStatus = 'pending' | 'approved' | 'rejected' | 'needs_info'

export interface AdminNote {
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

export interface NonProfitApplication {
  id: string
  clubId: string
  clubName: string
  organizationType: OrganizationType
  organizationName: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  emailDomain: string
  ein: string | null
  submittedDocuments: string[]
  status: NonProfitApplicationStatus
  submittedAt: string
  reviewedAt?: string
  reviewedById?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  requestedInfo?: string
  notes: AdminNote[]
  autoApprovalEligible?: boolean
  autoApprovalReason?: string
  reVerificationDate?: string
}

// =============================================================================
// Subscription Override Types
// =============================================================================

export type OverrideReason = 'partnership' | 'contest_winner' | 'goodwill' | 'beta_tester' | 'other'

export interface SubscriptionOverride {
  id: string
  clubId: string
  clubName: string
  originalTier: ClubTier
  overrideTier: ClubTier
  reason: OverrideReason
  reasonDetails: string
  isPermanent: boolean
  expiresAt: string | null
  createdAt: string
  createdById: string
  createdByName: string
  notifiedOwner: boolean
  notifiedAt: string
}

// =============================================================================
// Ownership Dispute Types
// =============================================================================

export type DisputeType = 'club' | 'venue'
export type DisputeStatus = 'pending' | 'resolved' | 'appealed'
export type DisputePriority = 'low' | 'standard' | 'urgent'
export type DisputeResolution = 'transfer' | 'co_admin' | 'rejected' | 'deleted' | 'merged'
export type DisputeClaimReason = 'venue_ownership' | 'unauthorized_creation' | 'dormant_reclaim' | 'impersonation'

export interface DisputeParty {
  id: string
  name: string
  email: string
}

export type TimelineEntryType =
  | 'submitted'
  | 'auto_action'
  | 'admin_note'
  | 'admin_action'
  | 'owner_response'
  | 'resolution'
  | 'appeal'

export interface TimelineEntry {
  type: TimelineEntryType
  content: string
  createdAt: string
  authorId?: string
  authorName?: string
}

export interface OwnershipDispute {
  id: string
  type: DisputeType
  entityId: string
  entityName: string
  status: DisputeStatus
  priority: DisputePriority
  currentOwner: DisputeParty
  claimant: DisputeParty
  claimReason: DisputeClaimReason
  claimDescription: string
  submittedEvidence: string[]
  createdAt: string
  lastUpdatedAt: string
  resolvedAt?: string
  resolution?: DisputeResolution
  resolutionDetails?: string
  resolvedById?: string
  resolvedByName?: string
  appealedAt?: string
  appealReason?: string
  timeline: TimelineEntry[]
  assignedToId?: string
  assignedToName?: string
}

// =============================================================================
// Platform Escalation Types
// =============================================================================

export type EscalationStatus = 'new' | 'in_review' | 'resolved'
export type EscalationPriority = 'standard' | 'urgent'
export type EscalationReason =
  | 'harassment'
  | 'fraud'
  | 'unsportsmanlike'
  | 'safety_threat'
  | 'impersonation'
  | 'other'
export type EscalationResolution =
  | 'no_action'
  | 'platform_warning'
  | 'platform_suspension'
  | 'platform_ban'

export interface ReportedUser {
  id: string
  name: string
  email: string
  photoUrl: string | null
}

export interface EscalatingClub {
  id: string
  name: string
}

export interface EscalatingAdmin {
  id: string
  name: string
  email: string
}

export interface PlatformEscalation {
  id: string
  status: EscalationStatus
  priority: EscalationPriority
  reportedUser: ReportedUser
  escalatingClub: EscalatingClub
  escalatingAdmin: EscalatingAdmin
  reason: EscalationReason
  description: string
  evidence: string[]
  clubActionTaken: string
  otherClubsAffected: string[]
  previousEscalations: number
  crossClubWarnings: number
  createdAt: string
  lastUpdatedAt: string
  assignedToId?: string
  assignedToName?: string
  resolvedAt?: string
  resolution?: EscalationResolution
  resolutionDetails?: string
  resolvedById?: string
  resolvedByName?: string
  secondApprovalById?: string
  secondApprovalByName?: string
  notes: AdminNote[]
}

// =============================================================================
// Suspicious Activity Types
// =============================================================================

export type AlertType =
  | 'rapid_creation'
  | 'mass_invitations'
  | 'duplicate_names'
  | 'payment_failures'
  | 'report_spike'
  | 'geographic_anomaly'
export type AlertSeverity = 'low' | 'medium' | 'high'
export type AlertStatus = 'pending' | 'investigating' | 'resolved'
export type AlertResolutionAction = 'suspended' | 'verified' | 'false_positive'

export interface SuspiciousActivityAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  status: AlertStatus
  title: string
  description: string
  userId?: string
  userName?: string
  userEmail?: string
  clubId?: string
  clubName?: string
  relatedEntityIds: string[]
  detectedAt: string
  indicators: string[]
  assignedToId?: string
  resolvedAt?: string
  resolvedById?: string
  resolvedAction?: AlertResolutionAction
  resolutionNotes?: string
}

// =============================================================================
// Rate Limit Types
// =============================================================================

export interface RateLimitConfig {
  maxClubsPerUser: number
  maxVenuesPerUser: number
  minAccountAgeDays: number
  requireVerifiedEmail: boolean
  maxInvitationsPerDay: number
  maxEventsPerDayFree: number
  lastUpdatedAt: string
  lastUpdatedById: string
}

export type ExceptionType = 'max_clubs' | 'max_venues' | 'max_invitations' | 'account_age'

export interface RateLimitException {
  id: string
  userId: string
  userName: string
  userEmail: string
  exceptionType: ExceptionType
  originalLimit: number
  newLimit: number
  reason: string
  grantedAt: string
  grantedById: string
  grantedByName: string
  expiresAt: string | null
  isPermanent: boolean
}

// =============================================================================
// Audit Log Types
// =============================================================================

export type AuditAction =
  | 'club_suspended'
  | 'club_unsuspended'
  | 'club_deleted'
  | 'club_ownership_transferred'
  | 'club_ownership_contacted'
  | 'nonprofit_approved'
  | 'nonprofit_rejected'
  | 'nonprofit_info_requested'
  | 'override_created'
  | 'override_expired'
  | 'override_removed'
  | 'dispute_assigned'
  | 'dispute_resolved'
  | 'escalation_assigned'
  | 'escalation_resolved'
  | 'platform_warning_issued'
  | 'platform_suspension_issued'
  | 'platform_ban_issued'
  | 'alert_resolved'
  | 'rate_limit_exception_granted'
  | 'rate_limit_exception_revoked'
  | 'rate_limit_config_updated'

export type AuditTargetType =
  | 'club'
  | 'user'
  | 'nonprofit_application'
  | 'ownership_dispute'
  | 'platform_escalation'
  | 'suspicious_activity'
  | 'system_config'

export interface AuditLogEntry {
  id: string
  action: AuditAction
  adminId: string
  adminName: string
  targetType: AuditTargetType
  targetId: string
  targetName: string
  details: string
  timestamp: string
}

// =============================================================================
// Dashboard Stats
// =============================================================================

export interface DashboardStats {
  totalClubs: number
  activeClubs: number
  suspendedClubs: number
  underReviewClubs: number
  flaggedClubs: number
  pendingNonProfitApplications: number
  activeOverrides: number
  openDisputes: number
  openEscalations: number
  pendingAlerts: number
  clubsCreatedThisWeek: number
  clubsCreatedThisMonth: number
}

// =============================================================================
// Component Props
// =============================================================================

/** Props for the main Club Management dashboard */
export interface ClubManagementDashboardProps {
  stats: DashboardStats
  recentAuditLog: AuditLogEntry[]
  pendingAlerts: SuspiciousActivityAlert[]
  currentAdmin: AdminUser
  onViewAllClubs?: () => void
  onViewNonProfitQueue?: () => void
  onViewDisputes?: () => void
  onViewEscalations?: () => void
  onViewAlerts?: () => void
  onViewAuditLog?: () => void
}

/** Props for the club list view */
export interface ClubListProps {
  clubs: AdminClub[]
  onViewClub?: (clubId: string) => void
  onSuspendClub?: (clubId: string, reason: string) => void
  onUnsuspendClub?: (clubId: string) => void
  onDeleteClub?: (clubId: string) => void
  onTransferOwnership?: (clubId: string, newOwnerId: string) => void
  onSearch?: (query: string) => void
  onFilterByStatus?: (status: AdminClubStatus | 'all') => void
  onFilterByTier?: (tier: ClubTier | 'all') => void
  onFilterByFlag?: (flag: ClubFlag | 'all') => void
  onExport?: () => void
}

/** Props for the club detail view */
export interface ClubDetailProps {
  club: AdminClub
  auditLog: AuditLogEntry[]
  onSuspend?: (reason: string) => void
  onUnsuspend?: () => void
  onDelete?: () => void
  onTransferOwnership?: (newOwnerId: string) => void
  onAddNote?: (content: string) => void
  onOverrideTier?: (tier: ClubTier, reason: string, expiresAt?: string) => void
  onBack?: () => void
}

/** Props for the non-profit application queue */
export interface NonProfitQueueProps {
  applications: NonProfitApplication[]
  onViewApplication?: (applicationId: string) => void
  onApprove?: (applicationId: string, notes?: string) => void
  onReject?: (applicationId: string, reason: string) => void
  onRequestInfo?: (applicationId: string, request: string) => void
  onBulkProcess?: (applicationIds: string[], action: 'approve' | 'reject') => void
  onFilterByStatus?: (status: NonProfitApplicationStatus | 'all') => void
  onFilterByType?: (type: OrganizationType | 'all') => void
}

/** Props for the subscription overrides view */
export interface SubscriptionOverridesProps {
  overrides: SubscriptionOverride[]
  onCreateOverride?: (clubId: string, tier: ClubTier, reason: OverrideReason, details: string, expiresAt?: string) => void
  onRemoveOverride?: (overrideId: string) => void
  onExtendOverride?: (overrideId: string, newExpiresAt: string) => void
  onFilterByReason?: (reason: OverrideReason | 'all') => void
  onFilterByExpiring?: (withinDays: number) => void
}

/** Props for the ownership disputes view */
export interface OwnershipDisputesProps {
  disputes: OwnershipDispute[]
  onViewDispute?: (disputeId: string) => void
  onAssignDispute?: (disputeId: string, adminId: string) => void
  onResolve?: (disputeId: string, resolution: DisputeResolution, details: string) => void
  onAddNote?: (disputeId: string, content: string) => void
  onContactParty?: (disputeId: string, partyType: 'owner' | 'claimant') => void
  onFilterByStatus?: (status: DisputeStatus | 'all') => void
  onFilterByType?: (type: DisputeType | 'all') => void
  onFilterByPriority?: (priority: DisputePriority | 'all') => void
}

/** Props for the platform escalations view */
export interface PlatformEscalationsProps {
  escalations: PlatformEscalation[]
  currentAdmin: AdminUser
  onViewEscalation?: (escalationId: string) => void
  onAssign?: (escalationId: string, adminId: string) => void
  onResolve?: (escalationId: string, resolution: EscalationResolution, details: string) => void
  onAddNote?: (escalationId: string, content: string) => void
  onRequestInfo?: (escalationId: string, request: string) => void
  onSecondApproval?: (escalationId: string) => void
  onFilterByStatus?: (status: EscalationStatus | 'all') => void
  onFilterByPriority?: (priority: EscalationPriority | 'all') => void
  onFilterByReason?: (reason: EscalationReason | 'all') => void
}

/** Props for the suspicious activity alerts view */
export interface SuspiciousActivityProps {
  alerts: SuspiciousActivityAlert[]
  onViewAlert?: (alertId: string) => void
  onInvestigate?: (alertId: string) => void
  onResolve?: (alertId: string, action: AlertResolutionAction, notes: string) => void
  onSuspendEntity?: (alertId: string) => void
  onRequestVerification?: (alertId: string) => void
  onFilterByType?: (type: AlertType | 'all') => void
  onFilterBySeverity?: (severity: AlertSeverity | 'all') => void
  onFilterByStatus?: (status: AlertStatus | 'all') => void
}

/** Props for the rate limit management view */
export interface RateLimitManagementProps {
  config: RateLimitConfig
  exceptions: RateLimitException[]
  onUpdateConfig?: (updates: Partial<RateLimitConfig>) => void
  onGrantException?: (userId: string, type: ExceptionType, newLimit: number, reason: string, expiresAt?: string) => void
  onRevokeException?: (exceptionId: string) => void
  onFilterExceptions?: (type: ExceptionType | 'all') => void
}

/** Props for the audit log view */
export interface AuditLogProps {
  entries: AuditLogEntry[]
  onFilterByAction?: (action: AuditAction | 'all') => void
  onFilterByAdmin?: (adminId: string | 'all') => void
  onFilterByTargetType?: (type: AuditTargetType | 'all') => void
  onFilterByDateRange?: (start: string, end: string) => void
  onExport?: () => void
  onViewTarget?: (targetType: AuditTargetType, targetId: string) => void
}
