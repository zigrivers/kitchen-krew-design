import { Clock, CheckCircle2, Play, Pause, AlertCircle } from 'lucide-react'
import type { EventProgressBarProps } from '@/../product/sections/live-play/types'

// =============================================================================
// Main Component
// =============================================================================

export function EventProgressBar({ progress, isPaused }: EventProgressBarProps) {
  const percentComplete = Math.round((progress.completedMatches / progress.totalMatches) * 100)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isPaused
          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Pause Banner */}
      {isPaused && (
        <div className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-400">
          <div className="flex items-center gap-2">
            <Pause className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Event Paused</span>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Main Progress */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Round {progress.currentRound} of {progress.totalRounds}
            </span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {percentComplete}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPaused
                ? 'bg-amber-400 dark:bg-amber-500'
                : 'bg-gradient-to-r from-lime-400 to-lime-500'
            }`}
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-500" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {progress.completedMatches}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Done</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Play className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {progress.inProgressMatches}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {progress.remainingMatches}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Left</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {formatTime(progress.estimatedRemainingMinutes)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Est.</p>
          </div>
        </div>

        {/* Time Elapsed */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Time elapsed: {formatTime(progress.elapsedMinutes)}</span>
            <span>
              {progress.totalMatches} total matches
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
