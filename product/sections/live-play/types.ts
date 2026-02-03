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
  format: 'round_robin' | 'open_play' | 'king_of_court' | 'single_elimination' | 'double_elimination' | 'pool_play' | 'ladder' | 'hybrid_seeding_bracket'
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

// =============================================================================
// Enhanced Pool Play Types
// =============================================================================

/** Extended pool standing with additional stats for full pool play view */
export interface ExtendedPoolStanding {
  teamId: string
  displayName: string
  seed: number
  wins: number
  losses: number
  pointsFor: number
  pointsAgainst: number
  pointDiff: number
  rank: number
  advances: boolean
  headToHead: { [teamId: string]: 'W' | 'L' }
}

/** A match within a pool (round robin) */
export interface PoolMatch {
  id: string
  team1Id: string
  team2Id: string
  score: { team1: number; team2: number } | null
  winner: 'team1' | 'team2' | null
  status: 'upcoming' | 'calling' | 'in_progress' | 'completed'
  courtId: string | null
  scheduledTime: string
  startedAt?: string
  completedAt?: string
}

/** Extended pool with full match details and color coding */
export interface ExtendedPool {
  id: string
  name: string
  color: 'lime' | 'sky' | 'amber' | 'violet' | 'rose' | 'cyan'
  status: 'upcoming' | 'in_progress' | 'completed'
  teams: string[]
  standings: ExtendedPoolStanding[]
  matches: PoolMatch[]
  scheduleComplete: boolean
}

/** Pool progress tracking */
export interface PoolProgressItem {
  matchesPlayed: number
  matchesTotal: number
  percentComplete: number
}

/** Projected playoff matchup before bracket is finalized */
export interface ProjectedMatchup {
  position: string
  team1Source: string
  team2Source: string
  projectedTeam1: string
  projectedTeam2: string
}

/** Pending playoff bracket structure */
export interface PendingPlayoffBracket {
  id: string
  status: 'pending' | 'ready' | 'in_progress' | 'completed'
  rounds: {
    roundNumber: number
    label: string
    matchFormat: MatchFormat
    status: 'pending' | 'upcoming' | 'in_progress' | 'completed'
  }[]
  projectedMatchups: ProjectedMatchup[]
}

/** Extended pool play configuration */
export interface ExtendedPoolPlayConfig {
  advancementRules: PoolAdvancementRules
  playoffBracketSize: 4 | 8 | 16
  playoffSeeding: 'cross_pool' | 'straight' | 'snake'
}

/** Upcoming match summary for quick view */
export interface UpcomingMatchSummary {
  id: string
  poolId: string
  team1: string
  team2: string
  scheduledTime: string
  estimatedWait: number
}

/** Pool play notification */
export interface PoolPlayNotification {
  id: string
  type: 'pool_complete' | 'match_starting' | 'advancement' | 'tiebreaker'
  message: string
  timestamp: string
  poolId?: string
  matchId?: string
  forUserId?: string
}

/** Team info for pool play */
export interface PoolTeam {
  id: string
  seed: number
  displayName: string
  players: MatchPlayer[]
  combinedRating: number
  poolId: string
}

// =============================================================================
// Full Pool Play View Props
// =============================================================================

export interface FullPoolPlayViewProps {
  /** Tournament event info */
  event: LiveEvent
  /** Event progress summary */
  eventProgress: EventProgress
  /** Pool play configuration */
  poolPlayConfig: ExtendedPoolPlayConfig
  /** All pools with standings and matches */
  pools: ExtendedPool[]
  /** All teams in the tournament */
  teams: PoolTeam[]
  /** Progress tracking per pool */
  poolProgress: { [poolId: string]: PoolProgressItem }
  /** Upcoming matches across all pools */
  upcomingMatches: UpcomingMatchSummary[]
  /** Playoff bracket (pending or active) */
  playoffBracket: PendingPlayoffBracket
  /** Available courts */
  courts: Court[]
  /** Current user context */
  currentUser?: {
    id: string
    name: string
    isGameManager: boolean
    currentMatchId: string | null
    nextMatchId: string | null
    poolId: string
    poolRank: number
  }
  /** Notifications */
  notifications?: PoolPlayNotification[]

