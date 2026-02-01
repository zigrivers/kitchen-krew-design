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

/** Simplified venue info for event location display */
export interface Venue {
  id: string
  name: string
  address: string
  city: string
}

/** A player's signup for an event */
export interface Registration {
  id: string
  player: Player
  status: 'registered' | 'waitlisted' | 'checked_in' | 'no_show'
  registeredAt: string
  /** Optional partner for doubles formats */
  partner: Player | null
}

/** Game format option for event creation */
export interface GameFormat {
  id: string
  name: string
  description: string
}

/** A scheduled pickleball session */
export interface Event {
  id: string
  name: string
  description: string
  startDateTime: string
  endDateTime: string
  venue: Venue
  format: string
  maxPlayers: number
  registeredCount: number
  spotsAvailable: number
  skillLevelMin: number
  skillLevelMax: number
  /** Registration fee in dollars, null if free */
  fee: number | null
  organizer: Player
  status: 'draft' | 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
  registrations: Registration[]
  waitlist: Registration[]
}

/** Current user context for the Events section */
export interface CurrentUser {
  id: string
  name: string
  avatarUrl: string | null
  skillRating: number
  isGameManager: boolean
}

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
  shareUrl: string
  /** Pre-filled message for SMS/email */
  defaultMessage: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface EventsProps {
  /** List of events to display */
  events: Event[]
  /** Available game formats for filtering and event creation */
  gameFormats: GameFormat[]
  /** Current logged-in user */
  currentUser: CurrentUser

  // Discovery actions
  /** Called when user wants to view event details */
  onViewEvent?: (eventId: string) => void
  /** Called when user applies filters */
  onFilterChange?: (filters: EventFilters) => void

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

/** Filter options for event discovery */
export interface EventFilters {
  search?: string
  format?: string
  dateFrom?: string
  dateTo?: string
  skillLevelMin?: number
  skillLevelMax?: number
  freeOnly?: boolean
  hasSpots?: boolean
  venueId?: string
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
  startDateTime: string
  endDateTime: string

  // Step 2: Format
  format: string
  skillLevelMin: number
  skillLevelMax: number

  // Step 3: Settings
  maxPlayers: number
  fee: number | null
  registrationDeadline?: string
  requiresApproval: boolean
  allowPartnerRegistration: boolean
}

export interface EventCreateWizardProps {
  /** Available venues for selection */
  venues: Venue[]
  /** Available game formats */
  gameFormats: GameFormat[]
  /** Initial data if editing an existing event */
  initialData?: Partial<EventCreateData>
  /** Called when wizard is completed */
  onSubmit?: (data: EventCreateData) => void
  /** Called when wizard is cancelled */
  onCancel?: () => void
}

// =============================================================================
// Sharing & QR Code Types
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
