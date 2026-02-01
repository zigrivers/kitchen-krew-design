// =============================================================================
// Data Types
// =============================================================================

/** Basic player reference used in various contexts */
export interface PlayerReference {
  id: string
  name: string
  avatarUrl?: string | null
}

/** The current logged-in player with ratings */
export interface CurrentPlayer {
  id: string
  name: string
  avatarUrl: string | null
  skillRating: number
  duprRating: number | null
  memberSince: string
}

/** Date range for streak statistics */
export interface DateRange {
  start: string
  end: string
}

/** Aggregated statistics for a player */
export interface PlayerStats {
  playerId: string
  totalGames: number
  wins: number
  losses: number
  winPercentage: number
  doublesGames: number
  doublesWins: number
  doublesLosses: number
  singlesGames: number
  singlesWins: number
  singlesLosses: number
  currentWinStreak: number
  currentLossStreak: number
  longestWinStreak: number
  longestWinStreakDates: DateRange
  longestLossStreak: number
  longestLossStreakDates: DateRange
  avgPointDifferential: number
  avgPointDifferentialWins: number
  avgPointDifferentialLosses: number
  gamesThisWeek: number
  gamesThisMonth: number
  gamesThisYear: number
  avgGamesPerWeek: number
  trend: 'improving' | 'declining' | 'stable'
}

/** Win/loss record with a specific partner */
export interface PartnerRecord {
  partnerId: string
  partnerName: string
  partnerAvatarUrl: string | null
  partnerRating: number
  gamesPlayed: number
  wins: number
  losses: number
  winPercentage: number
  avgPointDiff: number
  lastPlayedDate: string
}

/** Current streak against an opponent */
export interface Streak {
  type: 'win' | 'loss'
  count: number
}

/** Head-to-head record against an opponent */
export interface OpponentRecord {
  opponentId: string
  opponentName: string
  opponentAvatarUrl: string | null
  opponentRating: number
  gamesPlayed: number
  wins: number
  losses: number
  winPercentage: number
  currentStreak: Streak
  lastPlayedDate: string
}

/** A data point in the rating history for trend charts */
export interface RatingHistoryPoint {
  date: string
  rating: number
  duprRating: number | null
}

/** Game score for a single game in a match */
export interface GameScore {
  us: number
  them: number
}

/** A match in the player's history */
export interface MatchHistoryEntry {
  id: string
  date: string
  eventId: string
  eventName: string
  venueId: string
  venueName: string
  format: 'doubles' | 'singles'
  partner: PlayerReference | null
  opponents: PlayerReference[]
  scores: GameScore[]
  result: 'win' | 'loss'
  pointDiff: number
}

/** Activity data for a single day (calendar heat map) */
export interface ActivityDay {
  date: string
  gamesPlayed: number
}

/** An entry in a leaderboard */
export interface LeaderboardEntry {
  rank: number
  playerId: string
  playerName: string
  avatarUrl: string | null
  wins: number
  losses: number
  pointDiff: number
  isCurrentPlayer: boolean
}

/** Extended leaderboard entry with additional stats for club leaderboards */
export interface ClubLeaderboardEntry extends LeaderboardEntry {
  rating: number
  winPercentage: number
  gamesPlayed: number
}

/** Event leaderboard with entries */
export interface EventLeaderboard {
  eventId: string
  eventName: string
  eventDate: string
  metric: 'wins' | 'winPercentage' | 'pointDiff'
  entries: LeaderboardEntry[]
}

/** Club leaderboard with configurable metrics and time periods */
export interface ClubLeaderboard {
  clubId: string
  clubName: string
  metric: 'wins' | 'winPercentage' | 'gamesPlayed' | 'rating'
  timePeriod: 'week' | 'month' | 'year' | 'allTime'
  entries: ClubLeaderboardEntry[]
}

