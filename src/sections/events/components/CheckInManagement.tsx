import { useState } from 'react'
import {
  Search,
  UserCheck,
  UserX,
  Users,
  Clock,
  MapPin,
  Trophy,
  ChevronLeft,
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpFromLine,
  MoreVertical,
  Star,
  Filter,
  RefreshCw,
  X,
  Download,
  Link2,
  Check,
  Calendar,
  Maximize2,
} from 'lucide-react'
import type { Event, Player, Registration, EventQRCode } from '@/../product/sections/events/types'

// =============================================================================
// Props
// =============================================================================

export interface CheckInManagementProps {
  event: Event

  // Check-in QR Code
  checkInQRCode?: EventQRCode | null
  isGeneratingQR?: boolean

  // Navigation
  onBack?: () => void

  // Check-in actions
  onCheckIn?: (registrationId: string) => void
  onMarkNoShow?: (registrationId: string) => void
  onUndoCheckIn?: (registrationId: string) => void
  onRemoveRegistration?: (registrationId: string) => void
  onPromoteFromWaitlist?: (registrationId: string) => void

  // QR Scanner (for GM to scan player's QR)
  onScanQR?: () => void

  // Display Check-in QR (for players to scan)
  onDisplayCheckInQR?: () => void
  onDownloadQR?: (format: 'png' | 'svg') => void
  onCopyQRLink?: () => void
}

// =============================================================================
// Helper Functions
// =============================================================================

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// =============================================================================
// Sub-Components
// =============================================================================

