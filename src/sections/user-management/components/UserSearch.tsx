import { useState } from 'react'
import type {
  UserSearchProps,
  UserAccount,
  AccountStatus,
  UserRole,
  UserSortField,
  SortDirection,
} from '@/../product/sections/user-management/types'

// Status badge colors
const statusStyles: Record<AccountStatus, { bg: string; text: string; dot: string }> = {
  active: {
    bg: 'bg-lime-500/10 dark:bg-lime-500/20',
    text: 'text-lime-700 dark:text-lime-400',
    dot: 'bg-lime-500',
  },
  suspended: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  banned: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
  pending_deletion: {
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    text: 'text-slate-700 dark:text-slate-400',
    dot: 'bg-slate-500',
  },
}

const roleLabels: Record<UserRole, string> = {
  player: 'Player',
  game_manager: 'GM',
  club_admin: 'Club Admin',
  club_owner: 'Owner',
  super_admin: 'Super Admin',
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

// Icons
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function BookmarkIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return filled ? (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ) : (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  )
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// User Row Component
interface UserRowProps {
  user: UserAccount
  onSelect?: () => void
}

function UserRow({ user, onSelect }: UserRowProps) {
  const status = statusStyles[user.accountStatus]

  return (
    <tr
      onClick={onSelect}
      className="group cursor-pointer border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {user.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
              {user.displayName}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {user.accountStatus.replace('_', ' ')}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-wrap gap-1">
          {user.roles.slice(0, 2).map((role) => (
            <span
              key={role}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400"
            >
              {roleLabels[role]}
            </span>
          ))}
          {user.roles.length > 2 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
              +{user.roles.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span title="Clubs">{user.clubCount} clubs</span>
          <span title="Events">{user.eventCount} events</span>
        </div>
      </td>
      <td className="py-4 px-4">
        {(user.reportCount > 0 || user.warningCount > 0) && (
          <div className="flex items-center gap-2">
            {user.reportCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertIcon className="w-3.5 h-3.5" />
                {user.reportCount}
              </span>
            )}
            {user.warningCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <AlertIcon className="w-3.5 h-3.5" />
                {user.warningCount}
              </span>
            )}
          </div>
        )}
      </td>
      <td className="py-4 px-4 text-sm text-slate-500 dark:text-slate-400">
        {formatRelativeTime(user.lastActiveAt)}
      </td>
      <td className="py-4 px-4 text-sm text-slate-500 dark:text-slate-400">
        {formatDate(user.registeredAt)}
      </td>
    </tr>
  )
}

// Sortable Column Header
interface SortableHeaderProps {
  label: string
  field: UserSortField
  currentField: UserSortField
  direction: SortDirection
  onSort: (field: UserSortField, direction: SortDirection) => void
}

function SortableHeader({ label, field, currentField, direction, onSort }: SortableHeaderProps) {
  const isActive = currentField === field
  const nextDirection = isActive && direction === 'asc' ? 'desc' : 'asc'

  return (
    <th
      onClick={() => onSort(field, nextDirection)}
      className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive && (
          direction === 'asc' ? (
            <ChevronUpIcon className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
          ) : (
            <ChevronDownIcon className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
          )
        )}
      </div>
    </th>
  )
}

