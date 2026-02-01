import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Target,
  Flame,
  Activity,
  Users,
  Calendar,
  ChevronRight,
  Award,
} from 'lucide-react'
import type {
  CurrentPlayer,
  PlayerStats,
  RatingHistoryPoint,
  PartnerRecord,
  ActivityDay,
} from '@/../product/sections/stats-and-leaderboards/types'

// =============================================================================
// Props
// =============================================================================

export interface StatsDashboardProps {
  currentPlayer: CurrentPlayer
  playerStats: PlayerStats
  ratingHistory: RatingHistoryPoint[]
  partnerRecords: PartnerRecord[]
  activityCalendar: ActivityDay[]
  onViewPartners?: () => void
  onViewOpponents?: () => void
  onViewHistory?: () => void
}

// =============================================================================
// Sub-Components
// =============================================================================

function PlayerHeader({
  player,
  stats,
}: {
  player: CurrentPlayer
  stats: PlayerStats
}) {
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-4 mb-6">
      {player.avatarUrl ? (
        <img
          src={player.avatarUrl}
          alt={player.name}
          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-lime-200 dark:ring-lime-800"
        />
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 to-sky-500 flex items-center justify-center ring-2 ring-lime-200 dark:ring-lime-800">
          <span className="text-xl font-bold text-white">{initials}</span>
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          {player.name}
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Rating
            </span>
            <span className="text-sm font-semibold text-lime-600 dark:text-lime-400">
              {player.skillRating.toFixed(1)}
            </span>
          </div>
          {player.duprRating && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                DUPR
              </span>
              <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                {player.duprRating.toFixed(2)}
              </span>
            </div>
          )}
          <TrendIndicator trend={stats.trend} />
        </div>
      </div>
    </div>
  )
}

