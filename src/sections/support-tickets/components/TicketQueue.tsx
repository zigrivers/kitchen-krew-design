import { useState, useMemo } from 'react'
import type {
  TicketQueueProps,
  Ticket,
  SupportAgent,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  SlaStatus,
} from '@/../product/sections/support-tickets/types'

// =============================================================================
// Types
// =============================================================================

type QuickFilter = 'all' | 'unassigned' | 'overdue' | 'awaiting' | 'starred'
type SortField = 'created' | 'updated' | 'sla'
type SortDirection = 'asc' | 'desc'

// =============================================================================
// Sub-components
// =============================================================================

interface FilterTabsProps {
  activeTab: QuickFilter
  onChange: (tab: QuickFilter) => void
  counts: Record<QuickFilter, number>
}

function FilterTabs({ activeTab, onChange, counts }: FilterTabsProps) {
  const tabs: { key: QuickFilter; label: string; icon?: string }[] = [
    { key: 'all', label: 'All Tickets' },
    { key: 'unassigned', label: 'Unassigned' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'awaiting', label: 'Awaiting Response' },
    { key: 'starred', label: 'Starred' },
  ]

  return (
    <div className="flex gap-1 overflow-x-auto pb-1 -mb-px">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg border-b-2 transition-colors ${
            activeTab === tab.key
              ? 'border-lime-500 text-lime-600 dark:text-lime-400 bg-white dark:bg-slate-800'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          {tab.label}
          {counts[tab.key] > 0 && (
            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
              activeTab === tab.key
                ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {counts[tab.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function SearchBar({ value, onChange, placeholder = 'Search tickets...' }: SearchBarProps) {
  return (
    <div className="relative">
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
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-transparent text-sm"
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

interface FilterDropdownProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-transparent cursor-pointer"
      >
        <option value="">{label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg
        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

interface SortButtonProps {
  field: SortField
  activeField: SortField
  direction: SortDirection
  onChange: (field: SortField) => void
  label: string
}

function SortButton({ field, activeField, direction, onChange, label }: SortButtonProps) {
  const isActive = field === activeField

  return (
    <button
      onClick={() => onChange(field)}
      className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
        isActive
          ? 'text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-900/20'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      {label}
      {isActive && (
        <svg className={`w-3 h-3 transition-transform ${direction === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )}
    </button>
  )
}

interface TicketRowProps {
  ticket: Ticket
  isSelected: boolean
  onSelect: () => void
  onClick: () => void
  onToggleStar: () => void
  agentName?: string
}

function TicketRow({ ticket, isSelected, onSelect, onClick, onToggleStar, agentName }: TicketRowProps) {
  const priorityConfig: Record<TicketPriority, { label: string; className: string; dotClass: string }> = {
    urgent: { label: 'Urgent', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dotClass: 'bg-red-500' },
    high: { label: 'High', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dotClass: 'bg-amber-500' },
    normal: { label: 'Normal', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300', dotClass: 'bg-slate-400' },
    low: { label: 'Low', className: 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400', dotClass: 'bg-slate-300 dark:bg-slate-600' },
  }

  const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
    open: { label: 'Open', className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
    awaiting_response: { label: 'Awaiting', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    escalated: { label: 'Escalated', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
    resolved: { label: 'Resolved', className: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400' },
    closed: { label: 'Closed', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
  }

  const slaConfig: Record<SlaStatus, { label: string; className: string; bgClass: string }> = {
    on_track: { label: 'On Track', className: 'text-lime-600 dark:text-lime-400', bgClass: 'bg-lime-500' },
    at_risk: { label: 'At Risk', className: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-500' },
    breached: { label: 'Breached', className: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-500' },
  }

  const categoryLabels: Record<TicketCategory, string> = {
    account: 'Account',
    billing: 'Billing',
    technical: 'Technical',
    event: 'Event',
    abuse: 'Abuse',
    feature_request: 'Feature',
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    return `${diffDays}d`
  }

  const getSlaCountdown = (deadline: string) => {
    const now = new Date()
    const sla = new Date(deadline)
    const diffMs = sla.getTime() - now.getTime()

    if (diffMs < 0) {
      const overMs = Math.abs(diffMs)
      const overHours = Math.floor(overMs / 3600000)
      const overMins = Math.floor((overMs % 3600000) / 60000)
      if (overHours > 0) return `-${overHours}h ${overMins}m`
      return `-${overMins}m`
    }

    const hours = Math.floor(diffMs / 3600000)
    const mins = Math.floor((diffMs % 3600000) / 60000)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
        isSelected ? 'bg-lime-50 dark:bg-lime-900/10' : ''
      }`}
    >
      {/* Checkbox */}
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500 dark:focus:ring-lime-400 bg-white dark:bg-slate-700"
        />
      </div>

      {/* SLA Indicator */}
      <div className="shrink-0 w-2" onClick={onClick}>
        <div className={`w-2 h-2 rounded-full ${slaConfig[ticket.slaStatus].bgClass}`} title={slaConfig[ticket.slaStatus].label} />
      </div>

      {/* Priority */}
      <div className="shrink-0 w-1.5" onClick={onClick}>
        <div className={`w-1.5 h-8 rounded-full ${priorityConfig[ticket.priority].dotClass}`} title={priorityConfig[ticket.priority].label} />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0" onClick={onClick}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0">
            {ticket.ticketNumber}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${statusConfig[ticket.status].className}`}>
            {statusConfig[ticket.status].label}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
            {categoryLabels[ticket.category]}
          </span>
        </div>
        <p className="font-medium text-slate-900 dark:text-white truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
          {ticket.subject}
        </p>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="truncate max-w-[150px]">{ticket.user.name}</span>
          <span>·</span>
          <span>{formatTimeAgo(ticket.createdAt)} ago</span>
          {ticket.messages.length > 1 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {ticket.messages.length}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Assignee */}
      <div className="shrink-0 w-32 hidden md:block" onClick={onClick}>
        {agentName ? (
          <span className="text-sm text-slate-600 dark:text-slate-300 truncate block">
            {agentName}
          </span>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-500 italic">
            Unassigned
          </span>
        )}
      </div>

      {/* SLA Countdown */}
      <div className="shrink-0 w-20 text-right hidden sm:block" onClick={onClick}>
        <span className={`text-sm font-medium ${slaConfig[ticket.slaStatus].className}`}>
          {getSlaCountdown(ticket.slaDeadline)}
        </span>
      </div>

      {/* Star */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleStar()
        }}
        className={`shrink-0 p-1 rounded transition-colors ${
          ticket.isStarred
            ? 'text-amber-400 hover:text-amber-500'
            : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 opacity-0 group-hover:opacity-100'
        }`}
      >
        <svg className="w-4 h-4" fill={ticket.isStarred ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>

      {/* Chevron */}
      <svg
        className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-lime-500 dark:group-hover:text-lime-400 shrink-0 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={onClick}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

interface BulkActionsBarProps {
  selectedCount: number
  onAssign: () => void
  onChangePriority: () => void
  onMerge: () => void
  onClear: () => void
}

function BulkActionsBar({ selectedCount, onAssign, onChangePriority, onMerge, onClear }: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-lime-50 dark:bg-lime-900/20 border-b border-lime-200 dark:border-lime-800">
      <span className="text-sm font-medium text-lime-700 dark:text-lime-300">
        {selectedCount} selected
      </span>
      <div className="flex-1" />
      <button
        onClick={onAssign}
        className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        Assign
      </button>
      <button
        onClick={onChangePriority}
        className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        Priority
      </button>
      {selectedCount >= 2 && (
        <button
          onClick={onMerge}
          className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Merge
        </button>
      )}
      <button
        onClick={onClear}
        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

interface EmptyStateProps {
  filter: QuickFilter
}

function EmptyState({ filter }: EmptyStateProps) {
  const messages: Record<QuickFilter, { title: string; description: string }> = {
    all: { title: 'No tickets found', description: 'There are no tickets matching your search criteria.' },
    unassigned: { title: 'All caught up!', description: 'There are no unassigned tickets waiting.' },
    overdue: { title: 'Great work!', description: 'No tickets are currently overdue.' },
    awaiting: { title: 'All responded', description: 'No tickets are waiting for your response.' },
    starred: { title: 'No starred tickets', description: 'Star important tickets to find them quickly.' },
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        {messages[filter].title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
        {messages[filter].description}
      </p>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function TicketQueue({
  tickets,
  agents,
  onViewTicket,
  onAssign,
  onChangePriority,
  onToggleStar,
  onMerge,
  onBulkAction,
}: TicketQueueProps) {
  // State
  const [activeTab, setActiveTab] = useState<QuickFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [assigneeFilter, setAssigneeFilter] = useState('')
  const [sortField, setSortField] = useState<SortField>('created')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set())

  // Agent lookup
  const agentMap = useMemo(() => {
    const map = new Map<string, SupportAgent>()
    agents.forEach(agent => map.set(agent.id, agent))
    return map
  }, [agents])

  // Filter counts
  const filterCounts = useMemo<Record<QuickFilter, number>>(() => ({
    all: tickets.length,
    unassigned: tickets.filter(t => !t.assignedTo).length,
    overdue: tickets.filter(t => t.slaStatus === 'breached').length,
    awaiting: tickets.filter(t => t.status === 'awaiting_response').length,
    starred: tickets.filter(t => t.isStarred).length,
  }), [tickets])

  // Filtered & sorted tickets
  const filteredTickets = useMemo(() => {
    let result = [...tickets]

    // Quick filter
    switch (activeTab) {
      case 'unassigned':
        result = result.filter(t => !t.assignedTo)
        break
      case 'overdue':
        result = result.filter(t => t.slaStatus === 'breached')
        break
      case 'awaiting':
        result = result.filter(t => t.status === 'awaiting_response')
        break
      case 'starred':
        result = result.filter(t => t.isStarred)
        break
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(t =>
        t.ticketNumber.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.user.name.toLowerCase().includes(query) ||
        t.user.email.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter(t => t.category === categoryFilter)
    }

    // Priority filter
    if (priorityFilter) {
      result = result.filter(t => t.priority === priorityFilter)
    }

    // Assignee filter
    if (assigneeFilter) {
      result = result.filter(t => t.assignedTo === assigneeFilter)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case 'sla':
          comparison = new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime()
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [tickets, activeTab, searchQuery, categoryFilter, priorityFilter, assigneeFilter, sortField, sortDirection])

  // Handlers
  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleSelectAll = () => {
    if (selectedTickets.size === filteredTickets.length) {
      setSelectedTickets(new Set())
    } else {
      setSelectedTickets(new Set(filteredTickets.map(t => t.id)))
    }
  }

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => {
      const next = new Set(prev)
      if (next.has(ticketId)) {
        next.delete(ticketId)
      } else {
        next.add(ticketId)
      }
      return next
    })
  }

  const handleBulkAssign = () => {
    // In a real app, this would open a modal to select an agent
    onBulkAction?.(Array.from(selectedTickets), 'assign')
  }

  const handleBulkPriority = () => {
    // In a real app, this would open a modal to select priority
    onBulkAction?.(Array.from(selectedTickets), 'priority')
  }

  const handleBulkMerge = () => {
    onMerge?.(Array.from(selectedTickets))
  }

  const categoryOptions = [
    { value: 'account', label: 'Account' },
    { value: 'billing', label: 'Billing' },
    { value: 'technical', label: 'Technical' },
    { value: 'event', label: 'Event' },
    { value: 'abuse', label: 'Abuse' },
    { value: 'feature_request', label: 'Feature Request' },
  ]

  const priorityOptions = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'normal', label: 'Normal' },
    { value: 'low', label: 'Low' },
  ]

  const assigneeOptions = agents
    .filter(a => !a.isOnVacation)
    .map(a => ({ value: a.id, label: a.name }))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Ticket Queue
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
            {activeTab !== 'all' && ` · ${activeTab.replace('_', ' ')}`}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
          <FilterTabs activeTab={activeTab} onChange={setActiveTab} counts={filterCounts} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by ticket #, subject, or user..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label="Category"
              value={categoryFilter}
              options={categoryOptions}
              onChange={setCategoryFilter}
            />
            <FilterDropdown
              label="Priority"
              value={priorityFilter}
              options={priorityOptions}
              onChange={setPriorityFilter}
            />
            <FilterDropdown
              label="Assignee"
              value={assigneeFilter}
              options={assigneeOptions}
              onChange={setAssigneeFilter}
            />
          </div>
        </div>

        {/* Ticket List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* List Header */}
          <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <div className="shrink-0">
              <input
                type="checkbox"
                checked={selectedTickets.size === filteredTickets.length && filteredTickets.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500 dark:focus:ring-lime-400 bg-white dark:bg-slate-700"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Sort by:
                </span>
                <SortButton field="created" activeField={sortField} direction={sortDirection} onChange={handleSortChange} label="Created" />
                <SortButton field="updated" activeField={sortField} direction={sortDirection} onChange={handleSortChange} label="Updated" />
                <SortButton field="sla" activeField={sortField} direction={sortDirection} onChange={handleSortChange} label="SLA" />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <BulkActionsBar
            selectedCount={selectedTickets.size}
            onAssign={handleBulkAssign}
            onChangePriority={handleBulkPriority}
            onMerge={handleBulkMerge}
            onClear={() => setSelectedTickets(new Set())}
          />

          {/* Ticket Rows */}
          {filteredTickets.length > 0 ? (
            <div>
              {filteredTickets.map(ticket => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  isSelected={selectedTickets.has(ticket.id)}
                  onSelect={() => handleSelectTicket(ticket.id)}
                  onClick={() => onViewTicket?.(ticket.id)}
                  onToggleStar={() => onToggleStar?.(ticket.id)}
                  agentName={ticket.assignedTo ? agentMap.get(ticket.assignedTo)?.name : undefined}
                />
              ))}
            </div>
          ) : (
            <EmptyState filter={activeTab} />
          )}
        </div>
      </div>
    </div>
  )
}
