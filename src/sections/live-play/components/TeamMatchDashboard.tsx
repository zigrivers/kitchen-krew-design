import {
  Users,
  Trophy,
  PlayCircle,
  CheckCircle2,
  Clock,
  Zap,
  ChevronRight,
  Medal,
  Target,
} from 'lucide-react'
import type {
  TeamCompetitionDashboardProps,
  TeamMatch,
  TeamGame,
  TeamStanding,
  CompetitionTeam,
  TeamGameType,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Helper Functions
// =============================================================================

function formatTime(isoString: string | null): string {
  if (!isoString) return '--:--'
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getGameTypeLabel(type: TeamGameType): string {
  const labels: Record<TeamGameType, string> = {
    mens_doubles: "Men's Doubles",
    womens_doubles: "Women's Doubles",
    mixed_doubles_1: 'Mixed Doubles 1',
    mixed_doubles_2: 'Mixed Doubles 2',
    dreambreaker: 'Dreambreaker',
  }
  return labels[type] || type
}

function getGameTypeShort(type: TeamGameType): string {
  const labels: Record<TeamGameType, string> = {
    mens_doubles: 'MD',
    womens_doubles: 'WD',
    mixed_doubles_1: 'MX1',
    mixed_doubles_2: 'MX2',
    dreambreaker: 'DB',
  }
  return labels[type] || type
}

function getGameStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-lime-500/20 text-lime-400 border-lime-500/30'
    case 'in_progress':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
}

// =============================================================================
// Sub-Components
// =============================================================================

interface MatchScoreHeaderProps {
  match: TeamMatch
}

function MatchScoreHeader({ match }: MatchScoreHeaderProps) {
  const team1Leading = match.team1Score > match.team2Score
  const team2Leading = match.team2Score > match.team1Score
  const tied = match.team1Score === match.team2Score

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6">
      {/* Teams Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Team 1 */}
        <div className="flex-1 text-center">
          <div
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-3
              ${team1Leading ? 'bg-lime-500/20 border border-lime-500/30' : 'bg-slate-700/50'}
            `}
          >
            <Trophy className={`w-5 h-5 ${team1Leading ? 'text-lime-400' : 'text-slate-500'}`} />
            <span className={`font-bold text-lg ${team1Leading ? 'text-lime-400' : 'text-white'}`}>
              {match.team1.name}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            {match.team1.wins}W - {match.team1.losses}L season
          </p>
        </div>

        {/* Score */}
        <div className="px-8">
          <div className="flex items-center gap-6">
            <span
              className={`
                text-6xl font-bold tabular-nums
                ${team1Leading ? 'text-lime-400' : tied ? 'text-white' : 'text-slate-400'}
              `}
            >
              {match.team1Score}
            </span>
            <span className="text-2xl text-slate-600">-</span>
            <span
              className={`
                text-6xl font-bold tabular-nums
                ${team2Leading ? 'text-lime-400' : tied ? 'text-white' : 'text-slate-400'}
              `}
            >
              {match.team2Score}
            </span>
          </div>
          <p className="text-center text-sm text-slate-500 mt-2">
            {match.status === 'in_progress' ? 'Match In Progress' : match.status === 'completed' ? 'Final' : 'Upcoming'}
          </p>
        </div>

        {/* Team 2 */}
        <div className="flex-1 text-center">
          <div
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-3
              ${team2Leading ? 'bg-lime-500/20 border border-lime-500/30' : 'bg-slate-700/50'}
            `}
          >
            <Trophy className={`w-5 h-5 ${team2Leading ? 'text-lime-400' : 'text-slate-500'}`} />
            <span className={`font-bold text-lg ${team2Leading ? 'text-lime-400' : 'text-white'}`}>
              {match.team2.name}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            {match.team2.wins}W - {match.team2.losses}L season
          </p>
        </div>
      </div>

      {/* Dreambreaker Alert */}
      {match.needsDreambreaker && (
        <div className="flex items-center justify-center gap-3 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl animate-pulse">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-amber-400">Dreambreaker Required!</span>
          <Zap className="w-5 h-5 text-amber-400" />
        </div>
      )}
    </div>
  )
}

interface GameCardProps {
  game: TeamGame
  team1Name: string
  team2Name: string
  onStartGame?: () => void
  onEnterScore?: () => void
}

