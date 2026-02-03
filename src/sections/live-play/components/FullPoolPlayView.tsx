import { useState } from 'react'
import {
  Trophy,
  Users,
  Clock,
  CheckCircle2,
  Play,
  ChevronRight,
  Share2,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  MapPin,
} from 'lucide-react'
import type {
  FullPoolPlayViewProps,
  ExtendedPool,
  ExtendedPoolStanding,
  PoolMatch,
  PoolTeam,
  PoolProgressItem,
  ProjectedMatchup,
  UpcomingMatchSummary,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Color Utilities
// =============================================================================

const poolColors = {
  lime: {
    bg: 'bg-lime-500',
    bgLight: 'bg-lime-500/10',
    border: 'border-lime-500/30',
    text: 'text-lime-400',
    textDark: 'text-lime-600 dark:text-lime-400',
    ring: 'ring-lime-500/30',
    gradient: 'from-lime-500 to-lime-600',
  },
  sky: {
    bg: 'bg-sky-500',
    bgLight: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    textDark: 'text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-500/30',
    gradient: 'from-sky-500 to-sky-600',
  },
  amber: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    textDark: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/30',
    gradient: 'from-amber-500 to-amber-600',
  },
  violet: {
    bg: 'bg-violet-500',
    bgLight: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    textDark: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-500/30',
    gradient: 'from-violet-500 to-violet-600',
  },
  rose: {
    bg: 'bg-rose-500',
    bgLight: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    textDark: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-500/30',
    gradient: 'from-rose-500 to-rose-600',
  },
  cyan: {
    bg: 'bg-cyan-500',
    bgLight: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    textDark: 'text-cyan-600 dark:text-cyan-400',
    ring: 'ring-cyan-500/30',
    gradient: 'from-cyan-500 to-cyan-600',
  },
}

// =============================================================================
// Progress Ring Component
// =============================================================================

function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
  color,
}: {
  progress: number
  size?: number
  strokeWidth?: number
  color: keyof typeof poolColors
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={poolColors[color].text}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{progress}%</span>
      </div>
    </div>
  )
}

// =============================================================================
// Pool Status Badge
// =============================================================================

