import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { StandingsTableProps } from '@/../product/sections/live-play/types'

// =============================================================================
// Main Component
// =============================================================================

export function StandingsTable({
  standings,
  currentUserId,
  onViewPlayer,
}: StandingsTableProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Standings</h3>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="py-2 px-4 text-left font-medium">#</th>
              <th className="py-2 px-4 text-left font-medium">Player</th>
              <th className="py-2 px-4 text-center font-medium">W</th>
              <th className="py-2 px-4 text-center font-medium">L</th>
              <th className="py-2 px-4 text-center font-medium">+/-</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, idx) => {
              const isCurrentUser = standing.playerId === currentUserId
              const isTopThree = standing.rank <= 3

              return (
                <tr
                  key={standing.playerId}
                  onClick={() => onViewPlayer?.(standing.playerId)}
                  className={`border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors ${
                    isCurrentUser
                      ? 'bg-lime-50 dark:bg-lime-900/20'
                      : onViewPlayer
                      ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'
                      : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        standing.rank === 1
                          ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'
                          : standing.rank === 2
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          : standing.rank === 3
                          ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {standing.rank}
                    </span>
                  </td>

                  {/* Player Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isCurrentUser
                            ? 'text-lime-700 dark:text-lime-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {standing.name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-lime-600 dark:text-lime-500">(You)</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {standing.gamesPlayed} {standing.gamesPlayed === 1 ? 'game' : 'games'}
                    </span>
                  </td>

                  {/* Wins */}
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-semibold text-lime-600 dark:text-lime-400">
                      {standing.wins}
                    </span>
                  </td>

                  {/* Losses */}
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {standing.losses}
                    </span>
                  </td>

                  {/* Point Diff */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-0.5 text-sm font-medium ${
                        standing.pointDiff > 0
                          ? 'text-lime-600 dark:text-lime-400'
                          : standing.pointDiff < 0
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {standing.pointDiff > 0 ? (
                        <>
                          <TrendingUp className="w-3.5 h-3.5" />
                          +{standing.pointDiff}
                        </>
                      ) : standing.pointDiff < 0 ? (
                        <>
                          <TrendingDown className="w-3.5 h-3.5" />
                          {standing.pointDiff}
                        </>
                      ) : (
                        <>
                          <Minus className="w-3.5 h-3.5" />
                          0
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {standings.length === 0 && (
        <div className="py-8 text-center">
          <Trophy className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No standings yet
          </p>
        </div>
      )}
    </div>
  )
}