  // Callbacks
  /** Called when user views a specific pool */
  onViewPool?: (poolId: string) => void
  /** Called when user views match details */
  onViewMatch?: (matchId: string) => void
  /** Called when GM starts a match */
  onStartMatch?: (matchId: string) => void
  /** Called when GM enters score */
  onEnterScore?: (matchId: string) => void
  /** Called when user views team/player details */
  onViewTeam?: (teamId: string) => void
  /** Called when user shares pool standings */
  onSharePool?: (poolId: string) => void
  /** Called when user views playoff bracket preview */
  onViewPlayoffBracket?: () => void
}

// =============================================================================
// Tournament Dashboard Types
// =============================================================================

/** Court assignment for tournament match scheduling */
export interface CourtAssignment {
  courtId: string
  courtName: string
  currentMatch: BracketMatch | null
  upcomingMatches: BracketMatch[]
  isAvailable: boolean
  attributes: CourtAttributes
}

/** Round schedule with court assignments */
export interface RoundSchedule {
  roundNumber: number
  roundLabel: string
  matchFormat: MatchFormat
  scheduledTime: string
  status: 'upcoming' | 'in_progress' | 'completed'
  matches: BracketMatch[]
  courtAssignments: { [matchId: string]: string }
}

/** Tournament timeline event for activity log */
export interface TournamentTimelineEvent {
  id: string
  timestamp: string
  type: 'match_started' | 'match_completed' | 'round_started' | 'round_completed' | 'score_entered' | 'forfeit' | 'manual_advance' | 'announcement' | 'pause' | 'resume'
  title: string
  description: string
  matchId?: string
  roundNumber?: number
}

/** Alert for GM attention */
export interface TournamentAlert {
  id: string
  type: 'match_delay' | 'score_dispute' | 'no_show' | 'court_issue' | 'round_ready'
  severity: 'info' | 'warning' | 'urgent'
  title: string
  description: string
  timestamp: string
  matchId?: string
  courtId?: string
  actionRequired: boolean
}

/** Quick stats for dashboard header */
export interface TournamentQuickStats {
  teamsRemaining: number
  teamsEliminated: number
  matchesCompleted: number
  matchesInProgress: number
  matchesRemaining: number
  avgMatchDuration: number
  estimatedEndTime: string
}

/** Tournament Dashboard Props */
export interface TournamentDashboardProps {
  /** Tournament event info */
  event: LiveEvent
  /** Tournament configuration */
  tournament: Tournament
  /** Event progress summary */
  eventProgress: EventProgress
  /** Bracket structure */
  bracket: Bracket
  /** All bracket matches */
  bracketMatches: BracketMatch[]
  /** Court status and assignments */
  courtAssignments: CourtAssignment[]
  /** Round schedules */
  roundSchedules: RoundSchedule[]
  /** Recent activity timeline */
  timeline: TournamentTimelineEvent[]
  /** Active alerts requiring attention */
  alerts: TournamentAlert[]
  /** Quick stats for header */
  quickStats: TournamentQuickStats
  /** All seeds/teams */
  seeds: Seed[]
  /** Completed match summaries */
  completedMatches: CompletedBracketMatchSummary[]
  /** Score disputes pending resolution */
  scoreDisputes: ScoreDispute[]

  // GM Actions
  /** Called when GM calls a match to a court */
  onCallMatch?: (bracketMatchId: string, courtId: string) => void
  /** Called when GM starts a match */
  onStartMatch?: (bracketMatchId: string) => void
  /** Called when GM enters/updates a score */
  onEnterScore?: (bracketMatchId: string) => void
  /** Called when GM marks a forfeit */
  onMarkForfeit?: (bracketMatchId: string, forfeitingTeam: 'team1' | 'team2') => void
  /** Called when GM advances a winner manually */
  onManualAdvance?: (bracketMatchId: string, winner: 'team1' | 'team2', reason: string) => void
  /** Called when GM undoes last advancement */
  onUndoAdvancement?: (bracketMatchId: string) => void
  /** Called when GM announces next round */
  onAnnounceRound?: (roundNumber: number) => void
  /** Called when GM schedules a match time */
  onScheduleMatch?: (bracketMatchId: string, scheduledTime: string) => void
  /** Called when GM assigns match to court */
  onAssignCourt?: (bracketMatchId: string, courtId: string) => void
  /** Called when GM pauses the event */
  onPauseEvent?: (reason: string) => void
  /** Called when GM resumes the event */
  onResumeEvent?: () => void
  /** Called when GM resolves a score dispute */
  onResolveDispute?: (disputeId: string, team1Score: number, team2Score: number) => void
  /** Called when GM dismisses an alert */
  onDismissAlert?: (alertId: string) => void
  /** Called when GM views full bracket */
  onViewBracket?: () => void
  /** Called when GM opens court status board */
  onOpenCourtBoard?: () => void
  /** Called when GM shares tournament */
  onShareTournament?: () => void
}

