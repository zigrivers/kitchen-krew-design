import { TournamentDashboard } from './components/TournamentDashboard'
import type {
  LiveEvent,
  Tournament,
  EventProgress,
  Bracket,
  BracketMatch,
  BracketTeam,
  CourtAssignment,
  RoundSchedule,
  TournamentTimelineEvent,
  TournamentAlert,
  TournamentQuickStats,
  Seed,
  CompletedBracketMatchSummary,
  ScoreDispute,
} from '@/../product/sections/live-play/types'

/**
 * Preview wrapper for the Tournament Dashboard
 * Shows the GM control center for managing an 8-team single elimination tournament
 */

// Helper to create teams
const team = (seed: number, name1: string, name2: string): BracketTeam => ({
  teamId: `t-${seed}`,
  seed,
  players: [
    { id: `p-${seed}a`, name: name1, skillRating: 4.5 - seed * 0.1 },
    { id: `p-${seed}b`, name: name2, skillRating: 4.4 - seed * 0.1 },
  ],
  displayName: `${name1.split(' ')[0]} / ${name2.split(' ')[0]}`,
})

// Teams
const teams = [
  team(1, 'Jennifer Walsh', 'David Kim'),
  team(2, 'Michael Torres', 'Brian Thompson'),
  team(3, 'Sarah Martinez', 'Lisa Patel'),
  team(4, 'Amanda Johnson', 'Chris Garcia'),
  team(5, 'Emily Chen', 'Robert Lee'),
  team(6, 'Kevin Wilson', 'Jessica Brown'),
  team(7, 'Tom Davis', 'Kate Moore'),
  team(8, 'Jim Adams', 'Sue Clark'),
]

// Sample Event
const sampleEvent: LiveEvent = {
  id: 'evt-001',
  name: 'Spring Doubles Championship',
  format: 'single_elimination',
  status: 'in_progress',
  isPaused: false,
  pauseReason: null,
  venue: { id: 'ven-001', name: 'Riverside Recreation Center', address: '1250 Riverside Dr, Austin, TX' },
  organizer: { id: 'org-001', name: 'Marcus Chen' },
  startedAt: '2026-02-01T09:00:00',
  scheduledEndTime: '2026-02-01T15:00:00',
  scoringRules: { pointsToWin: 11, winByTwo: true, pointCap: 15, gamesPerMatch: 1, rallyScoring: false },
  settings: { allowPlayerScoreEntry: true, requireScoreConfirmation: true, gracePeriodMinutes: 3 },
}

// Sample Tournament
const sampleTournament: Tournament = {
  id: 'tourn-001',
  eventId: 'evt-001',
  bracketType: 'single_elimination',
  seedingMethod: 'rating',
  bracketSize: 8,
  registeredTeams: 8,
  byeCount: 0,
  matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 },
  finalsFormat: { type: 'best_of', games: 3, pointsToWin: 11, winByTwo: true, pointCap: 15 },
  matchFormatByRound: {},
  consolationBracket: false,
  thirdPlaceMatch: false,
  grandFinalsReset: false,
  multiDay: null,
  shareableLink: 'https://pickleplay.app/t/spring-2026',
  isPublic: true,
}

