import { useState } from 'react'
import type {
  ClubMemberManagementProps,
  NoteCategory,
  WarningType,
  ActionReason,
  ActionDuration,
  PlayerNote,
  PlayerWarning,
  MemberAction,
} from '@/../product/sections/user-management/types'

// Note category configuration
const NOTE_CATEGORIES: { value: NoteCategory; label: string; color: string; icon: string }[] = [
  { value: 'general', label: 'General', color: 'slate', icon: '📋' },
  { value: 'positive', label: 'Positive', color: 'lime', icon: '⭐' },
  { value: 'concern', label: 'Concern', color: 'amber', icon: '⚠️' },
  { value: 'incident', label: 'Incident', color: 'red', icon: '🚨' },
]

// Warning type configuration
const WARNING_TYPES: { value: WarningType; label: string }[] = [
  { value: 'code_of_conduct', label: 'Code of Conduct Violation' },
  { value: 'unsportsmanlike_behavior', label: 'Unsportsmanlike Behavior' },
  { value: 'no_show_abuse', label: 'Repeated No-Shows' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'other', label: 'Other' },
]

// Action reasons
const ACTION_REASONS: { value: ActionReason; label: string }[] = [
  { value: 'code_of_conduct', label: 'Code of Conduct Violation' },
  { value: 'unsportsmanlike_behavior', label: 'Unsportsmanlike Behavior' },
  { value: 'no_show_abuse', label: 'Repeated No-Shows' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'threats_violence', label: 'Threats/Violence' },
  { value: 'fraud', label: 'Fraud' },
  { value: 'other', label: 'Other' },
]

// Duration options
const DURATION_OPTIONS: { value: ActionDuration; label: string }[] = [
  { value: '1_day', label: '1 Day' },
  { value: '7_days', label: '7 Days' },
  { value: '14_days', label: '14 Days' },
  { value: '30_days', label: '30 Days' },
  { value: '90_days', label: '90 Days' },
  { value: '180_days', label: '6 Months' },
  { value: '1_year', label: '1 Year' },
  { value: 'permanent', label: 'Permanent' },
]

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

// ============================================================================
// Sub-Components
// ============================================================================

