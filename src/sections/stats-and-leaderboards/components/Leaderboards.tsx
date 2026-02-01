import { useState, useRef, useEffect } from 'react'
import {
  Trophy,
  Medal,
  Crown,
  Calendar,
  MapPin,
  ChevronDown,
  Target,
  TrendingUp,
  Hash,
  Star,
} from 'lucide-react'
import type {
  EventLeaderboard,
  ClubLeaderboard,
  LeaderboardEntry,
  ClubLeaderboardEntry,
} from '@/../product/sections/stats-and-leaderboards/types'

// =============================================================================
// Props
// =============================================================================

export interface LeaderboardsProps {
  eventLeaderboard: EventLeaderboard | null
  clubLeaderboard: ClubLeaderboard | null
  onViewPlayer?: (playerId: string) => void
  onViewEvent?: (eventId: string) => void
  onViewClub?: (clubId: string) => void
  onChangeClubMetric?: (metric: 'wins' | 'winPercentage' | 'gamesPlayed' | 'rating') => void
  onChangeClubPeriod?: (period: 'week' | 'month' | 'year' | 'allTime') => void
}

// =============================================================================
// Sub-Components
// =============================================================================

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 text-sm font-medium transition-all relative ${
        active
          ? 'text-lime-600 dark:text-lime-400'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-500 dark:bg-lime-400" />
      )}
    </button>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <Crown className="w-4 h-4 text-white" />
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center shadow-lg shadow-slate-400/30">
        <Medal className="w-4 h-4 text-white" />
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-700/30">
        <Medal className="w-4 h-4 text-white" />
      </div>
    )
  }
  return (
    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
      <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
        {rank}
      </span>
    </div>
  )
}

