import { useState } from 'react'
import {
  Trophy,
  Users,
  Clock,
  CheckCircle2,
  Play,
  ChevronLeft,
  Share2,
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  Swords,
  BarChart3,
  ArrowRight,
  MapPin,
} from 'lucide-react'
import type {
  ExtendedPool,
  ExtendedPoolStanding,
  PoolMatch,
  PoolTeam,
  PoolProgressItem,
  MatchPlayer,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Types
// =============================================================================

export interface PoolDetailViewProps {
  /** The pool to display */
  pool: ExtendedPool
  /** All teams in this pool */
  teams: PoolTeam[]
  /** Pool progress info */
  progress: PoolProgressItem
  /** Number of teams that advance from this pool */
  teamsAdvancing: number
  /** Tournament name for context */
  tournamentName: string
  /** Current user's player ID (for highlighting) */
  currentUserId?: string
  /** Whether the viewer is a game manager */
  isGameManager?: boolean

  // Callbacks
  /** Called when user wants to go back to all pools */
  onBack?: () => void
  /** Called when user views a match */
  onViewMatch?: (matchId: string) => void
  /** Called when GM starts a match */
  onStartMatch?: (matchId: string) => void
  /** Called when GM enters score */
  onEnterScore?: (matchId: string) => void
  /** Called when user views a team */
  onViewTeam?: (teamId: string) => void
  /** Called when user shares pool */
  onSharePool?: () => void
}

// =============================================================================
// Color Utilities
// =============================================================================

const poolColors = {
  lime: {
    bg: 'bg-lime-500',
    bgLight: 'bg-lime-500/10',
    border: 'border-lime-500/30',
    text: 'text-lime-400',
    gradient: 'from-lime-500 to-lime-600',
    gradientDark: 'from-lime-600 to-lime-700',
  },
  sky: {
    bg: 'bg-sky-500',
    bgLight: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    gradient: 'from-sky-500 to-sky-600',
    gradientDark: 'from-sky-600 to-sky-700',
  },
  amber: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    gradient: 'from-amber-500 to-amber-600',
    gradientDark: 'from-amber-600 to-amber-700',
  },
  violet: {
    bg: 'bg-violet-500',
    bgLight: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    gradient: 'from-violet-500 to-violet-600',
    gradientDark: 'from-violet-600 to-violet-700',
  },
  rose: {
    bg: 'bg-rose-500',
    bgLight: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    gradient: 'from-rose-500 to-rose-600',
    gradientDark: 'from-rose-600 to-rose-700',
  },
  cyan: {
    bg: 'bg-cyan-500',
    bgLight: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    gradient: 'from-cyan-500 to-cyan-600',
    gradientDark: 'from-cyan-600 to-cyan-700',
  },
}

// =============================================================================
// Pool Header
// =============================================================================

interface PoolHeaderProps {
  pool: ExtendedPool
  tournamentName: string
  progress: PoolProgressItem
  onBack?: () => void
  onShare?: () => void
}

