import {
  ChevronLeft,
  Edit,
  Camera,
  MapPin,
  Calendar,
  Trophy,
  Users,
  Swords,
  TrendingUp,
  Flame,
  Star,
  Shield,
  Eye,
  EyeOff,
  Clock,
  Target,
  Medal,
  CheckCircle2,
  Settings,
  Share2,
  UserPlus,
  UserMinus,
  Ban,
  HeartHandshake,
  ChevronRight,
} from 'lucide-react'
import type {
  CurrentUser,
  Player,
  SkillRating,
  Achievement,
  SkillLevelDescription,
} from '@/../product/sections/players/types'

// =============================================================================
// Props
// =============================================================================

export interface PlayerProfileProps {
  /** The player being viewed (CurrentUser for own profile, Player for others) */
  player: CurrentUser | Player
  /** Whether this is the logged-in user's own profile */
  isCurrentUser: boolean
  /** Achievements to display (only shown for current user or if player allows) */
  achievements?: Achievement[]
  /** Skill level descriptions for rating display */
  skillLevelDescriptions?: SkillLevelDescription[]

  // Navigation
  onBack?: () => void

  // Current user actions
  onEditProfile?: () => void
  onEditAvatar?: () => void
  onEditPreferences?: () => void
  onEditPrivacy?: () => void
  onViewAllAchievements?: () => void

  // Other player actions
  onSendFriendRequest?: () => void
  onRemoveFriend?: () => void
  onAddPreferredPartner?: () => void
  onRemovePreferredPartner?: () => void
  onAddToAvoidList?: () => void
  onRemoveFromAvoidList?: () => void
  onBlockPlayer?: () => void
  onShareProfile?: () => void
}

// =============================================================================
// Type Guards
// =============================================================================

function isCurrentUser(player: CurrentUser | Player): player is CurrentUser {
  return 'email' in player && 'playingPreferences' in player
}

// =============================================================================
// Sub-Components
// =============================================================================

