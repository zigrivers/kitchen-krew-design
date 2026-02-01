// =============================================================================
// Data Types
// =============================================================================

/** Skill rating with source information */
export interface SkillRating {
  rating: number
  source: 'self_assessed' | 'dupr' | 'calculated'
  lastUpdated?: string
}

/** Player's skill ratings for different game types */
export interface SkillRatings {
  singles: SkillRating
  doubles: SkillRating
  duprRating?: number | null
  calculatedRating?: number | null
}

/** Player's preferred playing schedule and style */
export interface PlayingPreferences {
  preferredSide: 'left' | 'right' | 'both'
  playingStyle: 'aggressive' | 'defensive' | 'all_around'
  preferredDays: string[]
  preferredTimeStart: string
  preferredTimeEnd: string
  opponentSkillMin: number
  opponentSkillMax: number
}

/** Privacy and visibility settings */
export interface PrivacySettings {
  profileVisibility: 'public' | 'friends_only' | 'private'
  showMatchHistory: boolean
  showStatistics: boolean
  showOnLeaderboards: boolean
  showInSearch: boolean
  friendRequestsFrom: 'anyone' | 'friends_of_friends' | 'no_one'
}

/** Player statistics summary */
export interface PlayerStats {
  totalGames: number
  wins: number
  losses: number
  winRate: number
  eventsAttended?: number
  uniquePartners?: number
  uniqueOpponents?: number
  currentWinStreak?: number
  bestWinStreak?: number
}

/** Full player profile (for current user) */
export interface CurrentUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  bio: string
  location: string
  memberSince: string
  profileCompletion: number
  isVerified: boolean
  skillRatings: SkillRatings
  playingPreferences: PlayingPreferences
  privacySettings: PrivacySettings
  stats: PlayerStats
  friendsCount: number
  achievementCount: number
}

/** Simplified player info for lists and cards */
export interface Player {
  id: string
  name: string
  avatarUrl: string | null
  bio: string
  location: string
  isVerified: boolean
  skillRatings: {
    singles: { rating: number; source: string }
    doubles: { rating: number; source: string }
  }
  playingStyle: 'aggressive' | 'defensive' | 'all_around'
  preferredSide: 'left' | 'right' | 'both'
  isFriend: boolean
  mutualFriends: number
  stats: {
    totalGames: number
    winRate: number
  }
}

/** Simplified player reference for lists */
export interface PlayerReference {
  id: string
  name: string
  avatarUrl: string | null
  skillRating: number
  addedAt?: string
  mutualFriends?: number
}

/** Friend request (incoming or outgoing) */
export interface FriendRequest {
  id: string
  type: 'incoming' | 'outgoing'
  player: PlayerReference
  message: string | null
  sentAt: string
}

/** Achievement badge definition */
export interface Achievement {
  id: string
  name: string
  description: string
  category: 'activity' | 'wins' | 'streaks' | 'events' | 'social' | 'variety'
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  criteria: string
  iconName: string
  isEarned: boolean
  earnedAt: string | null
  progress: number
  target: number
  /** Percentage of players who have earned this (0-1) */
  rarity: number
}

/** Skill level description for rating selector */
export interface SkillLevelDescription {
  rating: number
  label: string
  description: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface PlayersProps {
  /** Current logged-in user's full profile */
  currentUser: CurrentUser
  /** List of other players (for search/browse) */
  players: Player[]
  /** Pending friend requests */
  friendRequests: FriendRequest[]
  /** Players marked as preferred partners */
  preferredPartners: PlayerReference[]
  /** Players marked as preferred opponents */
  preferredOpponents: PlayerReference[]
  /** Players to avoid in matching */
  avoidInMatching: PlayerReference[]
  /** All available achievements */
  achievements: Achievement[]
  /** Skill level descriptions for rating selector */
  skillLevelDescriptions: SkillLevelDescription[]

  // Profile actions
  /** Called when user saves profile edits */
  onSaveProfile?: (updates: Partial<CurrentUser>) => void
  /** Called when user uploads a new avatar */
  onUploadAvatar?: (file: File) => void
  /** Called when user updates skill rating */
  onUpdateSkillRating?: (type: 'singles' | 'doubles', rating: number) => void
  /** Called when user updates playing preferences */
  onUpdatePreferences?: (preferences: Partial<PlayingPreferences>) => void
  /** Called when user updates privacy settings */
  onUpdatePrivacy?: (settings: Partial<PrivacySettings>) => void

  // Friend actions
  /** Called when user sends a friend request */
  onSendFriendRequest?: (playerId: string, message?: string) => void
  /** Called when user accepts a friend request */
  onAcceptFriendRequest?: (requestId: string) => void
  /** Called when user declines a friend request */
  onDeclineFriendRequest?: (requestId: string) => void
  /** Called when user cancels an outgoing request */
  onCancelFriendRequest?: (requestId: string) => void
  /** Called when user removes a friend */
  onRemoveFriend?: (playerId: string) => void
  /** Called when user blocks a player */
  onBlockPlayer?: (playerId: string) => void

  // Partner/opponent list actions
  /** Called when user adds a player to preferred partners */
  onAddPreferredPartner?: (playerId: string) => void
  /** Called when user removes a player from preferred partners */
  onRemovePreferredPartner?: (playerId: string) => void
  /** Called when user adds a player to preferred opponents */
  onAddPreferredOpponent?: (playerId: string) => void
  /** Called when user removes a player from preferred opponents */
  onRemovePreferredOpponent?: (playerId: string) => void
  /** Called when user adds a player to avoid list */
  onAddToAvoidList?: (playerId: string) => void
  /** Called when user removes a player from avoid list */
  onRemoveFromAvoidList?: (playerId: string) => void

  // Navigation actions
  /** Called when user wants to view another player's profile */
  onViewPlayer?: (playerId: string) => void
  /** Called when user wants to view an achievement's details */
  onViewAchievement?: (achievementId: string) => void
  /** Called when user searches for players */
  onSearchPlayers?: (query: string) => void
}

// =============================================================================
// Sub-component Props
// =============================================================================

export interface PlayerProfileProps {
  player: CurrentUser | Player
  isCurrentUser: boolean
  onEdit?: () => void
  onSendFriendRequest?: () => void
  onRemoveFriend?: () => void
  onAddPreferredPartner?: () => void
  onAddToAvoidList?: () => void
}

export interface FriendRequestListProps {
  requests: FriendRequest[]
  onAccept?: (requestId: string) => void
  onDecline?: (requestId: string) => void
  onCancel?: (requestId: string) => void
  onViewProfile?: (playerId: string) => void
}

export interface AchievementsGridProps {
  achievements: Achievement[]
  onViewAchievement?: (achievementId: string) => void
  filterCategory?: Achievement['category']
}

export interface SkillRatingSelectorProps {
  currentRating: number
  ratingType: 'singles' | 'doubles'
  descriptions: SkillLevelDescription[]
  onChange?: (rating: number) => void
}

export interface PlayerSearchProps {
  players: Player[]
  onSearch?: (query: string) => void
  onViewPlayer?: (playerId: string) => void
  onSendFriendRequest?: (playerId: string) => void
}
