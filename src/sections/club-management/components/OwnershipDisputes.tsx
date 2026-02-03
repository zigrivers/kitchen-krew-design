import { useState } from 'react'
import type {
  OwnershipDisputesProps,
  OwnershipDispute,
  DisputeStatus,
  DisputeType,
  DisputePriority,
  DisputeResolution,
  TimelineEntry,
  TimelineEntryType,
} from '@/../product/sections/club-management/types'

// =============================================================================
// Design Tokens: lime (primary), sky (secondary), slate (neutral)
// Typography: Outfit (heading/body), JetBrains Mono (mono)
// =============================================================================

// Status styles
const statusStyles: Record<DisputeStatus, { bg: string; text: string; dot: string; label: string }> = {
  pending: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'Pending',
  },
  resolved: {
    bg: 'bg-lime-500/10 dark:bg-lime-500/20',
    text: 'text-lime-700 dark:text-lime-400',
    dot: 'bg-lime-500',
    label: 'Resolved',
  },
  appealed: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'Appealed',
  },
}

// Priority styles
const priorityStyles: Record<DisputePriority, { bg: string; text: string; label: string }> = {
  low: {
    bg: 'bg-slate-100 dark:bg-slate-700',
    text: 'text-slate-600 dark:text-slate-400',
    label: 'Low',
  },
  standard: {
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    text: 'text-sky-700 dark:text-sky-400',
    label: 'Standard',
  },
  urgent: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    label: 'Urgent',
  },
}

// Type styles
const typeStyles: Record<DisputeType, { icon: string; label: string; bg: string; text: string }> = {
  club: {
    icon: '🏢',
    label: 'Club',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
  },
  venue: {
    icon: '📍',
    label: 'Venue',
    bg: 'bg-lime-100 dark:bg-lime-900/30',
    text: 'text-lime-700 dark:text-lime-400',
  },
}

// Claim reason labels
const claimReasonLabels: Record<string, string> = {
  venue_ownership: 'Venue Ownership',
  unauthorized_creation: 'Unauthorized Creation',
  dormant_reclaim: 'Dormant Reclaim',
  impersonation: 'Impersonation',
}

// Resolution labels
const resolutionLabels: Record<DisputeResolution, { label: string; icon: string }> = {
  transfer: { label: 'Transfer Ownership', icon: '↔️' },
  co_admin: { label: 'Add as Co-Admin', icon: '👥' },
  rejected: { label: 'Rejected', icon: '❌' },
  deleted: { label: 'Entity Deleted', icon: '🗑️' },
  merged: { label: 'Merged', icon: '🔗' },
}

// Timeline entry type styles
const timelineStyles: Record<TimelineEntryType, { icon: string; bg: string; border: string }> = {
  submitted: {
    icon: '📝',
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    border: 'border-sky-300 dark:border-sky-700',
  },
  auto_action: {
    icon: '⚙️',
    bg: 'bg-slate-100 dark:bg-slate-700',
    border: 'border-slate-300 dark:border-slate-600',
  },
  admin_note: {
    icon: '📋',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-300 dark:border-amber-700',
  },
  admin_action: {
    icon: '⚡',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    border: 'border-purple-300 dark:border-purple-700',
  },
  owner_response: {
    icon: '💬',
    bg: 'bg-lime-100 dark:bg-lime-900/30',
    border: 'border-lime-300 dark:border-lime-700',
  },
  resolution: {
    icon: '✅',
    bg: 'bg-lime-100 dark:bg-lime-900/30',
    border: 'border-lime-300 dark:border-lime-700',
  },
  appeal: {
    icon: '🔄',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
  },
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
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return formatDate(dateString)
}

