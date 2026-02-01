import { useState } from 'react'
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  Clock,
  ChevronLeft,
  Share2,
  Star,
  UserPlus,
  UserMinus,
  QrCode,
  Edit,
  XCircle,
  CalendarClock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserX,
  ArrowUpFromLine,
  MessageCircle,
  Mail,
  Link2,
  Check,
  Download,
  X,
} from 'lucide-react'
import type { Event, CurrentUser, Player, Registration, ShareMethod, ShareEventData, EventQRCode } from '@/../product/sections/events/types'

// =============================================================================
// Props
// =============================================================================

export interface EventDetailProps {
  event: Event
  currentUser: CurrentUser

  // Share data for the modal
  shareData?: ShareEventData
  // QR code data for the modal
  eventQRCode?: EventQRCode | null
  isGeneratingQR?: boolean

  // Navigation
  onBack?: () => void

  // Player actions
  onRegister?: (partnerId?: string) => void
  onUnregister?: () => void
  onJoinWaitlist?: () => void
  onCheckIn?: () => void

  // Sharing actions
  onShareEvent?: (method: ShareMethod) => void

  // Game Manager actions (shown when currentUser is organizer or isGameManager)
  onEdit?: () => void
  onCancel?: () => void
  onReschedule?: () => void
  onManualCheckIn?: (registrationId: string) => void
  onMarkNoShow?: (registrationId: string) => void
  onRemoveRegistration?: (registrationId: string) => void
  onPromoteFromWaitlist?: (registrationId: string) => void

  // QR Code actions (Game Manager)
  onGenerateRegistrationQR?: () => void
  onDownloadQR?: (format: 'png' | 'svg') => void
  onCopyQRLink?: () => void
}

// =============================================================================
// Helper Functions
// =============================================================================

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getDuration(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
  if (hours < 1) return `${Math.round(hours * 60)} min`
  if (hours === 1) return '1 hour'
  return `${hours} hours`
}

// =============================================================================
// Sub-Components
// =============================================================================

function PlayerAvatar({
  player,
  size = 'md',
}: {
  player: Player
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  }

  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (player.avatarUrl) {
    return (
      <img
        src={player.avatarUrl}
        alt={player.name}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white dark:ring-slate-900`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center ring-2 ring-white dark:ring-slate-900`}
    >
      <span className="font-semibold text-white">{initials}</span>
    </div>
  )
}

function SkillBadge({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
      <Star className="w-3 h-3 text-amber-500" />
      {rating.toFixed(1)}
    </span>
  )
}

