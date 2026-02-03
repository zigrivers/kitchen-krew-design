import { useState } from 'react'
import type { RateLimitsPanelProps, RateLimit } from '@/../product/sections/system-settings/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface CategoryFilterProps {
  categories: { id: string; label: string; count: number }[]
  activeCategory: string
  onChange: (category: string) => void
}

function CategoryFilter({ categories, activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
            activeCategory === category.id
              ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {category.label}
          <span className={`px-1.5 py-0.5 text-xs rounded-full ${
            activeCategory === category.id
              ? 'bg-white/20'
              : 'bg-slate-200 dark:bg-slate-700'
          }`}>
            {category.count}
          </span>
        </button>
      ))}
    </div>
  )
}

interface UsageBarProps {
  current: number
  limit: number
  peak: number
  alertThreshold: number
}

function UsageBar({ current, limit, peak, alertThreshold }: UsageBarProps) {
  const currentPercent = Math.min((current / limit) * 100, 100)
  const peakPercent = Math.min((peak / limit) * 100, 100)
  const thresholdPercent = (alertThreshold / limit) * 100

  const getBarColor = () => {
    if (currentPercent >= 100) return 'bg-red-500'
    if (currentPercent >= thresholdPercent) return 'bg-amber-500'
    return 'bg-lime-500'
  }

  return (
    <div className="relative">
      {/* Background bar */}
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        {/* Peak usage indicator */}
        <div
          className="absolute h-3 bg-slate-200 dark:bg-slate-700 rounded-full"
          style={{ width: `${peakPercent}%` }}
        />
        {/* Current usage */}
        <div
          className={`relative h-3 rounded-full transition-all ${getBarColor()}`}
          style={{ width: `${currentPercent}%` }}
        />
      </div>
      {/* Alert threshold marker */}
      <div
        className="absolute top-0 h-3 w-0.5 bg-amber-500/50"
        style={{ left: `${thresholdPercent}%` }}
      />
      {/* Labels */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {current.toLocaleString()} / {limit.toLocaleString()}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Peak: {peak.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

interface BreachBadgeProps {
  count: number
}

function BreachBadge({ count }: BreachBadgeProps) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-lime-500/10 text-lime-600 dark:text-lime-400 rounded-full">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M5 13l4 4L19 7" />
        </svg>
        No breaches
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 rounded-full animate-pulse">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {count} breach{count !== 1 ? 'es' : ''} (24h)
    </span>
  )
}

interface PeriodBadgeProps {
  period: RateLimit['period']
}

function PeriodBadge({ period }: PeriodBadgeProps) {
  const labels: Record<string, string> = {
    minute: '/min',
    hour: '/hour',
    day: '/day',
    lifetime: 'lifetime',
  }

  return (
    <span className="px-2 py-0.5 text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
      {labels[period]}
    </span>
  )
}

interface CategoryIconProps {
  category: RateLimit['category']
}

function CategoryIcon({ category }: CategoryIconProps) {
  const icons: Record<string, React.ReactNode> = {
    api: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    user_action: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
    communication: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    registration: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    abuse_prevention: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  }

  const colors: Record<string, string> = {
    api: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    user_action: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    communication: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    registration: 'bg-lime-500/10 text-lime-600 dark:text-lime-400',
    abuse_prevention: 'bg-red-500/10 text-red-600 dark:text-red-400',
  }

  return (
    <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${colors[category]}`}>
      {icons[category]}
    </div>
  )
}

interface RateLimitCardProps {
  limit: RateLimit
  isExpanded: boolean
  onToggle: () => void
  onUpdate?: (limit: number, alertThreshold: number) => void
  onTest?: () => void
  onViewDetails?: () => void
}

function RateLimitCard({
  limit,
  isExpanded,
  onToggle,
  onUpdate,
  onTest,
  onViewDetails,
}: RateLimitCardProps) {
  const [editLimit, setEditLimit] = useState(limit.limit)
  const [editThreshold, setEditThreshold] = useState(limit.alertThreshold)
  const [isEditing, setIsEditing] = useState(false)

  const usagePercent = (limit.currentUsage / limit.limit) * 100
  const isAtRisk = usagePercent >= (limit.alertThreshold / limit.limit) * 100
  const isBreached = limit.breachCount24h > 0

  const handleSave = () => {
    onUpdate?.(editLimit, editThreshold)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditLimit(limit.limit)
    setEditThreshold(limit.alertThreshold)
    setIsEditing(false)
  }

  return (
    <div className={`bg-white dark:bg-slate-900 border rounded-xl transition-all ${
      isBreached
        ? 'border-red-500/30 shadow-lg shadow-red-500/5'
        : isAtRisk
        ? 'border-amber-500/30'
        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
    }`}>
      {/* Header */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={onToggle}
      >
        <CategoryIcon category={limit.category} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{limit.name}</h3>
            <PeriodBadge period={limit.period} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{limit.description}</p>
        </div>

        <div className="hidden sm:block flex-shrink-0 w-48">
          <UsageBar
            current={limit.currentUsage}
            limit={limit.limit}
            peak={limit.peakUsage}
            alertThreshold={limit.alertThreshold}
          />
        </div>

        <BreachBadge count={limit.breachCount24h} />

        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Mobile Usage Bar */}
      <div className="sm:hidden px-4 pb-4">
        <UsageBar
          current={limit.currentUsage}
          limit={limit.limit}
          peak={limit.peakUsage}
          alertThreshold={limit.alertThreshold}
        />
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 dark:border-slate-800">
          {/* Usage Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {limit.currentUsage.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Limit</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {limit.limit.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peak (24h)</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {limit.peakUsage.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alert At</span>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {limit.alertThreshold.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Configuration
              </h4>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 font-medium"
                >
                  Edit limits
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-2 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 text-xs font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-md"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Maximum Limit
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editLimit}
                    onChange={(e) => setEditLimit(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                    {limit.limit.toLocaleString()}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Alert Threshold
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editThreshold}
                    onChange={(e) => setEditThreshold(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                    {limit.alertThreshold.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onTest}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Test Limit
              </button>
              <button
                onClick={onViewDetails}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function RateLimitsPanel({
  rateLimits,
  onUpdate,
  onTest,
  onViewDetails,
}: RateLimitsPanelProps) {
  const [expandedLimitId, setExpandedLimitId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Calculate category counts
  const categoryCounts = rateLimits.reduce((acc, limit) => {
    acc[limit.category] = (acc[limit.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categories = [
    { id: 'all', label: 'All Limits', count: rateLimits.length },
    { id: 'api', label: 'API', count: categoryCounts.api || 0 },
    { id: 'user_action', label: 'User Actions', count: categoryCounts.user_action || 0 },
    { id: 'communication', label: 'Communication', count: categoryCounts.communication || 0 },
    { id: 'registration', label: 'Registration', count: categoryCounts.registration || 0 },
    { id: 'abuse_prevention', label: 'Abuse Prevention', count: categoryCounts.abuse_prevention || 0 },
  ].filter(c => c.count > 0 || c.id === 'all')

  // Filter limits
  const filteredLimits = rateLimits.filter(limit => {
    if (activeCategory === 'all') return true
    return limit.category === activeCategory
  })

  // Calculate stats
  const totalBreaches = rateLimits.reduce((sum, l) => sum + l.breachCount24h, 0)
  const atRiskCount = rateLimits.filter(l => {
    const usagePercent = (l.currentUsage / l.limit) * 100
    const thresholdPercent = (l.alertThreshold / l.limit) * 100
    return usagePercent >= thresholdPercent
  }).length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rate Limits</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Configure API and user action limits to prevent abuse
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{rateLimits.length}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Active Limits</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${atRiskCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-lime-600 dark:text-lime-400'}`}>
                  {atRiskCount}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">At Risk</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${totalBreaches > 0 ? 'text-red-600 dark:text-red-400' : 'text-lime-600 dark:text-lime-400'}`}>
                  {totalBreaches}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Breaches (24h)</div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </div>

      {/* Alert Banner */}
      {totalBreaches > 0 && (
        <div className="max-w-5xl mx-auto px-4 lg:px-6 mt-6">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/20 text-red-600 dark:text-red-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Rate Limit Breaches Detected</h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-0.5">
                  {totalBreaches} rate limit breach{totalBreaches !== 1 ? 'es' : ''} detected in the last 24 hours. Review affected limits below.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Limits List */}
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
        <div className="space-y-3">
          {filteredLimits.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No limits found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No rate limits in this category.
              </p>
            </div>
          ) : (
            filteredLimits.map((limit) => (
              <RateLimitCard
                key={limit.id}
                limit={limit}
                isExpanded={expandedLimitId === limit.id}
                onToggle={() => setExpandedLimitId(expandedLimitId === limit.id ? null : limit.id)}
                onUpdate={(newLimit, newThreshold) => onUpdate?.(limit.id, newLimit, newThreshold)}
                onTest={() => onTest?.(limit.id)}
                onViewDetails={() => onViewDetails?.(limit.id)}
              />
            ))
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Usage Bar Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-lime-500 rounded" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Normal usage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-amber-500 rounded" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Above alert threshold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-red-500 rounded" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Limit reached</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Peak usage (24h)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-3 bg-amber-500/50" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Alert threshold marker</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
