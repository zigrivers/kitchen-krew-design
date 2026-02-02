// =============================================================================
// Data Types - Core
// =============================================================================

/** Simplified player reference used in matches and queues */
export interface MatchPlayer {
  id: string
  name: string
  skillRating?: number
}

/** A team in a match (2 players for doubles) */
export interface Team {
  players: MatchPlayer[]
  score?: number
  gamesWon?: number
  currentGameScore?: number
  checkedIn: boolean[]
}

/** A team in the match queue (before match starts) */
export interface QueueTeam {
  players: MatchPlayer[]
}

/** Scoring configuration for the event */
export interface ScoringRules {
  pointsToWin: number
  winByTwo: boolean
  pointCap: number | null
  gamesPerMatch: 1 | 3 | 5
  rallyScoring: boolean
}

/** Event settings for game management */
export interface EventSettings {
  allowPlayerScoreEntry: boolean
  requireScoreConfirmation: boolean
  gracePeriodMinutes: number
}

/** Venue reference */
export interface VenueReference {
  id: string
  name: string
  address: string
}

/** Organizer/player reference */
export interface OrganizerReference {
  id: string
  name: string
}

/** The active event being played */
export interface LiveEvent {
  id: string
  name: string
  format: 'round_robin' | 'open_play' | 'king_of_court' | 'single_elimination' | 'double_elimination' | 'pool_play' | 'ladder'
  status: 'scheduled' | 'in_progress' | 'paused' | 'completed'
  isPaused: boolean
  pauseReason: string | null
  venue: VenueReference
  organizer: OrganizerReference
  startedAt: string | null
  scheduledEndTime: string
  scoringRules: ScoringRules
  settings: EventSettings
}

/** Summary of event progress */
export interface EventProgress {
  totalMatches: number
  completedMatches: number
  inProgressMatches: number
  remainingMatches: number
  currentRound: number
  totalRounds: number
  currentRoundLabel?: string
  elapsedMinutes: number
  estimatedRemainingMinutes: number
}

/** Court attributes */
export interface CourtAttributes {
  indoor: boolean
  surface: 'sport_court' | 'concrete' | 'asphalt' | 'wood' | 'other'
  lighting: boolean
}

/** A playing court with real-time status */
export interface Court {
  id: string
  name: string
  status: 'available' | 'calling' | 'in_progress' | 'maintenance'
  currentMatchId: string | null
  calledAt?: string
  attributes: CourtAttributes
}

/** Game score for a single game in a match */
export interface GameScore {
  team1: number
  team2: number
}

/** An individual match/game */
export interface Match {
  id: string
  bracketMatchId?: string
  courtId: string | null
  status: 'scheduled' | 'calling' | 'in_progress' | 'completed' | 'cancelled' | 'forfeit'
  round: number
  roundLabel?: string
  team1: Team
  team2: Team
  gameScores?: GameScore[]
  gamesPerMatch?: number
  winner: 'team1' | 'team2' | null
  startedAt: string | null
  completedAt: string | null
  duration: number | null
  scoreConfirmed: boolean
  calledAt?: string
}

/** A match waiting in the queue */
export interface QueuedMatch {
  id: string
  round: number
  team1: QueueTeam
  team2: QueueTeam
  estimatedStartTime: string
}

/** A player in the event */
export interface EventPlayer {
  id: string
  name: string
  skillRating: number
  checkedIn: boolean
  currentMatchId: string | null
  wins?: number
  losses?: number
  isOrganizer?: boolean
  seed?: number
  eliminated?: boolean
  placement?: string
}

/** A player's standing in the leaderboard */
export interface Standing {
  rank: number
  playerId: string
  name: string
  wins: number
  losses: number
  pointDiff: number
  gamesPlayed: number
}

/** Submitted score from a team */
export interface SubmittedScore {
  team1: number
  team2: number
}

/** A score dispute requiring GM resolution */
export interface ScoreDispute {
  id: string
  matchId: string
  team1SubmittedScore: SubmittedScore
  team2SubmittedScore: SubmittedScore
  submittedAt: string
  status: 'pending' | 'resolved'
  resolvedScore: SubmittedScore | null
  resolvedBy: string | null
  resolvedAt: string | null
}

/** Simplified completed match for history display */
export interface CompletedMatchSummary {
  id: string
  team1Names: string
  team2Names: string
  score: string
  winner: string
  court: string
  completedAt: string
}

/** The current logged-in user's context */
export interface CurrentUser {
  id: string
  name: string
  isGameManager: boolean
  currentMatchId: string | null
  nextMatchId: string | null
  checkedInAt: string | null
  seed?: number
  bracketPosition?: string
}

