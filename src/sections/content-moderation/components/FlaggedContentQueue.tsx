import { useState } from 'react'
import type {
  FlaggedContentQueueProps,
  FlaggedContent,
  FlaggedContentStatus,
  ContentType,
  FlagSource,
} from '@/../product/sections/content-moderation/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface ContentTypeTabsProps {
  activeType: ContentType | 'all'
  counts: Record<ContentType | 'all', number>
  onChange: (type: ContentType | 'all') => void
}

function ContentTypeTabs({ activeType, counts, onChange }: ContentTypeTabsProps) {
  const tabs: { value: ContentType | 'all'; label: string; icon: React.ReactNode }[] = [
    {
      value: 'all',
      label: 'All',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      value: 'profile_photo',
      label: 'Photos',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      value: 'bio',
      label: 'Bios',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      value: 'club_description',
      label: 'Club Desc.',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      value: 'event_description',
      label: 'Events',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
            activeType === tab.value
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {tab.icon}
          {tab.label}
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeType === tab.value
                ? 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}
          >
            {counts[tab.value]}
          </span>
        </button>
      ))}
    </div>
  )
}

interface FlagSourceBadgeProps {
  source: FlagSource
  confidence: number | null
}

function FlagSourceBadge({ source, confidence }: FlagSourceBadgeProps) {
  if (source === 'auto') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Auto {confidence !== null && `${Math.round(confidence * 100)}%`}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 rounded-full">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Manual
    </span>
  )
}

