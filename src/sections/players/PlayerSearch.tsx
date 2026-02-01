import data from '@/../product/sections/players/data.json'
import { PlayerSearch } from './components/PlayerSearch'
import type { Player } from '@/../product/sections/players/types'

export default function PlayerSearchPreview() {
  return (
    <PlayerSearch
      players={data.players as Player[]}
      onSearch={(query) => console.log('Search:', query)}
      onViewPlayer={(id) => console.log('View player:', id)}
      onSendFriendRequest={(id) => console.log('Send friend request:', id)}
      onFilterChange={(filters) => console.log('Filters changed:', filters)}
    />
  )
}
