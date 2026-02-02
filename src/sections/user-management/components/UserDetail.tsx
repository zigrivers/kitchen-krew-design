import { useState } from 'react'
import type {
  UserDetailProps,
  UserAccount,
  AccountStatus,
  UserRole,
  ActivityEvent,
  ActivityEventType,
  AdminNote,
  PlatformAction,
  PlayerNote,
  PlayerWarning,
  MemberAction,
  EscalationCase,
  GDPRRequest,
  NoteCategory,
} from '@/../product/sections/user-management/types'

// Status badge styles
const statusStyles: Record<AccountStatus, { bg: string; text: string; dot: string }> = {
  active: {
    bg: 'bg-lime-500/10 dark:bg-lime-500/20',
    text: 'text-lime-700 dark:text-lime-400',
    dot: 'bg-lime-500',
  },
  suspended: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  banned: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
  pending_deletion: {
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    text: 'text-slate-700 dark:text-slate-400',
    dot: 'bg-slate-500',
  },
}

const roleLabels: Record<UserRole, string> = {
  player: 'Player',
  game_manager: 'Game Manager',
  club_admin: 'Club Admin',
  club_owner: 'Club Owner',
  super_admin: 'Super Admin',
}

const noteCategoryStyles: Record<NoteCategory, { bg: string; text: string }> = {
  general: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300' },
  positive: { bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-700 dark:text-lime-400' },
  concern: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  incident: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
}

const eventTypeIcons: Partial<Record<ActivityEventType, string>> = {
  account_created: '🎉',
  login: '🔑',
  profile_updated: '✏️',
  club_joined: '🏠',
  club_left: '👋',
  warning_received: '⚠️',
  suspension_started: '🚫',
  platform_warning: '⚠️',
  platform_suspension: '🔒',
  platform_ban: '❌',
  deletion_requested: '🗑️',
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}

function ShieldExclamationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
    </svg>
  )
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  )
}

function UserGroupIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function DocumentDownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

// Tab type
type TabId = 'profile' | 'timeline' | 'clubs' | 'notes' | 'gdpr'

// Profile Tab Component
interface ProfileTabProps {
  user: UserAccount
  platformActions: PlatformAction[]
  canTakeAction?: boolean
  canImpersonate?: boolean
  onResetPassword?: () => void
  onImpersonate?: () => void
  onMergeAccount?: (targetUserId: string) => void
  onIssuePlatformWarning?: () => void
  onIssuePlatformSuspension?: () => void
  onIssuePlatformBan?: () => void
}

