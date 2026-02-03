import { useState } from 'react'
import type {
  AppealsQueueProps,
  Appeal,
  AppealDecision,
  ActionType,
  Moderator,
} from '@/../product/sections/content-moderation/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface DecisionBadgeProps {
  decision: AppealDecision
}

function DecisionBadge({ decision }: DecisionBadgeProps) {
  const styles = {
    pending: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    upheld: 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300',
    modified: 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300',
    overturned: 'bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-300',
  }

  const labels = {
    pending: 'Pending Review',
    upheld: 'Upheld',
    modified: 'Modified',
    overturned: 'Overturned',
  }

  return <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[decision]}`}>{labels[decision]}</span>
}

interface ActionTypeBadgeProps {
  type: ActionType
}

function ActionTypeBadge({ type }: ActionTypeBadgeProps) {
  const styles = {
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    suspension: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30',
    ban: 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30',
  }

  const icons = {
    warning: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    suspension: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    ban: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded ${styles[type]}`}>
      {icons[type]}
      <span className="capitalize">{type}</span>
    </span>
  )
}

interface AppealCardProps {
  appeal: Appeal
  onView: () => void
  onAssign: (moderatorId: string) => void
  onDecide: (decision: 'uphold' | 'modify' | 'overturn', reason: string) => void
  moderators: Moderator[]
}

