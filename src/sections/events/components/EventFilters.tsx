import { useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown, Trophy, RefreshCw, TrendingUp, Smile, UsersRound, Star } from 'lucide-react'
import type { EventFilters as FilterType, FormatCategory, FormatCategoryId, FormatCategoryIcon } from '@/../product/sections/events/types'

interface EventFiltersProps {
  filters: FilterType
  formatCategories: FormatCategory[]
  onFilterChange?: (filters: FilterType) => void
}

/** Maps format category icon names to Lucide icon components */
function FormatIcon({ icon, className }: { icon: FormatCategoryIcon; className?: string }) {
  const iconMap = {
    'trophy': Trophy,
    'refresh-cw': RefreshCw,
    'trending-up': TrendingUp,
    'smile': Smile,
    'users': UsersRound,
    'star': Star,
  }
  const IconComponent = iconMap[icon] || Trophy
  return <IconComponent className={className} />
}

/** Color schemes for each format category */
const categoryColors: Record<string, {
  bg: string
  bgActive: string
  text: string
  textActive: string
  border: string
  borderActive: string
}> = {
  'tournament': {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-amber-700 dark:text-amber-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-amber-300 dark:border-amber-700',
  },
  'round-robin': {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-sky-100 dark:bg-sky-900/40',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-sky-700 dark:text-sky-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-sky-300 dark:border-sky-700',
  },
  'ladder-league': {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-violet-100 dark:bg-violet-900/40',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-violet-700 dark:text-violet-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-violet-300 dark:border-violet-700',
  },
  'recreational': {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-lime-100 dark:bg-lime-900/40',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-lime-700 dark:text-lime-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-lime-300 dark:border-lime-700',
  },
  'team': {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-rose-100 dark:bg-rose-900/40',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-rose-700 dark:text-rose-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-rose-300 dark:border-rose-700',
  },
  'specialty': {
    bg: 'bg-white dark:bg-slate-800',
    bgActive: 'bg-orange-100 dark:bg-orange-900/40',
    text: 'text-slate-600 dark:text-slate-400',
    textActive: 'text-orange-700 dark:text-orange-400',
    border: 'border-slate-200 dark:border-slate-700',
    borderActive: 'border-orange-300 dark:border-orange-700',
  },
}

export function EventFilters({ filters, formatCategories, onFilterChange }: EventFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [localFilters, setLocalFilters] = useState<FilterType>(filters)

  const updateFilter = <K extends keyof FilterType>(key: K, value: FilterType[K]) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const toggleCategoryFilter = (categoryId: FormatCategoryId) => {
    const currentCategories = localFilters.formatCategoryIds || []
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId]

    updateFilter('formatCategoryIds', newCategories.length > 0 ? newCategories : undefined)
  }

  const clearFilters = () => {
    const emptyFilters: FilterType = {}
    setLocalFilters(emptyFilters)
    onFilterChange?.(emptyFilters)
  }

  const activeFilterCount = [
    localFilters.search,
    localFilters.formatCategoryIds?.length,
    localFilters.skillLevelMin,
    localFilters.skillLevelMax,
    localFilters.feeType && localFilters.feeType !== 'any',
    localFilters.availability?.length,
  ].filter(Boolean).length

  const selectedCategories = localFilters.formatCategoryIds || []

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={localFilters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="px-4 pb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-lime-500 text-white text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-5 border-t border-slate-100 dark:border-slate-800 pt-4">
          {/* Format Category Chips */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Event Type
            </label>
            <div className="flex flex-wrap gap-2">
              {formatCategories.map((category) => {
                const isSelected = selectedCategories.includes(category.id)
                const colors = categoryColors[category.id] || categoryColors['recreational']

                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategoryFilter(category.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? `${colors.bgActive} ${colors.textActive} ${colors.borderActive}`
                        : `${colors.bg} ${colors.text} ${colors.border} hover:border-slate-300 dark:hover:border-slate-600`
                    }`}
                  >
                    <FormatIcon icon={category.icon} className="w-3.5 h-3.5" />
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Skill Level Range */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Skill Level
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                min="1.0"
                max="5.0"
                step="0.5"
                value={localFilters.skillLevelMin || ''}
                onChange={(e) =>
                  updateFilter('skillLevelMin', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent font-mono text-sm"
              />
              <span className="text-slate-400">–</span>
              <input
                type="number"
                placeholder="Max"
                min="1.0"
                max="5.0"
                step="0.5"
                value={localFilters.skillLevelMax || ''}
                onChange={(e) =>
                  updateFilter('skillLevelMax', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>

          {/* Fee Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Price
            </label>
            <div className="flex gap-2">
              {[
                { value: 'any', label: 'Any' },
                { value: 'free', label: 'Free' },
                { value: 'paid', label: 'Paid' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilter('feeType', option.value as FilterType['feeType'])}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    (localFilters.feeType || 'any') === option.value
                      ? 'bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-400 border-lime-300 dark:border-lime-700'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggles */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Availability
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'open', label: 'Open spots' },
                { value: 'waitlist', label: 'Waitlist available' },
              ].map((option) => {
                const isSelected = localFilters.availability?.includes(option.value as 'open' | 'waitlist')
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      const current = localFilters.availability || []
                      const newValue = isSelected
                        ? current.filter(v => v !== option.value)
                        : [...current, option.value as 'open' | 'waitlist']
                      updateFilter('availability', newValue.length > 0 ? newValue : undefined)
                    }}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                      isSelected
                        ? 'bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-400 border-lime-300 dark:border-lime-700'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
