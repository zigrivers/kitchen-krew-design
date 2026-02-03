import { useState } from 'react'
import type {
  PlatformEscalationsProps,
  PlatformEscalation,
  EscalationStatus,
  EscalationPriority,
  EscalationReason,
  EscalationResolution,
  AdminNote,
} from '@/../product/sections/club-management/types'

// =============================================================================
// Design Tokens: lime (primary), sky (secondary), slate (neutral)
// Typography: Outfit (heading/body), JetBrains Mono (mono)
// =============================================================================

// Status styles
const statusStyles: Record<EscalationStatus, { bg: string; text: string; dot: string; label: string }> = {
  new: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'New',
  },
  in_review: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'In Review',
  },
  resolved: {
    bg: 'bg-lime-500/10 dark:bg-lime-500/20',
    text: 'text-lime-700 dark:text-lime-400',
    dot: 'bg-lime-500',
    label: 'Resolved',
  },
}

// Priority styles
const priorityStyles: Record<EscalationPriority, { bg: string; text: string; label: string; icon: string }> = {
  standard: {
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    text: 'text-sky-700 dark:text-sky-400',
    label: 'Standard',
    icon: '📋',
  },
  urgent: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    label: 'Urgent',
    icon: '🚨',
  },
}

// Reason styles
const reasonStyles: Record<EscalationReason, { label: string; icon: string; bg: string; text: string }> = {
  harassment: {
    label: 'Harassment',
    icon: '😠',
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
  },
  fraud: {
    label: 'Fraud',
    icon: '💰',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
  },
  unsportsmanlike: {
    label: 'Unsportsmanlike',
    icon: '🎾',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
  },
  safety_threat: {
    label: 'Safety Threat',
    icon: '⚠️',
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
  },
  impersonation: {
    label: 'Impersonation',
    icon: '🎭',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
  },
  other: {
    label: 'Other',
    icon: '📝',
    bg: 'bg-slate-100 dark:bg-slate-700',
    text: 'text-slate-700 dark:text-slate-400',
  },
}

// Resolution labels
const resolutionLabels: Record<EscalationResolution, { label: string; icon: string; severity: 'none' | 'warning' | 'moderate' | 'severe' }> = {
  no_action: { label: 'No Action Taken', icon: '✓', severity: 'none' },
  platform_warning: { label: 'Platform Warning', icon: '⚠️', severity: 'warning' },
  platform_suspension: { label: 'Platform Suspension', icon: '🚫', severity: 'moderate' },
  platform_ban: { label: 'Platform Ban', icon: '⛔', severity: 'severe' },
}

// =============================================================================
// Utility Functions
// =============================================================================

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
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

// =============================================================================
// Icons
// =============================================================================

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
    </svg>
  )
}

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  )
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ExclamationTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  )
}

// =============================================================================
// Sub-Components
// =============================================================================

// User Profile Card
interface UserProfileCardProps {
  user: {
    id: string
    name: string
    email: string
    photoUrl: string | null
  }
  previousEscalations: number
  crossClubWarnings: number
}

