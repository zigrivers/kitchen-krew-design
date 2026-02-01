import { useState, useMemo } from 'react'
import type {
  Club,
  ClubMember,
  MembershipRequest,
  SubGroup,
} from '@/../product/sections/clubs-and-venues/types'

export interface MemberManagementProps {
  club: Club
  members: ClubMember[]
  requests: MembershipRequest[]
  subGroups: SubGroup[]
  onViewMember?: (memberId: string) => void
  onRemoveMember?: (memberId: string) => void
  onSuspendMember?: (memberId: string) => void
  onUnsuspendMember?: (memberId: string) => void
  onPromoteToAdmin?: (memberId: string) => void
  onDemoteFromAdmin?: (memberId: string) => void
  onAssignGameManager?: (memberId: string) => void
  onRemoveGameManager?: (memberId: string) => void
  onApproveRequest?: (requestId: string) => void
  onRejectRequest?: (requestId: string) => void
  onInviteMember?: () => void
  onExportMembers?: () => void
}

type Tab = 'members' | 'requests'
type SortField = 'name' | 'rating' | 'joined' | 'activity' | 'games'
type SortDirection = 'asc' | 'desc'
type StatusFilter = 'all' | 'active' | 'suspended'
type RoleFilter = 'all' | 'admin' | 'gameManager' | 'member'

