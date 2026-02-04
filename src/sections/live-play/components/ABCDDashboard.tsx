import {
  Users,
  Trophy,
  Target,
  Clock,
  ChevronRight,
  LayoutGrid,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react'
import type {
  ABCDDashboardProps,
  ABCDSession,
  ABCDGroupStandings,
  ABCDPlayer,
  ABCDMatch,
  ABCDGroup,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Helper Functions
// =============================================================================

function getGroupColor(group: ABCDGroup): { bg: string; border: string; text: string; badge: string } {
  const colors: Record<ABCDGroup, { bg: string; border: string; text: string; badge: string }> = {
    A: {
      bg: 'from-amber-900/30 to-amber-950/30',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    B: {
      bg: 'from-slate-700/30 to-slate-800/30',
      border: 'border-slate-400/40',
      text: 'text-slate-300',
      badge: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
    },
    C: {
      bg: 'from-orange-900/30 to-orange-950/30',
      border: 'border-orange-500/40',
      text: 'text-orange-400',
      badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
    D: {
      bg: 'from-lime-900/30 to-lime-950/30',
      border: 'border-lime-500/40',
      text: 'text-lime-400',
      badge: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
    },
  }
  return colors[group]
}

function getGroupDescription(group: ABCDGroup): string {
  const descriptions: Record<ABCDGroup, string> = {
    A: 'Advanced (4.5+)',
    B: 'Upper-Intermediate (4.0-4.49)',
    C: 'Intermediate (3.5-3.99)',
    D: 'Beginner-Intermediate (2.5-3.49)',
  }
  return descriptions[group]
}

// =============================================================================
// Sub-Components
// =============================================================================

interface OverallProgressProps {
  currentRound: number
  totalRounds: number
  groupProgress: ABCDSession['groupProgress']
}

function OverallProgress({ currentRound, totalRounds, groupProgress }: OverallProgressProps) {
  const totalMatches = Object.values(groupProgress).reduce((sum, g) => sum + g.matchesTotal, 0)
  const completedMatches = Object.values(groupProgress).reduce((sum, g) => sum + g.matchesPlayed, 0)
  const overallPercent = Math.round((completedMatches / totalMatches) * 100)

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Round {currentRound} of {totalRounds}</h2>
          <p className="text-sm text-slate-400">{completedMatches} of {totalMatches} matches complete</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{overallPercent}%</p>
          <p className="text-xs text-slate-500">Overall Progress</p>
        </div>
      </div>

      {/* Group Progress Bars */}
      <div className="grid grid-cols-4 gap-3">
        {(['A', 'B', 'C', 'D'] as ABCDGroup[]).map((group) => {
          const progress = groupProgress[group]
          const colors = getGroupColor(group)
          return (
            <div key={group} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className={colors.text}>Group {group}</span>
                <span className="text-slate-500">{progress.percentComplete}%</span>
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    group === 'A' ? 'bg-amber-500' : ''
                  } ${group === 'B' ? 'bg-slate-400' : ''} ${
                    group === 'C' ? 'bg-orange-500' : ''
                  } ${group === 'D' ? 'bg-lime-500' : ''}`}
                  style={{ width: `${progress.percentComplete}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface GroupCardProps {
  groupStandings: ABCDGroupStandings
  currentMatches: ABCDMatch[]
  onViewGroup?: () => void
  onViewPlayer?: (playerId: string) => void
  onStartMatch?: (matchId: string) => void
  onEnterScore?: (matchId: string) => void
}

function GroupCard({
  groupStandings,
  currentMatches,
  onViewGroup,
  onViewPlayer,
  onStartMatch,
  onEnterScore,
}: GroupCardProps) {
  const colors = getGroupColor(groupStandings.group)
  const activeMatch = currentMatches.find((m) => m.status === 'in_progress')

  return (
    <div
      className={`
        bg-gradient-to-br ${colors.bg}
        border ${colors.border} rounded-2xl overflow-hidden
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl
              ${colors.badge} border
            `}
          >
            {groupStandings.group}
          </span>
          <div>
            <h3 className="font-semibold text-white">Group {groupStandings.group}</h3>
            <p className="text-xs text-slate-400">{getGroupDescription(groupStandings.group)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-white">
            {groupStandings.matchesCompleted}/{groupStandings.matchesTotal}
          </p>
          <p className="text-xs text-slate-500">matches</p>
        </div>
      </div>

      {/* Active Match */}
      {activeMatch && (
        <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-amber-400">LIVE MATCH</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {activeMatch.team1.map((p) => p.name.split(' ')[0]).join(' & ')}
              </p>
            </div>
            <div className="px-4 flex items-center gap-2">
              <span className="text-xl font-bold text-white">{activeMatch.score?.team1 || 0}</span>
              <span className="text-slate-500">-</span>
              <span className="text-xl font-bold text-white">{activeMatch.score?.team2 || 0}</span>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-white">
                {activeMatch.team2.map((p) => p.name.split(' ')[0]).join(' & ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onEnterScore?.(activeMatch.id)}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Target className="w-3.5 h-3.5" />
            Enter Final Score
          </button>
        </div>
      )}

      {/* Standings */}
      <div className="divide-y divide-slate-700/30">
        {groupStandings.players.slice(0, 4).map((player) => (
          <button
            key={player.id}
            onClick={() => onViewPlayer?.(player.id)}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/20 transition-colors"
          >
            <span
              className={`
                w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold
                ${player.rank === 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400'}
              `}
            >
              {player.rank}
            </span>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">{player.name}</p>
              <p className="text-xs text-slate-500">{player.skillRating.toFixed(1)}</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-lime-400">{player.wins}W</span>
              <span className="text-red-400">{player.losses}L</span>
              <span className={player.pointDiff >= 0 ? 'text-lime-400' : 'text-red-400'}>
                {player.pointDiff >= 0 ? '+' : ''}{player.pointDiff}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* View All Button */}
      <button
        onClick={onViewGroup}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/30 transition-colors border-t border-slate-700/30"
      >
        View Full Standings
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

interface MatchQueueProps {
  matches: ABCDMatch[]
  onStartMatch?: (matchId: string, courtId: string) => void
}

function MatchQueue({ matches, onStartMatch }: MatchQueueProps) {
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming').slice(0, 4)

  if (upcomingMatches.length === 0) {
    return null
  }

  return (
    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-400" />
        Up Next
      </h3>
      <div className="space-y-2">
        {upcomingMatches.map((match) => {
          const colors = getGroupColor(match.group)
          return (
            <div
              key={match.id}
              className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
            >
              <span className={`px-2 py-1 text-xs font-bold rounded ${colors.badge} border`}>
                {match.group}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  {match.team1.map((p) => p.name.split(' ')[0]).join('/')} vs{' '}
                  {match.team2.map((p) => p.name.split(' ')[0]).join('/')}
                </p>
                <p className="text-xs text-slate-500">Round {match.roundNumber}</p>
              </div>
              <button
                onClick={() => onStartMatch?.(match.id, '')}
                className="px-3 py-1.5 bg-lime-600 hover:bg-lime-500 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Start
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ABCDDashboard({
  event,
  session,
  courts,
  onStartSession,
  onAssignPlayerToGroup,
  onStartMatch,
  onEnterScore,
  onEndSession,
  onViewPlayer,
  onViewMatch,
  onViewGroup,
}: ABCDDashboardProps) {
  const { config, groupStandings, matches, groupProgress, currentRound, totalRounds } = session

  // Group current matches by group
  const matchesByGroup: Record<ABCDGroup, ABCDMatch[]> = {
    A: matches.filter((m) => m.group === 'A'),
    B: matches.filter((m) => m.group === 'B'),
    C: matches.filter((m) => m.group === 'C'),
    D: matches.filter((m) => m.group === 'D'),
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{event.name}</h1>
              <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs font-semibold rounded-full">
                ABCD PLAY
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{event.venue.name}</span>
              <span className="text-slate-600">•</span>
              <span>4 Skill Groups</span>
              <span className="text-slate-600">•</span>
              <span>{config.roundsPerGroup} Rounds per Group</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-red-400 font-semibold text-sm">LIVE</span>
            </div>
            <button
              onClick={onEndSession}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-medium rounded-lg transition-colors"
            >
              End Session
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Overall Progress */}
        <OverallProgress
          currentRound={currentRound}
          totalRounds={totalRounds}
          groupProgress={groupProgress}
        />

        {/* Skill Level Banner */}
        <div className="mt-4 flex items-center justify-center gap-4 py-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-amber-500/30 border border-amber-500/50" />
            <span className="text-sm text-slate-300">A: 4.5+</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-slate-400/30 border border-slate-400/50" />
            <span className="text-sm text-slate-300">B: 4.0-4.49</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-orange-500/30 border border-orange-500/50" />
            <span className="text-sm text-slate-300">C: 3.5-3.99</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-lime-500/30 border border-lime-500/50" />
            <span className="text-sm text-slate-300">D: 2.5-3.49</span>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {groupStandings.map((gs) => (
            <GroupCard
              key={gs.group}
              groupStandings={gs}
              currentMatches={matchesByGroup[gs.group]}
              onViewGroup={() => onViewGroup?.(gs.group)}
              onViewPlayer={onViewPlayer}
              onStartMatch={(matchId) => onStartMatch?.(matchId, courts[0]?.id || '')}
              onEnterScore={(matchId) => onEnterScore?.(matchId, 0, 0)}
            />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Match Queue */}
          <MatchQueue
            matches={matches}
            onStartMatch={(matchId, courtId) => onStartMatch?.(matchId, courtId)}
          />

          {/* Courts Status */}
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-slate-400" />
              Courts ({courts.length})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {courts.slice(0, 4).map((court) => {
                const activeMatch = matches.find(
                  (m) => m.courtId === court.id && m.status === 'in_progress'
                )
                const courtColors = activeMatch ? getGroupColor(activeMatch.group) : null

                return (
                  <div
                    key={court.id}
                    className={`
                      p-3 rounded-lg border
                      ${activeMatch
                        ? `${courtColors?.bg} ${courtColors?.border}`
                        : 'bg-slate-700/30 border-slate-600/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{court.name}</span>
                      {activeMatch && (
                        <span className={`text-xs font-bold ${courtColors?.text}`}>
                          Group {activeMatch.group}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {activeMatch ? 'In progress' : court.status === 'available' ? 'Available' : court.status}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