function TrendIndicator({ trend }: { trend: 'improving' | 'declining' | 'stable' }) {
  if (trend === 'improving') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400">
        <TrendingUp className="w-3 h-3" />
        Improving
      </span>
    )
  }
  if (trend === 'declining') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400">
        <TrendingDown className="w-3 h-3" />
        Declining
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
      <Minus className="w-3 h-3" />
      Stable
    </span>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color = 'slate',
}: {
  icon: React.ElementType
  label: string
  value: string | number
  subValue?: string
  color?: 'lime' | 'sky' | 'slate' | 'amber'
}) {
  const colorClasses = {
    lime: 'bg-lime-50 dark:bg-lime-900/20 text-lime-600 dark:text-lime-400',
    sky: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function WinLossBar({ wins, losses }: { wins: number; losses: number }) {
  const total = wins + losses
  const winPct = total > 0 ? (wins / total) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-lime-600 dark:text-lime-400 font-medium">
          {wins} W
        </span>
        <span className="text-slate-400 dark:text-slate-500">
          {total} games
        </span>
        <span className="text-red-500 dark:text-red-400 font-medium">
          {losses} L
        </span>
      </div>
      <div className="h-3 rounded-full bg-red-200 dark:bg-red-900/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-lime-500 dark:bg-lime-400 transition-all"
          style={{ width: `${winPct}%` }}
        />
      </div>
    </div>
  )
}

function StreakCard({
  currentWinStreak,
  currentLossStreak,
  longestWinStreak,
  longestLossStreak,
}: {
  currentWinStreak: number
  currentLossStreak: number
  longestWinStreak: number
  longestLossStreak: number
}) {
  const isOnWinStreak = currentWinStreak > 0
  const isOnLossStreak = currentLossStreak > 0

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-slate-900 dark:text-white">Streaks</h3>
      </div>

      <div className="space-y-3">
        {/* Current streak */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Current
          </span>
          {isOnWinStreak ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 text-sm font-medium">
              <Flame className="w-3.5 h-3.5" />
              {currentWinStreak} Win{currentWinStreak > 1 ? 's' : ''}
            </span>
          ) : isOnLossStreak ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
              {currentLossStreak} Loss{currentLossStreak > 1 ? 'es' : ''}
            </span>
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              No streak
            </span>
          )}
        </div>

        {/* Best win streak */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Best Win Streak
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {longestWinStreak} games
          </span>
        </div>

        {/* Worst loss streak */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Worst Loss Streak
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {longestLossStreak} games
          </span>
        </div>
      </div>
    </div>
  )
}

function RatingTrendChart({
  history,
  timeRange,
  onChangeTimeRange,
}: {
  history: RatingHistoryPoint[]
  timeRange: '3m' | '6m' | '1y' | 'all'
  onChangeTimeRange: (range: '3m' | '6m' | '1y' | 'all') => void
}) {
  // Filter data based on time range
  const now = new Date()
  const filteredHistory = history.filter((point) => {
    const date = new Date(point.date)
    switch (timeRange) {
      case '3m':
        return date >= new Date(now.getFullYear(), now.getMonth() - 3, 1)
      case '6m':
        return date >= new Date(now.getFullYear(), now.getMonth() - 6, 1)
      case '1y':
        return date >= new Date(now.getFullYear() - 1, now.getMonth(), 1)
      default:
        return true
    }
  })

  // Calculate chart dimensions
  const minRating = Math.min(...filteredHistory.map((p) => p.rating)) - 0.1
  const maxRating = Math.max(...filteredHistory.map((p) => p.rating)) + 0.1
  const range = maxRating - minRating

  // Generate SVG path for the rating line
  const chartWidth = 280
  const chartHeight = 100
  const points = filteredHistory.map((point, i) => {
    const x = (i / (filteredHistory.length - 1)) * chartWidth
    const y = chartHeight - ((point.rating - minRating) / range) * chartHeight
    return `${x},${y}`
  })
  const linePath = `M${points.join(' L')}`

  // Generate area path (for gradient fill)
  const areaPath = `${linePath} L${chartWidth},${chartHeight} L0,${chartHeight} Z`

  const timeRangeOptions: { value: '3m' | '6m' | '1y' | 'all'; label: string }[] = [
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: '1y', label: '1Y' },
    { value: 'all', label: 'All' },
  ]

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-lime-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Rating Trend
          </h3>
        </div>
        <div className="flex gap-1">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onChangeTimeRange(option.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                timeRange === option.value
                  ? 'bg-lime-500 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating values */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">
          {filteredHistory[filteredHistory.length - 1]?.rating.toFixed(2)}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          from {filteredHistory[0]?.rating.toFixed(2)}
        </span>
        {filteredHistory.length > 1 && (
          <span
            className={`text-sm font-medium ${
              filteredHistory[filteredHistory.length - 1].rating >
              filteredHistory[0].rating
                ? 'text-lime-600 dark:text-lime-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {filteredHistory[filteredHistory.length - 1].rating >
            filteredHistory[0].rating
              ? '+'
              : ''}
            {(
              filteredHistory[filteredHistory.length - 1].rating -
              filteredHistory[0].rating
            ).toFixed(2)}
          </span>
        )}
      </div>

      {/* SVG Chart */}
      <div className="relative overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-24"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(132, 204, 22)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(132, 204, 22)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={areaPath}
            fill="url(#ratingGradient)"
            className="dark:opacity-50"
          />
          <path
            d={linePath}
            fill="none"
            stroke="rgb(132, 204, 22)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-2 text-xs text-slate-400 dark:text-slate-500">
        <span>
          {new Date(filteredHistory[0]?.date).toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit',
          })}
        </span>
        <span>
          {new Date(
            filteredHistory[filteredHistory.length - 1]?.date
          ).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

function TopPartners({
  partners,
  onViewAll,
}: {
  partners: PartnerRecord[]
  onViewAll?: () => void
}) {
  const topPartners = partners
    .slice()
    .sort((a, b) => b.winPercentage - a.winPercentage)
    .slice(0, 3)

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Best Partners
          </h3>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {topPartners.map((partner, index) => {
          const initials = partner.partnerName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()

          return (
            <div key={partner.partnerId} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 text-sm font-medium text-slate-400 dark:text-slate-500">
                {index === 0 ? (
                  <Trophy className="w-4 h-4 text-amber-500" />
                ) : (
                  index + 1
                )}
              </div>
              {partner.partnerAvatarUrl ? (
                <img
                  src={partner.partnerAvatarUrl}
                  alt={partner.partnerName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-lime-400 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {initials}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {partner.partnerName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {partner.gamesPlayed} games
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-lime-600 dark:text-lime-400">
                  {partner.winPercentage.toFixed(0)}%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {partner.wins}-{partner.losses}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ActivityCalendarMini({
  activityData,
  onViewHistory,
}: {
  activityData: ActivityDay[]
  onViewHistory?: () => void
}) {
  // Get last 4 weeks of data (28 days)
  const recentActivity = activityData.slice(0, 28)

  // Group by week (7 columns)
  const maxGames = Math.max(...recentActivity.map((d) => d.gamesPlayed), 1)

  const getIntensityClass = (games: number) => {
    if (games === 0) return 'bg-slate-100 dark:bg-slate-800'
    const intensity = games / maxGames
    if (intensity > 0.75) return 'bg-lime-600 dark:bg-lime-500'
    if (intensity > 0.5) return 'bg-lime-500 dark:bg-lime-600'
    if (intensity > 0.25) return 'bg-lime-400 dark:bg-lime-700'
    return 'bg-lime-300 dark:bg-lime-800'
  }

  // Calculate stats
  const totalGames = recentActivity.reduce((sum, d) => sum + d.gamesPlayed, 0)
  const daysPlayed = recentActivity.filter((d) => d.gamesPlayed > 0).length

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-lime-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Activity
          </h3>
        </div>
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="text-xs text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-0.5"
          >
            Match history <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Mini calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {recentActivity.map((day, index) => (
          <div
            key={day.date}
            className={`w-full aspect-square rounded-sm ${getIntensityClass(
              day.gamesPlayed
            )}`}
            title={`${day.date}: ${day.gamesPlayed} games`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
            <div className="w-3 h-3 rounded-sm bg-lime-300 dark:bg-lime-800" />
            <div className="w-3 h-3 rounded-sm bg-lime-400 dark:bg-lime-700" />
            <div className="w-3 h-3 rounded-sm bg-lime-500 dark:bg-lime-600" />
            <div className="w-3 h-3 rounded-sm bg-lime-600 dark:bg-lime-500" />
          </div>
          <span>More</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-900 dark:text-white">
            {totalGames}
          </span>{' '}
          games in{' '}
          <span className="font-medium text-slate-900 dark:text-white">
            {daysPlayed}
          </span>{' '}
          days
        </div>
      </div>
    </div>
  )
}

function FormatBreakdown({ stats }: { stats: PlayerStats }) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-sky-500" />
        <h3 className="font-semibold text-slate-900 dark:text-white">
          By Format
        </h3>
      </div>

      <div className="space-y-4">
        {/* Doubles */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Doubles
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {stats.doublesGames} games
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-red-200 dark:bg-red-900/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-lime-500"
                style={{
                  width: `${
                    stats.doublesGames > 0
                      ? (stats.doublesWins / stats.doublesGames) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-12 text-right">
              {stats.doublesGames > 0
                ? ((stats.doublesWins / stats.doublesGames) * 100).toFixed(0)
                : 0}
              %
            </span>
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{stats.doublesWins}W</span>
            <span>{stats.doublesLosses}L</span>
          </div>
        </div>

        {/* Singles */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Singles
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {stats.singlesGames} games
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-red-200 dark:bg-red-900/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-500"
                style={{
                  width: `${
                    stats.singlesGames > 0
                      ? (stats.singlesWins / stats.singlesGames) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-12 text-right">
              {stats.singlesGames > 0
                ? ((stats.singlesWins / stats.singlesGames) * 100).toFixed(0)
                : 0}
              %
            </span>
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{stats.singlesWins}W</span>
            <span>{stats.singlesLosses}L</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function StatsDashboard({
  currentPlayer,
  playerStats,
  ratingHistory,
  partnerRecords,
  activityCalendar,
  onViewPartners,
  onViewOpponents,
  onViewHistory,
}: StatsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('6m')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Player header */}
        <PlayerHeader player={currentPlayer} stats={playerStats} />

        {/* Win/Loss overview */}
        <div className="mb-6 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Overall Record
            </h3>
            <span className="text-2xl font-bold text-lime-600 dark:text-lime-400">
              {playerStats.winPercentage.toFixed(1)}%
            </span>
          </div>
          <WinLossBar wins={playerStats.wins} losses={playerStats.losses} />
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon={Trophy}
            label="Total Wins"
            value={playerStats.wins}
            subValue={`${playerStats.avgPointDifferentialWins.toFixed(1)} avg margin`}
            color="lime"
          />
          <StatCard
            icon={Target}
            label="Total Games"
            value={playerStats.totalGames}
            subValue={`${playerStats.avgGamesPerWeek.toFixed(1)} per week`}
            color="sky"
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={
              playerStats.currentWinStreak > 0
                ? `${playerStats.currentWinStreak}W`
                : playerStats.currentLossStreak > 0
                ? `${playerStats.currentLossStreak}L`
                : 'None'
            }
            subValue={`Best: ${playerStats.longestWinStreak} wins`}
            color="amber"
          />
          <StatCard
            icon={Activity}
            label="Point Diff"
            value={
              playerStats.avgPointDifferential > 0
                ? `+${playerStats.avgPointDifferential.toFixed(1)}`
                : playerStats.avgPointDifferential.toFixed(1)
            }
            subValue="avg per game"
            color="slate"
          />
        </div>

        {/* Rating trend chart */}
        <div className="mb-6">
          <RatingTrendChart
            history={ratingHistory}
            timeRange={timeRange}
            onChangeTimeRange={setTimeRange}
          />
        </div>

        {/* Two column layout for smaller cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <StreakCard
            currentWinStreak={playerStats.currentWinStreak}
            currentLossStreak={playerStats.currentLossStreak}
            longestWinStreak={playerStats.longestWinStreak}
            longestLossStreak={playerStats.longestLossStreak}
          />
          <FormatBreakdown stats={playerStats} />
        </div>

        {/* Top partners */}
        <div className="mb-6">
          <TopPartners partners={partnerRecords} onViewAll={onViewPartners} />
        </div>

        {/* Activity calendar */}
        <ActivityCalendarMini
          activityData={activityCalendar}
          onViewHistory={onViewHistory}
        />
      </div>
    </div>
  )
}