// Main UserSearch Component
export function UserSearch({
  users,
  totalCount,
  currentPage,
  pageSize,
  filters,
  sortField,
  sortDirection,
  savedSearches,
  isLoading,
  onFilterChange,
  onSortChange,
  onPageChange,
  onSelectUser,
  onSaveSearch,
  onLoadSearch,
  onDeleteSearch,
  onExportResults,
}: UserSearchProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [searchQuery, setSearchQuery] = useState(filters.query || '')
  const [selectedStatuses, setSelectedStatuses] = useState<AccountStatus[]>(filters.accountStatus || [])
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(filters.roles || [])

  const totalPages = Math.ceil(totalCount / pageSize)

  const handleSearch = () => {
    onFilterChange?.({
      ...filters,
      query: searchQuery || undefined,
      accountStatus: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      roles: selectedRoles.length > 0 ? selectedRoles : undefined,
    })
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedStatuses([])
    setSelectedRoles([])
    onFilterChange?.({})
  }

  const toggleStatus = (status: AccountStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const toggleRole = (role: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const hasActiveFilters =
    (filters.query && filters.query.length > 0) ||
    (filters.accountStatus && filters.accountStatus.length > 0) ||
    (filters.roles && filters.roles.length > 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                User Management
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {totalCount.toLocaleString()} users total
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSavedSearches(!showSavedSearches)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                <BookmarkIcon className="w-4 h-4" filled={showSavedSearches} />
                Saved Searches
              </button>
              <button
                onClick={onExportResults}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 rounded-lg transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Saved Searches Panel */}
        {showSavedSearches && (
          <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Saved Searches</h3>
              <button
                onClick={() => setShowSavedSearches(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {savedSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => onLoadSearch?.(search.id)}
                  className="group p-3 text-left bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-lime-50 dark:hover:bg-lime-900/20 border border-transparent hover:border-lime-200 dark:hover:border-lime-800 transition-all"
                >
                  <p className="font-medium text-slate-900 dark:text-white group-hover:text-lime-700 dark:group-hover:text-lime-400">
                    {search.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {search.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-lime-50 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-800'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
              }`}
            >
              <FilterIcon className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-lime-500" />
              )}
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 rounded-lg transition-colors"
            >
              Search
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Account Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['active', 'suspended', 'banned', 'pending_deletion'] as AccountStatus[]).map((status) => {
                      const style = statusStyles[status]
                      const isSelected = selectedStatuses.includes(status)
                      return (
                        <button
                          key={status}
                          onClick={() => toggleStatus(status)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? `${style.bg} ${style.text} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-current`
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isSelected ? style.dot : 'bg-slate-400'}`} />
                          {status.replace('_', ' ')}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Role Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    User Roles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['player', 'game_manager', 'club_admin', 'club_owner'] as UserRole[]).map((role) => {
                      const isSelected = selectedRoles.includes(role)
                      return (
                        <button
                          key={role}
                          onClick={() => toggleRole(role)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-sky-500/20 text-sky-700 dark:text-sky-400 ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ring-sky-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {roleLabels[role]}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => {
                    const name = prompt('Save search as:')
                    if (name) onSaveSearch?.(name, `Filters: ${selectedStatuses.join(', ')} | ${selectedRoles.join(', ')}`)
                  }}
                  className="inline-flex items-center gap-1 text-sm text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300"
                >
                  <BookmarkIcon className="w-4 h-4" />
                  Save this search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-lime-200 dark:border-lime-800 border-t-lime-600 dark:border-t-lime-400 rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
              <SearchIcon className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <SortableHeader
                        label="User"
                        field="displayName"
                        currentField={sortField}
                        direction={sortDirection}
                        onSort={(f, d) => onSortChange?.(f, d)}
                      />
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Roles
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Activity
                      </th>
                      <SortableHeader
                        label="Flags"
                        field="reportCount"
                        currentField={sortField}
                        direction={sortDirection}
                        onSort={(f, d) => onSortChange?.(f, d)}
                      />
                      <SortableHeader
                        label="Last Active"
                        field="lastActiveAt"
                        currentField={sortField}
                        direction={sortDirection}
                        onSort={(f, d) => onSortChange?.(f, d)}
                      />
                      <SortableHeader
                        label="Registered"
                        field="registeredAt"
                        currentField={sortField}
                        direction={sortDirection}
                        onSort={(f, d) => onSortChange?.(f, d)}
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onSelect={() => onSelectUser?.(user.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, totalCount)} of {totalCount} users
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPageChange?.(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            onClick={() => onPageChange?.(page)}
                            className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-lime-600 text-white'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => onPageChange?.(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
