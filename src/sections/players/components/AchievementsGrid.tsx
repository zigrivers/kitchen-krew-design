import { useState } from 'react'
import {
  ChevronLeft,
  Trophy,
  Medal,
  Award,
  Star,
  Crown,
  Flame,
  Zap,
  Rocket,
  Calendar,
  CalendarDays,
  CalendarCheck,
  Users,
  HeartHandshake,
  Swords,
  Shuffle,
  Play,
  TrendingUp,
  Footprints,
  X,
  Lock,
  Sparkles,
} from 'lucide-react'
import type { Achievement, CurrentUser } from '@/../product/sections/players/types'

// =============================================================================
// Props
// =============================================================================

export interface AchievementsGridProps {
  /** All available achievements */
  achievements: Achievement[]
  /** Current user stats for context */
  currentUser?: CurrentUser
  /** Currently selected category filter */
  filterCategory?: Achievement['category'] | 'all'

  // Navigation
  onBack?: () => void

  // Actions
  onViewAchievement?: (achievementId: string) => void
  onFilterChange?: (category: Achievement['category'] | 'all') => void
  onShare?: (achievementId: string) => void
}

// =============================================================================
// Icon Mapping
// =============================================================================

const iconMap: Record<string, React.ElementType> = {
  footprints: Footprints,
  play: Play,
  'calendar-check': CalendarCheck,
  trophy: Trophy,
  crown: Crown,
  medal: Medal,
  'trending-up': TrendingUp,
  award: Award,
  flame: Flame,
  zap: Zap,
  rocket: Rocket,
  calendar: Calendar,
  'calendar-days': CalendarDays,
  star: Star,
  users: Users,
  'heart-handshake': HeartHandshake,
  swords: Swords,
  shuffle: Shuffle,
}

// =============================================================================
// Sub-Components
// =============================================================================

