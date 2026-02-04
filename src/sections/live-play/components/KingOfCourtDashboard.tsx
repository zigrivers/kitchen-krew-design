import {
  Crown,
  ArrowUp,
  ArrowDown,
  Clock,
  Trophy,
  Target,
  Users,
  Timer,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import type {
  KingOfCourtDashboardProps,
  KingCourt,
  KingStanding,
  MatchPlayer,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Helper Functions
// =============================================================================

function formatTime(isoString: string | null): string {
  if (!isoString) return '--:--'
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getCourtRankColor(rank: number): { bg: string; border: string; text: string } {
  switch (rank) {
    case 1:
      return {
        bg: 'from-amber-900/40 to-amber-950/40',
        border: 'border-amber-500/60',
        text: 'text-amber-400',
      }
    case 2:
      return {
        bg: 'from-slate-700/40 to-slate-800/40',
        border: 'border-slate-400/40',
        text: 'text-slate-300',
      }
    case 3:
      return {
        bg: 'from-orange-900/30 to-orange-950/30',
        border: 'border-orange-500/40',
        text: 'text-orange-400',
      }
    default:
      return {
        bg: 'from-slate-800/40 to-slate-900/40',
        border: 'border-slate-600/40',
        text: 'text-slate-400',
      }
  }
}

// =============================================================================
// Sub-Components
// =============================================================================

interface SessionProgressProps {
  rotationNumber: number
  totalRotations: number
  elapsedMinutes: number
  sessionEndTime: string | null
}

function SessionProgress({ rotationNumber, totalRotations, elapsedMinutes, sessionEndTime }: SessionProgressProps) {
  const progressPercent = Math.round((rotationNumber / totalRotations) * 100)

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Rotation Progress</p>
            <p className="text-lg font-bold text-white">
              {rotationNumber} / {totalRotations}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Session Time</p>
          <p className="text-lg font-bold text-white">{elapsedMinutes} min</p>
        </div>
        {sessionEndTime && (
          <div className="text-right">
            <p className="text-sm text-slate-400">Ends At</p>
            <p className="text-lg font-bold text-white">{formatTime(sessionEndTime)}</p>
          </div>
        )}
      </div>
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}

interface CourtCardProps {
  court: KingCourt
  onEnterScore?: () => void
}

function CourtCard({ court, onEnterScore }: CourtCardProps) {
  const rankColors = getCourtRankColor(court.rank)
  const isKingCourt = court.rank === 1

  return (
    <div
      className={`
        relative bg-gradient-to-br ${rankColors.bg}
        border-2 ${rankColors.border} rounded-2xl p-5
        transition-all duration-300
        ${isKingCourt ? 'shadow-[0_0_30px_rgba(245,158,11,0.2)]' : ''}
      `}
    >
      {/* King Court Crown */}
      {isKingCourt && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full flex items-center gap-1">
          <Crown className="w-3.5 h-3.5" />
          KING COURT
        </div>
      )}

      {/* Court Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg
              ${isKingCourt ? 'bg-amber-500 text-slate-900' : 'bg-slate-700/50 text-slate-300'}
            `}
          >
            {court.rank}
          </div>
          <div>
            <h3 className="font-semibold text-white">{court.name}</h3>
            <p className="text-xs text-slate-400">
              {court.status === 'in_progress' ? 'Game in progress' : 'Waiting'}
            </p>
          </div>
        </div>
        {court.status === 'in_progress' && court.gameStartedAt && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-300">
              {Math.floor((Date.now() - new Date(court.gameStartedAt).getTime()) / 60000)} min
            </span>
          </div>
        )}
      </div>

      {/* Teams */}
      {court.status === 'in_progress' && court.team1 && court.team2 && (
        <div className="space-y-3">
          {/* Team 1 */}
          <div className="flex items-center justify-between p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {court.team1.map((p) => p.name.split(' ')[0]).join(' & ')}
              </p>
              <p className="text-xs text-slate-500">
                Avg {(court.team1.reduce((sum, p) => sum + (p.skillRating || 0), 0) / court.team1.length).toFixed(1)}
              </p>
            </div>
            {court.currentScore && (
              <span className="text-3xl font-bold text-white tabular-nums">{court.currentScore.team1}</span>
            )}
          </div>

          {/* VS Divider */}
          <div className="flex items-center gap-3 px-3">
            <div className="flex-1 h-px bg-slate-600/50" />
            <span className="text-xs text-slate-500 font-medium">VS</span>
            <div className="flex-1 h-px bg-slate-600/50" />
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {court.team2.map((p) => p.name.split(' ')[0]).join(' & ')}
              </p>
              <p className="text-xs text-slate-500">
                Avg {(court.team2.reduce((sum, p) => sum + (p.skillRating || 0), 0) / court.team2.length).toFixed(1)}
              </p>
            </div>
            {court.currentScore && (
              <span className="text-3xl font-bold text-white tabular-nums">{court.currentScore.team2}</span>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onEnterScore}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
      >
        <Target className="w-4 h-4" />
        Enter Score
      </button>
    </div>
  )
}

interface StandingsRowProps {
  standing: KingStanding
  onViewPlayer?: () => void
}

function StandingsRow({ standing, onViewPlayer }: StandingsRowProps) {
  const isOnKingCourt = standing.currentCourt === 1

  return (
    <button
      onClick={onViewPlayer}
      className={`
        w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-700/30 transition-colors
        ${isOnKingCourt ? 'bg-amber-500/5' : ''}
      `}
    >
      {/* Rank */}
      <span
        className={`
          w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
          ${standing.rank === 1 ? 'bg-amber-500/20 text-amber-400' : ''}
          ${standing.rank === 2 ? 'bg-slate-400/20 text-slate-300' : ''}
          ${standing.rank === 3 ? 'bg-orange-500/20 text-orange-400' : ''}
          ${standing.rank > 3 ? 'bg-slate-700/50 text-slate-400' : ''}
        `}
      >
        {standing.rank}
      </span>

      {/* Player Info */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white truncate">{standing.player.name}</p>
          {isOnKingCourt && (
            <Crown className="w-4 h-4 text-amber-400" />
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{standing.player.skillRating?.toFixed(1)}</span>
          <span className="text-slate-600">•</span>
          <span>Court {standing.currentCourt}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="text-center">
          <p className="font-semibold text-lime-400">{standing.totalWins}</p>
          <p className="text-xs text-slate-500">W</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-red-400">{standing.totalLosses}</p>
          <p className="text-xs text-slate-500">L</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-amber-400">{standing.kingCourtMinutes}m</p>
          <p className="text-xs text-slate-500">👑</p>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-slate-500" />
    </button>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function KingOfCourtDashboard({
  event,
  session,
  onStartSession,
  onEnterScore,
  onProcessMovement,
  onEndSession,
  onAdjustPosition,
  onViewPlayer,
}: KingOfCourtDashboardProps) {
  const { config, courts, standings, rotationNumber, totalRotations, elapsedMinutes, sessionEndTime } = session

  // Sort courts by rank
  const sortedCourts = [...courts].sort((a, b) => a.rank - b.rank)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Crown className="w-7 h-7 text-amber-400" />
              <h1 className="text-2xl font-bold text-white">{event.name}</h1>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
                KING OF THE COURT
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{event.venue.name}</span>
              <span className="text-slate-600">•</span>
              <span>{config.courtCount} Courts</span>
              <span className="text-slate-600">•</span>
              <span className="capitalize">{config.partnerRule} Partners</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onProcessMovement}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Process Movement
            </button>
            <button
              onClick={onEndSession}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-medium rounded-lg transition-colors"
            >
              End Session
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Session Progress */}
        <SessionProgress
          rotationNumber={rotationNumber}
          totalRotations={totalRotations}
          elapsedMinutes={elapsedMinutes}
          sessionEndTime={sessionEndTime}
        />

        {/* Movement Rules Banner */}
        <div className="mt-4 flex items-center justify-center gap-6 py-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 text-lime-400">
            <ArrowUp className="w-5 h-5" />
            <span className="text-sm font-medium">Winners move UP</span>
          </div>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-2 text-red-400">
            <ArrowDown className="w-5 h-5" />
            <span className="text-sm font-medium">Losers move DOWN</span>
          </div>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Partners {config.partnerRule}</span>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column: Courts */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedCourts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  onEnterScore={() => onEnterScore?.(court.id, 0, 0)}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Standings */}
          <div>
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Standings
                </h2>
                <span className="text-xs text-slate-500">
                  {standings.length} players
                </span>
              </div>
              <div className="divide-y divide-slate-700/50 max-h-[500px] overflow-y-auto">
                {standings.map((standing) => (
                  <StandingsRow
                    key={standing.player.id}
                    standing={standing}
                    onViewPlayer={() => onViewPlayer?.(standing.player.id)}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-semibold text-white mb-3">Scoring</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Points to Win</span>
                  <span className="text-white">{config.pointsToWin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Movement Rule</span>
                  <span className="text-white capitalize">{config.movementRule.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
