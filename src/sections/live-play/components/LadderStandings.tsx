import { useState } from 'react'
import {
  Trophy,
  Swords,
  Clock,
  AlertTriangle,
  Calendar,
  ChevronUp,
  ChevronDown,
  Shield,
  Target,
  CheckCircle2,
  XCircle,
  Timer,
  Users,
  Star,
} from 'lucide-react'
import type {
  Ladder,
  LadderPosition,
  LadderChallenge,
  LadderStandingsProps,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Types
// =============================================================================

interface LadderViewProps {
  ladder: Ladder
  standings: LadderPosition[]
  challenges: LadderChallenge[]
  currentUserId?: string
  onIssueChallenge?: (defenderId: string) => void
  onAcceptChallenge?: (challengeId: string) => void
  onDeclineChallenge?: (challengeId: string) => void
  onViewPlayer?: (playerId: string) => void
  onScheduleMatch?: (challengeId: string) => void
}

// =============================================================================
// Helper Functions
// =============================================================================

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function getDaysAgo(isoString: string): number {
  const date = new Date(isoString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

function getTimeRemaining(deadline: string): { text: string; urgent: boolean } {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffMs = deadlineDate.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 0) {
    return { text: 'Expired', urgent: true }
  } else if (diffHours < 24) {
    return { text: `${diffHours}h remaining`, urgent: true }
  } else {
    return { text: `${diffDays}d remaining`, urgent: false }
  }
}

function getChallengeStatusConfig(status: LadderChallenge['status']) {
  switch (status) {
    case 'pending':
      return { label: 'Pending', bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Clock }
    case 'accepted':
      return { label: 'Accepted', bg: 'bg-lime-500/20', text: 'text-lime-400', icon: CheckCircle2 }
    case 'declined':
      return { label: 'Declined', bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle }
    case 'expired':
      return { label: 'Expired', bg: 'bg-slate-500/20', text: 'text-slate-400', icon: Timer }
    case 'completed':
      return { label: 'Completed', bg: 'bg-sky-500/20', text: 'text-sky-400', icon: CheckCircle2 }
  }
}

// =============================================================================
// Sub-Components
// =============================================================================

interface LadderRowProps {
  position: LadderPosition
  currentUserPosition: number | null
  challengeRange: number
  isCurrentUser: boolean
  hasPendingChallenge: boolean
  isBeingChallenged: boolean
  onChallenge?: () => void
  onViewPlayer?: () => void
}

function LadderRow({
  position,
  currentUserPosition,
  challengeRange,
  isCurrentUser,
  hasPendingChallenge,
  isBeingChallenged,
  onChallenge,
  onViewPlayer,
}: LadderRowProps) {
  const daysAgo = getDaysAgo(position.lastActive)

  // Can challenge if:
  // - Not the current user
  // - Position is challengeable
  // - Within challenge range (current user position - challenge range <= target position < current user position)
  // - Current user doesn't have a pending challenge
  // - Target is not already being challenged
  const canChallenge = currentUserPosition !== null &&
    !isCurrentUser &&
    position.challengeable &&
    position.position < currentUserPosition &&
    position.position >= currentUserPosition - challengeRange &&
    !hasPendingChallenge &&
    !isBeingChallenged

  return (
    <div
      className={`
        group relative flex items-center gap-4 px-4 py-4 border-b border-slate-700/50 last:border-b-0
        transition-all cursor-pointer hover:bg-slate-800/50
        ${isCurrentUser ? 'bg-lime-500/10 border-l-2 border-l-lime-500' : ''}
      `}
      onClick={onViewPlayer}
    >
      {/* Position Badge */}
      <div className="flex-shrink-0">
        <div className={`
          w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg
          ${position.position === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900' :
            position.position === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
            position.position === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-slate-900' :
            'bg-slate-800 text-white border border-slate-700'}
        `}>
          {position.position}
        </div>
      </div>

      {/* Team Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-semibold truncate ${isCurrentUser ? 'text-lime-400' : 'text-white'}`}>
            {position.displayName}
          </p>
          {isCurrentUser && (
            <span className="px-2 py-0.5 bg-lime-500/20 text-lime-400 text-xs font-medium rounded">You</span>
          )}
          {position.inactivityWarning && (
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Inactive
            </span>
          )}
          {isBeingChallenged && (
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded flex items-center gap-1">
              <Swords className="w-3 h-3" />
              Challenged
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {position.rating.toFixed(2)}
          </span>
          <span className="text-slate-600">·</span>
          <span className={daysAgo > 7 ? 'text-amber-400' : ''}>
            Active {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}
          </span>
        </div>
      </div>

      {/* Challenge Button or Status */}
      <div className="flex-shrink-0">
        {canChallenge ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onChallenge?.()
            }}
            className="px-4 py-2 bg-lime-500 text-slate-900 rounded-lg font-semibold text-sm hover:bg-lime-400 transition-colors flex items-center gap-2"
          >
            <Swords className="w-4 h-4" />
            Challenge
          </button>
        ) : !isCurrentUser && !position.challengeable ? (
          <span className="px-3 py-1.5 bg-slate-800 text-slate-500 rounded-lg text-sm flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Protected
          </span>
        ) : null}
      </div>
    </div>
  )
}

