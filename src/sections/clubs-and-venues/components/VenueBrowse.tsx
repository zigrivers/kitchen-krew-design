import { useState, useMemo } from 'react'
import type { Venue } from '@/../product/sections/clubs-and-venues/types'

export interface VenueBrowseProps {
  venues: Venue[]
  userLocation?: { lat: number; lng: number }
  onViewVenue?: (venueId: string) => void
  onGetDirections?: (venueId: string) => void
}

type ViewMode = 'list' | 'map'
type SortOption = 'distance' | 'rating' | 'courts'

export function VenueBrowse({
  venues,
  userLocation,
  onViewVenue,
  onGetDirections,
}: VenueBrowseProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    indoor: false,
    outdoor: false,
    lighting: false,
    minCourts: 0,
  })

  // Calculate distance from user location (simplified haversine)
  const calculateDistance = (venue: Venue): number => {
    if (!userLocation) return 0
    const R = 3959 // Earth's radius in miles
    const dLat = ((venue.coordinates.lat - userLocation.lat) * Math.PI) / 180
    const dLng = ((venue.coordinates.lng - userLocation.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((venue.coordinates.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Filter and sort venues
  const filteredVenues = useMemo(() => {
    let result = [...venues]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.address.city.toLowerCase().includes(query)
      )
    }

    // Apply filters
    if (filters.indoor || filters.outdoor) {
      // This would need court data to filter properly
      // For now, we'll skip this filter
    }
    if (filters.minCourts > 0) {
      result = result.filter((v) => v.courtCount >= filters.minCourts)
    }

    // Exclude temporarily closed venues from top results
    result.sort((a, b) => {
      if (a.isTemporarilyClosed && !b.isTemporarilyClosed) return 1
      if (!a.isTemporarilyClosed && b.isTemporarilyClosed) return -1

      switch (sortBy) {
        case 'distance':
          return calculateDistance(a) - calculateDistance(b)
        case 'rating':
          return b.averageRating - a.averageRating
        case 'courts':
          return b.courtCount - a.courtCount
        default:
          return 0
      }
    })

    return result
  }, [venues, searchQuery, sortBy, filters, userLocation])

  const formatDistance = (venue: Venue): string => {
    const dist = calculateDistance(venue)
    if (dist < 0.1) return 'Nearby'
    if (dist < 1) return `${(dist * 5280).toFixed(0)} ft`
    return `${dist.toFixed(1)} mi`
  }

  const getAmenityIcons = (venue: Venue) => {
    const icons = []
    if (venue.amenities.includes('lighting')) {
      icons.push({ icon: '💡', label: 'Lighting' })
    }
    if (venue.amenities.includes('restrooms')) {
      icons.push({ icon: '🚻', label: 'Restrooms' })
    }
    if (venue.amenities.includes('parking')) {
      icons.push({ icon: '🅿️', label: 'Parking' })
    }
    return icons.slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-colors ${
                showFilters || filters.indoor || filters.outdoor || filters.lighting || filters.minCourts > 0
                  ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters({ ...filters, indoor: !filters.indoor })}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    filters.indoor
                      ? 'bg-sky-100 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Indoor
                </button>
                <button
                  onClick={() => setFilters({ ...filters, outdoor: !filters.outdoor })}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    filters.outdoor
                      ? 'bg-sky-100 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Outdoor
                </button>
                <button
                  onClick={() => setFilters({ ...filters, lighting: !filters.lighting })}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    filters.lighting
                      ? 'bg-sky-100 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Lighting
                </button>
                <select
                  value={filters.minCourts}
                  onChange={(e) => setFilters({ ...filters, minCourts: parseInt(e.target.value) })}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <option value={0}>Any courts</option>
                  <option value={4}>4+ courts</option>
                  <option value={6}>6+ courts</option>
                  <option value={8}>8+ courts</option>
                </select>
              </div>
              {(filters.indoor || filters.outdoor || filters.lighting || filters.minCourts > 0) && (
                <button
                  onClick={() => setFilters({ indoor: false, outdoor: false, lighting: false, minCourts: 0 })}
                  className="mt-2 text-xs text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* View Toggle & Sort */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Map
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            >
              <option value="rating">Top Rated</option>
              <option value="distance">Nearest</option>
              <option value="courts">Most Courts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {viewMode === 'list' ? (
          /* List View */
          <div className="max-w-4xl mx-auto px-4 py-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
            </p>
            <div className="space-y-3">
              {filteredVenues.map((venue) => (
                <button
                  key={venue.id}
                  onClick={() => onViewVenue?.(venue.id)}
                  className={`w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-left hover:border-sky-300 dark:hover:border-sky-700 transition-colors ${
                    venue.isTemporarilyClosed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex">
                    {/* Venue Image */}
                    <div className="w-28 sm:w-36 h-28 sm:h-32 flex-shrink-0 relative">
                      {venue.photoUrls.length > 0 ? (
                        <img
                          src={venue.photoUrls[0]}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sky-400 to-lime-400 flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-white/50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      )}
                      {venue.isTemporarilyClosed && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                            Closed
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Venue Info */}
                    <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                            {venue.name}
                          </h3>
                          <div className="flex items-center gap-1 shrink-0">
                            <svg
                              className="w-4 h-4 text-lime-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {venue.averageRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          {venue.address.city}, {venue.address.state}
                          {userLocation && (
                            <span className="ml-2 text-sky-600 dark:text-sky-400">
                              • {formatDistance(venue)}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {venue.courtCount} courts
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span>{venue.reviewCount} reviews</span>
                        </div>
                        <div className="flex gap-1">
                          {getAmenityIcons(venue).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-sm"
                              title={amenity.label}
                            >
                              {amenity.icon}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {filteredVenues.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    No venues found
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Map View */
          <div className="h-full relative">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
              <div className="w-full h-full relative overflow-hidden">
                {/* Simulated map background */}
                <div className="absolute inset-0 opacity-30 dark:opacity-20">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Map pins */}
                {filteredVenues.map((venue, idx) => {
                  // Position pins roughly based on coordinates (simplified)
                  const left = 20 + (idx % 3) * 30 + Math.random() * 10
                  const top = 20 + Math.floor(idx / 3) * 25 + Math.random() * 10
                  return (
                    <button
                      key={venue.id}
                      onClick={() => setSelectedVenue(selectedVenue === venue.id ? null : venue.id)}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      className={`absolute transform -translate-x-1/2 -translate-y-full transition-all z-10 ${
                        selectedVenue === venue.id ? 'z-20 scale-110' : ''
                      }`}
                    >
                      <div
                        className={`relative ${
                          venue.isTemporarilyClosed
                            ? 'text-slate-400'
                            : selectedVenue === venue.id
                              ? 'text-lime-500'
                              : 'text-sky-500'
                        }`}
                      >
                        <svg className="w-10 h-10 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        </svg>
                        <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-white text-xs font-bold">
                          {venue.courtCount}
                        </span>
                      </div>
                    </button>
                  )
                })}

                {/* Selected venue card */}
                {selectedVenue && (
                  <div className="absolute bottom-4 left-4 right-4 z-30">
                    {(() => {
                      const venue = filteredVenues.find((v) => v.id === selectedVenue)
                      if (!venue) return null
                      return (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <div className="flex">
                            <div className="w-24 h-24 flex-shrink-0">
                              {venue.photoUrls.length > 0 ? (
                                <img
                                  src={venue.photoUrls[0]}
                                  alt={venue.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-sky-400 to-lime-400" />
                              )}
                            </div>
                            <div className="flex-1 p-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-slate-900 dark:text-white">
                                    {venue.name}
                                  </h3>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {venue.courtCount} courts • {venue.address.city}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4 text-lime-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                  <span className="text-sm font-medium">{venue.averageRating.toFixed(1)}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => onViewVenue?.(venue.id)}
                                  className="flex-1 py-1.5 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => onGetDirections?.(venue.id)}
                                  className="p-1.5 text-slate-500 hover:text-sky-500 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedVenue(null)}
                              className="absolute top-2 right-2 p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Location button */}
                <button className="absolute bottom-4 right-4 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
