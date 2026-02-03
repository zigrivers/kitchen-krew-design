import { useState } from 'react'
import {
  Trophy,
  Users,
  Clock,
  CheckCircle2,
  Play,
  AlertTriangle,
  AlertCircle,
  Bell,
  ChevronRight,
  ChevronDown,
  Calendar,
  MapPin,
  Settings,
  Pause,
  Share2,
  Monitor,
  LayoutGrid,
  List,
  Megaphone,
  Timer,
  TrendingUp,
  Award,
  Radio,
  RefreshCw,
  Flag,
  CircleDot,
  XCircle,
  MoreVertical,
  ArrowRight,
} from 'lucide-react'
import type {
  LiveEvent,
  Tournament,
  EventProgress,
  Bracket,
  BracketMatch,
  CourtAssignment,
  RoundSchedule,
  TournamentTimelineEvent,
  TournamentAlert,
  TournamentQuickStats,
  Seed,
  CompletedBracketMatchSummary,
  ScoreDispute,
  TournamentDashboardProps,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Dashboard Header
// =============================================================================

interface DashboardHeaderProps {
  event: LiveEvent
  tournament: Tournament
  quickStats: TournamentQuickStats
  onPauseEvent?: (reason: string) => void
  onResumeEvent?: () => void
  onShareTournament?: () => void
  onOpenCourtBoard?: () => void
  onViewBracket?: () => void
}

function DashboardHeader({
  event,
  tournament,
  quickStats,
  onPauseEvent,
  onResumeEvent,
  onShareTournament,
  onOpenCourtBoard,
  onViewBracket,
}: DashboardHeaderProps) {
  const [showPauseModal, setShowPauseModal] = useState(false)

  return (
    <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 overflow-hidden">
      {/* Top Bar */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-700/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-lime-500/20">
            <Trophy className="w-5 h-5 text-lime-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{event.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400">
                {tournament.bracketType.replace('_', ' ')} • {tournament.bracketSize} teams
              </span>
              {event.isPaused ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                  <Pause className="w-3 h-3" />
                  Paused
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-lime-500/20 text-lime-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                  Live
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onViewBracket}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="View Bracket"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenCourtBoard}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Court Status Board"
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={onShareTournament}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Share Tournament"
          >
            <Share2 className="w-5 h-5" />
          </button>
          {event.isPaused ? (
            <button
              onClick={onResumeEvent}
              className="px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-900 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Resume Event
            </button>
          ) : (
            <button
              onClick={() => setShowPauseModal(true)}
              className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        <QuickStat
          icon={<Users className="w-4 h-4" />}
          label="Teams Remaining"
          value={quickStats.teamsRemaining}
          color="lime"
        />
        <QuickStat
          icon={<XCircle className="w-4 h-4" />}
          label="Eliminated"
          value={quickStats.teamsEliminated}
          color="slate"
        />
        <QuickStat
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Matches Done"
          value={quickStats.matchesCompleted}
          color="lime"
        />
        <QuickStat
          icon={<Radio className="w-4 h-4" />}
          label="In Progress"
          value={quickStats.matchesInProgress}
          color="sky"
        />
        <QuickStat
          icon={<Clock className="w-4 h-4" />}
          label="Remaining"
          value={quickStats.matchesRemaining}
          color="slate"
        />
        <QuickStat
          icon={<Timer className="w-4 h-4" />}
          label="Avg Duration"
          value={`${quickStats.avgMatchDuration}m`}
          color="slate"
        />
        <QuickStat
          icon={<Calendar className="w-4 h-4" />}
          label="Est. End"
          value={new Date(quickStats.estimatedEndTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
          color="slate"
        />
      </div>

      {/* Simple Pause Modal */}
      {showPauseModal && (
        <PauseModal
          onConfirm={(reason) => {
            onPauseEvent?.(reason)
            setShowPauseModal(false)
          }}
          onCancel={() => setShowPauseModal(false)}
        />
      )}
    </div>
  )
}

interface QuickStatProps {
  icon: React.ReactNode
  label: string
  value: string | number
  color: 'lime' | 'sky' | 'amber' | 'slate'
}

function QuickStat({ icon, label, value, color }: QuickStatProps) {
  const colorClasses = {
    lime: 'text-lime-400 bg-lime-500/10',
    sky: 'text-sky-400 bg-sky-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    slate: 'text-slate-400 bg-slate-700/50',
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  )
}

interface PauseModalProps {
  onConfirm: (reason: string) => void
  onCancel: () => void
}

function PauseModal({ onConfirm, onCancel }: PauseModalProps) {
  const [reason, setReason] = useState('')
  const quickReasons = ['Weather delay', 'Lunch break', 'Technical issue', 'Emergency']

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-lg font-bold text-white mb-4">Pause Tournament</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {quickReasons.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  reason === r
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason || 'No reason specified')}
            className="flex-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-medium transition-colors"
          >
            Pause Tournament
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Alert Banner
// =============================================================================

interface AlertBannerProps {
  alerts: TournamentAlert[]
  onDismissAlert?: (alertId: string) => void
}

function AlertBanner({ alerts, onDismissAlert }: AlertBannerProps) {
  const urgentAlerts = alerts.filter((a) => a.severity === 'urgent')
  const warningAlerts = alerts.filter((a) => a.severity === 'warning')

  if (urgentAlerts.length === 0 && warningAlerts.length === 0) return null

  return (
    <div className="space-y-2">
      {urgentAlerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-400">{alert.title}</p>
              <p className="text-xs text-red-400/70">{alert.description}</p>
            </div>
          </div>
          <button
            onClick={() => onDismissAlert?.(alert.id)}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      ))}
      {warningAlerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-400">{alert.title}</p>
              <p className="text-xs text-amber-400/70">{alert.description}</p>
            </div>
          </div>
          <button
            onClick={() => onDismissAlert?.(alert.id)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Court Grid
// =============================================================================

interface CourtGridProps {
  courtAssignments: CourtAssignment[]
  bracketMatches: BracketMatch[]
  onCallMatch?: (bracketMatchId: string, courtId: string) => void
  onStartMatch?: (bracketMatchId: string) => void
  onEnterScore?: (bracketMatchId: string) => void
  onAssignCourt?: (bracketMatchId: string, courtId: string) => void
}

function CourtGrid({
  courtAssignments,
  bracketMatches,
  onCallMatch,
  onStartMatch,
  onEnterScore,
  onAssignCourt,
}: CourtGridProps) {
  const availableCourts = courtAssignments.filter((c) => c.isAvailable)
  const readyMatches = bracketMatches.filter(
    (m) => m.status === 'upcoming' && m.team1 && m.team2 && !m.courtId
  )

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-white">Court Status</h2>
        </div>
        {availableCourts.length > 0 && readyMatches.length > 0 && (
          <span className="text-xs text-lime-400">
            {availableCourts.length} courts available • {readyMatches.length} matches ready
          </span>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courtAssignments.map((court) => (
          <CourtCard
            key={court.courtId}
            court={court}
            readyMatches={readyMatches}
            onCallMatch={onCallMatch}
            onStartMatch={onStartMatch}
            onEnterScore={onEnterScore}
          />
        ))}
      </div>
    </div>
  )
}

interface CourtCardProps {
  court: CourtAssignment
  readyMatches: BracketMatch[]
  onCallMatch?: (bracketMatchId: string, courtId: string) => void
  onStartMatch?: (bracketMatchId: string) => void
  onEnterScore?: (bracketMatchId: string) => void
}

function CourtCard({ court, readyMatches, onCallMatch, onStartMatch, onEnterScore }: CourtCardProps) {
  const [showAssignDropdown, setShowAssignDropdown] = useState(false)
  const match = court.currentMatch

  const statusConfig = {
    available: { bg: 'bg-slate-800/50', border: 'border-slate-700/50', dot: 'bg-slate-500' },
    calling: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-500' },
    in_progress: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', dot: 'bg-sky-500' },
  }

  const status = match?.status === 'in_progress' ? 'in_progress' : match?.status === 'calling' ? 'calling' : 'available'
  const config = statusConfig[status]

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-4 relative`}>
      {/* Court Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dot} ${status !== 'available' ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-bold text-white">{court.courtName}</span>
        </div>
        <div className="flex items-center gap-1">
          {court.attributes.indoor && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-700 text-slate-400">Indoor</span>
          )}
        </div>
      </div>

      {/* Match Content or Empty State */}
      {match ? (
        <div className="space-y-3">
          {/* Round Label */}
          <span className="text-xs text-slate-500">{match.roundLabel}</span>

          {/* Teams */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-200 truncate max-w-[140px]">
                {match.team1?.displayName || 'TBD'}
              </span>
              <span className="text-sm font-bold text-white tabular-nums">
                {match.scores.length > 0
                  ? match.scores.map((s) => s.team1).join(' • ')
                  : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-200 truncate max-w-[140px]">
                {match.team2?.displayName || 'TBD'}
              </span>
              <span className="text-sm font-bold text-white tabular-nums">
                {match.scores.length > 0
                  ? match.scores.map((s) => s.team2).join(' • ')
                  : '-'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-700/30">
            {match.status === 'calling' && (
              <button
                onClick={() => onStartMatch?.(match.id)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-900 text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3" />
                Start
              </button>
            )}
            {match.status === 'in_progress' && (
              <button
                onClick={() => onEnterScore?.(match.id)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium transition-colors"
              >
                Enter Score
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 text-center py-2">Court available</p>

          {/* Assign Match Dropdown */}
          {readyMatches.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                Assign Match
                <ChevronDown className="w-3 h-3" />
              </button>

              {showAssignDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                  {readyMatches.slice(0, 5).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onCallMatch?.(m.id, court.courtId)
                        setShowAssignDropdown(false)
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors"
                    >
                      <p className="text-xs text-slate-400">{m.roundLabel}</p>
                      <p className="text-sm text-white truncate">
                        {m.team1?.displayName} vs {m.team2?.displayName}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Round Navigator
// =============================================================================

interface RoundNavigatorProps {
  roundSchedules: RoundSchedule[]
  bracketMatches: BracketMatch[]
  onAnnounceRound?: (roundNumber: number) => void
  onStartMatch?: (bracketMatchId: string) => void
  onEnterScore?: (bracketMatchId: string) => void
  onMarkForfeit?: (bracketMatchId: string, forfeitingTeam: 'team1' | 'team2') => void
}

function RoundNavigator({
  roundSchedules,
  bracketMatches,
  onAnnounceRound,
  onStartMatch,
  onEnterScore,
  onMarkForfeit,
}: RoundNavigatorProps) {
  const [expandedRound, setExpandedRound] = useState<number | null>(
    roundSchedules.find((r) => r.status === 'in_progress')?.roundNumber || null
  )

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center gap-2">
        <List className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-bold text-white">Round Schedule</h2>
      </div>

      <div className="divide-y divide-slate-700/30">
        {roundSchedules.map((round) => {
          const roundMatches = bracketMatches.filter((m) => m.roundNumber === round.roundNumber)
          const completedCount = roundMatches.filter((m) => m.status === 'completed').length
          const inProgressCount = roundMatches.filter((m) => m.status === 'in_progress').length
          const isExpanded = expandedRound === round.roundNumber

          return (
            <div key={round.roundNumber}>
              {/* Round Header */}
              <button
                onClick={() => setExpandedRound(isExpanded ? null : round.roundNumber)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      round.status === 'completed'
                        ? 'bg-lime-500/20 text-lime-400'
                        : round.status === 'in_progress'
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {round.roundNumber}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{round.roundLabel}</p>
                    <p className="text-xs text-slate-500">
                      {round.matchFormat.label} • {completedCount}/{roundMatches.length} complete
                      {inProgressCount > 0 && (
                        <span className="text-sky-400 ml-1">• {inProgressCount} live</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {round.status === 'upcoming' && onAnnounceRound && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAnnounceRound(round.roundNumber)
                      }}
                      className="px-3 py-1.5 rounded-lg bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Megaphone className="w-3 h-3" />
                      Announce
                    </button>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Match List */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 space-y-2">
                  {roundMatches.map((match) => (
                    <RoundMatchCard
                      key={match.id}
                      match={match}
                      onStartMatch={onStartMatch}
                      onEnterScore={onEnterScore}
                      onMarkForfeit={onMarkForfeit}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface RoundMatchCardProps {
  match: BracketMatch
  onStartMatch?: (bracketMatchId: string) => void
  onEnterScore?: (bracketMatchId: string) => void
  onMarkForfeit?: (bracketMatchId: string, forfeitingTeam: 'team1' | 'team2') => void
}

function RoundMatchCard({ match, onStartMatch, onEnterScore, onMarkForfeit }: RoundMatchCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const statusConfig = {
    upcoming: { bg: 'bg-slate-800/50', border: 'border-slate-700/50', label: 'Upcoming', labelColor: 'text-slate-400' },
    calling: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Calling', labelColor: 'text-amber-400' },
    in_progress: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', label: 'Live', labelColor: 'text-sky-400' },
    completed: { bg: 'bg-lime-500/5', border: 'border-lime-500/20', label: 'Final', labelColor: 'text-lime-400' },
    bye: { bg: 'bg-slate-800/30', border: 'border-slate-700/30', label: 'Bye', labelColor: 'text-slate-500' },
    forfeit: { bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Forfeit', labelColor: 'text-red-400' },
  }

  const config = statusConfig[match.status]

  return (
    <div className={`rounded-lg border ${config.border} ${config.bg} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {(match.status === 'in_progress' || match.status === 'calling') && (
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          )}
          <span className={`text-xs font-medium ${config.labelColor}`}>{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {match.courtId && (
            <span className="text-xs text-slate-500">
              <MapPin className="w-3 h-3 inline mr-0.5" />
              Court {match.courtId.replace('court-', '')}
            </span>
          )}

          {/* More Menu */}
          {match.status !== 'completed' && match.status !== 'bye' && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 py-1 min-w-[140px]">
                  {match.team1 && (
                    <button
                      onClick={() => {
                        onMarkForfeit?.(match.id, 'team1')
                        setShowMenu(false)
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-red-400 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Flag className="w-3 h-3" />
                      Forfeit {match.team1.displayName.split(' ')[0]}
                    </button>
                  )}
                  {match.team2 && (
                    <button
                      onClick={() => {
                        onMarkForfeit?.(match.id, 'team2')
                        setShowMenu(false)
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-red-400 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Flag className="w-3 h-3" />
                      Forfeit {match.team2.displayName.split(' ')[0]}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm truncate max-w-[160px] ${
              match.winner === 'team1' ? 'text-lime-400 font-medium' : 'text-slate-200'
            }`}
          >
            {match.team1?.displayName || (match.awaitingWinnerFrom ? 'Winner of...' : 'TBD')}
          </span>
          <span className="text-sm font-bold text-white tabular-nums">
            {match.scores.length > 0 ? match.scores.map((s) => s.team1).join('-') : '-'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm truncate max-w-[160px] ${
              match.winner === 'team2' ? 'text-lime-400 font-medium' : 'text-slate-200'
            }`}
          >
            {match.team2?.displayName || (match.awaitingWinnerFrom ? 'Winner of...' : 'TBD')}
          </span>
          <span className="text-sm font-bold text-white tabular-nums">
            {match.scores.length > 0 ? match.scores.map((s) => s.team2).join('-') : '-'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {(match.status === 'calling' || match.status === 'in_progress' || match.status === 'upcoming') && (
        <div className="flex gap-2 mt-3 pt-2 border-t border-slate-700/30">
          {match.status === 'upcoming' && match.team1 && match.team2 && !match.courtId && (
            <span className="text-xs text-slate-500 flex-1">Needs court assignment</span>
          )}
          {match.status === 'calling' && (
            <button
              onClick={() => onStartMatch?.(match.id)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-900 text-xs font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Play className="w-3 h-3" />
              Start Match
            </button>
          )}
          {match.status === 'in_progress' && (
            <button
              onClick={() => onEnterScore?.(match.id)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium transition-colors"
            >
              Enter Score
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Activity Timeline
// =============================================================================

interface ActivityTimelineProps {
  timeline: TournamentTimelineEvent[]
}

function ActivityTimeline({ timeline }: ActivityTimelineProps) {
  const [showAll, setShowAll] = useState(false)
  const displayEvents = showAll ? timeline : timeline.slice(0, 6)

  const iconMap = {
    match_started: <Play className="w-3 h-3" />,
    match_completed: <CheckCircle2 className="w-3 h-3" />,
    round_started: <TrendingUp className="w-3 h-3" />,
    round_completed: <Award className="w-3 h-3" />,
    score_entered: <CircleDot className="w-3 h-3" />,
    forfeit: <Flag className="w-3 h-3" />,
    manual_advance: <RefreshCw className="w-3 h-3" />,
    announcement: <Megaphone className="w-3 h-3" />,
    pause: <Pause className="w-3 h-3" />,
    resume: <Play className="w-3 h-3" />,
  }

  const colorMap = {
    match_started: 'text-sky-400 bg-sky-500/20',
    match_completed: 'text-lime-400 bg-lime-500/20',
    round_started: 'text-amber-400 bg-amber-500/20',
    round_completed: 'text-lime-400 bg-lime-500/20',
    score_entered: 'text-slate-400 bg-slate-700',
    forfeit: 'text-red-400 bg-red-500/20',
    manual_advance: 'text-amber-400 bg-amber-500/20',
    announcement: 'text-sky-400 bg-sky-500/20',
    pause: 'text-amber-400 bg-amber-500/20',
    resume: 'text-lime-400 bg-lime-500/20',
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center gap-2">
        <Bell className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-bold text-white">Activity</h2>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {displayEvents.map((event, idx) => (
            <div key={event.id} className="flex gap-3">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className={`p-1.5 rounded-lg ${colorMap[event.type]}`}>
                  {iconMap[event.type]}
                </div>
                {idx < displayEvents.length - 1 && (
                  <div className="w-px h-full bg-slate-700/50 mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-3">
                <p className="text-sm text-white">{event.title}</p>
                <p className="text-xs text-slate-500">{event.description}</p>
                <p className="text-[10px] text-slate-600 mt-1">
                  {new Date(event.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {timeline.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-3 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 text-xs font-medium transition-colors"
          >
            {showAll ? 'Show less' : `Show ${timeline.length - 6} more`}
          </button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Match Queue
// =============================================================================

interface MatchQueueProps {
  bracketMatches: BracketMatch[]
  onCallMatch?: (bracketMatchId: string, courtId: string) => void
  courtAssignments: CourtAssignment[]
}

function MatchQueue({ bracketMatches, onCallMatch, courtAssignments }: MatchQueueProps) {
  const readyMatches = bracketMatches.filter(
    (m) => m.status === 'upcoming' && m.team1 && m.team2 && !m.courtId
  )
  const availableCourts = courtAssignments.filter((c) => c.isAvailable)

  if (readyMatches.length === 0) return null

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-white">Ready to Play</h2>
        </div>
        <span className="text-xs text-lime-400">{readyMatches.length} matches waiting</span>
      </div>

      <div className="p-4 space-y-2">
        {readyMatches.slice(0, 5).map((match) => (
          <div
            key={match.id}
            className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-500">{match.roundLabel}</p>
              <p className="text-sm text-white">
                {match.team1?.displayName} vs {match.team2?.displayName}
              </p>
            </div>

            {availableCourts.length > 0 && (
              <div className="flex gap-1">
                {availableCourts.slice(0, 3).map((court) => (
                  <button
                    key={court.courtId}
                    onClick={() => onCallMatch?.(match.id, court.courtId)}
                    className="px-2 py-1 rounded bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 text-xs font-medium transition-colors"
                  >
                    {court.courtName.replace('Court ', 'C')}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {readyMatches.length > 5 && (
          <p className="text-xs text-slate-500 text-center pt-2">
            +{readyMatches.length - 5} more matches waiting
          </p>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function TournamentDashboard({
  event,
  tournament,
  eventProgress,
  bracket,
  bracketMatches,
  courtAssignments,
  roundSchedules,
  timeline,
  alerts,
  quickStats,
  seeds,
  completedMatches,
  scoreDisputes,
  onCallMatch,
  onStartMatch,
  onEnterScore,
  onMarkForfeit,
  onManualAdvance,
  onUndoAdvancement,
  onAnnounceRound,
  onScheduleMatch,
  onAssignCourt,
  onPauseEvent,
  onResumeEvent,
  onResolveDispute,
  onDismissAlert,
  onViewBracket,
  onOpenCourtBoard,
  onShareTournament,
}: TournamentDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        event={event}
        tournament={tournament}
        quickStats={quickStats}
        onPauseEvent={onPauseEvent}
        onResumeEvent={onResumeEvent}
        onShareTournament={onShareTournament}
        onOpenCourtBoard={onOpenCourtBoard}
        onViewBracket={onViewBracket}
      />

      {/* Alerts */}
      <AlertBanner alerts={alerts} onDismissAlert={onDismissAlert} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Courts & Queue */}
        <div className="lg:col-span-2 space-y-6">
          <CourtGrid
            courtAssignments={courtAssignments}
            bracketMatches={bracketMatches}
            onCallMatch={onCallMatch}
            onStartMatch={onStartMatch}
            onEnterScore={onEnterScore}
            onAssignCourt={onAssignCourt}
          />

          <MatchQueue
            bracketMatches={bracketMatches}
            onCallMatch={onCallMatch}
            courtAssignments={courtAssignments}
          />

          <RoundNavigator
            roundSchedules={roundSchedules}
            bracketMatches={bracketMatches}
            onAnnounceRound={onAnnounceRound}
            onStartMatch={onStartMatch}
            onEnterScore={onEnterScore}
            onMarkForfeit={onMarkForfeit}
          />
        </div>

        {/* Right Column - Timeline */}
        <div className="space-y-6">
          <ActivityTimeline timeline={timeline} />
        </div>
      </div>
    </div>
  )
}