function PlayerAvatar({
  name,
  avatarUrl,
  isCurrentPlayer,
}: {
  name: string
  avatarUrl: string | null
  isCurrentPlayer: boolean
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  if (avatarUrl) {
    return (
      <div className="relative">
        <img
          src={avatarUrl}
          alt={name}
          className={`w-10 h-10 rounded-full object-cover ${
            isCurrentPlayer ? 'ring-2 ring-lime-500 ring-offset-2 dark:ring-offset-slate-900' : ''
          }`}
        />
        {isCurrentPlayer && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-lime-500 flex items-center justify-center">
            <Star className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-lime-400 flex items-center justify-center ${
          isCurrentPlayer ? 'ring-2 ring-lime-500 ring-offset-2 dark:ring-offset-slate-900' : ''
        }`}
      >
        <span className="text-sm font-bold text-white">{initials}</span>
      </div>
      {isCurrentPlayer && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-lime-500 flex items-center justify-center">
          <Star className="w-2.5 h-2.5 text-white fill-white" />
        </div>
      )}
    </div>
  )
}

function EventLeaderboardCard({
  leaderboard,
  onViewPlayer,
  onViewEvent,
}: {
  leaderboard: EventLeaderboard
  onViewPlayer?: (playerId: string) => void
  onViewEvent?: (eventId: string) => void
}) {
  const currentPlayerRef = useRef<HTMLDivElement>(null)
  const currentPlayerEntry = leaderboard.entries.find((e) => e.isCurrentPlayer)

  useEffect(() => {
    // Auto-scroll to current player on mount
    if (currentPlayerRef.current) {
      currentPlayerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Event header */}
      <div
        onClick={() => onViewEvent?.(leaderboard.eventId)}
        className="p-4 rounded-xl bg-gradient-to-r from-lime-500 to-sky-500 cursor-pointer hover:from-lime-600 hover:to-sky-600 transition-colors"
      >
        <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
          <Calendar className="w-4 h-4" />
          {new Date(leaderboard.eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })}
        </div>
        <h3 className="text-lg font-bold text-white">{leaderboard.eventName}</h3>
        <div className="flex items-center gap-2 mt-2 text-white/90 text-sm">
          <Trophy className="w-4 h-4" />
          <span>Ranked by {leaderboard.metric === 'wins' ? 'Wins' : leaderboard.metric === 'winPercentage' ? 'Win %' : 'Point Diff'}</span>
        </div>
      </div>

      {/* Current player summary */}
      {currentPlayerEntry && (
        <div className="p-3 rounded-lg bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span className="text-sm font-medium text-lime-700 dark:text-lime-300">
                Your Position
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                #{currentPlayerEntry.rank}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                of {leaderboard.entries.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard list */}
      <div className="space-y-2">
        {leaderboard.entries.map((entry) => (
          <div
            key={entry.playerId}
            ref={entry.isCurrentPlayer ? currentPlayerRef : null}
            onClick={() => onViewPlayer?.(entry.playerId)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              entry.isCurrentPlayer
                ? 'bg-lime-50 dark:bg-lime-900/30 border-2 border-lime-300 dark:border-lime-700'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-lime-300 dark:hover:border-lime-700'
            }`}
          >
            <RankBadge rank={entry.rank} />
            <PlayerAvatar
              name={entry.playerName}
              avatarUrl={entry.avatarUrl}
              isCurrentPlayer={entry.isCurrentPlayer}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium truncate ${
                  entry.isCurrentPlayer
                    ? 'text-lime-700 dark:text-lime-300'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {entry.playerName}
                {entry.isCurrentPlayer && (
                  <span className="ml-1.5 text-xs text-lime-600 dark:text-lime-400">(You)</span>
                )}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {entry.wins}W - {entry.losses}L
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {entry.wins}
              </p>
              <p
                className={`text-xs font-medium ${
                  entry.pointDiff > 0
                    ? 'text-lime-600 dark:text-lime-400'
                    : entry.pointDiff < 0
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {entry.pointDiff > 0 ? '+' : ''}
                {entry.pointDiff} pts
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricDropdown({
  value,
  onChange,
}: {
  value: 'wins' | 'winPercentage' | 'gamesPlayed' | 'rating'
  onChange?: (metric: 'wins' | 'winPercentage' | 'gamesPlayed' | 'rating') => void
}) {
  const [open, setOpen] = useState(false)

  const options: { value: typeof value; label: string; icon: React.ElementType }[] = [
    { value: 'wins', label: 'Total Wins', icon: Trophy },
    { value: 'winPercentage', label: 'Win %', icon: TrendingUp },
    { value: 'gamesPlayed', label: 'Games Played', icon: Hash },
    { value: 'rating', label: 'Rating', icon: Star },
  ]

  const selected = options.find((o) => o.value === value) || options[0]
  const Icon = selected.icon

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-lime-300 dark:hover:border-lime-700 transition-colors"
      >
        <Icon className="w-4 h-4 text-lime-500" />
        {selected.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 w-40 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
            {options.map((option) => {
              const OptionIcon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange?.(option.value)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                    option.value === value
                      ? 'text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-900/20'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <OptionIcon className="w-4 h-4" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function PeriodTabs({
  value,
  onChange,
}: {
  value: 'week' | 'month' | 'year' | 'allTime'
  onChange?: (period: 'week' | 'month' | 'year' | 'allTime') => void
}) {
  const options: { value: typeof value; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
    { value: 'allTime', label: 'All Time' },
  ]

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange?.(option.value)}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            option.value === value
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function ClubLeaderboardCard({
  leaderboard,
  onViewPlayer,
  onViewClub,
  onChangeMetric,
  onChangePeriod,
}: {
  leaderboard: ClubLeaderboard
  onViewPlayer?: (playerId: string) => void
  onViewClub?: (clubId: string) => void
  onChangeMetric?: (metric: 'wins' | 'winPercentage' | 'gamesPlayed' | 'rating') => void
  onChangePeriod?: (period: 'week' | 'month' | 'year' | 'allTime') => void
}) {
  const currentPlayerRef = useRef<HTMLDivElement>(null)
  const currentPlayerEntry = leaderboard.entries.find((e) => e.isCurrentPlayer)

  useEffect(() => {
    if (currentPlayerRef.current) {
      currentPlayerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const getDisplayValue = (entry: ClubLeaderboardEntry) => {
    switch (leaderboard.metric) {
      case 'wins':
        return entry.wins
      case 'winPercentage':
        return `${entry.winPercentage.toFixed(1)}%`
      case 'gamesPlayed':
        return entry.gamesPlayed
      case 'rating':
        return entry.rating.toFixed(2)
      default:
        return entry.wins
    }
  }

  return (
    <div className="space-y-4">
      {/* Club header */}
      <div
        onClick={() => onViewClub?.(leaderboard.clubId)}
        className="p-4 rounded-xl bg-gradient-to-r from-sky-500 to-lime-500 cursor-pointer hover:from-sky-600 hover:to-lime-600 transition-colors"
      >
        <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
          <MapPin className="w-4 h-4" />
          Club Leaderboard
        </div>
        <h3 className="text-lg font-bold text-white">{leaderboard.clubName}</h3>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <MetricDropdown value={leaderboard.metric} onChange={onChangeMetric} />
        <PeriodTabs value={leaderboard.timePeriod} onChange={onChangePeriod} />
      </div>

      {/* Current player summary */}
      {currentPlayerEntry && (
        <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
                Your Position
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                #{currentPlayerEntry.rank}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                of {leaderboard.entries.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard list */}
      <div className="space-y-2">
        {leaderboard.entries.map((entry) => (
          <div
            key={entry.playerId}
            ref={entry.isCurrentPlayer ? currentPlayerRef : null}
            onClick={() => onViewPlayer?.(entry.playerId)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              entry.isCurrentPlayer
                ? 'bg-sky-50 dark:bg-sky-900/30 border-2 border-sky-300 dark:border-sky-700'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700'
            }`}
          >
            <RankBadge rank={entry.rank} />
            <PlayerAvatar
              name={entry.playerName}
              avatarUrl={entry.avatarUrl}
              isCurrentPlayer={entry.isCurrentPlayer}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium truncate ${
                  entry.isCurrentPlayer
                    ? 'text-sky-700 dark:text-sky-300'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {entry.playerName}
                {entry.isCurrentPlayer && (
                  <span className="ml-1.5 text-xs text-sky-600 dark:text-sky-400">(You)</span>
                )}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{entry.rating.toFixed(1)} rating</span>
                <span>•</span>
                <span>{entry.gamesPlayed} games</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {getDisplayValue(entry)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {entry.wins}W - {entry.losses}L
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState({ type }: { type: 'event' | 'club' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Trophy className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        No {type === 'event' ? 'Event' : 'Club'} Leaderboard
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
        {type === 'event'
          ? "There's no active event leaderboard to display. Join an event to see rankings!"
          : "You're not part of any clubs yet. Join a club to see member rankings!"}
      </p>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function Leaderboards({
  eventLeaderboard,
  clubLeaderboard,
  onViewPlayer,
  onViewEvent,
  onViewClub,
  onChangeClubMetric,
  onChangeClubPeriod,
}: LeaderboardsProps) {
  const [activeTab, setActiveTab] = useState<'event' | 'club'>(
    eventLeaderboard ? 'event' : 'club'
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-lime-500" />
              Leaderboards
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <TabButton
              active={activeTab === 'event'}
              onClick={() => setActiveTab('event')}
            >
              <span className="flex items-center gap-1.5 justify-center">
                <Target className="w-4 h-4" />
                Event
              </span>
            </TabButton>
            <TabButton
              active={activeTab === 'club'}
              onClick={() => setActiveTab('club')}
            >
              <span className="flex items-center gap-1.5 justify-center">
                <MapPin className="w-4 h-4" />
                Club
              </span>
            </TabButton>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {activeTab === 'event' ? (
            eventLeaderboard ? (
              <EventLeaderboardCard
                leaderboard={eventLeaderboard}
                onViewPlayer={onViewPlayer}
                onViewEvent={onViewEvent}
              />
            ) : (
              <EmptyState type="event" />
            )
          ) : clubLeaderboard ? (
            <ClubLeaderboardCard
              leaderboard={clubLeaderboard}
              onViewPlayer={onViewPlayer}
              onViewClub={onViewClub}
              onChangeMetric={onChangeClubMetric}
              onChangePeriod={onChangeClubPeriod}
            />
          ) : (
            <EmptyState type="club" />
          )}
        </div>
      </div>
    </div>
  )
}
