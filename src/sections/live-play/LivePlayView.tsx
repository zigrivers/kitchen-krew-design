import { LivePlay } from './components'
import data from '@/../product/sections/live-play/data.json'
import type {
  LiveEvent,
  EventProgress,
  Court,
  Match,
  QueuedMatch,
  EventPlayer,
  Standing,
  ScoreDispute,
  CompletedMatchSummary,
  CurrentUser,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Sample Data (data.json doesn't have all required LivePlay fields)
// =============================================================================

// Sample matches with full Team objects
const sampleMatches: Match[] = [
  {
    id: 'match-001',
    courtId: 'court-001',
    status: 'in_progress',
    round: 4,
    roundLabel: 'Round 4',
    team1: {
      id: 'team-01',
      players: [
        { id: 'plr-101', name: 'Jennifer Walsh', skillRating: 4.5 },
        { id: 'plr-102', name: 'David Kim', skillRating: 4.25 },
      ],
    },
    team2: {
      id: 'team-03',
      players: [
        { id: 'plr-001', name: 'Sarah Martinez', skillRating: 4.0 },
        { id: 'plr-105', name: 'Lisa Patel', skillRating: 4.0 },
      ],
    },
    gameScores: [{ team1: 8, team2: 6 }],
    gamesPerMatch: 1,
    winner: null,
    startedAt: '2026-02-01T11:02:00',
    completedAt: null,
    duration: null,
    scoreConfirmed: false,
  },
  {
    id: 'match-002',
    courtId: 'court-002',
    status: 'in_progress',
    round: 4,
    team1: {
      id: 'team-02',
      players: [
        { id: 'plr-103', name: 'Michael Torres', skillRating: 4.5 },
        { id: 'plr-104', name: 'Brian Thompson', skillRating: 4.0 },
      ],
    },
    team2: {
      id: 'team-04',
      players: [
        { id: 'plr-106', name: 'Emily Chen', skillRating: 4.0 },
        { id: 'plr-107', name: 'Robert Lee', skillRating: 3.75 },
      ],
    },
    gameScores: [{ team1: 5, team2: 7 }],
    gamesPerMatch: 1,
    winner: null,
    startedAt: '2026-02-01T11:00:00',
    completedAt: null,
    duration: null,
    scoreConfirmed: false,
  },
  {
    id: 'match-003',
    courtId: 'court-003',
    status: 'calling',
    round: 4,
    team1: {
      id: 'team-05',
      players: [
        { id: 'plr-108', name: 'Amanda Johnson', skillRating: 3.75 },
        { id: 'plr-109', name: 'Chris Garcia', skillRating: 4.0 },
      ],
    },
    team2: {
      id: 'team-07',
      players: [
        { id: 'plr-110', name: 'Kevin Wilson', skillRating: 3.75 },
        { id: 'plr-111', name: 'Jessica Brown', skillRating: 3.5 },
      ],
    },
    gameScores: [],
    gamesPerMatch: 1,
    winner: null,
    startedAt: null,
    completedAt: null,
    duration: null,
    scoreConfirmed: false,
    calledAt: '2026-02-01T11:05:00',
  },
]

const sampleMatchQueue: QueuedMatch[] = [
  {
    id: 'match-004',
    round: 4,
    team1: { teamId: 'team-06', displayName: 'Lee / Wilson', players: ['Amy Lee', 'Mark Wilson'] },
    team2: { teamId: 'team-08', displayName: 'Davis / Moore', players: ['Tom Davis', 'Kate Moore'] },
    estimatedStartTime: '2026-02-01T11:15:00',
  },
  {
    id: 'match-005',
    round: 4,
    team1: { teamId: 'team-09', displayName: 'Adams / Clark', players: ['Jim Adams', 'Sue Clark'] },
    team2: { teamId: 'team-10', displayName: 'Hill / Scott', players: ['Bob Hill', 'Ann Scott'] },
    estimatedStartTime: '2026-02-01T11:25:00',
  },
]

const samplePlayers: EventPlayer[] = [
  { id: 'plr-101', name: 'Jennifer Walsh', skillRating: 4.5, checkedIn: true, currentMatchId: 'match-001', status: 'playing' },
  { id: 'plr-102', name: 'David Kim', skillRating: 4.25, checkedIn: true, currentMatchId: 'match-001', status: 'playing' },
  { id: 'plr-001', name: 'Sarah Martinez', skillRating: 4.0, checkedIn: true, currentMatchId: 'match-001', status: 'playing' },
  { id: 'plr-105', name: 'Lisa Patel', skillRating: 4.0, checkedIn: true, currentMatchId: 'match-001', status: 'playing' },
  { id: 'plr-103', name: 'Michael Torres', skillRating: 4.5, checkedIn: true, currentMatchId: 'match-002', status: 'playing' },
  { id: 'plr-104', name: 'Brian Thompson', skillRating: 4.0, checkedIn: true, currentMatchId: 'match-002', status: 'playing' },
  { id: 'plr-108', name: 'Amanda Johnson', skillRating: 3.75, checkedIn: true, currentMatchId: null, status: 'waiting' },
  { id: 'plr-109', name: 'Chris Garcia', skillRating: 4.0, checkedIn: true, currentMatchId: null, status: 'waiting' },
]

const sampleStandings: Standing[] = [
  { rank: 1, playerId: 'plr-101', playerName: 'Jennifer Walsh', wins: 4, losses: 0, pointDiff: 22 },
  { rank: 2, playerId: 'plr-103', playerName: 'Michael Torres', wins: 3, losses: 1, pointDiff: 15 },
  { rank: 3, playerId: 'plr-001', playerName: 'Sarah Martinez', wins: 3, losses: 1, pointDiff: 10 },
  { rank: 4, playerId: 'plr-108', playerName: 'Amanda Johnson', wins: 2, losses: 2, pointDiff: 2 },
  { rank: 5, playerId: 'plr-110', playerName: 'Kevin Wilson', wins: 2, losses: 2, pointDiff: -3 },
  { rank: 6, playerId: 'plr-106', playerName: 'Emily Chen', wins: 1, losses: 3, pointDiff: -8 },
]

const sampleCompletedMatches: CompletedMatchSummary[] = [
  { id: 'match-c1', round: 3, team1Name: 'Walsh / Kim', team2Name: 'Torres / Thompson', score: '11-9', winner: 'Walsh / Kim', court: 'Court 1', completedAt: '2026-02-01T10:45:00' },
  { id: 'match-c2', round: 3, team1Name: 'Martinez / Patel', team2Name: 'Johnson / Garcia', score: '11-7', winner: 'Martinez / Patel', court: 'Court 2', completedAt: '2026-02-01T10:42:00' },
  { id: 'match-c3', round: 3, team1Name: 'Chen / Lee', team2Name: 'Wilson / Brown', score: '11-8', winner: 'Wilson / Brown', court: 'Court 3', completedAt: '2026-02-01T10:48:00' },
]

const sampleScoreDisputes: ScoreDispute[] = []

// =============================================================================
// Preview Wrapper
// =============================================================================

export default function LivePlayView() {
  return (
    <LivePlay
      currentUser={data.currentUser as CurrentUser}
      event={data.roundRobinEvent as LiveEvent}
      eventProgress={data.roundRobinEventProgress as EventProgress}
      courts={data.courts as Court[]}
      matches={sampleMatches}
      matchQueue={sampleMatchQueue}
      players={samplePlayers}
      standings={sampleStandings}
      scoreDisputes={sampleScoreDisputes}
      completedMatches={sampleCompletedMatches}
      // Player actions
      onCourtCheckIn={(matchId) => console.log('Check in:', matchId)}
      onSubmitScore={(matchId, t1, t2) => console.log('Submit score:', matchId, t1, t2)}
      onConfirmScore={(matchId) => console.log('Confirm score:', matchId)}
      onDisputeScore={(matchId) => console.log('Dispute score:', matchId)}
      // GM actions
      onCallMatch={(matchId, courtId) => console.log('Call match:', matchId, courtId)}
      onStartMatch={(matchId) => console.log('Start match:', matchId)}
      onEnterScore={(matchId, t1, t2) => console.log('Enter score:', matchId, t1, t2)}
      onResolveDispute={(disputeId, t1, t2) => console.log('Resolve:', disputeId, t1, t2)}
      onMarkNoShow={(matchId, playerId) => console.log('No show:', matchId, playerId)}
      onSubstitutePlayer={(matchId, old, newP) => console.log('Sub:', matchId, old, newP)}
      onReorderQueue={(matchId, pos) => console.log('Reorder:', matchId, pos)}
      onPauseEvent={(reason) => console.log('Pause:', reason)}
      onResumeEvent={() => console.log('Resume')}
      onEndEvent={() => console.log('End event')}
      // Navigation
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
      onViewMatch={(matchId) => console.log('View match:', matchId)}
      onOpenCourtBoard={() => console.log('Open court board')}
    />
  )
}
