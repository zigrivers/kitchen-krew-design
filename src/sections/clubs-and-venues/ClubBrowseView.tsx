import { ClubBrowse } from './components'
import sampleData from '@/../product/sections/clubs-and-venues/data.json'
import type { Club, CurrentUser } from '@/../product/sections/clubs-and-venues/types'

// Cast sample data to proper types
const currentUser = sampleData.currentUser as CurrentUser
const clubs = sampleData.clubs as Club[]

export default function ClubBrowseView() {
  return (
    <ClubBrowse
      currentUser={currentUser}
      clubs={clubs}
      onSearch={(query) => console.log('Search:', query)}
      onViewClub={(clubId) => console.log('View club:', clubId)}
      onJoinClub={(clubId) => console.log('Join club:', clubId)}
      onLeaveClub={(clubId) => console.log('Leave club:', clubId)}
      onCancelRequest={(clubId) => console.log('Cancel request:', clubId)}
      onCreateClub={() => console.log('Create club')}
      onFilterChange={(filters) => console.log('Filters:', filters)}
    />
  )
}
