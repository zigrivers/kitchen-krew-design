import { useState } from 'react'
import type {
  Venue,
  Court,
  VenueReview,
  Club,
} from '@/../product/sections/clubs-and-venues/types'

export interface VenueDetailProps {
  venue: Venue
  courts: Court[]
  reviews: VenueReview[]
  linkedClub: Club | null
  isAdmin: boolean
  canClaimVenue?: boolean
  onEdit?: () => void
  onSubmitReview?: () => void
  onGetDirections?: () => void
  onViewClub?: (clubId: string) => void
  onMarkHelpful?: (reviewId: string) => void
  onRespondToReview?: (reviewId: string) => void
  onClaimVenue?: () => void
  onBulkAddCourts?: (count: number) => void
}

type Tab = 'info' | 'courts' | 'reviews'

const AMENITY_ICONS: Record<string, { icon: React.ReactNode; label: string }> = {
  restrooms: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    label: 'Restrooms',
  },
  water: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    label: 'Water Fountain',
  },
  parking: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h4m-4 4h8M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Parking',
  },
  seating: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    label: 'Spectator Seating',
  },
  lighting: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    label: 'Lighting',
  },
  proshop: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    label: 'Pro Shop',
  },
}

const SURFACE_LABELS: Record<string, string> = {
  sport_court: 'Sport Court',
  concrete: 'Concrete',
  asphalt: 'Asphalt',
  wood: 'Wood',
  other: 'Other',
}

