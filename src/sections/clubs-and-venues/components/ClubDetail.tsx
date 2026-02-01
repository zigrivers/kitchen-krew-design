import { useState } from 'react'
import {
  MapPin,
  Users,
  Calendar,
  Mail,
  Globe,
  ChevronRight,
  Crown,
  Shield,
  Clock,
  CheckCircle2,
  Lock,
  LogOut,
  Settings,
  Star,
  UserPlus,
  Building2,
  QrCode,
  Download,
  Link2,
  Check,
  X,
  Smartphone,
} from 'lucide-react'
import type {
  Club,
  ClubMember,
  SubGroup,
  Venue,
  QRCode,
  QRCodeType,
} from '@/../product/sections/clubs-and-venues/types'

// =============================================================================
// Props
// =============================================================================

export interface ClubDetailProps {
  club: Club
  members: ClubMember[]
  subGroups: SubGroup[]
  linkedVenues: Venue[]
  isAdmin: boolean

  // QR Code data
  clubQRCode?: QRCode | null
  isGeneratingQR?: boolean

  onEdit?: () => void
  onJoin?: () => void
  onLeave?: () => void
  onCancelRequest?: () => void
  onViewMember?: (memberId: string) => void
  onViewVenue?: (venueId: string) => void
  onInviteMember?: () => void

  // QR Code actions
  onGenerateInviteQR?: () => void
  onGenerateAppDownloadQR?: (includeBranding?: boolean) => void
  onDownloadQR?: (format: 'png' | 'svg') => void
  onCopyQRLink?: () => void
}

// =============================================================================
// Sub-Components
// =============================================================================

function ClubHeader({
  club,
  isAdmin,
  onEdit,
  onOpenQRModal,
}: {
  club: Club
  isAdmin: boolean
  onEdit?: () => void
  onOpenQRModal?: () => void
}) {
  const initials = club.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="h-32 bg-gradient-to-r from-lime-500 via-lime-400 to-sky-500" />

      {/* Club info overlay */}
      <div className="px-4 -mt-12">
        <div className="flex items-end gap-4">
          {/* Logo */}
          {club.logoUrl ? (
            <img
              src={club.logoUrl}
              alt={club.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-lime-400 via-lime-500 to-sky-500 flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shadow-lg">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
          )}

          {/* Name and location */}
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {club.name}
              </h1>
              {club.userRole === 'admin' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-400">
                  <Crown className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4" />
              {club.location.city}, {club.location.state}
            </div>
          </div>

          {/* Admin buttons */}
          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenQRModal}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Generate QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>
              <button
                onClick={onEdit}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MembershipBadge({ type }: { type: 'open' | 'closed' }) {
  if (type === 'open') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400">
        <CheckCircle2 className="w-4 h-4" />
        Open Membership
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
      <Lock className="w-4 h-4" />
      Invite Only
    </span>
  )
}

function StatsGrid({ club }: { club: Club }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
        <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-1">
          <Users className="w-4 h-4" />
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-white">
          {club.memberCount}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Members</p>
      </div>
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
        <div className="flex items-center justify-center gap-1 text-lime-500 mb-1">
          <Users className="w-4 h-4" />
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-white">
          {club.activeThisMonth}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
      </div>
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
        <div className="flex items-center justify-center gap-1 text-sky-500 mb-1">
          <Calendar className="w-4 h-4" />
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-white">
          {club.upcomingEvents}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Events</p>
      </div>
    </div>
  )
}

function ActionButton({
  club,
  onJoin,
  onLeave,
  onCancelRequest,
}: {
  club: Club
  onJoin?: () => void
  onLeave?: () => void
  onCancelRequest?: () => void
}) {
  if (club.isUserMember) {
    return (
      <button
        onClick={onLeave}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Leave Club
      </button>
    )
  }

  if (club.pendingRequest) {
    return (
      <button
        onClick={onCancelRequest}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
      >
        <Clock className="w-4 h-4" />
        Request Pending - Cancel
      </button>
    )
  }

  if (club.membershipType === 'open') {
    return (
      <button
        onClick={onJoin}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
      >
        <CheckCircle2 className="w-4 h-4" />
        Join Club
      </button>
    )
  }

  return (
    <button
      onClick={onJoin}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium border-2 border-lime-300 dark:border-lime-700 text-lime-700 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors"
    >
      <Lock className="w-4 h-4" />
      Request to Join
    </button>
  )
}