function AppealCard({ appeal, onView, onAssign, onDecide, moderators }: AppealCardProps) {
  const [showAssignMenu, setShowAssignMenu] = useState(false)
  const [showDecisionPanel, setShowDecisionPanel] = useState(false)
  const [decisionReason, setDecisionReason] = useState('')
  const [selectedDecision, setSelectedDecision] = useState<'uphold' | 'modify' | 'overturn' | null>(null)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (hours < 48) return 'Yesterday'
    return `${Math.floor(hours / 24)}d ago`
  }

  const handleSubmitDecision = () => {
    if (selectedDecision && decisionReason.trim()) {
      onDecide(selectedDecision, decisionReason)
      setShowDecisionPanel(false)
      setDecisionReason('')
      setSelectedDecision(null)
    }
  }

  const isPending = appeal.status === 'pending'

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DecisionBadge decision={appeal.status} />
          <span className="text-xs text-slate-500 dark:text-slate-400">Appeal #{appeal.id.slice(-6)}</span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">{getTimeAgo(appeal.createdAt)}</span>
      </div>

      {/* Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
        {/* Left Side - Original Action */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Original Action</h4>
            <ActionTypeBadge type={appeal.originalAction.type} />
          </div>

          {/* Appellant */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-semibold text-sm">
              {appeal.appellant.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">{appeal.appellant.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{appeal.appellant.email}</div>
            </div>
          </div>

          {/* Action Details */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Type</span>
              <span className="font-medium text-slate-900 dark:text-white capitalize">{appeal.originalAction.type}</span>
            </div>
            {appeal.originalAction.duration && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Duration</span>
                <span className="font-medium text-slate-900 dark:text-white">{appeal.originalAction.duration}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Issued</span>
              <span className="font-medium text-slate-900 dark:text-white">{formatDate(appeal.originalAction.issuedAt)}</span>
            </div>
          </div>

          {/* Original Reason */}
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Reason for Action</div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{appeal.originalAction.reason}</p>
          </div>
        </div>

        {/* Right Side - Appeal Statement */}
        <div className="p-5 space-y-4">
          <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Appeal Statement</h4>

          <div className="p-4 bg-lime-500/5 border border-lime-500/20 rounded-lg">
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{appeal.appealStatement}</p>
          </div>

          {/* Supporting Evidence */}
          {appeal.supportingEvidence.length > 0 && (
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Supporting Evidence</div>
              <div className="space-y-2">
                {appeal.supportingEvidence.map((evidence, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 truncate">{evidence.description}</span>
                    <span className="text-xs text-slate-500 uppercase">{evidence.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Decision Result (if not pending) */}
          {!isPending && appeal.decision && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Decision</span>
                <DecisionBadge decision={appeal.decision} />
              </div>
              {appeal.decisionReason && <p className="text-sm text-slate-700 dark:text-slate-300">{appeal.decisionReason}</p>}
              {appeal.decisionBy && appeal.decisionAt && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  By {appeal.decisionBy} on {formatDate(appeal.decisionAt)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Decision Panel */}
      {showDecisionPanel && (
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="text-sm font-medium text-slate-900 dark:text-white">Make a Decision</div>

          {/* Decision Options */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDecision('uphold')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                selectedDecision === 'uphold'
                  ? 'border-slate-500 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M5 13l4 4L19 7" />
              </svg>
              Uphold
            </button>
            <button
              onClick={() => setSelectedDecision('modify')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                selectedDecision === 'modify'
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modify
            </button>
            <button
              onClick={() => setSelectedDecision('overturn')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                selectedDecision === 'overturn'
                  ? 'border-lime-500 bg-lime-50 dark:bg-lime-500/20 text-lime-700 dark:text-lime-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Overturn
            </button>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Decision Reason (Required)
            </label>
            <textarea
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder="Explain your decision..."
              rows={3}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDecisionPanel(false)
                setSelectedDecision(null)
                setDecisionReason('')
              }}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitDecision}
              disabled={!selectedDecision || !decisionReason.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Submit Decision
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      {isPending && !showDecisionPanel && (
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {/* Assigned To */}
          <div className="relative">
            {appeal.assignedTo ? (
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Assigned to <span className="font-medium text-slate-900 dark:text-white">{appeal.assignedTo}</span>
              </span>
            ) : (
              <>
                <button
                  onClick={() => setShowAssignMenu(!showAssignMenu)}
                  className="text-sm font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300"
                >
                  Assign reviewer
                </button>
                {showAssignMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowAssignMenu(false)} />
                    <div className="absolute bottom-full left-0 mb-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1">
                      {moderators.map((mod) => (
                        <button
                          key={mod.id}
                          onClick={() => {
                            onAssign(mod.id)
                            setShowAssignMenu(false)
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          {mod.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onView}
              className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              View Full Details
            </button>
            <button
              onClick={() => setShowDecisionPanel(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors"
            >
              Make Decision
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function AppealsQueue({ appeals, moderators, isLoading, onViewAppeal, onAssign, onDecide, onRefresh }: AppealsQueueProps) {
  const [activeStatus, setActiveStatus] = useState<AppealDecision | 'all'>('pending')

  // Filter appeals
  const filteredAppeals = appeals.filter((appeal) => {
    if (activeStatus === 'all') return true
    return appeal.status === activeStatus
  })

  // Calculate counts
  const statusCounts = {
    all: appeals.length,
    pending: appeals.filter((a) => a.status === 'pending').length,
    upheld: appeals.filter((a) => a.status === 'upheld').length,
    modified: appeals.filter((a) => a.status === 'modified').length,
    overturned: appeals.filter((a) => a.status === 'overturned').length,
  }

  // Calculate success rate
  const resolvedAppeals = appeals.filter((a) => a.status !== 'pending')
  const overturnedOrModified = appeals.filter((a) => a.status === 'overturned' || a.status === 'modified')
  const successRate = resolvedAppeals.length > 0 ? Math.round((overturnedOrModified.length / resolvedAppeals.length) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 lg:px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Appeals</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {appeals.length} total appeals • {statusCounts.pending} pending review
              </p>
            </div>
            <div className="flex items-center gap-3">
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

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{statusCounts.pending}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Pending</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{statusCounts.upheld}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Upheld</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                {statusCounts.modified + statusCounts.overturned}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Granted</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">{successRate}%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Success Rate</div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
            {(['all', 'pending', 'upheld', 'modified', 'overturned'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                  activeStatus === status
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeStatus === status
                      ? 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {statusCounts[status]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appeals List */}
      <div className="px-4 lg:px-6 py-6">
        {/* Loading */}
        {isLoading && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading appeals...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAppeals.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime-100 dark:bg-lime-500/20 mb-4">
              <svg className="w-8 h-8 text-lime-600 dark:text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No appeals found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {activeStatus !== 'pending'
                ? 'Try viewing a different status filter.'
                : 'Appeals from users will appear here when submitted.'}
            </p>
          </div>
        )}

        {/* Appeals Cards */}
        {!isLoading && filteredAppeals.length > 0 && (
          <div className="space-y-6">
            {filteredAppeals.map((appeal) => (
              <AppealCard
                key={appeal.id}
                appeal={appeal}
                onView={() => onViewAppeal?.(appeal.id)}
                onAssign={(modId) => onAssign?.(appeal.id, modId)}
                onDecide={(decision, reason) => onDecide?.(appeal.id, decision, reason)}
                moderators={moderators}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