// =============================================================================
// Score Entry Modal Types
// =============================================================================

/** Team display info for score entry */
export interface ScoreEntryTeam {
  teamId: string
  displayName: string
  seed?: number
  players: MatchPlayer[]
}

/** Match info context for score entry */
export interface ScoreEntryMatchContext {
  matchId: string
  bracketMatchId?: string
  roundLabel: string
  courtName?: string
  startedAt: string | null
  team1: ScoreEntryTeam
  team2: ScoreEntryTeam
  existingScores: GameScore[]
  gamesPerMatch: 1 | 3 | 5
}

/** Validation result for score entry */
export interface ScoreValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  winner: 'team1' | 'team2' | null
  team1GamesWon: number
  team2GamesWon: number
  matchComplete: boolean
}

/** Score Entry Modal Props */
export interface ScoreEntryModalProps {
  /** Match context */
  match: ScoreEntryMatchContext
  /** Scoring rules from event */
  scoringRules: ScoringRules
  /** Whether to show as a modal overlay */
  isModal?: boolean

  // Callbacks
  /** Called when score is submitted */
  onSubmit?: (scores: GameScore[], winner: 'team1' | 'team2') => void
  /** Called when individual game score is submitted (for live scoring) */
  onSubmitGame?: (gameNumber: number, score: GameScore) => void
  /** Called when modal is closed/cancelled */
  onClose?: () => void
  /** Called when user requests to mark forfeit */
  onMarkForfeit?: (forfeitingTeam: 'team1' | 'team2') => void
}

// =============================================================================
// Round Robin Types
// =============================================================================

/** Partner format options for round robin */
export type RoundRobinPartnerFormat = 'fixed' | 'rotating' | 'blind_draw' | 'pick_a_number_random'

/** Pool assignment method */
export type PoolAssignmentMethod = 'random' | 'serpentine_seeding' | 'manual' | 'skill_balanced'

/** Time format type */
export type TimeFormatType = 'games_based' | 'time_based' | 'hybrid'

/** Standings scoring method */
export type StandingsScoringMethod = 'win_loss_points' | 'points_for' | 'social'

/** Tiebreaker rules in order of precedence */
export type TiebreakerRule = 'head_to_head' | 'overall_point_diff' | 'h2h_point_diff' | 'vs_next_highest' | 'coin_flip'

/** Playoff format after pool play */
export type PlayoffFormat = 'none' | 'single_elimination' | 'double_elimination' | 'medal_rounds'

/** Playoff seeding method */
export type PlayoffSeedingMethod = 'cross_pool' | 'straight' | 'snake' | 'performance_based'

/** Pool structure configuration */
export interface PoolStructureConfig {
  type: 'single' | 'multiple'
  poolCount: number
  teamsPerPool: number
  poolAssignmentMethod: PoolAssignmentMethod
}

/** Time format configuration */
export interface TimeFormatConfig {
  type: TimeFormatType
  pointsToWin: number
  winByTwo: boolean
  pointCap: number | null
  gamesPerMatch: 1 | 3 | 5
  estimatedMatchDuration: number
  /** For time-based format */
  roundDurationMinutes?: number
  /** Buffer between rounds */
  bufferMinutes?: number
}

/** Standings configuration */
export interface StandingsConfig {
  scoringMethod: StandingsScoringMethod
  tiebreakers: TiebreakerRule[]
  socialMode: boolean
}

/** Playoff configuration */
export interface PlayoffConfig {
  enabled: boolean
  format: PlayoffFormat
  teamsAdvancing: number
  bracketSize: 4 | 8 | 16
  seedingMethod: PlayoffSeedingMethod
  breakTimeBetweenPoolAndPlayoff: number
}

/** Round Robin event configuration */
export interface RoundRobinConfig {
  id: string
  eventId: string
  partnerFormat: RoundRobinPartnerFormat
  poolStructure: PoolStructureConfig
  timeFormat: TimeFormatConfig
  standingsConfig: StandingsConfig
  playoffConfig: PlayoffConfig
  mixedDoublesMode: boolean
  /** Player IDs to avoid pairing together */
  spouseAvoidance: string[][]
}