function PoolStatusBadge({ status }: { status: ExtendedPool['status'] }) {
  const configs = {
    completed: {
      icon: CheckCircle2,
      label: 'Complete',
      classes: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
    },
    in_progress: {
      icon: Play,
      label: 'In Progress',
      classes: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    },
    upcoming: {
      icon: Clock,
      label: 'Upcoming',
      classes: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    },
  }

  const config = configs[status]
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${config.classes}`}
    >
      {status === 'in_progress' && (
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
      )}
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  )
}

// =============================================================================
// Pool Standings Table
// =============================================================================

interface PoolStandingsTableProps {
  standings: ExtendedPoolStanding[]
  teamsAdvancing: number
  currentUserTeamId?: string
  onViewTeam?: (teamId: string) => void
}

function PoolStandingsTable({
  standings,
  teamsAdvancing,
  currentUserTeamId,
  onViewTeam,
}: PoolStandingsTableProps) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700/50">
            <th className="text-left py-1.5 pl-2 pr-1 font-medium">#</th>
            <th className="text-left py-1.5 px-1 font-medium">Team</th>
            <th className="text-center py-1.5 px-1 font-medium">W</th>
            <th className="text-center py-1.5 px-1 font-medium">L</th>
            <th className="text-center py-1.5 px-1 font-medium hidden sm:table-cell">PF</th>
            <th className="text-center py-1.5 px-1 font-medium hidden sm:table-cell">PA</th>
            <th className="text-right py-1.5 pr-2 pl-1 font-medium">+/-</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, idx) => {
            const isCurrentUser = team.teamId === currentUserTeamId
            const advances = idx < teamsAdvancing

            return (
              <tr
                key={team.teamId}
                onClick={() => onViewTeam?.(team.teamId)}
                className={`
                  border-b border-slate-700/30 transition-colors cursor-pointer
                  ${isCurrentUser ? 'bg-sky-500/10' : 'hover:bg-slate-700/30'}
                  ${advances ? 'bg-lime-500/5' : ''}
                `}
              >
                <td className="py-2 pl-2 pr-1">
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        advances
                          ? 'bg-lime-500 text-slate-900'
                          : isCurrentUser
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {team.rank}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-medium truncate max-w-[100px] ${
                        isCurrentUser ? 'text-sky-300' : 'text-slate-200'
                      }`}
                    >
                      {team.displayName}
                    </span>
                    {advances && (
                      <TrendingUp className="w-3 h-3 text-lime-400 flex-shrink-0" />
                    )}
                  </div>
                </td>
                <td className="py-2 px-1 text-center">
                  <span className="text-lime-400 font-bold">{team.wins}</span>
                </td>
                <td className="py-2 px-1 text-center">
                  <span className="text-slate-400">{team.losses}</span>
                </td>
                <td className="py-2 px-1 text-center hidden sm:table-cell">
                  <span className="text-slate-300">{team.pointsFor}</span>
                </td>
                <td className="py-2 px-1 text-center hidden sm:table-cell">
                  <span className="text-slate-400">{team.pointsAgainst}</span>
                </td>
                <td className="py-2 pr-2 pl-1 text-right">
                  <span
                    className={`font-mono font-bold ${
                      team.pointDiff > 0
                        ? 'text-lime-400'
                        : team.pointDiff < 0
                        ? 'text-red-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {team.pointDiff > 0 ? '+' : ''}
                    {team.pointDiff}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// =============================================================================
// Pool Match List
// =============================================================================

interface PoolMatchListProps {
  matches: PoolMatch[]
  teams: PoolTeam[]
  onViewMatch?: (matchId: string) => void
}

function PoolMatchList({ matches, teams, onViewMatch }: PoolMatchListProps) {
  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.displayName || 'TBD'
  }

  const liveMatches = matches.filter((m) => m.status === 'in_progress')
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming').slice(0, 2)

  if (liveMatches.length === 0 && upcomingMatches.length === 0) {
    return (
      <div className="text-center py-3 text-xs text-slate-500">
        All pool matches completed
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {liveMatches.map((match) => (
        <div
          key={match.id}
          onClick={() => onViewMatch?.(match.id)}
          className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 cursor-pointer hover:bg-sky-500/20 transition-colors"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse flex-shrink-0" />
            <span className="text-xs text-slate-200 truncate">
              {getTeamName(match.team1Id)}
            </span>
            <span className="text-[10px] text-slate-500">vs</span>
            <span className="text-xs text-slate-200 truncate">
              {getTeamName(match.team2Id)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            {match.score && (
              <span className="text-xs font-bold text-sky-400">
                {match.score.team1}-{match.score.team2}
              </span>
            )}
            <span className="text-[10px] text-sky-400 font-medium">LIVE</span>
          </div>
        </div>
      ))}

      {upcomingMatches.map((match) => (
        <div
          key={match.id}
          onClick={() => onViewMatch?.(match.id)}
          className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-800/50 cursor-pointer hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
            <span className="text-xs text-slate-300 truncate">
              {getTeamName(match.team1Id)}
            </span>
            <span className="text-[10px] text-slate-500">vs</span>
            <span className="text-xs text-slate-300 truncate">
              {getTeamName(match.team2Id)}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 ml-2">
            {new Date(match.scheduledTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Pool Card
// =============================================================================

interface PoolCardProps {
  pool: ExtendedPool
  teams: PoolTeam[]
  progress: PoolProgressItem
  teamsAdvancing: number
  currentUserTeamId?: string
  onViewPool?: () => void
  onViewMatch?: (matchId: string) => void
  onViewTeam?: (teamId: string) => void
  onSharePool?: () => void
}

function PoolCard({
  pool,
  teams,
  progress,
  teamsAdvancing,
  currentUserTeamId,
  onViewPool,
  onViewMatch,
  onViewTeam,
  onSharePool,
}: PoolCardProps) {
  const colors = poolColors[pool.color]
  const poolTeams = teams.filter((t) => pool.teams.includes(t.id))

  return (
    <div
      className={`rounded-xl border ${colors.border} bg-slate-900/50 backdrop-blur-sm overflow-hidden`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 bg-gradient-to-r ${colors.gradient} flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white">{pool.name}</h3>
          <PoolStatusBadge status={pool.status} />
        </div>
        <div className="flex items-center gap-2">
          {onSharePool && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSharePool()
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
          )}
          <ProgressRing
            progress={progress.percentComplete}
            size={44}
            strokeWidth={4}
            color={pool.color}
          />
        </div>
      </div>

      {/* Standings */}
      <div className="p-3">
        <PoolStandingsTable
          standings={pool.standings}
          teamsAdvancing={teamsAdvancing}
          currentUserTeamId={currentUserTeamId}
          onViewTeam={onViewTeam}
        />
      </div>

      {/* Live/Upcoming Matches */}
      {pool.status !== 'completed' && (
        <div className="px-3 pb-3 border-t border-slate-700/30 pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Matches
            </span>
            <span className="text-[10px] text-slate-500">
              {progress.matchesPlayed}/{progress.matchesTotal}
            </span>
          </div>
          <PoolMatchList
            matches={pool.matches}
            teams={poolTeams}
            onViewMatch={onViewMatch}
          />
        </div>
      )}

      {/* View Pool Button */}
      {onViewPool && (
        <button
          onClick={onViewPool}
          className={`w-full px-4 py-2 text-xs font-medium ${colors.text} hover:${colors.bgLight} border-t border-slate-700/30 flex items-center justify-center gap-1 transition-colors`}
        >
          View Full Pool
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

// =============================================================================
// Playoff Preview Panel
// =============================================================================

interface PlayoffPreviewProps {
  matchups: ProjectedMatchup[]
  onViewPlayoffBracket?: () => void
}

function PlayoffPreview({ matchups, onViewPlayoffBracket }: PlayoffPreviewProps) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-lime-600 to-lime-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-lime-900" />
          <h3 className="text-base font-bold text-white">Playoff Preview</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium text-lime-900">
          Projected
        </span>
      </div>

      {/* Matchups */}
      <div className="p-4 space-y-3">
        {matchups.map((matchup) => (
          <div
            key={matchup.position}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30"
          >
            <div className="w-8 h-8 rounded-lg bg-lime-500/20 flex items-center justify-center">
              <span className="text-xs font-bold text-lime-400">{matchup.position}</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">
                  {matchup.projectedTeam1}
                </p>
                <p className="text-[10px] text-slate-500">{matchup.team1Source}</p>
              </div>
              <span className="text-xs font-medium text-slate-500">vs</span>
              <div className="flex-1 text-right">
                <p className="text-sm font-medium text-slate-200">
                  {matchup.projectedTeam2}
                </p>
                <p className="text-[10px] text-slate-500">{matchup.team2Source}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Bracket Button */}
      {onViewPlayoffBracket && (
        <button
          onClick={onViewPlayoffBracket}
          className="w-full px-4 py-2.5 text-xs font-medium text-lime-400 hover:bg-lime-500/10 border-t border-slate-700/30 flex items-center justify-center gap-1 transition-colors"
        >
          View Full Bracket
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

// =============================================================================
// Upcoming Matches Queue
// =============================================================================

interface UpcomingQueueProps {
  matches: UpcomingMatchSummary[]
  pools: ExtendedPool[]
  onViewMatch?: (matchId: string) => void
}

function UpcomingQueue({ matches, pools, onViewMatch }: UpcomingQueueProps) {
  const getPoolColor = (poolId: string) => {
    const pool = pools.find((p) => p.id === poolId)
    return pool?.color || 'slate'
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-white">Up Next</h3>
        </div>
        <span className="text-xs text-slate-500">{matches.length} matches</span>
      </div>

      {/* Matches */}
      <div className="divide-y divide-slate-700/30">
        {matches.slice(0, 4).map((match) => {
          const color = getPoolColor(match.poolId)
          const colorStyles = poolColors[color as keyof typeof poolColors] || poolColors.lime

          return (
            <div
              key={match.id}
              onClick={() => onViewMatch?.(match.id)}
              className="px-4 py-3 flex items-center gap-3 hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div
                className={`w-2 h-8 rounded-full ${colorStyles.bg}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {match.team1} vs {match.team2}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-medium ${colorStyles.text}`}>
                    {pools.find((p) => p.id === match.poolId)?.name}
                  </span>
                  <span className="text-[10px] text-slate-500">•</span>
                  <span className="text-[10px] text-slate-500">
                    ~{match.estimatedWait}m wait
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-300">
                  {new Date(match.scheduledTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Tournament Header
// =============================================================================

interface TournamentHeaderProps {
  eventName: string
  venueName: string
  eventProgress: {
    completedMatches: number
    totalMatches: number
    currentRoundLabel?: string
    estimatedRemainingMinutes: number
  }
}

function TournamentHeader({
  eventName,
  venueName,
  eventProgress,
}: TournamentHeaderProps) {
  const completionPercent = Math.round(
    (eventProgress.completedMatches / eventProgress.totalMatches) * 100
  )

  return (
    <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Event Info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 shadow-lg shadow-lime-500/20">
              <Target className="w-5 h-5 text-slate-900" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{eventName}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400 mt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {venueName}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-sky-400" />
              {eventProgress.currentRoundLabel}
            </span>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-lime-400">{completionPercent}%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Complete</p>
          </div>
          <div className="hidden sm:block h-12 w-px bg-slate-700" />
          <div className="hidden sm:block text-center">
            <p className="text-2xl font-bold text-slate-200">
              {eventProgress.completedMatches}/{eventProgress.totalMatches}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Matches</p>
          </div>
          <div className="hidden sm:block h-12 w-px bg-slate-700" />
          <div className="hidden sm:block text-center">
            <p className="text-2xl font-bold text-slate-200">
              ~{Math.floor(eventProgress.estimatedRemainingMinutes / 60)}h{' '}
              {eventProgress.estimatedRemainingMinutes % 60}m
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Remaining</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lime-500 to-lime-400 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function FullPoolPlayView({
  event,
  eventProgress,
  poolPlayConfig,
  pools,
  teams,
  poolProgress,
  upcomingMatches,
  playoffBracket,
  courts,
  currentUser,
  notifications,
  onViewPool,
  onViewMatch,
  onStartMatch,
  onEnterScore,
  onViewTeam,
  onSharePool,
  onViewPlayoffBracket,
}: FullPoolPlayViewProps) {
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null)

  // Find current user's team
  const currentUserTeam = currentUser
    ? teams.find((t) => t.players.some((p) => p.id === currentUser.id))
    : undefined

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <TournamentHeader
        eventName={event.name}
        venueName={event.venue.name}
        eventProgress={eventProgress}
      />

      {/* Notification Banner (if any recent notifications) */}
      {notifications && notifications.length > 0 && (
        <div className="rounded-xl border border-lime-500/30 bg-lime-500/10 p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-lime-500/20">
            <AlertCircle className="w-4 h-4 text-lime-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-lime-300">
              {notifications[0].message}
            </p>
            <p className="text-xs text-lime-400/60 mt-0.5">
              {new Date(notifications[0].timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pools Grid (2 columns on larger screens) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pools.map((pool) => (
            <PoolCard
              key={pool.id}
              pool={pool}
              teams={teams}
              progress={poolProgress[pool.id] || { matchesPlayed: 0, matchesTotal: 6, percentComplete: 0 }}
              teamsAdvancing={poolPlayConfig.advancementRules.teamsAdvancing}
              currentUserTeamId={currentUserTeam?.id}
              onViewPool={onViewPool ? () => onViewPool(pool.id) : undefined}
              onViewMatch={onViewMatch}
              onViewTeam={onViewTeam}
              onSharePool={onSharePool ? () => onSharePool(pool.id) : undefined}
            />
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Playoff Preview */}
          <PlayoffPreview
            matchups={playoffBracket.projectedMatchups}
            onViewPlayoffBracket={onViewPlayoffBracket}
          />

          {/* Upcoming Matches */}
          <UpcomingQueue
            matches={upcomingMatches}
            pools={pools}
            onViewMatch={onViewMatch}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-3 px-4 rounded-xl bg-slate-900/50 border border-slate-700/30">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-lime-500 flex items-center justify-center">
            <span className="text-[10px] font-bold text-slate-900">1</span>
          </div>
          <span className="text-xs text-slate-400">Advances to Playoffs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs text-slate-400">Live Match</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-lime-400" />
          <span className="text-xs text-slate-400">Clinched Advancement</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-lime-400" />
          <span className="text-xs text-slate-400">Pool Complete</span>
        </div>
      </div>
    </div>
  )
}
