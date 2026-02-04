import type {
  RoundRobinPool,
  RoundRobinTeam,
  RoundRobinEventProgress,
  PoolProgressItem,
  TiebreakerExplanation,
  RoundRobinPoolStanding,
  PoolColor,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface PoolProgressBarProps {
  progress: PoolProgressItem
  color: PoolColor
}

function PoolProgressBar({ progress, color }: PoolProgressBarProps) {
  const colorClasses: Record<PoolColor, string> = {
    lime: 'bg-lime-500',
    sky: 'bg-sky-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
    cyan: 'bg-cyan-500',
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out`}
          style={{ width: `${progress.percentComplete}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums min-w-[4rem] text-right">
        {progress.matchesPlayed}/{progress.matchesTotal}
      </span>
    </div>
  )
}

interface TiebreakerBadgeProps {
  tiebreaker: TiebreakerExplanation
  /** If true, tooltip appears above instead of below (for rows near bottom of container) */
  tooltipAbove?: boolean
}

function TiebreakerBadge({ tiebreaker, tooltipAbove = false }: TiebreakerBadgeProps) {
  const ruleLabels: Record<string, string> = {
    head_to_head: 'H2H',
    overall_point_diff: 'PD',
    h2h_point_diff: 'H2H PD',
    vs_next_highest: 'vs Next',
    coin_flip: 'Coin',
  }

  return (
    <div className="group/tiebreaker relative">
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded cursor-help">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {ruleLabels[tiebreaker.appliedRule]}
      </span>
      {/* Tooltip - positioned above or below based on row position */}
      <div className={`
        absolute right-0 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg
        opacity-0 invisible group-hover/tiebreaker:opacity-100 group-hover/tiebreaker:visible
        transition-all duration-150 pointer-events-none z-50 shadow-xl max-w-[280px]
        ${tooltipAbove ? 'bottom-full mb-1' : 'top-full mt-1'}
      `}>
        {tiebreaker.reason}
        {/* Arrow pointer */}
        <div className={`
          absolute right-3 border-4 border-transparent
          ${tooltipAbove
            ? 'top-full -mt-1 border-t-slate-900 dark:border-t-slate-100'
            : 'bottom-full border-b-slate-900 dark:border-b-slate-100'}
        `} />
      </div>
    </div>
  )
}

interface StandingRowProps {
  standing: RoundRobinPoolStanding
  team: RoundRobinTeam | undefined
  advancementLine: number
  isCurrentUser: boolean
  /** If true, tooltips should appear above (for rows near bottom of container) */
  isNearBottom?: boolean
  onViewTeam?: () => void
}

function StandingRow({ standing, team, advancementLine, isCurrentUser, isNearBottom, onViewTeam }: StandingRowProps) {
  const isAdvancing = standing.rank <= advancementLine
  const isOnBubble = standing.rank === advancementLine || standing.rank === advancementLine + 1

  return (
    <tr
      className={`
        group transition-colors cursor-pointer
        ${isCurrentUser
          ? 'bg-lime-50 dark:bg-lime-950/30 hover:bg-lime-100 dark:hover:bg-lime-950/50'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }
        ${isOnBubble ? 'relative' : ''}
      `}
      onClick={onViewTeam}
    >
      {/* Rank */}
      <td className="py-3 px-4 text-center">
        <div className={`
          inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
          ${isAdvancing
            ? 'bg-lime-500 text-white'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }
        `}>
          {standing.rank}
        </div>
      </td>

      {/* Team Name */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isCurrentUser ? 'text-lime-700 dark:text-lime-400' : 'text-slate-900 dark:text-white'}`}>
                {standing.displayName}
              </span>
              {isCurrentUser && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-lime-500 text-white rounded">
                  You
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Seed #{standing.seed}
              {team && ` • ${team.combinedRating.toFixed(2)} rating`}
            </div>
          </div>
        </div>
      </td>

      {/* Record */}
      <td className="py-3 px-4 text-center">
        <span className="font-mono font-bold text-slate-900 dark:text-white">
          {standing.wins}-{standing.losses}
        </span>
        {standing.matchesRemaining > 0 && (
          <div className="text-xs text-slate-400 dark:text-slate-500">
            {standing.matchesRemaining} left
          </div>
        )}
      </td>

      {/* Point Differential */}
      <td className="py-3 px-4 text-center">
        <span className={`
          font-mono font-bold
          ${standing.pointDiff > 0
            ? 'text-lime-600 dark:text-lime-400'
            : standing.pointDiff < 0
              ? 'text-red-500 dark:text-red-400'
              : 'text-slate-500 dark:text-slate-400'
          }
        `}>
          {standing.pointDiff > 0 ? '+' : ''}{standing.pointDiff}
        </span>
        <div className="text-xs text-slate-400 dark:text-slate-500">
          {standing.pointsFor}-{standing.pointsAgainst}
        </div>
      </td>

      {/* Status / Tiebreaker */}
      <td className="py-3 px-4 text-right overflow-visible">
        <div className="flex items-center justify-end gap-2 relative">
          {standing.tiebreaker && (
            <TiebreakerBadge tiebreaker={standing.tiebreaker} tooltipAbove={isNearBottom} />
          )}
          {isAdvancing ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Advancing
            </span>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {standing.matchesRemaining > 0 ? 'In contention' : 'Eliminated'}
            </span>
          )}
        </div>
      </td>
    </tr>
  )
}

interface PoolCardProps {
  pool: RoundRobinPool
  teams: RoundRobinTeam[]
  progress: PoolProgressItem
  currentUserId?: string
  onViewTeam?: (teamId: string) => void
}

function PoolCard({ pool, teams, progress, currentUserId, onViewTeam }: PoolCardProps) {
  const colorAccents: Record<PoolColor, { border: string; bg: string; text: string }> = {
    lime: { border: 'border-l-lime-500', bg: 'bg-lime-500', text: 'text-lime-600 dark:text-lime-400' },
    sky: { border: 'border-l-sky-500', bg: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400' },
    amber: { border: 'border-l-amber-500', bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    violet: { border: 'border-l-violet-500', bg: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400' },
    rose: { border: 'border-l-rose-500', bg: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
    cyan: { border: 'border-l-cyan-500', bg: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400' },
  }

  const colors = colorAccents[pool.color]
  const teamMap = new Map(teams.map(t => [t.id, t]))

  // Check if current user is in this pool
  const userTeam = teams.find(t => t.players.some(p => p.id === currentUserId))
  const userInPool = userTeam && pool.teams.includes(userTeam.id)

  return (
    <div className={`
      bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800
      border-l-4 ${colors.border}
      ${userInPool ? 'ring-2 ring-lime-500/50' : ''}
    `}>
      {/* Pool Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {pool.name}
            </h3>
            {userInPool && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-lime-500 text-white rounded">
                Your Pool
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${pool.status === 'completed'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                : pool.status === 'in_progress'
                  ? `bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }
            `}>
              {pool.status === 'in_progress' ? 'In Progress' : pool.status === 'completed' ? 'Complete' : 'Upcoming'}
            </span>
          </div>
        </div>
        <PoolProgressBar progress={progress} color={pool.color} />
      </div>

      {/* Standings Table */}
      <div>
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-2 px-4 text-center font-semibold">#</th>
              <th className="py-2 px-4 text-left font-semibold">Team</th>
              <th className="py-2 px-4 text-center font-semibold">W-L</th>
              <th className="py-2 px-4 text-center font-semibold">+/-</th>
              <th className="py-2 px-4 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {pool.standings.map((standing, idx) => {
              const team = teamMap.get(standing.teamId)
              const isCurrentUser = team?.players.some(p => p.id === currentUserId) ?? false
              // Last 2 rows should show tooltips above to avoid clipping
              const isNearBottom = idx >= pool.standings.length - 2

              return (
                <StandingRow
                  key={standing.teamId}
                  standing={standing}
                  team={team}
                  advancementLine={pool.advancementLine}
                  isCurrentUser={isCurrentUser}
                  isNearBottom={isNearBottom}
                  onViewTeam={() => onViewTeam?.(standing.teamId)}
                />
              )
            })}
          </tbody>
        </table>

        {/* Advancement Line Indicator */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 rounded-b-xl">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="w-3 h-3 rounded-full bg-lime-500" />
            <span>Top {pool.advancementLine} advance to playoffs</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export interface RoundRobinPoolStandingsProps {
  /** All pools in the event */
  pools: RoundRobinPool[]
  /** All teams in the event */
  teams: RoundRobinTeam[]
  /** Event progress tracking */
  progress: RoundRobinEventProgress
  /** Current user's player ID */
  currentUserId?: string
  /** Event name for header */
  eventName?: string
  /** Called when user views a team */
  onViewTeam?: (teamId: string) => void
  /** Called when user views a specific pool in detail */
  onViewPool?: (poolId: string) => void
  /** Called when user wants to view playoff bracket preview */
  onViewPlayoffBracket?: () => void
}

export function RoundRobinPoolStandings({
  pools,
  teams,
  progress,
  currentUserId,
  eventName = 'Round Robin',
  onViewTeam,
  onViewPool,
  onViewPlayoffBracket,
}: RoundRobinPoolStandingsProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            {/* Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Pool Standings
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {eventName} • Round {progress.currentRound} of {progress.totalRounds}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Overall Progress */}
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Matches</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                      {progress.completedMatches}/{progress.totalMatches}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-300 dark:bg-slate-700" />
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time Left</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                      ~{progress.estimatedRemainingMinutes}m
                    </div>
                  </div>
                </div>

                {/* View Playoffs Button */}
                <button
                  onClick={onViewPlayoffBracket}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="hidden sm:inline">Playoff Preview</span>
                </button>
              </div>
            </div>

            {/* Tiebreaker Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Tiebreakers:</span>
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-[10px] font-semibold">H2H</span>
                Head-to-head
              </span>
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-[10px] font-semibold">PD</span>
                Point diff
              </span>
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-[10px] font-semibold">H2H PD</span>
                H2H point diff
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pool Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pools.map(pool => (
            <PoolCard
              key={pool.id}
              pool={pool}
              teams={teams.filter(t => pool.teams.includes(t.id))}
              progress={progress.poolProgress[pool.id] || { matchesPlayed: 0, matchesTotal: 0, percentComplete: 0 }}
              currentUserId={currentUserId}
              onViewTeam={onViewTeam}
            />
          ))}
        </div>

        {/* Live Matches Banner */}
        {progress.inProgressMatches > 0 && (
          <div className="mt-8 p-4 bg-gradient-to-r from-lime-500 to-lime-600 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  <span className="text-white font-bold text-lg">
                    {progress.inProgressMatches} {progress.inProgressMatches === 1 ? 'Match' : 'Matches'} In Progress
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors">
                View Courts
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoundRobinPoolStandings
