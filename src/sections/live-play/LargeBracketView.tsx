import { LargeBracketView } from './components/LargeBracketView'
import type { Bracket, BracketMatch, BracketTeam, EventProgress } from '@/../product/sections/live-play/types'

/**
 * Preview wrapper for the Large Bracket View
 * Uses inline sample data for a 16-team bracket
 */

// Helper to create a team
const team = (seed: number, name1: string, name2: string): BracketTeam => ({
  teamId: `t-${seed}`,
  seed,
  players: [
    { id: `p-${seed}a`, name: name1, skillRating: 4.5 - seed * 0.1 },
    { id: `p-${seed}b`, name: name2, skillRating: 4.5 - seed * 0.1 },
  ],
  displayName: `${name1.split(' ')[0]} / ${name2.split(' ')[0]}`,
})

// 16-team bracket (4 rounds, 15 matches)
const sampleBracket: Bracket = {
  id: 'bracket-large-001',
  tournamentId: 'tournament-001',
  type: 'winners',
  rounds: [
    { roundNumber: 1, label: 'Round of 16', matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T09:00:00', status: 'completed' },
    { roundNumber: 2, label: 'Quarterfinals', matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T11:00:00', status: 'in_progress' },
    { roundNumber: 3, label: 'Semifinals', matchFormat: { type: 'best_of', games: 3, pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T14:00:00', status: 'upcoming' },
    { roundNumber: 4, label: 'Finals', matchFormat: { type: 'best_of', games: 3, pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T16:00:00', status: 'upcoming' },
  ],
}

// Create match helper
const createMatch = (
  id: string, round: number, label: string, pos: number,
  t1: BracketTeam | null, t2: BracketTeam | null,
  status: 'completed' | 'in_progress' | 'upcoming',
  winner: 'team1' | 'team2' | null = null,
  scores: { team1: number; team2: number }[] = []
): BracketMatch => ({
  id, bracketId: 'bracket-large-001', roundNumber: round, roundLabel: label, position: pos,
  matchId: status !== 'upcoming' ? `m-${id}` : null, seed1: t1?.seed || null, seed2: t2?.seed || null,
  team1: t1, team2: t2, scores, winner, status,
  courtId: status === 'in_progress' ? `court-${pos}` : null,
  scheduledTime: sampleBracket.rounds[round - 1].scheduledTime,
  startedAt: status !== 'upcoming' ? sampleBracket.rounds[round - 1].scheduledTime : null,
  completedAt: status === 'completed' ? sampleBracket.rounds[round - 1].scheduledTime : null,
  winnerAdvancesTo: round < 4 ? `bm-r${round + 1}-${Math.ceil(pos / 2)}` : null,
  loserAdvancesTo: null,
})

// Teams (seeded 1-16)
const teams = [
  team(1, 'Walsh', 'Kim'), team(2, 'Torres', 'Thompson'), team(3, 'Martinez', 'Patel'), team(4, 'Johnson', 'Brown'),
  team(5, 'Garcia', 'Miller'), team(6, 'Lee', 'Wilson'), team(7, 'Davis', 'Moore'), team(8, 'Adams', 'Clark'),
  team(9, 'Hill', 'Scott'), team(10, 'Green', 'Baker'), team(11, 'Hall', 'Allen'), team(12, 'Young', 'King'),
  team(13, 'Wright', 'Lopez'), team(14, 'Harris', 'Robinson'), team(15, 'Lewis', 'Walker'), team(16, 'White', 'Martin'),
]

const sampleBracketMatches: BracketMatch[] = [
  // Round of 16 (8 matches) - all completed
  createMatch('bm-r1-1', 1, 'Round of 16', 1, teams[0], teams[15], 'completed', 'team1', [{ team1: 11, team2: 3 }]),
  createMatch('bm-r1-2', 1, 'Round of 16', 2, teams[7], teams[8], 'completed', 'team1', [{ team1: 11, team2: 8 }]),
  createMatch('bm-r1-3', 1, 'Round of 16', 3, teams[3], teams[12], 'completed', 'team1', [{ team1: 11, team2: 6 }]),
  createMatch('bm-r1-4', 1, 'Round of 16', 4, teams[4], teams[11], 'completed', 'team1', [{ team1: 11, team2: 9 }]),
  createMatch('bm-r1-5', 1, 'Round of 16', 5, teams[2], teams[13], 'completed', 'team1', [{ team1: 11, team2: 5 }]),
  createMatch('bm-r1-6', 1, 'Round of 16', 6, teams[5], teams[10], 'completed', 'team1', [{ team1: 11, team2: 7 }]),
  createMatch('bm-r1-7', 1, 'Round of 16', 7, teams[1], teams[14], 'completed', 'team1', [{ team1: 11, team2: 4 }]),
  createMatch('bm-r1-8', 1, 'Round of 16', 8, teams[6], teams[9], 'completed', 'team2', [{ team1: 9, team2: 11 }]),
  // Quarterfinals (4 matches) - 2 in progress, 2 upcoming
  createMatch('bm-r2-1', 2, 'Quarterfinals', 1, teams[0], teams[7], 'in_progress', null, [{ team1: 7, team2: 5 }]),
  createMatch('bm-r2-2', 2, 'Quarterfinals', 2, teams[3], teams[4], 'in_progress', null, [{ team1: 6, team2: 8 }]),
  createMatch('bm-r2-3', 2, 'Quarterfinals', 3, teams[2], teams[5], 'upcoming'),
  createMatch('bm-r2-4', 2, 'Quarterfinals', 4, teams[1], teams[9], 'upcoming'),
  // Semifinals (2 matches) - upcoming
  createMatch('bm-r3-1', 3, 'Semifinals', 1, null, null, 'upcoming'),
  createMatch('bm-r3-2', 3, 'Semifinals', 2, null, null, 'upcoming'),
  // Finals - upcoming
  createMatch('bm-r4-1', 4, 'Finals', 1, null, null, 'upcoming'),
]

const sampleEventProgress: EventProgress = {
  totalMatches: 15,
  completedMatches: 8,
  inProgressMatches: 2,
  remainingMatches: 5,
  currentRound: 2,
  totalRounds: 4,
  currentRoundLabel: 'Quarterfinals',
  elapsedMinutes: 150,
  estimatedRemainingMinutes: 180,
}

export default function LargeBracketViewPreview() {
  return (
    <LargeBracketView
      bracket={sampleBracket}
      bracketMatches={sampleBracketMatches}
      currentUserId="p-3a" // Martinez - seed 3, in Quarterfinals
      isGameManager={false}
      tournamentName="Spring Championship Tournament"
      eventProgress={sampleEventProgress}
      shareableLink="https://pickleplay.app/bracket/spring-2026"
      onViewMatch={(id) => console.log('View match:', id)}
      onStartMatch={(id) => console.log('Start match:', id)}
      onEnterScore={(id) => console.log('Enter score:', id)}
      onShareBracket={() => console.log('Share bracket')}
      onZoomChange={(level) => console.log('Zoom changed:', level)}
    />
  )
}
