import { useState } from 'react'
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react'
import type { Pool, PoolStanding, PoolAdvancementRules } from '@/../product/sections/live-play/types'

// =============================================================================
// Types
// =============================================================================

interface PoolStandingsProps {
  pool: Pool
  currentUserId?: string
  advancementRules?: PoolAdvancementRules
  onViewPlayer?: (playerId: string) => void
  onViewMatch?: (matchId: string) => void
}

interface PoolPlayViewProps {
  pools: Pool[]
  advancementRules: PoolAdvancementRules
  currentUserId?: string
  onViewPlayer?: (playerId: string) => void
  onViewMatch?: (matchId: string) => void
}

// =============================================================================
// Helper Functions
// =============================================================================

function getPointDiffDisplay(diff: number): { text: string; color: string; icon: typeof TrendingUp | null } {
  if (diff > 0) {
    return { text: `+${diff}`, color: 'text-lime-400', icon: TrendingUp }
  } else if (diff < 0) {
    return { text: `${diff}`, color: 'text-red-400', icon: TrendingDown }
  }
  return { text: '0', color: 'text-slate-400', icon: Minus }
}

function getStatusBadge(status: Pool['status']) {
  switch (status) {
    case 'upcoming':
      return {
        label: 'Not Started',
        bg: 'bg-slate-500/20',
        text: 'text-slate-400',
        icon: Clock,
      }
    case 'in_progress':
      return {
        label: 'In Progress',
        bg: 'bg-amber-500/20',
        text: 'text-amber-400',
        icon: null,
      }
    case 'completed':
      return {
        label: 'Complete',
        bg: 'bg-lime-500/20',
        text: 'text-lime-400',
        icon: CheckCircle2,
      }
  }
}

// =============================================================================
// Sub-Components
// =============================================================================

interface StandingRowProps {
  standing: PoolStanding
  rank: number
  isCurrentUser: boolean
  teamsAdvancing: number
  poolCompleted: boolean
  onViewPlayer?: () => void
}

