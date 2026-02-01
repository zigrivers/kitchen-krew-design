import { Calendar, MapPin, Users, Trophy, DollarSign } from 'lucide-react'
import type { Event, Player } from '@/../product/sections/events/types'

interface EventCardProps {
  event: Event
  isRegistered?: boolean
  isOnWaitlist?: boolean
  onView?: () => void
  onRegister?: () => void
  onUnregister?: () => void
  onJoinWaitlist?: () => void
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function PlayerAvatar({ player, size = 'sm' }: { player: Player; size?: 'sm' | 'md' }) {
  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (player.avatarUrl) {
    return (
      <img
        src={player.avatarUrl}
        alt={player.name}
        className={`${sizeClasses} rounded-full object-cover ring-2 ring-white dark:ring-slate-900`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center ring-2 ring-white dark:ring-slate-900`}
    >
      <span className="font-medium text-sky-700 dark:text-sky-300">{initials}</span>
    </div>
  )
}

export function EventCard({
  event,
  isRegistered,
  isOnWaitlist,
  onView,
  onRegister,
  onUnregister,
  onJoinWaitlist,
}: EventCardProps) {
  const isFull = event.spotsAvailable === 0
  const hasWaitlist = event.waitlist.length > 0

  return (
    <div
      onClick={onView}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200 hover:border-lime-300 dark:hover:border-lime-700 hover:shadow-lg hover:shadow-lime-500/10 cursor-pointer"
    >
      {/* Status Badge */}
      {(isRegistered || isOnWaitlist) && (
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              isRegistered
                ? 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400'
                : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'
            }`}
          >
            {isRegistered ? 'Registered' : 'Waitlisted'}
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5">
        {/* Format Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
            <Trophy className="w-3.5 h-3.5" />
            {event.format}
          </span>
          {event.fee && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-400 text-xs font-medium">
              <DollarSign className="w-3.5 h-3.5" />
              {event.fee}
            </span>
          )}
          {!event.fee && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400 text-xs font-medium">
              Free
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
          {event.name}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-medium">{formatDate(event.startDateTime)}</span>
          <span className="text-slate-400">·</span>
          <span>
            {formatTime(event.startDateTime)} – {formatTime(event.endDateTime)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span>{event.venue.name}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">{event.venue.city}</span>
        </div>

        {/* Skill Level */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">Skill:</span>
            <span className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300">
              {event.skillLevelMin.toFixed(1)} – {event.skillLevelMax.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Users className="w-4 h-4" />
              <span>
                {event.registeredCount}/{event.maxPlayers} players
              </span>
            </div>
            {isFull ? (
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Full{hasWaitlist && ` · ${event.waitlist.length} waiting`}
              </span>
            ) : (
              <span className="text-xs font-medium text-lime-600 dark:text-lime-400">
                {event.spotsAvailable} spots left
              </span>
            )}
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isFull
                  ? 'bg-amber-500'
                  : event.spotsAvailable <= 3
                    ? 'bg-amber-400'
                    : 'bg-lime-500'
              }`}
              style={{ width: `${(event.registeredCount / event.maxPlayers) * 100}%` }}
            />
          </div>
        </div>

        {/* Footer: Organizer & Players */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Organizer */}
          <div className="flex items-center gap-2">
            <PlayerAvatar player={event.organizer} size="sm" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              by <span className="font-medium text-slate-700 dark:text-slate-300">{event.organizer.name}</span>
            </span>
          </div>

          {/* Registered Players Preview */}
          {event.registrations.length > 0 && (
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {event.registrations.slice(0, 3).map((reg) => (
                  <PlayerAvatar key={reg.id} player={reg.player} size="sm" />
                ))}
              </div>
              {event.registrations.length > 3 && (
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  +{event.registrations.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5">
        {isRegistered ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUnregister?.()
            }}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
          >
            Unregister
          </button>
        ) : isOnWaitlist ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUnregister?.()
            }}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium border-2 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
          >
            Leave Waitlist
          </button>
        ) : isFull ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onJoinWaitlist?.()
            }}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors"
          >
            Join Waitlist
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRegister?.()
            }}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
          >
            Register
          </button>
        )}
      </div>
    </div>
  )
}