function Avatar({
  name,
  avatarUrl,
  size = 'lg',
  onEdit,
}: {
  name: string
  avatarUrl: string | null
  size?: 'md' | 'lg' | 'xl'
  onEdit?: () => void
}) {
  const sizeClasses = {
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl',
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative group">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-lime-400 via-lime-500 to-sky-500 flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shadow-xl`}
        >
          <span className="font-bold text-white">{initials}</span>
        </div>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Camera className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function SkillRatingBadge({
  rating,
  type,
  source,
  descriptions,
}: {
  rating: number
  type: 'singles' | 'doubles'
  source: SkillRating['source']
  descriptions?: SkillLevelDescription[]
}) {
  const sourceLabels = {
    self_assessed: 'Self',
    dupr: 'DUPR',
    calculated: 'Calc',
  }

  const sourceColors = {
    self_assessed: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    dupr: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400',
    calculated: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-400',
  }

  const levelLabel = descriptions?.find((d) => d.rating === Math.floor(rating * 2) / 2)?.label

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="p-2.5 rounded-xl bg-lime-100 dark:bg-lime-900/30">
        {type === 'singles' ? (
          <Trophy className="w-5 h-5 text-lime-600 dark:text-lime-400" />
        ) : (
          <Users className="w-5 h-5 text-lime-600 dark:text-lime-400" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{rating.toFixed(2)}</span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${sourceColors[source]}`}>
            {sourceLabels[source]}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">{type}</span>
          {levelLabel && (
            <>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{levelLabel}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
  color = 'slate',
}: {
  icon: React.ElementType
  value: string | number
  label: string
  color?: 'lime' | 'sky' | 'amber' | 'purple' | 'slate'
}) {
  const colorClasses = {
    lime: 'bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400',
    sky: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-3`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const levelColors = {
    bronze: 'from-amber-600 to-amber-700',
    silver: 'from-slate-400 to-slate-500',
    gold: 'from-yellow-400 to-amber-500',
    platinum: 'from-cyan-400 to-sky-500',
  }

  return (
    <div
      className={`relative w-14 h-14 rounded-xl flex items-center justify-center ${
        achievement.isEarned
          ? `bg-gradient-to-br ${levelColors[achievement.level]} shadow-lg`
          : 'bg-slate-100 dark:bg-slate-800'
      }`}
    >
      <Medal
        className={`w-6 h-6 ${achievement.isEarned ? 'text-white' : 'text-slate-400 dark:text-slate-600'}`}
      />
      {!achievement.isEarned && achievement.progress > 0 && (
        <div className="absolute -bottom-1 left-1 right-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-lime-500 rounded-full"
            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

function PlayingStyleTag({ style }: { style: 'aggressive' | 'defensive' | 'all_around' }) {
  const styles = {
    aggressive: { label: 'Aggressive', icon: Swords, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
    defensive: { label: 'Defensive', icon: Shield, color: 'text-sky-500 bg-sky-50 dark:bg-sky-900/20' },
    all_around: { label: 'All-Around', icon: Target, color: 'text-lime-500 bg-lime-50 dark:bg-lime-900/20' },
  }

  const { label, icon: Icon, color } = styles[style]

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${color}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  )
}

function PreferredSideTag({ side }: { side: 'left' | 'right' | 'both' }) {
  const labels = { left: 'Left Side', right: 'Right Side', both: 'Either Side' }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
      {labels[side]}
    </span>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function PlayerProfile({
  player,
  isCurrentUser: isOwnProfile,
  achievements = [],
  skillLevelDescriptions,
  onBack,
  onEditProfile,
  onEditAvatar,
  onEditPreferences,
  onEditPrivacy,
  onViewAllAchievements,
  onSendFriendRequest,
  onRemoveFriend,
  onAddPreferredPartner,
  onRemovePreferredPartner,
  onAddToAvoidList,
  onRemoveFromAvoidList,
  onBlockPlayer,
  onShareProfile,
}: PlayerProfileProps) {
  const currentUserData = isCurrentUser(player) ? player : null
  const simplePlayerData = !isCurrentUser(player) ? player : null

  // Get stats
  const stats = currentUserData?.stats ?? simplePlayerData?.stats
  const winRate = stats?.winRate ?? 0

  // Get playing style and preferred side
  const playingStyle = currentUserData?.playingPreferences.playingStyle ?? simplePlayerData?.playingStyle
  const preferredSide = currentUserData?.playingPreferences.preferredSide ?? simplePlayerData?.preferredSide

  // Recent achievements (earned, sorted by date)
  const recentAchievements = achievements
    .filter((a) => a.isEarned)
    .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Top Bar */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={onEditProfile}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit profile"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onEditPrivacy}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Privacy settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onShareProfile}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Share profile"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-24 pt-4">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <Avatar
              name={player.name}
              avatarUrl={player.avatarUrl}
              size="xl"
              onEdit={isOwnProfile ? onEditAvatar : undefined}
            />

            <div className="mt-6">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{player.name}</h1>
                {player.isVerified && (
                  <CheckCircle2 className="w-6 h-6 text-lime-400" />
                )}
              </div>

              <div className="flex items-center justify-center gap-3 mt-2 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {player.location}
                </span>
                {currentUserData && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Member since {new Date(currentUserData.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>

              {player.bio && (
                <p className="mt-4 text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {player.bio}
                </p>
              )}

              {/* Playing Style Tags */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {playingStyle && <PlayingStyleTag style={playingStyle} />}
                {preferredSide && <PreferredSideTag side={preferredSide} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Skill Ratings */}
          <div className="grid sm:grid-cols-2 gap-4">
            <SkillRatingBadge
              rating={isCurrentUser(player) ? player.skillRatings.singles.rating : player.skillRatings.singles.rating}
              type="singles"
              source={isCurrentUser(player) ? player.skillRatings.singles.source : (player.skillRatings.singles.source as SkillRating['source'])}
              descriptions={skillLevelDescriptions}
            />
            <SkillRatingBadge
              rating={isCurrentUser(player) ? player.skillRatings.doubles.rating : player.skillRatings.doubles.rating}
              type="doubles"
              source={isCurrentUser(player) ? player.skillRatings.doubles.source : (player.skillRatings.doubles.source as SkillRating['source'])}
              descriptions={skillLevelDescriptions}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={Trophy}
              value={stats?.totalGames ?? 0}
              label="Games Played"
              color="lime"
            />
            <StatCard
              icon={TrendingUp}
              value={`${Math.round(winRate * 100)}%`}
              label="Win Rate"
              color="sky"
            />
            {currentUserData && (
              <>
                <StatCard
                  icon={Flame}
                  value={currentUserData.stats.currentWinStreak ?? 0}
                  label="Current Streak"
                  color="amber"
                />
                <StatCard
                  icon={Calendar}
                  value={currentUserData.stats.eventsAttended ?? 0}
                  label="Events"
                  color="purple"
                />
              </>
            )}
            {simplePlayerData && (
              <>
                <StatCard
                  icon={Users}
                  value={simplePlayerData.mutualFriends}
                  label="Mutual Friends"
                  color="amber"
                />
                <StatCard
                  icon={Star}
                  value={simplePlayerData.isFriend ? 'Yes' : 'No'}
                  label="Friend"
                  color="purple"
                />
              </>
            )}
          </div>

          {/* Action Buttons (for other players) */}
          {!isOwnProfile && simplePlayerData && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="grid sm:grid-cols-2 gap-3">
                {simplePlayerData.isFriend ? (
                  <button
                    onClick={onRemoveFriend}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
                  >
                    <UserMinus className="w-4 h-4" />
                    Remove Friend
                  </button>
                ) : (
                  <button
                    onClick={onSendFriendRequest}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Send Friend Request
                  </button>
                )}

                <button
                  onClick={onAddPreferredPartner}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium border-2 border-lime-200 dark:border-lime-800 text-lime-700 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors"
                >
                  <HeartHandshake className="w-4 h-4" />
                  Add to Partners
                </button>

                <button
                  onClick={onAddToAvoidList}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-amber-300 hover:text-amber-600 dark:hover:border-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                  Avoid in Matching
                </button>

                <button
                  onClick={onBlockPlayer}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  Block Player
                </button>
              </div>
            </div>
          )}

          {/* Playing Preferences (own profile only) */}
          {isOwnProfile && currentUserData && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Playing Preferences</h2>
                <button
                  onClick={onEditPreferences}
                  className="p-2 rounded-lg text-slate-400 hover:text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Preferred Time</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {currentUserData.playingPreferences.preferredTimeStart} – {currentUserData.playingPreferences.preferredTimeEnd}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Preferred Days</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                      {currentUserData.playingPreferences.preferredDays.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <Target className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Opponent Skill Range</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {currentUserData.playingPreferences.opponentSkillMin.toFixed(1)} – {currentUserData.playingPreferences.opponentSkillMax.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Completion (own profile only) */}
          {isOwnProfile && currentUserData && currentUserData.profileCompletion < 100 && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-lime-50 to-sky-50 dark:from-lime-900/20 dark:to-sky-900/20 border border-lime-200 dark:border-lime-800/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">Complete Your Profile</h3>
                <span className="text-sm font-bold text-lime-600 dark:text-lime-400">
                  {currentUserData.profileCompletion}%
                </span>
              </div>
              <div className="h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lime-400 to-sky-400 rounded-full transition-all"
                  style={{ width: `${currentUserData.profileCompletion}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Add more details to help others find you and get better match recommendations.
              </p>
            </div>
          )}

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Achievements</h2>
                  {isOwnProfile && currentUserData && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400">
                      {currentUserData.achievementCount} earned
                    </span>
                  )}
                </div>
                {onViewAllAchievements && (
                  <button
                    onClick={onViewAllAchievements}
                    className="flex items-center gap-1 text-sm font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 transition-colors"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex-shrink-0">
                    <AchievementBadge achievement={achievement} />
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 max-w-14 truncate">
                      {achievement.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Note (own profile only) */}
          {isOwnProfile && currentUserData && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50">
              <Eye className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your profile is{' '}
                <span className="font-medium text-slate-900 dark:text-white">
                  {currentUserData.privacySettings.profileVisibility === 'public'
                    ? 'visible to everyone'
                    : currentUserData.privacySettings.profileVisibility === 'friends_only'
                    ? 'visible to friends only'
                    : 'private'}
                </span>
                .{' '}
                <button
                  onClick={onEditPrivacy}
                  className="font-medium text-lime-600 dark:text-lime-400 hover:underline"
                >
                  Change settings
                </button>
              </p>
            </div>
          )}

          {/* Bottom spacing */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  )
}