export function VenueDetail({
  venue,
  courts,
  reviews,
  linkedClub,
  isAdmin,
  canClaimVenue = false,
  onEdit,
  onSubmitReview,
  onGetDirections,
  onViewClub,
  onMarkHelpful,
  onRespondToReview,
  onClaimVenue,
  onBulkAddCourts,
}: VenueDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [selectedPhoto, setSelectedPhoto] = useState(0)

  const formatAddress = () => {
    const { street, city, state, zip } = venue.address
    return `${street}, ${city}, ${state} ${zip}`
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const displayHour = h % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getTodayHours = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = days[new Date().getDay()] as keyof typeof venue.operatingHours
    const hours = venue.operatingHours[today]
    return `${formatTime(hours.open)} - ${formatTime(hours.close)}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const averageRating = venue.averageRating
  const activeCourts = courts.filter((c) => c.status === 'active').length
  const indoorCourts = courts.filter((c) => c.indoor).length
  const outdoorCourts = courts.filter((c) => !c.indoor).length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Photo Gallery Header */}
      <div className="relative">
        {venue.photoUrls.length > 0 ? (
          <div className="relative h-56 sm:h-72 bg-slate-200 dark:bg-slate-800">
            <img
              src={venue.photoUrls[selectedPhoto]}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            {venue.photoUrls.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {venue.photoUrls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhoto(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === selectedPhoto
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-56 sm:h-72 bg-gradient-to-br from-sky-500 via-sky-400 to-lime-400 flex items-center justify-center">
            <svg
              className="w-20 h-20 text-white/50"
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

        {/* Back Button Overlay */}
        <button className="absolute top-4 left-4 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Admin Edit Button */}
        {isAdmin && (
          <button
            onClick={() => onEdit?.()}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        )}

        {/* Temporarily Closed Badge */}
        {venue.isTemporarilyClosed && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
            Temporarily Closed
          </div>
        )}

        {/* Verified Badge */}
        {venue.isVerified && !venue.isTemporarilyClosed && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-lime-500 text-white text-sm font-medium rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verified Venue
          </div>
        )}
      </div>

      {/* Temporarily Closed Alert */}
      {venue.isTemporarilyClosed && venue.temporarilyClosedMessage && (
        <div className="mx-4 -mt-3 mb-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Temporarily Closed</p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-0.5">{venue.temporarilyClosedMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Venue Info Card */}
      <div className="relative -mt-6 mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4">
          {/* Name and Rating */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {venue.name}
                </h1>
                {venue.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <button
                onClick={() => onGetDirections?.()}
                className="flex items-center gap-1 mt-1 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {formatAddress()}
              </button>
            </div>
            </div>

            {/* Rating Badge */}
            <div className="flex flex-col items-center px-3 py-2 bg-lime-50 dark:bg-lime-900/20 rounded-xl">
              <div className="flex items-center gap-1">
                <svg
                  className="w-5 h-5 text-lime-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-lg font-bold text-lime-600 dark:text-lime-400">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {venue.reviewCount} reviews
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <svg
                className="w-4 h-4 text-sky-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="font-medium">{venue.courtCount}</span> courts
            </div>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <svg
                className="w-4 h-4 text-lime-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Open today: <span className="font-medium">{getTodayHours()}</span>
            </div>
          </div>

          {/* Linked Club */}
          {linkedClub && (
            <button
              onClick={() => onViewClub?.(linkedClub.id)}
              className="flex items-center gap-3 mt-4 p-3 w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                {getInitials(linkedClub.name)}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-slate-900 dark:text-white">
                  {linkedClub.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Home venue • {linkedClub.memberCount} members
                </p>
              </div>
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Claim Venue Button - Show for unverified venues when user can claim */}
          {canClaimVenue && !venue.isVerified && (
            <button
              onClick={onClaimVenue}
              className="flex items-center gap-3 mt-4 p-3 w-full bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sky-800 dark:text-sky-200">
                  Claim This Venue
                </p>
                <p className="text-xs text-sky-600 dark:text-sky-400">
                  Are you the owner or manager? Verify and manage this venue.
                </p>
              </div>
              <svg
                className="w-5 h-5 text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-t border-slate-200 dark:border-slate-700">
          {(['info', 'courts', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-lime-600 dark:text-lime-400 border-b-2 border-lime-500'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4 space-y-4">
        {activeTab === 'info' && (
          <>
            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                About
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {venue.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {venue.amenities.map((amenity) => {
                  const config = AMENITY_ICONS[amenity]
                  if (!config) return null
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                    >
                      <div className="text-sky-500">{config.icon}</div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {config.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Hours
              </h3>
              <div className="space-y-2">
                {Object.entries(venue.operatingHours).map(([day, hours]) => {
                  const isToday =
                    new Date()
                      .toLocaleDateString('en-US', { weekday: 'long' })
                      .toLowerCase() === day
                  return (
                    <div
                      key={day}
                      className={`flex justify-between text-sm ${
                        isToday
                          ? 'font-medium text-lime-600 dark:text-lime-400'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="capitalize">{day}</span>
                      <span>
                        {formatTime(hours.open)} - {formatTime(hours.close)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Directions Button */}
            <button
              onClick={() => onGetDirections?.()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl transition-colors"
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Get Directions
            </button>
          </>
        )}

        {activeTab === 'courts' && (
          <div className="space-y-3">
            {/* Court Summary */}
            <div className="flex gap-3">
              <div className="flex-1 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-2xl font-bold text-lime-500">
                  {activeCourts}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Active
                </p>
              </div>
              <div className="flex-1 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-2xl font-bold text-sky-500">{indoorCourts}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Indoor
                </p>
              </div>
              <div className="flex-1 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-2xl font-bold text-amber-500">
                  {outdoorCourts}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Outdoor
                </p>
              </div>
            </div>

            {/* Court List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
              {courts.map((court) => (
                <div key={court.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                          court.status === 'active'
                            ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400'
                            : court.status === 'maintenance'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {court.name.replace('Court ', '')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {court.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {court.indoor ? 'Indoor' : 'Outdoor'}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">
                            •
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {SURFACE_LABELS[court.surface]}
                          </span>
                          {court.lighting && (
                            <>
                              <span className="text-slate-300 dark:text-slate-600">
                                •
                              </span>
                              <svg
                                className="w-3.5 h-3.5 text-amber-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {court.status !== 'active' && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          court.status === 'maintenance'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {court.status === 'maintenance'
                          ? 'Maintenance'
                          : 'Inactive'}
                      </span>
                    )}
                  </div>
                  {court.notes && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 italic">
                      {court.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Write Review Button */}
            <button
              onClick={() => onSubmitReview?.()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-lime-500 hover:bg-lime-600 text-white font-medium rounded-xl transition-colors"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Write a Review
            </button>

            {/* Rating Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 dark:text-white">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(averageRating)
                            ? 'text-lime-500'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {venue.reviewCount} reviews
                  </p>
                </div>
                <div className="flex-1 pl-4 border-l border-slate-200 dark:border-slate-700">
                  {[
                    { label: 'Court Quality', key: 'courtQuality' as const },
                    { label: 'Amenities', key: 'amenities' as const },
                    { label: 'Parking', key: 'parking' as const },
                    { label: 'Accessibility', key: 'accessibility' as const },
                  ].map(({ label: category, key }, idx) => {
                      // Calculate average for this category from reviews
                      const avg =
                        reviews.length > 0
                          ? reviews.reduce((sum, r) => sum + r[key], 0) /
                            reviews.length
                          : 0
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs mb-1.5 last:mb-0"
                        >
                          <span className="w-24 text-slate-500 dark:text-slate-400">
                            {category}
                          </span>
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-lime-500 rounded-full"
                              style={{ width: `${(avg / 5) * 100}%` }}
                            />
                          </div>
                          <span className="w-6 text-right font-medium text-slate-700 dark:text-slate-300">
                            {avg.toFixed(1)}
                          </span>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <svg
                  className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  No reviews yet
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Be the first to share your experience
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300">
                        {getInitials(review.playerName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {review.playerName}
                              </span>
                              {review.isVerified && (
                                <span className="px-1.5 py-0.5 text-xs font-medium bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 rounded">
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'text-lime-500'
                                    : 'text-slate-200 dark:text-slate-700'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                        </div>

                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          {review.comment}
                        </p>

                        {/* Admin Response */}
                        {review.adminResponse && (
                          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border-l-2 border-sky-500">
                            <p className="text-xs font-medium text-sky-600 dark:text-sky-400 mb-1">
                              Response from venue
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {review.adminResponse}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            onClick={() => onMarkHelpful?.(review.id)}
                            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-lime-500 dark:hover:text-lime-400 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                              />
                            </svg>
                            Helpful ({review.helpfulCount})
                          </button>
                          {isAdmin && !review.adminResponse && (
                            <button
                              onClick={() => onRespondToReview?.(review.id)}
                              className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                              </svg>
                              Respond
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
