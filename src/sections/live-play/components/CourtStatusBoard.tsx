import { X, Monitor, Users, Clock, Trophy, Wifi, Volume2 } from 'lucide-react'
import type { CourtStatusBoardProps, Match, Court } from '@/../product/sections/live-play/types'

// =============================================================================
// Helper Functions
// =============================================================================

function formatTime(isoString: string | null): string {
  if (!isoString) return '--:--'
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getElapsedMinutes(startedAt: string | null): number {
  if (!startedAt) return 0
  const start = new Date(startedAt).getTime()
  const now = Date.now()
  return Math.floor((now - start) / 60000)
}

function formatGameScore(match: Match): string {
  const team1Games = match.team1.gamesWon ?? 0
  const team2Games = match.team2.gamesWon ?? 0
  return `${team1Games} - ${team2Games}`
}

function formatCurrentScore(match: Match): string {
  const team1Score = match.team1.currentGameScore ?? 0
  const team2Score = match.team2.currentGameScore ?? 0
  return `${team1Score} - ${team2Score}`
}

// =============================================================================
// Sub-Components
// =============================================================================

interface CourtTileProps {
  court: Court
  match: Match | null
  isTournament?: boolean
}

function CourtTile({ court, match, isTournament }: CourtTileProps) {
  const statusConfig = {
    available: {
      bg: 'from-slate-800/90 to-slate-900/90',
      border: 'border-slate-600/50',
      label: 'AVAILABLE',
      labelColor: 'text-slate-400',
      glow: '',
    },
    calling: {
      bg: 'from-amber-900/40 to-amber-950/40',
      border: 'border-amber-500/60',
      label: 'NOW CALLING',
      labelColor: 'text-amber-400',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    },
    in_progress: {
      bg: 'from-lime-900/30 to-lime-950/30',
      border: 'border-lime-500/50',
      label: 'IN PROGRESS',
      labelColor: 'text-lime-400',
      glow: 'shadow-[0_0_20px_rgba(132,204,22,0.2)]',
    },
    maintenance: {
      bg: 'from-red-900/30 to-red-950/30',
      border: 'border-red-500/50',
      label: 'MAINTENANCE',
      labelColor: 'text-red-400',
      glow: '',
    },
  }

  const config = statusConfig[court.status]

  return (
    <div
      className={`
        relative bg-gradient-to-br ${config.bg}
        border-2 ${config.border} rounded-2xl
        p-6 min-h-[280px] flex flex-col
        transition-all duration-500 ${config.glow}
        ${court.status === 'calling' ? 'animate-pulse' : ''}
      `}
    >
      {/* Court Name Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {court.name}
        </h2>
        <span className={`text-sm font-semibold uppercase tracking-widest ${config.labelColor}`}>
          {config.label}
        </span>
      </div>

      {/* Match Content */}
      {match && court.status !== 'available' && court.status !== 'maintenance' ? (
        <div className="flex-1 flex flex-col">
          {/* Round Label for Tournament */}
          {isTournament && match.roundLabel && (
            <div className="mb-3">
              <span className="px-3 py-1 bg-sky-500/20 text-sky-400 text-sm font-medium rounded-full">
                {match.roundLabel}
              </span>
            </div>
          )}

          {/* Teams Display */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            {/* Team 1 */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-2xl font-semibold text-white truncate">
                  {match.team1.players.map(p => p.name.split(' ')[0]).join(' / ')}
                </p>
              </div>
              {match.status === 'in_progress' && (
                <div className="flex items-center gap-3">
                  {(match.gamesPerMatch ?? 1) > 1 && (
                    <span className="text-xl text-slate-400 font-medium">
                      {match.team1.gamesWon ?? 0}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-white tabular-nums min-w-[3ch] text-right">
                    {match.team1.currentGameScore ?? 0}
                  </span>
                </div>
              )}
            </div>

            {/* VS Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
              <span className="text-slate-500 font-medium text-sm">VS</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
            </div>

            {/* Team 2 */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-2xl font-semibold text-white truncate">
                  {match.team2.players.map(p => p.name.split(' ')[0]).join(' / ')}
                </p>
              </div>
              {match.status === 'in_progress' && (
                <div className="flex items-center gap-3">
                  {(match.gamesPerMatch ?? 1) > 1 && (
                    <span className="text-xl text-slate-400 font-medium">
                      {match.team2.gamesWon ?? 0}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-white tabular-nums min-w-[3ch] text-right">
                    {match.team2.currentGameScore ?? 0}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Match Info Footer */}
          {match.status === 'in_progress' && match.startedAt && (
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getElapsedMinutes(match.startedAt)} min</span>
              </div>
              {(match.gamesPerMatch ?? 1) > 1 && (
                <span className="font-medium">
                  Game {(match.team1.gamesWon ?? 0) + (match.team2.gamesWon ?? 0) + 1} of {match.gamesPerMatch}
                </span>
              )}
            </div>
          )}

          {/* Calling State - Big Name Display */}
          {court.status === 'calling' && (
            <div className="mt-4 pt-4 border-t border-amber-500/30">
              <p className="text-amber-400 text-center font-semibold animate-pulse">
                ⚡ Players report to {court.name}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Empty/Available State */
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
          <Monitor className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">
            {court.status === 'maintenance' ? 'Court temporarily unavailable' : 'Ready for next match'}
          </p>
        </div>
      )}
    </div>
  )
}

interface UpNextBannerProps {
  nextMatches: Match[]
}

function UpNextBanner({ nextMatches }: UpNextBannerProps) {
  if (nextMatches.length === 0) return null

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50 px-8 py-4">
      <div className="flex items-center gap-6">
        <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Up Next
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-8 animate-[scroll_30s_linear_infinite]">
            {nextMatches.map((match) => (
              <div key={match.id} className="flex items-center gap-3 text-slate-300 whitespace-nowrap">
                <span>{match.team1.players.map(p => p.name.split(' ')[0]).join('/')}</span>
                <span className="text-slate-500">vs</span>
                <span>{match.team2.players.map(p => p.name.split(' ')[0]).join('/')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function CourtStatusBoard({
  courts,
  matches,
  event,
  onClose,
}: CourtStatusBoardProps) {
  // Build court-to-match lookup
  const matchByCourtId = new Map<string, Match>()
  matches.forEach(match => {
    if (match.courtId) {
      matchByCourtId.set(match.courtId, match)
    }
  })

  // Get queued/calling matches for the "up next" banner
  const upNextMatches = matches.filter(m => m.status === 'scheduled').slice(0, 4)

  // Determine if this is a tournament
  const isTournament = ['single_elimination', 'double_elimination', 'pool_play'].includes(event.format)

  // Calculate grid columns based on court count
  const getGridCols = () => {
    if (courts.length <= 2) return 'grid-cols-1 md:grid-cols-2'
    if (courts.length <= 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
    if (courts.length <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
        <div className="flex items-center gap-6">
          {/* Event Title */}
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {isTournament && <Trophy className="w-6 h-6 text-lime-400" />}
              {event.name}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {event.venue.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-400 font-semibold text-sm uppercase tracking-wider">Live</span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 text-slate-400">
            <Wifi className="w-4 h-4" />
            <span className="text-xs">Connected</span>
          </div>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Exit Court Status Board"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      {/* Courts Grid */}
      <main className="relative z-10 flex-1 overflow-auto p-8">
        <div className={`grid ${getGridCols()} gap-6 max-w-7xl mx-auto`}>
          {courts.map(court => (
            <CourtTile
              key={court.id}
              court={court}
              match={matchByCourtId.get(court.id) ?? null}
              isTournament={isTournament}
            />
          ))}
        </div>
      </main>

      {/* Up Next Banner */}
      <UpNextBanner nextMatches={upNextMatches} />

      {/* Bottom Status Bar */}
      <footer className="relative z-10 px-8 py-3 bg-slate-900/90 border-t border-slate-800/50 flex items-center justify-between text-sm">
        <div className="flex items-center gap-6 text-slate-400">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{courts.filter(c => c.status === 'in_progress').length} Active Matches</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span>{courts.filter(c => c.status === 'available').length} Courts Available</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="px-3 py-1 bg-slate-800 rounded text-xs font-medium">
            COURT STATUS BOARD
          </span>
        </div>
      </footer>

      {/* Pause Overlay */}
      {event.isPaused && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
              <div className="flex gap-2">
                <div className="w-4 h-12 bg-amber-500 rounded" />
                <div className="w-4 h-12 bg-amber-500 rounded" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Event Paused</h2>
            {event.pauseReason && (
              <p className="text-xl text-slate-400">{event.pauseReason}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
