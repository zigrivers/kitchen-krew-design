import { useState } from 'react'
import type {
  NonProfitQueueProps,
  NonProfitApplication,
  NonProfitApplicationStatus,
  OrganizationType,
} from '@/../product/sections/club-management/types'

// =============================================================================
// Design Tokens: lime (primary), sky (secondary), slate (neutral)
// Typography: Outfit (heading/body), JetBrains Mono (mono)
// =============================================================================

// Status styles
const statusStyles: Record<NonProfitApplicationStatus, { bg: string; text: string; dot: string; label: string }> = {
  pending: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'Pending Review',
  },
  approved: {
    bg: 'bg-lime-500/10 dark:bg-lime-500/20',
    text: 'text-lime-700 dark:text-lime-400',
    dot: 'bg-lime-500',
    label: 'Approved',
  },
  rejected: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'Rejected',
  },
  needs_info: {
    bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    text: 'text-sky-700 dark:text-sky-400',
    dot: 'bg-sky-500',
    label: 'Needs Info',
  },
}

// Organization type styles and labels
const orgTypeStyles: Record<OrganizationType, { bg: string; text: string; icon: string; label: string }> = {
  '501c3': {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
    icon: '🏛️',
    label: '501(c)(3)',
  },
  parks_rec: {
    bg: 'bg-lime-100 dark:bg-lime-900/30',
    text: 'text-lime-700 dark:text-lime-400',
    icon: '🌳',
    label: 'Parks & Rec',
  },
  ymca: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    icon: '🏋️',
    label: 'YMCA',
  },
  community_center: {
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    text: 'text-sky-700 dark:text-sky-400',
    icon: '🏠',
    label: 'Community Center',
  },
  library: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    icon: '📚',
    label: 'Library',
  },
  other: {
    bg: 'bg-slate-100 dark:bg-slate-700',
    text: 'text-slate-700 dark:text-slate-400',
    icon: '🏢',
    label: 'Other',
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

function getDaysWaiting(dateString: string): number {
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function QuestionMarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
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

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

function ArrowTopRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
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

// Verification Tool Button
interface VerificationToolProps {
  label: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
}

function VerificationTool({ label, icon, href, onClick }: VerificationToolProps) {
  const content = (
    <>
      {icon}
      <span>{label}</span>
      {href && <ArrowTopRightIcon className="w-3 h-3 opacity-50" />}
    </>
  )

  const className = "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  )
}

// Application Card Component
interface ApplicationCardProps {
  application: NonProfitApplication
  isSelected?: boolean
  onSelect?: () => void
  onView?: () => void
  onApprove?: () => void
  onReject?: () => void
  onRequestInfo?: () => void
}

function ApplicationCard({
  application,
  isSelected,
  onSelect,
  onView,
  onApprove,
  onReject,
  onRequestInfo,
}: ApplicationCardProps) {
  const status = statusStyles[application.status]
  const orgType = orgTypeStyles[application.organizationType]
  const daysWaiting = getDaysWaiting(application.submittedAt)
  const isUrgent = daysWaiting > 7 && application.status === 'pending'

  return (
    <div
      className={`relative p-5 bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all hover:shadow-lg ${
        isSelected
          ? 'border-lime-500 dark:border-lime-400 shadow-lg shadow-lime-500/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      {/* Selection Checkbox */}
      {application.status === 'pending' && (
        <button
          onClick={onSelect}
          className={`absolute top-4 right-4 w-5 h-5 rounded border-2 transition-all ${
            isSelected
              ? 'bg-lime-500 border-lime-500 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-lime-400'
          }`}
        >
          {isSelected && <CheckIcon className="w-full h-full p-0.5" />}
        </button>
      )}

      {/* Auto-approval Badge */}
      {application.autoApprovalEligible && (
        <div className="absolute top-4 right-12 inline-flex items-center gap-1 px-2 py-0.5 bg-lime-100 dark:bg-lime-900/30 rounded-full">
          <SparklesIcon className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
          <span className="text-[10px] font-semibold text-lime-700 dark:text-lime-400 uppercase tracking-wider">
            Auto-eligible
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`shrink-0 w-12 h-12 rounded-xl ${orgType.bg} flex items-center justify-center text-xl`}>
          {orgType.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${orgType.bg} ${orgType.text}`}>
              {orgType.label}
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {application.clubName}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {application.organizationName}
          </p>
        </div>
      </div>

      {/* Applicant Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <EnvelopeIcon className="w-4 h-4 text-slate-400" />
          <span className="truncate">{application.applicantEmail}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <GlobeIcon className="w-4 h-4 text-slate-400" />
          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
            @{application.emailDomain}
          </span>
          {application.emailDomain.endsWith('.gov') && (
            <span className="text-[10px] font-semibold text-lime-600 dark:text-lime-400 uppercase">
              Verified .gov
            </span>
          )}
        </div>
        {application.ein && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <BuildingIcon className="w-4 h-4 text-slate-400" />
            <span className="font-mono text-xs">EIN: {application.ein}</span>
          </div>
        )}
      </div>

      {/* Documents */}
      {application.submittedDocuments.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Documents
          </p>
          <div className="flex flex-wrap gap-2">
            {application.submittedDocuments.map((doc, i) => (
              <button
                key={i}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
              >
                <DocumentIcon className="w-3.5 h-3.5" />
                {doc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Requested Info Notice */}
      {application.status === 'needs_info' && application.requestedInfo && (
        <div className="mb-4 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
          <p className="text-xs font-medium text-sky-700 dark:text-sky-400 mb-1">
            Information Requested:
          </p>
          <p className="text-sm text-sky-800 dark:text-sky-300">
            {application.requestedInfo}
          </p>
        </div>
      )}

      {/* Rejection Reason */}
      {application.status === 'rejected' && application.rejectionReason && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
            Rejection Reason:
          </p>
          <p className="text-sm text-red-800 dark:text-red-300">
            {application.rejectionReason}
          </p>
        </div>
      )}

      {/* Notes */}
      {application.notes.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ChatBubbleIcon className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Notes ({application.notes.length})
            </p>
          </div>
          <div className="space-y-2">
            {application.notes.slice(0, 2).map((note, i) => (
              <div key={i} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {note.authorName} • {formatRelativeTime(note.createdAt)}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-slate-400" />
          <span className={`text-xs ${isUrgent ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
            {isUrgent && '⚠️ '}{daysWaiting}d waiting
          </span>
        </div>
        <div className="flex items-center gap-2">
          {application.status === 'pending' && (
            <>
              <button
                onClick={onRequestInfo}
                className="p-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                title="Request Info"
              >
                <QuestionMarkIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onReject}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Reject"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onApprove}
                className="p-2 text-lime-600 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20 rounded-lg transition-colors"
                title="Approve"
              >
                <CheckIcon className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={onView}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function NonProfitQueue({
  applications,
  onViewApplication,
  onApprove,
  onReject,
  onRequestInfo,
  onBulkProcess,
  onFilterByStatus,
  onFilterByType,
}: NonProfitQueueProps) {
  const [selectedStatus, setSelectedStatus] = useState<NonProfitApplicationStatus | 'all'>('pending')
  const [selectedType, setSelectedType] = useState<OrganizationType | 'all'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false
    if (selectedType !== 'all' && app.organizationType !== selectedType) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        app.clubName.toLowerCase().includes(query) ||
        app.organizationName.toLowerCase().includes(query) ||
        app.applicantEmail.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Sort by submission date (oldest first for pending, newest first for others)
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const dateA = new Date(a.submittedAt).getTime()
    const dateB = new Date(b.submittedAt).getTime()
    return selectedStatus === 'pending' ? dateA - dateB : dateB - dateA
  })

  // Get counts
  const statusCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    needs_info: applications.filter((a) => a.status === 'needs_info').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const selectAll = () => {
    const pendingIds = sortedApplications
      .filter((a) => a.status === 'pending')
      .map((a) => a.id)
    setSelectedIds(new Set(pendingIds))
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  const handleStatusFilter = (status: NonProfitApplicationStatus | 'all') => {
    setSelectedStatus(status)
    setSelectedIds(new Set())
    onFilterByStatus?.(status)
  }

  const handleTypeFilter = (type: OrganizationType | 'all') => {
    setSelectedType(type)
    onFilterByType?.(type)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Non-Profit Applications
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review Community Impact tier applications
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Verification Tools */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Verify:</span>
                <VerificationTool
                  label="IRS"
                  icon={<GlobeIcon className="w-3.5 h-3.5" />}
                  href="https://apps.irs.gov/app/eos/"
                />
                <VerificationTool
                  label="TechSoup"
                  icon={<GlobeIcon className="w-3.5 h-3.5" />}
                  href="https://www.techsoup.org/validate"
                />
                <VerificationTool
                  label="WHOIS"
                  icon={<GlobeIcon className="w-3.5 h-3.5" />}
                  href="https://whois.domaintools.com/"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['pending', 'needs_info', 'approved', 'rejected'] as NonProfitApplicationStatus[]).map((status) => {
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

        {/* Filters and Bulk Actions */}
        <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by club, organization, or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Type:</span>
              <button
                onClick={() => handleTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedType === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                All
              </button>
              {(['501c3', 'parks_rec', 'ymca', 'community_center', 'library'] as OrganizationType[]).map((type) => {
                const styles = orgTypeStyles[type]
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeFilter(type)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedType === type
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : `${styles.bg} ${styles.text} hover:opacity-80`
                    }`}
                  >
                    <span>{styles.icon}</span>
                    {styles.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {selectedIds.size} selected
                </span>
                <button
                  onClick={clearSelection}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Clear
                </button>
                <button
                  onClick={selectAll}
                  className="text-sm text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300"
                >
                  Select all pending
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm(`Reject ${selectedIds.size} applications?`)) {
                      onBulkProcess?.(Array.from(selectedIds), 'reject')
                      clearSelection()
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Approve ${selectedIds.size} applications?`)) {
                      onBulkProcess?.(Array.from(selectedIds), 'approve')
                      clearSelection()
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 rounded-lg shadow-sm transition-colors"
                >
                  Approve All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Applications Grid */}
        {sortedApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <DocumentIcon className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-lg font-medium text-slate-900 dark:text-white">No applications found</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {selectedStatus === 'pending' ? 'All caught up!' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                isSelected={selectedIds.has(application.id)}
                onSelect={() => toggleSelection(application.id)}
                onView={() => onViewApplication?.(application.id)}
                onApprove={() => {
                  const notes = prompt('Add approval notes (optional):')
                  onApprove?.(application.id, notes || undefined)
                }}
                onReject={() => {
                  const reason = prompt('Enter rejection reason:')
                  if (reason) onReject?.(application.id, reason)
                }}
                onRequestInfo={() => {
                  const request = prompt('What information is needed?')
                  if (request) onRequestInfo?.(application.id, request)
                }}
              />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Pending Review
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {statusCounts.pending}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Awaiting Info
            </p>
            <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
              {statusCounts.needs_info}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Approved
            </p>
            <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">
              {statusCounts.approved}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Rejected
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {statusCounts.rejected}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