export function MemberManagement({
  club,
  members,
  requests,
  subGroups,
  onViewMember,
  onRemoveMember,
  onSuspendMember,
  onUnsuspendMember,
  onPromoteToAdmin,
  onDemoteFromAdmin,
  onAssignGameManager,
  onRemoveGameManager,
  onApproveRequest,
  onRejectRequest,
  onInviteMember,
  onExportMembers,
}: MemberManagementProps) {
  const [activeTab, setActiveTab] = useState<Tab>('members')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [expandedMember, setExpandedMember] = useState<string | null>(null)

  const pendingRequests = requests.filter((r) => r.status === 'pending')

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let result = [...members]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((m) => m.playerName.toLowerCase().includes(query))
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((m) => m.status === statusFilter)
    }

    // Role filter
    if (roleFilter !== 'all') {
      if (roleFilter === 'admin') {
        result = result.filter((m) => m.role === 'admin')
      } else if (roleFilter === 'gameManager') {
        result = result.filter((m) => m.isGameManager && m.role !== 'admin')
      } else {
        result = result.filter((m) => m.role === 'member' && !m.isGameManager)
      }
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = a.playerName.localeCompare(b.playerName)
          break
        case 'rating':
          comparison = a.skillRating - b.skillRating
          break
        case 'joined':
          comparison =
            new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
          break
        case 'activity':
          comparison =
            new Date(a.lastActiveAt).getTime() -
            new Date(b.lastActiveAt).getTime()
          break
        case 'games':
          comparison = a.gamesPlayed - b.gamesPlayed
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [members, searchQuery, statusFilter, roleFilter, sortField, sortDirection])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selectedMembers.size === filteredMembers.length) {
      setSelectedMembers(new Set())
    } else {
      setSelectedMembers(new Set(filteredMembers.map((m) => m.id)))
    }
  }

  const toggleSelectMember = (memberId: string) => {
    const newSelection = new Set(selectedMembers)
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId)
    } else {
      newSelection.add(memberId)
    }
    setSelectedMembers(newSelection)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return formatDate(dateStr)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const SortIcon = ({
    field,
    className = '',
  }: {
    field: SortField
    className?: string
  }) => (
    <svg
      className={`w-4 h-4 ${sortField === field ? 'text-lime-500' : 'text-slate-400'} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {sortField === field && sortDirection === 'desc' ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      )}
    </svg>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-lime-500 via-lime-400 to-sky-400 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <button className="p-1 -ml-1 rounded-lg hover:bg-white/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">Member Management</h1>
          </div>
          <p className="text-white/80 text-sm ml-7">{club.name}</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-6 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-lime-600 dark:text-lime-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {members.length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Members
              </p>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 shrink-0" />

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-sky-600 dark:text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {members.filter((m) => m.status === 'active').length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active
              </p>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 shrink-0" />

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-amber-600 dark:text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {members.filter((m) => m.role === 'admin').length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admins
              </p>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 shrink-0" />

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {members.filter((m) => m.isGameManager).length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Game Managers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4">
        <div className="max-w-6xl mx-auto flex gap-1">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'members'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Requests
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        {activeTab === 'members' ? (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                  className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/50"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/50"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="gameManager">Game Managers</option>
                  <option value="member">Members</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions & Action Buttons */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {selectedMembers.size > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-lime-50 dark:bg-lime-900/20 rounded-lg">
                    <span className="text-sm font-medium text-lime-700 dark:text-lime-300">
                      {selectedMembers.size} selected
                    </span>
                    <button
                      onClick={() => setSelectedMembers(new Set())}
                      className="text-lime-600 dark:text-lime-400 hover:text-lime-800"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onExportMembers?.()}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export
                </button>
                <button
                  onClick={() => onInviteMember?.()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Invite
                </button>
              </div>
            </div>

            {/* Member Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[auto_1fr_100px_100px_100px_100px_60px] gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMembers.size === filteredMembers.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500"
                  />
                </div>
                <button
                  onClick={() => toggleSort('name')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                >
                  Member
                  <SortIcon field="name" />
                </button>
                <button
                  onClick={() => toggleSort('rating')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                >
                  Rating
                  <SortIcon field="rating" />
                </button>
                <button
                  onClick={() => toggleSort('games')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                >
                  Games
                  <SortIcon field="games" />
                </button>
                <button
                  onClick={() => toggleSort('joined')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                >
                  Joined
                  <SortIcon field="joined" />
                </button>
                <button
                  onClick={() => toggleSort('activity')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                >
                  Activity
                  <SortIcon field="activity" />
                </button>
                <div></div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredMembers.map((member) => (
                  <div key={member.id}>
                    {/* Desktop Row */}
                    <div
                      className={`hidden md:grid grid-cols-[auto_1fr_100px_100px_100px_100px_60px] gap-4 px-4 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        member.status === 'suspended'
                          ? 'bg-red-50/50 dark:bg-red-900/10'
                          : ''
                      }`}
                    >
                      <div>
                        <input
                          type="checkbox"
                          checked={selectedMembers.has(member.id)}
                          onChange={() => toggleSelectMember(member.id)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500"
                        />
                      </div>

                      <button
                        onClick={() => onViewMember?.(member.id)}
                        className="flex items-center gap-3 text-left"
                      >
                        <div className="relative">
                          {member.playerAvatarUrl ? (
                            <img
                              src={member.playerAvatarUrl}
                              alt={member.playerName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300">
                              {getInitials(member.playerName)}
                            </div>
                          )}
                          {member.status === 'suspended' && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 dark:text-white">
                              {member.playerName}
                            </span>
                            {member.role === 'admin' && (
                              <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                                Admin
                              </span>
                            )}
                            {member.isGameManager && member.role !== 'admin' && (
                              <span className="px-1.5 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                                GM
                              </span>
                            )}
                          </div>
                          {member.status === 'suspended' && (
                            <span className="text-xs text-red-600 dark:text-red-400">
                              Suspended until{' '}
                              {formatDate(member.suspensionEndsAt || '')}
                            </span>
                          )}
                        </div>
                      </button>

                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {member.skillRating.toFixed(1)}
                      </div>

                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {member.gamesPlayed}
                      </div>

                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(member.joinedAt)}
                      </div>

                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {formatRelativeDate(member.lastActiveAt)}
                      </div>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setExpandedMember(
                              expandedMember === member.id ? null : member.id
                            )
                          }
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>

                        {expandedMember === member.id && (
                          <div className="absolute right-0 top-full mt-1 z-10 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1">
                            <button
                              onClick={() => {
                                onViewMember?.(member.id)
                                setExpandedMember(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              View Profile
                            </button>
                            {member.role !== 'admin' && (
                              <button
                                onClick={() => {
                                  onPromoteToAdmin?.(member.id)
                                  setExpandedMember(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                Promote to Admin
                              </button>
                            )}
                            {member.role === 'admin' && (
                              <button
                                onClick={() => {
                                  onDemoteFromAdmin?.(member.id)
                                  setExpandedMember(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                Remove Admin Role
                              </button>
                            )}
                            {!member.isGameManager && (
                              <button
                                onClick={() => {
                                  onAssignGameManager?.(member.id)
                                  setExpandedMember(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                Make Game Manager
                              </button>
                            )}
                            {member.isGameManager && (
                              <button
                                onClick={() => {
                                  onRemoveGameManager?.(member.id)
                                  setExpandedMember(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                Remove Game Manager
                              </button>
                            )}
                            <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                            {member.status === 'active' ? (
                              <button
                                onClick={() => {
                                  onSuspendMember?.(member.id)
                                  setExpandedMember(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                Suspend Member
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  onUnsuspendMember?.(member.id)
                                  setExpandedMember(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-lime-600 dark:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                Unsuspend Member
                              </button>
                            )}
                            <button
                              onClick={() => {
                                onRemoveMember?.(member.id)
                                setExpandedMember(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              Remove from Club
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Row */}
                    <div
                      className={`md:hidden px-4 py-3 ${
                        member.status === 'suspended'
                          ? 'bg-red-50/50 dark:bg-red-900/10'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedMembers.has(member.id)}
                          onChange={() => toggleSelectMember(member.id)}
                          className="mt-3 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500"
                        />
                        <button
                          onClick={() => onViewMember?.(member.id)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {member.playerAvatarUrl ? (
                                <img
                                  src={member.playerAvatarUrl}
                                  alt={member.playerName}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300">
                                  {getInitials(member.playerName)}
                                </div>
                              )}
                              {member.status === 'suspended' && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-2.5 h-2.5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {member.playerName}
                                </span>
                                <span className="px-1.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                                  {member.skillRating.toFixed(1)}
                                </span>
                                {member.role === 'admin' && (
                                  <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                                    Admin
                                  </span>
                                )}
                                {member.isGameManager &&
                                  member.role !== 'admin' && (
                                    <span className="px-1.5 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                                      GM
                                    </span>
                                  )}
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                <span>{member.gamesPlayed} games</span>
                                <span>
                                  Joined {formatDate(member.joinedAt)}
                                </span>
                              </div>
                              {member.status === 'suspended' && (
                                <span className="text-xs text-red-600 dark:text-red-400">
                                  Suspended until{' '}
                                  {formatDate(member.suspensionEndsAt || '')}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() =>
                            setExpandedMember(
                              expandedMember === member.id ? null : member.id
                            )
                          }
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className="px-4 py-12 text-center">
                  <svg
                    className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    No members found
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Requests Tab */
          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-12 text-center">
                <svg
                  className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  No pending requests
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  New membership requests will appear here
                </p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {request.playerAvatarUrl ? (
                        <img
                          src={request.playerAvatarUrl}
                          alt={request.playerName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300">
                          {getInitials(request.playerName)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {request.playerName}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                          {request.skillRating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Requested {formatRelativeDate(request.requestedAt)}
                      </p>
                      {request.message && (
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                          <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                            "{request.message}"
                          </p>
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => onApproveRequest?.(request.id)}
                          className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectRequest?.(request.id)}
                          className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
