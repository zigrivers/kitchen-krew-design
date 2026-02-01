import { useState } from 'react'
import {
  ChevronLeft,
  Search,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Send,
  X,
  MoreHorizontal,
  Star,
  MessageCircle,
  Ban,
  HeartHandshake,
  EyeOff,
  ChevronDown,
  ArrowUpDown,
  Filter,
} from 'lucide-react'
import type { PlayerReference, FriendRequest, Player } from '@/../product/sections/players/types'

// =============================================================================
// Props
// =============================================================================

export interface FriendsAndRequestsProps {
  /** List of friends (simplified player references) */
  friends: PlayerReference[]
  /** Pending friend requests (incoming and outgoing) */
  friendRequests: FriendRequest[]
  /** Total friends count for display */
  totalFriendsCount: number

  // Navigation
  onBack?: () => void

  // Friend actions
  onViewProfile?: (playerId: string) => void
  onRemoveFriend?: (playerId: string) => void
  onMessageFriend?: (playerId: string) => void
  onAddPreferredPartner?: (playerId: string) => void
  onAddToAvoidList?: (playerId: string) => void
  onBlockPlayer?: (playerId: string) => void

  // Request actions
  onAcceptRequest?: (requestId: string) => void
  onDeclineRequest?: (requestId: string) => void
  onCancelRequest?: (requestId: string) => void

  // Search
  onSearch?: (query: string) => void
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
    lg: 'w-14 h-14 text-lg',
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

function TabButton({
  label,
  count,
  isActive,
  onClick,
  hasNotification,
}: {
  label: string
  count?: number
  isActive: boolean
  onClick: () => void
  hasNotification?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        isActive
          ? 'text-lime-600 dark:text-lime-400 border-lime-500'
          : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-xs ${
            isActive
              ? 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {count}
        </span>
      )}
      {hasNotification && (
        <span className="absolute top-2 right-0 w-2 h-2 rounded-full bg-red-500" />
      )}
    </button>
  )
}

