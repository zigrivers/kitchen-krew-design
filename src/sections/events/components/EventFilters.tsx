import { useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import type { EventFilters as FilterType, GameFormat } from '@/../product/sections/events/types'

interface EventFiltersProps {
  filters: FilterType
  gameFormats: GameFormat[]
  onFilterChange?: (filters: FilterType) => void
}

export function EventFilters({ filters, gameFormats, onFilterChange }: EventFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterType>(filters)

  const updateFilter = (key: keyof FilterType, value: FilterType[keyof FilterType]) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: FilterType = {}
    setLocalFilters(emptyFilters)
    onFilterChange?.(emptyFilters)
  }

  const activeFilterCount = Object.values(localFilters).filter(
    (v) => v !== undefined && v !== '' && v !== false
  ).length

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
            onChange={(e) => updateFilter('search', e.target.value)}
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
        <div className="px-4 pb-4 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
          {/* Format Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Game Format
            </label>
            <select
              value={localFilters.format || ''}
              onChange={(e) => updateFilter('format', e.target.value || undefined)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            >
              <option value="">All Formats</option>
              {gameFormats.map((format) => (
                <option key={format.id} value={format.name}>
                  {format.name}
                </option>
              ))}
            </select>
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

          {/* Toggle Filters */}
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.freeOnly || false}
                onChange={(e) => updateFilter('freeOnly', e.target.checked || undefined)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Free events only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.hasSpots || false}
                onChange={(e) => updateFilter('hasSpots', e.target.checked || undefined)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-lime-500 focus:ring-lime-500 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Has spots available</span>
            </label>
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
