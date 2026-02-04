import {
  Users,
  Clock,
  PlayCircle,
  PauseCircle,
  UserMinus,
  ChevronUp,
  ChevronDown,
  Activity,
  Timer,
  AlertCircle,
  CheckCircle2,
  LayoutGrid,
} from 'lucide-react'
import type {
  OpenPlayDashboardProps,
  QueuePlayer,
  OpenPlayCourt,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Helper Functions
// =============================================================================

function formatTime(isoString: string | null): string {
  if (!isoString) return '--:--'
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getRotationRuleLabel(rule: string): string {
  const labels: Record<string, string> = {
    paddle_stack: 'Paddle Stack',
    winners_stay: 'Winners Stay',
    time_based: 'Time-Based',
  }
  return labels[rule] || rule
}

function getSkillBadgeColor(rating: number): string {
  if (rating >= 4.5) return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
  if (rating >= 4.0) return 'bg-sky-500/20 text-sky-400 border-sky-500/30'
  if (rating >= 3.5) return 'bg-lime-500/20 text-lime-400 border-lime-500/30'
  if (rating >= 3.0) return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
}

// =============================================================================
// Sub-Components
// =============================================================================

interface SessionStatsProps {
  totalCheckIns: number
  activePlayerCount: number
  gamesCompleted: number
  queueLength: number
}

function SessionStats({ totalCheckIns, activePlayerCount, gamesCompleted, queueLength }: SessionStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-lime-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-lime-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalCheckIns}</p>
            <p className="text-xs text-slate-400">Total Check-ins</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{activePlayerCount}</p>
            <p className="text-xs text-slate-400">Active Players</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{gamesCompleted}</p>
            <p className="text-xs text-slate-400">Games Completed</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Timer className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{queueLength}</p>
            <p className="text-xs text-slate-400">In Queue</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface QueuePlayerCardProps {
  player: QueuePlayer
  position: number
  isNextUp: boolean
  onRemove?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onView?: () => void
}

function QueuePlayerCard({
  player,
  position,
  isNextUp,
  onRemove,
  onMoveUp,
  onMoveDown,
  onView,
}: QueuePlayerCardProps) {
  return (
    <div
      className={`
        relative flex items-center gap-4 p-4 rounded-xl border transition-all
        ${isNextUp
          ? 'bg-lime-500/10 border-lime-500/30 shadow-[0_0_15px_rgba(132,204,22,0.15)]'
          : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50'
        }
      `}
    >
      {/* Position Badge */}
      <div
        className={`
          w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg
          ${isNextUp
            ? 'bg-lime-500 text-slate-900'
            : 'bg-slate-700/50 text-slate-300'
          }
        `}
      >
        {position}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="font-semibold text-white hover:text-lime-400 transition-colors truncate"
          >
            {player.name}
          </button>
          <span
            className={`
              px-2 py-0.5 text-xs font-medium rounded-full border
              ${getSkillBadgeColor(player.skillRating)}
            `}
          >
            {player.skillRating.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(player.joinedQueueAt)}
          </span>
          <span className="text-slate-600">•</span>
          <span className="capitalize">{player.playPreference.replace('_', ' ')}</span>
          {player.estimatedWaitMinutes > 0 && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">~{player.estimatedWaitMinutes} min wait</span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onMoveUp}
          disabled={position === 1}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Move up in queue"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={onMoveDown}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          aria-label="Move down in queue"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          aria-label="Remove from queue"
        >
          <UserMinus className="w-4 h-4" />
        </button>
      </div>

      {/* Next Up Indicator */}
      {isNextUp && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-lime-500 text-slate-900 text-xs font-bold rounded-full">
          NEXT UP
        </div>
      )}
    </div>
  )
}

interface CourtCardProps {
  court: OpenPlayCourt
  onCallNextGroup?: () => void
  onEndGame?: () => void
}

function CourtCard({ court, onCallNextGroup, onEndGame }: CourtCardProps) {
  const statusConfig = {
    available: {
      bg: 'from-slate-800/50 to-slate-900/50',
      border: 'border-slate-700/50',
      icon: <LayoutGrid className="w-8 h-8 text-slate-500" />,
      label: 'Available',
      labelColor: 'text-slate-400',
    },
    in_progress: {
      bg: 'from-lime-900/20 to-lime-950/20',
      border: 'border-lime-500/40',
      icon: <PlayCircle className="w-8 h-8 text-lime-400" />,
      label: 'In Progress',
      labelColor: 'text-lime-400',
    },
    calling: {
      bg: 'from-amber-900/30 to-amber-950/30',
      border: 'border-amber-500/50',
      icon: <AlertCircle className="w-8 h-8 text-amber-400 animate-pulse" />,
      label: 'Calling Players',
      labelColor: 'text-amber-400',
    },
  }

  const config = statusConfig[court.status]

  return (
    <div
      className={`
        bg-gradient-to-br ${config.bg}
        border ${config.border} rounded-xl p-5
        transition-all duration-300
        ${court.status === 'calling' ? 'shadow-[0_0_20px_rgba(245,158,11,0.2)]' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {config.icon}
          <div>
            <h3 className="text-lg font-semibold text-white">{court.name}</h3>
            <p className={`text-sm ${config.labelColor}`}>{config.label}</p>
          </div>
        </div>
        {court.status === 'in_progress' && court.elapsedMinutes > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-lg">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">{court.elapsedMinutes} min</span>
          </div>
        )}
      </div>

      {/* Players */}
      {court.status === 'in_progress' && court.currentPlayers.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {court.currentPlayers.map((player, idx) => (
              <div
                key={player.id}
                className={`
                  px-3 py-2 rounded-lg text-sm
                  ${idx < 2 ? 'bg-sky-500/10 border border-sky-500/30' : 'bg-amber-500/10 border border-amber-500/30'}
                `}
              >
                <p className="font-medium text-white truncate">{player.name}</p>
                <p className="text-xs text-slate-400">{player.skillRating?.toFixed(1) || '—'}</p>
              </div>
            ))}
          </div>
          {court.currentPlayers.length === 4 && (
            <p className="text-xs text-slate-500 text-center mt-2">
              {court.currentPlayers.slice(0, 2).map(p => p.name.split(' ')[0]).join(' & ')}
              {' vs '}
              {court.currentPlayers.slice(2, 4).map(p => p.name.split(' ')[0]).join(' & ')}
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {court.status === 'available' && (
        <div className="py-6 text-center text-slate-500">
          <p className="text-sm">Ready for next group</p>
        </div>
      )}

      {/* Calling State */}
      {court.status === 'calling' && (
        <div className="py-4 text-center">
          <p className="text-amber-400 font-medium animate-pulse">
            Waiting for players to arrive...
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        {court.status === 'available' && (
          <button
            onClick={onCallNextGroup}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-lime-600 hover:bg-lime-500 text-white font-medium rounded-lg transition-colors"
          >
            <Users className="w-4 h-4" />
            Call Next Group
          </button>
        )}
        {court.status === 'in_progress' && (
          <button
            onClick={onEndGame}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            <PauseCircle className="w-4 h-4" />
            End Game
          </button>
        )}
        {court.status === 'calling' && (
          <button
            onClick={onCallNextGroup}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            Re-call Players
          </button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function OpenPlayDashboard({
  event,
  session,
  onAddPlayerToQueue,
  onRemoveFromQueue,
  onReorderQueue,
  onCallNextGroup,
  onEndGame,
  onEndSession,
  onViewPlayer,
}: OpenPlayDashboardProps) {
  const { queue, courts, config } = session

  // Group queue into "next up" (first 4 for doubles) and waiting
  const playersPerGroup = config.playersPerCourt || 4
  const nextUpPlayers = queue.slice(0, playersPerGroup)
  const waitingPlayers = queue.slice(playersPerGroup)

  // Calculate available courts
  const availableCourts = courts.filter(c => c.status === 'available').length
  const activeCourts = courts.filter(c => c.status === 'in_progress').length

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{event.name}</h1>
              <span className="px-2 py-0.5 bg-lime-500/20 text-lime-400 text-xs font-semibold rounded-full">
                LIVE
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{event.venue.name}</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4" />
                {getRotationRuleLabel(config.rotationRule)}
              </span>
              <span className="text-slate-600">•</span>
              <span>Ends {formatTime(config.sessionEndTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onAddPlayerToQueue?.('')}
              className="px-4 py-2 bg-lime-600 hover:bg-lime-500 text-white font-medium rounded-lg transition-colors"
            >
              Add Player
            </button>
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
        {/* Session Stats */}
        <SessionStats
          totalCheckIns={session.totalCheckIns}
          activePlayerCount={session.activePlayerCount}
          gamesCompleted={session.gamesCompleted}
          queueLength={queue.length}
        />

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Left Column: Paddle Queue */}
          <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Paddle Queue</h2>
                  <p className="text-sm text-slate-400">{queue.length} players waiting</p>
                </div>
              </div>
              {availableCourts > 0 && queue.length >= playersPerGroup && (
                <span className="px-3 py-1 bg-lime-500/20 text-lime-400 text-sm font-medium rounded-full animate-pulse">
                  {availableCourts} court{availableCourts > 1 ? 's' : ''} ready
                </span>
              )}
            </div>

            <div className="p-5 space-y-3 max-h-[600px] overflow-y-auto">
              {/* Next Up Section */}
              {nextUpPlayers.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-lime-400 mb-3">
                    Next Group ({nextUpPlayers.length}/{playersPerGroup})
                  </p>
                  <div className="space-y-2">
                    {nextUpPlayers.map((player, idx) => (
                      <QueuePlayerCard
                        key={player.id}
                        player={player}
                        position={idx + 1}
                        isNextUp={idx < playersPerGroup}
                        onRemove={() => onRemoveFromQueue?.(player.id)}
                        onMoveUp={() => onReorderQueue?.(player.id, idx)}
                        onMoveDown={() => onReorderQueue?.(player.id, idx + 2)}
                        onView={() => onViewPlayer?.(player.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Waiting Section */}
              {waitingPlayers.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    Waiting ({waitingPlayers.length})
                  </p>
                  <div className="space-y-2">
                    {waitingPlayers.map((player, idx) => (
                      <QueuePlayerCard
                        key={player.id}
                        player={player}
                        position={playersPerGroup + idx + 1}
                        isNextUp={false}
                        onRemove={() => onRemoveFromQueue?.(player.id)}
                        onMoveUp={() => onReorderQueue?.(player.id, playersPerGroup + idx)}
                        onMoveDown={() => onReorderQueue?.(player.id, playersPerGroup + idx + 2)}
                        onView={() => onViewPlayer?.(player.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {queue.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-400">No players in queue</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Players will appear here as they check in
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Courts */}
          <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Courts</h2>
                  <p className="text-sm text-slate-400">
                    {activeCourts} active, {availableCourts} available
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
              {courts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  onCallNextGroup={() => onCallNextGroup?.(court.id)}
                  onEndGame={() => onEndGame?.(court.id)}
                />
              ))}

              {/* No Courts State */}
              {courts.length === 0 && (
                <div className="py-12 text-center">
                  <LayoutGrid className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-400">No courts configured</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">Quick Actions:</span>
              <button className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors">
                Shuffle Queue
              </button>
              <button className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors">
                Balance by Skill
              </button>
              <button className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors">
                Announce Next
              </button>
            </div>
            <div className="text-sm text-slate-500">
              Session started {formatTime(session.startedAt)}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