interface StatusBadgeProps {
  status: FlaggedContentStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    approved: 'bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-300',
    removed: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
  }

  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${styles[status]}`}>{status}</span>
}

interface ContentPreviewProps {
  content: FlaggedContent
  onView: () => void
}

function ContentPreview({ content, onView }: ContentPreviewProps) {
  const isImage = content.contentType === 'profile_photo'

  if (isImage && content.content.thumbnailUrl) {
    return (
      <div className="relative group cursor-pointer" onClick={onView}>
        <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
          <img
            src={content.content.thumbnailUrl}
            alt="Flagged content"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          {/* Blur overlay for potentially inappropriate content */}
          <div className="absolute inset-0 backdrop-blur-md bg-slate-900/30 group-hover:backdrop-blur-0 group-hover:bg-transparent transition-all flex items-center justify-center">
            <span className="text-white text-sm font-medium group-hover:opacity-0 transition-opacity">Click to view</span>
          </div>
        </div>
        {/* Flag reason badge */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded text-xs text-white truncate">
            {content.flagReason}
          </div>
        </div>
      </div>
    )
  }

  // Text content
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg h-full flex flex-col cursor-pointer group" onClick={onView}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {content.contentType.replace(/_/g, ' ')}
        </span>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-4 flex-1">
        {content.content.originalText || 'No text content'}
      </p>
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">Flag:</span> {content.flagReason}
        </p>
      </div>
    </div>
  )
}

interface ContentCardProps {
  content: FlaggedContent
  onApprove: () => void
  onRemove: (warnUser: boolean) => void
  onView: () => void
}

function ContentCard({ content, onApprove, onRemove, onView }: ContentCardProps) {
  const [showRemoveOptions, setShowRemoveOptions] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (hours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Content Preview */}
      <ContentPreview content={content} onView={onView} />

      {/* User & Meta Info */}
      <div className="p-4">
        {/* User */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-white text-xs font-semibold">
            {content.user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{content.user.name}</span>
              {content.user.priorViolations > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">
                  {content.user.priorViolations} prior
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Member since {new Date(content.user.memberSince).getFullYear()}
            </div>
          </div>
        </div>

        {/* Meta Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FlagSourceBadge source={content.flagSource} confidence={content.confidence} />
            <StatusBadge status={content.status} />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(content.flaggedAt)}</span>
        </div>

        {/* Actions */}
        {content.status === 'pending' && (
          <div className="flex items-center gap-2">
            <button
              onClick={onApprove}
              className="flex-1 px-3 py-2 text-sm font-medium text-lime-700 dark:text-lime-400 bg-lime-100 dark:bg-lime-500/20 hover:bg-lime-200 dark:hover:bg-lime-500/30 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <div className="relative">
              <button
                onClick={() => setShowRemoveOptions(!showRemoveOptions)}
                className="flex-1 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showRemoveOptions && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowRemoveOptions(false)} />
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1">
                    <button
                      onClick={() => {
                        onRemove(false)
                        setShowRemoveOptions(false)
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Remove only
                    </button>
                    <button
                      onClick={() => {
                        onRemove(true)
                        setShowRemoveOptions(false)
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Remove + Warn user
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Resolved Info */}
        {content.status !== 'pending' && content.resolvedBy && (
          <div className="text-xs text-slate-500 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <span className="font-medium">{content.status === 'approved' ? 'Approved' : 'Removed'}</span> by {content.resolvedBy}
            {content.resolutionNotes && <span className="block mt-1 text-slate-400">{content.resolutionNotes}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function FlaggedContentQueue({
  content,
  isLoading,
  totalCount,
  onApprove,
  onRemove,
  onViewDetails,
  onFilterChange,
  onLoadMore,
  onRefresh,
}: FlaggedContentQueueProps) {
  const [activeType, setActiveType] = useState<ContentType | 'all'>('all')
  const [activeStatus, setActiveStatus] = useState<FlaggedContentStatus | 'all'>('pending')
  const [activeSource, setActiveSource] = useState<FlagSource | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter content
  const filteredContent = content.filter((item) => {
    if (activeType !== 'all' && item.contentType !== activeType) return false
    if (activeStatus !== 'all' && item.status !== activeStatus) return false
    if (activeSource !== 'all' && item.flagSource !== activeSource) return false
    return true
  })

  // Calculate type counts
  const typeCounts: Record<ContentType | 'all', number> = {
    all: content.length,
    profile_photo: content.filter((c) => c.contentType === 'profile_photo').length,
    bio: content.filter((c) => c.contentType === 'bio').length,
    club_description: content.filter((c) => c.contentType === 'club_description').length,
    event_description: content.filter((c) => c.contentType === 'event_description').length,
  }

  const handleFilterChange = () => {
    onFilterChange?.({
      contentType: activeType,
      status: activeStatus,
      source: activeSource,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 lg:px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Flagged Content</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {totalCount || filteredContent.length} items • {content.filter((c) => c.status === 'pending').length} pending review
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={onRefresh}
                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content Type Tabs */}
          <div className="mb-4">
            <ContentTypeTabs activeType={activeType} counts={typeCounts} onChange={setActiveType} />
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value as FlaggedContentStatus | 'all')}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="removed">Removed</option>
            </select>

            {/* Source Filter */}
            <select
              value={activeSource}
              onChange={(e) => setActiveSource(e.target.value as FlagSource | 'all')}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
            >
              <option value="all">All Sources</option>
              <option value="auto">Auto-Flagged</option>
              <option value="manual">User Reported</option>
            </select>

            <div className="flex-1" />

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                <span className="font-medium text-amber-600 dark:text-amber-400">{content.filter((c) => c.status === 'pending').length}</span> pending
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                <span className="font-medium text-lime-600 dark:text-lime-400">{content.filter((c) => c.status === 'approved').length}</span> approved
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                <span className="font-medium text-red-600 dark:text-red-400">{content.filter((c) => c.status === 'removed').length}</span> removed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid/List */}
      <div className="px-4 lg:px-6 py-6">
        {/* Loading */}
        {isLoading && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading flagged content...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredContent.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No flagged content</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {activeType !== 'all' || activeStatus !== 'pending' || activeSource !== 'all'
                ? 'Try adjusting your filters.'
                : 'Content flagged for review will appear here.'}
            </p>
          </div>
        )}

        {/* Grid View */}
        {!isLoading && filteredContent.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContent.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                onApprove={() => onApprove?.(item.id)}
                onRemove={(warnUser) => onRemove?.(item.id, warnUser)}
                onView={() => onViewDetails?.(item.id)}
              />
            ))}
          </div>
        )}

        {/* List View */}
        {!isLoading && filteredContent.length > 0 && viewMode === 'list' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
            {filteredContent.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {/* Thumbnail */}
                {item.contentType === 'profile_photo' && item.content.thumbnailUrl ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <img src={item.content.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{item.user.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">• {item.contentType.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{item.flagReason}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FlagSourceBadge source={item.flagSource} confidence={item.confidence} />
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                {/* Actions */}
                {item.status === 'pending' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onApprove?.(item.id)}
                      className="p-2 text-lime-600 dark:text-lime-400 hover:bg-lime-100 dark:hover:bg-lime-500/20 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onRemove?.(item.id, false)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onViewDetails?.(item.id)}
                      className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="View details"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && filteredContent.length > 0 && onLoadMore && (
          <div className="mt-6 text-center">
            <button
              onClick={onLoadMore}
              className="px-6 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              Load more content
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
