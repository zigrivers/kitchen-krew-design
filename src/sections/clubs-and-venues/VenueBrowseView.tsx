import { VenueBrowse } from './components'
import sampleData from '@/../product/sections/clubs-and-venues/data.json'
import type { Venue } from '@/../product/sections/clubs-and-venues/types'

// Cast sample data to proper types
const venues = sampleData.venues as Venue[]

// Simulated user location (Austin, TX area)
const userLocation = {
  lat: 30.2672,
  lng: -97.7431,
}

export default function VenueBrowseView() {
  return (
    <VenueBrowse
      venues={venues}
      userLocation={userLocation}
      onViewVenue={(venueId) => console.log('View venue:', venueId)}
      onGetDirections={(venueId) => console.log('Get directions:', venueId)}
    />
  )
}
