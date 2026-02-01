import data from '@/../product/sections/events/data.json'
import { EventDiscovery } from './components/EventDiscovery'
import type { Event, GameFormat, CurrentUser } from '@/../product/sections/events/types'

export default function EventDiscoveryPreview() {
  return (
    <EventDiscovery
      events={data.events as Event[]}
      gameFormats={data.gameFormats as GameFormat[]}
      currentUser={data.currentUser as CurrentUser}
      onViewEvent={(id) => console.log('View event:', id)}
      onFilterChange={(filters) => console.log('Filter change:', filters)}
      onRegister={(id, partnerId) => console.log('Register:', id, partnerId)}
      onUnregister={(id) => console.log('Unregister:', id)}
      onJoinWaitlist={(id) => console.log('Join waitlist:', id)}
      onCreate={() => console.log('Create new event')}
    />
  )
}
