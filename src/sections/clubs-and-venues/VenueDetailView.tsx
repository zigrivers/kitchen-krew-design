import { VenueDetail } from './components'
import sampleData from '@/../product/sections/clubs-and-venues/data.json'
import type {
  Venue,
  Court,
  VenueReview,
  Club,
} from '@/../product/sections/clubs-and-venues/types'

// Cast sample data to proper types
const venues = sampleData.venues as Venue[]
const courts = sampleData.courts as Court[]
const reviews = sampleData.venueReviews as VenueReview[]
const clubs = sampleData.clubs as Club[]

// Get the fourth venue (Brushy Creek - unverified) for the detail view to show claim feature
const venue = venues[3]
const venueCourts = courts.filter((c) => c.venueId === venue.id)
const venueReviews = reviews.filter((r) => r.venueId === venue.id)
const linkedClub = clubs.find((c) => c.id === venue.linkedClubId) || null

export default function VenueDetailView() {
  return (
    <VenueDetail
      venue={venue}
      courts={venueCourts}
      reviews={venueReviews}
      linkedClub={linkedClub}
      isAdmin={false}
      canClaimVenue={!venue.isVerified}
      onEdit={() => console.log('Edit venue')}
      onSubmitReview={() => console.log('Submit review')}
      onGetDirections={() => console.log('Get directions')}
      onViewClub={(clubId) => console.log('View club:', clubId)}
      onMarkHelpful={(reviewId) => console.log('Mark helpful:', reviewId)}
      onRespondToReview={(reviewId) => console.log('Respond to review:', reviewId)}
      onClaimVenue={() => console.log('Claim venue')}
      onBulkAddCourts={(count) => console.log('Bulk add courts:', count)}
    />
  )
}