function PlayerAvatar({ player, size = 'md' }: { player: Player; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
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

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: 'lime' | 'sky' | 'amber' | 'red' | 'slate'
}) {
  const colorClasses = {
    lime: 'bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400',
    sky: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  }

  const valueColorClasses = {
    lime: 'text-lime-700 dark:text-lime-300',
    sky: 'text-sky-700 dark:text-sky-300',
    amber: 'text-amber-700 dark:text-amber-300',
    red: 'text-red-700 dark:text-red-300',
    slate: 'text-slate-700 dark:text-slate-300',
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className={`text-2xl font-bold ${valueColorClasses[color]}`}>{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  )
}

type FilterStatus = 'all' | 'pending' | 'checked_in' | 'no_show'

function StatusFilter({
  value,
  onChange,
  counts,
}: {
  value: FilterStatus
  onChange: (val: FilterStatus) => void
  counts: { all: number; pending: number; checked_in: number; no_show: number }
}) {
  const filters: { id: FilterStatus; label: string; color: string }[] = [
    { id: 'all', label: 'All', color: 'slate' },
    { id: 'pending', label: 'Pending', color: 'sky' },
    { id: 'checked_in', label: 'Checked In', color: 'lime' },
    { id: 'no_show', label: 'No Show', color: 'red' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
            ${
              value === filter.id
                ? filter.id === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : filter.id === 'pending'
                    ? 'bg-sky-500 text-white'
                    : filter.id === 'checked_in'
                      ? 'bg-lime-500 text-white'
                      : 'bg-red-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }
          `}
        >
          {filter.label}
          <span
            className={`
            px-1.5 py-0.5 rounded text-xs
            ${
              value === filter.id
                ? 'bg-white/20'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }
          `}
          >
            {counts[filter.id]}
          </span>
        </button>
      ))}
    </div>
  )
}

interface PlayerCheckInRowProps {
  registration: Registration
  onCheckIn?: () => void
  onMarkNoShow?: () => void
  onUndoCheckIn?: () => void
  onRemove?: () => void
}

function PlayerCheckInRow({
  registration,
  onCheckIn,
  onMarkNoShow,
  onUndoCheckIn,
  onRemove,
}: PlayerCheckInRowProps) {
  const { player, status, partner } = registration
  const [showMenu, setShowMenu] = useState(false)

  const statusStyles = {
    registered: {
      bg: 'bg-sky-50 dark:bg-sky-900/20',
      border: 'border-sky-200 dark:border-sky-800',
      badge: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-400',
      label: 'Pending',
    },
    checked_in: {
      bg: 'bg-lime-50 dark:bg-lime-900/20',
      border: 'border-lime-200 dark:border-lime-800',
      badge: 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400',
      label: 'Checked In',
    },
    no_show: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400',
      label: 'No Show',
    },
    waitlisted: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400',
      label: 'Waitlisted',
    },
  }

  const style = statusStyles[status]

  return (
    <div
      className={`relative p-4 rounded-xl border ${style.bg} ${style.border} transition-all hover:shadow-md`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <PlayerAvatar player={player} size="lg" />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{player.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
              {style.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              {player.skillRating.toFixed(1)}
            </span>
            {partner && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                with <span className="font-medium text-slate-700 dark:text-slate-300">{partner.name}</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {status === 'registered' && (
            <>
              <button
                onClick={onCheckIn}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-600 text-white text-sm font-medium transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Check In</span>
              </button>
              <button
                onClick={onMarkNoShow}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Mark as No Show"
              >
                <UserX className="w-5 h-5" />
              </button>
            </>
          )}

          {status === 'checked_in' && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Done
              </span>
              <button
                onClick={onUndoCheckIn}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Undo check-in"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {status === 'no_show' && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium">
                <XCircle className="w-4 h-4" />
                No Show
              </span>
              <button
                onClick={onCheckIn}
                className="p-2 rounded-lg text-slate-400 hover:text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors"
                title="Mark as checked in"
              >
                <UserCheck className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-48 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                  <button
                    onClick={() => {
                      onRemove?.()
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <XCircle className="w-4 h-4" />
                    Remove from Event
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface WaitlistRowProps {
  registration: Registration
  position: number
  onPromote?: () => void
  onRemove?: () => void
}

function WaitlistRow({ registration, position, onPromote, onRemove }: WaitlistRowProps) {
  const { player, partner } = registration

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
      <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-900/50 flex items-center justify-center">
        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">#{position}</span>
      </div>

      <PlayerAvatar player={player} size="md" />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 dark:text-white truncate">{player.name}</p>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          {player.skillRating.toFixed(1)}
          {partner && <span className="hidden sm:inline">· with {partner.name}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPromote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-600 text-white text-sm font-medium transition-colors"
        >
          <ArrowUpFromLine className="w-4 h-4" />
          <span className="hidden sm:inline">Promote</span>
        </button>
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Remove from waitlist"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// Check-in QR Modal
// =============================================================================

function QRCodePlaceholder({ size = 240 }: { size?: number }) {
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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl">
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

interface CheckInQRModalProps {
  event: Event
  qrCode: EventQRCode | null
  isGenerating: boolean
  isOpen: boolean
  onDownload?: (format: 'png' | 'svg') => void
  onCopyLink?: () => void
  onClose?: () => void
}

function CheckInQRModal({
  event,
  qrCode,
  isGenerating,
  isOpen,
  onDownload,
  onCopyLink,
  onClose,
}: CheckInQRModalProps) {
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = () => {
    onCopyLink?.()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fullscreen display for projection
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8">
        <button
          onClick={() => setFullscreen(false)}
          className="absolute top-6 right-6 p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{event.name}</h1>
          <p className="text-xl text-slate-600">Scan to check in</p>
        </div>

        <div className="p-8 bg-white rounded-3xl shadow-2xl border-4 border-sky-500">
          <QRCodePlaceholder size={400} />
        </div>

        <div className="mt-8 flex items-center gap-4 text-lg text-slate-600">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {new Date(event.startDateTime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {event.venue.name}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/30">
              <UserCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Check-in QR Code</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Display for players to scan</p>
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
          <div className="p-5 bg-white rounded-2xl shadow-lg border-2 border-sky-200">
            {isGenerating ? (
              <div className="w-[240px] h-[240px] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <QRCodePlaceholder size={240} />
            )}
          </div>

          <div className="mt-4 text-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">{event.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Players scan this code to check in
            </p>
          </div>

          {qrCode && (
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-600 dark:text-slate-400">{qrCode.scanCount} scans</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                <UserCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-sky-700 dark:text-sky-400">{qrCode.conversionCount} checked in</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          {/* Fullscreen button */}
          <button
            onClick={() => setFullscreen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            Display Fullscreen
          </button>

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

export function CheckInManagement({
  event,
  checkInQRCode,
  isGeneratingQR = false,
  onBack,
  onCheckIn,
  onMarkNoShow,
  onUndoCheckIn,
  onRemoveRegistration,
  onPromoteFromWaitlist,
  onScanQR,
  onDisplayCheckInQR,
  onDownloadQR,
  onCopyQRLink,
}: CheckInManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [showQRModal, setShowQRModal] = useState(false)

  // Calculate stats
  const checkedInCount = event.registrations.filter((r) => r.status === 'checked_in').length
  const pendingCount = event.registrations.filter((r) => r.status === 'registered').length
  const noShowCount = event.registrations.filter((r) => r.status === 'no_show').length
  const totalRegistered = event.registrations.length

  // Filter registrations
  const filteredRegistrations = event.registrations.filter((reg) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      reg.player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.partner?.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && reg.status === 'registered') ||
      (statusFilter === 'checked_in' && reg.status === 'checked_in') ||
      (statusFilter === 'no_show' && reg.status === 'no_show')

    return matchesSearch && matchesStatus
  })

  const counts = {
    all: event.registrations.length,
    pending: pendingCount,
    checked_in: checkedInCount,
    no_show: noShowCount,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onDisplayCheckInQR?.()
                  setShowQRModal(true)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-sm font-medium hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
              >
                <UserCheck className="w-5 h-5" />
                Display QR
              </button>
              <button
                onClick={onScanQR}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-600 text-white text-sm font-medium transition-colors shadow-lg shadow-lime-500/25"
              >
                <QrCode className="w-5 h-5" />
                Scan QR
              </button>
            </div>
          </div>

          {/* Event info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{event.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatDate(event.startDateTime)} · {formatTime(event.startDateTime)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {event.venue.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  {event.format}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Registered"
            value={totalRegistered}
            color="slate"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="Checked In"
            value={checkedInCount}
            color="lime"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Pending"
            value={pendingCount}
            color="sky"
          />
          <StatCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="No Show"
            value={noShowCount}
            color="red"
          />
        </div>

        {/* Progress bar */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Check-in Progress</span>
            <span className="text-sm font-bold text-lime-600 dark:text-lime-400">
              {totalRegistered > 0 ? Math.round((checkedInCount / totalRegistered) * 100) : 0}%
            </span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-500"
              style={{ width: `${totalRegistered > 0 ? (checkedInCount / totalRegistered) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {checkedInCount} of {totalRegistered} players checked in
          </p>
        </div>

        {/* Search and filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <StatusFilter value={statusFilter} onChange={setStatusFilter} counts={counts} />
          </div>
        </div>

        {/* Registrations list */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Players ({filteredRegistrations.length})
          </h2>

          {filteredRegistrations.length > 0 ? (
            <div className="space-y-2">
              {filteredRegistrations.map((reg) => (
                <PlayerCheckInRow
                  key={reg.id}
                  registration={reg}
                  onCheckIn={() => onCheckIn?.(reg.id)}
                  onMarkNoShow={() => onMarkNoShow?.(reg.id)}
                  onUndoCheckIn={() => onUndoCheckIn?.(reg.id)}
                  onRemove={() => onRemoveRegistration?.(reg.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">
                {searchQuery ? 'No players match your search' : 'No players in this category'}
              </p>
            </div>
          )}
        </div>

        {/* Waitlist */}
        {event.waitlist.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Waitlist ({event.waitlist.length})
            </h2>

            <div className="space-y-2">
              {event.waitlist.map((reg, index) => (
                <WaitlistRow
                  key={reg.id}
                  registration={reg}
                  position={index + 1}
                  onPromote={() => onPromoteFromWaitlist?.(reg.id)}
                  onRemove={() => onRemoveRegistration?.(reg.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Check-in QR Modal */}
      <CheckInQRModal
        event={event}
        qrCode={checkInQRCode ?? null}
        isGenerating={isGeneratingQR}
        isOpen={showQRModal}
        onDownload={onDownloadQR}
        onCopyLink={onCopyQRLink}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  )
}
