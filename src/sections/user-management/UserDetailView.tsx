import { UserDetail } from './components/UserDetail'
import sampleData from '@/../product/sections/user-management/data.json'
import type {
  UserAccount,
  ActivityEvent,
  AdminNote,
  PlatformAction,
  PlayerNote,
  PlayerWarning,
  MemberAction,
  EscalationCase,
  GDPRRequest,
} from '@/../product/sections/user-management/types'

// Cast sample data to proper types
const users = sampleData.userAccounts as UserAccount[]
const activityEvents = sampleData.activityEvents as ActivityEvent[]
const adminNotes = sampleData.adminNotes as AdminNote[]
const platformActions = sampleData.platformActions as PlatformAction[]
const playerNotes = sampleData.playerNotes as PlayerNote[]
const playerWarnings = sampleData.playerWarnings as PlayerWarning[]
const memberActions = sampleData.memberActions as MemberAction[]
const escalationCases = sampleData.escalationCases as EscalationCase[]
const gdprRequests = sampleData.gdprRequests as GDPRRequest[]

// Get user with most data (James Wilson - suspended, has warnings/actions)
const selectedUser = users.find(u => u.id === 'user-003') || users[0]

// Filter data for selected user
const userActivityEvents = activityEvents.filter(e => e.playerId === selectedUser.id)
const userAdminNotes = adminNotes.filter(n => n.playerId === selectedUser.id)
const userPlatformActions = platformActions.filter(a => a.playerId === selectedUser.id)
const userClubNotes = playerNotes.filter(n => n.playerId === selectedUser.id)
const userClubWarnings = playerWarnings.filter(w => w.playerId === selectedUser.id)
const userClubActions = memberActions.filter(a => a.playerId === selectedUser.id)
const userEscalations = escalationCases.filter(e => e.playerId === selectedUser.id)
const userGdprRequests = gdprRequests.filter(r => r.playerId === selectedUser.id)

export default function UserDetailView() {
  return (
    <UserDetail
      user={selectedUser}
      activityEvents={userActivityEvents}
      adminNotes={userAdminNotes}
      platformActions={userPlatformActions}
      clubNotes={userClubNotes}
      clubWarnings={userClubWarnings}
      clubActions={userClubActions}
      escalationCases={userEscalations}
      gdprRequests={userGdprRequests}
      canTakeAction={true}
      canImpersonate={true}
      canProcessGDPR={true}
      onAddNote={(content) => {
        console.log('Add note:', content)
        alert(`Note added: ${content}`)
      }}
      onIssuePlatformWarning={(action) => {
        console.log('Issue platform warning:', action)
        alert('Platform warning issued')
      }}
      onIssuePlatformSuspension={(action) => {
        console.log('Issue platform suspension:', action)
        alert('Platform suspension issued')
      }}
      onIssuePlatformBan={(action) => {
        console.log('Issue platform ban:', action)
        alert('Platform ban issued (requires approval)')
      }}
      onResetPassword={() => {
        console.log('Reset password for:', selectedUser.id)
        alert('Password reset email sent')
      }}
      onImpersonate={() => {
        console.log('Impersonate user:', selectedUser.id)
        alert(`Impersonating ${selectedUser.displayName}...`)
      }}
      onMergeAccount={(targetUserId) => {
        console.log('Merge account:', selectedUser.id, 'into', targetUserId)
        alert(`Account merge initiated with ${targetUserId}`)
      }}
      onProcessGDPRExport={(requestId) => {
        console.log('Process GDPR export:', requestId)
        alert('Generating data export...')
      }}
      onProcessGDPRDeletion={(requestId) => {
        console.log('Process GDPR deletion:', requestId)
        alert('Processing deletion request...')
      }}
      onBack={() => {
        console.log('Back to search')
        alert('Navigate back to user search')
      }}
    />
  )
}