/** Template option for shareable stats cards */
export interface StatsCardTemplate {
  id: string
  name: string
  previewUrl: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface StatsLeaderboardsProps {
  /** Current logged-in player */
  currentPlayer: CurrentPlayer
  /** Player's aggregated statistics */
  playerStats: PlayerStats
  /** Records with each partner */
  partnerRecords: PartnerRecord[]
  /** Records against each opponent */
  opponentRecords: OpponentRecord[]
  /** Rating history for trend chart */
  ratingHistory: RatingHistoryPoint[]
  /** Complete match history */
  matchHistory: MatchHistoryEntry[]
  /** Activity data for calendar heat map */
  activityCalendar: ActivityDay[]
  /** Current event leaderboard */
  eventLeaderboard: EventLeaderboard | null
  /** Club leaderboard */
  clubLeaderboard: ClubLeaderboard | null
  /** Available templates for stats card generation */
  statsCardTemplates: StatsCardTemplate[]

  // Stats actions
  /** Called when user changes the date filter */
  onFilterByDate?: (startDate: string, endDate: string) => void
  /** Called when user changes the format filter */
  onFilterByFormat?: (format: 'all' | 'doubles' | 'singles') => void

  // Partner/opponent actions
  /** Called when user wants to view partner details */
  onViewPartner?: (partnerId: string) => void
  /** Called when user wants to view opponent details */
  onViewOpponent?: (opponentId: string) => void
  /** Called when user wants to see head-to-head history */
  onViewHeadToHead?: (playerId: string) => void

  // Match history actions
  /** Called when user wants to view match details */
  onViewMatch?: (matchId: string) => void
  /** Called when user wants to export match history */
  onExportHistory?: (format: 'excel' | 'pdf' | 'csv', startDate?: string, endDate?: string) => void

  // Leaderboard actions
  /** Called when user changes leaderboard metric */
  onChangeLeaderboardMetric?: (metric: 'wins' | 'winPercentage' | 'gamesPlayed' | 'rating') => void
  /** Called when user changes leaderboard time period */
  onChangeLeaderboardPeriod?: (period: 'week' | 'month' | 'year' | 'allTime') => void
  /** Called when user wants to view a player on leaderboard */
  onViewLeaderboardPlayer?: (playerId: string) => void

  // Stats card actions
  /** Called when user generates a shareable stats card */
  onGenerateStatsCard?: (templateId: string) => void
  /** Called when user shares stats card to social media */
  onShareStatsCard?: (platform: 'instagram' | 'facebook' | 'twitter' | 'download') => void

  // Navigation
  /** Called when user wants to view event details */
  onViewEvent?: (eventId: string) => void
  /** Called when user wants to view club details */
  onViewClub?: (clubId: string) => void
}

// =============================================================================
// Sub-component Props
// =============================================================================

export interface StatsDashboardProps {
  playerStats: PlayerStats
  ratingHistory: RatingHistoryPoint[]
  onFilterByDate?: (startDate: string, endDate: string) => void
  onFilterByFormat?: (format: 'all' | 'doubles' | 'singles') => void
}

export interface PartnerTableProps {
  partners: PartnerRecord[]
  sortBy?: 'gamesPlayed' | 'winPercentage' | 'lastPlayed'
  onViewPartner?: (partnerId: string) => void
  onViewHeadToHead?: (partnerId: string) => void
}

export interface OpponentTableProps {
  opponents: OpponentRecord[]
  sortBy?: 'gamesPlayed' | 'winPercentage' | 'lastPlayed'
  onViewOpponent?: (opponentId: string) => void
  onViewHeadToHead?: (opponentId: string) => void
}

export interface RatingChartProps {
  ratingHistory: RatingHistoryPoint[]
  timeRange?: '3m' | '6m' | '1y' | 'all'
  onChangeTimeRange?: (range: '3m' | '6m' | '1y' | 'all') => void
}

export interface MatchHistoryListProps {
  matches: MatchHistoryEntry[]
  onViewMatch?: (matchId: string) => void
  onFilterByDate?: (startDate: string, endDate: string) => void
  onFilterByFormat?: (format: 'all' | 'doubles' | 'singles') => void
  onFilterByResult?: (result: 'all' | 'win' | 'loss') => void
}

export interface ActivityCalendarProps {
  activityData: ActivityDay[]
  onSelectDay?: (date: string) => void
}

export interface LeaderboardTableProps {
  leaderboard: EventLeaderboard | ClubLeaderboard
  onViewPlayer?: (playerId: string) => void
  onChangeMetric?: (metric: string) => void
  onChangePeriod?: (period: string) => void
}

export interface StatsCardGeneratorProps {
  playerStats: PlayerStats
  currentPlayer: CurrentPlayer
  templates: StatsCardTemplate[]
  onGenerate?: (templateId: string) => void
  onShare?: (platform: 'instagram' | 'facebook' | 'twitter' | 'download') => void
}

export interface ExportDialogProps {
  onExport?: (format: 'excel' | 'pdf' | 'csv', startDate?: string, endDate?: string) => void
  onClose?: () => void
}
