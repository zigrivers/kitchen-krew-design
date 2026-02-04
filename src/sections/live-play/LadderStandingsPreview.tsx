import { LadderView } from './components/LadderStandings'
import type { Ladder, LadderPosition, LadderChallenge } from '@/../product/sections/live-play/types'

// Sample ladder data (data.json doesn't include ladder scenario)
const sampleLadder: Ladder = {
  id: 'ladder-001',
  name: 'Club Championship Ladder',
  status: 'in_progress',
  startDate: '2026-01-01',
  endDate: '2026-03-31',
  challengeRange: 2, // Can challenge up to 2 positions above
  challengeDeadlineHours: 72,
  inactivityDropDays: 14,
  schedulingMode: 'self_scheduled',
}

const sampleStandings: LadderPosition[] = [
  { position: 1, teamId: 'team-001', displayName: 'Walsh / Kim', rating: 4.5, challengeable: false, lastActive: '2026-02-02' },
  { position: 2, teamId: 'team-002', displayName: 'Torres / Thompson', rating: 4.25, challengeable: true, lastActive: '2026-02-01' },
  { position: 3, teamId: 'team-003', displayName: 'Martinez / Patel', rating: 4.0, challengeable: false, lastActive: '2026-02-03' }, // Current user - has pending challenge
  { position: 4, teamId: 'team-004', displayName: 'Johnson / Brown', rating: 4.0, challengeable: true, lastActive: '2026-01-28', inactivityWarning: true },
  { position: 5, teamId: 'team-005', displayName: 'Garcia / Miller', rating: 3.75, challengeable: true, lastActive: '2026-02-02' },
  { position: 6, teamId: 'team-006', displayName: 'Lee / Wilson', rating: 3.75, challengeable: true, lastActive: '2026-02-01' },
  { position: 7, teamId: 'team-007', displayName: 'Davis / Moore', rating: 3.5, challengeable: false, lastActive: '2026-02-03' }, // Has incoming challenge
  { position: 8, teamId: 'team-008', displayName: 'Adams / Clark', rating: 3.5, challengeable: true, lastActive: '2026-01-30' },
]

const sampleChallenges: LadderChallenge[] = [
  {
    id: 'challenge-001',
    challengerId: 'team-003', // Martinez/Patel
    challengerPosition: 3,
    defenderId: 'team-002', // Torres/Thompson (position 2)
    defenderPosition: 2,
    status: 'pending',
    createdAt: '2026-02-02T14:00:00',
    deadline: '2026-02-05T14:00:00',
    scheduledMatchTime: null,
    matchId: null,
  },
  {
    id: 'challenge-002',
    challengerId: 'team-008', // Adams/Clark
    challengerPosition: 8,
    defenderId: 'team-007', // Davis/Moore
    defenderPosition: 7,
    status: 'accepted',
    createdAt: '2026-02-01T10:00:00',
    deadline: '2026-02-04T10:00:00',
    scheduledMatchTime: '2026-02-04T09:00:00',
    matchId: 'match-ladder-001',
  },
]

export default function LadderStandingsPreview() {
  // For preview, set current user as team-003 (Martinez/Patel at position 3)
  // This gives them an active challenge against position 2
  const previewUserId = 'team-003'

  return (
    <LadderView
      ladder={sampleLadder}
      standings={sampleStandings}
      challenges={sampleChallenges}
      currentUserId={previewUserId}
      onIssueChallenge={(defenderId) => console.log('Issue challenge to:', defenderId)}
      onAcceptChallenge={(challengeId) => console.log('Accept challenge:', challengeId)}
      onDeclineChallenge={(challengeId) => console.log('Decline challenge:', challengeId)}
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
      onScheduleMatch={(challengeId) => console.log('Schedule match for challenge:', challengeId)}
    />
  )
}
