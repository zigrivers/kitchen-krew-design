import { useState } from 'react'
import {
  Trophy,
  Users,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  MapPin,
  Monitor,
  Share2,
  LayoutGrid,
  Radio,
  ArrowRight,
  Target,
  TrendingUp,
  Settings,
} from 'lucide-react'
import type {
  HybridTournamentProps,
  HybridPhase,
  RoundRobinMatch,
  RoundRobinPoolStanding,
  RoundRobinTeam,
  Court,
  BracketMatch,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface PhaseIndicatorProps {
  currentPhase: HybridPhase
  seedingProgress: { currentRound: number; totalRounds: number }
  bracketProgress?: { currentRound: number; totalRounds: number } | null
}

function PhaseIndicator({ currentPhase, seedingProgress, bracketProgress }: PhaseIndicatorProps) {
  const phases: { key: HybridPhase; label: string }[] = [
    { key: 'registration', label: 'Setup' },
    { key: 'seeding', label: 'Seeding' },
    { key: 'transition', label: 'Review' },
    { key: 'bracket', label: 'Bracket' },
    { key: 'completed', label: 'Complete' },
  ]

  const currentIndex = phases.findIndex((p) => p.key === currentPhase)

  return (
    <div className="flex items-center gap-1">
      {phases.map((phase, idx) => {
        const isActive = phase.key === currentPhase
        const isPast = idx < currentIndex
        const isFuture = idx > currentIndex

        return (
          <div key={phase.key} className="flex items-center">
            <div
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${isActive
                  ? phase.key === 'seeding'
                    ? 'bg-sky-500/20 text-sky-400'
                    : phase.key === 'bracket'
                    ? 'bg-amber-500/20 text-amber-400'
                    : phase.key === 'transition'
                    ? 'bg-lime-500/20 text-lime-400'
                    : 'bg-slate-700 text-slate-300'
                  : isPast
                  ? 'bg-lime-500/10 text-lime-500'
                  : 'bg-slate-800 text-slate-600'
                }
              `}
            >
              {phase.label}
              {isActive && phase.key === 'seeding' && (
                <span className="ml-1 text-[10px]">
                  ({seedingProgress.currentRound}/{seedingProgress.totalRounds})
                </span>
              )}
              {isActive && phase.key === 'bracket' && bracketProgress && (
                <span className="ml-1 text-[10px]">
                  (R{bracketProgress.currentRound})
                </span>
              )}
            </div>
            {idx < phases.length - 1 && (
              <ChevronRight
                className={`w-4 h-4 mx-1 ${isPast ? 'text-lime-500' : 'text-slate-700'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface QuickStatProps {
  icon: React.ReactNode
  label: string
  value: string | number
  color: 'lime' | 'sky' | 'amber' | 'slate'
}

function QuickStat({ icon, label, value, color }: QuickStatProps) {
  const colorClasses = {
    lime: 'text-lime-400 bg-lime-500/10',
    sky: 'text-sky-400 bg-sky-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    slate: 'text-slate-400 bg-slate-700/50',
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  )
}

interface CourtCardProps {
  court: Court
  match?: RoundRobinMatch | BracketMatch
  teams: Map<string, RoundRobinTeam>
  phase: 'seeding' | 'bracket'
  onStartMatch?: () => void
  onEnterScore?: () => void
  onCallMatch?: () => void
}

function CourtCard({ court, match, teams, phase, onStartMatch, onEnterScore, onCallMatch }: CourtCardProps) {
  const getTeamName = (id: string) => teams.get(id)?.displayName || 'TBD'

  const statusConfig = {
    available: { bg: 'bg-slate-800/50', border: 'border-slate-700/50', dot: 'bg-slate-500' },
    calling: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-500' },
    in_progress: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', dot: 'bg-sky-500' },
    maintenance: { bg: 'bg-slate-800/30', border: 'border-slate-700/30', dot: 'bg-slate-600' },
  }

  const config = statusConfig[court.status] || statusConfig.available

  // Type guard for RoundRobinMatch vs BracketMatch
  const isRoundRobinMatch = (m: RoundRobinMatch | BracketMatch): m is RoundRobinMatch => {
    return 'team1Id' in m
  }

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-4`}>
      {/* Court Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${config.dot} ${
              court.status !== 'available' && court.status !== 'maintenance' ? 'animate-pulse' : ''
            }`}
          />
          <span className="text-sm font-bold text-white">{court.name}</span>
        </div>
        <span className="text-xs text-slate-500 capitalize">{court.status.replace('_', ' ')}</span>
      </div>

      {/* Match Content */}
      {match ? (
        <div className="space-y-3">
          {/* Round Label */}
          <span className="text-xs text-slate-500">
            {phase === 'seeding'
              ? isRoundRobinMatch(match)
                ? `Seeding Round ${match.roundNumber}`
                : ''
              : !isRoundRobinMatch(match)
              ? match.roundLabel
              : ''}
          </span>

          {/* Teams */}
          <div className="space-y-2">
            {isRoundRobinMatch(match) ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-200 truncate">{getTeamName(match.team1Id)}</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {match.score?.team1 ?? '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-200 truncate">{getTeamName(match.team2Id)}</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {match.score?.team2 ?? '-'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-200 truncate">
                    {match.team1?.displayName || 'TBD'}
                  </span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {match.scores.length > 0 ? match.scores.map((s) => s.team1).join('-') : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-200 truncate">
                    {match.team2?.displayName || 'TBD'}
                  </span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {match.scores.length > 0 ? match.scores.map((s) => s.team2).join('-') : '-'}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-700/30">
            {court.status === 'calling' && (
              <button
                onClick={onStartMatch}
                className="flex-1 px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-900 text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3" />
                Start
              </button>
            )}
            {court.status === 'in_progress' && (
              <button
                onClick={onEnterScore}
                className="flex-1 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium transition-colors"
              >
                Enter Score
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 text-center py-2">Court available</p>
          <button
            onClick={onCallMatch}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Call Next Match
          </button>
        </div>
      )}
    </div>
  )
}

interface StandingsCardProps {
  standings: RoundRobinPoolStanding[]
  teams: Map<string, RoundRobinTeam>
  onViewTeam?: (teamId: string) => void
}

function StandingsCard({ standings, teams, onViewTeam }: StandingsCardProps) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-white">Live Standings</h3>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {standings.slice(0, 8).map((standing, idx) => (
            <button
              key={standing.teamId}
              onClick={() => onViewTeam?.(standing.teamId)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
            >
              <div
                className={`
                  w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                  ${idx === 0
                    ? 'bg-amber-500/20 text-amber-400'
                    : idx === 1
                    ? 'bg-slate-400/20 text-slate-300'
                    : idx === 2
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-slate-700 text-slate-400'
                  }
                `}
              >
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{standing.displayName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white tabular-nums">
                  {standing.wins}-{standing.losses}
                </p>
                <p className="text-[10px] text-slate-500">
                  {standing.pointDiff > 0 ? '+' : ''}
                  {standing.pointDiff}
                </p>
              </div>
            </button>
          ))}
        </div>

        {standings.length > 8 && (
          <p className="text-xs text-slate-500 text-center mt-3">
            +{standings.length - 8} more teams
          </p>
        )}
      </div>
    </div>
  )
}

interface MatchQueueProps {
  matches: RoundRobinMatch[]
  teams: Map<string, RoundRobinTeam>
  availableCourts: Court[]
  onCallMatch?: (matchId: string, courtId: string) => void
}

function MatchQueue({ matches, teams, availableCourts, onCallMatch }: MatchQueueProps) {
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming')

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-white">Match Queue</h3>
        </div>
        <span className="text-xs text-lime-400">{upcomingMatches.length} waiting</span>
      </div>

      <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
        {upcomingMatches.slice(0, 6).map((match) => (
          <div
            key={match.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500">Round {match.roundNumber}</p>
              <p className="text-sm text-white truncate">
                {teams.get(match.team1Id)?.displayName} vs {teams.get(match.team2Id)?.displayName}
              </p>
            </div>

            {availableCourts.length > 0 && (
              <div className="flex gap-1">
                {availableCourts.slice(0, 2).map((court) => (
                  <button
                    key={court.id}
                    onClick={() => onCallMatch?.(match.id, court.id)}
                    className="px-2 py-1 rounded bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 text-xs font-medium transition-colors"
                  >
                    {court.name.replace('Court ', 'C')}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {upcomingMatches.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">All matches scheduled</p>
        )}
      </div>
    </div>
  )
}

interface TransitionBannerProps {
  onReviewSeeding: () => void
}

function TransitionBanner({ onReviewSeeding }: TransitionBannerProps) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-lime-500/20 to-emerald-500/20 border border-lime-500/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-lime-500/20">
            <CheckCircle2 className="w-5 h-5 text-lime-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-lime-400">Seeding Complete!</p>
            <p className="text-xs text-slate-400">Review standings and generate bracket</p>
          </div>
        </div>
        <button
          onClick={onReviewSeeding}
          className="px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-900 text-sm font-medium transition-colors flex items-center gap-2"
        >
          Review & Generate Bracket
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function HybridTournamentDashboard({
  event,
  tournament,
  progress,
  teams,
  courts,
  currentUser,
  onCallSeedingMatch,
  onStartSeedingMatch,
  onEnterSeedingScore,
  onLockSeeding,
  onGenerateBracket,
  onStartBracketPhase,
  onCallBracketMatch,
  onStartBracketMatch,
  onEnterBracketScore,
  onPauseEvent,
  onResumeEvent,
  onEndEvent,
  onViewBracket,
  onViewTeam,
  onViewMatch,
  onOpenCourtBoard,
  onShareTournament,
}: HybridTournamentProps) {
  const [showPauseModal, setShowPauseModal] = useState(false)

  const teamMap = new Map(teams.map((t) => [t.id, t]))

  // Get matches by court
  const seedingMatchesByCourtId = new Map(
    tournament.seedingMatches.filter((m) => m.courtId).map((m) => [m.courtId!, m])
  )
  const bracketMatchesByCourtId = new Map(
    tournament.bracketMatches.filter((m) => m.courtId).map((m) => [m.courtId!, m])
  )

  const availableCourts = courts.filter((c) => c.status === 'available')
  const isSeedingPhase = tournament.currentPhase === 'seeding'
  const isTransitionPhase = tournament.currentPhase === 'transition'
  const isBracketPhase = tournament.currentPhase === 'bracket'

  // Check if seeding is complete
  const allSeedingMatchesComplete = tournament.seedingMatches.every(
    (m) => m.status === 'completed' || m.status === 'forfeit'
  )

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 overflow-hidden m-4 sm:m-6">
        {/* Top Bar */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-700/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{event.name}</h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">
                      {tournament.bracketSize}-team hybrid tournament
                    </span>
                    {event.isPaused ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                        <Pause className="w-3 h-3" />
                        Paused
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-lime-500/20 text-lime-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onViewBracket}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="View Bracket"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={onOpenCourtBoard}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Court Status Board"
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={onShareTournament}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Share Tournament"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {event.isPaused ? (
                <button
                  onClick={onResumeEvent}
                  className="px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-900 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Resume
                </button>
              ) : (
                <button
                  onClick={() => setShowPauseModal(true)}
                  className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="mt-4">
            <PhaseIndicator
              currentPhase={tournament.currentPhase}
              seedingProgress={progress.seedingProgress}
              bracketProgress={progress.bracketProgress}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {isSeedingPhase ? (
            <>
              <QuickStat
                icon={<Target className="w-4 h-4" />}
                label="Round"
                value={`${progress.seedingProgress.currentRound}/${progress.seedingProgress.totalRounds}`}
                color="sky"
              />
              <QuickStat
                icon={<CheckCircle2 className="w-4 h-4" />}
                label="Matches Done"
                value={progress.seedingProgress.matchesCompleted}
                color="lime"
              />
              <QuickStat
                icon={<Radio className="w-4 h-4" />}
                label="In Progress"
                value={progress.seedingProgress.matchesInProgress}
                color="sky"
              />
              <QuickStat
                icon={<Users className="w-4 h-4" />}
                label="Teams"
                value={tournament.seedingStandings.length}
                color="slate"
              />
              <QuickStat
                icon={<MapPin className="w-4 h-4" />}
                label="Courts Active"
                value={`${courts.length - availableCourts.length}/${courts.length}`}
                color="slate"
              />
              <QuickStat
                icon={<Clock className="w-4 h-4" />}
                label="Est. Remaining"
                value={`${progress.estimatedRemainingMinutes}m`}
                color="slate"
              />
            </>
          ) : progress.bracketProgress ? (
            <>
              <QuickStat
                icon={<Trophy className="w-4 h-4" />}
                label="Round"
                value={`R${progress.bracketProgress.currentRound}`}
                color="amber"
              />
              <QuickStat
                icon={<Users className="w-4 h-4" />}
                label="Teams Left"
                value={progress.bracketProgress.teamsRemaining}
                color="lime"
              />
              <QuickStat
                icon={<CheckCircle2 className="w-4 h-4" />}
                label="Matches Done"
                value={progress.bracketProgress.matchesCompleted}
                color="lime"
              />
              <QuickStat
                icon={<Radio className="w-4 h-4" />}
                label="In Progress"
                value={progress.bracketProgress.matchesInProgress}
                color="sky"
              />
              <QuickStat
                icon={<MapPin className="w-4 h-4" />}
                label="Courts Active"
                value={`${courts.length - availableCourts.length}/${courts.length}`}
                color="slate"
              />
              <QuickStat
                icon={<Clock className="w-4 h-4" />}
                label="Est. Remaining"
                value={`${progress.estimatedRemainingMinutes}m`}
                color="slate"
              />
            </>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pb-6 space-y-6">
        {/* Transition Banner */}
        {(isTransitionPhase || (isSeedingPhase && allSeedingMatchesComplete)) && (
          <TransitionBanner
            onReviewSeeding={() => {
              onLockSeeding?.()
            }}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courts Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400" />
                Courts
              </h2>
              <span className="text-xs text-slate-500">
                {availableCourts.length} available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {courts.map((court) => {
                const match = isSeedingPhase
                  ? seedingMatchesByCourtId.get(court.id)
                  : bracketMatchesByCourtId.get(court.id)

                return (
                  <CourtCard
                    key={court.id}
                    court={court}
                    match={match}
                    teams={teamMap}
                    phase={isSeedingPhase ? 'seeding' : 'bracket'}
                    onStartMatch={() => {
                      if (match) {
                        if (isSeedingPhase) {
                          onStartSeedingMatch?.(match.id)
                        } else {
                          onStartBracketMatch?.(match.id)
                        }
                      }
                    }}
                    onEnterScore={() => {
                      if (match) {
                        if (isSeedingPhase) {
                          onEnterSeedingScore?.(match.id, 0, 0)
                        } else {
                          onEnterBracketScore?.(match.id)
                        }
                      }
                    }}
                    onCallMatch={() => {
                      const nextMatch = isSeedingPhase
                        ? tournament.seedingMatches.find((m) => m.status === 'upcoming')
                        : tournament.bracketMatches.find(
                            (m) => m.status === 'upcoming' && m.team1 && m.team2 && !m.courtId
                          )
                      if (nextMatch) {
                        if (isSeedingPhase) {
                          onCallSeedingMatch?.(nextMatch.id, court.id)
                        } else {
                          onCallBracketMatch?.(nextMatch.id, court.id)
                        }
                      }
                    }}
                  />
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seeding Phase: Show standings and match queue */}
            {isSeedingPhase && (
              <>
                <StandingsCard
                  standings={tournament.seedingStandings}
                  teams={teamMap}
                  onViewTeam={onViewTeam}
                />
                <MatchQueue
                  matches={tournament.seedingMatches}
                  teams={teamMap}
                  availableCourts={availableCourts}
                  onCallMatch={(matchId, courtId) => onCallSeedingMatch?.(matchId, courtId)}
                />
              </>
            )}

            {/* Bracket Phase: Show bracket preview */}
            {isBracketPhase && tournament.bracket && (
              <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Bracket</h3>
                  </div>
                  <button
                    onClick={onViewBracket}
                    className="text-xs text-lime-400 hover:text-lime-300 transition-colors"
                  >
                    View Full
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  {tournament.bracketMatches
                    .filter((m) => m.status === 'in_progress' || m.status === 'calling')
                    .slice(0, 4)
                    .map((match) => (
                      <div
                        key={match.id}
                        className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
                      >
                        <p className="text-xs text-slate-500 mb-1">{match.roundLabel}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white truncate">
                            {match.team1?.displayName} vs {match.team2?.displayName}
                          </span>
                          <span
                            className={`
                              text-xs px-2 py-0.5 rounded-full
                              ${match.status === 'in_progress'
                                ? 'bg-sky-500/20 text-sky-400'
                                : 'bg-amber-500/20 text-amber-400'
                              }
                            `}
                          >
                            {match.status === 'in_progress' ? 'Live' : 'Calling'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <PauseModal
          onConfirm={(reason) => {
            onPauseEvent?.(reason)
            setShowPauseModal(false)
          }}
          onCancel={() => setShowPauseModal(false)}
        />
      )}
    </div>
  )
}

interface PauseModalProps {
  onConfirm: (reason: string) => void
  onCancel: () => void
}

function PauseModal({ onConfirm, onCancel }: PauseModalProps) {
  const [reason, setReason] = useState('')
  const quickReasons = ['Weather delay', 'Lunch break', 'Technical issue', 'Emergency']

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-lg font-bold text-white mb-4">Pause Tournament</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {quickReasons.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  reason === r
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason || 'No reason specified')}
            className="flex-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-medium transition-colors"
          >
            Pause Tournament
          </button>
        </div>
      </div>
    </div>
  )
}

export default HybridTournamentDashboard
