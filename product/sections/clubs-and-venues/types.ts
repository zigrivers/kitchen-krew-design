// =============================================================================
// Data Types
// =============================================================================

/** Location with city and state */
export interface Location {
  city: string
  state: string
}

/** Full address with coordinates */
export interface Address {
  street: string
  city: string
  state: string
  zip: string
}

export interface Coordinates {
  lat: number
  lng: number
}

/** Operating hours for a single day */
export interface DayHours {
  open: string
  close: string
}

/** Weekly operating hours */
export interface OperatingHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

/** A pickleball club/organization */
export interface Club {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string | null
  location: Location
  contactEmail: string
  websiteUrl: string | null
  membershipType: 'open' | 'closed'
  visibility: 'public' | 'unlisted'
  memberCount: number
  activeThisMonth: number
  upcomingEvents: number
  linkedVenueIds: string[]
  createdAt: string
  isUserMember: boolean
  userRole: 'admin' | 'member' | null
  pendingRequest?: boolean
}

/** A physical venue where pickleball is played */
export interface Venue {
  id: string
  name: string
  address: Address
  coordinates: Coordinates
  description: string
  photoUrls: string[]
  amenities: string[]
  operatingHours: OperatingHours
  courtCount: number
  linkedClubId: string | null
  averageRating: number
  reviewCount: number
  isTemporarilyClosed: boolean
  temporarilyClosedMessage: string | null
  isVerified: boolean
}

/** An individual court at a venue */
export interface Court {
  id: string
  venueId: string
  name: string
  indoor: boolean
  surface: 'sport_court' | 'concrete' | 'asphalt' | 'wood' | 'other'
  lighting: boolean
  status: 'active' | 'maintenance' | 'inactive'
  notes: string | null
}

/** A player's membership in a club */
export interface ClubMember {
  id: string
  clubId: string
  playerId: string
  playerName: string
  playerAvatarUrl: string | null
  skillRating: number
  role: 'admin' | 'member'
  status: 'active' | 'suspended'
  joinedAt: string
  lastActiveAt: string
  gamesPlayed: number
  isGameManager: boolean
  suspensionReason?: string
  suspensionEndsAt?: string
}

