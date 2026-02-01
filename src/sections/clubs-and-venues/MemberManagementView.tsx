import { MemberManagement } from './components'
import sampleData from '@/../product/sections/clubs-and-venues/data.json'
import type {
  Club,
  ClubMember,
  MembershipRequest,
  SubGroup,
} from '@/../product/sections/clubs-and-venues/types'

// Cast sample data to proper types
const clubs = sampleData.clubs as Club[]
const members = sampleData.members as ClubMember[]
const requests = sampleData.membershipRequests as MembershipRequest[]
const subGroups = sampleData.subGroups as SubGroup[]

// Get the first club (Austin Pickleball Club) for the management view
const club = clubs[0]
const clubMembers = members.filter((m) => m.clubId === club.id)
// Show requests from club-002 (Lakeway Paddle Pros) for demo purposes
// In real app, requests would be for the current club
const clubRequests = requests.filter((r) => r.status === 'pending')
const clubSubGroups = subGroups.filter((g) => g.clubId === club.id)

export default function MemberManagementView() {
  return (
    <MemberManagement
      club={club}
      members={clubMembers}
      requests={clubRequests}
      subGroups={clubSubGroups}
      onViewMember={(memberId) => console.log('View member:', memberId)}
      onRemoveMember={(memberId) => console.log('Remove member:', memberId)}
      onSuspendMember={(memberId) => console.log('Suspend member:', memberId)}
      onUnsuspendMember={(memberId) => console.log('Unsuspend member:', memberId)}
      onPromoteToAdmin={(memberId) => console.log('Promote to admin:', memberId)}
      onDemoteFromAdmin={(memberId) => console.log('Demote from admin:', memberId)}
      onAssignGameManager={(memberId) => console.log('Assign GM:', memberId)}
      onRemoveGameManager={(memberId) => console.log('Remove GM:', memberId)}
      onApproveRequest={(requestId) => console.log('Approve request:', requestId)}
      onRejectRequest={(requestId) => console.log('Reject request:', requestId)}
      onInviteMember={() => console.log('Invite member')}
      onExportMembers={() => console.log('Export members')}
    />
  )
}