function StatusBadge({ status }: { status: Registration['status'] }) {
  const styles = {
    registered: 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400',
    waitlisted: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400',
    checked_in: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-400',
    no_show: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400',
  }

  const labels = {
    registered: 'Registered',
    waitlisted: 'Waitlisted',
    checked_in: 'Checked In',
    no_show: 'No Show',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

interface PlayerRowProps {
  registration: Registration
  isManager?: boolean
  onCheckIn?: () => void
  onMarkNoShow?: () => void
  onRemove?: () => void
}

function PlayerRow({ registration, isManager, onCheckIn, onMarkNoShow, onRemove }: PlayerRowProps) {
  const { player, status, partner } = registration

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
      <div className="flex items-center gap-3">
        <PlayerAvatar player={player} size="sm" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900 dark:text-white">{player.name}</span>
            <SkillBadge rating={player.skillRating} />
          </div>
          {partner && (
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span>with</span>
              <span className="font-medium text-slate-600 dark:text-slate-300">{partner.name}</span>
              <SkillBadge rating={partner.skillRating} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge status={status} />

        {isManager && status === 'registered' && (
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={onCheckIn}
              className="p-1.5 rounded-lg text-slate-400 hover:text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors"
              title="Check in"
            >
              <UserCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onMarkNoShow}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              title="Mark no-show"
            >
              <UserX className="w-4 h-4" />
            </button>
            <button
              onClick={onRemove}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Remove"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface WaitlistRowProps {
  registration: Registration
  position: number
  isManager?: boolean
  onPromote?: () => void
  onRemove?: () => void
}

function WaitlistRow({ registration, position, isManager, onPromote, onRemove }: WaitlistRowProps) {
  const { player, partner } = registration

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">#{position}</span>
        </div>
        <PlayerAvatar player={player} size="sm" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900 dark:text-white">{player.name}</span>
            <SkillBadge rating={player.skillRating} />
          </div>
          {partner && (
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span>with</span>
              <span className="font-medium text-slate-600 dark:text-slate-300">{partner.name}</span>
            </div>
          )}
        </div>
      </div>

      {isManager && (
        <div className="flex items-center gap-1">
          <button
            onClick={onPromote}
            className="p-1.5 rounded-lg text-slate-400 hover:text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors"
            title="Promote to registered"
          >
            <ArrowUpFromLine className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Remove from waitlist"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Share Modal (inline)
// =============================================================================

interface ShareModalProps {
  shareData: ShareEventData
  isOpen: boolean
  onShare?: (method: ShareMethod) => void
  onClose?: () => void
}

function ShareModal({ shareData, isOpen, onShare, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = () => {
    onShare?.('copy_link')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-lime-100 dark:bg-lime-900/30">
              <Share2 className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Share Event</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Invite friends to join</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Preview */}
        <div className="px-6 py-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{shareData.eventName}</h3>
            <div className="flex flex-col gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                {shareData.eventDate}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {shareData.venueName}
              </span>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="px-6 pb-4 space-y-3">
          <button
            onClick={() => onShare?.('sms')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-lime-300 dark:hover:border-lime-700 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-all"
          >
            <div className="p-3 rounded-xl bg-lime-100 dark:bg-lime-900/30">
              <MessageCircle className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-white">Text Message</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Share via SMS</p>
            </div>
          </button>

          <button
            onClick={() => onShare?.('email')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all"
          >
            <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-900/30">
              <Mail className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-white">Email</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Send via email</p>
            </div>
          </button>

          <button
            onClick={handleCopyLink}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              copied
                ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className={`p-3 rounded-xl transition-colors ${copied ? 'bg-lime-500' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {copied ? <Check className="w-5 h-5 text-white" /> : <Link2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-white">{copied ? 'Copied!' : 'Copy Link'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{shareData.shareUrl}</p>
            </div>
          </button>
        </div>

        {/* Message Preview */}
        <div className="px-6 pb-6">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Message preview:</p>
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">
            {shareData.defaultMessage}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// QR Code Modal (inline)
// =============================================================================

interface QRModalProps {
  qrCode: EventQRCode | null
  event: Event
  isGenerating: boolean
  isOpen: boolean
  onDownload?: (format: 'png' | 'svg') => void
  onCopyLink?: () => void
  onClose?: () => void
}

function QRCodePlaceholder({ size = 180 }: { size?: number }) {
  const gridSize = 25
  const cellSize = size / gridSize
  const pattern: boolean[][] = []
  for (let i = 0; i < gridSize; i++) {
    pattern[i] = []
    for (let j = 0; j < gridSize; j++) {
      const isFinderPattern =
        (i < 7 && j < 7) || (i < 7 && j >= gridSize - 7) || (i >= gridSize - 7 && j < 7)
      if (isFinderPattern) {
        const isOuter = i === 0 || i === 6 || j === 0 || j === 6 ||
                       (i < 7 && (j === gridSize - 7 || j === gridSize - 1)) ||
                       (j >= gridSize - 7 && (i === 0 || i === 6)) ||
                       (i >= gridSize - 7 && (j === 0 || j === 6))
        const isInner = (i >= 2 && i <= 4 && j >= 2 && j <= 4) ||
                       (i >= 2 && i <= 4 && j >= gridSize - 5 && j <= gridSize - 3) ||
                       (i >= gridSize - 5 && i <= gridSize - 3 && j >= 2 && j <= 4)
        pattern[i][j] = isOuter || isInner
      } else {
        pattern[i][j] = ((i * 7 + j * 13 + i * j) % 3) === 0
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, i) =>
        row.map((cell, j) =>
          cell ? (
            <rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="#0f172a" />
          ) : null
        )
      )}
    </svg>
  )
}

function QRModal({ qrCode, event, isGenerating, isOpen, onDownload, onCopyLink, onClose }: QRModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = () => {
    onCopyLink?.()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-lime-100 dark:bg-lime-900/30">
              <QrCode className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registration QR Code</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Share to invite players</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Display */}
        <div className="px-6 py-6 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200">
            {isGenerating ? (
              <div className="w-[180px] h-[180px] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-lime-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <QRCodePlaceholder size={180} />
            )}
          </div>

          <div className="mt-4 text-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">{event.name}</h3>
            <div className="flex items-center justify-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(event.startDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.venue.name}
              </span>
            </div>
          </div>

          {qrCode && (
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-600 dark:text-slate-400">{qrCode.scanCount} scans</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-100 dark:bg-lime-900/30">
                <Users className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span className="text-lime-700 dark:text-lime-400">{qrCode.conversionCount} registered</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onDownload?.('png')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              PNG
            </button>
            <button
              onClick={() => onDownload?.('svg')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              SVG
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
              copied
                ? 'bg-lime-500 text-white'
                : 'border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Link2 className="w-4 h-4" /> Copy Link</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function EventDetail({
  event,
  currentUser,
  shareData,
  eventQRCode,
  isGeneratingQR = false,
  onBack,
  onRegister,
  onUnregister,
  onJoinWaitlist,
  onCheckIn,
  onShareEvent,
  onEdit,
  onCancel,
  onReschedule,
  onManualCheckIn,
  onMarkNoShow,
  onRemoveRegistration,
  onPromoteFromWaitlist,
  onGenerateRegistrationQR,
  onDownloadQR,
  onCopyQRLink,
}: EventDetailProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  const isFull = event.spotsAvailable === 0
  const isOrganizer = currentUser.id === event.organizer.id
  const isManager = currentUser.isGameManager || isOrganizer

  // Check user's registration status
  const userRegistration = event.registrations.find((r) => r.player.id === currentUser.id)
  const userWaitlistEntry = event.waitlist.find((r) => r.player.id === currentUser.id)
  const isRegistered = !!userRegistration
  const isOnWaitlist = !!userWaitlistEntry
  const isCheckedIn = userRegistration?.status === 'checked_in'

  // Stats
  const checkedInCount = event.registrations.filter((r) => r.status === 'checked_in').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Top Bar */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-2">
              {isManager && (
                <>
                  <button
                    onClick={() => {
                      onGenerateRegistrationQR?.()
                      setShowQRModal(true)
                    }}
                    className="p-2 rounded-lg text-slate-300 hover:text-lime-400 hover:bg-white/10 transition-colors"
                    title="Registration QR Code"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onEdit}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit event"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onReschedule}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Reschedule"
                  >
                    <CalendarClock className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onCancel}
                    className="p-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-white/10 transition-colors"
                    title="Cancel event"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Share event"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Event Info */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8 pt-4">
          <div className="max-w-4xl mx-auto">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                <Trophy className="w-4 h-4 text-lime-400" />
                {event.format}
              </span>
              {event.fee ? (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/20 backdrop-blur-sm text-sky-300 text-sm font-medium">
                  <DollarSign className="w-4 h-4" />
                  {event.fee}
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-lime-500/20 backdrop-blur-sm text-lime-300 text-sm font-medium">
                  Free
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-slate-300 text-sm">
                <Star className="w-4 h-4 text-amber-400" />
                {event.skillLevelMin.toFixed(1)} – {event.skillLevelMax.toFixed(1)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">{event.name}</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-lime-500/20">
                  <Calendar className="w-5 h-5 text-lime-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(event.startDateTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-sky-500/20">
                  <Clock className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Time</p>
                  <p className="text-sm font-medium text-white">{formatTime(event.startDateTime)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Players</p>
                  <p className="text-sm font-medium text-white">
                    {event.registeredCount}/{event.maxPlayers}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Duration</p>
                  <p className="text-sm font-medium text-white">
                    {getDuration(event.startDateTime, event.endDateTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">About this event</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{event.description}</p>
              </section>

              {/* Date & Location */}
              <section className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-lime-100 dark:bg-lime-900/30">
                      <Calendar className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Date & Time</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{formatDate(event.startDateTime)}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {formatTime(event.startDateTime)} – {formatTime(event.endDateTime)}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/30">
                      <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Location</h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{event.venue.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {event.venue.address}, {event.venue.city}
                  </p>
                </div>
              </section>

              {/* Organizer */}
              <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Organized by</h3>
                <div className="flex items-center gap-4">
                  <PlayerAvatar player={event.organizer} size="lg" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{event.organizer.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <SkillBadge rating={event.organizer.skillRating} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Skill Rating</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Registered Players */}
              <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Registered Players ({event.registeredCount}/{event.maxPlayers})
                  </h3>
                  {isManager && checkedInCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-sky-600 dark:text-sky-400">
                      <CheckCircle2 className="w-4 h-4" />
                      {checkedInCount} checked in
                    </span>
                  )}
                </div>

                {event.registrations.length > 0 ? (
                  <div className="space-y-2">
                    {event.registrations.map((reg) => (
                      <PlayerRow
                        key={reg.id}
                        registration={reg}
                        isManager={isManager}
                        onCheckIn={() => onManualCheckIn?.(reg.id)}
                        onMarkNoShow={() => onMarkNoShow?.(reg.id)}
                        onRemove={() => onRemoveRegistration?.(reg.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">No players registered yet</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Be the first to join!</p>
                  </div>
                )}
              </section>

              {/* Waitlist */}
              {(event.waitlist.length > 0 || isFull) && (
                <section className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                      Waitlist ({event.waitlist.length})
                    </h3>
                  </div>

                  {event.waitlist.length > 0 ? (
                    <div className="space-y-2">
                      {event.waitlist.map((reg, index) => (
                        <WaitlistRow
                          key={reg.id}
                          registration={reg}
                          position={index + 1}
                          isManager={isManager}
                          onPromote={() => onPromoteFromWaitlist?.(reg.id)}
                          onRemove={() => onRemoveRegistration?.(reg.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      This event is full. Join the waitlist to be notified if a spot opens up.
                    </p>
                  )}
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {/* Capacity Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Availability</span>
                    {isFull ? (
                      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Event Full</span>
                    ) : (
                      <span className="text-sm font-semibold text-lime-600 dark:text-lime-400">
                        {event.spotsAvailable} spots left
                      </span>
                    )}
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : event.spotsAvailable <= 3
                            ? 'bg-gradient-to-r from-amber-400 to-lime-400'
                            : 'bg-gradient-to-r from-lime-400 to-lime-500'
                      }`}
                      style={{ width: `${(event.registeredCount / event.maxPlayers) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {event.registeredCount} of {event.maxPlayers} players registered
                  </p>
                </div>

                {/* User Status / Action Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {isCheckedIn ? (
                    <>
                      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20">
                        <CheckCircle2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                        <div>
                          <p className="font-semibold text-sky-900 dark:text-sky-200">You're checked in!</p>
                          <p className="text-xs text-sky-700 dark:text-sky-400">Ready to play</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onUnregister?.()}
                        className="w-full py-3 px-4 rounded-xl text-sm font-medium border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <UserMinus className="w-4 h-4" />
                          Leave Event
                        </span>
                      </button>
                    </>
                  ) : isRegistered ? (
                    <>
                      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-lime-50 dark:bg-lime-900/20">
                        <CheckCircle2 className="w-6 h-6 text-lime-600 dark:text-lime-400" />
                        <div>
                          <p className="font-semibold text-lime-900 dark:text-lime-200">You're registered!</p>
                          <p className="text-xs text-lime-700 dark:text-lime-400">See you there</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => onCheckIn?.()}
                          className="w-full py-3 px-4 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <QrCode className="w-4 h-4" />
                            Check In
                          </span>
                        </button>
                        <button
                          onClick={() => onUnregister?.()}
                          className="w-full py-3 px-4 rounded-xl text-sm font-medium border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <UserMinus className="w-4 h-4" />
                            Unregister
                          </span>
                        </button>
                      </div>
                    </>
                  ) : isOnWaitlist ? (
                    <>
                      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                        <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        <div>
                          <p className="font-semibold text-amber-900 dark:text-amber-200">On the waitlist</p>
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            Position #{event.waitlist.findIndex((w) => w.player.id === currentUser.id) + 1}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onUnregister?.()}
                        className="w-full py-3 px-4 rounded-xl text-sm font-medium border-2 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <UserMinus className="w-4 h-4" />
                          Leave Waitlist
                        </span>
                      </button>
                    </>
                  ) : isFull ? (
                    <>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        This event is full, but you can join the waitlist to be notified if a spot opens.
                      </p>
                      <button
                        onClick={() => onJoinWaitlist?.()}
                        className="w-full py-3 px-4 rounded-xl text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Join Waitlist
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {event.spotsAvailable} spots available. Register now to secure your place!
                      </p>
                      <button
                        onClick={() => onRegister?.()}
                        className="w-full py-3 px-4 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Register Now
                        </span>
                      </button>
                    </>
                  )}
                </div>

                {/* Price Info */}
                {event.fee && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Registration Fee</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">${event.fee}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareData && (
        <ShareModal
          shareData={shareData}
          isOpen={showShareModal}
          onShare={(method) => {
            onShareEvent?.(method)
            if (method !== 'copy_link') {
              setShowShareModal(false)
            }
          }}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* QR Code Modal */}
      <QRModal
        qrCode={eventQRCode ?? null}
        event={event}
        isGenerating={isGeneratingQR}
        isOpen={showQRModal}
        onDownload={onDownloadQR}
        onCopyLink={onCopyQRLink}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  )
}