function GameCard({ game, team1Name, team2Name, onStartGame, onEnterScore }: GameCardProps) {
  const isCompleted = game.status === 'completed'
  const isInProgress = game.status === 'in_progress'
  const isUpcoming = game.status === 'upcoming'

  return (
    <div
      className={`
        relative bg-slate-800/50 rounded-xl border p-4 transition-all
        ${isInProgress ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-700/50'}
        ${isCompleted ? 'opacity-80' : ''}
      `}
    >
      {/* Game Type Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">GAME {game.gameNumber}</span>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getGameStatusColor(game.status)}`}
          >
            {getGameTypeLabel(game.gameType)}
          </span>
        </div>
        {isCompleted && game.winner && (
          <CheckCircle2 className="w-5 h-5 text-lime-400" />
        )}
        {isInProgress && (
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {/* Players & Score */}
      <div className="space-y-2">
        {/* Team 1 Players */}
        <div
          className={`
            flex items-center justify-between p-2 rounded-lg
            ${game.winner === 'team1' ? 'bg-lime-500/10' : 'bg-slate-700/30'}
          `}
        >
          <div className="flex-1">
            <p className="text-xs text-slate-500 mb-0.5">{team1Name}</p>
            <p className="text-sm font-medium text-white truncate">
              {game.team1Players.map((p) => p.name.split(' ')[0]).join(' / ')}
            </p>
          </div>
          {(isInProgress || isCompleted) && game.score && (
            <span
              className={`
                text-2xl font-bold tabular-nums min-w-[2ch] text-right
                ${game.winner === 'team1' ? 'text-lime-400' : 'text-white'}
              `}
            >
              {game.score.team1}
            </span>
          )}
        </div>

        {/* Team 2 Players */}
        <div
          className={`
            flex items-center justify-between p-2 rounded-lg
            ${game.winner === 'team2' ? 'bg-lime-500/10' : 'bg-slate-700/30'}
          `}
        >
          <div className="flex-1">
            <p className="text-xs text-slate-500 mb-0.5">{team2Name}</p>
            <p className="text-sm font-medium text-white truncate">
              {game.team2Players.map((p) => p.name.split(' ')[0]).join(' / ')}
            </p>
          </div>
          {(isInProgress || isCompleted) && game.score && (
            <span
              className={`
                text-2xl font-bold tabular-nums min-w-[2ch] text-right
                ${game.winner === 'team2' ? 'text-lime-400' : 'text-white'}
              `}
            >
              {game.score.team2}
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      {isUpcoming && (
        <button
          onClick={onStartGame}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-lime-600 hover:bg-lime-500 text-white font-medium rounded-lg transition-colors"
        >
          <PlayCircle className="w-4 h-4" />
          Start Game
        </button>
      )}
      {isInProgress && (
        <button
          onClick={onEnterScore}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors"
        >
          <Target className="w-4 h-4" />
          Enter Final Score
        </button>
      )}

      {/* Time Info */}
      {(isInProgress || isCompleted) && (
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
          {game.courtId && <span>Court {game.courtId.replace('court-', '')}</span>}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {isCompleted ? formatTime(game.completedAt) : formatTime(game.startedAt)}
          </span>
        </div>
      )}

      {/* Dreambreaker Indicator */}
      {game.gameType === 'dreambreaker' && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-slate-900 text-xs font-bold rounded-full flex items-center gap-1">
          <Zap className="w-3 h-3" />
          TIEBREAKER
        </div>
      )}
    </div>
  )
}

interface StandingsTableProps {
  standings: TeamStanding[]
  currentMatchTeams: [string, string]
  onViewTeam?: (teamId: string) => void
}

function StandingsTable({ standings, currentMatchTeams, onViewTeam }: StandingsTableProps) {
  return (
    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/50">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Medal className="w-4 h-4 text-amber-400" />
          Competition Standings
        </h3>
      </div>
      <div className="divide-y divide-slate-700/50">
        {standings.map((standing) => {
          const isPlaying = currentMatchTeams.includes(standing.team.id)
          return (
            <button
              key={standing.team.id}
              onClick={() => onViewTeam?.(standing.team.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-700/30 transition-colors text-left
                ${isPlaying ? 'bg-lime-500/5' : ''}
              `}
            >
              {/* Rank */}
              <span
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-bold
                  ${standing.rank === 1 ? 'bg-amber-500/20 text-amber-400' : ''}
                  ${standing.rank === 2 ? 'bg-slate-400/20 text-slate-300' : ''}
                  ${standing.rank === 3 ? 'bg-orange-500/20 text-orange-400' : ''}
                  ${standing.rank > 3 ? 'bg-slate-700/50 text-slate-400' : ''}
                `}
              >
                {standing.rank}
              </span>

              {/* Team Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white truncate">{standing.team.name}</p>
                  {isPlaying && (
                    <span className="px-1.5 py-0.5 bg-lime-500/20 text-lime-400 text-xs font-medium rounded">
                      Playing
                    </span>
                  )}
                </div>
              </div>

              {/* Record */}
              <div className="text-right">
                <p className="font-semibold text-white">
                  {standing.matchWins}-{standing.matchLosses}
                </p>
                <p className="text-xs text-slate-500">
                  {standing.gamesWon}-{standing.gamesLost} games
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface TeamRosterProps {
  team: CompetitionTeam
  isHome: boolean
}

function TeamRoster({ team, isHome }: TeamRosterProps) {
  const menPlayers = team.players.filter((p) => p.gender === 'male')
  const womenPlayers = team.players.filter((p) => p.gender === 'female')

  return (
    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white">{team.name}</h4>
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${isHome ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {isHome ? 'Home' : 'Away'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {menPlayers.map((player) => (
          <div key={player.id} className="flex items-center gap-2 p-2 bg-sky-500/10 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-400">
              M
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{player.name}</p>
              <p className="text-xs text-slate-500">{player.skillRating.toFixed(1)}</p>
            </div>
          </div>
        ))}
        {womenPlayers.map((player) => (
          <div key={player.id} className="flex items-center gap-2 p-2 bg-rose-500/10 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-rose-500/30 flex items-center justify-center text-xs font-bold text-rose-400">
              W
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{player.name}</p>
              <p className="text-xs text-slate-500">{player.skillRating.toFixed(1)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function TeamMatchDashboard({
  event,
  config,
  currentMatch,
  upcomingMatches,
  completedMatches,
  standings,
  courts,
  onStartMatch,
  onSetLineup,
  onStartGame,
  onEnterGameScore,
  onTriggerDreambreaker,
  onCompleteMatch,
  onSubstitutePlayer,
  onViewTeam,
  onViewMatch,
}: TeamCompetitionDashboardProps) {
  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-semibold text-white mb-2">No Active Match</h2>
          <p className="text-slate-400">Select a match to view or start</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{event.name}</h1>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
                TEAM MATCH
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{event.venue.name}</span>
              <span className="text-slate-600">•</span>
              <span>MiLP Format ({config.gamesPerMatch} Games)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-red-400 font-semibold text-sm">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Match Score Header */}
        <MatchScoreHeader match={currentMatch} />

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column: Games */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Progress */}
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Match Games</h2>
                <div className="flex items-center gap-2">
                  {config.gameSequence.map((type, idx) => (
                    <span
                      key={type}
                      className={`
                        px-2 py-1 text-xs font-medium rounded
                        ${currentMatch.games[idx]?.status === 'completed' ? 'bg-lime-500/20 text-lime-400' : ''}
                        ${currentMatch.games[idx]?.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' : ''}
                        ${currentMatch.games[idx]?.status === 'upcoming' ? 'bg-slate-700/50 text-slate-400' : ''}
                      `}
                    >
                      {getGameTypeShort(type)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentMatch.games.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    team1Name={currentMatch.team1.name}
                    team2Name={currentMatch.team2.name}
                    onStartGame={() => onStartGame?.(currentMatch.id, game.id, courts[0]?.id || '')}
                    onEnterScore={() => onEnterGameScore?.(currentMatch.id, game.id, 0, 0)}
                  />
                ))}
              </div>

              {/* Dreambreaker Button */}
              {currentMatch.needsDreambreaker && !currentMatch.games.some((g) => g.gameType === 'dreambreaker') && (
                <button
                  onClick={() => onTriggerDreambreaker?.(currentMatch.id)}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  Start Dreambreaker
                </button>
              )}
            </div>

            {/* Team Rosters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TeamRoster team={currentMatch.team1} isHome={true} />
              <TeamRoster team={currentMatch.team2} isHome={false} />
            </div>
          </div>

          {/* Right Column: Standings & Actions */}
          <div className="space-y-6">
            {/* Standings */}
            <StandingsTable
              standings={standings}
              currentMatchTeams={[currentMatch.team1.id, currentMatch.team2.id]}
              onViewTeam={onViewTeam}
            />

            {/* Match Info */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
              <h3 className="font-semibold text-white mb-3">Match Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Format</span>
                  <span className="text-white">Best of {config.gamesPerMatch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tiebreaker</span>
                  <span className="text-white capitalize">{config.tiebreakerFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scoring</span>
                  <span className="text-white">Rally to 21</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Started</span>
                  <span className="text-white">{formatTime(currentMatch.startedAt)}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Matches */}
            {upcomingMatches.length > 0 && (
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                <h3 className="font-semibold text-white mb-3">Up Next</h3>
                <div className="space-y-2">
                  {upcomingMatches.slice(0, 2).map((match) => (
                    <button
                      key={match.id}
                      onClick={() => onViewMatch?.(match.id)}
                      className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {match.team1.name} vs {match.team2.name}
                        </p>
                        <p className="text-xs text-slate-500">{formatTime(match.scheduledTime)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
