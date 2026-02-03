import {
  Trophy,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Radio,
  Target,
} from 'lucide-react'
import type {
  HybridSeedingViewProps,
  RoundRobinPoolStanding,
  PlayerScheduleEntry,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface CurrentSeedCardProps {
  currentSeed: number
  totalTeams: number
  currentRound: number
  totalRounds: number
  wins: number
  losses: number
  pointDiff: number
}

function CurrentSeedCard({
  currentSeed,
  totalTeams,
  currentRound,
  totalRounds,
  wins,
  losses,
  pointDiff,
}: CurrentSeedCardProps) {
  const isTopSeed = currentSeed <= Math.ceil(totalTeams / 4)
  const seedTrend = currentSeed <= Math.ceil(totalTeams / 2) ? 'good' : 'needs_work'

  return (
    <div
      className={`
        rounded-xl p-5 border-2 transition-colors
        ${isTopSeed
          ? 'bg-gradient-to-br from-lime-500/10 to-emerald-500/5 border-lime-500/30'
          : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50'
        }
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className={`w-5 h-5 ${isTopSeed ? 'text-lime-400' : 'text-slate-400'}`} />
          <span className="text-sm font-medium text-slate-300">Your Current Seed</span>
        </div>
        <span className="text-xs text-slate-500">
          Round {currentRound}/{totalRounds}
        </span>
      </div>

      <div className="flex items-end gap-4">
        <div
          className={`
            text-5xl font-black
            ${isTopSeed ? 'text-lime-400' : 'text-white'}
          `}
        >
          #{currentSeed}
        </div>
        <div className="pb-1">
          <p className="text-xs text-slate-500">of {totalTeams} teams</p>
          <p className={`text-sm font-medium ${isTopSeed ? 'text-lime-400' : 'text-slate-300'}`}>
            {wins}-{losses} ({pointDiff > 0 ? '+' : ''}{pointDiff})
          </p>
        </div>
      </div>

      {/* Progress to next seed */}
      {currentSeed > 1 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400">
            {seedTrend === 'good' ? (
              <span className="text-lime-400">On track for top half seeding</span>
            ) : (
              <span className="text-amber-400">Win remaining matches to improve seeding</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

interface ScheduleRowProps {
  entry: PlayerScheduleEntry
  roundNumber: number
  currentRound: number
  onViewMatch?: () => void
}

function ScheduleRow({ entry, roundNumber, currentRound, onViewMatch }: ScheduleRowProps) {
  const isCurrentRound = roundNumber === currentRound
  const isPast = entry.status === 'completed'
  const isLive = entry.status === 'in_progress'

  return (
    <button
      onClick={onViewMatch}
      className={`
        w-full text-left p-4 rounded-xl transition-all
        ${isCurrentRound || isLive
          ? 'bg-sky-500/10 border-2 border-sky-500/30 shadow-lg shadow-sky-500/5'
          : isPast
          ? 'bg-slate-800/30 border border-slate-700/30'
          : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
        }
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${isPast
                ? entry.result === 'W'
                  ? 'bg-lime-500/20 text-lime-400'
                  : 'bg-red-500/20 text-red-400'
                : isLive
                ? 'bg-sky-500/20 text-sky-400'
                : 'bg-slate-700 text-slate-400'
              }
            `}
          >
            {roundNumber}
          </span>
          <span className="text-xs font-medium text-slate-400">Round {roundNumber}</span>
          {isLive && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-medium">
              <Radio className="w-3 h-3" />
              LIVE
            </span>
          )}
        </div>

        {isPast && entry.result && (
          <span
            className={`
              flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
              ${entry.result === 'W'
                ? 'bg-lime-500/20 text-lime-400'
                : 'bg-red-500/20 text-red-400'
              }
            `}
          >
            {entry.result === 'W' ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            {entry.result}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">vs {entry.opponent}</p>
          <p className="text-xs text-slate-500">
            Seed #{entry.opponentSeed}
          </p>
        </div>

        {entry.score ? (
          <div className="text-right">
            <p className="text-lg font-bold text-white tabular-nums">{entry.score}</p>
            {entry.courtName && (
              <p className="text-xs text-slate-500">{entry.courtName}</p>
            )}
          </div>
        ) : (
          <div className="text-right">
            {entry.courtName && entry.courtName !== 'TBD' ? (
              <p className="text-sm text-slate-300">{entry.courtName}</p>
            ) : (
              <p className="text-sm text-slate-500">Court TBD</p>
            )}
            <p className="text-xs text-slate-500">
              {new Date(entry.scheduledTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}
      </div>
    </button>
  )
}

interface StandingsRowProps {
  standing: RoundRobinPoolStanding
  isCurrentUser: boolean
  rank: number
}

function StandingsRow({ standing, isCurrentUser, rank }: StandingsRowProps) {
  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg
        ${isCurrentUser
          ? 'bg-lime-500/10 border border-lime-500/30'
          : 'bg-slate-800/30'
        }
      `}
    >
      <div
        className={`
          w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold
          ${rank === 1
            ? 'bg-amber-500/20 text-amber-400'
            : rank === 2
            ? 'bg-slate-400/20 text-slate-300'
            : rank === 3
            ? 'bg-orange-500/20 text-orange-400'
            : 'bg-slate-700 text-slate-400'
          }
        `}
      >
        {rank}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`
            text-sm font-medium truncate
            ${isCurrentUser ? 'text-lime-400' : 'text-white'}
          `}
        >
          {standing.displayName}
          {isCurrentUser && <span className="text-xs text-lime-500 ml-1">(You)</span>}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-white tabular-nums">
          {standing.wins}-{standing.losses}
        </p>
        <p className="text-xs text-slate-500">
          {standing.pointDiff > 0 ? '+' : ''}{standing.pointDiff}
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function HybridSeedingView({
  event,
  tournament,
  progress,
  teams,
  currentUser,
  scheduleView,
  onCheckIn,
  onSubmitScore,
  onConfirmScore,
  onViewMatch,
  onViewTeam,
  onViewStandings,
}: HybridSeedingViewProps) {
  const { seedingProgress } = progress
  const currentUserStanding = tournament.seedingStandings.find(
    (s) => s.teamId === currentUser.teamId
  )

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-white">{event.name}</h1>
              <p className="text-xs text-slate-400">{event.venue.name}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/20 text-sky-400 text-sm font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Seeding Round {seedingProgress.currentRound}/{seedingProgress.totalRounds}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-500 to-emerald-500 transition-all duration-500"
              style={{
                width: `${(seedingProgress.currentRound / seedingProgress.totalRounds) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Current Seed Card */}
        {currentUserStanding && (
          <CurrentSeedCard
            currentSeed={currentUserStanding.rank}
            totalTeams={tournament.seedingStandings.length}
            currentRound={seedingProgress.currentRound}
            totalRounds={seedingProgress.totalRounds}
            wins={currentUserStanding.wins}
            losses={currentUserStanding.losses}
            pointDiff={currentUserStanding.pointDiff}
          />
        )}

        {/* Current/Next Match Alert */}
        {currentUser.currentMatchId && (
          <div className="rounded-xl bg-sky-500/10 border-2 border-sky-500/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/20">
                  <Radio className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-sky-400">Match in Progress</p>
                  <p className="text-xs text-slate-400">
                    {scheduleView.schedule.find((s) => s.status === 'in_progress')?.courtName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onViewMatch?.(currentUser.currentMatchId!)}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors"
              >
                View Match
              </button>
            </div>
          </div>
        )}

        {/* Schedule */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Your Schedule</h2>
            <span className="text-xs text-slate-500">
              {scheduleView.schedule.filter((s) => s.status === 'completed').length}/
              {scheduleView.schedule.length} played
            </span>
          </div>

          <div className="space-y-3">
            {scheduleView.schedule.map((entry, idx) => (
              <ScheduleRow
                key={idx}
                entry={entry}
                roundNumber={entry.roundNumber}
                currentRound={seedingProgress.currentRound}
                onViewMatch={() => {
                  const match = tournament.seedingMatches.find(
                    (m) =>
                      m.roundNumber === entry.roundNumber &&
                      (m.team1Id === currentUser.teamId || m.team2Id === currentUser.teamId)
                  )
                  if (match) onViewMatch?.(match.id)
                }}
              />
            ))}
          </div>
        </div>

        {/* Advancement Scenarios */}
        {scheduleView.advancementScenarios.length > 0 && (
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-lime-400" />
              What You Need
            </h3>
            <ul className="space-y-2">
              {scheduleView.advancementScenarios.map((scenario, idx) => (
                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  {scenario}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Standings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Live Standings</h2>
            <button
              onClick={onViewStandings}
              className="text-xs text-lime-400 hover:text-lime-300 transition-colors"
            >
              View Full
            </button>
          </div>

          <div className="space-y-2">
            {tournament.seedingStandings.slice(0, 8).map((standing, idx) => (
              <StandingsRow
                key={standing.teamId}
                standing={standing}
                isCurrentUser={standing.teamId === currentUser.teamId}
                rank={idx + 1}
              />
            ))}
          </div>

          {tournament.seedingStandings.length > 8 && (
            <button
              onClick={onViewStandings}
              className="w-full mt-3 py-2 text-center text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              +{tournament.seedingStandings.length - 8} more teams
            </button>
          )}
        </div>

        {/* Bracket Preview Note */}
        <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4">
          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">
                Bracket starts after Round {seedingProgress.totalRounds}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Your final seed position will determine your bracket matchup. Higher seeds face lower
                seeds in the first round.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HybridSeedingView
