import { ScoreEntryModal } from './components/ScoreEntryModal'
import type { ScoreEntryMatchContext, ScoringRules } from '@/../product/sections/live-play/types'

/**
 * Preview wrapper for the Score Entry Modal
 * Shows a Best of 3 semifinals match with 2 games already played (1-1)
 */

const sampleMatchContext: ScoreEntryMatchContext = {
  matchId: 'match-semi-001',
  bracketMatchId: 'bm-5',
  roundLabel: 'Semifinals',
  courtName: 'Court 1',
  startedAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
  team1: {
    teamId: 'team-001',
    displayName: 'Walsh / Kim',
    seed: 1,
    players: [
      { id: 'plr-101', name: 'Jennifer Walsh', skillRating: 4.5 },
      { id: 'plr-102', name: 'David Kim', skillRating: 4.25 },
    ],
  },
  team2: {
    teamId: 'team-004',
    displayName: 'Torres / Thompson',
    seed: 4,
    players: [
      { id: 'plr-103', name: 'Michael Torres', skillRating: 4.5 },
      { id: 'plr-104', name: 'Brian Thompson', skillRating: 4.0 },
    ],
  },
  existingScores: [
    { team1: 11, team2: 7 },  // Game 1: Team 1 wins
    { team1: 9, team2: 11 },  // Game 2: Team 2 wins
  ],
  gamesPerMatch: 3, // Best of 3
}

const sampleScoringRules: ScoringRules = {
  pointsToWin: 11,
  winByTwo: true,
  pointCap: 15,
  gamesPerMatch: 3,
  rallyScoring: false,
}

export default function ScoreEntryModalPreview() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <ScoreEntryModal
        match={sampleMatchContext}
        scoringRules={sampleScoringRules}
        isModal={false}
        onSubmit={(scores, winner) =>
          console.log('Submit scores:', scores, 'Winner:', winner)
        }
        onSubmitGame={(gameNumber, score) =>
          console.log('Submit game', gameNumber, ':', score)
        }
        onClose={() => console.log('Close modal')}
        onMarkForfeit={(team) => console.log('Forfeit by:', team)}
      />
    </div>
  )
}
