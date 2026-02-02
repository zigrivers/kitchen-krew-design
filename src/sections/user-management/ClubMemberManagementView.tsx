import { ClubMemberManagement } from './components/ClubMemberManagement'
import sampleData from '@/../product/sections/user-management/data.json'
import type {
  UserAccount,
  PlayerNote,
  PlayerWarning,
  MemberAction,
  ActivityEvent,
} from '@/../product/sections/user-management/types'

// Cast sample data to proper types
const users = sampleData.userAccounts as UserAccount[]
const allNotes = sampleData.playerNotes as PlayerNote[]
const allWarnings = sampleData.playerWarnings as PlayerWarning[]
const allActions = sampleData.memberActions as MemberAction[]
const allActivityEvents = sampleData.activityEvents as ActivityEvent[]

// Select James Wilson (user-003) - suspended user with warnings and actions
// This shows the full Club Admin experience with history
const selectedPlayer = users.find((u) => u.id === 'user-003') || users[0]

// Simulated club context
const CLUB_ID = 'club-001'
const CLUB_NAME = 'Austin Pickleball Club'

// Filter data for this player at this club
const playerNotes = allNotes.filter(
  (n) => n.playerId === selectedPlayer.id && n.clubId === CLUB_ID
)
const playerWarnings = allWarnings.filter(
  (w) => w.playerId === selectedPlayer.id && w.clubId === CLUB_ID
)
const playerActions = allActions.filter(
  (a) => a.playerId === selectedPlayer.id && a.clubId === CLUB_ID
)
const playerActivityEvents = allActivityEvents.filter((e) => e.playerId === selectedPlayer.id)

export default function ClubMemberManagementView() {
  return (
    <ClubMemberManagement
      player={selectedPlayer}
      notes={playerNotes}
      warnings={playerWarnings}
      actions={playerActions}
      activityEvents={playerActivityEvents}
      clubId={CLUB_ID}
      clubName={CLUB_NAME}
      canWarn={true}
      canSuspend={true}
      canEscalate={true}
      onAddNote={(note) => {
        console.log('Add note:', note)
        alert(`Note added: [${note.category}] ${note.content}`)
      }}
      onIssueWarning={(warning) => {
        console.log('Issue warning:', warning)
        alert(`Warning issued: ${warning.warningType} - ${warning.description}`)
      }}
      onSuspend={(action) => {
        console.log('Suspend member:', action)
        alert(`Member suspended for ${action.duration}: ${action.description}`)
      }}
      onBan={(action) => {
        console.log('Ban member:', action)
        const confirmed = confirm(
          'Are you sure you want to permanently ban this member? This action requires appeal to reverse.'
        )
        if (confirmed) {
          alert(`Member banned: ${action.description}`)
        }
      }}
      onLiftSuspension={(actionId) => {
        console.log('Lift suspension:', actionId)
        const confirmed = confirm('Are you sure you want to lift this suspension early?')
        if (confirmed) {
          alert('Suspension lifted early')
        }
      }}
      onEscalate={(escalation) => {
        console.log('Escalate to platform:', escalation)
        alert(
          `Case escalated to Platform Review:\n\nReason: ${escalation.reason}\n\nDescription: ${escalation.description}\n\nEvidence items: ${escalation.evidence.length}`
        )
      }}
    />
  )
}