interface ChallengeCardProps {
  challenge: LadderChallenge
  standings: LadderPosition[]
  currentUserId?: string
  onAccept?: () => void
  onDecline?: () => void
  onSchedule?: () => void
}

function ChallengeCard({
  challenge,
  standings,
  currentUserId,
  onAccept,
  onDecline,
  onSchedule,
}: ChallengeCardProps) {
  const statusConfig = getChallengeStatusConfig(challenge.status)
  const StatusIcon = statusConfig.icon
  const timeRemaining = getTimeRemaining(challenge.deadline)

  const challenger = standings.find(s => s.teamId === challenge.challengerId)
  const defender = standings.find(s => s.teamId === challenge.defenderId)

  const isChallenger = challenger?.teamId.includes(currentUserId ?? '')
  const isDefender = defender?.teamId.includes(currentUserId ?? '')
  const isInvolved = isChallenger || isDefender

  return (
    <div className={`
      p-4 rounded-xl border
      ${isInvolved ? 'bg-lime-500/5 border-lime-500/30' : 'bg-slate-900/50 border-slate-700/50'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </span>
          {isInvolved && (
            <span className="text-xs text-lime-400 font-medium">Your Challenge</span>
          )}
        </div>
        <span className={`text-xs ${timeRemaining.urgent ? 'text-red-400' : 'text-slate-400'}`}>
          {timeRemaining.text}
        </span>
      </div>

      {/* Matchup */}
      <div className="flex items-center gap-4 mb-3">
        {/* Challenger */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Target className="w-4 h-4 text-lime-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Challenger</span>
          </div>
          <p className={`font-semibold ${isChallenger ? 'text-lime-400' : 'text-white'}`}>
            {challenger?.displayName ?? 'Unknown'}
          </p>
          <p className="text-sm text-slate-500">#{challenge.challengerPosition}</p>
        </div>

        {/* VS */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
            <Swords className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Defender */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-sky-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Defender</span>
          </div>
          <p className={`font-semibold ${isDefender ? 'text-lime-400' : 'text-white'}`}>
            {defender?.displayName ?? 'Unknown'}
          </p>
          <p className="text-sm text-slate-500">#{challenge.defenderPosition}</p>
        </div>
      </div>

      {/* Match Time or Actions */}
      {challenge.status === 'accepted' && challenge.scheduledMatchTime && (
        <div className="flex items-center justify-center gap-2 py-2 bg-slate-800/50 rounded-lg text-sm">
          <Calendar className="w-4 h-4 text-sky-400" />
          <span className="text-slate-300">Match: {formatDateTime(challenge.scheduledMatchTime)}</span>
        </div>
      )}

      {challenge.status === 'pending' && isDefender && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={onAccept}
            className="flex-1 py-2 bg-lime-500 text-slate-900 rounded-lg font-semibold text-sm hover:bg-lime-400 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={onDecline}
            className="flex-1 py-2 bg-slate-700 text-slate-300 rounded-lg font-semibold text-sm hover:bg-slate-600 transition-colors"
          >
            Decline
          </button>
        </div>
      )}

      {challenge.status === 'accepted' && !challenge.scheduledMatchTime && isInvolved && (
        <button
          onClick={onSchedule}
          className="w-full py-2 mt-2 bg-sky-500 text-white rounded-lg font-semibold text-sm hover:bg-sky-400 transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Schedule Match
        </button>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function LadderView({
  ladder,
  standings,
  challenges,
  currentUserId,
  onIssueChallenge,
  onAcceptChallenge,
  onDeclineChallenge,
  onViewPlayer,
  onScheduleMatch,
}: LadderViewProps) {
  const [showAllChallenges, setShowAllChallenges] = useState(false)

  // Find current user's position
  const currentUserStanding = standings.find(s => s.teamId.includes(currentUserId ?? ''))
  const currentUserPosition = currentUserStanding?.position ?? null

  // Get user's pending challenge (as challenger)
  const userPendingChallenge = challenges.find(
    c => c.challengerId.includes(currentUserId ?? '') && ['pending', 'accepted'].includes(c.status)
  )

  // Get challenges involving current user
  const userChallenges = challenges.filter(
    c => c.challengerId.includes(currentUserId ?? '') || c.defenderId.includes(currentUserId ?? '')
  )

  // Get teams being challenged
  const teamsBeingChallenged = new Set(
    challenges.filter(c => ['pending', 'accepted'].includes(c.status)).map(c => c.defenderId)
  )

  // Active challenges (pending or accepted)
  const activeChallenges = challenges.filter(c => ['pending', 'accepted'].includes(c.status))

  // Calculate ladder end date
  const daysRemaining = ladder.endDate
    ? Math.max(0, Math.ceil((new Date(ladder.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800/50 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Trophy className="w-6 h-6 text-amber-400" />
                {ladder.name}
              </h1>
              <p className="text-slate-400 mt-1">
                {standings.length} teams · Challenge range: {ladder.challengeRange} positions
              </p>
            </div>

            {/* Ladder Info */}
            <div className="flex flex-wrap gap-3">
              {daysRemaining !== null && (
                <div className="px-4 py-2 bg-slate-800/50 rounded-xl text-sm">
                  <span className="text-slate-400">Ends: </span>
                  <span className="text-white font-medium">{formatDate(ladder.endDate!)}</span>
                  <span className="text-slate-500 ml-1">({daysRemaining}d)</span>
                </div>
              )}
              <div className="px-4 py-2 bg-slate-800/50 rounded-xl text-sm">
                <span className="text-slate-400">Response: </span>
                <span className="text-white font-medium">{ladder.challengeDeadlineHours}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Position Alert */}
      {currentUserStanding && (
        <div className="bg-gradient-to-r from-lime-500/10 to-amber-500/10 border-b border-lime-500/20 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-lime-500/20 to-amber-500/20 flex items-center justify-center border border-lime-500/30">
                <span className="text-2xl font-bold text-lime-400">#{currentUserPosition}</span>
              </div>
              <div>
                <p className="text-white font-semibold">{currentUserStanding.displayName}</p>
                <p className="text-sm text-slate-400">
                  Can challenge positions {Math.max(1, currentUserPosition! - ladder.challengeRange)} - {currentUserPosition! - 1}
                </p>
              </div>
            </div>
            {userPendingChallenge && (
              <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                <p className="text-sm text-amber-400 font-medium">Challenge Active</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Standings Column */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ChevronUp className="w-5 h-5 text-lime-400" />
                  Ladder Standings
                </h2>
                <span className="text-sm text-slate-400">{standings.length} teams</span>
              </div>

              <div className="divide-y divide-slate-700/50">
                {standings.map(position => (
                  <LadderRow
                    key={position.teamId}
                    position={position}
                    currentUserPosition={currentUserPosition}
                    challengeRange={ladder.challengeRange}
                    isCurrentUser={position.teamId.includes(currentUserId ?? '')}
                    hasPendingChallenge={!!userPendingChallenge}
                    isBeingChallenged={teamsBeingChallenged.has(position.teamId)}
                    onChallenge={() => onIssueChallenge?.(position.teamId)}
                    onViewPlayer={() => onViewPlayer?.(position.teamId)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Challenges Column */}
          <div className="lg:col-span-1">
            {/* Your Challenges */}
            {userChallenges.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Swords className="w-4 h-4" />
                  Your Challenges
                </h3>
                <div className="space-y-3">
                  {userChallenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      standings={standings}
                      currentUserId={currentUserId}
                      onAccept={() => onAcceptChallenge?.(challenge.id)}
                      onDecline={() => onDeclineChallenge?.(challenge.id)}
                      onSchedule={() => onScheduleMatch?.(challenge.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Active Challenges */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Challenges ({activeChallenges.length})
              </h3>
              {activeChallenges.length > 0 ? (
                <div className="space-y-3">
                  {(showAllChallenges ? activeChallenges : activeChallenges.slice(0, 3)).map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      standings={standings}
                      currentUserId={currentUserId}
                      onAccept={() => onAcceptChallenge?.(challenge.id)}
                      onDecline={() => onDeclineChallenge?.(challenge.id)}
                      onSchedule={() => onScheduleMatch?.(challenge.id)}
                    />
                  ))}
                  {activeChallenges.length > 3 && (
                    <button
                      onClick={() => setShowAllChallenges(!showAllChallenges)}
                      className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {showAllChallenges ? 'Show less' : `Show ${activeChallenges.length - 3} more`}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Swords className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No active challenges</p>
                </div>
              )}
            </div>

            {/* Rules Summary */}
            <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
              <h4 className="text-sm font-semibold text-white mb-2">Ladder Rules</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Challenge up to {ladder.challengeRange} positions above you</li>
                <li>• Defenders have {ladder.challengeDeadlineHours}h to respond</li>
                <li>• Win to swap positions with defender</li>
                <li>• Inactive for {ladder.inactivityDropDays}+ days = position drop</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export both the full view and a simpler standings-only component
export { LadderView as LadderStandings }
