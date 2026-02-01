import { useState } from 'react'
import {
  Search,
  X,
  Filter,
  ChevronDown,
  MapPin,
  Star,
  Users,
  UserPlus,
  CheckCircle2,
  Swords,
  Shield,
  Target,
  SlidersHorizontal,
} from 'lucide-react'
import type { Player } from '@/../product/sections/players/types'

// =============================================================================
// Props
// =============================================================================

export interface PlayerSearchProps {
  /** List of players to display/search */
  players: Player[]

  // Actions
  onSearch?: (query: string) => void
  onViewPlayer?: (playerId: string) => void
  onSendFriendRequest?: (playerId: string) => void
  onFilterChange?: (filters: PlayerFilters) => void
}

export interface PlayerFilters {
  skillMin?: number
  skillMax?: number
  location?: string
  playingStyle?: 'aggressive' | 'defensive' | 'all_around' | null
  showFriendsOnly?: boolean
}

// =============================================================================
// Sub-Components
// =============================================================================

function Avatar({
  name,
  avatarUrl,
  size = 'md',
}: {
  name: string
  avatarUrl: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white dark:ring-slate-900`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-lime-400 via-lime-500 to-sky-500 flex items-center justify-center ring-2 ring-white dark:ring-slate-900`}
    >
      <span className="font-semibold text-white">{initials}</span>
    </div>
  )
}

function PlayingStyleIcon({ style }: { style: 'aggressive' | 'defensive' | 'all_around' }) {
  const styles = {
    aggressive: { icon: Swords, color: 'text-red-500', label: 'Aggressive' },
    defensive: { icon: Shield, color: 'text-sky-500', label: 'Defensive' },
    all_around: { icon: Target, color: 'text-lime-500', label: 'All-Around' },
  }

  const { icon: Icon, color, label } = styles[style]

  return (
    <span className={`inline-flex items-center gap-1 ${color}`} title={label}>
      <Icon className="w-3.5 h-3.5" />
    </span>
  )
}

