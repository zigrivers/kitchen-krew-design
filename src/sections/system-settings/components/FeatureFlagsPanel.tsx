import { useState } from 'react'
import type { FeatureFlagsPanelProps, FeatureFlag } from '@/../product/sections/system-settings/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface CategoryTabsProps {
  categories: { id: string; label: string; count: number }[]
  activeCategory: string
  onChange: (category: string) => void
}

function CategoryTabs({ categories, activeCategory, onChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeCategory === category.id
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>{category.label}</span>
          <span className={`px-1.5 py-0.5 text-xs rounded-full ${
            activeCategory === category.id
              ? 'bg-lime-500/20 text-lime-700 dark:text-lime-400'
              : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
          }`}>
            {category.count}
          </span>
        </button>
      ))}
    </div>
  )
}

interface ToggleSwitchProps {
  enabled: boolean
  onChange?: (enabled: boolean) => void
  disabled?: boolean
}

function ToggleSwitch({ enabled, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => onChange?.(!enabled)}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${
        enabled
          ? 'bg-lime-500 shadow-lg shadow-lime-500/25'
          : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
          enabled ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  )
}

interface RolloutSliderProps {
  percentage: number
  onChange?: (percentage: number) => void
  disabled?: boolean
}

function RolloutSlider({ percentage, onChange, disabled }: RolloutSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(parseInt(e.target.value, 10))
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-lime-500
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-lime-500/25
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            ${disabled ? 'opacity-50 cursor-not-allowed [&::-webkit-slider-thumb]:cursor-not-allowed' : ''}
          `}
          style={{
            background: `linear-gradient(to right, rgb(132 204 22) 0%, rgb(132 204 22) ${percentage}%, rgb(226 232 240) ${percentage}%, rgb(226 232 240) 100%)`,
          }}
        />
      </div>
      <span className={`w-12 text-right text-sm font-mono font-semibold ${
        percentage === 100 ? 'text-lime-600 dark:text-lime-400' :
        percentage === 0 ? 'text-slate-400' :
        'text-slate-700 dark:text-slate-300'
      }`}>
        {percentage}%
      </span>
    </div>
  )
}

interface TargetGroupChipProps {
  group: string
  onRemove?: () => void
}

function TargetGroupChip({ group, onRemove }: TargetGroupChipProps) {
  const formatGroup = (g: string) => g.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-sky-500/10 text-sky-700 dark:text-sky-400 rounded-md border border-sky-500/20">
      {formatGroup(group)}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 text-sky-500 hover:text-sky-700 dark:hover:text-sky-300">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

interface DependencyWarningProps {
  dependencies: string[]
  flags: FeatureFlag[]
}

function DependencyWarning({ dependencies, flags }: DependencyWarningProps) {
  const disabledDeps = dependencies.filter(dep => {
    const flag = flags.find(f => f.key === dep)
    return flag && !flag.enabled
  })

  if (disabledDeps.length === 0) return null

  return (
    <div className="flex items-start gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg mt-3">
      <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Dependency Warning</p>
        <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
          Requires: {disabledDeps.map(d => d.replace(/_/g, ' ')).join(', ')}
        </p>
      </div>
    </div>
  )
}

interface FeatureFlagCardProps {
  flag: FeatureFlag
  allFlags: FeatureFlag[]
  isExpanded: boolean
  onToggle: () => void
  onToggleEnabled?: (enabled: boolean) => void
  onUpdateRollout?: (percentage: number) => void
  onUpdateTargetGroups?: (groups: string[]) => void
  onViewDetails?: () => void
}

function FeatureFlagCard({
  flag,
  allFlags,
  isExpanded,
  onToggle,
  onToggleEnabled,
  onUpdateRollout,
  onUpdateTargetGroups,
  onViewDetails,
}: FeatureFlagCardProps) {
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const categoryStyles = {
    core: 'bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-500/20',
    beta: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    deprecated: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  }

  const availableGroups = ['beta_testers', 'premium_users', 'club_admins', 'event_organizers', 'new_users']

  return (
    <div className={`bg-white dark:bg-slate-900 border rounded-xl transition-all ${
      isExpanded
        ? 'border-lime-500/50 shadow-lg shadow-lime-500/5'
        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
    }`}>
      {/* Header Row */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={onToggle}
      >
        {/* Expand Arrow */}
        <button className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Toggle Switch */}
        <div onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch
            enabled={flag.enabled}
            onChange={onToggleEnabled}
          />
        </div>

        {/* Flag Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{flag.name}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${categoryStyles[flag.category]}`}>
              {flag.category}
            </span>
            {flag.targetGroups.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {flag.targetGroups.length} groups
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{flag.description}</p>
        </div>

        {/* Rollout Badge */}
        <div className="hidden sm:flex flex-col items-end">
          <div className={`flex items-center gap-1.5 ${
            !flag.enabled ? 'opacity-40' : ''
          }`}>
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-lime-500 rounded-full transition-all"
                style={{ width: `${flag.rolloutPercentage}%` }}
              />
            </div>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-8">
              {flag.rolloutPercentage}%
            </span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {formatTimestamp(flag.lastModified)}
          </span>
        </div>

        {/* View Details Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails?.()
          }}
          className="flex-shrink-0 p-2 text-slate-400 hover:text-lime-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-4 ml-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rollout Configuration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Rollout Percentage
              </label>
              <RolloutSlider
                percentage={flag.rolloutPercentage}
                onChange={onUpdateRollout}
                disabled={!flag.enabled}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {flag.rolloutPercentage === 100 ? 'Available to all users' :
                 flag.rolloutPercentage === 0 ? 'Not available to any users' :
                 `Available to ${flag.rolloutPercentage}% of eligible users`}
              </p>
            </div>

            {/* Target Groups */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Target User Groups
              </label>
              <div className="flex flex-wrap gap-2">
                {flag.targetGroups.length > 0 ? (
                  flag.targetGroups.map((group) => (
                    <TargetGroupChip
                      key={group}
                      group={group}
                      onRemove={() => onUpdateTargetGroups?.(flag.targetGroups.filter(g => g !== group))}
                    />
                  ))
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500 italic">All users (no targeting)</span>
                )}
              </div>
              {/* Add Group Dropdown */}
              <div className="mt-2">
                <select
                  className="text-xs px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !flag.targetGroups.includes(e.target.value)) {
                      onUpdateTargetGroups?.([...flag.targetGroups, e.target.value])
                    }
                  }}
                >
                  <option value="">+ Add group</option>
                  {availableGroups.filter(g => !flag.targetGroups.includes(g)).map((group) => (
                    <option key={group} value={group}>
                      {group.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dependencies */}
          {flag.dependencies.length > 0 && (
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Dependencies
              </label>
              <div className="flex flex-wrap gap-2">
                {flag.dependencies.map((dep) => {
                  const depFlag = allFlags.find(f => f.key === dep)
                  return (
                    <span
                      key={dep}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md border ${
                        depFlag?.enabled
                          ? 'bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-500/20'
                          : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${depFlag?.enabled ? 'bg-lime-500' : 'bg-red-500'}`} />
                      {dep.replace(/_/g, ' ')}
                    </span>
                  )
                })}
              </div>
              <DependencyWarning dependencies={flag.dependencies} flags={allFlags} />
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Key: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{flag.key}</code></span>
            <span>Modified by <strong>{flag.modifiedBy}</strong></span>
            <span>{formatTimestamp(flag.lastModified)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function FeatureFlagsPanel({
  featureFlags,
  onToggle,
  onUpdateRollout,
  onUpdateTargetGroups,
  onViewDetails,
}: FeatureFlagsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedFlagId, setExpandedFlagId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate category counts
  const categoryCounts = {
    all: featureFlags.length,
    core: featureFlags.filter(f => f.category === 'core').length,
    beta: featureFlags.filter(f => f.category === 'beta').length,
    deprecated: featureFlags.filter(f => f.category === 'deprecated').length,
  }

  const categories = [
    { id: 'all', label: 'All', count: categoryCounts.all },
    { id: 'core', label: 'Core', count: categoryCounts.core },
    { id: 'beta', label: 'Beta', count: categoryCounts.beta },
    { id: 'deprecated', label: 'Deprecated', count: categoryCounts.deprecated },
  ]

  // Filter flags
  const filteredFlags = featureFlags.filter(flag => {
    const matchesCategory = activeCategory === 'all' || flag.category === activeCategory
    const matchesSearch = searchQuery === '' ||
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Stats
  const enabledCount = featureFlags.filter(f => f.enabled).length
  const betaActiveCount = featureFlags.filter(f => f.category === 'beta' && f.enabled).length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Feature Flags</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Control feature availability and rollout across the platform
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">{enabledCount}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Enabled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{betaActiveCount}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Beta Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{featureFlags.length}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search flags by name, key, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>
      </div>

      {/* Flag List */}
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
        <div className="space-y-3">
          {filteredFlags.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No flags found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {searchQuery ? 'Try adjusting your search query.' : 'No feature flags in this category.'}
              </p>
            </div>
          ) : (
            filteredFlags.map((flag) => (
              <FeatureFlagCard
                key={flag.id}
                flag={flag}
                allFlags={featureFlags}
                isExpanded={expandedFlagId === flag.id}
                onToggle={() => setExpandedFlagId(expandedFlagId === flag.id ? null : flag.id)}
                onToggleEnabled={(enabled) => onToggle?.(flag.id, enabled)}
                onUpdateRollout={(percentage) => onUpdateRollout?.(flag.id, percentage)}
                onUpdateTargetGroups={(groups) => onUpdateTargetGroups?.(flag.id, groups)}
                onViewDetails={() => onViewDetails?.(flag.id)}
              />
            ))
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Category Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-medium bg-lime-500/10 text-lime-700 dark:text-lime-400 rounded-full border border-lime-500/20">core</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Essential platform features, always stable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-full border border-amber-500/20">beta</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Experimental features being tested</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-700 dark:text-red-400 rounded-full border border-red-500/20">deprecated</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Features being phased out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
