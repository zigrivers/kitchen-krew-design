// =============================================================================
// Data Types
// =============================================================================

/** Simplified player info for display in event cards and registration lists */
export interface Player {
  id: string
  name: string
  avatarUrl: string | null
  skillRating: number
}

/** Team member for team competition formats */
export interface TeamMember {
  id: string
  name: string
  gender: 'male' | 'female'
  skillRating: number
}

/** Simplified venue info for event location display */
export interface Venue {
  id: string
  name: string
  address: string
  city: string
}

/** Payment status for paid events */
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'

/** A player's signup for an event */
export interface Registration {
  id: string
  player: Player
  status: 'registered' | 'waitlisted' | 'checked_in' | 'no_show'
  registeredAt: string
  /** Payment status for paid events, null for free events */
  paymentStatus: PaymentStatus | null
  /** Optional partner for doubles formats */
  partner: Player | null
  /** Team members for team competition formats */
  teamMembers?: TeamMember[]
}

// =============================================================================
// Format Categories & Subtypes
// =============================================================================

/** Format category ID */
export type FormatCategoryId =
  | 'tournament'
  | 'round-robin'
  | 'ladder-league'
  | 'recreational'
  | 'team'
  | 'specialty'

/** Format category icon (Lucide icon names) */
export type FormatCategoryIcon =
  | 'trophy'
  | 'refresh-cw'
  | 'trending-up'
  | 'smile'
  | 'users'
  | 'star'

/** Partnership type for event formats */
export type PartnershipType =
  | 'none'
  | 'individual'
  | 'fixed_partner'
  | 'rotating'
  | 'team'
  | 'varies'

/** A specific format within a category */
export interface FormatSubtype {
  id: string
  name: string
  description: string
  minPlayers: number
  maxPlayers: number
  estimatedDuration: string
  partnershipType: PartnershipType
}

/** A major event format category containing multiple subtypes */
export interface FormatCategory {
  id: FormatCategoryId
  name: string
  icon: FormatCategoryIcon
  description: string
  bestFor: string
  subtypes: FormatSubtype[]
}

/** The format information embedded in an event */
export interface EventFormat {
  categoryId: FormatCategoryId
  categoryName: string
  categoryIcon: FormatCategoryIcon
  subtypeId: string
  subtypeName: string
}

// =============================================================================
// Format Configuration Types (Format-Specific Settings)
// =============================================================================

/** Skill range for events */
export interface SkillRange {
  min: number
  max: number
}

/** Scoring configuration */
export interface ScoringConfig {
  type?: 'side_out' | 'rally'
  pointsToWin: number
  winBy: number
  capPoints: number | null
}

/** Court movement configuration for ladder/KotC formats */
export interface CourtMovementConfig {
  enabled: boolean
  type: 'winners_up_losers_down' | 'performance_based' | 'rotation'
  partnerSplit?: boolean
  movementCount: number
}

/** Match format for tournament brackets */
export interface TournamentMatchFormat {
  earlyRounds: 'single_game' | 'best_of_3' | 'best_of_5'
  semifinals: 'single_game' | 'best_of_3' | 'best_of_5'
  finals: 'single_game' | 'best_of_3' | 'best_of_5'
}

/** League duration configuration */
export interface LeagueDuration {
  weeks: number
  sessionsPerWeek: number
  dayOfWeek: string
}

/** Team composition for team formats */
export interface TeamComposition {
  men: number
  women: number
}

/** Match structure for team formats */
export interface TeamMatchStructure {
  gamesPerRound: number
  gameTypes: string[]
}

/** Instructor info for clinics/lessons */
export interface Instructor {
  id: string
  name: string
  certification?: string
}

/** Base format reference for skill-limited events */
export interface BaseFormatRef {
  categoryId: FormatCategoryId
  subtypeId: string
}

/** Tiebreaker rule options */
export type TiebreakerRule = 'head_to_head' | 'point_differential' | 'total_points' | 'random'

/** Seeding method options */
export type SeedingMethod = 'manual' | 'rating_based' | 'dupr_rating' | 'random'

/** Rating system options */
export type RatingSystem = 'none' | 'self_rating' | 'dupr' | 'utr_p'

/**
 * Format-specific configuration.
 * This is a flexible object that varies based on the format category/subtype.
 * Different events will have different fields populated.
 */
export interface FormatConfig {
  skillRange: SkillRange

  // Round Robin specific
  partnershipType?: PartnershipType
  playoffEnabled?: boolean
  playoffFormat?: 'single-elimination' | 'double-elimination'
  playoffAdvancement?: number
  tiebreakers?: TiebreakerRule[]
  duprUpload?: boolean

  // Tournament specific
  bracketType?: 'single_elimination' | 'double_elimination' | 'pool_play'
  consolationBracket?: boolean
  bronzeMatch?: boolean
  seeding?: SeedingMethod
  matchFormat?: TournamentMatchFormat

  // Scoring (most formats)
  scoring?: ScoringConfig

  // Court movement (ladder/KotC)
  courtMovement?: CourtMovementConfig
  prizeEvent?: boolean

