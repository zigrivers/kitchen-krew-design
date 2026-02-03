import type {
  LiveEvent,
  RoundRobinConfig,
  RoundRobinEventProgress,
  RoundRobinPool,
  RoundRobinTeam,
  RoundRobinMatch,
  UpcomingRoundRobinMatch,
  RoundRobinSchedule,
  Court,
  PendingPlayoffBracket,
  PoolColor,
  PoolProgressItem,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface QuickStatProps {
  label: string
  value: string | number
  subValue?: string
  trend?: 'up' | 'down' | 'neutral'
  accent?: boolean
}

function QuickStat({ label, value, subValue, trend, accent }: QuickStatProps) {
  return (
    <div className={`
      p-4 rounded-xl
      ${accent
        ? 'bg-gradient-to-br from-lime-500 to-lime-600 text-white'
        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
      }
    `}>
      <div className={`text-xs uppercase tracking-wider ${accent ? 'text-lime-100' : 'text-slate-500 dark:text-slate-400'}`}>
        {label}
      </div>
      <div className={`text-2xl font-bold mt-1 ${accent ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
        {value}
      </div>
      {subValue && (
        <div className={`text-xs mt-0.5 ${accent ? 'text-lime-200' : 'text-slate-500 dark:text-slate-400'}`}>
          {subValue}
        </div>
      )}
    </div>
  )
}

interface CourtCardProps {
  court: Court
  match?: RoundRobinMatch
  teams: Map<string, RoundRobinTeam>
  onCallMatch?: () => void
  onStartMatch?: () => void
  onEnterScore?: () => void
}

function CourtCard({ court, match, teams, onCallMatch, onStartMatch, onEnterScore }: CourtCardProps) {
  const getTeamName = (teamId: string) => teams.get(teamId)?.displayName || 'TBD'

  const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    available: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
    calling: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
    in_progress: { bg: 'bg-lime-50 dark:bg-lime-950/30', text: 'text-lime-700 dark:text-lime-400', dot: 'bg-lime-500' },
    maintenance: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400' },
  }

  const colors = statusColors[court.status] || statusColors.available

  return (
    <div className={`
      rounded-xl border-2 overflow-hidden transition-all
      ${court.status === 'in_progress' ? 'border-lime-500 shadow-lg shadow-lime-500/10' :
        court.status === 'calling' ? 'border-amber-500 shadow-lg shadow-amber-500/10' :
        'border-slate-200 dark:border-slate-800'}
    `}>
      {/* Header */}
      <div className={`px-4 py-3 ${colors.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${colors.dot} ${court.status === 'calling' ? 'animate-pulse' : ''}`} />
          <span className="font-bold text-slate-900 dark:text-white">{court.name}</span>
        </div>
        <span className={`text-xs font-medium uppercase tracking-wider ${colors.text}`}>
          {court.status.replace('_', ' ')}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 bg-white dark:bg-slate-900">
        {match ? (
          <div className="space-y-3">
            {/* Teams */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900 dark:text-white truncate">
                  {getTeamName(match.team1Id)}
                </span>
                {match.score && (
                  <span className={`font-mono font-bold text-lg ${
                    match.score.team1 > match.score.team2 ? 'text-lime-600 dark:text-lime-400' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {match.score.team1}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900 dark:text-white truncate">
                  {getTeamName(match.team2Id)}
                </span>
                {match.score && (
                  <span className={`font-mono font-bold text-lg ${
                    match.score.team2 > match.score.team1 ? 'text-lime-600 dark:text-lime-400' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {match.score.team2}
                  </span>
                )}
              </div>
            </div>

            {/* Pool Badge */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Round {match.roundNumber} • {match.poolId.replace('pool-', 'Pool ').toUpperCase()}
            </div>

            {/* Action Button */}
            {court.status === 'in_progress' && (
              <button
                onClick={onEnterScore}
                className="w-full py-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg transition-colors"
              >
                Enter Score
              </button>
            )}
            {court.status === 'calling' && (
              <button
                onClick={onStartMatch}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
              >
                Start Match
              </button>
            )}
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className="text-slate-400 dark:text-slate-500 mb-3">No active match</div>
            <button
              onClick={onCallMatch}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
            >
              Call Next Match
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface PoolMiniCardProps {
  pool: RoundRobinPool
  progress: PoolProgressItem
  onViewPool: () => void
}

function PoolMiniCard({ pool, progress, onViewPool }: PoolMiniCardProps) {
  const colorClasses: Record<PoolColor, string> = {
    lime: 'border-l-lime-500',
    sky: 'border-l-sky-500',
    amber: 'border-l-amber-500',
    violet: 'border-l-violet-500',
    rose: 'border-l-rose-500',
    cyan: 'border-l-cyan-500',
  }

  const bgClasses: Record<PoolColor, string> = {
    lime: 'bg-lime-500',
    sky: 'bg-sky-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
    cyan: 'bg-cyan-500',
  }

  return (
    <button
      onClick={onViewPool}
      className={`
        w-full text-left bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800
        border-l-4 ${colorClasses[pool.color]}
        hover:shadow-md transition-shadow p-3
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-900 dark:text-white">{pool.name}</span>
        <span className={`
          px-2 py-0.5 text-xs font-medium rounded-full
          ${pool.status === 'completed'
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            : 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400'
          }
        `}>
          {progress.percentComplete}%
        </span>
      </div>
      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${bgClasses[pool.color]} transition-all duration-500`}
          style={{ width: `${progress.percentComplete}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {progress.matchesPlayed}/{progress.matchesTotal} matches
      </div>
    </button>
  )
}

interface MatchQueueItemProps {
  match: UpcomingRoundRobinMatch
  teams: Map<string, RoundRobinTeam>
  pools: Map<string, RoundRobinPool>
  onCallMatch: () => void
}

function MatchQueueItem({ match, teams, pools, onCallMatch }: MatchQueueItemProps) {
  const team1 = teams.get(match.team1Id)
  const team2 = teams.get(match.team2Id)
  const pool = pools.get(match.poolId)

  const colorClasses: Record<PoolColor, string> = {
    lime: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',
    sky: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
    rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${pool ? colorClasses[pool.color] : 'bg-slate-100 text-slate-600'}`}>
            {pool?.name || 'Pool'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">R{match.roundNumber}</span>
        </div>
        <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {team1?.displayName || 'TBD'} vs {team2?.displayName || 'TBD'}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          ~{match.estimatedWait}min wait
        </div>
      </div>
      <button
        onClick={onCallMatch}
        className="px-3 py-1.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
      >
        Call
      </button>
    </div>
  )
}

interface PlayoffPreviewCardProps {
  bracket: PendingPlayoffBracket
  onStartPlayoffs: () => void
  onViewBracket: () => void
  allPoolsComplete: boolean
}

function PlayoffPreviewCard({ bracket, onStartPlayoffs, onViewBracket, allPoolsComplete }: PlayoffPreviewCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-lime-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Playoff Bracket</h3>
            <p className="text-sm text-slate-400">
              {bracket.size}-team {bracket.format.replace('_', ' ')}
            </p>
          </div>
        </div>
        <span className={`
          px-2 py-1 text-xs font-medium rounded-full
          ${bracket.status === 'pending'
            ? 'bg-slate-700 text-slate-300'
            : bracket.status === 'ready'
              ? 'bg-lime-500/20 text-lime-400'
              : 'bg-amber-500/20 text-amber-400'
          }
        `}>
          {bracket.status === 'pending' ? 'Waiting for pools' : bracket.status === 'ready' ? 'Ready' : 'In Progress'}
        </span>
      </div>

      {/* Projected Matchups */}
      <div className="space-y-2 mb-4">
        <div className="text-xs text-slate-400 uppercase tracking-wider">Projected QF Matchups</div>
        <div className="grid grid-cols-2 gap-2">
          {bracket.projectedMatchups.slice(0, 4).map((matchup, idx) => (
            <div key={idx} className="text-xs bg-slate-800/50 rounded p-2">
              <div className="text-slate-400 mb-1">{matchup.position}</div>
              <div className="text-white font-medium truncate">{matchup.projectedTeam1}</div>
              <div className="text-slate-500">vs</div>
              <div className="text-white font-medium truncate">{matchup.projectedTeam2}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onViewBracket}
          className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
        >
          Preview Bracket
        </button>
        {allPoolsComplete && bracket.status === 'ready' && (
          <button
            onClick={onStartPlayoffs}
            className="flex-1 py-2 bg-lime-500 hover:bg-lime-600 text-white font-medium rounded-lg transition-colors"
          >
            Start Playoffs
          </button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export interface RoundRobinGMDashboardProps {
  /** Event information */
  event: LiveEvent
  /** Round robin configuration */
  config: RoundRobinConfig
  /** Event progress */
  progress: RoundRobinEventProgress
  /** All pools */
  pools: RoundRobinPool[]
  /** All teams */
  teams: RoundRobinTeam[]
  /** In-progress and recent matches */
  activeMatches: RoundRobinMatch[]
  /** Upcoming matches in queue */
  upcomingMatches: UpcomingRoundRobinMatch[]
  /** Schedule info */
  schedule: RoundRobinSchedule
  /** Courts */
  courts: Court[]
  /** Playoff bracket */
  playoffBracket: PendingPlayoffBracket | null

  // Callbacks
  onCallMatch?: (matchId: string, courtId: string) => void
  onStartMatch?: (matchId: string) => void
  onEnterScore?: (matchId: string) => void
  onViewPool?: (poolId: string) => void
  onViewPlayoffBracket?: () => void
  onStartPlayoffs?: () => void
  onPauseEvent?: () => void
  onResumeEvent?: () => void
  onEndEvent?: () => void
  onOpenCourtBoard?: () => void
}

export function RoundRobinGMDashboard({
  event,
  config,
  progress,
  pools,
  teams,
  activeMatches,
  upcomingMatches,
  schedule,
  courts,
  playoffBracket,
  onCallMatch,
  onStartMatch,
  onEnterScore,
  onViewPool,
  onViewPlayoffBracket,
  onStartPlayoffs,
  onPauseEvent,
  onResumeEvent,
  onEndEvent,
  onOpenCourtBoard,
}: RoundRobinGMDashboardProps) {
  const teamMap = new Map(teams.map(t => [t.id, t]))
  const poolMap = new Map(pools.map(p => [p.id, p]))

  // Get matches by court
  const matchesByCourtId = new Map(activeMatches.filter(m => m.courtId).map(m => [m.courtId!, m]))

  // Calculate stats
  const allPoolsComplete = pools.every(p => p.status === 'completed')
  const availableCourts = courts.filter(c => c.status === 'available').length

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {event.name}
                  </h1>
                  {event.isPaused ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                      PAUSED
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Game Manager Dashboard • {progress.currentRoundLabel}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenCourtBoard}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Court Board</span>
                </button>

                {event.isPaused ? (
                  <button
                    onClick={onResumeEvent}
                    className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Resume
                  </button>
                ) : (
                  <button
                    onClick={onPauseEvent}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Pause
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <QuickStat
            label="Matches"
            value={`${progress.completedMatches}/${progress.totalMatches}`}
            subValue={`${progress.inProgressMatches} in progress`}
          />
          <QuickStat
            label="Courts"
            value={`${courts.length - availableCourts}/${courts.length}`}
            subValue={`${availableCourts} available`}
          />
          <QuickStat
            label="Time Elapsed"
            value={`${Math.floor(progress.elapsedMinutes / 60)}h ${progress.elapsedMinutes % 60}m`}
            subValue={`~${progress.estimatedRemainingMinutes}min left`}
          />
          <QuickStat
            label="Round"
            value={`${progress.currentRound}/${progress.totalRounds}`}
            subValue={schedule.rounds[progress.currentRound - 1]?.status || 'in progress'}
            accent
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Courts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Courts Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Courts</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {progress.inProgressMatches} active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {courts.map(court => (
                  <CourtCard
                    key={court.id}
                    court={court}
                    match={matchesByCourtId.get(court.id)}
                    teams={teamMap}
                    onCallMatch={() => {
                      const nextMatch = upcomingMatches[0]
                      if (nextMatch) onCallMatch?.(nextMatch.id, court.id)
                    }}
                    onStartMatch={() => {
                      const match = matchesByCourtId.get(court.id)
                      if (match) onStartMatch?.(match.id)
                    }}
                    onEnterScore={() => {
                      const match = matchesByCourtId.get(court.id)
                      if (match) onEnterScore?.(match.id)
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Pool Progress */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pool Progress</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pools.map(pool => (
                  <PoolMiniCard
                    key={pool.id}
                    pool={pool}
                    progress={progress.poolProgress[pool.id] || { matchesPlayed: 0, matchesTotal: 15, percentComplete: 0 }}
                    onViewPool={() => onViewPool?.(pool.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Queue & Playoffs */}
          <div className="space-y-6">
            {/* Match Queue */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Match Queue</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {upcomingMatches.length} waiting
                </span>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {upcomingMatches.slice(0, 8).map(match => (
                  <MatchQueueItem
                    key={match.id}
                    match={match}
                    teams={teamMap}
                    pools={poolMap}
                    onCallMatch={() => {
                      const availableCourt = courts.find(c => c.status === 'available')
                      if (availableCourt) onCallMatch?.(match.id, availableCourt.id)
                    }}
                  />
                ))}
                {upcomingMatches.length === 0 && (
                  <div className="py-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <svg className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    All matches scheduled
                  </div>
                )}
              </div>
            </div>

            {/* Playoff Preview */}
            {playoffBracket && (
              <PlayoffPreviewCard
                bracket={playoffBracket}
                onStartPlayoffs={() => onStartPlayoffs?.()}
                onViewBracket={() => onViewPlayoffBracket?.()}
                allPoolsComplete={allPoolsComplete}
              />
            )}

            {/* End Event */}
            {allPoolsComplete && (
              <button
                onClick={onEndEvent}
                className="w-full py-3 border-2 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors"
              >
                End Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoundRobinGMDashboard
