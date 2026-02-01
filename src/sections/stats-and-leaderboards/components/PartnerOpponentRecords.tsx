import { useState } from 'react'
import {
  Users,
  Swords,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Flame,
  Calendar,
  Star,
} from 'lucide-react'
import type {
  PartnerRecord,
  OpponentRecord,
} from '@/../product/sections/stats-and-leaderboards/types'

// =============================================================================
// Props
// =============================================================================

export interface PartnerOpponentRecordsProps {
  partnerRecords: PartnerRecord[]
  opponentRecords: OpponentRecord[]
  onViewPartner?: (partnerId: string) => void
  onViewOpponent?: (opponentId: string) => void
  onViewHeadToHead?: (playerId: string) => void
}

// =============================================================================
// Sub-Components
// =============================================================================

function TabButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count: number
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
      <span className="flex items-center justify-center gap-2">
        {children}
        <span
          className={`px-1.5 py-0.5 text-xs rounded-full ${
            active
              ? 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {count}
        </span>
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-500 dark:bg-lime-400" />
      )}
    </button>
  )
}

function SortDropdown({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value) || options[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        Sort: {selected.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 z-20 w-40 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                  option.value === value
                    ? 'text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-900/20'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function WinLossBar({
  wins,
  losses,
  size = 'md',
}: {
  wins: number
  losses: number
  size?: 'sm' | 'md'
}) {
  const total = wins + losses
  const winPct = total > 0 ? (wins / total) * 100 : 0
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div className={`w-full ${heightClass} rounded-full bg-red-200 dark:bg-red-900/50 overflow-hidden`}>
      <div
        className={`${heightClass} rounded-full bg-lime-500 dark:bg-lime-400 transition-all`}
        style={{ width: `${winPct}%` }}
      />
    </div>
  )
}

function PlayerAvatar({
  name,
  avatarUrl,
  size = 'md',
}: {
  name: string
  avatarUrl: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-sky-400 to-lime-400 flex items-center justify-center`}
    >
      <span className="font-bold text-white">{initials}</span>
    </div>
  )
}

