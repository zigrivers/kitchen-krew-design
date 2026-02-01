import { useState } from 'react'
import {
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  Users,
  Plus,
  Building2,
} from 'lucide-react'
import type { Club, CurrentUser } from '@/../product/sections/clubs-and-venues/types'
import { ClubCard } from './ClubCard'

// =============================================================================
// Props
// =============================================================================

export interface ClubBrowseProps {
  /** Current logged-in user */
  currentUser: CurrentUser
  /** All clubs to display */
  clubs: Club[]

  // Actions
  onSearch?: (query: string) => void
  onViewClub?: (clubId: string) => void
  onJoinClub?: (clubId: string) => void
  onLeaveClub?: (clubId: string) => void
  onCancelRequest?: (clubId: string) => void
  onCreateClub?: () => void
  onFilterChange?: (filters: ClubFilters) => void
}

export interface ClubFilters {
  location?: string
  membershipType?: 'open' | 'closed' | null
  showMyClubsOnly?: boolean
  minMembers?: number
}

// =============================================================================
// Sub-Components
// =============================================================================

function TabButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'text-lime-600 dark:text-lime-400'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <span className="flex items-center gap-1.5">
        {label}
        {count !== undefined && (
          <span
            className={`px-1.5 py-0.5 rounded-full text-xs ${
              active
                ? 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {count}
          </span>
        )}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-500 rounded-full" />
      )}
    </button>
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

function FilterPanel({
  filters,
  onFilterChange,
  onClose,
}: {
  filters: ClubFilters
  onFilterChange: (filters: ClubFilters) => void
  onClose: () => void
}) {
  const [localFilters, setLocalFilters] = useState<ClubFilters>(filters)

  const handleApply = () => {
    onFilterChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: ClubFilters = {}
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
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="City or area"
              value={localFilters.location ?? ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, location: e.target.value || undefined })
              }
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400"
            />
          </div>
        </div>

        {/* Membership Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Membership Type
          </label>
          <div className="flex gap-2">
            {[
              { value: 'open', label: 'Open to All' },
              { value: 'closed', label: 'Invite Only' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() =>
                  setLocalFilters({
                    ...localFilters,
                    membershipType:
                      localFilters.membershipType === value
                        ? null
                        : (value as 'open' | 'closed'),
                  })
                }
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  localFilters.membershipType === value
                    ? 'bg-lime-500 text-white'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Minimum Members */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Minimum Members
          </label>
          <select
            value={localFilters.minMembers ?? ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                minMembers: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
          >
            <option value="">Any size</option>
            <option value="10">10+ members</option>
            <option value="50">50+ members</option>
            <option value="100">100+ members</option>
            <option value="250">250+ members</option>
          </select>
        </div>

        {/* My Clubs Only */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.showMyClubsOnly ?? false}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, showMyClubsOnly: e.target.checked || undefined })
              }
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Show my clubs only</span>
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

function EmptyState({
  hasFilters,
  onClearFilters,
  onCreateClub,
}: {
  hasFilters: boolean
  onClearFilters: () => void
  onCreateClub?: () => void
}) {
  return (
    <div className="py-16 text-center">
      <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
      <p className="text-slate-500 dark:text-slate-400">
        {hasFilters ? 'No clubs match your search' : 'No clubs available yet'}
      </p>
      {hasFilters ? (
        <button
          onClick={onClearFilters}
          className="mt-3 text-sm text-lime-600 dark:text-lime-400 hover:underline"
        >
          Clear filters and try again
        </button>
      ) : onCreateClub ? (
        <button
          onClick={onCreateClub}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create a Club
        </button>
      ) : null}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ClubBrowse({
  currentUser,
  clubs,
  onSearch,
  onViewClub,
  onJoinClub,
  onLeaveClub,
  onCancelRequest,
  onCreateClub,
  onFilterChange,
}: ClubBrowseProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ClubFilters>({})
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all')

  // Separate my clubs and other clubs
  const myClubs = clubs.filter((club) => club.isUserMember)
  const pendingClubs = clubs.filter((club) => club.pendingRequest)

  // Filter and search clubs
  const filteredClubs = clubs.filter((club) => {
    // Tab filter
    if (activeTab === 'my' && !club.isUserMember) return false

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = club.name.toLowerCase().includes(query)
      const matchesDescription = club.description.toLowerCase().includes(query)
      const matchesLocation =
        club.location.city.toLowerCase().includes(query) ||
        club.location.state.toLowerCase().includes(query)
      if (!matchesName && !matchesDescription && !matchesLocation) return false
    }

    // Location filter
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase()
      const matchesCity = club.location.city.toLowerCase().includes(locationQuery)
      const matchesState = club.location.state.toLowerCase().includes(locationQuery)
      if (!matchesCity && !matchesState) return false
    }

    // Membership type
    if (filters.membershipType && club.membershipType !== filters.membershipType) return false

    // Minimum members
    if (filters.minMembers && club.memberCount < filters.minMembers) return false

    // My clubs only
    if (filters.showMyClubsOnly && !club.isUserMember) return false

    return true
  })

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== null && v !== ''
  ).length

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  const handleFilterChange = (newFilters: ClubFilters) => {
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFiltersAndSearch = () => {
    setSearchQuery('')
    setFilters({})
    onSearch?.('')
    onFilterChange?.({})
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Title and Create */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Clubs</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''} found
              </p>
            </div>
            {onCreateClub && (
              <button
                onClick={onCreateClub}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Club</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-4 border-b border-slate-200 dark:border-slate-800 -mx-4 px-4">
            <TabButton
              active={activeTab === 'all'}
              label="All Clubs"
              count={clubs.length}
              onClick={() => setActiveTab('all')}
            />
            <TabButton
              active={activeTab === 'my'}
              label="My Clubs"
              count={myClubs.length}
              onClick={() => setActiveTab('my')}
            />
            {pendingClubs.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400">
                {pendingClubs.length} pending
              </span>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search clubs by name or location..."
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
                <span className="text-sm font-medium hidden sm:inline">Filters</span>
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
                label={filters.location ?? ''}
                isActive={!!filters.location}
                onRemove={() => handleFilterChange({ ...filters, location: undefined })}
              />
              <FilterPill
                label={filters.membershipType === 'open' ? 'Open' : 'Invite Only'}
                isActive={!!filters.membershipType}
                onRemove={() => handleFilterChange({ ...filters, membershipType: null })}
              />
              <FilterPill
                label={`${filters.minMembers}+ members`}
                isActive={!!filters.minMembers}
                onRemove={() => handleFilterChange({ ...filters, minMembers: undefined })}
              />
              <FilterPill
                label="My clubs only"
                isActive={!!filters.showMyClubsOnly}
                onRemove={() => handleFilterChange({ ...filters, showMyClubsOnly: undefined })}
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
        {filteredClubs.length > 0 ? (
          <div className="space-y-4">
            {filteredClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onView={() => onViewClub?.(club.id)}
                onJoin={() => onJoinClub?.(club.id)}
                onLeave={() => onLeaveClub?.(club.id)}
                onCancelRequest={() => onCancelRequest?.(club.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            hasFilters={!!searchQuery || activeFilterCount > 0}
            onClearFilters={clearFiltersAndSearch}
            onCreateClub={onCreateClub}
          />
        )}
      </div>
    </div>
  )
}
