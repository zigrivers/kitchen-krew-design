import {
  Play,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  Megaphone,
  Wrench,
} from 'lucide-react'
import type { Court, Match, CourtCardProps } from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

function StatusBadge({ status }: { status: Court['status'] }) {
  const statusConfig = {
    available: {
      label: 'Available',
      icon: CheckCircle2,
      bg: 'bg-lime-100 dark:bg-lime-900/30',
      text: 'text-lime-700 dark:text-lime-400',
    },
    calling: {
      label: 'Calling Players',
      icon: Megaphone,
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
    },
    in_progress: {
      label: 'In Progress',
      icon: Play,
      bg: 'bg-sky-100 dark:bg-sky-900/30',
      text: 'text-sky-700 dark:text-sky-400',
    },
    maintenance: {
      label: 'Maintenance',
      icon: Wrench,
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  )
}

function TeamDisplay({
  players,
  score,
  checkedIn,
  isCalling,
  isWinning,
}: {
  players: { name: string; skillRating: number }[]
  score: number
  checkedIn: boolean[]
  isCalling: boolean
  isWinning: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        {players.map((player, idx) => (
          <div key={player.name + idx} className="flex items-center gap-2">
            <span
              className={`text-sm font-medium truncate ${
                isWinning ? 'text-lime-700 dark:text-lime-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {player.name}
            </span>
            {isCalling && (
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  checkedIn[idx]
                    ? 'bg-lime-500'
                    : 'bg-amber-400 animate-pulse'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <span
        className={`text-2xl font-bold tabular-nums ${
          isWinning ? 'text-lime-600 dark:text-lime-400' : 'text-slate-400 dark:text-slate-500'
        }`}
      >
        {score}
      </span>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function CourtCard({
  court,
  match,
  isGameManager,
  onCallMatch,
  onStartMatch,
  onViewMatch,
}: CourtCardProps) {
  const isAvailable = court.status === 'available'
  const isCalling = court.status === 'calling'
  const isInProgress = court.status === 'in_progress'

  // Calculate time since called
  const getCallingTime = () => {
    if (!isCalling || !court.calledAt) return null
    const calledAt = new Date(court.calledAt)
    const now = new Date()
    const diffMs = now.getTime() - calledAt.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    return diffMins > 0 ? `${diffMins}m ago` : 'Just now'
  }

  // Determine which team is winning
  const team1Winning = match ? match.team1.score > match.team2.score : false
  const team2Winning = match ? match.team2.score > match.team1.score : false

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isAvailable
          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          : isCalling
          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
          : isInProgress
          ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/50'
          : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
              isAvailable
                ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400'
                : isCalling
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                : isInProgress
                ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500'
            }`}
          >
            {court.name.replace('Court ', '')}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{court.name}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              {court.attributes.indoor ? 'Indoor' : 'Outdoor'}
              <span>·</span>
              <span className="capitalize">{court.attributes.surface.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={court.status} />
      </div>

      {/* Content */}
      <div className="p-4">
        {isAvailable && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-lime-600 dark:text-lime-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Ready for next match
            </p>
            {isGameManager && onCallMatch && (
              <button
                onClick={onCallMatch}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
              >
                Call Next Match
              </button>
            )}
          </div>
        )}

        {isCalling && match && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Calling players...
                </span>
              </div>
              {getCallingTime() && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {getCallingTime()}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <TeamDisplay
                players={match.team1.players}
                score={match.team1.score}
                checkedIn={match.team1.checkedIn}
                isCalling={true}
                isWinning={false}
              />
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
                <span className="text-xs">vs</span>
                <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
              </div>
              <TeamDisplay
                players={match.team2.players}
                score={match.team2.score}
                checkedIn={match.team2.checkedIn}
                isCalling={true}
                isWinning={false}
              />
            </div>

            {isGameManager && onStartMatch && (
              <button
                onClick={onStartMatch}
                disabled={!match.team1.checkedIn.every(Boolean) || !match.team2.checkedIn.every(Boolean)}
                className="w-full py-2.5 rounded-lg text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Match
              </button>
            )}
          </div>
        )}

        {isInProgress && match && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Round {match.round}</span>
              {match.startedAt && (
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {(() => {
                    const started = new Date(match.startedAt)
                    const now = new Date()
                    const diffMins = Math.floor((now.getTime() - started.getTime()) / 60000)
                    return `${diffMins}:${String(now.getSeconds()).padStart(2, '0')}`
                  })()}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <TeamDisplay
                players={match.team1.players}
                score={match.team1.score}
                checkedIn={match.team1.checkedIn}
                isCalling={false}
                isWinning={team1Winning}
              />
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
                <span className="text-xs">vs</span>
                <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
              </div>
              <TeamDisplay
                players={match.team2.players}
                score={match.team2.score}
                checkedIn={match.team2.checkedIn}
                isCalling={false}
                isWinning={team2Winning}
              />
            </div>

            {onViewMatch && (
              <button
                onClick={onViewMatch}
                className="w-full py-2.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                View Details
              </button>
            )}
          </div>
        )}

        {court.status === 'maintenance' && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-3">
              <Wrench className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Under maintenance
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