function UserProfileCard({ user, previousEscalations, crossClubWarnings }: UserProfileCardProps) {
  const hasHistory = previousEscalations > 0 || crossClubWarnings > 0

  return (
    <div className={`p-4 rounded-xl border-2 ${
      hasHistory
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
    }`}>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        Reported User
      </p>
      <div className="flex items-center gap-3">
        {user.photoUrl ? (
          <img
            src={user.photoUrl}
            alt=""
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <UserCircleIcon className="w-8 h-8 text-slate-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 dark:text-white truncate">
            {user.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* History Indicators */}
      {hasHistory && (
        <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800 flex gap-4">
          {previousEscalations > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-red-700 dark:text-red-400">
                {previousEscalations} prior escalation{previousEscalations > 1 ? 's' : ''}
              </span>
            </div>
          )}
          {crossClubWarnings > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <BuildingIcon className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                {crossClubWarnings} cross-club warning{crossClubWarnings > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Note Card
interface NoteCardProps {
  note: AdminNote
}

function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
          {note.authorName}
        </span>
        <span className="text-xs text-amber-600 dark:text-amber-500">
          {formatDateTime(note.createdAt)}
        </span>
      </div>
      <p className="text-sm text-amber-900 dark:text-amber-200">
        {note.content}
      </p>
    </div>
  )
}

// Escalation Card Component
interface EscalationCardProps {
  escalation: PlatformEscalation
  currentAdminId: string
  isExpanded?: boolean
  onToggle?: () => void
  onView?: () => void
  onAssign?: () => void
  onResolve?: () => void
  onAddNote?: () => void
  onSecondApproval?: () => void
}

function EscalationCard({
  escalation,
  currentAdminId,
  isExpanded,
  onToggle,
  onView,
  onAssign,
  onResolve,
  onAddNote,
  onSecondApproval,
}: EscalationCardProps) {
  const status = statusStyles[escalation.status]
  const priority = priorityStyles[escalation.priority]
  const reason = reasonStyles[escalation.reason]
  const isUrgent = escalation.priority === 'urgent' && escalation.status !== 'resolved'
  const needsSecondApproval = escalation.resolution === 'platform_ban' && !escalation.secondApprovalById && escalation.resolvedById !== currentAdminId

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all ${
      isUrgent
        ? 'border-red-300 dark:border-red-700 shadow-lg shadow-red-500/10'
        : isExpanded
        ? 'border-lime-400 dark:border-lime-500 shadow-lg shadow-lime-500/10'
        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
    }`}>
      {/* Urgent Banner */}
      {isUrgent && (
        <div className="px-4 py-2 bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-t-xl">
          <FireIcon className="w-4 h-4" />
          Urgent - Requires Immediate Attention
        </div>
      )}

      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start gap-4">
          {/* Reason Icon */}
          <div className={`shrink-0 w-12 h-12 rounded-xl ${reason.bg} flex items-center justify-center text-2xl`}>
            {reason.icon}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${priority.bg} ${priority.text}`}>
                {priority.icon} {priority.label}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${reason.bg} ${reason.text}`}>
                {reason.label}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {escalation.reportedUser.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Reported by {escalation.escalatingAdmin.name} from {escalation.escalatingClub.name}
            </p>
          </div>

          {/* Meta */}
          <div className="shrink-0 text-right">
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mb-1">
              <ClockIcon className="w-3.5 h-3.5" />
              {formatRelativeTime(escalation.createdAt)}
            </div>
            {escalation.assignedToName && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {escalation.assignedToName}
              </p>
            )}
            <ChevronDownIcon className={`w-5 h-5 text-slate-400 mt-1 mx-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700">
          {/* User Profile */}
          <div className="pt-5">
            <UserProfileCard
              user={escalation.reportedUser}
              previousEscalations={escalation.previousEscalations}
              crossClubWarnings={escalation.crossClubWarnings}
            />
          </div>

          {/* Description */}
          <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Incident Description
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {escalation.description}
            </p>
          </div>

          {/* Club Action */}
          <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
            <p className="text-xs font-medium text-sky-700 dark:text-sky-400 mb-1">
              Club Action Taken
            </p>
            <p className="text-sm text-sky-800 dark:text-sky-300">
              {escalation.clubActionTaken}
            </p>
          </div>

          {/* Other Clubs Affected */}
          {escalation.otherClubsAffected.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Other Clubs Affected
              </p>
              <div className="flex flex-wrap gap-2">
                {escalation.otherClubsAffected.map((clubId) => (
                  <span
                    key={clubId}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-lg"
                  >
                    <BuildingIcon className="w-3.5 h-3.5" />
                    {clubId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evidence */}
          {escalation.evidence.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Evidence
              </p>
              <div className="flex flex-wrap gap-2">
                {escalation.evidence.map((doc, i) => (
                  <button
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
                  >
                    <DocumentIcon className="w-3.5 h-3.5" />
                    {doc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {escalation.notes.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-3">
                <ChatBubbleIcon className="w-4 h-4 text-slate-400" />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Admin Notes ({escalation.notes.length})
                </p>
              </div>
              <div className="space-y-2">
                {escalation.notes.map((note, i) => (
                  <NoteCard key={i} note={note} />
                ))}
              </div>
            </div>
          )}

          {/* Resolution Info */}
          {escalation.resolution && (
            <div className={`mt-5 p-4 rounded-xl border ${
              resolutionLabels[escalation.resolution].severity === 'severe'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : resolutionLabels[escalation.resolution].severity === 'moderate'
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                : resolutionLabels[escalation.resolution].severity === 'warning'
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                : 'bg-lime-50 dark:bg-lime-900/20 border-lime-200 dark:border-lime-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{resolutionLabels[escalation.resolution].icon}</span>
                <p className={`text-sm font-semibold ${
                  resolutionLabels[escalation.resolution].severity === 'severe'
                    ? 'text-red-700 dark:text-red-400'
                    : resolutionLabels[escalation.resolution].severity === 'moderate'
                    ? 'text-amber-700 dark:text-amber-400'
                    : resolutionLabels[escalation.resolution].severity === 'warning'
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-lime-700 dark:text-lime-400'
                }`}>
                  {resolutionLabels[escalation.resolution].label}
                </p>
              </div>
              {escalation.resolutionDetails && (
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                  {escalation.resolutionDetails}
                </p>
              )}
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Resolved by {escalation.resolvedByName}
                {escalation.secondApprovalByName && (
                  <> • Second approval by {escalation.secondApprovalByName}</>
                )}
              </div>
            </div>
          )}

          {/* Second Approval Needed */}
          {needsSecondApproval && (
            <div className="mt-5 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                  Second Approval Required
                </p>
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">
                Platform bans require approval from a second admin.
              </p>
              <button
                onClick={onSecondApproval}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors"
              >
                Approve Ban
              </button>
            </div>
          )}

          {/* Actions */}
          {escalation.status !== 'resolved' && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-3">
              {!escalation.assignedToId && (
                <button
                  onClick={onAssign}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Assign to Me
                </button>
              )}
              <button
                onClick={onAddNote}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Note
              </button>
              <div className="flex-1" />
              <button
                onClick={onResolve}
                className="px-4 py-2 text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 rounded-lg shadow-sm transition-colors"
              >
                Resolve Escalation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function PlatformEscalations({
  escalations,
  currentAdmin,
  onViewEscalation,
  onAssign,
  onResolve,
  onAddNote,
  onRequestInfo,
  onSecondApproval,
  onFilterByStatus,
  onFilterByPriority,
  onFilterByReason,
}: PlatformEscalationsProps) {
  const [selectedStatus, setSelectedStatus] = useState<EscalationStatus | 'all'>('new')
  const [selectedPriority, setSelectedPriority] = useState<EscalationPriority | 'all'>('all')
  const [selectedReason, setSelectedReason] = useState<EscalationReason | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter escalations
  const filteredEscalations = escalations.filter((e) => {
    if (selectedStatus !== 'all' && e.status !== selectedStatus) return false
    if (selectedPriority !== 'all' && e.priority !== selectedPriority) return false
    if (selectedReason !== 'all' && e.reason !== selectedReason) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        e.reportedUser.name.toLowerCase().includes(query) ||
        e.reportedUser.email.toLowerCase().includes(query) ||
        e.escalatingClub.name.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Sort by priority and date
  const sortedEscalations = [...filteredEscalations].sort((a, b) => {
    // Urgent first
    if (a.priority !== b.priority) {
      return a.priority === 'urgent' ? -1 : 1
    }
    // Then by date (newest first for new, oldest first for in_review)
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return selectedStatus === 'new' ? dateB - dateA : dateA - dateB
  })

  // Get counts
  const statusCounts = {
    all: escalations.length,
    new: escalations.filter((e) => e.status === 'new').length,
    in_review: escalations.filter((e) => e.status === 'in_review').length,
    resolved: escalations.filter((e) => e.status === 'resolved').length,
  }

  const urgentCount = escalations.filter((e) => e.priority === 'urgent' && e.status !== 'resolved').length

  const handleStatusFilter = (status: EscalationStatus | 'all') => {
    setSelectedStatus(status)
    setExpandedId(null)
    onFilterByStatus?.(status)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${urgentCount > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                <FireIcon className={`w-6 h-6 ${urgentCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Platform Escalations
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {urgentCount > 0 && (
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      {urgentCount} urgent •
                    </span>
                  )}{' '}
                  Review cases escalated by club admins
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['new', 'in_review', 'resolved'] as EscalationStatus[]).map((status) => {
            const isActive = selectedStatus === status
            const count = statusCounts[status]
            const styles = statusStyles[status]

            return (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                <span>{styles.label}</span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                  isActive
                    ? 'bg-white/20 dark:bg-slate-900/20'
                    : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by user or club..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Priority:</span>
              {(['all', 'urgent', 'standard'] as const).map((priority) => {
                const styles = priority === 'all' ? null : priorityStyles[priority]
                return (
                  <button
                    key={priority}
                    onClick={() => {
                      setSelectedPriority(priority)
                      onFilterByPriority?.(priority)
                    }}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedPriority === priority
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : styles
                        ? `${styles.bg} ${styles.text}`
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {styles && <span>{styles.icon}</span>}
                    {priority === 'all' ? 'All' : styles?.label}
                  </button>
                )
              })}
            </div>

            {/* Reason Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 dark:text-slate-400">Reason:</span>
              <button
                onClick={() => {
                  setSelectedReason('all')
                  onFilterByReason?.('all')
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedReason === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                All
              </button>
              {(['harassment', 'fraud', 'safety_threat', 'unsportsmanlike'] as EscalationReason[]).map((reason) => {
                const styles = reasonStyles[reason]
                return (
                  <button
                    key={reason}
                    onClick={() => {
                      setSelectedReason(reason)
                      onFilterByReason?.(reason)
                    }}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedReason === reason
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : `${styles.bg} ${styles.text}`
                    }`}
                  >
                    {styles.icon} {styles.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Escalations List */}
        {sortedEscalations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <FireIcon className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-lg font-medium text-slate-900 dark:text-white">No escalations found</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {selectedStatus === 'new' ? 'All caught up!' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEscalations.map((escalation) => (
              <EscalationCard
                key={escalation.id}
                escalation={escalation}
                currentAdminId={currentAdmin.id}
                isExpanded={expandedId === escalation.id}
                onToggle={() => setExpandedId(expandedId === escalation.id ? null : escalation.id)}
                onView={() => onViewEscalation?.(escalation.id)}
                onAssign={() => onAssign?.(escalation.id, currentAdmin.id)}
                onResolve={() => {
                  const resolution = prompt('Enter resolution (no_action, platform_warning, platform_suspension, platform_ban):') as EscalationResolution
                  if (resolution) {
                    const details = prompt('Enter resolution details:')
                    if (details) onResolve?.(escalation.id, resolution, details)
                  }
                }}
                onAddNote={() => {
                  const note = prompt('Enter note:')
                  if (note) onAddNote?.(escalation.id, note)
                }}
                onSecondApproval={() => onSecondApproval?.(escalation.id)}
              />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              New
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {statusCounts.new}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              In Review
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {statusCounts.in_review}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Resolved
            </p>
            <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">
              {statusCounts.resolved}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Urgent
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {urgentCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