// Sample Bracket
const sampleBracket: Bracket = {
  id: 'bracket-001',
  tournamentId: 'tourn-001',
  type: 'winners',
  rounds: [
    { roundNumber: 1, label: 'Quarterfinals', matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T10:00:00', status: 'completed' },
    { roundNumber: 2, label: 'Semifinals', matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T12:00:00', status: 'in_progress' },
    { roundNumber: 3, label: 'Finals', matchFormat: { type: 'best_of', games: 3, pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T14:00:00', status: 'upcoming' },
  ],
}

// Sample Bracket Matches
const sampleBracketMatches: BracketMatch[] = [
  // Quarterfinals - completed
  { id: 'bm-1', bracketId: 'bracket-001', roundNumber: 1, roundLabel: 'Quarterfinals', position: 1, matchId: 'm-1', seed1: 1, seed2: 8, team1: teams[0], team2: teams[7], scores: [{ team1: 11, team2: 4 }], winner: 'team1', status: 'completed', courtId: 'court-1', scheduledTime: '2026-02-01T10:00:00', startedAt: '2026-02-01T10:02:00', completedAt: '2026-02-01T10:18:00', winnerAdvancesTo: 'bm-5', loserAdvancesTo: null },
  { id: 'bm-2', bracketId: 'bracket-001', roundNumber: 1, roundLabel: 'Quarterfinals', position: 2, matchId: 'm-2', seed1: 4, seed2: 5, team1: teams[3], team2: teams[4], scores: [{ team1: 11, team2: 8 }], winner: 'team1', status: 'completed', courtId: 'court-2', scheduledTime: '2026-02-01T10:00:00', startedAt: '2026-02-01T10:01:00', completedAt: '2026-02-01T10:20:00', winnerAdvancesTo: 'bm-5', loserAdvancesTo: null },
  { id: 'bm-3', bracketId: 'bracket-001', roundNumber: 1, roundLabel: 'Quarterfinals', position: 3, matchId: 'm-3', seed1: 3, seed2: 6, team1: teams[2], team2: teams[5], scores: [{ team1: 11, team2: 6 }], winner: 'team1', status: 'completed', courtId: 'court-3', scheduledTime: '2026-02-01T10:00:00', startedAt: '2026-02-01T10:03:00', completedAt: '2026-02-01T10:19:00', winnerAdvancesTo: 'bm-6', loserAdvancesTo: null },
  { id: 'bm-4', bracketId: 'bracket-001', roundNumber: 1, roundLabel: 'Quarterfinals', position: 4, matchId: 'm-4', seed1: 2, seed2: 7, team1: teams[1], team2: teams[6], scores: [{ team1: 11, team2: 5 }], winner: 'team1', status: 'completed', courtId: 'court-4', scheduledTime: '2026-02-01T10:00:00', startedAt: '2026-02-01T10:00:00', completedAt: '2026-02-01T10:16:00', winnerAdvancesTo: 'bm-6', loserAdvancesTo: null },
  // Semifinals - in progress
  { id: 'bm-5', bracketId: 'bracket-001', roundNumber: 2, roundLabel: 'Semifinals', position: 1, matchId: 'm-5', seed1: 1, seed2: 4, team1: teams[0], team2: teams[3], scores: [{ team1: 8, team2: 6 }], winner: null, status: 'in_progress', courtId: 'court-1', scheduledTime: '2026-02-01T12:00:00', startedAt: '2026-02-01T12:02:00', completedAt: null, winnerAdvancesTo: 'bm-7', loserAdvancesTo: null },
  { id: 'bm-6', bracketId: 'bracket-001', roundNumber: 2, roundLabel: 'Semifinals', position: 2, matchId: 'm-6', seed1: 3, seed2: 2, team1: teams[2], team2: teams[1], scores: [], winner: null, status: 'upcoming', courtId: null, scheduledTime: '2026-02-01T12:00:00', startedAt: null, completedAt: null, winnerAdvancesTo: 'bm-7', loserAdvancesTo: null },
  // Finals - upcoming
  { id: 'bm-7', bracketId: 'bracket-001', roundNumber: 3, roundLabel: 'Finals', position: 1, matchId: null, seed1: null, seed2: null, team1: null, team2: null, scores: [], winner: null, status: 'upcoming', courtId: null, scheduledTime: '2026-02-01T14:00:00', startedAt: null, completedAt: null, winnerAdvancesTo: null, loserAdvancesTo: null },
]

// Sample Court Assignments
const sampleCourtAssignments: CourtAssignment[] = [
  { courtId: 'court-1', courtName: 'Court 1', status: 'in_progress', currentMatchId: 'bm-5', attributes: { indoor: true, surface: 'sport_court', lighting: true } },
  { courtId: 'court-2', courtName: 'Court 2', status: 'available', currentMatchId: null, attributes: { indoor: true, surface: 'sport_court', lighting: true } },
  { courtId: 'court-3', courtName: 'Court 3', status: 'available', currentMatchId: null, attributes: { indoor: true, surface: 'sport_court', lighting: true } },
  { courtId: 'court-4', courtName: 'Court 4', status: 'available', currentMatchId: null, attributes: { indoor: true, surface: 'sport_court', lighting: true } },
]

// Sample Round Schedules
const sampleRoundSchedules: RoundSchedule[] = [
  { roundNumber: 1, roundLabel: 'Quarterfinals', matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T10:00:00', status: 'completed', matches: sampleBracketMatches.slice(0, 4), courtAssignments: { 'bm-1': 'court-1', 'bm-2': 'court-2', 'bm-3': 'court-3', 'bm-4': 'court-4' } },
  { roundNumber: 2, roundLabel: 'Semifinals', matchFormat: { type: 'single', pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T12:00:00', status: 'in_progress', matches: sampleBracketMatches.slice(4, 6), courtAssignments: { 'bm-5': 'court-1' } },
  { roundNumber: 3, roundLabel: 'Finals', matchFormat: { type: 'best_of', games: 3, pointsToWin: 11, winByTwo: true, pointCap: 15 }, scheduledTime: '2026-02-01T14:00:00', status: 'upcoming', matches: sampleBracketMatches.slice(6), courtAssignments: {} },
]

// Sample Timeline
const sampleTimeline: TournamentTimelineEvent[] = [
  { id: 'tl-1', timestamp: '2026-02-01T12:02:00', type: 'match_started', title: 'Semifinal 1 Started', description: 'Walsh/Kim vs Johnson/Garcia on Court 1', matchId: 'bm-5', roundNumber: 2 },
  { id: 'tl-2', timestamp: '2026-02-01T10:20:00', type: 'round_completed', title: 'Quarterfinals Complete', description: 'All 4 quarterfinal matches finished', roundNumber: 1 },
  { id: 'tl-3', timestamp: '2026-02-01T10:18:00', type: 'match_completed', title: 'QF Match 1 Complete', description: 'Walsh/Kim def. Adams/Clark 11-4', matchId: 'bm-1', roundNumber: 1 },
]

// Sample Alerts
const sampleAlerts: TournamentAlert[] = [
  { id: 'alert-1', type: 'round_ready', severity: 'info', title: 'Semifinal 2 Ready', description: 'Martinez/Patel vs Torres/Thompson ready to start', timestamp: '2026-02-01T12:05:00', matchId: 'bm-6', actionRequired: true },
]

// Sample Quick Stats
const sampleQuickStats: TournamentQuickStats = {
  teamsRemaining: 4,
  teamsEliminated: 4,
  matchesCompleted: 4,
  matchesInProgress: 1,
  matchesRemaining: 2,
  avgMatchDuration: 17,
  estimatedEndTime: '2026-02-01T15:00:00',
}

// Sample Seeds
const sampleSeeds: Seed[] = teams.map((t, i) => ({
  seed: i + 1,
  teamId: t.teamId,
  players: t.players,
  combinedRating: t.players.reduce((sum, p) => sum + p.skillRating, 0),
  isBye: false,
}))

// Sample Completed Matches
const sampleCompletedMatches: CompletedBracketMatchSummary[] = [
  { id: 'bm-1', round: 'Quarterfinals', team1Name: 'Walsh / Kim', team2Name: 'Adams / Clark', score: '11-4', winner: 'Walsh / Kim', court: 'Court 1', completedAt: '2026-02-01T10:18:00' },
  { id: 'bm-2', round: 'Quarterfinals', team1Name: 'Johnson / Garcia', team2Name: 'Chen / Lee', score: '11-8', winner: 'Johnson / Garcia', court: 'Court 2', completedAt: '2026-02-01T10:20:00' },
  { id: 'bm-3', round: 'Quarterfinals', team1Name: 'Martinez / Patel', team2Name: 'Wilson / Brown', score: '11-6', winner: 'Martinez / Patel', court: 'Court 3', completedAt: '2026-02-01T10:19:00' },
  { id: 'bm-4', round: 'Quarterfinals', team1Name: 'Torres / Thompson', team2Name: 'Davis / Moore', score: '11-5', winner: 'Torres / Thompson', court: 'Court 4', completedAt: '2026-02-01T10:16:00' },
]

// Sample Score Disputes (empty for clean demo)
const sampleScoreDisputes: ScoreDispute[] = []

// Sample Event Progress
const sampleEventProgress: EventProgress = {
  totalMatches: 7,
  completedMatches: 4,
  inProgressMatches: 1,
  remainingMatches: 2,
  currentRound: 2,
  totalRounds: 3,
  currentRoundLabel: 'Semifinals',
  elapsedMinutes: 125,
  estimatedRemainingMinutes: 120,
}

export default function TournamentDashboardPreview() {
  return (
    <TournamentDashboard
      event={sampleEvent}
      tournament={sampleTournament}
      eventProgress={sampleEventProgress}
      bracket={sampleBracket}
      bracketMatches={sampleBracketMatches}
      courtAssignments={sampleCourtAssignments}
      roundSchedules={sampleRoundSchedules}
      timeline={sampleTimeline}
      alerts={sampleAlerts}
      quickStats={sampleQuickStats}
      seeds={sampleSeeds}
      completedMatches={sampleCompletedMatches}
      scoreDisputes={sampleScoreDisputes}
      // GM Actions
      onCallMatch={(bracketMatchId, courtId) =>
        console.log('Call match:', bracketMatchId, 'to court:', courtId)
      }
      onStartMatch={(bracketMatchId) => console.log('Start match:', bracketMatchId)}
      onEnterScore={(bracketMatchId) => console.log('Enter score for:', bracketMatchId)}
      onMarkForfeit={(bracketMatchId, forfeitingTeam) =>
        console.log('Forfeit:', bracketMatchId, 'by:', forfeitingTeam)
      }
      onManualAdvance={(bracketMatchId, winner, reason) =>
        console.log('Manual advance:', bracketMatchId, winner, reason)
      }
      onUndoAdvancement={(bracketMatchId) => console.log('Undo advancement:', bracketMatchId)}
      onAnnounceRound={(roundNumber) => console.log('Announce round:', roundNumber)}
      onScheduleMatch={(bracketMatchId, scheduledTime) =>
        console.log('Schedule match:', bracketMatchId, 'at:', scheduledTime)
      }
      onAssignCourt={(bracketMatchId, courtId) =>
        console.log('Assign court:', courtId, 'to match:', bracketMatchId)
      }
      onPauseEvent={(reason) => console.log('Pause event:', reason)}
      onResumeEvent={() => console.log('Resume event')}
      onResolveDispute={(disputeId, team1Score, team2Score) =>
        console.log('Resolve dispute:', disputeId, team1Score, '-', team2Score)
      }
      onDismissAlert={(alertId) => console.log('Dismiss alert:', alertId)}
      onViewBracket={() => console.log('View bracket')}
      onOpenCourtBoard={() => console.log('Open court status board')}
      onShareTournament={() => console.log('Share tournament')}
    />
  )
}
