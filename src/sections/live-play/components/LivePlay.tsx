import { useState } from 'react'
import {
  MapPin,
  Calendar,
  Trophy,
  Users,
  Clock,
  Pause,
  Play,
  Square,
  LayoutGrid,
  List,
  Bell,
  Megaphone,
  AlertTriangle,
  ChevronRight,
  Settings,
  Monitor,
} from 'lucide-react'
import { CourtCard } from './CourtCard'
import { MatchCard } from './MatchCard'
import { StandingsTable } from './StandingsTable'
import { MatchQueue } from './MatchQueue'
import { EventProgressBar } from './EventProgressBar'
import type { LivePlayProps, Match, Court } from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

function EventHeader({
  event,
  isPaused,
  isGameManager,
  onPauseEvent,
  onResumeEvent,
  onEndEvent,
  onOpenCourtBoard,
}: {
  event: LivePlayProps['event']
  isPaused: boolean
  isGameManager: boolean
  onPauseEvent?: (reason: string) => void
  onResumeEvent?: () => void
  onEndEvent?: () => void
  onOpenCourtBoard?: () => void
}) {
  const formatLabels: Record<string, string> = {
    round_robin: 'Round Robin',
    open_play: 'Open Play',
    king_of_court: 'King of Court',
    single_elimination: 'Single Elim',
    double_elimination: 'Double Elim',
    ladder: 'Ladder',
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white overflow-hidden">
      {/* Pause Banner */}
      {isPaused && event.pauseReason && (
        <div className="px-4 py-3 bg-amber-500">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pause className="w-4 h-4" />
              <span className="text-sm font-semibold">Event Paused: {event.pauseReason}</span>
            </div>
            {isGameManager && onResumeEvent && (
              <button
                onClick={onResumeEvent}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-white/20 hover:bg-white/30 transition-colors"
              >
                Resume Event
              </button>
            )}
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-lime-500/20 text-lime-300">
                  {formatLabels[event.format]}
                </span>
                {event.status === 'in_progress' && !isPaused && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">{event.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {event.venue.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {event.organizer.name}
                </span>
              </div>
            </div>

            {/* GM Actions */}
            {isGameManager && (
              <div className="flex items-center gap-2">
                {onOpenCourtBoard && (
                  <button
                    onClick={onOpenCourtBoard}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Open Court Board"
                  >
                    <Monitor className="w-5 h-5" />
                  </button>
                )}
                {!isPaused && onPauseEvent && (
                  <button
                    onClick={() => onPauseEvent('Break')}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors flex items-center gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                )}
                {onEndEvent && (
                  <button
                    onClick={onEndEvent}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    End
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Scoring Info */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-slate-300">
              First to {event.scoringRules.pointsToWin}
              {event.scoringRules.winByTwo && ', win by 2'}
              {event.scoringRules.pointCap && `, cap ${event.scoringRules.pointCap}`}
            </span>
            {event.scoringRules.gamesPerMatch > 1 && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-slate-300">
                Best of {event.scoringRules.gamesPerMatch}
              </span>
            )}
            {event.scoringRules.rallyScoring && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-slate-300">
                Rally Scoring
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function YourMatchAlert({
  match,
  court,
  onCheckIn,
  onViewMatch,
}: {
  match: Match
  court: Court | null
  onCheckIn?: () => void
  onViewMatch?: () => void
}) {
  const isCalling = match.status === 'calling'
  const isInProgress = match.status === 'in_progress'

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isCalling
          ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-300 dark:border-amber-800'
          : 'bg-gradient-to-br from-lime-50 to-lime-100/50 dark:from-lime-950/50 dark:to-lime-900/30 border-lime-300 dark:border-lime-800'
      }`}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl flex-shrink-0 ${
              isCalling
                ? 'bg-amber-100 dark:bg-amber-900/50'
                : 'bg-lime-100 dark:bg-lime-900/50'
            }`}
          >
            {isCalling ? (
              <Megaphone className={`w-6 h-6 text-amber-600 dark:text-amber-400`} />
            ) : (
              <Play className={`w-6 h-6 text-lime-600 dark:text-lime-400`} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-bold ${
                isCalling ? 'text-amber-900 dark:text-amber-100' : 'text-lime-900 dark:text-lime-100'
              }`}
            >
              {isCalling ? "You're Being Called!" : 'Your Match In Progress'}
            </h3>
            <p
              className={`text-sm mt-1 ${
                isCalling ? 'text-amber-700 dark:text-amber-300' : 'text-lime-700 dark:text-lime-300'
              }`}
            >
              {isCalling ? 'Head to your court and check in' : 'Good luck!'}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              {court && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                    isCalling
                      ? 'bg-amber-200/50 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
                      : 'bg-lime-200/50 dark:bg-lime-900/50 text-lime-800 dark:text-lime-200'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  {court.name}
                </span>
              )}
              <span
                className={`text-sm ${
                  isCalling ? 'text-amber-600 dark:text-amber-400' : 'text-lime-600 dark:text-lime-400'
                }`}
              >
                vs {match.team2.players.map((p) => p.name.split(' ')[0]).join(' & ')}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            {isCalling && onCheckIn ? (
              <button
                onClick={onCheckIn}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-lg shadow-amber-500/25"
              >
                Check In
              </button>
            ) : onViewMatch ? (
              <button
                onClick={onViewMatch}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-lime-300 dark:border-lime-700 text-lime-700 dark:text-lime-300 hover:bg-lime-100 dark:hover:bg-lime-900/50 transition-colors"
              >
                View Match
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({
  active,
  icon: Icon,
  label,
  count,
  onClick,
}: {
  active: boolean
  icon: React.ElementType
  label: string
  count?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        active
          ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-xs ${
            active
              ? 'bg-lime-200 dark:bg-lime-800 text-lime-700 dark:text-lime-300'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function LivePlay({
  currentUser,
  event,
  eventProgress,
  courts,
  matches,
  matchQueue,
  players,
  standings,
  scoreDisputes,
  completedMatches,
  onCourtCheckIn,
  onSubmitScore,
  onConfirmScore,
  onDisputeScore,
  onCallMatch,
  onStartMatch,
  onEnterScore,
  onResolveDispute,
  onMarkNoShow,
  onSubstitutePlayer,
  onReorderQueue,
  onPauseEvent,
  onResumeEvent,
  onEndEvent,
  onViewPlayer,
  onViewMatch,
  onOpenCourtBoard,
}: LivePlayProps) {
  const [activeTab, setActiveTab] = useState<'courts' | 'standings' | 'queue' | 'history'>('courts')

  const isGameManager = currentUser.isGameManager

  // Find current user's match
  const currentMatch = currentUser.currentMatchId
    ? matches.find((m) => m.id === currentUser.currentMatchId)
    : currentUser.nextMatchId
    ? matches.find((m) => m.id === currentUser.nextMatchId)
    : null

  const currentMatchCourt = currentMatch?.courtId
    ? courts.find((c) => c.id === currentMatch.courtId)
    : null

  // Get match for each court
  const getMatchForCourt = (courtId: string) => {
    return matches.find((m) => m.courtId === courtId && (m.status === 'calling' || m.status === 'in_progress'))
  }

  // Pending disputes count
  const pendingDisputes = scoreDisputes.filter((d) => d.status === 'pending').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Event Header */}
      <EventHeader
        event={event}
        isPaused={event.isPaused}
        isGameManager={isGameManager}
        onPauseEvent={onPauseEvent}
        onResumeEvent={onResumeEvent}
        onEndEvent={onEndEvent}
        onOpenCourtBoard={onOpenCourtBoard}
      />

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Progress Bar */}
          <EventProgressBar progress={eventProgress} isPaused={event.isPaused} />

          {/* Your Match Alert */}
          {currentMatch && (currentMatch.status === 'calling' || currentMatch.status === 'in_progress') && (
            <YourMatchAlert
              match={currentMatch}
              court={currentMatchCourt ?? null}
              onCheckIn={currentMatch.status === 'calling' ? () => onCourtCheckIn?.(currentMatch.id) : undefined}
              onViewMatch={() => onViewMatch?.(currentMatch.id)}
            />
          )}

          {/* GM Alerts */}
          {isGameManager && pendingDisputes > 0 && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    {pendingDisputes} score {pendingDisputes === 1 ? 'dispute' : 'disputes'} pending review
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors">
                  Review
                </button>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabButton
              active={activeTab === 'courts'}
              icon={LayoutGrid}
              label="Courts"
              count={courts.filter((c) => c.status === 'in_progress').length}
              onClick={() => setActiveTab('courts')}
            />
            <TabButton
              active={activeTab === 'standings'}
              icon={Trophy}
              label="Standings"
              onClick={() => setActiveTab('standings')}
            />
            <TabButton
              active={activeTab === 'queue'}
              icon={Clock}
              label="Queue"
              count={matchQueue.length}
              onClick={() => setActiveTab('queue')}
            />
            <TabButton
              active={activeTab === 'history'}
              icon={List}
              label="History"
              count={completedMatches.length}
              onClick={() => setActiveTab('history')}
            />
          </div>

          {/* Tab Content */}
          {activeTab === 'courts' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {courts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  match={getMatchForCourt(court.id) ?? null}
                  isGameManager={isGameManager}
                  onCallMatch={
                    court.status === 'available' && matchQueue.length > 0
                      ? () => onCallMatch?.(matchQueue[0].id, court.id)
                      : undefined
                  }
                  onStartMatch={
                    court.status === 'calling'
                      ? () => {
                          const match = getMatchForCourt(court.id)
                          if (match) onStartMatch?.(match.id)
                        }
                      : undefined
                  }
                  onViewMatch={
                    court.currentMatchId ? () => onViewMatch?.(court.currentMatchId!) : undefined
                  }
                />
              ))}
            </div>
          )}

          {activeTab === 'standings' && (
            <StandingsTable
              standings={standings}
              currentUserId={currentUser.id}
              onViewPlayer={onViewPlayer}
            />
          )}

          {activeTab === 'queue' && (
            <MatchQueue
              queue={matchQueue}
              isGameManager={isGameManager}
              onReorder={onReorderQueue}
              onViewMatch={onViewMatch}
            />
          )}

          {activeTab === 'history' && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <List className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Completed Matches</h3>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {completedMatches.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => onViewMatch?.(match.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className={`font-medium ${
                              match.winner === match.team1Names
                                ? 'text-lime-700 dark:text-lime-400'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {match.team1Names}
                          </span>
                          <span className="text-slate-400">vs</span>
                          <span
                            className={`font-medium ${
                              match.winner === match.team2Names
                                ? 'text-lime-700 dark:text-lime-400'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {match.team2Names}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>{match.court}</span>
                          <span>·</span>
                          <span>
                            {new Date(match.completedAt).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                          {match.score}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {completedMatches.length === 0 && (
                <div className="py-8 text-center">
                  <List className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No completed matches yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