/** Pool progress tracking */
export interface PoolProgressItem {
  matchesPlayed: number
  matchesTotal: number
  percentComplete: number
}

/** Round robin event progress */
export interface RoundRobinEventProgress {
  totalMatches: number
  completedMatches: number
  inProgressMatches: number
  remainingMatches: number
  currentRound: number
  totalRounds: number
  currentRoundLabel: string
  elapsedMinutes: number
  estimatedRemainingMinutes: number
  poolProgress: { [poolId: string]: PoolProgressItem }
}

/** A team in round robin */
export interface RoundRobinTeam {
  id: string
  seed: number
  displayName: string
  players: MatchPlayer[]
  combinedRating: number
  poolId: string
}

/** Tiebreaker explanation */
export interface TiebreakerExplanation {
  reason: string
  tiedWith: string[]
  appliedRule: TiebreakerRule
}

/** Team standing within a pool */
export interface RoundRobinPoolStanding {
  rank: number
  teamId: string
  displayName: string
  seed: number
  wins: number
  losses: number
  pointsFor: number
  pointsAgainst: number
  pointDiff: number
  advances: boolean
  headToHead: { [teamId: string]: 'W' | 'L' }
  matchesPlayed: number
  matchesRemaining: number
  tiebreaker: TiebreakerExplanation | null
}

/** Pool color for visual distinction */
export type PoolColor = 'lime' | 'sky' | 'amber' | 'violet' | 'rose' | 'cyan'

/** A pool in round robin */
export interface RoundRobinPool {
  id: string
  name: string
  color: PoolColor
  status: 'upcoming' | 'in_progress' | 'completed'
  teams: string[]
  advancementLine: number
  standings: RoundRobinPoolStanding[]
  scheduleComplete: boolean
}

/** Round status in schedule */
export interface RoundRobinRound {
  roundNumber: number
  status: 'upcoming' | 'in_progress' | 'completed'
  scheduledTime: string
  estimatedDuration: number
}

/** Round robin schedule */
export interface RoundRobinSchedule {
  id: string
  eventId: string
  generatedAt: string
  algorithm: 'berger_circle' | 'custom'
  totalRounds: number
  rounds: RoundRobinRound[]
}

/** A match in round robin */
export interface RoundRobinMatch {
  id: string
  poolId: string
  roundNumber: number
  team1Id: string
  team2Id: string
  courtId: string | null
  status: 'upcoming' | 'calling' | 'in_progress' | 'completed' | 'cancelled' | 'forfeit'
  score: { team1: number; team2: number } | null
  winner: 'team1' | 'team2' | null
  startedAt: string | null
  completedAt: string | null
  duration: number | null
  /** For rotating partners format */
  partnerId?: string
}

/** Upcoming match summary */
export interface UpcomingRoundRobinMatch {
  id: string
  poolId: string
  roundNumber: number
  team1Id: string
  team2Id: string
  courtId: string | null
  status: 'upcoming'
  scheduledTime: string
  estimatedWait: number
}

/** Projected playoff matchup */
export interface ProjectedPlayoffMatchup {
  position: string
  team1Source: string
  team2Source: string
  projectedTeam1: string
  projectedTeam2: string
}

/** Pending playoff bracket */
export interface PendingPlayoffBracket {
  id: string
  status: 'pending' | 'ready' | 'in_progress' | 'completed'
  format: PlayoffFormat
  size: 4 | 8 | 16
  seedingMethod: PlayoffSeedingMethod
  estimatedStartTime: string
  breakTimeMinutes: number
  rounds: {
    roundNumber: number
    label: string
    matchFormat: MatchFormat
    status: 'pending' | 'upcoming' | 'in_progress' | 'completed'
  }[]
  projectedMatchups: ProjectedPlayoffMatchup[]
}

/** Player's schedule entry */
export interface PlayerScheduleEntry {
  roundNumber: number
  opponent: string
  opponentSeed: number
  courtId: string | null
  courtName: string
  scheduledTime: string
  status: 'upcoming' | 'in_progress' | 'completed'
  result: 'W' | 'L' | null
  score: string | null
  /** For rotating partners */
  partner?: string
}

