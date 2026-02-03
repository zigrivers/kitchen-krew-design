import { useState, useMemo } from 'react'
import type {
  CannedResponsesProps,
  CannedResponse,
  TicketCategory,
} from '@/../product/sections/support-tickets/types'

// =============================================================================
// Types
// =============================================================================

type CategoryFilter = TicketCategory | 'general' | 'all'

// =============================================================================
// Sub-components
// =============================================================================

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title, content, or tag..."
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-transparent text-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

interface CategoryTabsProps {
  activeCategory: CategoryFilter
  onChange: (category: CategoryFilter) => void
  counts: Record<CategoryFilter, number>
}

function CategoryTabs({ activeCategory, onChange, counts }: CategoryTabsProps) {
  const categories: { key: CategoryFilter; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: 'bg-slate-500' },
    { key: 'account', label: 'Account', color: 'bg-sky-500' },
    { key: 'billing', label: 'Billing', color: 'bg-lime-500' },
    { key: 'technical', label: 'Technical', color: 'bg-violet-500' },
    { key: 'event', label: 'Event', color: 'bg-amber-500' },
    { key: 'abuse', label: 'Abuse', color: 'bg-red-500' },
    { key: 'feature_request', label: 'Feature', color: 'bg-indigo-500' },
    { key: 'general', label: 'General', color: 'bg-slate-400' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === cat.key
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          {cat.key !== 'all' && (
            <span className={`w-2 h-2 rounded-full ${cat.color}`} />
          )}
          {cat.label}
          <span className={`text-xs ${
            activeCategory === cat.key
              ? 'text-slate-300 dark:text-slate-600'
              : 'text-slate-400 dark:text-slate-500'
          }`}>
            {counts[cat.key]}
          </span>
        </button>
      ))}
    </div>
  )
}

interface ResponseCardProps {
  response: CannedResponse
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onSelect?: () => void
}