function StandingRow({
  standing,
  rank,
  isCurrentUser,
  teamsAdvancing,
  poolCompleted,
  onViewPlayer,
}: StandingRowProps) {
  const pointDiff = getPointDiffDisplay(standing.pointDiff)
  const DiffIcon = pointDiff.icon
  const isAdvancing = rank <= teamsAdvancing
  const winRate = standing.wins + standing.losses > 0
    ? Math.round((standing.wins / (standing.wins + standing.losses)) * 100)
    : 0

  return (
    <tr
      className={`
        border-b border-slate-700/50 last:border-b-0
        transition-colors cursor-pointer hover:bg-slate-800/50
        ${isCurrentUser ? 'bg-lime-500/10' : ''}
      `}
      onClick={onViewPlayer}
    >
      {/* Rank */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className={`
            w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm
            ${rank === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900' :
              rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
              isAdvancing ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30' :
              'bg-slate-700/50 text-slate-400'}
          `}>
            {rank}
          </span>
        </div>
      </td>

      {/* Team */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div>
            <p className={`font-semibold ${isCurrentUser ? 'text-lime-400' : 'text-white'}`}>
              {standing.displayName}
            </p>
            {isCurrentUser && (
              <span className="text-xs text-lime-400/70">You</span>
            )}
          </div>
        </div>
      </td>

      {/* Record */}
      <td className="py-4 px-4 text-center">
        <span className="font-semibold text-white">{standing.wins}</span>
        <span className="text-slate-500 mx-1">-</span>
        <span className="font-semibold text-white">{standing.losses}</span>
      </td>

      {/* Win % */}
      <td className="py-4 px-4 text-center hidden sm:table-cell">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                winRate >= 75 ? 'bg-lime-500' :
                winRate >= 50 ? 'bg-sky-500' :
                winRate >= 25 ? 'bg-amber-500' :
                'bg-red-500'
              }`}
              style={{ width: `${winRate}%` }}
            />
          </div>
          <span className="text-sm text-slate-400 w-10 text-right">{winRate}%</span>
        </div>
      </td>

      {/* Point Diff */}
      <td className="py-4 px-4 text-center hidden md:table-cell">
        <div className={`flex items-center justify-center gap-1 ${pointDiff.color}`}>
          {DiffIcon && <DiffIcon className="w-4 h-4" />}
          <span className="font-medium tabular-nums">{pointDiff.text}</span>
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4 text-right">
        {poolCompleted ? (
          isAdvancing ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-500/20 text-lime-400 text-xs font-semibold rounded-full">
              <ArrowRight className="w-3 h-3" />
              Advances
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-700/50 text-slate-400 text-xs font-semibold rounded-full">
              Eliminated
            </span>
          )
        ) : (
          isAdvancing && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-500/10 text-lime-400/70 text-xs font-medium rounded-full border border-lime-500/20">
              Advancing
            </span>
          )
        )}
      </td>
    </tr>
  )
}

// =============================================================================
// Pool Card Component
// =============================================================================

function PoolCard({
  pool,
  currentUserId,
  advancementRules,
  onViewPlayer,
}: PoolStandingsProps) {
  const statusBadge = getStatusBadge(pool.status)
  const StatusIcon = statusBadge.icon
  const teamsAdvancing = advancementRules?.teamsAdvancing ?? 2

  // Sort standings by rank
  const sortedStandings = [...pool.standings].sort((a, b) => a.rank - b.rank)

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Pool Header */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <span className="text-white font-bold">{pool.name.split(' ')[1] || pool.name[0]}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{pool.name}</h3>
              <p className="text-sm text-slate-400">
                {pool.teams.length} teams · Top {teamsAdvancing} advance
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
            {StatusIcon && <StatusIcon className="w-3 h-3" />}
            {statusBadge.label}
          </span>
        </div>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 text-left font-medium">#</th>
              <th className="py-3 px-4 text-left font-medium">Team</th>
              <th className="py-3 px-4 text-center font-medium">W-L</th>
              <th className="py-3 px-4 text-center font-medium hidden sm:table-cell">Win %</th>
              <th className="py-3 px-4 text-center font-medium hidden md:table-cell">Diff</th>
              <th className="py-3 px-4 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedStandings.map((standing, index) => (
              <StandingRow
                key={standing.teamId}
                standing={standing}
                rank={index + 1}
                isCurrentUser={standing.teamId.includes(currentUserId ?? '')}
                teamsAdvancing={teamsAdvancing}
                poolCompleted={pool.status === 'completed'}
                onViewPlayer={() => onViewPlayer?.(standing.teamId)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Advancement Line Indicator */}
      {pool.status !== 'completed' && teamsAdvancing < pool.standings.length && (
        <div className="px-6 py-3 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="flex-1 h-px bg-gradient-to-r from-lime-500/50 via-lime-500/20 to-transparent" />
            <span>Advancement Line</span>
            <div className="flex-1 h-px bg-gradient-to-l from-lime-500/50 via-lime-500/20 to-transparent" />
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component - Full Pool Play View
// =============================================================================

export function PoolPlayView({
  pools,
  advancementRules,
  currentUserId,
  onViewPlayer,
  onViewMatch,
}: PoolPlayViewProps) {
  const [selectedPool, setSelectedPool] = useState<string | null>(null)

  // Calculate overall progress
  const completedPools = pools.filter(p => p.status === 'completed').length
  const inProgressPools = pools.filter(p => p.status === 'in_progress').length
  const allPoolsComplete = completedPools === pools.length

  // Find current user's pool
  const currentUserPool = pools.find(pool =>
    pool.standings.some(s => s.teamId.includes(currentUserId ?? ''))
  )

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800/50 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Trophy className="w-6 h-6 text-sky-400" />
                Pool Play Standings
              </h1>
              <p className="text-slate-400 mt-1">
                {pools.length} pools · Top {advancementRules.teamsAdvancing} from each pool advance
              </p>
            </div>

            {/* Progress Summary */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl">
                <div className="flex gap-1">
                  {pools.map(pool => (
                    <div
                      key={pool.id}
                      className={`w-3 h-3 rounded-full ${
                        pool.status === 'completed' ? 'bg-lime-500' :
                        pool.status === 'in_progress' ? 'bg-amber-500 animate-pulse' :
                        'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-300 ml-2">
                  {completedPools}/{pools.length} Complete
                </span>
              </div>
            </div>
          </div>

          {/* Tiebreaker Rules */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-slate-500">Tiebreakers:</span>
            {advancementRules.tiebreakers.map((tb, i) => (
              <span key={tb} className="text-xs text-slate-400">
                {i + 1}. {tb.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                {i < advancementRules.tiebreakers.length - 1 && ' →'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Your Position Alert (if in pool play) */}
      {currentUserPool && (
        <div className="bg-gradient-to-r from-lime-500/10 to-sky-500/10 border-b border-lime-500/20 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-lime-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-lime-400" />
              </div>
              <div>
                <p className="text-sm text-lime-400 font-medium">Your Position in {currentUserPool.name}</p>
                {(() => {
                  const standing = currentUserPool.standings.find(s => s.teamId.includes(currentUserId ?? ''))
                  if (!standing) return null
                  const isAdvancing = standing.rank <= advancementRules.teamsAdvancing
                  return (
                    <p className="text-white">
                      <span className="font-bold">#{standing.rank}</span>
                      <span className="text-slate-400 mx-2">·</span>
                      <span className="text-slate-300">{standing.wins}W-{standing.losses}L</span>
                      <span className="text-slate-400 mx-2">·</span>
                      <span className={isAdvancing ? 'text-lime-400' : 'text-amber-400'}>
                        {isAdvancing ? 'Currently advancing' : 'Need to move up'}
                      </span>
                    </p>
                  )
                })()}
              </div>
            </div>
            <button
              onClick={() => setSelectedPool(currentUserPool.id)}
              className="px-4 py-2 bg-lime-500/20 text-lime-400 rounded-lg text-sm font-medium hover:bg-lime-500/30 transition-colors flex items-center gap-2"
            >
              View Pool
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Pools Grid */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-2">
            {pools.map(pool => (
              <PoolCard
                key={pool.id}
                pool={pool}
                currentUserId={currentUserId}
                advancementRules={advancementRules}
                onViewPlayer={onViewPlayer}
                onViewMatch={onViewMatch}
              />
            ))}
          </div>

          {/* Bracket Preview (when all pools complete) */}
          {allPoolsComplete && (
            <div className="mt-8 p-6 bg-gradient-to-r from-lime-500/10 to-sky-500/10 border border-lime-500/30 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-lime-500/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-lime-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Pool Play Complete!</h3>
                    <p className="text-slate-400">
                      {pools.length * advancementRules.teamsAdvancing} teams advancing to bracket play
                    </p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-lime-500 text-slate-900 rounded-xl font-semibold hover:bg-lime-400 transition-colors flex items-center gap-2">
                  View Bracket
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Also export the single pool component for flexibility
export { PoolCard as PoolStandings }