function FilterPill({
  label,
  isActive,
  onRemove,
}: {
  label: string
  isActive: boolean
  onRemove: () => void
}) {
  if (!isActive) return null

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400">
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 rounded-full hover:bg-lime-200 dark:hover:bg-lime-800 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

function PlayerCard({
  player,
  onViewProfile,
  onSendFriendRequest,
}: {
  player: Player
  onViewProfile?: () => void
  onSendFriendRequest?: () => void
}) {
  return (
    <div className="group p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-lime-300 dark:hover:border-lime-700 hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <button onClick={onViewProfile} className="flex-shrink-0">
          <Avatar name={player.name} avatarUrl={player.avatarUrl} size="lg" />
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button onClick={onViewProfile}>
              <h3 className="font-semibold text-slate-900 dark:text-white hover:text-lime-600 dark:hover:text-lime-400 transition-colors truncate">
                {player.name}
              </h3>
            </button>
            {player.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-lime-500 flex-shrink-0" />
            )}
            <PlayingStyleIcon style={player.playingStyle} />
          </div>

          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{player.location}</span>
          </div>

          {/* Skill Ratings */}
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Star className="w-3 h-3 text-amber-500" />
              {player.skillRatings.singles.rating.toFixed(1)} Singles
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Star className="w-3 h-3 text-amber-500" />
              {player.skillRatings.doubles.rating.toFixed(1)} Doubles
            </span>
          </div>

          {/* Bio preview */}
          {player.bio && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {player.bio}
            </p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{player.stats.totalGames} games</span>
            <span>{Math.round(player.stats.winRate * 100)}% win rate</span>
            {player.mutualFriends > 0 && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {player.mutualFriends} mutual
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          {player.isFriend ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Friends
            </span>
          ) : (
            <button
              onClick={onSendFriendRequest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterPanel({
  filters,
  onFilterChange,
  onClose,
}: {
  filters: PlayerFilters
  onFilterChange: (filters: PlayerFilters) => void
  onClose: () => void
}) {
  const [localFilters, setLocalFilters] = useState<PlayerFilters>(filters)

  const handleApply = () => {
    onFilterChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: PlayerFilters = {}
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Filters</h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Skill Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Skill Level Range
          </label>
          <div className="flex items-center gap-2">
            <select
              value={localFilters.skillMin ?? ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, skillMin: e.target.value ? Number(e.target.value) : undefined })
              }
              className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
            >
              <option value="">Min</option>
              {[2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((v) => (
                <option key={v} value={v}>
                  {v.toFixed(1)}
                </option>
              ))}
            </select>
            <span className="text-slate-400">–</span>
            <select
              value={localFilters.skillMax ?? ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, skillMax: e.target.value ? Number(e.target.value) : undefined })
              }
              className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
            >
              <option value="">Max</option>
              {[2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((v) => (
                <option key={v} value={v}>
                  {v.toFixed(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City or area"
            value={localFilters.location ?? ''}
            onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value || undefined })}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400"
          />
        </div>

        {/* Playing Style */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Playing Style
          </label>
          <div className="flex gap-2">
            {[
              { value: 'aggressive', label: 'Aggressive', icon: Swords },
              { value: 'defensive', label: 'Defensive', icon: Shield },
              { value: 'all_around', label: 'All-Around', icon: Target },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() =>
                  setLocalFilters({
                    ...localFilters,
                    playingStyle: localFilters.playingStyle === value ? null : (value as PlayerFilters['playingStyle']),
                  })
                }
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  localFilters.playingStyle === value
                    ? 'bg-lime-500 text-white'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Friends Only */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.showFriendsOnly ?? false}
              onChange={(e) => setLocalFilters({ ...localFilters, showFriendsOnly: e.target.checked || undefined })}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Show friends only</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleReset}
          className="flex-1 py-2 px-4 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function PlayerSearch({
  players,
  onSearch,
  onViewPlayer,
  onSendFriendRequest,
  onFilterChange,
}: PlayerSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<PlayerFilters>({})

  // Filter and search players
  const filteredPlayers = players.filter((player) => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = player.name.toLowerCase().includes(query)
      const matchesLocation = player.location.toLowerCase().includes(query)
      if (!matchesName && !matchesLocation) return false
    }

    // Skill range
    const playerSkill = Math.max(player.skillRatings.singles.rating, player.skillRatings.doubles.rating)
    if (filters.skillMin !== undefined && playerSkill < filters.skillMin) return false
    if (filters.skillMax !== undefined && playerSkill > filters.skillMax) return false

    // Location
    if (filters.location) {
      if (!player.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    }

    // Playing style
    if (filters.playingStyle && player.playingStyle !== filters.playingStyle) return false

    // Friends only
    if (filters.showFriendsOnly && !player.isFriend) return false

    return true
  })

  // Count active filters
  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== null && v !== '').length

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  const handleFilterChange = (newFilters: PlayerFilters) => {
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Find Players</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filteredPlayers.length} players found
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    onSearch?.('')
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
                  activeFilterCount > 0
                    ? 'bg-lime-50 dark:bg-lime-900/20 border-lime-200 dark:border-lime-800 text-lime-700 dark:text-lime-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-lime-500 text-white text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {showFilters && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                  <div className="absolute right-0 top-full mt-2 z-20 w-80">
                    <FilterPanel
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onClose={() => setShowFilters(false)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <FilterPill
                label={`${filters.skillMin?.toFixed(1) ?? '2.0'} - ${filters.skillMax?.toFixed(1) ?? '5.0'}`}
                isActive={filters.skillMin !== undefined || filters.skillMax !== undefined}
                onRemove={() => handleFilterChange({ ...filters, skillMin: undefined, skillMax: undefined })}
              />
              <FilterPill
                label={filters.location ?? ''}
                isActive={!!filters.location}
                onRemove={() => handleFilterChange({ ...filters, location: undefined })}
              />
              <FilterPill
                label={filters.playingStyle?.replace('_', '-') ?? ''}
                isActive={!!filters.playingStyle}
                onRemove={() => handleFilterChange({ ...filters, playingStyle: null })}
              />
              <FilterPill
                label="Friends only"
                isActive={!!filters.showFriendsOnly}
                onRemove={() => handleFilterChange({ ...filters, showFriendsOnly: undefined })}
              />
              <button
                onClick={() => handleFilterChange({})}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredPlayers.length > 0 ? (
          <div className="space-y-4">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onViewProfile={() => onViewPlayer?.(player.id)}
                onSendFriendRequest={() => onSendFriendRequest?.(player.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery || activeFilterCount > 0
                ? 'No players match your search'
                : 'No players to display'}
            </p>
            {(searchQuery || activeFilterCount > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  handleFilterChange({})
                  onSearch?.('')
                }}
                className="mt-3 text-sm text-lime-600 dark:text-lime-400 hover:underline"
              >
                Clear filters and try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