function ResponseCard({ response, onEdit, onDelete, onDuplicate, onSelect }: ResponseCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const categoryConfig: Record<TicketCategory | 'general', { label: string; color: string; bgColor: string }> = {
    account: { label: 'Account', color: 'text-sky-700 dark:text-sky-400', bgColor: 'bg-sky-100 dark:bg-sky-900/30' },
    billing: { label: 'Billing', color: 'text-lime-700 dark:text-lime-400', bgColor: 'bg-lime-100 dark:bg-lime-900/30' },
    technical: { label: 'Technical', color: 'text-violet-700 dark:text-violet-400', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
    event: { label: 'Event', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    abuse: { label: 'Abuse', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    feature_request: { label: 'Feature', color: 'text-indigo-700 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
    general: { label: 'General', color: 'text-slate-600 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700' },
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const catConfig = categoryConfig[response.category]

  return (
    <div
      className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-lime-300 dark:hover:border-lime-600 hover:shadow-md transition-all overflow-hidden"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
              {response.title}
            </h3>
            <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${catConfig.bgColor} ${catConfig.color}`}>
              {catConfig.label}
            </span>
          </div>
          <div className={`flex items-center gap-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={onSelect}
              className="p-1.5 text-slate-400 hover:text-lime-500 hover:bg-lime-50 dark:hover:bg-lime-900/20 rounded-lg transition-colors"
              title="Use this response"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDuplicate}
              className="p-1.5 text-slate-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
              title="Duplicate"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div
          className={`text-sm text-slate-600 dark:text-slate-300 ${isExpanded ? '' : 'line-clamp-3'}`}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {response.content}
        </div>
        {response.content.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 mt-2"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {response.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
              >
                {tag}
              </span>
            ))}
            {response.tags.length > 4 && (
              <span className="px-2 py-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                +{response.tags.length - 4}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {response.usageCount} uses
            </span>
            <span>Last: {formatDate(response.lastUsed)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CreateEditModalProps {
  response?: CannedResponse | null
  onSave: (data: Omit<CannedResponse, 'id' | 'usageCount' | 'lastUsed'>) => void
  onClose: () => void
}

function CreateEditModal({ response, onSave, onClose }: CreateEditModalProps) {
  const [title, setTitle] = useState(response?.title || '')
  const [category, setCategory] = useState<TicketCategory | 'general'>(response?.category || 'general')
  const [content, setContent] = useState(response?.content || '')
  const [tagsInput, setTagsInput] = useState(response?.tags.join(', ') || '')

  const isEditing = !!response

  const categoryOptions: { value: TicketCategory | 'general'; label: string }[] = [
    { value: 'account', label: 'Account' },
    { value: 'billing', label: 'Billing' },
    { value: 'technical', label: 'Technical' },
    { value: 'event', label: 'Event' },
    { value: 'abuse', label: 'Abuse' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'general', label: 'General' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    onSave({
      title,
      category,
      content,
      tags,
      createdBy: response?.createdBy || 'current-user',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isEditing ? 'Edit Canned Response' : 'Create Canned Response'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Password Reset Instructions"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory | 'general')}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
            >
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Response Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your response template here. Use {{variable}} for placeholders like {{user_name}} or {{agent_name}}."
              rows={8}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm resize-none font-mono"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Tip: Use placeholders like <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-600 rounded">{'{{user_name}}'}</code> that will be replaced when sending.
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="password, login, reset (comma-separated)"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="px-5 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Save Changes' : 'Create Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface EmptyStateProps {
  hasFilters: boolean
  onCreateNew: () => void
}

function EmptyState({ hasFilters, onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
        <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      {hasFilters ? (
        <>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            No matching responses
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            No canned responses yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm mb-4">
            Create reusable response templates to help your team reply faster and more consistently.
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Response
          </button>
        </>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function CannedResponses({
  responses,
  onCreate,
  onEdit,
  onDelete,
  onDuplicate,
  onSelect,
}: CannedResponsesProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingResponse, setEditingResponse] = useState<CannedResponse | null>(null)

  // Category counts
  const categoryCounts = useMemo<Record<CategoryFilter, number>>(() => {
    const counts: Record<CategoryFilter, number> = {
      all: responses.length,
      account: 0,
      billing: 0,
      technical: 0,
      event: 0,
      abuse: 0,
      feature_request: 0,
      general: 0,
    }
    responses.forEach(r => {
      counts[r.category]++
    })
    return counts
  }, [responses])

  // Filtered responses
  const filteredResponses = useMemo(() => {
    let result = [...responses]

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(r => r.category === activeCategory)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.content.toLowerCase().includes(query) ||
        r.tags.some(t => t.toLowerCase().includes(query))
      )
    }

    // Sort by usage count (most used first)
    result.sort((a, b) => b.usageCount - a.usageCount)

    return result
  }, [responses, activeCategory, searchQuery])

  const handleCreateNew = () => {
    setEditingResponse(null)
    setShowModal(true)
  }

  const handleEdit = (response: CannedResponse) => {
    setEditingResponse(response)
    setShowModal(true)
  }

  const handleSave = (data: Omit<CannedResponse, 'id' | 'usageCount' | 'lastUsed'>) => {
    if (editingResponse) {
      onEdit?.(editingResponse.id, data)
    } else {
      onCreate?.(data)
    }
    setShowModal(false)
    setEditingResponse(null)
  }

  const hasFilters = searchQuery !== '' || activeCategory !== 'all'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Canned Responses
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {responses.length} template{responses.length !== 1 ? 's' : ''} · {responses.reduce((sum, r) => sum + r.usageCount, 0).toLocaleString()} total uses
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-lime-500 hover:bg-lime-600 text-white font-medium text-sm transition-colors shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Response
          </button>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4 mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryTabs
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Responses Grid */}
        {filteredResponses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResponses.map(response => (
              <ResponseCard
                key={response.id}
                response={response}
                onEdit={() => handleEdit(response)}
                onDelete={() => onDelete?.(response.id)}
                onDuplicate={() => onDuplicate?.(response.id)}
                onSelect={() => onSelect?.(response.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState hasFilters={hasFilters} onCreateNew={handleCreateNew} />
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <CreateEditModal
          response={editingResponse}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false)
            setEditingResponse(null)
          }}
        />
      )}
    </div>
  )
}