// =============================================================================
// Data Types - Tournament
// =============================================================================

/** Match format configuration for a round */
export interface MatchFormat {
  gamesPerMatch: 1 | 3 | 5
  label: string
}

/** Match format configuration by round name */
export interface MatchFormatByRound {
  [roundName: string]: MatchFormat
}

/** Multi-day tournament configuration */
export interface MultiDayConfig {
  startDate: string
  endDate: string
  currentDay: number
  totalDays: number
  sessions: {
    day: number
    date: string
    startTime: string
    endTime: string
    phases: string[]
  }[]
}

/** Tournament-specific configuration */
export interface Tournament {
  id: string
  eventId: string
  bracketType: 'single_elimination' | 'double_elimination' | 'pool_play' | 'ladder'
  bracketSize: 4 | 8 | 16 | 32 | 64
  seedingMethod: 'random' | 'skill_based' | 'manual'
  seedingLocked: boolean
  seedingLockedAt: string | null
  matchFormatByRound: MatchFormatByRound
  consolationBracket: boolean
  thirdPlaceMatch: boolean
  grandFinalsReset: boolean
  multiDay: MultiDayConfig | null
  shareableLink: string | null
  isPublic: boolean
}

/** A seeded entry in the tournament */
export interface Seed {
  seed: number
  teamId: string
  players: MatchPlayer[]
  combinedRating: number
  isBye: boolean
}

/** Round information in a bracket */
export interface BracketRound {
  roundNumber: number
  label: string
  matchFormat: MatchFormat
  scheduledTime: string
  status: 'upcoming' | 'in_progress' | 'completed'
}

/** The bracket structure */
export interface Bracket {
  id: string
  tournamentId: string
  type: 'winners' | 'losers' | 'consolation'
  rounds: BracketRound[]
}

/** A team in a bracket match */
export interface BracketTeam {
  teamId: string
  seed: number
  players: MatchPlayer[]
  displayName: string
}

/** A match within a bracket */
export interface BracketMatch {
  id: string
  bracketId: string
  roundNumber: number
  roundLabel: string
  position: number
  matchId: string | null
  seed1: number | null
  seed2: number | null
  team1: BracketTeam | null
  team2: BracketTeam | null
  scores: GameScore[]
  winner: 'team1' | 'team2' | null
  status: 'upcoming' | 'calling' | 'in_progress' | 'completed' | 'bye' | 'forfeit'
  courtId: string | null
  scheduledTime: string
  startedAt: string | null
  completedAt: string | null
  winnerAdvancesTo: string | null
  loserAdvancesTo: string | null
  awaitingWinnerFrom?: string[]
  awaitingLoserFrom?: string[]
}

/** Simplified completed bracket match for history display */
export interface CompletedBracketMatchSummary {
  id: string
  round: string
  team1Name: string
  team2Name: string
  score: string
  winner: string
  court: string
  completedAt: string
}

// =============================================================================
// Data Types - Pool Play
// =============================================================================

/** A team's standing within a pool */
export interface PoolStanding {
  teamId: string
  displayName: string
  wins: number
  losses: number
  pointDiff: number
  rank: number
  advances: boolean
}

/** A pool in pool play format */
export interface Pool {
  id: string
  name: string
  teams: string[]
  standings: PoolStanding[]
  matches: string[]
  status: 'upcoming' | 'in_progress' | 'completed'
}

/** Pool play advancement rules */
export interface PoolAdvancementRules {
  teamsPerPool: number
  teamsAdvancing: number
  tiebreakers: ('head_to_head' | 'point_differential' | 'points_scored')[]
}

/** Pool play configuration */
export interface PoolPlayConfig {
  pools: Pool[]
  advancementRules: PoolAdvancementRules
}

// =============================================================================
// Data Types - Ladder
// =============================================================================

/** Ladder tournament configuration */
export interface Ladder {
  id: string
  name: string
  status: 'upcoming' | 'in_progress' | 'completed'
  startDate: string
  endDate: string | null
  challengeRange: number
  challengeDeadlineHours: number
  inactivityDropDays: number
  schedulingMode: 'self_scheduled' | 'system_scheduled'
}

/** A team's position on the ladder */
export interface LadderPosition {
  position: number
  teamId: string
  displayName: string
  rating: number
  challengeable: boolean
  lastActive: string
  inactivityWarning?: boolean
}

/** A challenge between ladder positions */
export interface LadderChallenge {
  id: string
  challengerId: string
  challengerPosition: number
  defenderId: string
  defenderPosition: number
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'completed'
  createdAt: string
  deadline: string
  scheduledMatchTime: string | null
  matchId: string | null
}

