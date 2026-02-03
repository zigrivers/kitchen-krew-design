import type {
  PlayerScheduleView,
  PlayerScheduleEntry,
  RoundRobinPool,
  RoundRobinPoolStanding,
  RoundRobinNotification,
  PoolColor,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface MatchStatusBadgeProps {
  status: 'upcoming' | 'in_progress' | 'completed'
  result?: 'W' | 'L' | null
}

function MatchStatusBadge({ status, result }: MatchStatusBadgeProps) {
  if (status === 'completed' && result) {
    return (
      <span className={`
        inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
        ${result === 'W'
          ? 'bg-lime-500 text-white'
          : 'bg-red-500 text-white'
        }
      `}>
        {result}
      </span>
    )
  }

  if (status === 'in_progress') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium">
      —
    </span>
  )
}

interface ScheduleRowProps {
  entry: PlayerScheduleEntry
  isNext: boolean
  onViewMatch?: () => void
}

function ScheduleRow({ entry, isNext, onViewMatch }: ScheduleRowProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div
      onClick={onViewMatch}
      className={`
        group relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all
        ${isNext
          ? 'bg-gradient-to-r from-lime-50 to-lime-100/50 dark:from-lime-950/30 dark:to-lime-900/20 ring-2 ring-lime-500 shadow-lg shadow-lime-500/10'
          : entry.status === 'in_progress'
            ? 'bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-300 dark:ring-amber-700'
            : entry.status === 'completed'
              ? 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }
      `}
    >
      {/* Next Match Indicator */}
      {isNext && (
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-12 bg-lime-500 rounded-full" />
      )}

      {/* Round Number */}
      <div className="flex-shrink-0 w-12 text-center">
        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Round</div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{entry.roundNumber}</div>
      </div>

      {/* Divider */}
      <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />

      {/* Opponent Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">vs</span>
          <span className="font-semibold text-slate-900 dark:text-white truncate">
            {entry.opponent}
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
            #{entry.opponentSeed}
          </span>
        </div>

        {/* Partner info for rotating formats */}
        {entry.partner && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="text-xs text-slate-400">with</span>
            <span className="font-medium">{entry.partner}</span>
          </div>
        )}

        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(entry.scheduledTime)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {entry.courtName}
          </span>
        </div>
      </div>

      {/* Score / Status */}
      <div className="flex-shrink-0 flex items-center gap-3">
        {entry.score && (
          <span className={`
            font-mono font-bold text-lg
            ${entry.result === 'W'
              ? 'text-lime-600 dark:text-lime-400'
              : entry.result === 'L'
                ? 'text-red-500 dark:text-red-400'
                : 'text-slate-900 dark:text-white'
            }
          `}>
            {entry.score}
          </span>
        )}
        <MatchStatusBadge status={entry.status} result={entry.result} />
      </div>

      {/* Arrow */}
      <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

interface StandingCardProps {
  rank: number
  advances: boolean
  poolName: string
  poolColor: PoolColor
  standing?: RoundRobinPoolStanding
}

