import { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  Trophy,
  X,
  Users,
  User,
  MapPin,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  File,
} from 'lucide-react'
import type {
  MatchHistoryEntry,
  PlayerReference,
} from '@/../product/sections/stats-and-leaderboards/types'

// =============================================================================
// Props
// =============================================================================

export interface MatchHistoryProps {
  matches: MatchHistoryEntry[]
  onViewMatch?: (matchId: string) => void
  onViewEvent?: (eventId: string) => void
  onViewPlayer?: (playerId: string) => void
  onExportHistory?: (
    format: 'excel' | 'pdf' | 'csv',
    startDate?: string,
    endDate?: string
  ) => void
}

// =============================================================================
// Sub-Components
// =============================================================================

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        active
          ? 'bg-lime-500 text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  )
}

function FormatBadge({ format }: { format: 'doubles' | 'singles' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        format === 'doubles'
          ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400'
          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      }`}
    >
      {format === 'doubles' ? (
        <Users className="w-3 h-3" />
      ) : (
        <User className="w-3 h-3" />
      )}
      {format === 'doubles' ? 'Doubles' : 'Singles'}
    </span>
  )
}

function ResultBadge({ result }: { result: 'win' | 'loss' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
        result === 'win'
          ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400'
          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      }`}
    >
      {result === 'win' ? (
        <Trophy className="w-3 h-3" />
      ) : (
        <X className="w-3 h-3" />
      )}
      {result === 'win' ? 'WIN' : 'LOSS'}
    </span>
  )
}