function ContactInfo({ club }: { club: Club }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm">
        <Mail className="w-4 h-4 text-slate-400" />
        <a
          href={`mailto:${club.contactEmail}`}
          className="text-lime-600 dark:text-lime-400 hover:underline"
        >
          {club.contactEmail}
        </a>
      </div>
      {club.websiteUrl && (
        <div className="flex items-center gap-3 text-sm">
          <Globe className="w-4 h-4 text-slate-400" />
          <a
            href={club.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime-600 dark:text-lime-400 hover:underline"
          >
            {club.websiteUrl.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}
    </div>
  )
}

function SubGroupCard({ group }: { group: SubGroup }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div
        className="w-3 h-10 rounded-full"
        style={{ backgroundColor: group.color }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 dark:text-white truncate">
          {group.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {group.memberCount} members
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
    </div>
  )
}

function MemberPreview({
  members,
  onViewMember,
  onViewAll,
}: {
  members: ClubMember[]
  onViewMember?: (memberId: string) => void
  onViewAll?: () => void
}) {
  const admins = members.filter((m) => m.role === 'admin')
  const topMembers = members
    .filter((m) => m.status === 'active')
    .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
    .slice(0, 5)

  const PlayerAvatar = ({
    member,
    showBadge,
  }: {
    member: ClubMember
    showBadge?: boolean
  }) => {
    const initials = member.playerName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

    return (
      <div className="relative">
        {member.playerAvatarUrl ? (
          <img
            src={member.playerAvatarUrl}
            alt={member.playerName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-lime-400 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{initials}</span>
          </div>
        )}
        {showBadge && member.role === 'admin' && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
            <Crown className="w-2.5 h-2.5 text-white" />
          </div>
        )}
        {showBadge && member.isGameManager && member.role !== 'admin' && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-lime-500 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
            <Shield className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Admins */}
      <div>
        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Club Leaders
        </h4>
        <div className="space-y-2">
          {admins.map((admin) => (
            <button
              key={admin.id}
              onClick={() => onViewMember?.(admin.playerId)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <PlayerAvatar member={admin} showBadge />
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {admin.playerName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Admin • {admin.gamesPlayed} games
                </p>
              </div>
              <span className="text-xs font-medium text-sky-600 dark:text-sky-400">
                {admin.skillRating.toFixed(1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Top members */}
      <div>
        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Most Active
        </h4>
        <div className="space-y-2">
          {topMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => onViewMember?.(member.playerId)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <PlayerAvatar member={member} showBadge />
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {member.playerName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {member.gamesPlayed} games played
                </p>
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {member.skillRating.toFixed(1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* View all button */}
      <button
        onClick={onViewAll}
        className="w-full flex items-center justify-center gap-1 py-2 text-sm font-medium text-lime-600 dark:text-lime-400 hover:underline"
      >
        View all members
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function VenueCard({
  venue,
  onView,
}: {
  venue: Venue
  onView?: () => void
}) {
  return (
    <button
      onClick={onView}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-lime-300 dark:hover:border-lime-700 transition-colors text-left"
    >
      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
        <Building2 className="w-6 h-6 text-slate-400 dark:text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 dark:text-white truncate">
          {venue.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          <span>{venue.courtCount} courts</span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            {venue.averageRating.toFixed(1)}
          </span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
    </button>
  )
}

// =============================================================================
// QR Code Components
// =============================================================================

function QRCodePlaceholder({ size = 160 }: { size?: number }) {
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

interface QRGeneratorModalProps {
  club: Club
  qrCode: QRCode | null
  isGenerating: boolean
  isOpen: boolean
  qrType: 'club_invite' | 'app_download'
  onTypeChange?: (type: 'club_invite' | 'app_download') => void
  onGenerate?: () => void
  onDownload?: (format: 'png' | 'svg') => void
  onCopyLink?: () => void
  onClose?: () => void
}

function QRGeneratorModal({
  club,
  qrCode,
  isGenerating,
  isOpen,
  qrType,
  onTypeChange,
  onGenerate,
  onDownload,
  onCopyLink,
  onClose,
}: QRGeneratorModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = () => {
    onCopyLink?.()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isInviteQR = qrType === 'club_invite'

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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">QR Code Generator</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">For {club.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Type Selector */}
        <div className="px-6 py-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">QR Code Type</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onTypeChange?.('club_invite')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isInviteQR
                  ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <UserPlus className={`w-5 h-5 mb-2 ${isInviteQR ? 'text-lime-600 dark:text-lime-400' : 'text-slate-400'}`} />
              <p className={`font-medium text-sm ${isInviteQR ? 'text-lime-900 dark:text-lime-200' : 'text-slate-900 dark:text-white'}`}>
                Club Invite
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Join the club</p>
            </button>
            <button
              onClick={() => onTypeChange?.('app_download')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                !isInviteQR
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Smartphone className={`w-5 h-5 mb-2 ${!isInviteQR ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
              <p className={`font-medium text-sm ${!isInviteQR ? 'text-sky-900 dark:text-sky-200' : 'text-slate-900 dark:text-white'}`}>
                App Download
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Get the app</p>
            </button>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="px-6 py-4 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200">
            {isGenerating ? (
              <div className="w-[160px] h-[160px] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-lime-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <QRCodePlaceholder size={160} />
            )}
          </div>

          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 text-center">
            {isInviteQR ? 'Scan to join ' : 'Scan to download KitchenKrew and join '}
            <span className="font-medium text-slate-900 dark:text-white">{club.name}</span>
          </p>

          {qrCode && (
            <div className="mt-3 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-600 dark:text-slate-400">{qrCode.scanCount} scans</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-100 dark:bg-lime-900/30">
                <Users className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span className="text-lime-700 dark:text-lime-400">{qrCode.conversionCount} joined</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onDownload?.('png')}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              PNG
            </button>
            <button
              onClick={() => onDownload?.('svg')}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              SVG
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            disabled={isGenerating}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
              copied
                ? 'bg-lime-500 text-white'
                : 'border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
            } disabled:opacity-50`}
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

export function ClubDetail({
  club,
  members,
  subGroups,
  linkedVenues,
  isAdmin,
  clubQRCode,
  isGeneratingQR = false,
  onEdit,
  onJoin,
  onLeave,
  onCancelRequest,
  onViewMember,
  onViewVenue,
  onInviteMember,
  onGenerateInviteQR,
  onGenerateAppDownloadQR,
  onDownloadQR,
  onCopyQRLink,
}: ClubDetailProps) {
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrType, setQrType] = useState<'club_invite' | 'app_download'>('club_invite')

  const membersSince = new Date(club.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const handleQRTypeChange = (type: 'club_invite' | 'app_download') => {
    setQrType(type)
    if (type === 'club_invite') {
      onGenerateInviteQR?.()
    } else {
      onGenerateAppDownloadQR?.(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <ClubHeader
        club={club}
        isAdmin={isAdmin}
        onEdit={onEdit}
        onOpenQRModal={() => {
          onGenerateInviteQR?.()
          setShowQRModal(true)
        }}
      />

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Membership type badge */}
        <div className="flex items-center justify-between">
          <MembershipBadge type={club.membershipType} />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Since {membersSince}
          </span>
        </div>

        {/* Stats */}
        <StatsGrid club={club} />

        {/* Action button */}
        <ActionButton
          club={club}
          onJoin={onJoin}
          onLeave={onLeave}
          onCancelRequest={onCancelRequest}
        />

        {/* Description */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
            About
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {club.description}
          </p>
        </div>

        {/* Contact info */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            Contact
          </h3>
          <ContactInfo club={club} />
        </div>

        {/* Sub-groups */}
        {subGroups.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Groups
            </h3>
            <div className="space-y-2">
              {subGroups.map((group) => (
                <SubGroupCard key={group.id} group={group} />
              ))}
            </div>
          </div>
        )}

        {/* Linked venues */}
        {linkedVenues.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Home Venues
            </h3>
            <div className="space-y-2">
              {linkedVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onView={() => onViewVenue?.(venue.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Members preview */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Members
            </h3>
            {isAdmin && (
              <button
                onClick={onInviteMember}
                className="flex items-center gap-1 text-sm text-lime-600 dark:text-lime-400 hover:underline"
              >
                <UserPlus className="w-4 h-4" />
                Invite
              </button>
            )}
          </div>
          <MemberPreview
            members={members}
            onViewMember={onViewMember}
            onViewAll={() => console.log('View all members')}
          />
        </div>
      </div>

      {/* QR Code Generator Modal */}
      <QRGeneratorModal
        club={club}
        qrCode={clubQRCode ?? null}
        isGenerating={isGeneratingQR}
        isOpen={showQRModal}
        qrType={qrType}
        onTypeChange={handleQRTypeChange}
        onGenerate={qrType === 'club_invite' ? onGenerateInviteQR : () => onGenerateAppDownloadQR?.(true)}
        onDownload={onDownloadQR}
        onCopyLink={onCopyQRLink}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  )
}
