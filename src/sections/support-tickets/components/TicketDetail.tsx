import { useState, useRef, useEffect } from 'react'
import type {
  TicketDetailProps,
  Ticket,
  Message,
  SupportAgent,
  CannedResponse,
  TicketCategory,
  TicketPriority,
  ResolutionType,
  SlaStatus,
} from '@/../product/sections/support-tickets/types'

// =============================================================================
// Sub-components
// =============================================================================

interface TicketHeaderProps {
  ticket: Ticket
  onToggleStar?: () => void
  onClose?: () => void
}

function TicketHeader({ ticket, onToggleStar, onClose }: TicketHeaderProps) {
  const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
    urgent: { label: 'Urgent', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    high: { label: 'High', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    normal: { label: 'Normal', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
    low: { label: 'Low', className: 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
  }

  const slaConfig: Record<SlaStatus, { label: string; className: string; bgClass: string }> = {
    on_track: { label: 'On Track', className: 'text-lime-600 dark:text-lime-400', bgClass: 'bg-lime-100 dark:bg-lime-900/30' },
    at_risk: { label: 'At Risk', className: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-100 dark:bg-amber-900/30' },
    breached: { label: 'SLA Breached', className: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-100 dark:bg-red-900/30' },
  }

  return (
    <div className="flex items-start gap-4 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <button
        onClick={onClose}
        className="shrink-0 p-1.5 -ml-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-mono text-slate-400 dark:text-slate-500">
            {ticket.ticketNumber}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig[ticket.priority].className}`}>
            {priorityConfig[ticket.priority].label}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${slaConfig[ticket.slaStatus].bgClass} ${slaConfig[ticket.slaStatus].className}`}>
            {slaConfig[ticket.slaStatus].label}
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
          {ticket.subject}
        </h1>
      </div>
      <button
        onClick={onToggleStar}
        className={`shrink-0 p-2 rounded-lg transition-colors ${
          ticket.isStarred
            ? 'text-amber-400 hover:text-amber-500 bg-amber-50 dark:bg-amber-900/20'
            : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        <svg className="w-5 h-5" fill={ticket.isStarred ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
    </div>
  )
}

interface MessageBubbleProps {
  message: Message
  isFromUser: boolean
}

function MessageBubble({ message, isFromUser }: MessageBubbleProps) {
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const isInternal = message.type === 'internal'

  return (
    <div className={`flex ${isFromUser ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] ${isInternal ? 'w-full max-w-none' : ''}`}>
        {isInternal && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px bg-amber-200 dark:bg-amber-800" />
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Internal Note
            </span>
            <div className="flex-1 h-px bg-amber-200 dark:bg-amber-800" />
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isInternal
              ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
              : isFromUser
              ? 'bg-slate-100 dark:bg-slate-700 rounded-tl-sm'
              : 'bg-lime-500 dark:bg-lime-600 text-white rounded-tr-sm'
          }`}
        >
          {!isFromUser && !isInternal && message.authorName && (
            <p className="text-xs font-medium text-lime-100 dark:text-lime-200 mb-1">
              {message.authorName}
            </p>
          )}
          {isInternal && message.authorName && (
            <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
              {message.authorName}
            </p>
          )}
          <p className={`text-sm whitespace-pre-wrap ${
            isInternal
              ? 'text-amber-900 dark:text-amber-100'
              : isFromUser
              ? 'text-slate-700 dark:text-slate-200'
              : 'text-white'
          }`}>
            {message.content}
          </p>
          {message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map(att => (
                <div
                  key={att.id}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    isInternal
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : isFromUser
                      ? 'bg-white dark:bg-slate-600'
                      : 'bg-lime-600 dark:bg-lime-700'
                  }`}
                >
                  <svg className={`w-4 h-4 shrink-0 ${
                    isInternal ? 'text-amber-600 dark:text-amber-400' : isFromUser ? 'text-slate-400' : 'text-lime-200'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className={`text-xs truncate flex-1 ${
                    isInternal ? 'text-amber-800 dark:text-amber-200' : isFromUser ? 'text-slate-600 dark:text-slate-300' : 'text-white'
                  }`}>
                    {att.name}
                  </span>
                  <span className={`text-xs shrink-0 ${
                    isInternal ? 'text-amber-600 dark:text-amber-400' : isFromUser ? 'text-slate-400' : 'text-lime-200'
                  }`}>
                    {formatFileSize(att.size)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className={`text-xs mt-1 ${
          isInternal ? 'text-center' : isFromUser ? 'text-left' : 'text-right'
        } text-slate-400 dark:text-slate-500`}>
          {formatDateTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}

interface ConversationThreadProps {
  messages: Message[]
}

function ConversationThread({ messages }: ConversationThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => (
        <MessageBubble
          key={message.id}
          message={message}
          isFromUser={message.type === 'user'}
        />
      ))}
    </div>
  )
}

interface ReplyComposerProps {
  cannedResponses: CannedResponse[]
  onSend: (content: string, isInternal: boolean) => void
}

function ReplyComposer({ cannedResponses, onSend }: ReplyComposerProps) {
  const [content, setContent] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [showCannedResponses, setShowCannedResponses] = useState(false)
  const [cannedSearch, setCannedSearch] = useState('')

  const filteredCannedResponses = cannedResponses.filter(cr =>
    cr.title.toLowerCase().includes(cannedSearch.toLowerCase()) ||
    cr.tags.some(t => t.toLowerCase().includes(cannedSearch.toLowerCase()))
  )

  const handleSend = () => {
    if (content.trim()) {
      onSend(content.trim(), isInternal)
      setContent('')
    }
  }

  const handleInsertCanned = (response: CannedResponse) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + response.content)
    setShowCannedResponses(false)
    setCannedSearch('')
  }

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      {/* Canned Responses Picker */}
      {showCannedResponses && (
        <div className="border-b border-slate-200 dark:border-slate-700 p-3">
          <div className="relative mb-3">
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
              value={cannedSearch}
              onChange={(e) => setCannedSearch(e.target.value)}
              placeholder="Search canned responses..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredCannedResponses.map(cr => (
              <button
                key={cr.id}
                onClick={() => handleInsertCanned(cr)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <p className="font-medium text-sm text-slate-900 dark:text-white">{cr.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{cr.content.substring(0, 80)}...</p>
              </button>
            ))}
            {filteredCannedResponses.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                No canned responses found
              </p>
            )}
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="p-4">
        {/* Toggle */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setIsInternal(false)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              !isInternal
                ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Public Reply
          </button>
          <button
            onClick={() => setIsInternal(true)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              isInternal
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Internal Note
          </button>
        </div>

        {/* Text Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isInternal ? 'Add an internal note (not visible to user)...' : 'Type your reply...'}
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2 ${
            isInternal
              ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 focus:ring-amber-500'
              : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-lime-500'
          } text-slate-900 dark:text-white placeholder-slate-400`}
        />

        {/* Actions */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCannedResponses(!showCannedResponses)}
              className={`p-2 rounded-lg transition-colors ${
                showCannedResponses
                  ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Insert canned response"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
            <button
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Attach file"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!content.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isInternal
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-lime-500 hover:bg-lime-600 text-white'
            }`}
          >
            {isInternal ? 'Add Note' : 'Send Reply'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface UserProfileCardProps {
  user: Ticket['user']
  onViewUser?: () => void
}

function UserProfileCard({ user, onViewUser }: UserProfileCardProps) {
  const statusConfig = {
    active: { label: 'Active', className: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400' },
    suspended: { label: 'Suspended', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    deleted: { label: 'Deleted', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-3 mb-4">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-lg font-semibold text-slate-500 dark:text-slate-400">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <button
            onClick={onViewUser}
            className="font-semibold text-slate-900 dark:text-white hover:text-lime-600 dark:hover:text-lime-400 transition-colors truncate block"
          >
            {user.name}
          </button>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${statusConfig[user.accountStatus].className}`}>
            {statusConfig[user.accountStatus].label}
          </span>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Member since {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span>{user.totalTickets} total ticket{user.totalTickets !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}

interface QuickActionsProps {
  ticket: Ticket
  agents: SupportAgent[]
  onAssign?: (agentId: string) => void
  onChangePriority?: (priority: TicketPriority) => void
  onEscalate?: (reason: string) => void
  onResolve?: (resolutionType: ResolutionType) => void
  onMerge?: (targetTicketId: string) => void
}

function QuickActions({ ticket, agents, onAssign, onChangePriority, onEscalate, onResolve }: QuickActionsProps) {
  const [showAssign, setShowAssign] = useState(false)
  const [showPriority, setShowPriority] = useState(false)
  const [showResolve, setShowResolve] = useState(false)

  const categoryLabels: Record<TicketCategory, string> = {
    account: 'Account',
    billing: 'Billing',
    technical: 'Technical',
    event: 'Event',
    abuse: 'Abuse',
    feature_request: 'Feature Request',
  }

  const priorityOptions: TicketPriority[] = ['urgent', 'high', 'normal', 'low']
  const resolutionOptions: { value: ResolutionType; label: string }[] = [
    { value: 'solved', label: 'Solved' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'cannot_reproduce', label: 'Cannot Reproduce' },
    { value: 'wont_fix', label: "Won't Fix" },
    { value: 'feature_shipped', label: 'Feature Shipped' },
  ]

  const assignedAgent = agents.find(a => a.id === ticket.assignedTo)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>

      {/* Category */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category</label>
        <p className="mt-1 text-sm text-slate-900 dark:text-white">{categoryLabels[ticket.category]}</p>
      </div>

      {/* Assignee */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Assigned To</label>
        <div className="mt-1 relative">
          <button
            onClick={() => setShowAssign(!showAssign)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm hover:border-lime-300 dark:hover:border-lime-600 transition-colors"
          >
            <span className={assignedAgent ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
              {assignedAgent ? assignedAgent.name : 'Unassigned'}
            </span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showAssign && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {agents.filter(a => !a.isOnVacation).map(agent => (
                <button
                  key={agent.id}
                  onClick={() => {
                    onAssign?.(agent.id)
                    setShowAssign(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex items-center justify-between"
                >
                  <span className="text-slate-900 dark:text-white">{agent.name}</span>
                  <span className="text-xs text-slate-400">{agent.currentTickets}/{agent.maxTickets}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Priority */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Priority</label>
        <div className="mt-1 relative">
          <button
            onClick={() => setShowPriority(!showPriority)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm hover:border-lime-300 dark:hover:border-lime-600 transition-colors"
          >
            <span className="text-slate-900 dark:text-white capitalize">{ticket.priority}</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showPriority && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-10">
              {priorityOptions.map(p => (
                <button
                  key={p}
                  onClick={() => {
                    onChangePriority?.(p)
                    setShowPriority(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors capitalize ${
                    p === ticket.priority ? 'bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => onEscalate?.('Escalated by agent')}
          className="w-full px-3 py-2 text-sm font-medium text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
        >
          Escalate Ticket
        </button>
        <div className="relative">
          <button
            onClick={() => setShowResolve(!showResolve)}
            className="w-full px-3 py-2 text-sm font-medium text-lime-700 dark:text-lime-400 bg-lime-50 dark:bg-lime-900/20 rounded-lg hover:bg-lime-100 dark:hover:bg-lime-900/30 transition-colors"
          >
            Resolve Ticket
          </button>
          {showResolve && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-10">
              {resolutionOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onResolve?.(opt.value)
                    setShowResolve(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-slate-900 dark:text-white"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface RelatedTicketsProps {
  ticketIds: string[]
  onViewRelated?: (ticketId: string) => void
}

function RelatedTickets({ ticketIds, onViewRelated }: RelatedTicketsProps) {
  if (ticketIds.length === 0) return null

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Related Tickets</h3>
      <div className="space-y-2">
        {ticketIds.map(id => (
          <button
            key={id}
            onClick={() => onViewRelated?.(id)}
            className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm text-slate-600 dark:text-slate-300 hover:text-lime-600 dark:hover:text-lime-400"
          >
            {id}
          </button>
        ))}
      </div>
    </div>
  )
}

interface SatisfactionDisplayProps {
  satisfaction: Ticket['satisfaction']
}

function SatisfactionDisplay({ satisfaction }: SatisfactionDisplayProps) {
  if (!satisfaction) return null

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Customer Feedback</h3>
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= satisfaction.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {satisfaction.comment && (
        <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{satisfaction.comment}"</p>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function TicketDetail({
  ticket,
  agents,
  cannedResponses,
  onReply,
  onAssign,
  onEscalate,
  onChangePriority,
  onResolve,
  onClose,
  onMerge,
  onToggleStar,
  onViewRelated,
  onViewUser,
}: TicketDetailProps) {
  const handleReply = (content: string, isInternal: boolean) => {
    onReply?.(ticket.id, content, isInternal)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="h-screen flex flex-col lg:flex-row">
        {/* Main Conversation Area */}
        <div className="flex-1 flex flex-col min-h-0 lg:border-r border-slate-200 dark:border-slate-700">
          <TicketHeader
            ticket={ticket}
            onToggleStar={() => onToggleStar?.(ticket.id)}
            onClose={() => onClose?.(ticket.id)}
          />
          <ConversationThread messages={ticket.messages} />
          <ReplyComposer
            cannedResponses={cannedResponses}
            onSend={handleReply}
          />
        </div>

        {/* Context Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 bg-slate-100 dark:bg-slate-900 p-4 space-y-4 overflow-y-auto lg:max-h-screen">
          <UserProfileCard
            user={ticket.user}
            onViewUser={() => onViewUser?.(ticket.user.id)}
          />
          <QuickActions
            ticket={ticket}
            agents={agents}
            onAssign={(agentId) => onAssign?.(ticket.id, agentId)}
            onChangePriority={(priority) => onChangePriority?.(ticket.id, priority)}
            onEscalate={(reason) => onEscalate?.(ticket.id, reason)}
            onResolve={(type) => onResolve?.(ticket.id, type)}
            onMerge={(targetId) => onMerge?.(ticket.id, targetId)}
          />
          <RelatedTickets
            ticketIds={ticket.relatedTickets}
            onViewRelated={onViewRelated}
          />
          <SatisfactionDisplay satisfaction={ticket.satisfaction} />
        </div>
      </div>
    </div>
  )
}
