import { ClubDetail } from './components'
import sampleData from '@/../product/sections/clubs-and-venues/data.json'
import type {
  Club,
  ClubMember,
  SubGroup,
  Venue,
  QRCode,
} from '@/../product/sections/clubs-and-venues/types'

// Cast sample data to proper types
const clubs = sampleData.clubs as Club[]
const members = sampleData.members as ClubMember[]
const subGroups = sampleData.subGroups as SubGroup[]
const venues = sampleData.venues as Venue[]
const qrCodes = (sampleData.qrCodes || []) as QRCode[]

// Get the first club (Austin Pickleball Club) for the detail view
const club = clubs[0]
const clubMembers = members.filter((m) => m.clubId === club.id)
const clubSubGroups = subGroups.filter((g) => g.clubId === club.id)
const linkedVenues = venues.filter((v) => club.linkedVenueIds.includes(v.id))

// Get QR code for this club
const clubQRCode = qrCodes.find(qr => qr.entityId === club.id && qr.type === 'club_invite') || null

export default function ClubDetailView() {
  return (
    <ClubDetail
      club={club}
      members={clubMembers}
      subGroups={clubSubGroups}
      linkedVenues={linkedVenues}
      isAdmin={club.userRole === 'admin'}
      clubQRCode={clubQRCode}
      isGeneratingQR={false}
      onEdit={() => console.log('Edit club')}
      onJoin={() => console.log('Join club')}
      onLeave={() => console.log('Leave club')}
      onCancelRequest={() => console.log('Cancel request')}
      onViewMember={(memberId) => console.log('View member:', memberId)}
      onViewVenue={(venueId) => console.log('View venue:', venueId)}
      onInviteMember={() => console.log('Invite member')}
      onGenerateInviteQR={() => console.log('Generate invite QR')}
      onGenerateAppDownloadQR={(includeBranding) => console.log('Generate app download QR, branding:', includeBranding)}
      onDownloadQR={(format) => console.log('Download QR as:', format)}
      onCopyQRLink={() => console.log('Copy QR link')}
    />
  )
}