function ScoreDisplay({ scores }: { scores: { us: number; them: number }[] }) {
  return (
    <div className="flex items-center gap-2">
      {scores.map((score, index) => (
        <div
          key={index}
          className={`px-2 py-1 rounded text-sm font-mono font-bold ${
            score.us > score.them
              ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}
        >
          {score.us}-{score.them}
        </div>
      ))}
    </div>
  )
}

function PlayerChip({
  player,
  onClick,
  variant = 'default',
}: {
  player: PlayerReference
  onClick?: () => void
  variant?: 'default' | 'partner' | 'opponent'
}) {
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const variantClasses = {
    default: 'bg-slate-100 dark:bg-slate-800',
    partner: 'bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800',
    opponent: 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700',
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 ${variantClasses[variant]}`}
    >
      {player.avatarUrl ? (
        <img
          src={player.avatarUrl}
          alt={player.name}
          className="w-4 h-4 rounded-full object-cover"
        />
      ) : (
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-sky-400 to-lime-400 flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">{initials[0]}</span>
        </div>
      )}
      <span className="text-slate-700 dark:text-slate-300 font-medium">
        {player.name.split(' ')[0]}
      </span>
    </button>
  )
}

function MatchCard({
  match,
  onViewMatch,
  onViewEvent,
  onViewPlayer,
}: {
  match: MatchHistoryEntry
  onViewMatch?: () => void
  onViewEvent?: () => void
  onViewPlayer?: (playerId: string) => void
}) {
  const matchDate = new Date(match.date)
  const isToday = new Date().toDateString() === matchDate.toDateString()
  const isYesterday =
    new Date(Date.now() - 86400000).toDateString() === matchDate.toDateString()

  const dateLabel = isToday
    ? 'Today'
    : isYesterday
    ? 'Yesterday'
    : matchDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })

  return (
    <div
      onClick={onViewMatch}
      className={`p-4 rounded-xl bg-white dark:bg-slate-900 border-l-4 ${
        match.result === 'win'
          ? 'border-l-lime-500'
          : 'border-l-red-500'
      } border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewEvent?.()
            }}
            className="text-sm font-semibold text-slate-900 dark:text-white hover:text-lime-600 dark:hover:text-lime-400 transition-colors truncate block text-left"
          >
            {match.eventName}
          </button>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>{dateLabel}</span>
            <span>•</span>
            <MapPin className="w-3 h-3" />
            <span className="truncate">{match.venueName}</span>
          </div>
        </div>
        <ResultBadge result={match.result} />
      </div>

      {/* Score and format */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <ScoreDisplay scores={match.scores} />
        <FormatBadge format={match.format} />
      </div>

      {/* Players */}
      <div className="space-y-2">
        {match.partner && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 dark:text-slate-500 w-16">
              Partner
            </span>
            <PlayerChip
              player={match.partner}
              variant="partner"
              onClick={() => onViewPlayer?.(match.partner!.id)}
            />
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 dark:text-slate-500 w-16">
            {match.opponents.length > 1 ? 'Opponents' : 'Opponent'}
          </span>
          <div className="flex flex-wrap gap-1">
            {match.opponents.map((opponent) => (
              <PlayerChip
                key={opponent.id}
                player={opponent}
                variant="opponent"
                onClick={() => onViewPlayer?.(opponent.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Point differential */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Point Differential
        </span>
        <span
          className={`text-sm font-bold ${
            match.pointDiff > 0
              ? 'text-lime-600 dark:text-lime-400'
              : match.pointDiff < 0
              ? 'text-red-600 dark:text-red-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {match.pointDiff > 0 ? '+' : ''}
          {match.pointDiff}
        </span>
      </div>
    </div>
  )
}

function ExportMenu({
  open,
  onClose,
  onExport,
}: {
  open: boolean
  onClose: () => void
  onExport?: (format: 'excel' | 'pdf' | 'csv') => void
}) {
  if (!open) return null

  const options: { format: 'excel' | 'pdf' | 'csv'; label: string; icon: React.ElementType }[] = [
    { format: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
    { format: 'csv', label: 'CSV (.csv)', icon: File },
    { format: 'pdf', label: 'PDF (.pdf)', icon: FileText },
  ]

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute top-full right-0 mt-1 z-20 w-44 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
        <div className="p-2 border-b border-slate-100 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Export Format
          </p>
        </div>
        {options.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.format}
              onClick={() => {
                onExport?.(option.format)
                onClose()
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Icon className="w-4 h-4 text-slate-400" />
              {option.label}
            </button>
          )
        })}
      </div>
    </>
  )
}

function DateRangeFilter({
  open,
  onClose,
  onApply,
}: {
  open: boolean
  onClose: () => void
  onApply?: (startDate: string, endDate: string) => void
}) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  if (!open) return null

  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'This year', days: 365 },
  ]

  const applyPreset = (days: number) => {
    const end = new Date()
    const start = new Date(Date.now() - days * 86400000)
    onApply?.(start.toISOString().split('T')[0], end.toISOString().split('T')[0])
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute top-full left-0 mt-1 z-20 w-64 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
        <div className="p-3 border-b border-slate-100 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            Date Range
          </p>
        </div>
        <div className="p-3 space-y-2">
          {presets.map((preset) => (
            <button
              key={preset.days}
              onClick={() => applyPreset(preset.days)}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-slate-100 dark:border-slate-700 space-y-3">
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => {
              if (startDate && endDate) {
                onApply?.(startDate, endDate)
                onClose()
              }
            }}
            disabled={!startDate || !endDate}
            className="w-full py-2 text-sm font-medium bg-lime-500 text-white rounded-lg hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        No Matches Found
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
        No matches match your current filters. Try adjusting your filters or play some games!
      </p>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function MatchHistory({
  matches,
  onViewMatch,
  onViewEvent,
  onViewPlayer,
  onExportHistory,
}: MatchHistoryProps) {
  const [formatFilter, setFormatFilter] = useState<'all' | 'doubles' | 'singles'>('all')
  const [resultFilter, setResultFilter] = useState<'all' | 'win' | 'loss'>('all')
  const [showDateFilter, setShowDateFilter] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null)

  // Filter matches
  const filteredMatches = matches.filter((match) => {
    if (formatFilter !== 'all' && match.format !== formatFilter) return false
    if (resultFilter !== 'all' && match.result !== resultFilter) return false
    if (dateRange) {
      const matchDate = new Date(match.date)
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      if (matchDate < start || matchDate > end) return false
    }
    return true
  })

  // Group matches by date
  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const date = match.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(match)
    return groups
  }, {} as Record<string, MatchHistoryEntry[]>)

  const sortedDates = Object.keys(groupedMatches).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  // Stats summary
  const totalMatches = filteredMatches.length
  const wins = filteredMatches.filter((m) => m.result === 'win').length
  const winPct = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-lime-500" />
                Match History
              </h1>
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <ExportMenu
                  open={showExportMenu}
                  onClose={() => setShowExportMenu(false)}
                  onExport={(format) => onExportHistory?.(format)}
                />
              </div>
            </div>

            {/* Summary stats */}
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {totalMatches}
                </span>{' '}
                matches
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-lime-600 dark:text-lime-400">
                  {wins}
                </span>{' '}
                wins
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {winPct}%
                </span>{' '}
                win rate
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {/* Date filter */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    dateRange
                      ? 'bg-lime-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {dateRange ? 'Date Range' : 'All Time'}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <DateRangeFilter
                  open={showDateFilter}
                  onClose={() => setShowDateFilter(false)}
                  onApply={(start, end) => setDateRange({ start, end })}
                />
              </div>

              {dateRange && (
                <button
                  onClick={() => setDateRange(null)}
                  className="flex-shrink-0 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

              {/* Format filters */}
              <FilterChip
                label="All"
                active={formatFilter === 'all'}
                onClick={() => setFormatFilter('all')}
              />
              <FilterChip
                label="Doubles"
                active={formatFilter === 'doubles'}
                onClick={() => setFormatFilter('doubles')}
              />
              <FilterChip
                label="Singles"
                active={formatFilter === 'singles'}
                onClick={() => setFormatFilter('singles')}
              />

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

              {/* Result filters */}
              <FilterChip
                label="Wins"
                active={resultFilter === 'win'}
                onClick={() => setResultFilter(resultFilter === 'win' ? 'all' : 'win')}
              />
              <FilterChip
                label="Losses"
                active={resultFilter === 'loss'}
                onClick={() => setResultFilter(resultFilter === 'loss' ? 'all' : 'loss')}
              />
            </div>
          </div>
        </div>

        {/* Match list */}
        <div className="px-4 py-6">
          {filteredMatches.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {sortedDates.map((date) => {
                const dateObj = new Date(date)
                const isToday = new Date().toDateString() === dateObj.toDateString()
                const isYesterday =
                  new Date(Date.now() - 86400000).toDateString() === dateObj.toDateString()

                const dateLabel = isToday
                  ? 'Today'
                  : isYesterday
                  ? 'Yesterday'
                  : dateObj.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })

                return (
                  <div key={date}>
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                      {dateLabel}
                    </h2>
                    <div className="space-y-3">
                      {groupedMatches[date].map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onViewMatch={() => onViewMatch?.(match.id)}
                          onViewEvent={() => onViewEvent?.(match.eventId)}
                          onViewPlayer={onViewPlayer}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