function getDaysOpen(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
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

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
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

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

// =============================================================================
// Sub-Components
// =============================================================================

// Party Card Component
interface PartyCardProps {
  label: string
  party: { id: string; name: string; email: string }
  variant: 'owner' | 'claimant'
  onContact?: () => void
}

function PartyCard({ label, party, variant, onContact }: PartyCardProps) {
  const variantStyles = {
    owner: {
      bg: 'bg-slate-50 dark:bg-slate-800',
      border: 'border-slate-200 dark:border-slate-700',
      icon: 'text-slate-500 dark:text-slate-400',
    },
    claimant: {
      bg: 'bg-sky-50 dark:bg-sky-900/20',
      border: 'border-sky-200 dark:border-sky-800',
      icon: 'text-sky-500 dark:text-sky-400',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className={`p-4 rounded-xl border ${styles.bg} ${styles.border}`}>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center ${styles.icon}`}>
          <UserCircleIcon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 dark:text-white truncate">
            {party.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {party.email}
          </p>
        </div>
        <button
          onClick={onContact}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Contact"
        >
          <EnvelopeIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Timeline Entry Component
interface TimelineEntryItemProps {
  entry: TimelineEntry
  isLast?: boolean
}

function TimelineEntryItem({ entry, isLast }: TimelineEntryItemProps) {
  const styles = timelineStyles[entry.type]

  return (
    <div className="flex gap-4">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${styles.bg} border-2 ${styles.border} flex items-center justify-center text-lg shrink-0`}>
          {styles.icon}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 my-2" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {entry.authorName && (
              <span className="text-slate-500 dark:text-slate-400">{entry.authorName}: </span>
            )}
            {entry.content}
          </p>
          <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
            {formatDateTime(entry.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Dispute Card Component
interface DisputeCardProps {
  dispute: OwnershipDispute
  isExpanded?: boolean
  onToggle?: () => void
  onView?: () => void
  onAssign?: () => void
  onResolve?: () => void
  onAddNote?: () => void
  onContactOwner?: () => void
  onContactClaimant?: () => void
}

function DisputeCard({
  dispute,
  isExpanded,
  onToggle,
  onView,
  onAssign,
  onResolve,
  onAddNote,
  onContactOwner,
  onContactClaimant,
}: DisputeCardProps) {
  const status = statusStyles[dispute.status]
  const priority = priorityStyles[dispute.priority]
  const type = typeStyles[dispute.type]
  const daysOpen = getDaysOpen(dispute.createdAt)
  const isOverdue = daysOpen > 14 && dispute.status === 'pending'

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all ${
      isExpanded
        ? 'border-lime-400 dark:border-lime-500 shadow-lg shadow-lime-500/10'
        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
    }`}>
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start gap-4">
          {/* Type Icon */}
          <div className={`shrink-0 w-12 h-12 rounded-xl ${type.bg} flex items-center justify-center text-2xl`}>
            {type.icon}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${priority.bg} ${priority.text}`}>
                {priority.label}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${type.bg} ${type.text}`}>
                {type.label}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
              {dispute.entityName}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {claimReasonLabels[dispute.claimReason] || dispute.claimReason} • {dispute.claimant.name} vs {dispute.currentOwner.name}
            </p>
          </div>

          {/* Meta */}
          <div className="shrink-0 text-right">
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mb-1">
              <ClockIcon className="w-3.5 h-3.5" />
              <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
                {isOverdue && '⚠️ '}{daysOpen}d open
              </span>
            </div>
            {dispute.assignedToName && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Assigned: {dispute.assignedToName}
              </p>
            )}
            <ChevronDownIcon className={`w-5 h-5 text-slate-400 mt-1 mx-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700">
          {/* Parties */}
          <div className="grid md:grid-cols-2 gap-4 pt-5">
            <PartyCard
              label="Current Owner"
              party={dispute.currentOwner}
              variant="owner"
              onContact={onContactOwner}
            />
            <PartyCard
              label="Claimant"
              party={dispute.claimant}
              variant="claimant"
              onContact={onContactClaimant}
            />
          </div>

          {/* Claim Description */}
          <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Claim Description
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {dispute.claimDescription}
            </p>
          </div>

          {/* Evidence */}
          {dispute.submittedEvidence.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Submitted Evidence
              </p>
              <div className="flex flex-wrap gap-2">
                {dispute.submittedEvidence.map((doc, i) => (
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

          {/* Appeal Notice */}
          {dispute.status === 'appealed' && dispute.appealReason && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <p className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wider mb-1">
                Appeal Filed {dispute.appealedAt && `• ${formatDate(dispute.appealedAt)}`}
              </p>
              <p className="text-sm text-red-800 dark:text-red-300">
                {dispute.appealReason}
              </p>
            </div>
          )}

          {/* Resolution Info */}
          {dispute.resolution && (
            <div className="mt-4 p-4 bg-lime-50 dark:bg-lime-900/20 rounded-xl border border-lime-200 dark:border-lime-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{resolutionLabels[dispute.resolution].icon}</span>
                <p className="text-sm font-medium text-lime-700 dark:text-lime-400">
                  {resolutionLabels[dispute.resolution].label}
                </p>
                {dispute.resolvedByName && (
                  <span className="text-xs text-lime-600 dark:text-lime-500">
                    by {dispute.resolvedByName}
                  </span>
                )}
              </div>
              {dispute.resolutionDetails && (
                <p className="text-sm text-lime-800 dark:text-lime-300">
                  {dispute.resolutionDetails}
                </p>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="mt-6">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Timeline
            </p>
            <div className="space-y-0">
              {dispute.timeline.map((entry, i) => (
                <TimelineEntryItem
                  key={i}
                  entry={entry}
                  isLast={i === dispute.timeline.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          {dispute.status !== 'resolved' && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-3">
              {!dispute.assignedToId && (
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
                Resolve Dispute
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

export function OwnershipDisputes({
  disputes,
  onViewDispute,
  onAssignDispute,
  onResolve,
  onAddNote,
  onContactParty,
  onFilterByStatus,
  onFilterByType,
  onFilterByPriority,
}: OwnershipDisputesProps) {
  const [selectedStatus, setSelectedStatus] = useState<DisputeStatus | 'all'>('pending')
  const [selectedType, setSelectedType] = useState<DisputeType | 'all'>('all')
  const [selectedPriority, setSelectedPriority] = useState<DisputePriority | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter disputes
  const filteredDisputes = disputes.filter((d) => {
    if (selectedStatus !== 'all' && d.status !== selectedStatus) return false
    if (selectedType !== 'all' && d.type !== selectedType) return false
    if (selectedPriority !== 'all' && d.priority !== selectedPriority) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        d.entityName.toLowerCase().includes(query) ||
        d.currentOwner.name.toLowerCase().includes(query) ||
        d.claimant.name.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Sort by priority and date
  const sortedDisputes = [...filteredDisputes].sort((a, b) => {
    const priorityOrder = { urgent: 0, standard: 1, low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  // Get counts
  const statusCounts = {
    all: disputes.length,
    pending: disputes.filter((d) => d.status === 'pending').length,
    appealed: disputes.filter((d) => d.status === 'appealed').length,
    resolved: disputes.filter((d) => d.status === 'resolved').length,
  }

  const handleStatusFilter = (status: DisputeStatus | 'all') => {
    setSelectedStatus(status)
    setExpandedId(null)
    onFilterByStatus?.(status)
  }

  const handleTypeFilter = (type: DisputeType | 'all') => {
    setSelectedType(type)
    onFilterByType?.(type)
  }

  const handlePriorityFilter = (priority: DisputePriority | 'all') => {
    setSelectedPriority(priority)
    onFilterByPriority?.(priority)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <ScaleIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Ownership Disputes
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Resolve club and venue ownership conflicts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['pending', 'appealed', 'resolved'] as DisputeStatus[]).map((status) => {
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
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by entity or party name..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Type:</span>
              {(['all', 'club', 'venue'] as const).map((type) => {
                const styles = type === 'all' ? null : typeStyles[type]
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeFilter(type)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedType === type
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : styles
                        ? `${styles.bg} ${styles.text}`
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {styles && <span>{styles.icon}</span>}
                    {type === 'all' ? 'All' : styles?.label}
                  </button>
                )
              })}
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Priority:</span>
              {(['all', 'urgent', 'standard', 'low'] as const).map((priority) => {
                const styles = priority === 'all' ? null : priorityStyles[priority]
                return (
                  <button
                    key={priority}
                    onClick={() => handlePriorityFilter(priority)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedPriority === priority
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : styles
                        ? `${styles.bg} ${styles.text}`
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {priority === 'all' ? 'All' : styles?.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Disputes List */}
        {sortedDisputes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <ScaleIcon className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-lg font-medium text-slate-900 dark:text-white">No disputes found</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {selectedStatus === 'pending' ? 'All caught up!' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDisputes.map((dispute) => (
              <DisputeCard
                key={dispute.id}
                dispute={dispute}
                isExpanded={expandedId === dispute.id}
                onToggle={() => setExpandedId(expandedId === dispute.id ? null : dispute.id)}
                onView={() => onViewDispute?.(dispute.id)}
                onAssign={() => onAssignDispute?.(dispute.id, 'current-admin')}
                onResolve={() => {
                  const resolution = prompt('Enter resolution (transfer, co_admin, rejected, deleted, merged):') as DisputeResolution
                  if (resolution) {
                    const details = prompt('Enter resolution details:')
                    if (details) onResolve?.(dispute.id, resolution, details)
                  }
                }}
                onAddNote={() => {
                  const note = prompt('Enter note:')
                  if (note) onAddNote?.(dispute.id, note)
                }}
                onContactOwner={() => onContactParty?.(dispute.id, 'owner')}
                onContactClaimant={() => onContactParty?.(dispute.id, 'claimant')}
              />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Pending
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {statusCounts.pending}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Appealed
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {statusCounts.appealed}
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
        </div>
      </div>
    </div>
  )
}
