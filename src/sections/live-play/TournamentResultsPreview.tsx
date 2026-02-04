import { TournamentResults } from './components/TournamentResults'
import type {
  TournamentResults as TournamentResultsType,
  PodiumPlacement,
  Bracket,
  BracketMatch,
  TournamentStats,
} from '@/../product/sections/live-play/types'

export default function TournamentResultsPreview() {
  // Create sample completed tournament results
  // Based on the bracket data but with finals completed
  const samplePodium: PodiumPlacement[] = [
    {
      place: 1,
      teamId: 'team-001',
      displayName: 'Walsh/Kim',
      players: [
        { id: 'plr-003', name: 'Jennifer Walsh' },
        { id: 'plr-004', name: 'David Kim' },
      ],
      seed: 1,
    },
    {
      place: 2,
      teamId: 'team-003',
      displayName: 'Martinez/Patel',
      players: [
        { id: 'plr-001', name: 'Sarah Martinez' },
        { id: 'plr-007', name: 'Lisa Patel' },
      ],
      seed: 3,
    },
    {
      place: 3,
      teamId: 'team-002',
      displayName: 'Torres/Thompson',
      players: [
        { id: 'plr-005', name: 'Michael Torres' },
        { id: 'plr-006', name: 'Brian Thompson' },
      ],
      seed: 2,
    },
  ]

  const sampleStats: TournamentStats = {
    totalMatches: 7,
    closestMatch: {
      matchId: 'bm-sf-1',
      margin: 2,
      teams: 'Jennifer Walsh / David Kim vs Marcus Chen / Amanda Foster',
    },
    biggestUpset: {
      matchId: 'bm-sf-2',
      seedDiff: 1,
      winner: 'Sarah Martinez / Lisa Patel (#3)',
      loser: 'Michael Torres / Brian Thompson (#2)',
    },
    highestScoringMatch: {
      matchId: 'bm-f',
      totalPoints: 67,
      teams: 'Jennifer Walsh / David Kim vs Sarah Martinez / Lisa Patel',
    },
  }

  // Champion's path through the bracket
  const championPath = ['bm-qf-1', 'bm-sf-1', 'bm-f']

  // Create completed bracket matches for the path
  const completedBracketMatches: BracketMatch[] = [
    // Quarterfinal
    {
      id: 'bm-qf-1',
      bracketId: 'bracket-001',
      roundNumber: 1,
      roundLabel: 'Quarterfinals',
      position: 1,
      matchId: 'match-101',
      seed1: 1,
      seed2: 8,
      team1: {
        teamId: 'team-001',
        seed: 1,
        players: [
          { id: 'plr-003', name: 'Jennifer Walsh' },
          { id: 'plr-004', name: 'David Kim' },
        ],
        displayName: 'Walsh/Kim',
      },
      team2: {
        teamId: 'team-008',
        seed: 8,
        players: [
          { id: 'plr-015', name: 'Daniel Lee' },
          { id: 'plr-016', name: 'Sophia Martinez' },
        ],
        displayName: 'Lee/Martinez',
      },
      scores: [{ team1: 11, team2: 5 }],
      winner: 'team1',
      status: 'completed',
      courtId: 'court-001',
      scheduledTime: '2026-02-01T10:00:00',
      startedAt: '2026-02-01T10:02:00',
      completedAt: '2026-02-01T10:18:00',
      winnerAdvancesTo: 'bm-sf-1',
      loserAdvancesTo: null,
    },
    // Semifinal
    {
      id: 'bm-sf-1',
      bracketId: 'bracket-001',
      roundNumber: 2,
      roundLabel: 'Semifinals',
      position: 1,
      matchId: 'match-105',
      seed1: 1,
      seed2: 4,
      team1: {
        teamId: 'team-001',
        seed: 1,
        players: [
          { id: 'plr-003', name: 'Jennifer Walsh' },
          { id: 'plr-004', name: 'David Kim' },
        ],
        displayName: 'Walsh/Kim',
      },
      team2: {
        teamId: 'team-004',
        seed: 4,
        players: [
          { id: 'plr-002', name: 'Marcus Chen' },
          { id: 'plr-008', name: 'Amanda Foster' },
        ],
        displayName: 'Chen/Foster',
      },
      scores: [
        { team1: 11, team2: 9 },
        { team1: 9, team2: 11 },
        { team1: 11, team2: 9 },
      ],
      winner: 'team1',
      status: 'completed',
      courtId: 'court-001',
      scheduledTime: '2026-02-01T11:30:00',
      startedAt: '2026-02-01T11:32:00',
      completedAt: '2026-02-01T12:15:00',
      winnerAdvancesTo: 'bm-f',
      loserAdvancesTo: 'bm-3rd',
    },
    // Finals
    {
      id: 'bm-f',
      bracketId: 'bracket-001',
      roundNumber: 3,
      roundLabel: 'Finals',
      position: 2,
      matchId: 'match-107',
      seed1: 1,
      seed2: 3,
      team1: {
        teamId: 'team-001',
        seed: 1,
        players: [
          { id: 'plr-003', name: 'Jennifer Walsh' },
          { id: 'plr-004', name: 'David Kim' },
        ],
        displayName: 'Walsh/Kim',
      },
      team2: {
        teamId: 'team-003',
        seed: 3,
        players: [
          { id: 'plr-001', name: 'Sarah Martinez' },
          { id: 'plr-007', name: 'Lisa Patel' },
        ],
        displayName: 'Martinez/Patel',
      },
      scores: [
        { team1: 11, team2: 8 },
        { team1: 9, team2: 11 },
        { team1: 11, team2: 6 },
      ],
      winner: 'team1',
      status: 'completed',
      courtId: 'court-001',
      scheduledTime: '2026-02-01T14:00:00',
      startedAt: '2026-02-01T14:05:00',
      completedAt: '2026-02-01T14:55:00',
      winnerAdvancesTo: null,
      loserAdvancesTo: null,
    },
  ]

  // Sample bracket structure
  const sampleBracket: Bracket = {
    id: 'bracket-001',
    tournamentId: 'tournament-001',
    type: 'winners',
    rounds: [
      { roundNumber: 1, label: 'Quarterfinals', matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T10:00:00', status: 'completed' },
      { roundNumber: 2, label: 'Semifinals', matchFormat: { type: 'best_of', games: 3, pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T11:30:00', status: 'completed' },
      { roundNumber: 3, label: 'Finals', matchFormat: { type: 'best_of', games: 3, pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T14:00:00', status: 'completed' },
    ],
  }

  const sampleResults: TournamentResultsType = {
    podium: samplePodium,
    bracket: sampleBracket,
    bracketMatches: completedBracketMatches,
    stats: sampleStats,
    championPath: championPath,
  }

  return (
    <TournamentResults
      results={sampleResults}
      onViewBracket={() => console.log('View bracket')}
      onShareResults={() => console.log('Share results')}
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
    />
  )
}