  // League specific
  duration?: LeagueDuration
  playersPerCourt?: number
  gamesPerSession?: number
  rankingAlgorithm?: 'point_percentage' | 'wins' | 'elo'
  absentPlayerRule?: 'maintain_ranking' | 'drop_ranking'

  // Team specific
  teamSize?: number
  teamComposition?: TeamComposition
  matchStructure?: TeamMatchStructure
  tiebreaker?: 'dreambreaker' | 'point_differential'

  // Recreational specific
  courtRotation?: 'paddle_stack' | 'winners_stay' | 'time_based'
  instructor?: Instructor
  focusAreas?: string[]
  equipmentProvided?: boolean

  // Skill-limited specific
  ratingSystem?: RatingSystem
  requireVerifiedRating?: boolean
  allowProvisional?: boolean
  baseFormat?: BaseFormatRef
}

// =============================================================================
// Event Types
// =============================================================================

/** Event status */
export type EventStatus = 'draft' | 'upcoming' | 'in_progress' | 'completed' | 'cancelled'

/** A scheduled pickleball session */
export interface Event {
  id: string
  name: string
  description: string
  startDateTime: string
  endDateTime: string
  venue: Venue
  format: EventFormat
  formatConfig: FormatConfig
  maxPlayers: number
  registeredCount: number
  spotsAvailable: number
  waitlistEnabled: boolean
  waitlistMax: number
  /** Registration fee in dollars, null if free */
  fee: number | null
  organizer: Player
  status: EventStatus
  registrations: Registration[]
  waitlist: Registration[]
}

// =============================================================================
// Current User Types
// =============================================================================

/** Current user context for the Events section */
export interface CurrentUser {
  id: string
  name: string
  avatarUrl: string | null
  skillRating: number
  duprRating?: number
  isGameManager: boolean
  registeredEventIds: string[]
  managedEventIds: string[]
}

// =============================================================================
// QR Code & Sharing Types
// =============================================================================

/** QR code type for events */
export type EventQRCodeType = 'event_registration' | 'check_in'

/** A generated QR code for an event */
export interface EventQRCode {
  id: string
  type: EventQRCodeType
  eventId: string
  eventName: string
  /** The URL encoded in the QR code */
  targetUrl: string
  /** When the QR code was generated */
  createdAt: string
  /** QR codes expire when the event starts or is cancelled */
  expiresAt: string
  /** Number of times the QR code has been scanned */
  scanCount: number
  /** Number of registrations/check-ins from this QR */
  conversionCount: number
  /** Whether this QR code is currently active */
  isActive: boolean
}

/** Share method for sharing an event link */
export type ShareMethod = 'sms' | 'email' | 'copy_link'

/** Data for sharing an event */
export interface ShareEventData {
  eventId: string
  eventName: string
  eventDate: string
  venueName: string
  formatBadge: string
  shareUrl: string
  /** Pre-filled message for SMS/email */
  defaultMessage: string
}

// =============================================================================
// Filter Types
// =============================================================================

/** Availability filter options */
export type AvailabilityFilter = 'open' | 'waitlist' | 'full'

/** Filter options for event discovery */
export interface EventFilters {
  search?: string
  formatCategoryIds?: FormatCategoryId[]
  dateFrom?: string
  dateTo?: string
  skillLevelMin?: number
  skillLevelMax?: number
  feeType?: 'free' | 'paid' | 'any'
  availability?: AvailabilityFilter[]
  venueId?: string
  distance?: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface EventsProps {
  /** List of events to display */
  events: Event[]
  /** Available format categories for filtering and event creation */
  formatCategories: FormatCategory[]
  /** Current logged-in user */
  currentUser: CurrentUser
  /** QR codes for events (Game Manager view) */
  eventQRCodes?: EventQRCode[]
  /** Share data for events */
  shareEventData?: ShareEventData[]

  // Discovery actions
  /** Called when user wants to view event details */
  onViewEvent?: (eventId: string) => void
  /** Called when user applies filters */
  onFilterChange?: (filters: EventFilters) => void
  /** Called when user searches for events */
  onSearch?: (query: string) => void

  // Registration actions
  /** Called when user registers for an event */
  onRegister?: (eventId: string, partnerId?: string) => void
  /** Called when user joins a waitlist */
  onJoinWaitlist?: (eventId: string) => void
  /** Called when user unregisters from an event */
  onUnregister?: (eventId: string) => void
  /** Called when user checks in to an event */
  onCheckIn?: (eventId: string) => void

  // Game Manager actions
  /** Called when GM wants to create a new event */
  onCreate?: () => void
  /** Called when GM wants to clone an existing event */
  onClone?: (eventId: string) => void
  /** Called when GM wants to edit an event */
  onEdit?: (eventId: string) => void
  /** Called when GM wants to cancel an event */
  onCancel?: (eventId: string) => void
  /** Called when GM wants to reschedule an event */
  onReschedule?: (eventId: string) => void
  /** Called when GM approves a registration */
  onApproveRegistration?: (eventId: string, registrationId: string) => void
  /** Called when GM removes a registration */
  onRemoveRegistration?: (eventId: string, registrationId: string) => void
  /** Called when GM checks in a player manually */
  onManualCheckIn?: (eventId: string, registrationId: string) => void
  /** Called when GM marks a player as no-show */
  onMarkNoShow?: (eventId: string, registrationId: string) => void
  /** Called when GM promotes a player from waitlist */
  onPromoteFromWaitlist?: (eventId: string, registrationId: string) => void

  // Sharing actions
  /** Called when user shares an event via SMS, email, or copy link */
  onShareEvent?: (eventId: string, method: ShareMethod) => void

  // QR Code actions (Game Manager)
  /** Called when GM generates an event registration QR code */
  onGenerateRegistrationQR?: (eventId: string) => void
  /** Called when GM displays check-in QR code */
  onDisplayCheckInQR?: (eventId: string) => void
  /** Called when user downloads a QR code */
  onDownloadQR?: (qrCodeId: string, format: 'png' | 'svg') => void
}

// =============================================================================
// Event Creation Types
// =============================================================================

/** Data for creating a new event (wizard steps) */
export interface EventCreateData {
  // Step 1: Basics
  name: string
  description: string
  venueId: string
  courtIds: string[]
  startDateTime: string
  endDateTime: string

