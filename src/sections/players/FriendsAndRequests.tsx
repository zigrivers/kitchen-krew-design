import data from '@/../product/sections/players/data.json'
import { FriendsAndRequests } from './components/FriendsAndRequests'
import type { PlayerReference, FriendRequest, CurrentUser } from '@/../product/sections/players/types'

// Convert preferred partners to friends format for preview
// In a real app, friends would be a separate list
const friends: PlayerReference[] = [
  ...data.preferredPartners,
  // Add some additional friends from the players list
  {
    id: 'plr-003',
    name: 'Jennifer Walsh',
    avatarUrl: null,
    skillRating: 4.25,
    addedAt: '2025-04-10',
    mutualFriends: 12,
  },
  {
    id: 'plr-006',
    name: 'Brian Thompson',
    avatarUrl: null,
    skillRating: 4.0,
    addedAt: '2025-05-22',
    mutualFriends: 15,
  },
]

export default function FriendsAndRequestsPreview() {
  const currentUser = data.currentUser as CurrentUser

  return (
    <FriendsAndRequests
      friends={friends}
      friendRequests={data.friendRequests as FriendRequest[]}
      totalFriendsCount={currentUser.friendsCount}
      onBack={() => console.log('Navigate back')}
      onViewProfile={(id) => console.log('View profile:', id)}
      onRemoveFriend={(id) => console.log('Remove friend:', id)}
      onMessageFriend={(id) => console.log('Message friend:', id)}
      onAddPreferredPartner={(id) => console.log('Add preferred partner:', id)}
      onAddToAvoidList={(id) => console.log('Add to avoid list:', id)}
      onBlockPlayer={(id) => console.log('Block player:', id)}
      onAcceptRequest={(id) => console.log('Accept request:', id)}
      onDeclineRequest={(id) => console.log('Decline request:', id)}
      onCancelRequest={(id) => console.log('Cancel request:', id)}
      onSearch={(query) => console.log('Search:', query)}
    />
  )
}