function StandingCard({ rank, advances, poolName, poolColor, standing }: StandingCardProps) {
  const colorClasses: Record<PoolColor, { bg: string; border: string }> = {
    lime: { bg: 'bg-lime-500', border: 'border-lime-500' },
    sky: { bg: 'bg-sky-500', border: 'border-sky-500' },
    amber: { bg: 'bg-amber-500', border: 'border-amber-500' },
    violet: { bg: 'bg-violet-500', border: 'border-violet-500' },
    rose: { bg: 'bg-rose-500', border: 'border-rose-500' },
    cyan: { bg: 'bg-cyan-500', border: 'border-cyan-500' },
  }

  const colors = colorClasses[poolColor]

  return (
    <div className={`
      bg-white dark:bg-slate-900 rounded-xl border-l-4 ${colors.border}
      shadow-sm overflow-hidden
    `}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{poolName}</span>
          </div>
          {advances ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Advancing
            </span>
          ) : (
            <span className="text-xs text-slate-400">In contention</span>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-slate-900 dark:text-white">#{rank}</span>
          <span className="text-lg text-slate-500 dark:text-slate-400">/ 6</span>
        </div>

        {standing && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Record</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white">
                {standing.wins}-{standing.losses}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">+/-</div>
              <div className={`font-mono font-bold ${
                standing.pointDiff > 0 ? 'text-lime-600 dark:text-lime-400' :
                standing.pointDiff < 0 ? 'text-red-500 dark:text-red-400' :
                'text-slate-600 dark:text-slate-400'
              }`}>
                {standing.pointDiff > 0 ? '+' : ''}{standing.pointDiff}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Games</div>
              <div className="font-mono text-slate-600 dark:text-slate-400">
                {standing.matchesPlayed}/{standing.matchesPlayed + standing.matchesRemaining}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface NotificationBannerProps {
  notification: RoundRobinNotification
  onDismiss?: () => void
}

function NotificationBanner({ notification, onDismiss }: NotificationBannerProps) {
  const typeStyles: Record<string, { bg: string; icon: string }> = {
    match_starting: { bg: 'bg-lime-500', icon: '🎯' },
    advancement: { bg: 'bg-sky-500', icon: '🏆' },
    pool_complete: { bg: 'bg-violet-500', icon: '✓' },
    tiebreaker: { bg: 'bg-amber-500', icon: '⚖️' },
    playoffs_starting: { bg: 'bg-lime-600', icon: '🔥' },
  }

  const style = typeStyles[notification.type] || typeStyles.match_starting

  return (
    <div className={`${style.bg} text-white rounded-xl p-4 shadow-lg flex items-center gap-3`}>
      <span className="text-2xl">{style.icon}</span>
      <p className="flex-1 font-medium">{notification.message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

interface AdvancementScenariosProps {
  scenarios: string[]
}

function AdvancementScenarios({ scenarios }: AdvancementScenariosProps) {
  if (scenarios.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 className="font-semibold text-slate-900 dark:text-white">What You Need</h3>
      </div>
      <ul className="space-y-2">
        {scenarios.map((scenario, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center font-medium">
              {idx + 1}
            </span>
            {scenario}
          </li>
        ))}
      </ul>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export interface RoundRobinPlayerScheduleProps {
  /** Player's schedule view data */
  scheduleView: PlayerScheduleView
  /** Player's pool with standings */
  pool: RoundRobinPool
  /** Pool color for visual treatment */
  poolColor?: PoolColor
  /** Active notifications for the player */
  notifications?: RoundRobinNotification[]
  /** Event name */
  eventName?: string

  // Callbacks
  /** Called when player views a match */
  onViewMatch?: (roundNumber: number) => void
  /** Called when player views their pool standings */
  onViewPool?: () => void
  /** Called when player views the playoff bracket preview */
  onViewPlayoffBracket?: () => void
  /** Called when notification is dismissed */
  onDismissNotification?: (notificationId: string) => void
}

export function RoundRobinPlayerSchedule({
  scheduleView,
  pool,
  poolColor = 'lime',
  notifications = [],
  eventName = 'Round Robin',
  onViewMatch,
  onViewPool,
  onViewPlayoffBracket,
  onDismissNotification,
}: RoundRobinPlayerScheduleProps) {
  // Find the next upcoming or in-progress match
  const nextMatchIndex = scheduleView.schedule.findIndex(
    e => e.status === 'in_progress' || e.status === 'upcoming'
  )

  // Get current standing
  const currentStanding = pool.standings.find(s => s.teamId === scheduleView.teamId)

  // Filter to unread notifications
  const activeNotifications = notifications.filter(n => !n.read && (n.forUserId === null || n.forUserId === scheduleView.playerId))

  // Calculate record
  const wins = scheduleView.schedule.filter(e => e.result === 'W').length
  const losses = scheduleView.schedule.filter(e => e.result === 'L').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="py-6">
            {/* Back / Title */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={onViewPool}
                className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  My Schedule
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {eventName}
                </p>
              </div>
            </div>

            {/* Team Info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {scheduleView.teamName}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {scheduleView.poolName}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                    {wins}-{losses}
                  </span>
                </div>
              </div>

              <button
                onClick={onViewPlayoffBracket}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <span className="hidden sm:inline">Playoffs</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Notifications */}
        {activeNotifications.length > 0 && (
          <div className="space-y-3">
            {activeNotifications.map(notification => (
              <NotificationBanner
                key={notification.id}
                notification={notification}
                onDismiss={() => onDismissNotification?.(notification.id)}
              />
            ))}
          </div>
        )}

        {/* Standing Card */}
        <StandingCard
          rank={scheduleView.currentRank}
          advances={scheduleView.advances}
          poolName={scheduleView.poolName}
          poolColor={poolColor}
          standing={currentStanding}
        />

        {/* Advancement Scenarios */}
        <AdvancementScenarios scenarios={scheduleView.advancementScenarios} />

        {/* Schedule */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Match Schedule</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {scheduleView.schedule.filter(e => e.status === 'completed').length} of {scheduleView.schedule.length} completed
            </span>
          </div>

          <div className="space-y-3">
            {scheduleView.schedule.map((entry, idx) => (
              <ScheduleRow
                key={entry.roundNumber}
                entry={entry}
                isNext={idx === nextMatchIndex}
                onViewMatch={() => onViewMatch?.(entry.roundNumber)}
              />
            ))}
          </div>
        </div>

        {/* Pool Standings Link */}
        <button
          onClick={onViewPool}
          className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          View Full Pool Standings
        </button>
      </div>
    </div>
  )
}

export default RoundRobinPlayerSchedule