function ProfileTab({
  user,
  platformActions,
  canTakeAction,
  canImpersonate,
  onResetPassword,
  onImpersonate,
  onIssuePlatformWarning,
  onIssuePlatformSuspension,
  onIssuePlatformBan,
}: ProfileTabProps) {
  const status = statusStyles[user.accountStatus]

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt=""
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-slate-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-500 dark:text-slate-400">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate">
                {user.displayName}
              </h2>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                {user.accountStatus.replace('_', ' ')}
              </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 mb-4">{user.email}</p>

            {/* Roles */}
            <div className="flex flex-wrap gap-2 mb-4">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                >
                  {roleLabels[role]}
                </span>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.clubCount}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Clubs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.eventCount}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Events</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.skillRating}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.loginCount}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Logins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Details</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="text-slate-900 dark:text-white font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Phone</dt>
              <dd className="text-slate-900 dark:text-white font-medium">{user.phone || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Location</dt>
              <dd className="text-slate-900 dark:text-white font-medium">{user.location || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Email Verified</dt>
              <dd className={`font-medium ${user.isEmailVerified ? 'text-lime-600 dark:text-lime-400' : 'text-red-600 dark:text-red-400'}`}>
                {user.isEmailVerified ? 'Yes' : 'No'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">DUPR ID</dt>
              <dd className="text-slate-900 dark:text-white font-medium font-mono text-sm">{user.duprId || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Activity</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Registered</dt>
              <dd className="text-slate-900 dark:text-white font-medium">{formatDate(user.registeredAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Last Active</dt>
              <dd className="text-slate-900 dark:text-white font-medium">{formatRelativeTime(user.lastActiveAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Last Login</dt>
              <dd className="text-slate-900 dark:text-white font-medium">{formatDateTime(user.lastLoginAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Reports</dt>
              <dd className={`font-medium ${user.reportCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                {user.reportCount}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Warnings</dt>
              <dd className={`font-medium ${user.warningCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                {user.warningCount}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Platform Actions History */}
      {platformActions.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Platform Actions</h3>
          <div className="space-y-4">
            {platformActions.map((action) => (
              <div key={action.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    action.actionType === 'ban' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                    action.actionType === 'suspension' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    'bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                  }`}>
                    {action.actionType.toUpperCase()}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(action.issuedAt)} by {action.issuedByName}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{action.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Actions */}
      {canTakeAction && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Admin Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onResetPassword}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              <KeyIcon className="w-4 h-4" />
              Reset Password
            </button>
            {canImpersonate && (
              <button
                onClick={onImpersonate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                <EyeIcon className="w-4 h-4" />
                Impersonate
              </button>
            )}
            <button
              onClick={() => {
                const targetId = prompt('Enter user ID to merge into this account:')
                if (targetId) onMergeAccount?.(targetId)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              <UserGroupIcon className="w-4 h-4" />
              Merge Account
            </button>
            <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-600 pt-3 sm:pt-0 sm:pl-3 mt-3 sm:mt-0">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onIssuePlatformWarning}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded-lg transition-colors"
                >
                  <ShieldExclamationIcon className="w-4 h-4" />
                  Warn
                </button>
                <button
                  onClick={onIssuePlatformSuspension}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded-lg transition-colors"
                >
                  Suspend
                </button>
                <button
                  onClick={onIssuePlatformBan}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  Ban
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Timeline Tab Component
interface TimelineTabProps {
  events: ActivityEvent[]
}

function TimelineTab({ events }: TimelineTabProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  )

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Activity Timeline</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-6">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative pl-10">
              <div className="absolute left-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg">
                {eventTypeIcons[event.eventType] || '📌'}
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {event.eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDateTime(event.occurredAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Clubs Tab Component
interface ClubsTabProps {
  clubNotes: PlayerNote[]
  clubWarnings: PlayerWarning[]
  clubActions: MemberAction[]
  escalationCases: EscalationCase[]
}

function ClubsTab({ clubNotes, clubWarnings, clubActions, escalationCases }: ClubsTabProps) {
  // Group by club
  const clubIds = new Set([
    ...clubNotes.map(n => n.clubId),
    ...clubWarnings.map(w => w.clubId),
    ...clubActions.map(a => a.clubId),
  ])

  const clubs = Array.from(clubIds).map(clubId => ({
    id: clubId,
    name: clubNotes.find(n => n.clubId === clubId)?.clubName ||
          clubWarnings.find(w => w.clubId === clubId)?.clubName ||
          clubActions.find(a => a.clubId === clubId)?.clubName || 'Unknown',
    notes: clubNotes.filter(n => n.clubId === clubId),
    warnings: clubWarnings.filter(w => w.clubId === clubId),
    actions: clubActions.filter(a => a.clubId === clubId),
  }))

  return (
    <div className="space-y-6">
      {/* Escalations */}
      {escalationCases.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4">
            Platform Escalations ({escalationCases.length})
          </h3>
          <div className="space-y-3">
            {escalationCases.map(esc => (
              <div key={esc.id} className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    esc.status === 'resolved' ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400' :
                    esc.status === 'in_review' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400'
                  }`}>
                    {esc.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    from {esc.clubName} • {formatDate(esc.escalatedAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{esc.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* By Club */}
      {clubs.map(club => (
        <div key={club.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{club.name}</h3>

          {/* Actions */}
          {club.actions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Actions</h4>
              <div className="space-y-2">
                {club.actions.map(action => (
                  <div key={action.id} className={`p-3 rounded-lg ${
                    action.actionType === 'ban' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-amber-50 dark:bg-amber-900/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${
                        action.actionType === 'ban' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'
                      }`}>
                        {action.actionType.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(action.issuedAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {club.warnings.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Warnings</h4>
              <div className="space-y-2">
                {club.warnings.map(warning => (
                  <div key={warning.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                        {warning.warningType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(warning.issuedAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{warning.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {club.notes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Notes</h4>
              <div className="space-y-2">
                {club.notes.map(note => {
                  const catStyle = noteCategoryStyles[note.category]
                  return (
                    <div key={note.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${catStyle.bg} ${catStyle.text}`}>
                          {note.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {note.authorName} • {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{note.content}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ))}

      {clubs.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No club-level data for this user
        </div>
      )}
    </div>
  )
}

// Notes Tab Component
interface NotesTabProps {
  adminNotes: AdminNote[]
  onAddNote?: (content: string) => void
}

function NotesTab({ adminNotes, onAddNote }: NotesTabProps) {
  const [newNote, setNewNote] = useState('')

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote?.(newNote.trim())
      setNewNote('')
    }
  }

  const sortedNotes = [...adminNotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Admin Notes</h3>

      {/* Add Note */}
      <div className="mb-6">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about this user..."
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent resize-none"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {sortedNotes.map(note => (
          <div key={note.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">{note.authorName}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(note.createdAt)}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{note.content}</p>
          </div>
        ))}
        {sortedNotes.length === 0 && (
          <p className="text-center py-8 text-slate-500 dark:text-slate-400">No admin notes yet</p>
        )}
      </div>
    </div>
  )
}

// GDPR Tab Component
interface GDPRTabProps {
  gdprRequests: GDPRRequest[]
  canProcessGDPR?: boolean
  onProcessGDPRExport?: (requestId: string) => void
  onProcessGDPRDeletion?: (requestId: string) => void
}

function GDPRTab({ gdprRequests, canProcessGDPR, onProcessGDPRExport, onProcessGDPRDeletion }: GDPRTabProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">GDPR Requests</h3>

      {gdprRequests.length === 0 ? (
        <p className="text-center py-8 text-slate-500 dark:text-slate-400">No GDPR requests from this user</p>
      ) : (
        <div className="space-y-4">
          {gdprRequests.map(request => (
            <div key={request.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    request.requestType === 'deletion' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                    'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400'
                  }`}>
                    {request.requestType.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    request.status === 'completed' ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400' :
                    request.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    'bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(request.requestedAt)}</span>
              </div>

              {request.notes && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{request.notes}</p>
              )}

              {request.gracePeriodEnds && request.status === 'pending' && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">
                  Grace period ends: {formatDate(request.gracePeriodEnds)}
                </p>
              )}

              {canProcessGDPR && request.status === 'pending' && (
                <div className="flex gap-2">
                  {request.requestType === 'export' && (
                    <button
                      onClick={() => onProcessGDPRExport?.(request.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-lime-700 dark:text-lime-400 bg-lime-100 dark:bg-lime-900/30 hover:bg-lime-200 dark:hover:bg-lime-900/50 rounded-lg transition-colors"
                    >
                      <DocumentDownloadIcon className="w-4 h-4" />
                      Generate Export
                    </button>
                  )}
                  {request.requestType === 'deletion' && (
                    <button
                      onClick={() => onProcessGDPRDeletion?.(request.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                    >
                      Process Deletion
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Main Component
export function UserDetail({
  user,
  activityEvents,
  adminNotes,
  platformActions,
  clubNotes,
  clubWarnings,
  clubActions,
  escalationCases,
  gdprRequests,
  canTakeAction,
  canImpersonate,
  canProcessGDPR,
  onAddNote,
  onIssuePlatformWarning,
  onIssuePlatformSuspension,
  onIssuePlatformBan,
  onResetPassword,
  onImpersonate,
  onMergeAccount,
  onProcessGDPRExport,
  onProcessGDPRDeletion,
  onBack,
}: UserDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>('profile')

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'timeline', label: 'Timeline', count: activityEvents.length },
    { id: 'clubs', label: 'Clubs', count: clubNotes.length + clubWarnings.length + clubActions.length },
    { id: 'notes', label: 'Notes', count: adminNotes.length },
    { id: 'gdpr', label: 'GDPR', count: gdprRequests.length },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">{user.displayName}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 -mb-px flex gap-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-lime-600 dark:text-lime-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-600 dark:bg-lime-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'profile' && (
          <ProfileTab
            user={user}
            platformActions={platformActions}
            canTakeAction={canTakeAction}
            canImpersonate={canImpersonate}
            onResetPassword={onResetPassword}
            onImpersonate={onImpersonate}
            onMergeAccount={onMergeAccount}
            onIssuePlatformWarning={() => onIssuePlatformWarning?.({
              playerId: user.id,
              actionType: 'warning',
              reason: 'other',
              description: 'Platform warning issued',
              duration: null,
              startDate: new Date().toISOString(),
              endDate: null,
              relatedEscalationId: null,
            })}
            onIssuePlatformSuspension={() => onIssuePlatformSuspension?.({
              playerId: user.id,
              actionType: 'suspension',
              reason: 'other',
              description: 'Platform suspension issued',
              duration: '30_days',
              startDate: new Date().toISOString(),
              endDate: null,
              relatedEscalationId: null,
            })}
            onIssuePlatformBan={() => onIssuePlatformBan?.({
              playerId: user.id,
              actionType: 'ban',
              reason: 'other',
              description: 'Platform ban issued',
              duration: 'permanent',
              startDate: new Date().toISOString(),
              endDate: null,
              relatedEscalationId: null,
            })}
          />
        )}
        {activeTab === 'timeline' && <TimelineTab events={activityEvents} />}
        {activeTab === 'clubs' && (
          <ClubsTab
            clubNotes={clubNotes}
            clubWarnings={clubWarnings}
            clubActions={clubActions}
            escalationCases={escalationCases}
          />
        )}
        {activeTab === 'notes' && (
          <NotesTab adminNotes={adminNotes} onAddNote={onAddNote} />
        )}
        {activeTab === 'gdpr' && (
          <GDPRTab
            gdprRequests={gdprRequests}
            canProcessGDPR={canProcessGDPR}
            onProcessGDPRExport={onProcessGDPRExport}
            onProcessGDPRDeletion={onProcessGDPRDeletion}
          />
        )}
      </div>
    </div>
  )
}
