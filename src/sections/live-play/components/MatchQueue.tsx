import { Clock, Users, GripVertical, ChevronRight } from 'lucide-react'
import type { MatchQueueProps } from '@/../product/sections/live-play/types'

// =============================================================================
// Main Component
// =============================================================================

export function MatchQueue({
  queue,
  isGameManager,
  onReorder,
  onViewMatch,
}: MatchQueueProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/30">
              <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Up Next</h3>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {queue.length} {queue.length === 1 ? 'match' : 'matches'} queued
          </span>
        </div>
      </div>

      {/* Queue List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {queue.map((match, idx) => (
          <div
            key={match.id}
            className={`p-4 transition-colors ${
              onViewMatch ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer' : ''
            }`}
            onClick={() => onViewMatch?.(match.id)}
          >
            <div className="flex items-start gap-3">
              {/* Position / Drag Handle */}
              <div className="flex items-center gap-1 pt-0.5">
                {isGameManager && (
                  <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 cursor-grab" />
                )}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === 0
                      ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {idx + 1}
                </span>
              </div>

              {/* Match Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Round {match.round}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ~{formatTime(match.estimatedStartTime)}
                  </span>
                </div>

                {/* Teams */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                      {match.team1.players.map(p => p.name.split(' ')[0]).join(' & ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-5">
                    <span className="text-xs text-slate-400 dark:text-slate-500">vs</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                      {match.team2.players.map(p => p.name.split(' ')[0]).join(' & ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Chevron */}
              {onViewMatch && (
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {queue.length === 0 && (
        <div className="py-8 text-center">
          <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No matches in queue
          </p>
        </div>
      )}
    </div>
  )
}