/** Player's schedule view */
export interface PlayerScheduleView {
  playerId: string
  teamId: string
  teamName: string
  poolId: string
  poolName: string
  currentRank: number
  advances: boolean
  schedule: PlayerScheduleEntry[]
  advancementScenarios: string[]
}

/** Round robin notification */
export interface RoundRobinNotification {
  id: string
  type: 'match_starting' | 'pool_complete' | 'advancement' | 'tiebreaker' | 'playoffs_starting'
  message: string
  timestamp: string
  poolId?: string
  matchId?: string
  forUserId: string | null
  read: boolean
}

/** Partner pairing in rotating format */
export interface PartnerPairing {
  playerId: string
  partnerId: string
  opponentIds: string[]
}

/** Round in partner rotation */
export interface PartnerRotationRound {
  roundNumber: number
  pairings: PartnerPairing[]
}

/** Rotating partners example data */
export interface RotatingPartnersExample {
  eventId: string
  format: 'rotating_partners'
  playerCount: number
  players: MatchPlayer[]
  partnerRotation: PartnerRotationRound[]
  individualStandings: {
    rank: number
    playerId: string
    name: string
    wins: number
    losses: number
    pointDiff: number
  }[]
}

// =============================================================================
// Round Robin Component Props
// =============================================================================

/** Round Robin Pool Standings Props */
export interface RoundRobinPoolStandingsProps {
  pool: RoundRobinPool
  teams: RoundRobinTeam[]
  currentUserId?: string
  onViewTeam?: (teamId: string) => void
  onViewMatch?: (matchId: string) => void
}

/** Round Robin Schedule Props */
export interface RoundRobinScheduleProps {
  schedule: RoundRobinSchedule
  matches: RoundRobinMatch[]
  teams: RoundRobinTeam[]
  currentUserId?: string
  onViewMatch?: (matchId: string) => void
}

/** Round Robin Player Schedule Props */
export interface RoundRobinPlayerScheduleProps {
  scheduleView: PlayerScheduleView
  onViewMatch?: (matchId: string) => void
  onViewOpponent?: (teamId: string) => void
}

/** Round Robin Dashboard Props (GM View) */
export interface RoundRobinDashboardProps {
  event: LiveEvent
  config: RoundRobinConfig
  progress: RoundRobinEventProgress
  pools: RoundRobinPool[]
  teams: RoundRobinTeam[]
  matches: RoundRobinMatch[]
  upcomingMatches: UpcomingRoundRobinMatch[]
  schedule: RoundRobinSchedule
  courts: Court[]
  playoffBracket: PendingPlayoffBracket | null
  notifications: RoundRobinNotification[]

  // GM Actions
  onCallMatch?: (matchId: string, courtId: string) => void
  onStartMatch?: (matchId: string) => void
  onEnterScore?: (matchId: string, team1Score: number, team2Score: number) => void
  onMarkForfeit?: (matchId: string, forfeitingTeam: 'team1' | 'team2') => void
  onHandleWithdrawal?: (teamId: string) => void
  onRegenerateSchedule?: () => void
  onStartPlayoffs?: () => void
  onPauseEvent?: (reason: string) => void
  onResumeEvent?: () => void
  onEndEvent?: () => void

  // Navigation
  onViewPool?: (poolId: string) => void
  onViewTeam?: (teamId: string) => void
  onViewMatch?: (matchId: string) => void
  onOpenCourtBoard?: () => void
}

/** Round Robin Player View Props */
export interface RoundRobinPlayerViewProps {
  event: LiveEvent
  currentUser: {
    id: string
    name: string
    teamId: string
    poolId: string
    poolRank: number
    nextMatchId: string | null
    currentMatchId: string | null
  }
  pool: RoundRobinPool
  teams: RoundRobinTeam[]
  scheduleView: PlayerScheduleView
  matches: RoundRobinMatch[]
  playoffBracket: PendingPlayoffBracket | null
  notifications: RoundRobinNotification[]

  // Player Actions
  onCheckIn?: (matchId: string) => void
  onSubmitScore?: (matchId: string, team1Score: number, team2Score: number) => void
  onConfirmScore?: (matchId: string) => void
  onDisputeScore?: (matchId: string) => void

  // Navigation
  onViewPool?: (poolId: string) => void
  onViewTeam?: (teamId: string) => void
  onViewMatch?: (matchId: string) => void
  onViewPlayoffBracket?: () => void
}