  // Step 2: Format Selection
  formatCategoryId: FormatCategoryId
  formatSubtypeId: string

  // Step 3: Format Configuration (varies by format)
  formatConfig: Partial<FormatConfig>

  // Step 4: Registration Settings
  maxPlayers: number
  fee: number | null
  registrationOpens?: string
  registrationCloses?: string
  waitlistEnabled: boolean
  waitlistMax?: number
  requiresApproval: boolean
}

export interface EventCreateWizardProps {
  /** Available venues for selection */
  venues: Venue[]
  /** Available format categories */
  formatCategories: FormatCategory[]
  /** Current wizard step (1-5) */
  currentStep: number
  /** Initial data if editing an existing event or cloning */
  initialData?: Partial<EventCreateData>
  /** Called when wizard step changes */
  onStepChange?: (step: number) => void
  /** Called when wizard is completed */
  onSubmit?: (data: EventCreateData) => void
  /** Called when wizard is cancelled */
  onCancel?: () => void
  /** Called when user saves as draft */
  onSaveDraft?: (data: Partial<EventCreateData>) => void
}

// =============================================================================
// Format Selection Types (Wizard Step 2)
// =============================================================================

export interface FormatSelectionProps {
  /** Available format categories */
  formatCategories: FormatCategory[]
  /** Currently selected category ID */
  selectedCategoryId: FormatCategoryId | null
  /** Currently selected subtype ID */
  selectedSubtypeId: string | null
  /** Called when user selects a category */
  onCategorySelect?: (categoryId: FormatCategoryId) => void
  /** Called when user selects a subtype */
  onSubtypeSelect?: (subtypeId: string) => void
}

// =============================================================================
// Sharing & QR Code Modal Props
// =============================================================================

export interface ShareEventModalProps {
  /** Data for the event being shared */
  shareData: ShareEventData
  /** Whether the modal is open */
  isOpen: boolean
  /** Called when user shares via a method */
  onShare?: (method: ShareMethod) => void
  /** Called when modal is closed */
  onClose?: () => void
}

export interface EventQRCodeModalProps {
  /** The QR code to display */
  qrCode: EventQRCode | null
  /** The event this QR code is for */
  event: Event
  /** Whether QR code is being generated */
  isGenerating: boolean
  /** Called when user downloads the QR code */
  onDownload?: (format: 'png' | 'svg') => void
  /** Called when user copies the link */
  onCopyLink?: () => void
  /** Called when modal is closed */
  onClose?: () => void
}

// =============================================================================
// Event Detail Types
// =============================================================================

export interface EventDetailProps {
  /** The event to display */
  event: Event
  /** Current user for registration state */
  currentUser: CurrentUser
  /** Whether current user is the organizer */
  isOrganizer: boolean
  /** User's registration for this event, if any */
  userRegistration?: Registration

  // Player actions
  onRegister?: (partnerId?: string) => void
  onJoinWaitlist?: () => void
  onUnregister?: () => void
  onCheckIn?: () => void
  onShare?: (method: ShareMethod) => void

  // Game Manager actions
  onEdit?: () => void
  onCancel?: () => void
  onManageRegistrations?: () => void
  onGenerateQR?: (type: EventQRCodeType) => void
}

// =============================================================================
// Registration Management Types (Game Manager)
// =============================================================================

export interface RegistrationManagementProps {
  /** The event being managed */
  event: Event
  /** Called when GM approves a registration */
  onApprove?: (registrationId: string) => void
  /** Called when GM removes a registration */
  onRemove?: (registrationId: string) => void
  /** Called when GM manually checks in a player */
  onCheckIn?: (registrationId: string) => void
  /** Called when GM marks a player as no-show */
  onMarkNoShow?: (registrationId: string) => void
  /** Called when GM promotes from waitlist */
  onPromote?: (registrationId: string) => void
  /** Called when GM adds a player manually */
  onAddPlayer?: () => void
}