/** Ladder configuration with standings and challenges */
export interface LadderConfig {
  ladder: Ladder
  standings: LadderPosition[]
  challenges: LadderChallenge[]
}

// =============================================================================
// Data Types - Tournament Results
// =============================================================================

/** Podium placement for tournament results */
export interface PodiumPlacement {
  place: 1 | 2 | 3
  teamId: string
  displayName: string
  players: MatchPlayer[]
  seed: number
}

/** Tournament statistics summary */
export interface TournamentStats {
  totalMatches: number
  closestMatch: { matchId: string; margin: number; teams: string }
  biggestUpset: { matchId: string; seedDiff: number; winner: string; loser: string } | null
  highestScoringMatch: { matchId: string; totalPoints: number; teams: string }
}

/** Complete tournament results */
export interface TournamentResults {
  podium: PodiumPlacement[]
  bracket: Bracket
  bracketMatches: BracketMatch[]
  stats: TournamentStats
  championPath: string[]
}

// =============================================================================
// Double Elimination Specific
// =============================================================================

/** Grand Finals configuration for double elimination */
export interface GrandFinals {
  id: string
  requiresReset: boolean
  resetMatch: BracketMatch | null
}

/** Double elimination bracket structure */
export interface DoubleEliminationBracket {
  winnersBracket: Bracket
  losersBracket: Bracket
  grandFinals: GrandFinals
}

// =============================================================================
// Component Props
// =============================================================================

export interface LivePlayProps {
  /** Current logged-in user */
  currentUser: CurrentUser
  /** The active event */
  event: LiveEvent
  /** Event progress summary */
  eventProgress: EventProgress
  /** All courts at the venue */
  courts: Court[]
  /** All matches in the event */
  matches: Match[]
  /** Upcoming matches in queue */
  matchQueue: QueuedMatch[]
  /** All players in the event */
  players: EventPlayer[]
  /** Current standings/leaderboard (for round robin/open play) */
  standings: Standing[]
  /** Active score disputes */
  scoreDisputes: ScoreDispute[]
  /** Completed match summaries */
  completedMatches: CompletedMatchSummary[]

  // Tournament-specific data
  /** Tournament configuration (for tournament formats) */
  tournament?: Tournament
  /** Seeded entries */
  seeds?: Seed[]
  /** Bracket structure */
  bracket?: Bracket
  /** All bracket matches */
  bracketMatches?: BracketMatch[]
  /** Completed bracket match summaries */
  completedBracketMatches?: CompletedBracketMatchSummary[]
  /** Tournament results (when completed) */
  tournamentResults?: TournamentResults

  // Pool play data
  /** Pool play configuration */
  poolPlay?: PoolPlayConfig

  // Ladder data
  /** Ladder configuration */
  ladderConfig?: LadderConfig

  // Player actions
  /** Called when player checks in at their court */
  onCourtCheckIn?: (matchId: string) => void
  /** Called when player enters a score */
  onSubmitScore?: (matchId: string, team1Score: number, team2Score: number) => void
  /** Called when player confirms opponent's score */
  onConfirmScore?: (matchId: string) => void
  /** Called when player disputes a score */
  onDisputeScore?: (matchId: string) => void

  // Game Manager actions
  /** Called when GM calls players to a court */
  onCallMatch?: (matchId: string, courtId: string) => void
  /** Called when GM starts a match */
  onStartMatch?: (matchId: string) => void
  /** Called when GM enters/updates a score */
  onEnterScore?: (matchId: string, team1Score: number, team2Score: number) => void
  /** Called when GM resolves a score dispute */
  onResolveDispute?: (disputeId: string, team1Score: number, team2Score: number) => void
  /** Called when GM marks a player as no-show */
  onMarkNoShow?: (matchId: string, playerId: string) => void
  /** Called when GM substitutes a player */
  onSubstitutePlayer?: (matchId: string, oldPlayerId: string, newPlayerId: string) => void
  /** Called when GM adjusts queue order */
  onReorderQueue?: (matchId: string, newPosition: number) => void
  /** Called when GM pauses the event */
  onPauseEvent?: (reason: string) => void
  /** Called when GM resumes the event */
  onResumeEvent?: () => void
  /** Called when GM ends the event */
  onEndEvent?: () => void