// =============================================================================
// Hybrid Tournament Types (Round Robin Seeding + Elimination Bracket)
// =============================================================================

/** Phase states for hybrid tournaments */
export type HybridPhase = 'registration' | 'seeding' | 'transition' | 'bracket' | 'completed'

/** Configuration for the seeding phase (round robin) */
export interface SeedingPhaseConfig {
  /** Number of seeding rounds (default: 5) */
  rounds: number
  /** Time format for seeding matches */
  timeFormat: TimeFormatConfig
  /** Standings calculation method */
  standingsConfig: StandingsConfig
  /** How to handle byes for odd player counts */
  byeHandling: 'rotate' | 'fixed'
  /** Whether to show live standings during seeding (default: true) */
  showLiveStandings: boolean
}

/** Configuration for the bracket phase (elimination) */
export interface BracketPhaseConfig {
  /** Single or double elimination */
  type: 'single_elimination' | 'double_elimination'
  /** Match format configuration by round name */
  matchFormatByRound: MatchFormatByRound
  /** Whether to play a third-place match */
  thirdPlaceMatch: boolean
  /** For double elimination: whether grand finals can reset */
  grandFinalsReset?: boolean
}

/** A team's seeding result after round robin play */
export interface HybridSeedingResult {
  /** Final rank after seeding phase */
  rank: number
  /** Team identifier */
  teamId: string
  /** Team display name */
  displayName: string
  /** Original seed before seeding rounds */
  originalSeed: number
  /** Wins in seeding phase */
  wins: number
  /** Losses in seeding phase */
  losses: number
  /** Point differential */
  pointDiff: number
  /** Points scored */
  pointsFor: number
  /** Points against */
  pointsAgainst: number
  /** Bracket seed assigned (1 = top seed) */
  bracketSeed: number
  /** Tiebreaker explanation if applicable */
  tiebreaker: TiebreakerExplanation | null
}

/** Progress tracking for hybrid tournament */
export interface HybridTournamentProgress {
  /** Overall completion percentage */
  percentComplete: number
  /** Current phase */
  currentPhase: HybridPhase
  /** Seeding phase progress */
  seedingProgress: {
    currentRound: number
    totalRounds: number
    matchesCompleted: number
    matchesTotal: number
    matchesInProgress: number
  }
  /** Bracket phase progress (null during seeding) */
  bracketProgress: {
    currentRound: number
    totalRounds: number
    matchesCompleted: number
    matchesTotal: number
    matchesInProgress: number
    teamsRemaining: number
    teamsEliminated: number
  } | null
  /** Time tracking */
  elapsedMinutes: number
  estimatedRemainingMinutes: number
}

/** The hybrid tournament configuration and state */
export interface HybridTournament {
  /** Unique identifier */
  id: string
  /** Parent event ID */
  eventId: string
  /** Current tournament phase */
  currentPhase: HybridPhase
  /** Bracket size (8, 16, or 32 teams) */
  bracketSize: 8 | 16 | 32
  /** Seeding phase configuration */
  seedingPhase: SeedingPhaseConfig
  /** Bracket phase configuration */
  bracketPhase: BracketPhaseConfig

  // Seeding phase data
  /** Round robin schedule for seeding */
  seedingSchedule: RoundRobinSchedule | null
  /** All seeding matches */
  seedingMatches: RoundRobinMatch[]
  /** Current standings during/after seeding */
  seedingStandings: RoundRobinPoolStanding[]

  // Bracket phase data (populated after seeding)
  /** Bracket structure */
  bracket: Bracket | null
  /** All bracket matches */
  bracketMatches: BracketMatch[]
  /** Final seeding results used to generate bracket */
  finalSeedingResults: HybridSeedingResult[] | null

  // Phase transition timestamps
  /** When seeding was locked/finalized */
  seedingLockedAt: string | null
  /** When bracket was generated */
  bracketGeneratedAt: string | null
}

/** Props for hybrid tournament components */
export interface HybridTournamentProps {
  /** Current event */
  event: LiveEvent
  /** Hybrid tournament data */
  tournament: HybridTournament
  /** Tournament progress */
  progress: HybridTournamentProgress
  /** All teams in the tournament */
  teams: RoundRobinTeam[]
  /** Available courts */
  courts: Court[]
  /** Current user context */
  currentUser: CurrentUser