function FriendCard({
  friend,
  onViewProfile,
  onRemove,
  onMessage,
  onAddPartner,
  onAvoid,
  onBlock,
}: {
  friend: PlayerReference
  onViewProfile?: () => void
  onRemove?: () => void
  onMessage?: () => void
  onAddPartner?: () => void
  onAvoid?: () => void
  onBlock?: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="group relative flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-lime-300 dark:hover:border-lime-700 transition-all">
      <button onClick={onViewProfile} className="flex-shrink-0">
        <Avatar name={friend.name} avatarUrl={friend.avatarUrl} size="md" />
      </button>

      <div className="flex-1 min-w-0">
        <button onClick={onViewProfile} className="text-left">
          <h3 className="font-medium text-slate-900 dark:text-white truncate hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
            {friend.name}
          </h3>
        </button>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            {friend.skillRating.toFixed(1)}
          </span>
          {friend.mutualFriends !== undefined && friend.mutualFriends > 0 && (
            <>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {friend.mutualFriends} mutual
              </span>
            </>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onMessage}
          className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
          title="Message"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 w-48 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                <button
                  onClick={() => {
                    onAddPartner?.()
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <HeartHandshake className="w-4 h-4" />
                  Add to Partners
                </button>
                <button
                  onClick={() => {
                    onAvoid?.()
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <EyeOff className="w-4 h-4" />
                  Avoid in Matching
                </button>
                <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
                <button
                  onClick={() => {
                    onRemove?.()
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <UserX className="w-4 h-4" />
                  Remove Friend
                </button>
                <button
                  onClick={() => {
                    onBlock?.()
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Ban className="w-4 h-4" />
                  Block Player
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function RequestCard({
  request,
  onViewProfile,
  onAccept,
  onDecline,
  onCancel,
}: {
  request: FriendRequest
  onViewProfile?: () => void
  onAccept?: () => void
  onDecline?: () => void
  onCancel?: () => void
}) {
  const isIncoming = request.type === 'incoming'
  const timeAgo = getTimeAgo(request.sentAt)

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all ${
        isIncoming
          ? 'bg-lime-50/50 dark:bg-lime-900/10 border-lime-200 dark:border-lime-800/50'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex items-start gap-4">
        <button onClick={onViewProfile} className="flex-shrink-0">
          <Avatar name={request.player.name} avatarUrl={request.player.avatarUrl} size="md" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button onClick={onViewProfile} className="text-left">
              <h3 className="font-medium text-slate-900 dark:text-white hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                {request.player.name}
              </h3>
            </button>
            {isIncoming ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400">
                <UserPlus className="w-3 h-3" />
                Incoming
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <Send className="w-3 h-3" />
                Sent
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              {request.player.skillRating.toFixed(1)}
            </span>
            {request.player.mutualFriends !== undefined && request.player.mutualFriends > 0 && (
              <>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {request.player.mutualFriends} mutual friends
                </span>
              </>
            )}
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{timeAgo}</span>
          </div>

          {request.message && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
              "{request.message}"
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {isIncoming ? (
              <>
                <button
                  onClick={onAccept}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={onDecline}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Decline
                </button>
              </>
            ) : (
              <button
                onClick={onCancel}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// =============================================================================
// Main Component
// =============================================================================

export function FriendsAndRequests({
  friends,
  friendRequests,
  totalFriendsCount,
  onBack,
  onViewProfile,
  onRemoveFriend,
  onMessageFriend,
  onAddPreferredPartner,
  onAddToAvoidList,
  onBlockPlayer,
  onAcceptRequest,
  onDeclineRequest,
  onCancelRequest,
  onSearch,
}: FriendsAndRequestsProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'skill' | 'recent'>('name')
  const [showSortMenu, setShowSortMenu] = useState(false)

  // Count incoming requests for notification badge
  const incomingRequests = friendRequests.filter((r) => r.type === 'incoming')
  const outgoingRequests = friendRequests.filter((r) => r.type === 'outgoing')

  // Filter friends by search
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort friends
  const sortedFriends = [...filteredFriends].sort((a, b) => {
    switch (sortBy) {
      case 'skill':
        return b.skillRating - a.skillRating
      case 'recent':
        return new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime()
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title row */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Friends</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{totalFriendsCount} connections</p>
              </div>
            </div>

            <Users className="w-6 h-6 text-lime-500" />
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 -mb-px">
            <TabButton
              label="Friends"
              count={friends.length}
              isActive={activeTab === 'friends'}
              onClick={() => setActiveTab('friends')}
            />
            <TabButton
              label="Requests"
              count={friendRequests.length}
              isActive={activeTab === 'requests'}
              onClick={() => setActiveTab('requests')}
              hasNotification={incomingRequests.length > 0}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'friends' && (
          <div className="space-y-4">
            {/* Search and Sort */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-sm font-medium capitalize">{sortBy}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showSortMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-40 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                      {[
                        { key: 'name', label: 'Name' },
                        { key: 'skill', label: 'Skill Rating' },
                        { key: 'recent', label: 'Recently Added' },
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => {
                            setSortBy(key as typeof sortBy)
                            setShowSortMenu(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            sortBy === key
                              ? 'text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-900/20'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Friends List */}
            {sortedFriends.length > 0 ? (
              <div className="space-y-3">
                {sortedFriends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onViewProfile={() => onViewProfile?.(friend.id)}
                    onRemove={() => onRemoveFriend?.(friend.id)}
                    onMessage={() => onMessageFriend?.(friend.id)}
                    onAddPartner={() => onAddPreferredPartner?.(friend.id)}
                    onAvoid={() => onAddToAvoidList?.(friend.id)}
                    onBlock={() => onBlockPlayer?.(friend.id)}
                  />
                ))}
              </div>
            ) : searchQuery ? (
              <div className="py-12 text-center">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No friends match "{searchQuery}"</p>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No friends yet</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Find players and send friend requests to connect
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Incoming Requests */}
            {incomingRequests.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-lime-500" />
                  Incoming Requests
                  <span className="px-1.5 py-0.5 rounded-full text-xs bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400">
                    {incomingRequests.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onViewProfile={() => onViewProfile?.(request.player.id)}
                      onAccept={() => onAcceptRequest?.(request.id)}
                      onDecline={() => onDeclineRequest?.(request.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Outgoing Requests */}
            {outgoingRequests.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Send className="w-4 h-4 text-slate-400" />
                  Sent Requests
                  <span className="px-1.5 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {outgoingRequests.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {outgoingRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onViewProfile={() => onViewProfile?.(request.player.id)}
                      onCancel={() => onCancelRequest?.(request.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {friendRequests.length === 0 && (
              <div className="py-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No pending requests</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Friend requests you send or receive will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