  // Tournament GM actions
  /** Called when GM updates seeding */
  onUpdateSeeding?: (seeds: Seed[]) => void
  /** Called when GM locks seeding */
  onLockSeeding?: () => void
  /** Called when GM advances a winner manually */
  onManualAdvance?: (bracketMatchId: string, winner: 'team1' | 'team2', reason: string) => void
  /** Called when GM undoes last advancement */
  onUndoAdvancement?: (bracketMatchId: string) => void
  /** Called when GM marks a forfeit */
  onMarkForfeit?: (bracketMatchId: string, forfeitingTeam: 'team1' | 'team2') => void
  /** Called when GM handles a withdrawal */
  onHandleWithdrawal?: (teamId: string, action: 'forfeit_remaining' | 'promote_alternate') => void
  /** Called when GM announces next round */
  onAnnounceRound?: (roundNumber: number) => void
  /** Called when GM schedules a match time */
  onScheduleMatch?: (bracketMatchId: string, scheduledTime: string) => void

  // Ladder actions
  /** Called when player issues a challenge */
  onIssueChallenge?: (defenderId: string) => void
  /** Called when player accepts a challenge */
  onAcceptChallenge?: (challengeId: string) => void
  /** Called when player declines a challenge */
  onDeclineChallenge?: (challengeId: string) => void
  /** Called when GM handles inactivity drop */
  onInactivityDrop?: (teamId: string) => void

  // Navigation
  /** Called when user wants to view a player's profile */
  onViewPlayer?: (playerId: string) => void
  /** Called when user wants to view match details */
  onViewMatch?: (matchId: string) => void
  /** Called when user wants full-screen court board */
  onOpenCourtBoard?: () => void
  /** Called when user wants to view bracket */
  onViewBracket?: () => void
  /** Called when user wants to share bracket */
  onShareBracket?: () => void
}

// =============================================================================
// Sub-component Props
// =============================================================================

export interface CourtCardProps {
  court: Court
  match: Match | null
  isGameManager: boolean
  onCallMatch?: () => void
  onStartMatch?: () => void
  onViewMatch?: () => void
}

export interface MatchCardProps {
  match: Match
  isCurrentUserMatch: boolean
  isGameManager: boolean
  onCheckIn?: () => void
  onSubmitScore?: (team1Score: number, team2Score: number) => void
  onStartMatch?: () => void
  onViewMatch?: () => void
}

export interface ScoreEntryProps {
  match: Match
  isGameManager: boolean
  gamesPerMatch?: number
  onSubmit?: (team1Score: number, team2Score: number) => void
  onSubmitGame?: (gameNumber: number, team1Score: number, team2Score: number) => void
  onCancel?: () => void
}

export interface StandingsTableProps {
  standings: Standing[]
  currentUserId: string
  onViewPlayer?: (playerId: string) => void
}

export interface MatchQueueProps {
  queue: QueuedMatch[]
  isGameManager: boolean
  onReorder?: (matchId: string, newPosition: number) => void
  onViewMatch?: (matchId: string) => void
}

export interface EventProgressBarProps {
  progress: EventProgress
  isPaused: boolean
}

export interface CourtStatusBoardProps {
  courts: Court[]
  matches: Match[]
  event: LiveEvent
  onClose?: () => void
}

// =============================================================================
// Tournament Sub-component Props
// =============================================================================

export interface BracketViewProps {
  bracket: Bracket
  bracketMatches: BracketMatch[]
  currentUserId?: string
  isGameManager: boolean
  onViewMatch?: (bracketMatchId: string) => void
  onStartMatch?: (bracketMatchId: string) => void
  onEnterScore?: (bracketMatchId: string) => void
}

export interface SeedingManagerProps {
  seeds: Seed[]
  seedingLocked: boolean
  seedingMethod: 'random' | 'skill_based' | 'manual'
  onUpdateSeeding?: (seeds: Seed[]) => void
  onLockSeeding?: () => void
  onRandomize?: () => void
  onSortByRating?: () => void
}

export interface BracketMatchCardProps {
  bracketMatch: BracketMatch
  isCurrentUserMatch: boolean
  isGameManager: boolean
  onStartMatch?: () => void
  onEnterScore?: () => void
  onViewMatch?: () => void
}

export interface PoolStandingsProps {
  pool: Pool
  currentUserId?: string
  onViewPlayer?: (playerId: string) => void
}

export interface LadderStandingsProps {
  standings: LadderPosition[]
  challenges: LadderChallenge[]
  currentUserId?: string
  challengeRange: number
  onIssueChallenge?: (defenderId: string) => void
  onViewPlayer?: (playerId: string) => void
}

export interface TournamentResultsProps {
  results: TournamentResults
  onViewBracket?: () => void
  onShareResults?: () => void
  onViewPlayer?: (playerId: string) => void
}

export interface PodiumDisplayProps {
  podium: PodiumPlacement[]
  onViewPlayer?: (playerId: string) => void
}
