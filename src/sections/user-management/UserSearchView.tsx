import { useState } from 'react'
import { UserSearch } from './components/UserSearch'
import sampleData from '@/../product/sections/user-management/data.json'
import type {
  UserAccount,
  SavedSearch,
  UserSearchFilters,
  UserSortField,
  SortDirection,
} from '@/../product/sections/user-management/types'

// Cast sample data to proper types
const users = sampleData.userAccounts as UserAccount[]
const savedSearches = sampleData.savedSearches as SavedSearch[]

export default function UserSearchView() {
  const [filters, setFilters] = useState<UserSearchFilters>({})
  const [sortField, setSortField] = useState<UserSortField>('lastActiveAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)

  // Apply filters to users
  const filteredUsers = users.filter((user) => {
    if (filters.query) {
      const query = filters.query.toLowerCase()
      if (
        !user.displayName.toLowerCase().includes(query) &&
        !user.email.toLowerCase().includes(query)
      ) {
        return false
      }
    }
    if (filters.accountStatus && filters.accountStatus.length > 0) {
      if (!filters.accountStatus.includes(user.accountStatus)) {
        return false
      }
    }
    if (filters.roles && filters.roles.length > 0) {
      if (!user.roles.some((role) => filters.roles!.includes(role))) {
        return false
      }
    }
    return true
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    return 0
  })

  const pageSize = 20

  return (
    <UserSearch
      users={sortedUsers}
      totalCount={sortedUsers.length}
      currentPage={currentPage}
      pageSize={pageSize}
      filters={filters}
      sortField={sortField}
      sortDirection={sortDirection}
      savedSearches={savedSearches}
      isLoading={false}
      onFilterChange={(newFilters) => {
        setFilters(newFilters)
        setCurrentPage(1)
        console.log('Filter change:', newFilters)
      }}
      onSortChange={(field, direction) => {
        setSortField(field)
        setSortDirection(direction)
        console.log('Sort change:', field, direction)
      }}
      onPageChange={(page) => {
        setCurrentPage(page)
        console.log('Page change:', page)
      }}
      onSelectUser={(userId) => {
        console.log('Select user:', userId)
        alert(`View user details: ${userId}`)
      }}
      onSaveSearch={(name, description) => {
        console.log('Save search:', name, description)
        alert(`Saved search: ${name}`)
      }}
      onLoadSearch={(searchId) => {
        console.log('Load search:', searchId)
        const search = savedSearches.find((s) => s.id === searchId)
        if (search) {
          alert(`Loaded search: ${search.name}`)
        }
      }}
      onDeleteSearch={(searchId) => {
        console.log('Delete search:', searchId)
      }}
      onExportResults={() => {
        console.log('Export results')
        alert('Exporting user data to CSV...')
      }}
    />
  )
}