function PoolHeader({ pool, tournamentName, progress, onBack, onShare }: PoolHeaderProps) {
  const colors = poolColors[pool.color]

  const statusConfig = {
    completed: { label: 'Complete', icon: CheckCircle2, classes: 'bg-lime-500/20 text-lime-400' },
    in_progress: { label: 'In Progress', icon: Play, classes: 'bg-sky-500/20 text-sky-400' },
    upcoming: { label: 'Upcoming', icon: Clock, classes: 'bg-slate-500/20 text-slate-400' },
  }

  const status = statusConfig[pool.status]
  const StatusIcon = status.icon

  return (
    <div className={`rounded-xl overflow-hidden border ${colors.border}`}>
      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} px-4 sm:px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <div>
              <p className="text-xs text-white/70 font-medium">{tournamentName}</p>
              <h1 className="text-2xl font-bold text-white">{pool.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.classes}`}>
              {pool.status === 'in_progress' && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              )}
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{status.label}</span>
            </div>
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-slate-900/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">{pool.teams.length} Teams</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">
              {progress.matchesPlayed}/{progress.matchesTotal} Matches
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
          <span className={`text-sm font-bold ${colors.text}`}>{progress.percentComplete}%</span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Full Standings Table
// =============================================================================

interface FullStandingsTableProps {
  standings: ExtendedPoolStanding[]
  teams: PoolTeam[]
  teamsAdvancing: number
  currentUserTeamId?: string
  onViewTeam?: (teamId: string) => void
}

function FullStandingsTable({
  standings,
  teams,
  teamsAdvancing,
  currentUserTeamId,
  onViewTeam,
}: FullStandingsTableProps) {
  const getTeamPlayers = (teamId: string): MatchPlayer[] => {
    return teams.find((t) => t.id === teamId)?.players || []
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-bold text-white">Standings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700/50 bg-slate-800/50">
              <th className="text-left py-3 pl-4 pr-2 font-medium w-10">#</th>
              <th className="text-left py-3 px-2 font-medium">Team</th>
              <th className="text-center py-3 px-2 font-medium w-12">W</th>
              <th className="text-center py-3 px-2 font-medium w-12">L</th>
              <th className="text-center py-3 px-2 font-medium w-14">PF</th>
              <th className="text-center py-3 px-2 font-medium w-14">PA</th>
              <th className="text-right py-3 pr-4 pl-2 font-medium w-14">+/-</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => {
              const isCurrentUser = team.teamId === currentUserTeamId
              const advances = idx < teamsAdvancing
              const players = getTeamPlayers(team.teamId)

              return (
                <tr
                  key={team.teamId}
                  onClick={() => onViewTeam?.(team.teamId)}
                  className={`
                    border-b border-slate-700/30 transition-colors cursor-pointer
                    ${isCurrentUser ? 'bg-sky-500/10' : 'hover:bg-slate-800/50'}
                    ${advances && !isCurrentUser ? 'bg-lime-500/5' : ''}
                  `}
                >
                  <td className="py-3 pl-4 pr-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        advances
                          ? 'bg-lime-500 text-slate-900'
                          : isCurrentUser
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {team.rank}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            isCurrentUser ? 'text-sky-300' : 'text-slate-200'
                          }`}
                        >
                          {team.displayName}
                        </span>
                        <span className="text-xs text-slate-500">#{team.seed}</span>
                        {advances && (
                          <TrendingUp className="w-4 h-4 text-lime-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {players.map((p) => p.name).join(' & ')}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-lime-400 font-bold">{team.wins}</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-slate-400">{team.losses}</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-slate-300">{team.pointsFor}</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-slate-400">{team.pointsAgainst}</span>
                  </td>
                  <td className="py-3 pr-4 pl-2 text-right">
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

      {/* Advancement Footer */}
      <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-700/30">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-4 h-4 rounded-full bg-lime-500 flex items-center justify-center">
            <span className="text-[8px] font-bold text-slate-900">✓</span>
          </div>
          <span>Top {teamsAdvancing} teams advance to playoff bracket</span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Head-to-Head Matrix
// =============================================================================

interface HeadToHeadMatrixProps {
  standings: ExtendedPoolStanding[]
  matches: PoolMatch[]
  teams: PoolTeam[]
}

function HeadToHeadMatrix({ standings, matches, teams }: HeadToHeadMatrixProps) {
  const getTeamShortName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    if (!team) return '?'
    // Get first letter of each player's last name
    const names = team.displayName.split('/')
    return names.map((n) => n.trim()[0]).join('')
  }

  const getMatchResult = (team1Id: string, team2Id: string) => {
    const match = matches.find(
      (m) =>
        (m.team1Id === team1Id && m.team2Id === team2Id) ||
        (m.team1Id === team2Id && m.team2Id === team1Id)
    )

    if (!match || !match.score) return null

    const isTeam1 = match.team1Id === team1Id
    const myScore = isTeam1 ? match.score.team1 : match.score.team2
    const oppScore = isTeam1 ? match.score.team2 : match.score.team1
    const won = myScore > oppScore

    return { won, score: `${myScore}-${oppScore}`, status: match.status }
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center gap-2">
        <Swords className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-bold text-white">Head-to-Head</h2>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="w-20"></th>
              {standings.map((team) => (
                <th key={team.teamId} className="text-center p-2 font-medium text-slate-400">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-slate-800 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-300">
                      {getTeamShortName(team.teamId)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((rowTeam) => (
              <tr key={rowTeam.teamId}>
                <td className="py-2 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      {rowTeam.rank}
                    </span>
                    <span className="text-xs font-medium text-slate-300 truncate max-w-[60px]">
                      {rowTeam.displayName.split('/')[0]}
                    </span>
                  </div>
                </td>
                {standings.map((colTeam) => {
                  if (rowTeam.teamId === colTeam.teamId) {
                    return (
                      <td key={colTeam.teamId} className="text-center p-2">
                        <div className="w-10 h-10 mx-auto rounded-lg bg-slate-800/50 flex items-center justify-center">
                          <span className="text-slate-600">—</span>
                        </div>
                      </td>
                    )
                  }

                  const result = getMatchResult(rowTeam.teamId, colTeam.teamId)

                  return (
                    <td key={colTeam.teamId} className="text-center p-2">
                      <div
                        className={`w-10 h-10 mx-auto rounded-lg flex flex-col items-center justify-center ${
                          result === null
                            ? 'bg-slate-800/50 border border-slate-700/50 border-dashed'
                            : result.won
                            ? 'bg-lime-500/20 border border-lime-500/30'
                            : 'bg-red-500/10 border border-red-500/20'
                        }`}
                      >
                        {result === null ? (
                          <span className="text-[10px] text-slate-500">TBD</span>
                        ) : result.status === 'in_progress' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse mb-0.5" />
                            <span className="text-[10px] text-sky-400">{result.score}</span>
                          </>
                        ) : (
                          <>
                            <span className={`text-[10px] font-bold ${result.won ? 'text-lime-400' : 'text-red-400'}`}>
                              {result.won ? 'W' : 'L'}
                            </span>
                            <span className="text-[10px] text-slate-400">{result.score}</span>
                          </>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// =============================================================================
// Match Schedule
// =============================================================================

interface MatchScheduleProps {
  matches: PoolMatch[]
  teams: PoolTeam[]
  poolColor: keyof typeof poolColors
  isGameManager?: boolean
  onViewMatch?: (matchId: string) => void
  onStartMatch?: (matchId: string) => void
  onEnterScore?: (matchId: string) => void
}

function MatchSchedule({
  matches,
  teams,
  poolColor,
  isGameManager,
  onViewMatch,
  onStartMatch,
  onEnterScore,
}: MatchScheduleProps) {
  const colors = poolColors[poolColor]

  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId)

  const completedMatches = matches.filter((m) => m.status === 'completed')
  const liveMatches = matches.filter((m) => m.status === 'in_progress')
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming' || m.status === 'calling')

  const renderMatch = (match: PoolMatch) => {
    const team1 = getTeam(match.team1Id)
    const team2 = getTeam(match.team2Id)

    const statusStyles = {
      completed: 'border-slate-700/30 bg-slate-800/30',
      in_progress: 'border-sky-500/30 bg-sky-500/10',
      upcoming: 'border-slate-700/50 bg-slate-900/50',
      calling: 'border-amber-500/30 bg-amber-500/10',
    }

    return (
      <div
        key={match.id}
        onClick={() => onViewMatch?.(match.id)}
        className={`rounded-xl border p-4 cursor-pointer hover:border-slate-600 transition-colors ${statusStyles[match.status]}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {match.status === 'in_progress' && (
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            )}
            {match.status === 'calling' && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
            <span
              className={`text-xs font-medium ${
                match.status === 'in_progress'
                  ? 'text-sky-400'
                  : match.status === 'calling'
                  ? 'text-amber-400'
                  : match.status === 'completed'
                  ? 'text-lime-400'
                  : 'text-slate-500'
              }`}
            >
              {match.status === 'in_progress'
                ? 'LIVE'
                : match.status === 'calling'
                ? 'CALLING'
                : match.status === 'completed'
                ? 'FINAL'
                : new Date(match.scheduledTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
            </span>
          </div>
          {match.courtId && match.status !== 'upcoming' && (
            <span className="text-xs text-slate-500">
              <MapPin className="w-3 h-3 inline mr-1" />
              Court {match.courtId.replace('court-', '')}
            </span>
          )}
        </div>

        {/* Teams */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  match.winner === 'team1'
                    ? 'bg-lime-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {team1?.seed}
              </span>
              <span
                className={`font-medium ${
                  match.winner === 'team1' ? 'text-lime-400' : 'text-slate-200'
                }`}
              >
                {team1?.displayName}
              </span>
              {match.winner === 'team1' && match.status === 'completed' && (
                <Trophy className="w-4 h-4 text-lime-400" />
              )}
            </div>
            <span
              className={`text-lg font-bold tabular-nums ${
                match.score && match.score.team1 > match.score.team2
                  ? 'text-lime-400'
                  : 'text-slate-400'
              }`}
            >
              {match.score?.team1 ?? '-'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  match.winner === 'team2'
                    ? 'bg-lime-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {team2?.seed}
              </span>
              <span
                className={`font-medium ${
                  match.winner === 'team2' ? 'text-lime-400' : 'text-slate-200'
                }`}
              >
                {team2?.displayName}
              </span>
              {match.winner === 'team2' && match.status === 'completed' && (
                <Trophy className="w-4 h-4 text-lime-400" />
              )}
            </div>
            <span
              className={`text-lg font-bold tabular-nums ${
                match.score && match.score.team2 > match.score.team1
                  ? 'text-lime-400'
                  : 'text-slate-400'
              }`}
            >
              {match.score?.team2 ?? '-'}
            </span>
          </div>
        </div>

        {/* GM Actions */}
        {isGameManager && (match.status === 'upcoming' || match.status === 'in_progress') && (
          <div className="mt-3 pt-3 border-t border-slate-700/30 flex gap-2">
            {match.status === 'upcoming' && onStartMatch && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onStartMatch(match.id)
                }}
                className="flex-1 px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-900 text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3" />
                Start Match
              </button>
            )}
            {match.status === 'in_progress' && onEnterScore && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEnterScore(match.id)
                }}
                className="flex-1 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                Enter Score
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-bold text-white">Match Schedule</h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <h3 className="text-xs font-medium text-sky-400 uppercase tracking-wider">
                Live Now
              </h3>
            </div>
            <div className="grid gap-3">
              {liveMatches.map(renderMatch)}
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3 h-3 text-slate-400" />
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Upcoming
              </h3>
            </div>
            <div className="grid gap-3">
              {upcomingMatches.map(renderMatch)}
            </div>
          </div>
        )}

        {/* Completed Matches */}
        {completedMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-3 h-3 text-slate-400" />
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Completed
              </h3>
            </div>
            <div className="grid gap-3">
              {completedMatches.map(renderMatch)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Tiebreaker Info
// =============================================================================

function TiebreakerInfo() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <AlertCircle className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white mb-1">Tiebreaker Rules</h3>
          <ol className="text-xs text-slate-400 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">1</span>
              Head-to-head record
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
              Point differential
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">3</span>
              Total points scored
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function PoolDetailView({
  pool,
  teams,
  progress,
  teamsAdvancing,
  tournamentName,
  currentUserId,
  isGameManager,
  onBack,
  onViewMatch,
  onStartMatch,
  onEnterScore,
  onViewTeam,
  onSharePool,
}: PoolDetailViewProps) {
  // Find current user's team
  const currentUserTeam = currentUserId
    ? teams.find((t) => t.players.some((p) => p.id === currentUserId))
    : undefined

  return (
    <div className="space-y-6">
      {/* Header */}
      <PoolHeader
        pool={pool}
        tournamentName={tournamentName}
        progress={progress}
        onBack={onBack}
        onShare={onSharePool}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Standings & Head-to-Head */}
        <div className="lg:col-span-2 space-y-6">
          <FullStandingsTable
            standings={pool.standings}
            teams={teams}
            teamsAdvancing={teamsAdvancing}
            currentUserTeamId={currentUserTeam?.id}
            onViewTeam={onViewTeam}
          />

          <HeadToHeadMatrix
            standings={pool.standings}
            matches={pool.matches}
            teams={teams}
          />
        </div>

        {/* Right Column - Schedule & Info */}
        <div className="space-y-6">
          <MatchSchedule
            matches={pool.matches}
            teams={teams}
            poolColor={pool.color}
            isGameManager={isGameManager}
            onViewMatch={onViewMatch}
            onStartMatch={onStartMatch}
            onEnterScore={onEnterScore}
          />

          <TiebreakerInfo />
        </div>
      </div>
    </div>
  )
}
