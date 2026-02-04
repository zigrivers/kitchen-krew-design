import data from '@/../product/sections/live-play/data.json'
import { CourtStatusBoard } from './components/CourtStatusBoard'
import type { Court, Match, LiveEvent } from '@/../product/sections/live-play/types'

// Sample matches for the court status board
// Transform roundRobinMatches to Match format with full team objects
const sampleMatches: Match[] = [
  {
    id: 'match-001',
    courtId: 'court-001',
    status: 'in_progress',
    round: 4,
    roundLabel: 'Round 4',
    team1: {
      id: 'rr-team-01',
      players: [
        { id: 'plr-101', name: 'Jennifer Walsh', skillRating: 4.5 },
        { id: 'plr-102', name: 'David Kim', skillRating: 4.25 },
      ],
    },
    team2: {
      id: 'rr-team-03',
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
    roundLabel: 'Round 4',
    team1: {
      id: 'rr-team-02',
      players: [
        { id: 'plr-103', name: 'Michael Torres', skillRating: 4.5 },
        { id: 'plr-104', name: 'Brian Thompson', skillRating: 4.0 },
      ],
    },
    team2: {
      id: 'rr-team-04',
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
    roundLabel: 'Round 4',
    team1: {
      id: 'rr-team-05',
      players: [
        { id: 'plr-108', name: 'Amanda Johnson', skillRating: 3.75 },
        { id: 'plr-109', name: 'Chris Garcia', skillRating: 4.0 },
      ],
    },
    team2: {
      id: 'rr-team-07',
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

export default function CourtStatusBoardPreview() {
  return (
    <CourtStatusBoard
      courts={data.courts as Court[]}
      matches={sampleMatches}
      event={data.roundRobinEvent as LiveEvent}
      onClose={() => console.log('Close court status board')}
    />
  )
}
