import data from '@/../product/sections/live-play/data.json'
import { BracketView } from './components/BracketView'
import type { Bracket, BracketMatch, Tournament, EventProgress } from '@/../product/sections/live-play/types'

// Sample bracket data for preview (data.json doesn't include bracket scenario)
const sampleBracket: Bracket = {
  id: 'bracket-001',
  tournamentId: 'tournament-001',
  type: 'winners',
  rounds: [
    { roundNumber: 1, label: 'Quarterfinals', matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T10:00:00', status: 'completed' },
    { roundNumber: 2, label: 'Semifinals', matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T12:00:00', status: 'in_progress' },
    { roundNumber: 3, label: 'Finals', matchFormat: { type: 'best_of', games: 3, pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T14:00:00', status: 'upcoming' },
  ],
}

const sampleBracketMatches: BracketMatch[] = [
  // Quarterfinals (Round 1)
  { id: 'bm-1', bracketId: 'bracket-001', roundNumber: 1, roundLabel: 'Quarterfinals', position: 1, matchId: 'm-1', seed1: 1, seed2: 8, team1: { teamId: 't-1', seed: 1, players: [{ id: 'p-1', name: 'Walsh', skillRating: 4.5 }, { id: 'p-2', name: 'Kim', skillRating: 4.25 }], displayName: 'Walsh / Kim' }, team2: { teamId: 't-8', seed: 8, players: [{ id: 'p-15', name: 'Adams', skillRating: 3.5 }, { id: 'p-16', name: 'Clark', skillRating: 3.5 }], displayName: 'Adams / Clark' }, scores: [{ team1: 11, team2: 5 }], winner: 'team1', status: 'completed', courtId: 'court-1', scheduledTime: '2026-02-01T10:00:00', startedAt: '2026-02-01T10:02:00', completedAt: '2026-02-01T10:18:00', winnerAdvancesTo: 'bm-5', loserAdvancesTo: null },
  { id: 'bm-2', bracketId: 'bracket-001', roundNumber: 1, roundLabel: 'Quarterfinals', position: 2, matchId: 'm-2', seed1: 4, seed2: 5, team1: { teamId: 't-4', seed: 4, players: [{ id: 'p-7', name: 'Torres', skillRating: 4.0 }, { id: 'p-8', name: 'Thompson', skillRating: 4.0 }], displayName: 'Torres / Thompson' }, team2: { teamId: 't-5', seed: 5, players: [{ id: 'p-9', name: 'Garcia', skillRating: 3.75 }, { id: 'p-10', name: 'Miller', skillRating: 4.0 }], displayName: 'Garcia / Miller' }, scores: [{ team1: 11, team2: 9 }], winner: 'team1', status: 'completed', courtId: 'court-2', scheduledTime: '2026-02-01T10:00:00', startedAt: '2026-02-01T10:01:00', completedAt: '2026-02-01T10:22:00', winnerAdvancesTo: 'bm-5', loserAdvancesTo: null },
  { id: 'bm-3', bracketId: 'bracket-001', roundNumber: 1, roundLabel: 'Quarterfinals', position: 3, matchId: 'm-3', seed1: 3, seed2: 6, team1: { teamId: 't-3', seed: 3, players: [{ id: 'p-5', name: 'Martinez', skillRating: 4.0 }, { id: 'p-6', name: 'Patel', skillRating: 4.0 }], displayName: 'Martinez / Patel' }, team2: { teamId: 't-6', seed: 6, players: [{ id: 'p-11', name: 'Lee', skillRating: 3.75 }, { id: 'p-12', name: 'Wilson', skillRating: 3.75 }], displayName: 'Lee / Wilson' }, scores: [{ team1: 11, team2: 7 }], winner: 'team1', status: 'completed', courtId: 'court-3', scheduledTime: '2026-02-01T10:00:00', startedAt: '2026-02-01T10:03:00', completedAt: '2026-02-01T10:20:00', winnerAdvancesTo: 'bm-6', loserAdvancesTo: null },
  { id: 'bm-4', bracketId: 'bracket-001', roundNumber: 1, roundLabel: 'Quarterfinals', position: 4, matchId: 'm-4', seed1: 2, seed2: 7, team1: { teamId: 't-2', seed: 2, players: [{ id: 'p-3', name: 'Johnson', skillRating: 4.25 }, { id: 'p-4', name: 'Brown', skillRating: 4.0 }], displayName: 'Johnson / Brown' }, team2: { teamId: 't-7', seed: 7, players: [{ id: 'p-13', name: 'Davis', skillRating: 3.5 }, { id: 'p-14', name: 'Moore', skillRating: 3.75 }], displayName: 'Davis / Moore' }, scores: [{ team1: 11, team2: 6 }], winner: 'team1', status: 'completed', courtId: 'court-4', scheduledTime: '2026-02-01T10:00:00', startedAt: '2026-02-01T10:00:00', completedAt: '2026-02-01T10:15:00', winnerAdvancesTo: 'bm-6', loserAdvancesTo: null },
  // Semifinals (Round 2)
  { id: 'bm-5', bracketId: 'bracket-001', roundNumber: 2, roundLabel: 'Semifinals', position: 1, matchId: 'm-5', seed1: 1, seed2: 4, team1: { teamId: 't-1', seed: 1, players: [{ id: 'p-1', name: 'Walsh', skillRating: 4.5 }, { id: 'p-2', name: 'Kim', skillRating: 4.25 }], displayName: 'Walsh / Kim' }, team2: { teamId: 't-4', seed: 4, players: [{ id: 'p-7', name: 'Torres', skillRating: 4.0 }, { id: 'p-8', name: 'Thompson', skillRating: 4.0 }], displayName: 'Torres / Thompson' }, scores: [{ team1: 8, team2: 6 }], winner: null, status: 'in_progress', courtId: 'court-1', scheduledTime: '2026-02-01T12:00:00', startedAt: '2026-02-01T12:02:00', completedAt: null, winnerAdvancesTo: 'bm-7', loserAdvancesTo: null, awaitingWinnerFrom: ['bm-1', 'bm-2'] },
  { id: 'bm-6', bracketId: 'bracket-001', roundNumber: 2, roundLabel: 'Semifinals', position: 2, matchId: 'm-6', seed1: 3, seed2: 2, team1: { teamId: 't-3', seed: 3, players: [{ id: 'p-5', name: 'Martinez', skillRating: 4.0 }, { id: 'p-6', name: 'Patel', skillRating: 4.0 }], displayName: 'Martinez / Patel' }, team2: { teamId: 't-2', seed: 2, players: [{ id: 'p-3', name: 'Johnson', skillRating: 4.25 }, { id: 'p-4', name: 'Brown', skillRating: 4.0 }], displayName: 'Johnson / Brown' }, scores: [], winner: null, status: 'upcoming', courtId: null, scheduledTime: '2026-02-01T12:00:00', startedAt: null, completedAt: null, winnerAdvancesTo: 'bm-7', loserAdvancesTo: null, awaitingWinnerFrom: ['bm-3', 'bm-4'] },
  // Finals (Round 3)
  { id: 'bm-7', bracketId: 'bracket-001', roundNumber: 3, roundLabel: 'Finals', position: 1, matchId: null, seed1: null, seed2: null, team1: null, team2: null, scores: [], winner: null, status: 'upcoming', courtId: null, scheduledTime: '2026-02-01T14:00:00', startedAt: null, completedAt: null, winnerAdvancesTo: null, loserAdvancesTo: null, awaitingWinnerFrom: ['bm-5', 'bm-6'] },
]

const sampleTournament: Tournament = {
  id: 'tournament-001',
  eventId: 'event-001',
  bracketType: 'single_elimination',
  seedingMethod: 'rating',
  matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 },
  finalsFormat: { type: 'best_of', games: 3, pointsToWin: 11, winByTwo: true, pointCap: 15 },
  consolation: 'none',
  thirdPlace: false,
  multiDay: false,
}

const sampleEventProgress: EventProgress = {
  totalMatches: 7,
  completedMatches: 4,
  inProgressMatches: 1,
  currentRound: 2,
  totalRounds: 3,
}

export default function BracketViewPreview() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <BracketView
        bracket={sampleBracket}
        bracketMatches={sampleBracketMatches}
        currentUserId={data.currentUser.id}
        isGameManager={false}
        eventProgress={sampleEventProgress}
        tournament={sampleTournament}
        onViewMatch={(id) => console.log('View match:', id)}
        onStartMatch={(id) => console.log('Start match:', id)}
        onEnterScore={(id) => console.log('Enter score:', id)}
        onShareBracket={() => console.log('Share bracket')}
      />
    </div>
  )
}