function CategoryPill({
  category,
  label,
  count,
  isActive,
  onClick,
}: {
  category: Achievement['category'] | 'all'
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
        isActive
          ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/25'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
      }`}
    >
      {label}
      <span
        className={`px-1.5 py-0.5 rounded-full text-xs ${
          isActive
            ? 'bg-white/20 text-white'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function AchievementCard({
  achievement,
  onClick,
}: {
  achievement: Achievement
  onClick?: () => void
}) {
  const Icon = iconMap[achievement.iconName] || Medal

  const levelColors = {
    bronze: {
      bg: 'from-amber-600 to-amber-700',
      ring: 'ring-amber-300 dark:ring-amber-700',
      glow: 'shadow-amber-500/30',
    },
    silver: {
      bg: 'from-slate-400 to-slate-500',
      ring: 'ring-slate-300 dark:ring-slate-600',
      glow: 'shadow-slate-400/30',
    },
    gold: {
      bg: 'from-yellow-400 to-amber-500',
      ring: 'ring-yellow-300 dark:ring-yellow-700',
      glow: 'shadow-yellow-500/30',
    },
    platinum: {
      bg: 'from-cyan-400 to-sky-500',
      ring: 'ring-cyan-300 dark:ring-cyan-700',
      glow: 'shadow-cyan-500/30',
    },
  }

  const colors = levelColors[achievement.level]
  const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100)
  const rarityPercent = Math.round(achievement.rarity * 100)

  return (
    <button
      onClick={onClick}
      className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-lime-300 dark:hover:border-lime-700 transition-all hover:shadow-lg text-left w-full"
    >
      {/* Rarity indicator */}
      <div className="absolute top-3 right-3">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            rarityPercent <= 10
              ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
              : rarityPercent <= 25
              ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {rarityPercent}% have this
        </span>
      </div>

      <div className="flex items-start gap-4">
        {/* Badge */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              achievement.isEarned
                ? `bg-gradient-to-br ${colors.bg} ring-2 ${colors.ring} shadow-lg ${colors.glow}`
                : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {achievement.isEarned ? (
              <Icon className="w-7 h-7 text-white" />
            ) : (
              <Lock className="w-6 h-6 text-slate-400 dark:text-slate-600" />
            )}
          </div>

          {/* Earned checkmark */}
          {achievement.isEarned && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <h3
            className={`font-semibold truncate ${
              achievement.isEarned ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {achievement.name}
          </h3>
          <p
            className={`text-sm mt-0.5 line-clamp-2 ${
              achievement.isEarned ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {achievement.description}
          </p>

          {/* Progress bar (for unearned) */}
          {!achievement.isEarned && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 dark:text-slate-400">{achievement.criteria}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {achievement.progress}/{achievement.target}
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Earned date */}
          {achievement.isEarned && achievement.earnedAt && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              Earned {new Date(achievement.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}

function AchievementDetailModal({
  achievement,
  onClose,
  onShare,
}: {
  achievement: Achievement
  onClose: () => void
  onShare?: () => void
}) {
  const Icon = iconMap[achievement.iconName] || Medal

  const levelColors = {
    bronze: { bg: 'from-amber-600 to-amber-700', text: 'text-amber-600 dark:text-amber-400' },
    silver: { bg: 'from-slate-400 to-slate-500', text: 'text-slate-500 dark:text-slate-400' },
    gold: { bg: 'from-yellow-400 to-amber-500', text: 'text-amber-500 dark:text-amber-400' },
    platinum: { bg: 'from-cyan-400 to-sky-500', text: 'text-sky-500 dark:text-sky-400' },
  }

  const colors = levelColors[achievement.level]
  const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100)
  const rarityPercent = Math.round(achievement.rarity * 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header with gradient */}
        <div className={`relative bg-gradient-to-br ${colors.bg} p-8 text-center`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-24 h-24 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
            {achievement.isEarned ? (
              <Icon className="w-12 h-12 text-white" />
            ) : (
              <Lock className="w-10 h-10 text-white/60" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-white">{achievement.name}</h2>
          <p className="text-white/80 mt-1 capitalize">{achievement.level} • {achievement.category}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">{achievement.description}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">{achievement.criteria}</p>
          </div>

          {/* Progress */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {achievement.progress} / {achievement.target}
              </span>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  achievement.isEarned
                    ? `bg-gradient-to-r ${colors.bg}`
                    : 'bg-gradient-to-r from-lime-400 to-lime-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{rarityPercent}%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">of players have this</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              {achievement.isEarned && achievement.earnedAt ? (
                <>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {new Date(achievement.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Date earned</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {achievement.target - achievement.progress}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">more to go</p>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {achievement.isEarned && onShare && (
            <button
              onClick={onShare}
              className="w-full py-3 px-4 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
            >
              Share Achievement
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function StatsHeader({
  achievements,
}: {
  achievements: Achievement[]
}) {
  const earned = achievements.filter((a) => a.isEarned).length
  const total = achievements.length
  const percentComplete = Math.round((earned / total) * 100)

  // Count by level
  const earnedByLevel = {
    bronze: achievements.filter((a) => a.isEarned && a.level === 'bronze').length,
    silver: achievements.filter((a) => a.isEarned && a.level === 'silver').length,
    gold: achievements.filter((a) => a.isEarned && a.level === 'gold').length,
    platinum: achievements.filter((a) => a.isEarned && a.level === 'platinum').length,
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Main stat */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{earned}</span>
            <span className="text-xl text-slate-400">/ {total}</span>
          </div>
          <p className="text-slate-400 mt-1">achievements earned</p>

          {/* Progress bar */}
          <div className="mt-3 w-48">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">{percentComplete}% complete</p>
          </div>
        </div>

        {/* Level breakdown */}
        <div className="flex items-center gap-4">
          {[
            { level: 'bronze', color: 'from-amber-600 to-amber-700', count: earnedByLevel.bronze },
            { level: 'silver', color: 'from-slate-400 to-slate-500', count: earnedByLevel.silver },
            { level: 'gold', color: 'from-yellow-400 to-amber-500', count: earnedByLevel.gold },
            { level: 'platinum', color: 'from-cyan-400 to-sky-500', count: earnedByLevel.platinum },
          ].map(({ level, color, count }) => (
            <div key={level} className="text-center">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-1`}
              >
                <span className="text-sm font-bold text-white">{count}</span>
              </div>
              <p className="text-xs text-slate-500 capitalize">{level}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function AchievementsGrid({
  achievements,
  filterCategory = 'all',
  onBack,
  onViewAchievement,
  onFilterChange,
  onShare,
}: AchievementsGridProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  // Category counts
  const categories: { key: Achievement['category'] | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'activity', label: 'Activity' },
    { key: 'wins', label: 'Wins' },
    { key: 'streaks', label: 'Streaks' },
    { key: 'events', label: 'Events' },
    { key: 'social', label: 'Social' },
    { key: 'variety', label: 'Variety' },
  ]

  const getCategoryCount = (cat: Achievement['category'] | 'all') => {
    if (cat === 'all') return achievements.length
    return achievements.filter((a) => a.category === cat).length
  }

  // Filter achievements
  const filteredAchievements =
    filterCategory === 'all'
      ? achievements
      : achievements.filter((a) => a.category === filterCategory)

  // Sort: earned first, then by progress percentage
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (a.isEarned && !b.isEarned) return -1
    if (!a.isEarned && b.isEarned) return 1
    // Both earned or both unearned - sort by progress
    const aProgress = a.progress / a.target
    const bProgress = b.progress / b.target
    return bProgress - aProgress
  })

  const handleCardClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    onViewAchievement?.(achievement.id)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Achievements</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Track your progress and milestones</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-lime-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Header */}
        <StatsHeader achievements={achievements} />

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map(({ key, label }) => (
            <CategoryPill
              key={key}
              category={key}
              label={label}
              count={getCategoryCount(key)}
              isActive={filterCategory === key}
              onClick={() => onFilterChange?.(key)}
            />
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {sortedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onClick={() => handleCardClick(achievement)}
            />
          ))}
        </div>

        {/* Empty state */}
        {sortedAchievements.length === 0 && (
          <div className="py-12 text-center">
            <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No achievements in this category</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAchievement && (
        <AchievementDetailModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          onShare={() => onShare?.(selectedAchievement.id)}
        />
      )}
    </div>
  )
}