  // GM Actions - Seeding Phase
  /** Called when GM calls a seeding match to a court */
  onCallSeedingMatch?: (matchId: string, courtId: string) => void
  /** Called when GM starts a seeding match */
  onStartSeedingMatch?: (matchId: string) => void
  /** Called when GM enters score for seeding match */
  onEnterSeedingScore?: (matchId: string, team1Score: number, team2Score: number) => void
  /** Called when GM marks a seeding match forfeit */
  onMarkSeedingForfeit?: (matchId: string, forfeitingTeam: 'team1' | 'team2') => void

  // GM Actions - Phase Transition
  /** Called when GM locks seeding standings */
  onLockSeeding?: () => void
  /** Called when GM generates bracket from seeding */
  onGenerateBracket?: () => void
  /** Called when GM overrides a seed position */
  onOverrideSeed?: (teamId: string, newSeed: number) => void
  /** Called when GM starts the bracket phase */
  onStartBracketPhase?: () => void

  // GM Actions - Bracket Phase
  /** Called when GM calls a bracket match to a court */
  onCallBracketMatch?: (bracketMatchId: string, courtId: string) => void
  /** Called when GM starts a bracket match */
  onStartBracketMatch?: (bracketMatchId: string) => void
  /** Called when GM enters score for bracket match */
  onEnterBracketScore?: (bracketMatchId: string) => void
  /** Called when GM marks a bracket match forfeit */
  onMarkBracketForfeit?: (bracketMatchId: string, forfeitingTeam: 'team1' | 'team2') => void
  /** Called when GM manually advances a team */
  onManualAdvance?: (bracketMatchId: string, winner: 'team1' | 'team2', reason: string) => void

  // GM Actions - Event Control
  /** Called when GM pauses the event */
  onPauseEvent?: (reason: string) => void
  /** Called when GM resumes the event */
  onResumeEvent?: () => void
  /** Called when GM ends the event */
  onEndEvent?: () => void

  // Player Actions
  /** Called when player checks in at court */
  onCourtCheckIn?: (matchId: string) => void
  /** Called when player submits score */
  onSubmitScore?: (matchId: string, team1Score: number, team2Score: number) => void
  /** Called when player confirms opponent's score */
  onConfirmScore?: (matchId: string) => void

  // Navigation
  /** Called to view full bracket */
  onViewBracket?: () => void
  /** Called to view team details */
  onViewTeam?: (teamId: string) => void
  /** Called to view match details */
  onViewMatch?: (matchId: string) => void
  /** Called to open court status board */
  onOpenCourtBoard?: () => void
  /** Called to share tournament */
  onShareTournament?: () => void
}

/** Props for phase transition screen */
export interface PhaseTransitionScreenProps {
  /** Final seeding results */
  seedingResults: HybridSeedingResult[]
  /** Bracket preview (seeds mapped to positions) */
  bracketPreview: {
    matchId: string
    position: string
    seed1: number
    team1Name: string
    seed2: number
    team2Name: string
  }[]
  /** Bracket configuration */
  bracketConfig: BracketPhaseConfig
  /** Whether GM can modify seeds before generating */
  allowSeedOverride: boolean

  // Callbacks
  /** Called when GM confirms and generates bracket */
  onConfirmAndGenerate?: () => void
  /** Called when GM overrides a seed */
  onOverrideSeed?: (teamId: string, newSeed: number) => void
  /** Called to go back to seeding view */
  onBack?: () => void
}

/** Props for hybrid seeding view (player view) */
export interface HybridSeedingViewProps {
  /** Current event */
  event: LiveEvent
  /** Hybrid tournament data */
  tournament: HybridTournament
  /** Tournament progress */
  progress: HybridTournamentProgress
  /** All teams */
  teams: RoundRobinTeam[]
  /** Current user context */
  currentUser: {
    id: string
    name: string
    teamId: string
    currentMatchId: string | null
    nextMatchId: string | null
    currentSeed: number
  }
  /** Player's schedule view */
  scheduleView: PlayerScheduleView

  // Player Actions
  onCheckIn?: (matchId: string) => void
  onSubmitScore?: (matchId: string, team1Score: number, team2Score: number) => void
  onConfirmScore?: (matchId: string) => void

  // Navigation
  onViewMatch?: (matchId: string) => void
  onViewTeam?: (teamId: string) => void
  onViewStandings?: () => void
}