/** A pending request to join a club */
export interface MembershipRequest {
  id: string
  clubId: string
  playerId: string
  playerName: string
  playerAvatarUrl: string | null
  skillRating: number
  message: string | null
  requestedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

/** A sub-group within a club for organizing members */
export interface SubGroup {
  id: string
  clubId: string
  name: string
  description: string
  memberCount: number
  color: string
}

/** A player's review of a venue */
export interface VenueReview {
  id: string
  venueId: string
  playerId: string
  playerName: string
  rating: number
  courtQuality: number
  amenities: number
  parking: number
  accessibility: number
  comment: string
  createdAt: string
  helpfulCount: number
  adminResponse: string | null
  isVerified: boolean
}

/** Membership trend data point */
export interface MembershipTrendPoint {
  date: string
  total: number
  new: number
  churned: number
}

/** Top game manager stats */
export interface TopGameManager {
  playerId: string
  name: string
  eventsHosted: number
}

/** Club analytics summary */
export interface ClubAnalytics {
  clubId: string
  period: 'week' | 'month' | 'year'
  membershipTrend: MembershipTrendPoint[]
  eventsHosted: {
    thisMonth: number
    lastMonth: number
    total: number
  }
  gamesPlayed: {
    thisMonth: number
    lastMonth: number
    total: number
  }
  activeMembers: {
    thisMonth: number
    lastMonth: number
    percentOfTotal: number
  }
  topGameManagers: TopGameManager[]
}

/** QR code type identifier */
export type QRCodeType = 'club_invite' | 'app_download' | 'event_registration' | 'check_in'

/** A generated QR code for sharing */
export interface QRCode {
  id: string
  type: QRCodeType
  /** The entity this QR code is for (club, event, etc.) */
  entityId: string
  entityName: string
  /** The URL encoded in the QR code */
  targetUrl: string
  /** When the QR code was generated */
  createdAt: string
  /** Optional expiration date */
  expiresAt: string | null
  /** Number of times the QR code has been scanned */
  scanCount: number
  /** Number of conversions (signups, registrations) from this QR */
  conversionCount: number
  /** Whether this QR code is currently active */
  isActive: boolean
  /** Optional club logo/branding to embed in QR */
  brandingLogoUrl: string | null
  /** UTM parameters for tracking */
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
}

/** Configuration options for generating a QR code */
export interface QRCodeConfig {
  type: QRCodeType
  entityId: string
  /** Include club branding/logo in QR code */
  includeBranding: boolean
  /** Set expiration date (null for no expiration) */
  expiresAt: string | null
  /** UTM campaign name for tracking */
  utmCampaign: string | null
}

/** Current logged-in user context */
export interface CurrentUser {
  id: string
  name: string
  isClubAdmin: boolean
  isVenueAdmin: boolean
  myClubs: string[]
  pendingRequests: string[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface ClubsVenuesProps {
  /** Current logged-in user */
  currentUser: CurrentUser
  /** All clubs to display */
  clubs: Club[]
  /** All venues to display */
  venues: Venue[]
  /** Courts for venue detail views */
  courts: Court[]
  /** Members for club detail/management views */
  members: ClubMember[]
  /** Pending membership requests (for club admins) */
  membershipRequests: MembershipRequest[]
  /** Sub-groups within clubs */
  subGroups: SubGroup[]
  /** Reviews for venue detail views */
  venueReviews: VenueReview[]
  /** Analytics for club admin dashboard */
  clubAnalytics: ClubAnalytics | null

  // Club actions
  /** Called when user wants to view a club's details */
  onViewClub?: (clubId: string) => void
  /** Called when user wants to join a club */
  onJoinClub?: (clubId: string) => void
  /** Called when user wants to leave a club */
  onLeaveClub?: (clubId: string) => void
  /** Called when user cancels a pending membership request */
  onCancelRequest?: (clubId: string) => void
  /** Called when admin edits club profile */
  onEditClub?: (clubId: string) => void
  /** Called when admin creates a new club */
  onCreateClub?: () => void
  /** Called when admin archives/deletes a club */
  onArchiveClub?: (clubId: string) => void
  /** Called when admin transfers club ownership to another admin */
  onTransferOwnership?: (clubId: string, newOwnerId: string) => void

  // Member management actions
  /** Called when admin approves a membership request */
  onApproveMember?: (requestId: string) => void
  /** Called when admin rejects a membership request */
  onRejectMember?: (requestId: string, message?: string) => void
  /** Called when admin removes a member */
  onRemoveMember?: (memberId: string) => void
  /** Called when admin suspends a member */
  onSuspendMember?: (memberId: string, reason: string, endDate: string) => void
  /** Called when admin promotes member to admin */
  onPromoteToAdmin?: (memberId: string) => void
  /** Called when admin assigns Game Manager role */
  onAssignGameManager?: (memberId: string) => void
  /** Called when admin invites a player to join */
  onInviteMember?: (email: string) => void

  // Sub-group actions
  /** Called when admin creates a sub-group */
  onCreateSubGroup?: (clubId: string) => void
  /** Called when admin edits a sub-group */
  onEditSubGroup?: (groupId: string) => void
  /** Called when admin deletes a sub-group */
  onDeleteSubGroup?: (groupId: string) => void

  // Venue actions
  /** Called when user wants to view a venue's details */
  onViewVenue?: (venueId: string) => void
  /** Called when admin edits venue info */
  onEditVenue?: (venueId: string) => void
  /** Called when admin creates a new venue */
  onCreateVenue?: () => void
  /** Called when admin archives/deletes a venue */
  onArchiveVenue?: (venueId: string) => void
  /** Called when user submits a claim request for a venue */
  onClaimVenue?: (venueId: string, claimData: Omit<VenueClaimRequest, 'id' | 'venueId' | 'claimantId' | 'claimantName' | 'status' | 'submittedAt' | 'reviewedAt' | 'reviewedBy' | 'rejectionReason'>) => void
  /** Called when admin sets venue as temporarily closed */
  onSetTemporarilyClosed?: (venueId: string, message: string | null) => void

  // Court actions
  /** Called when admin adds a court */
  onAddCourt?: (venueId: string) => void
  /** Called when admin bulk-adds multiple courts */
  onBulkAddCourts?: (venueId: string, count: number, indoor: boolean, surface: Court['surface']) => void
  /** Called when admin edits a court */
  onEditCourt?: (courtId: string) => void
  /** Called when admin reorders courts */
  onReorderCourts?: (venueId: string, courtIds: string[]) => void
  /** Called when admin marks court for maintenance */
  onSetCourtMaintenance?: (courtId: string, notes: string) => void
  /** Called when admin deletes a court */
  onDeleteCourt?: (courtId: string) => void

  // Review actions
  /** Called when user submits a venue review */
  onSubmitReview?: (venueId: string, review: Omit<VenueReview, 'id' | 'venueId' | 'playerId' | 'playerName' | 'createdAt' | 'helpfulCount' | 'adminResponse' | 'isVerified'>) => void
  /** Called when user marks a review as helpful */
  onMarkHelpful?: (reviewId: string) => void
  /** Called when admin responds to a review */
  onRespondToReview?: (reviewId: string, response: string) => void

  // Navigation
  /** Called when user wants to view a player's profile */
  onViewPlayer?: (playerId: string) => void
  /** Called when user wants to get directions to a venue */
  onGetDirections?: (venueId: string) => void

  // QR Code actions
  /** Called when admin generates a club invitation QR code */
  onGenerateInviteQR?: (clubId: string, config?: Partial<QRCodeConfig>) => void
  /** Called when admin generates an app download QR code with optional club branding */
  onGenerateAppDownloadQR?: (clubId: string | null, includeBranding?: boolean) => void
  /** Called when admin regenerates a QR code (invalidates old one) */
  onRegenerateQR?: (qrCodeId: string) => void
  /** Called when user downloads a QR code */
  onDownloadQR?: (qrCodeId: string, format: 'png' | 'svg') => void
  /** Called when admin deactivates a QR code */
  onDeactivateQR?: (qrCodeId: string) => void
}

// =============================================================================
// Sub-component Props
// =============================================================================

export interface ClubCardProps {
  club: Club
  onView?: () => void
  onJoin?: () => void
  onLeave?: () => void
}

export interface ClubDetailProps {
  club: Club
  members: ClubMember[]
  subGroups: SubGroup[]
  linkedVenues: Venue[]
  isAdmin: boolean
  onEdit?: () => void
  onJoin?: () => void
  onLeave?: () => void
  onViewMember?: (memberId: string) => void
}

export interface MemberListProps {
  members: ClubMember[]
  isAdmin: boolean
  onViewMember?: (memberId: string) => void
  onRemoveMember?: (memberId: string) => void
  onPromoteToAdmin?: (memberId: string) => void
  onSuspendMember?: (memberId: string) => void
}

export interface MembershipRequestListProps {
  requests: MembershipRequest[]
  onApprove?: (requestId: string) => void
  onReject?: (requestId: string, message?: string) => void
  onViewPlayer?: (playerId: string) => void
}

export interface VenueCardProps {
  venue: Venue
  distance?: number
  onView?: () => void
  onGetDirections?: () => void
}

export interface VenueDetailProps {
  venue: Venue
  courts: Court[]
  reviews: VenueReview[]
  linkedClub: Club | null
  isAdmin: boolean
  onEdit?: () => void
  onSubmitReview?: () => void
  onGetDirections?: () => void
}

export interface CourtListProps {
  courts: Court[]
  isAdmin: boolean
  onAddCourt?: () => void
  onEditCourt?: (courtId: string) => void
  onReorder?: (courtIds: string[]) => void
}

export interface VenueReviewListProps {
  reviews: VenueReview[]
  isVenueAdmin: boolean
  onMarkHelpful?: (reviewId: string) => void
  onRespond?: (reviewId: string) => void
}

export interface ClubAnalyticsDashboardProps {
  analytics: ClubAnalytics
  onExport?: () => void
}

export interface QRCodeGeneratorProps {
  /** The QR code to display (if already generated) */
  qrCode: QRCode | null
  /** The club for branding options */
  club: Club | null
  /** Available QR code types to generate */
  availableTypes: QRCodeType[]
  /** Whether QR code is currently being generated */
  isGenerating: boolean
  /** Called when user generates a new QR code */
  onGenerate?: (config: QRCodeConfig) => void
  /** Called when user regenerates the QR code */
  onRegenerate?: () => void
  /** Called when user downloads the QR code */
  onDownload?: (format: 'png' | 'svg') => void
  /** Called when user copies the link to clipboard */
  onCopyLink?: () => void
  /** Called when modal is closed */
  onClose?: () => void
}

// =============================================================================
// Onboarding & Subscription Types
// =============================================================================

/** Subscription tier for clubs */
export type SubscriptionTier = 'community' | 'pro' | 'elite'

/** Features and limits for each subscription tier */
export interface TierLimits {
  tier: SubscriptionTier
  name: string
  price: number // monthly price in USD, 0 for free
  annualPrice: number | null // annual price with discount
  eventsPerMonth: number | null // null = unlimited
  maxCourts: number | null
  maxPlayersPerEvent: number | null
  maxGameManagers: number | null
  transactionFeePercent: number
  features: string[]
}

/** Club subscription status */
export interface ClubSubscription {
  clubId: string
  tier: SubscriptionTier
  status: 'active' | 'trial' | 'past_due' | 'cancelled'
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEndsAt: string | null
  cancelAtPeriodEnd: boolean
}

/** Usage metrics against tier limits */
export interface ClubUsage {
  clubId: string
  eventsThisMonth: number
  courtsConfigured: number
  gameManagersAssigned: number
  maxPlayersInEvents: number
  limits: TierLimits
}

/** Onboarding wizard step identifier */
export type OnboardingStep = 'club_setup' | 'venue_setup' | 'subscription' | 'first_event' | 'invite_members'

/** Data collected during onboarding wizard */
export interface OnboardingData {
  /** Current step in the wizard */
  currentStep: OnboardingStep
  /** Whether user can proceed to next step */
  canProceed: boolean
  /** Club data being collected */
  club: {
    name: string
    description: string
    logoUrl: string | null
    contactEmail: string
    contactPhone: string | null
    location: Location
    membershipType: 'open' | 'closed'
    visibility: 'public' | 'unlisted'
  }
  /** Venue data being collected (optional) */
  venue: {
    hasVenue: boolean
    name: string
    address: Address | null
    courtCount: number
    indoor: boolean
    surface: Court['surface']
  } | null
  /** Selected subscription tier */
  subscription: {
    tier: SubscriptionTier
    billingCycle: 'monthly' | 'annual'
  }
  /** First event data (optional) */
  firstEvent: {
    createEvent: boolean
    template: 'open_play' | 'round_robin' | 'ladder' | null
    dateTime: string | null
    recurring: boolean
  } | null
  /** Progress tracking */
  completedSteps: OnboardingStep[]
  /** Last saved timestamp */
  lastSavedAt: string | null
}

/** Venue claim request for claiming admin rights */
export interface VenueClaimRequest {
  id: string
  venueId: string
  claimantId: string
  claimantName: string
  relationship: 'owner' | 'manager' | 'authorized_rep'
  contactEmail: string
  contactPhone: string | null
  supportingDocUrl: string | null
  message: string | null
  status: 'pending' | 'approved' | 'rejected' | 'disputed'
  submittedAt: string
  reviewedAt: string | null
  reviewedBy: string | null
  rejectionReason: string | null
}

// =============================================================================
// Onboarding Component Props
// =============================================================================

export interface OnboardingWizardProps {
  /** Current onboarding data state */
  data: OnboardingData
  /** Available subscription tiers */
  tiers: TierLimits[]
  /** Whether any operation is in progress */
  isLoading: boolean
  /** Called when user updates club info */
  onUpdateClub: (club: Partial<OnboardingData['club']>) => void
  /** Called when user updates venue info */
  onUpdateVenue: (venue: Partial<NonNullable<OnboardingData['venue']>>) => void
  /** Called when user selects subscription tier */
  onSelectTier: (tier: SubscriptionTier, billingCycle: 'monthly' | 'annual') => void
  /** Called when user configures first event */
  onUpdateFirstEvent: (event: Partial<NonNullable<OnboardingData['firstEvent']>>) => void
  /** Called when user proceeds to next step */
  onNextStep: () => void
  /** Called when user goes back a step */
  onPreviousStep: () => void
  /** Called when user skips current step */
  onSkipStep: () => void
  /** Called when user completes the wizard */
  onComplete: () => void
  /** Called when user uploads club logo */
  onUploadLogo: (file: File) => void
}

export interface ClubSetupStepProps {
  data: OnboardingData['club']
  isLoading: boolean
  onChange: (updates: Partial<OnboardingData['club']>) => void
  onUploadLogo: (file: File) => void
  onNext: () => void
}

export interface VenueSetupStepProps {
  data: OnboardingData['venue']
  isLoading: boolean
  onChange: (updates: Partial<NonNullable<OnboardingData['venue']>>) => void
  onSkip: () => void
  onNext: () => void
}

export interface SubscriptionStepProps {
  currentTier: SubscriptionTier
  billingCycle: 'monthly' | 'annual'
  tiers: TierLimits[]
  isLoading: boolean
  onSelectTier: (tier: SubscriptionTier, billingCycle: 'monthly' | 'annual') => void
  onNext: () => void
}

export interface FirstEventStepProps {
  data: OnboardingData['firstEvent']
  clubName: string
  venueName: string | null
  isLoading: boolean
  onChange: (updates: Partial<NonNullable<OnboardingData['firstEvent']>>) => void
  onSkip: () => void
  onNext: () => void
}

export interface InviteMembersStepProps {
  clubId: string
  clubName: string
  qrCode: QRCode | null
  isGeneratingQR: boolean
  onGenerateQR: () => void
  onDownloadQR: (format: 'png' | 'svg') => void
  onCopyLink: () => void
  onShareVia: (method: 'sms' | 'email') => void
  onSkip: () => void
  onComplete: () => void
}

export interface ClaimVenueModalProps {
  venue: Venue
  isSubmitting: boolean
  onSubmit: (data: Omit<VenueClaimRequest, 'id' | 'venueId' | 'claimantId' | 'claimantName' | 'status' | 'submittedAt' | 'reviewedAt' | 'reviewedBy' | 'rejectionReason'>) => void
  onClose: () => void
}

export interface TierComparisonProps {
  tiers: TierLimits[]
  currentTier?: SubscriptionTier
  onSelectTier: (tier: SubscriptionTier) => void
}
