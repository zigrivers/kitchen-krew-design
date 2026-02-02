import data from '@/../product/sections/live-play/data.json'
import { LadderView } from './components/LadderStandings'
import type { Ladder, LadderPosition, LadderChallenge } from '@/../product/sections/live-play/types'

export default function LadderStandingsPreview() {
  // Use the example ladder data from data.json
  const ladderData = data.ladderExample as {
    ladder: Ladder
    standings: LadderPosition[]
    challenges: LadderChallenge[]
  }

  // For preview, set current user as team-003 (Martinez/Patel at position 3)
  // This gives them an active challenge against position 2
  const previewUserId = 'team-003'

  return (
    <LadderView
      ladder={ladderData.ladder}
      standings={ladderData.standings}
      challenges={ladderData.challenges}
      currentUserId={previewUserId}
      onIssueChallenge={(defenderId) => console.log('Issue challenge to:', defenderId)}
      onAcceptChallenge={(challengeId) => console.log('Accept challenge:', challengeId)}
      onDeclineChallenge={(challengeId) => console.log('Decline challenge:', challengeId)}
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
      onScheduleMatch={(challengeId) => console.log('Schedule match for challenge:', challengeId)}
    />
  )
}
