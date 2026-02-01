// =============================================================================
// Data Types
// =============================================================================

/** Simplified player reference used in matches and queues */
export interface MatchPlayer {
  id: string
  name: string
  skillRating: number
}

/** A team in a match (2 players for doubles) */
export interface Team {
  players: MatchPlayer[]
  score: number
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
  format: 'round_robin' | 'open_play' | 'king_of_court' | 'single_elimination' | 'double_elimination' | 'ladder'
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

/** An individual match/game */
export interface Match {
  id: string
  courtId: string | null
  status: 'scheduled' | 'calling' | 'in_progress' | 'completed' | 'cancelled'
  round: number
  team1: Team
  team2: Team
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
  wins: number
  losses: number
  isOrganizer?: boolean
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
  /** Current standings/leaderboard */
  standings: Standing[]
  /** Active score disputes */
  scoreDisputes: ScoreDispute[]
  /** Completed match summaries */
  completedMatches: CompletedMatchSummary[]

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

  // Navigation
  /** Called when user wants to view a player's profile */
  onViewPlayer?: (playerId: string) => void
  /** Called when user wants to view match details */
  onViewMatch?: (matchId: string) => void
  /** Called when user wants full-screen court board */
  onOpenCourtBoard?: () => void
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
  onSubmit?: (team1Score: number, team2Score: number) => void
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