function PlayerHeader({
  player,
  clubName,
}: {
  player: ClubMemberManagementProps['player']
  clubName: string
}) {
  return (
    <div className="flex items-start gap-4 sm:gap-6">
      {/* Avatar */}
      <div className="relative shrink-0">
        {player.photoUrl ? (
          <img
            src={player.photoUrl}
            alt={player.displayName}
            className="size-16 sm:size-20 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
          />
        ) : (
          <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center ring-2 ring-slate-200 dark:ring-slate-700">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {player.displayName.charAt(0)}
            </span>
          </div>
        )}
        {/* Status indicator */}
        <div
          className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-white dark:border-slate-900 ${
            player.accountStatus === 'active'
              ? 'bg-lime-500'
              : player.accountStatus === 'suspended'
                ? 'bg-amber-500'
                : player.accountStatus === 'banned'
                  ? 'bg-red-500'
                  : 'bg-slate-400'
          }`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
              {player.displayName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Member at {clubName}
            </p>
          </div>
          <div
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              player.accountStatus === 'active'
                ? 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400'
                : player.accountStatus === 'suspended'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : player.accountStatus === 'banned'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {player.accountStatus.replace('_', ' ')}
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {player.eventCount}
            </span>{' '}
            events attended
          </span>
          <span className="text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {player.skillRating.toFixed(1)}
            </span>{' '}
            rating
          </span>
          <span className="text-slate-600 dark:text-slate-400">
            Member since{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatDate(player.registeredAt)}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color = 'slate',
}: {
  label: string
  value: number | string
  color?: 'slate' | 'lime' | 'amber' | 'red'
}) {
  const colorClasses = {
    slate: 'bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100',
    lime: 'bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  }

  return (
    <div className={`rounded-xl p-4 ${colorClasses[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs uppercase tracking-wide opacity-70">{label}</p>
    </div>
  )
}

function NoteCard({ note }: { note: PlayerNote }) {
  const category = NOTE_CATEGORIES.find((c) => c.value === note.category) || NOTE_CATEGORIES[0]

  const colorClasses = {
    slate: 'border-l-slate-400',
    lime: 'border-l-lime-500',
    amber: 'border-l-amber-500',
    red: 'border-l-red-500',
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 border-l-4 ${colorClasses[category.color as keyof typeof colorClasses]} p-4`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span>{category.icon}</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              category.color === 'lime'
                ? 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400'
                : category.color === 'amber'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : category.color === 'red'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {category.label}
          </span>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(note.createdAt)}</span>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{note.content}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        — {note.authorName}
      </p>
    </div>
  )
}

function WarningCard({ warning }: { warning: PlayerWarning }) {
  const warningType = WARNING_TYPES.find((w) => w.value === warning.warningType)

  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800/50 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-600 dark:text-amber-400">⚠️</span>
          <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            {warningType?.label || warning.warningType}
          </span>
        </div>
        <span className="text-xs text-amber-600/70 dark:text-amber-400/70">
          {formatDate(warning.issuedAt)}
        </span>
      </div>
      <p className="text-sm text-amber-900 dark:text-amber-100 mb-3">{warning.description}</p>
      <div className="bg-white/60 dark:bg-slate-800/40 rounded-md p-3 mb-3">
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
          Expected Action
        </p>
        <p className="text-sm text-amber-900 dark:text-amber-100">{warning.expectedAction}</p>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-amber-600 dark:text-amber-400">Issued by {warning.issuedByName}</span>
        {warning.acknowledgedAt ? (
          <span className="flex items-center gap-1 text-lime-600 dark:text-lime-400">
            <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Acknowledged {formatDate(warning.acknowledgedAt)}
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">Pending acknowledgment</span>
        )}
      </div>
      {warning.playerResponse && (
        <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/50">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
            Player Response
          </p>
          <p className="text-sm text-amber-900 dark:text-amber-100 italic">
            "{warning.playerResponse}"
          </p>
        </div>
      )}
    </div>
  )
}

function ActionCard({
  action,
  onLiftSuspension,
}: {
  action: MemberAction
  onLiftSuspension?: () => void
}) {
  const isBan = action.actionType === 'ban'
  const isActive = action.endDate ? new Date(action.endDate) > new Date() : true
  const reason = ACTION_REASONS.find((r) => r.value === action.reason)
  const duration = DURATION_OPTIONS.find((d) => d.value === action.duration)

  return (
    <div
      className={`rounded-lg border p-4 ${
        isBan
          ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50'
          : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={isBan ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}>
            {isBan ? '🚫' : '⏸️'}
          </span>
          <span
            className={`text-sm font-semibold ${
              isBan ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'
            }`}
          >
            {isBan ? 'Permanent Ban' : `Suspension (${duration?.label})`}
          </span>
          {isActive && !action.liftedEarly && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isBan
                  ? 'bg-red-200 text-red-700 dark:bg-red-800/50 dark:text-red-300'
                  : 'bg-amber-200 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300'
              }`}
            >
              Active
            </span>
          )}
          {action.liftedEarly && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              Lifted Early
            </span>
          )}
        </div>
        <span
          className={`text-xs ${
            isBan
              ? 'text-red-600/70 dark:text-red-400/70'
              : 'text-amber-600/70 dark:text-amber-400/70'
          }`}
        >
          {formatDate(action.issuedAt)}
        </span>
      </div>

      <p
        className={`text-sm mb-3 ${isBan ? 'text-red-900 dark:text-red-100' : 'text-amber-900 dark:text-amber-100'}`}
      >
        {action.description}
      </p>

      <div className="flex flex-wrap gap-4 text-xs mb-3">
        <div>
          <span className="text-slate-500 dark:text-slate-400">Reason: </span>
          <span className={isBan ? 'text-red-800 dark:text-red-200' : 'text-amber-800 dark:text-amber-200'}>
            {reason?.label}
          </span>
        </div>
        {!isBan && action.endDate && (
          <div>
            <span className="text-slate-500 dark:text-slate-400">Ends: </span>
            <span className="text-amber-800 dark:text-amber-200">{formatDate(action.endDate)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`text-xs ${isBan ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}
        >
          Issued by {action.issuedByName}
        </span>
        {!isBan && isActive && !action.liftedEarly && onLiftSuspension && (
          <button
            onClick={onLiftSuspension}
            className="text-xs px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            Lift Early
          </button>
        )}
      </div>

      {action.appealStatus !== 'none' && (
        <div className="mt-3 pt-3 border-t border-current/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Appeal:</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                action.appealStatus === 'pending'
                  ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                  : action.appealStatus === 'approved'
                    ? 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {action.appealStatus.charAt(0).toUpperCase() + action.appealStatus.slice(1)}
            </span>
          </div>
          {action.appealNote && (
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 italic">
              {action.appealNote}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Modal Components
// ============================================================================

function AddNoteModal({
  clubId,
  clubName,
  playerId,
  onClose,
  onSubmit,
}: {
  clubId: string
  clubName: string
  playerId: string
  onClose: () => void
  onSubmit: (note: Omit<PlayerNote, 'id' | 'createdAt' | 'authorId' | 'authorName'>) => void
}) {
  const [category, setCategory] = useState<NoteCategory>('general')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    onSubmit({
      playerId,
      clubId,
      clubName,
      category,
      content: content.trim(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Add Note</h2>

            {/* Category selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {NOTE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                      category === cat.value
                        ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Note Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your note about this member..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
                required
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-2 rounded-lg bg-lime-600 text-white font-medium hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function IssueWarningModal({
  clubId,
  clubName,
  playerId,
  onClose,
  onSubmit,
}: {
  clubId: string
  clubName: string
  playerId: string
  onClose: () => void
  onSubmit: (
    warning: Omit<
      PlayerWarning,
      'id' | 'issuedAt' | 'issuedById' | 'issuedByName' | 'acknowledgedAt' | 'playerResponse'
    >
  ) => void
}) {
  const [warningType, setWarningType] = useState<WarningType>('code_of_conduct')
  const [description, setDescription] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [expectedAction, setExpectedAction] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || !incidentDate || !expectedAction.trim()) return
    onSubmit({
      playerId,
      clubId,
      clubName,
      warningType,
      description: description.trim(),
      incidentDate: new Date(incidentDate).toISOString(),
      expectedAction: expectedAction.trim(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-lg">⚠️</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Issue Warning
              </h2>
            </div>

            {/* Warning type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Warning Type
              </label>
              <select
                value={warningType}
                onChange={(e) => setWarningType(e.target.value as WarningType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {WARNING_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Incident date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Incident Date
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the incident in detail..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Expected action */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Expected Corrective Action
              </label>
              <textarea
                value={expectedAction}
                onChange={(e) => setExpectedAction(e.target.value)}
                placeholder="What behavior changes are expected from the member..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                required
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!description.trim() || !incidentDate || !expectedAction.trim()}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Issue Warning
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SuspendBanModal({
  mode,
  clubId,
  clubName,
  playerId,
  onClose,
  onSubmit,
}: {
  mode: 'suspend' | 'ban'
  clubId: string
  clubName: string
  playerId: string
  onClose: () => void
  onSubmit: (
    action: Omit<
      MemberAction,
      | 'id'
      | 'issuedAt'
      | 'issuedById'
      | 'issuedByName'
      | 'appealStatus'
      | 'appealNote'
      | 'liftedEarly'
      | 'liftedAt'
      | 'liftedById'
    >
  ) => void
}) {
  const [reason, setReason] = useState<ActionReason>('code_of_conduct')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState<ActionDuration>(mode === 'ban' ? 'permanent' : '7_days')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    const startDate = new Date()
    let endDate: string | null = null

    if (mode === 'suspend' && duration !== 'permanent') {
      const daysMap: Record<ActionDuration, number> = {
        '1_day': 1,
        '7_days': 7,
        '14_days': 14,
        '30_days': 30,
        '90_days': 90,
        '180_days': 180,
        '1_year': 365,
        permanent: 0,
      }
      const end = new Date(startDate)
      end.setDate(end.getDate() + daysMap[duration])
      endDate = end.toISOString()
    }

    onSubmit({
      playerId,
      clubId,
      clubName,
      actionType: mode === 'ban' ? 'ban' : 'suspension',
      reason,
      description: description.trim(),
      duration: mode === 'ban' ? 'permanent' : duration,
      startDate: startDate.toISOString(),
      endDate,
    })
    onClose()
  }

  const isBan = mode === 'ban'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`size-10 rounded-full flex items-center justify-center ${
                  isBan
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : 'bg-amber-100 dark:bg-amber-900/30'
                }`}
              >
                <span className="text-lg">{isBan ? '🚫' : '⏸️'}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {isBan ? 'Ban Member' : 'Suspend Member'}
              </h2>
            </div>

            {isBan && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Warning:</strong> Banning a member permanently removes their access to your
                  club. This action cannot be undone without a successful appeal.
                </p>
              </div>
            )}

            {/* Reason */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ActionReason)}
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:border-transparent ${
                  isBan
                    ? 'border-slate-300 dark:border-slate-600 focus:ring-red-500'
                    : 'border-slate-300 dark:border-slate-600 focus:ring-amber-500'
                }`}
              >
                {ACTION_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration (suspension only) */}
            {!isBan && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as ActionDuration)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {DURATION_OPTIONS.filter((d) => d.value !== 'permanent').map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Detailed Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Provide detailed documentation for this ${isBan ? 'ban' : 'suspension'}...`}
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                  isBan
                    ? 'border-slate-300 dark:border-slate-600 focus:ring-red-500'
                    : 'border-slate-300 dark:border-slate-600 focus:ring-amber-500'
                }`}
                required
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!description.trim()}
              className={`px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                isBan ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {isBan ? 'Ban Member' : 'Suspend Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EscalateModal({
  clubId,
  clubName,
  playerId,
  playerName,
  clubActionTaken,
  onClose,
  onSubmit,
}: {
  clubId: string
  clubName: string
  playerId: string
  playerName: string
  clubActionTaken: string
  onClose: () => void
  onSubmit: (
    escalation: Omit<
      import('@/../product/sections/user-management/types').EscalationCase,
      | 'id'
      | 'escalatedAt'
      | 'escalatedById'
      | 'escalatedByName'
      | 'status'
      | 'priority'
      | 'assignedToId'
      | 'assignedToName'
      | 'reviewStartedAt'
      | 'resolvedAt'
      | 'resolution'
      | 'resolutionNotes'
    >
  ) => void
}) {
  const [reason, setReason] = useState<ActionReason>('harassment')
  const [description, setDescription] = useState('')
  const [evidence, setEvidence] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return
    onSubmit({
      playerId,
      playerName,
      clubId,
      clubName,
      reason,
      description: description.trim(),
      evidence: evidence
        .split('\n')
        .map((e) => e.trim())
        .filter(Boolean),
      clubActionTaken,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <span className="text-lg">📤</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Escalate to Platform Review
              </h2>
            </div>

            <div className="mb-4 p-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/50 rounded-lg">
              <p className="text-sm text-sky-700 dark:text-sky-300">
                Escalating this case will send it to the Platform Review Queue for Super Admin
                investigation. Use this for severe cases that may require platform-wide action.
              </p>
            </div>

            {/* Reason */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Primary Concern
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ActionReason)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {ACTION_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Situation Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the situation and why you believe platform-wide review is warranted..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Evidence */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Evidence (one per line)
              </label>
              <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="List evidence items, e.g.:&#10;Witness statement from John D.&#10;Screenshot of threatening message&#10;Prior warning issued on 1/15"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!description.trim()}
              className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Escalation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

type TabId = 'overview' | 'notes' | 'warnings' | 'actions'

export function ClubMemberManagement({
  player,
  notes,
  warnings,
  actions,
  activityEvents,
  clubId,
  clubName,
  canWarn = true,
  canSuspend = true,
  canEscalate = true,
  onAddNote,
  onIssueWarning,
  onSuspend,
  onBan,
  onLiftSuspension,
  onEscalate,
}: ClubMemberManagementProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showBanModal, setShowBanModal] = useState(false)
  const [showEscalateModal, setShowEscalateModal] = useState(false)

  // Calculate stats
  const activeActions = actions.filter(
    (a) => (a.endDate ? new Date(a.endDate) > new Date() : true) && !a.liftedEarly
  )
  const activeSuspension = activeActions.find((a) => a.actionType === 'suspension')
  const activeBan = activeActions.find((a) => a.actionType === 'ban')
  const hasActiveRestriction = activeSuspension || activeBan

  // Get latest club action for escalation
  const latestAction = actions[0]
  const clubActionTaken = latestAction
    ? `${latestAction.actionType === 'ban' ? 'Permanent ban' : `${DURATION_OPTIONS.find((d) => d.value === latestAction.duration)?.label} suspension`} - ${ACTION_REASONS.find((r) => r.value === latestAction.reason)?.label}`
    : 'None'

  // Sort items by date
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const sortedWarnings = [...warnings].sort(
    (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  )
  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  )

  // Recent activity (last 5 events)
  const recentActivity = [...activityEvents]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 5)

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'notes' as const, label: 'Notes', count: notes.length },
    { id: 'warnings' as const, label: 'Warnings', count: warnings.length },
    { id: 'actions' as const, label: 'Actions', count: actions.length },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <PlayerHeader player={player} clubName={clubName} />

      {/* Active restriction banner */}
      {hasActiveRestriction && (
        <div
          className={`mt-6 p-4 rounded-xl border ${
            activeBan
              ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50'
              : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activeBan ? '🚫' : '⏸️'}</span>
            <div>
              <p
                className={`font-semibold ${
                  activeBan
                    ? 'text-red-800 dark:text-red-300'
                    : 'text-amber-800 dark:text-amber-300'
                }`}
              >
                {activeBan ? 'Member is permanently banned' : 'Member is currently suspended'}
              </p>
              <p
                className={`text-sm ${
                  activeBan
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {activeBan
                  ? `Banned on ${formatDate(activeBan.startDate)}`
                  : activeSuspension?.endDate
                    ? `Suspension ends ${formatDate(activeSuspension.endDate)}`
                    : 'Indefinite suspension'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setShowAddNoteModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Note
        </button>
        {canWarn && !activeBan && (
          <button
            onClick={() => setShowWarningModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Issue Warning
          </button>
        )}
        {canSuspend && !hasActiveRestriction && (
          <button
            onClick={() => setShowSuspendModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Suspend
          </button>
        )}
        {canSuspend && !activeBan && (
          <button
            onClick={() => setShowBanModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            Ban
          </button>
        )}
        {canEscalate && (
          <button
            onClick={() => setShowEscalateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
            Escalate
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Notes" value={notes.length} />
              <StatCard
                label="Warnings"
                value={warnings.length}
                color={warnings.length > 0 ? 'amber' : 'slate'}
              />
              <StatCard
                label="Suspensions"
                value={actions.filter((a) => a.actionType === 'suspension').length}
                color={actions.filter((a) => a.actionType === 'suspension').length > 0 ? 'amber' : 'slate'}
              />
              <StatCard
                label="Bans"
                value={actions.filter((a) => a.actionType === 'ban').length}
                color={actions.filter((a) => a.actionType === 'ban').length > 0 ? 'red' : 'slate'}
              />
            </div>

            {/* Recent activity */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3">
                Recent Activity
              </h3>
              {recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {recentActivity.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                    >
                      <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                        <svg
                          className="size-4 text-slate-500 dark:text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {event.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDateTime(event.occurredAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  No recent activity
                </p>
              )}
            </div>

            {/* Latest warning */}
            {sortedWarnings.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3">
                  Latest Warning
                </h3>
                <WarningCard warning={sortedWarnings[0]} />
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            {sortedNotes.length > 0 ? (
              sortedNotes.map((note) => <NoteCard key={note.id} note={note} />)
            ) : (
              <div className="text-center py-12">
                <div className="size-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-3xl">📋</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">No notes yet</p>
                <button
                  onClick={() => setShowAddNoteModal(true)}
                  className="mt-4 px-4 py-2 rounded-lg bg-lime-600 text-white font-medium hover:bg-lime-700 transition-colors"
                >
                  Add First Note
                </button>
              </div>
            )}
          </div>
        )}

        {/* Warnings Tab */}
        {activeTab === 'warnings' && (
          <div className="space-y-4">
            {sortedWarnings.length > 0 ? (
              sortedWarnings.map((warning) => <WarningCard key={warning.id} warning={warning} />)
            ) : (
              <div className="text-center py-12">
                <div className="size-16 mx-auto mb-4 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">No warnings issued</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  This member has a clean record
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            {sortedActions.length > 0 ? (
              sortedActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onLiftSuspension={
                    action.actionType === 'suspension' &&
                    !action.liftedEarly &&
                    (action.endDate ? new Date(action.endDate) > new Date() : true)
                      ? () => onLiftSuspension?.(action.id)
                      : undefined
                  }
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="size-16 mx-auto mb-4 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">No disciplinary actions</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  This member has never been suspended or banned
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddNoteModal && (
        <AddNoteModal
          clubId={clubId}
          clubName={clubName}
          playerId={player.id}
          onClose={() => setShowAddNoteModal(false)}
          onSubmit={(note) => onAddNote?.(note)}
        />
      )}
      {showWarningModal && (
        <IssueWarningModal
          clubId={clubId}
          clubName={clubName}
          playerId={player.id}
          onClose={() => setShowWarningModal(false)}
          onSubmit={(warning) => onIssueWarning?.(warning)}
        />
      )}
      {showSuspendModal && (
        <SuspendBanModal
          mode="suspend"
          clubId={clubId}
          clubName={clubName}
          playerId={player.id}
          onClose={() => setShowSuspendModal(false)}
          onSubmit={(action) => onSuspend?.(action)}
        />
      )}
      {showBanModal && (
        <SuspendBanModal
          mode="ban"
          clubId={clubId}
          clubName={clubName}
          playerId={player.id}
          onClose={() => setShowBanModal(false)}
          onSubmit={(action) => onBan?.(action)}
        />
      )}
      {showEscalateModal && (
        <EscalateModal
          clubId={clubId}
          clubName={clubName}
          playerId={player.id}
          playerName={player.displayName}
          clubActionTaken={clubActionTaken}
          onClose={() => setShowEscalateModal(false)}
          onSubmit={(escalation) => onEscalate?.(escalation)}
        />
      )}
    </div>
  )
}