function PartnerCard({
  partner,
  rank,
  onViewPartner,
  onViewHeadToHead,
}: {
  partner: PartnerRecord
  rank: number
  onViewPartner?: () => void
  onViewHeadToHead?: () => void
}) {
  const isTopPartner = rank <= 3
  const lastPlayed = new Date(partner.lastPlayedDate)
  const daysSince = Math.floor((Date.now() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div
      className={`p-4 rounded-xl bg-white dark:bg-slate-900 border transition-all cursor-pointer hover:shadow-md ${
        isTopPartner
          ? 'border-sky-200 dark:border-sky-800'
          : 'border-slate-200 dark:border-slate-800'
      }`}
      onClick={onViewPartner}
    >
      <div className="flex items-start gap-3">
        {/* Rank */}
        <div className="flex-shrink-0 w-6 text-center">
          {rank === 1 ? (
            <Star className="w-5 h-5 text-amber-500 fill-amber-500 mx-auto" />
          ) : (
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
              {rank}
            </span>
          )}
        </div>

        {/* Avatar */}
        <PlayerAvatar name={partner.partnerName} avatarUrl={partner.partnerAvatarUrl} size="md" />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                {partner.partnerName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span>{partner.partnerRating.toFixed(1)} rating</span>
                <span>•</span>
                <span>{partner.gamesPlayed} games</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className={`text-lg font-bold ${
                  partner.winPercentage >= 60
                    ? 'text-lime-600 dark:text-lime-400'
                    : partner.winPercentage >= 40
                    ? 'text-slate-900 dark:text-white'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {partner.winPercentage.toFixed(0)}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {partner.wins}W - {partner.losses}L
              </p>
            </div>
          </div>

          {/* Win/loss bar */}
          <div className="mt-2">
            <WinLossBar wins={partner.wins} losses={partner.losses} size="sm" />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince}d ago`}
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                partner.avgPointDiff > 0
                  ? 'text-lime-600 dark:text-lime-400'
                  : partner.avgPointDiff < 0
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {partner.avgPointDiff > 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : partner.avgPointDiff < 0 ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : null}
              {partner.avgPointDiff > 0 ? '+' : ''}
              {partner.avgPointDiff.toFixed(1)} avg
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onViewHeadToHead?.()
              }}
              className="flex items-center gap-0.5 text-xs text-lime-600 dark:text-lime-400 hover:underline"
            >
              History <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function OpponentCard({
  opponent,
  rank,
  onViewOpponent,
  onViewHeadToHead,
}: {
  opponent: OpponentRecord
  rank: number
  onViewOpponent?: () => void
  onViewHeadToHead?: () => void
}) {
  const lastPlayed = new Date(opponent.lastPlayedDate)
  const daysSince = Math.floor((Date.now() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24))
  const hasStreak = opponent.currentStreak.count >= 2

  return (
    <div
      className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer hover:shadow-md"
      onClick={onViewOpponent}
    >
      <div className="flex items-start gap-3">
        {/* Rank */}
        <div className="flex-shrink-0 w-6 text-center">
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
            {rank}
          </span>
        </div>

        {/* Avatar */}
        <PlayerAvatar
          name={opponent.opponentName}
          avatarUrl={opponent.opponentAvatarUrl}
          size="md"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                {opponent.opponentName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span>{opponent.opponentRating.toFixed(1)} rating</span>
                <span>•</span>
                <span>{opponent.gamesPlayed} games</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className={`text-lg font-bold ${
                  opponent.winPercentage >= 60
                    ? 'text-lime-600 dark:text-lime-400'
                    : opponent.winPercentage >= 40
                    ? 'text-slate-900 dark:text-white'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {opponent.winPercentage.toFixed(0)}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {opponent.wins}W - {opponent.losses}L
              </p>
            </div>
          </div>

          {/* Win/loss bar */}
          <div className="mt-2">
            <WinLossBar wins={opponent.wins} losses={opponent.losses} size="sm" />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince}d ago`}
            </div>
            {hasStreak && (
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  opponent.currentStreak.type === 'win'
                    ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}
              >
                <Flame className="w-3 h-3" />
                {opponent.currentStreak.count}{' '}
                {opponent.currentStreak.type === 'win' ? 'wins' : 'losses'}
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onViewHeadToHead?.()
              }}
              className="flex items-center gap-0.5 text-xs text-lime-600 dark:text-lime-400 hover:underline"
            >
              H2H <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ type }: { type: 'partners' | 'opponents' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        {type === 'partners' ? (
          <Users className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        ) : (
          <Swords className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        No {type === 'partners' ? 'Partners' : 'Opponents'} Yet
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
        {type === 'partners'
          ? 'Play some doubles games to start building your partner records!'
          : 'Play some games to start tracking your opponent records!'}
      </p>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function PartnerOpponentRecords({
  partnerRecords,
  opponentRecords,
  onViewPartner,
  onViewOpponent,
  onViewHeadToHead,
}: PartnerOpponentRecordsProps) {
  const [activeTab, setActiveTab] = useState<'partners' | 'opponents'>('partners')
  const [partnerSort, setPartnerSort] = useState<'winPercentage' | 'gamesPlayed' | 'lastPlayed'>(
    'winPercentage'
  )
  const [opponentSort, setOpponentSort] = useState<'winPercentage' | 'gamesPlayed' | 'lastPlayed'>(
    'gamesPlayed'
  )

  // Sort partners
  const sortedPartners = [...partnerRecords].sort((a, b) => {
    switch (partnerSort) {
      case 'winPercentage':
        return b.winPercentage - a.winPercentage
      case 'gamesPlayed':
        return b.gamesPlayed - a.gamesPlayed
      case 'lastPlayed':
        return new Date(b.lastPlayedDate).getTime() - new Date(a.lastPlayedDate).getTime()
      default:
        return 0
    }
  })

  // Sort opponents
  const sortedOpponents = [...opponentRecords].sort((a, b) => {
    switch (opponentSort) {
      case 'winPercentage':
        return b.winPercentage - a.winPercentage
      case 'gamesPlayed':
        return b.gamesPlayed - a.gamesPlayed
      case 'lastPlayed':
        return new Date(b.lastPlayedDate).getTime() - new Date(a.lastPlayedDate).getTime()
      default:
        return 0
    }
  })

  const sortOptions = [
    { value: 'winPercentage', label: 'Win %' },
    { value: 'gamesPlayed', label: 'Games' },
    { value: 'lastPlayed', label: 'Recent' },
  ]

  // Summary stats
  const partnerStats = {
    totalGames: partnerRecords.reduce((sum, p) => sum + p.gamesPlayed, 0),
    avgWinPct:
      partnerRecords.length > 0
        ? partnerRecords.reduce((sum, p) => sum + p.winPercentage, 0) / partnerRecords.length
        : 0,
    bestPartner: sortedPartners[0],
  }

  const opponentStats = {
    totalGames: opponentRecords.reduce((sum, o) => sum + o.gamesPlayed, 0),
    avgWinPct:
      opponentRecords.length > 0
        ? opponentRecords.reduce((sum, o) => sum + o.winPercentage, 0) / opponentRecords.length
        : 0,
    nemesis: [...opponentRecords].sort((a, b) => a.winPercentage - b.winPercentage)[0],
    easiest: [...opponentRecords].sort((a, b) => b.winPercentage - a.winPercentage)[0],
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-lime-500" />
              Records
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <TabButton
              active={activeTab === 'partners'}
              onClick={() => setActiveTab('partners')}
              count={partnerRecords.length}
            >
              <Users className="w-4 h-4" />
              Partners
            </TabButton>
            <TabButton
              active={activeTab === 'opponents'}
              onClick={() => setActiveTab('opponents')}
              count={opponentRecords.length}
            >
              <Swords className="w-4 h-4" />
              Opponents
            </TabButton>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {activeTab === 'partners' ? (
            partnerRecords.length === 0 ? (
              <EmptyState type="partners" />
            ) : (
              <>
                {/* Partner summary */}
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-sky-500 to-lime-500">
                  <p className="text-sm text-white/80 mb-1">Best Partner</p>
                  <div className="flex items-center gap-3">
                    <PlayerAvatar
                      name={partnerStats.bestPartner?.partnerName || ''}
                      avatarUrl={partnerStats.bestPartner?.partnerAvatarUrl || null}
                      size="lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">
                        {partnerStats.bestPartner?.partnerName}
                      </h3>
                      <p className="text-sm text-white/90">
                        {partnerStats.bestPartner?.winPercentage.toFixed(0)}% win rate •{' '}
                        {partnerStats.bestPartner?.gamesPlayed} games
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sort control */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {partnerRecords.length} partner{partnerRecords.length !== 1 ? 's' : ''} •{' '}
                    {partnerStats.totalGames} games
                  </p>
                  <SortDropdown
                    value={partnerSort}
                    onChange={(v) => setPartnerSort(v as typeof partnerSort)}
                    options={sortOptions}
                  />
                </div>

                {/* Partner list */}
                <div className="space-y-3">
                  {sortedPartners.map((partner, index) => (
                    <PartnerCard
                      key={partner.partnerId}
                      partner={partner}
                      rank={index + 1}
                      onViewPartner={() => onViewPartner?.(partner.partnerId)}
                      onViewHeadToHead={() => onViewHeadToHead?.(partner.partnerId)}
                    />
                  ))}
                </div>
              </>
            )
          ) : opponentRecords.length === 0 ? (
            <EmptyState type="opponents" />
          ) : (
            <>
              {/* Opponent summary */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800">
                  <p className="text-xs text-lime-600 dark:text-lime-400 mb-1">Easiest Opponent</p>
                  <div className="flex items-center gap-2">
                    <PlayerAvatar
                      name={opponentStats.easiest?.opponentName || ''}
                      avatarUrl={opponentStats.easiest?.opponentAvatarUrl || null}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {opponentStats.easiest?.opponentName.split(' ')[0]}
                      </p>
                      <p className="text-xs text-lime-600 dark:text-lime-400">
                        {opponentStats.easiest?.winPercentage.toFixed(0)}% win
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">Toughest Opponent</p>
                  <div className="flex items-center gap-2">
                    <PlayerAvatar
                      name={opponentStats.nemesis?.opponentName || ''}
                      avatarUrl={opponentStats.nemesis?.opponentAvatarUrl || null}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {opponentStats.nemesis?.opponentName.split(' ')[0]}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {opponentStats.nemesis?.winPercentage.toFixed(0)}% win
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort control */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {opponentRecords.length} opponent{opponentRecords.length !== 1 ? 's' : ''} •{' '}
                  {opponentStats.totalGames} games
                </p>
                <SortDropdown
                  value={opponentSort}
                  onChange={(v) => setOpponentSort(v as typeof opponentSort)}
                  options={sortOptions}
                />
              </div>

              {/* Opponent list */}
              <div className="space-y-3">
                {sortedOpponents.map((opponent, index) => (
                  <OpponentCard
                    key={opponent.opponentId}
                    opponent={opponent}
                    rank={index + 1}
                    onViewOpponent={() => onViewOpponent?.(opponent.opponentId)}
                    onViewHeadToHead={() => onViewHeadToHead?.(opponent.opponentId)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
