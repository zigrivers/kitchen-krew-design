import { useState } from 'react'
import { Plus, Calendar, CalendarCheck, Clock } from 'lucide-react'
import { EventCard } from './EventCard'
import { EventFilters } from './EventFilters'
import type { EventsProps, EventFilters as FilterType } from '@/../product/sections/events/types'

type Tab = 'discover' | 'my-events'

export function EventDiscovery({
  events,
  formatCategories,
  currentUser,
  onViewEvent,
  onFilterChange,
  onRegister,
  onUnregister,
  onJoinWaitlist,
  onCreate,
}: EventsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('discover')
  const [filters, setFilters] = useState<FilterType>({})

  // Get user's registered and waitlisted event IDs
  const userEventIds = new Set<string>()
  const userWaitlistIds = new Set<string>()
  events.forEach((event) => {
    event.registrations.forEach((reg) => {
      if (reg.player.id === currentUser.id) {
        userEventIds.add(event.id)
      }
    })
    event.waitlist.forEach((reg) => {
      if (reg.player.id === currentUser.id) {
        userWaitlistIds.add(event.id)
      }
    })
  })

  // Filter events based on active tab
  const myEvents = events.filter(
    (event) => userEventIds.has(event.id) || userWaitlistIds.has(event.id)
  )
  const discoverEvents = events.filter(
    (event) => !userEventIds.has(event.id) && !userWaitlistIds.has(event.id)
  )

  // Apply search/filter to discover events
  const filteredDiscoverEvents = discoverEvents.filter((event) => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase()
      if (
        !event.name.toLowerCase().includes(search) &&
        !event.venue.name.toLowerCase().includes(search) &&
        !event.format.subtypeName.toLowerCase().includes(search) &&
        !event.format.categoryName.toLowerCase().includes(search)
      ) {
        return false
      }
    }

    // Format category filter (multi-select)
    if (filters.formatCategoryIds && filters.formatCategoryIds.length > 0) {
      if (!filters.formatCategoryIds.includes(event.format.categoryId)) {
        return false
      }
    }

    // Skill level filters
    const skillRange = event.formatConfig.skillRange
    if (filters.skillLevelMin && skillRange.max < filters.skillLevelMin) {
      return false
    }
    if (filters.skillLevelMax && skillRange.min > filters.skillLevelMax) {
      return false
    }

    // Fee filter
    if (filters.feeType === 'free' && event.fee !== null) {
      return false
    }
    if (filters.feeType === 'paid' && event.fee === null) {
      return false
    }

    // Availability filter
    if (filters.availability && filters.availability.length > 0) {
      const hasOpenSpots = event.spotsAvailable > 0
      const hasWaitlist = event.waitlistEnabled && event.spotsAvailable === 0

      if (filters.availability.includes('open') && !hasOpenSpots) {
        // If "open" is selected but no open spots, check if other filters pass
        if (!filters.availability.includes('waitlist') || !hasWaitlist) {
          return false
        }
      }
      if (filters.availability.includes('waitlist') && !hasWaitlist) {
        // If "waitlist" is selected but no waitlist, check if other filters pass
        if (!filters.availability.includes('open') || !hasOpenSpots) {
          return false
        }
      }
    }

    return true
  })

  const displayedEvents = activeTab === 'discover' ? filteredDiscoverEvents : myEvents

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Events</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Find and join pickleball games near you
              </p>
            </div>
            {currentUser.isGameManager && (
              <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-600 text-white font-medium text-sm transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Create Event</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'discover'
                  ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Discover
            </button>
            <button
              onClick={() => setActiveTab('my-events')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'my-events'
                  ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              My Events
              {myEvents.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400 text-xs font-medium">
                  {myEvents.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters (Discover tab only) */}
          {activeTab === 'discover' && (
            <div className="lg:col-span-1">
              <EventFilters
                filters={filters}
                formatCategories={formatCategories}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}

          {/* Event Grid */}
          <div className={activeTab === 'discover' ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {displayedEvents.length === 0 ? (
              <EmptyState tab={activeTab} hasFilters={Object.keys(filters).length > 0} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={userEventIds.has(event.id)}
                    isOnWaitlist={userWaitlistIds.has(event.id)}
                    onView={() => onViewEvent?.(event.id)}
                    onRegister={() => onRegister?.(event.id)}
                    onUnregister={() => onUnregister?.(event.id)}
                    onJoinWaitlist={() => onJoinWaitlist?.(event.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ tab, hasFilters }: { tab: Tab; hasFilters?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        {tab === 'discover' ? (
          <Calendar className="w-8 h-8 text-slate-400" />
        ) : (
          <Clock className="w-8 h-8 text-slate-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {tab === 'discover' ? 'No events found' : 'No upcoming events'}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {tab === 'discover'
          ? hasFilters
            ? 'Try adjusting your filters or check back later for new events.'
            : 'There are no events available right now. Check back later!'
          : "You haven't registered for any events yet. Browse available events to find your next game!"}
      </p>
    </div>
  )
}
