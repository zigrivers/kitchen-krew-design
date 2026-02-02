import {
  Trophy,
  Medal,
  Crown,
  Share2,
  GitBranch,
  Zap,
  Target,
  TrendingUp,
  Star,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import type {
  TournamentResults as TournamentResultsType,
  TournamentResultsProps,
  PodiumPlacement,
  BracketMatch,
  TournamentStats,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Helper Functions
// =============================================================================

function formatMatchScore(match: BracketMatch): string {
  if (match.scores.length === 0) return 'N/A'
  if (match.scores.length === 1) {
    return `${match.scores[0].team1}-${match.scores[0].team2}`
  }
  // Multi-game match
  const team1Wins = match.scores.filter(s => s.team1 > s.team2).length
  const team2Wins = match.scores.filter(s => s.team2 > s.team1).length
  return `${team1Wins}-${team2Wins}`
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

// =============================================================================
// Sub-Components
// =============================================================================

interface PodiumCardProps {
  placement: PodiumPlacement
  isChampion?: boolean
  onViewPlayer?: () => void
}

function PodiumCard({ placement, isChampion, onViewPlayer }: PodiumCardProps) {
  const placeConfig = {
    1: {
      bg: 'from-amber-400 via-yellow-300 to-amber-500',
      border: 'border-amber-400',
      shadow: 'shadow-[0_0_60px_rgba(251,191,36,0.4)]',
      icon: Crown,
      label: 'Champion',
      height: 'h-48',
      textColor: 'text-amber-900',
    },
    2: {
      bg: 'from-slate-300 via-gray-200 to-slate-400',
      border: 'border-slate-300',
      shadow: 'shadow-[0_0_40px_rgba(148,163,184,0.3)]',
      icon: Medal,
      label: 'Runner-up',
      height: 'h-40',
      textColor: 'text-slate-800',
    },
    3: {
      bg: 'from-orange-400 via-amber-600 to-orange-500',
      border: 'border-orange-400',
      shadow: 'shadow-[0_0_30px_rgba(251,146,60,0.3)]',
      icon: Medal,
      label: 'Third Place',
      height: 'h-32',
      textColor: 'text-orange-900',
    },
  }

  const config = placeConfig[placement.place]
  const Icon = config.icon

  return (
    <div
      className={`
        relative flex flex-col items-center cursor-pointer group
        ${placement.place === 1 ? 'order-2 -mt-8' : placement.place === 2 ? 'order-1' : 'order-3'}
      `}
      onClick={onViewPlayer}
    >
      {/* Trophy/Medal Icon */}
      <div className={`
        relative z-10 mb-4
        ${isChampion ? 'animate-bounce' : ''}
      `}>
        {placement.place === 1 ? (
          <div className="relative">
            <Trophy className="w-16 h-16 text-amber-400 drop-shadow-lg" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
        ) : (
          <Icon className={`w-12 h-12 ${placement.place === 2 ? 'text-slate-400' : 'text-orange-400'}`} />
        )}
      </div>

      {/* Podium Platform */}
      <div className={`
        relative w-full max-w-[180px] ${config.height} rounded-t-2xl
        bg-gradient-to-b ${config.bg}
        border-t-4 ${config.border}
        ${config.shadow}
        transition-transform group-hover:scale-105
      `}>
        {/* Place Number */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className={`
            w-12 h-12 rounded-full bg-gradient-to-b ${config.bg}
            flex items-center justify-center
            text-2xl font-bold ${config.textColor}
            border-2 ${config.border}
          `}>
            {placement.place}
          </div>
        </div>

        {/* Team Info */}
        <div className="absolute inset-x-4 top-8 text-center">
          <p className={`font-bold text-lg ${config.textColor} leading-tight`}>
            {placement.displayName}
          </p>
          <p className={`text-sm ${config.textColor} opacity-75 mt-1`}>
            Seed #{placement.seed}
          </p>
        </div>

        {/* Players */}
        <div className="absolute inset-x-4 bottom-4">
          <div className={`text-xs ${config.textColor} opacity-60 text-center space-y-0.5`}>
            {placement.players.map(player => (
              <p key={player.id}>{player.name}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="mt-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">
        {config.label}
      </p>
    </div>
  )
}

interface ChampionPathProps {
  championPath: string[]
  bracketMatches: BracketMatch[]
  championTeam: PodiumPlacement
}

function ChampionPath({ championPath, bracketMatches, championTeam }: ChampionPathProps) {
  // Get matches in the champion's path
  const pathMatches = championPath
    .map(matchId => bracketMatches.find(m => m.id === matchId))
    .filter((m): m is BracketMatch => m !== undefined)

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-lime-400" />
        Champion's Path
      </h3>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-lime-500 via-lime-400 to-amber-400" />

        <div className="space-y-4">
          {pathMatches.map((match, index) => {
            const isChampionTeam1 = match.team1?.teamId === championTeam.teamId
            const opponent = isChampionTeam1 ? match.team2 : match.team1
            const won = (isChampionTeam1 && match.winner === 'team1') ||
                       (!isChampionTeam1 && match.winner === 'team2')

            return (
              <div key={match.id} className="flex items-center gap-4 pl-3">
                {/* Node */}
                <div className={`
                  relative z-10 w-6 h-6 rounded-full flex items-center justify-center
                  ${index === pathMatches.length - 1
                    ? 'bg-amber-400 text-amber-900'
                    : 'bg-lime-500 text-lime-900'}
                `}>
                  {index === pathMatches.length - 1 ? (
                    <Trophy className="w-3 h-3" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Match Info */}
                <div className="flex-1 bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                        {match.roundLabel}
                      </p>
                      <p className="text-white font-medium">
                        vs {opponent?.displayName ?? 'TBD'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-semibold
                        ${won ? 'bg-lime-500/20 text-lime-400' : 'bg-red-500/20 text-red-400'}
                      `}>
                        {formatMatchScore(match)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface TournamentStatsCardProps {
  stats: TournamentStats
}

function TournamentStatsCard({ stats }: TournamentStatsCardProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-sky-400" />
        Tournament Highlights
      </h3>

      <div className="space-y-4">
        {/* Total Matches */}
        <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
            <Target className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Matches</p>
            <p className="text-xl font-bold text-white">{stats.totalMatches}</p>
          </div>
        </div>

        {/* Closest Match */}
        <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-400">Closest Match</p>
            <p className="text-white font-medium">{stats.closestMatch.teams}</p>
            <p className="text-xs text-amber-400">Won by {stats.closestMatch.margin} point{stats.closestMatch.margin !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Biggest Upset */}
        {stats.biggestUpset && (
          <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-400">Biggest Upset</p>
              <p className="text-white font-medium">{stats.biggestUpset.winner}</p>
              <p className="text-xs text-red-400">
                Defeated {stats.biggestUpset.loser} ({stats.biggestUpset.seedDiff} seed difference)
              </p>
            </div>
          </div>
        )}

        {/* Highest Scoring */}
        <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-lime-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-lime-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-400">Highest Scoring</p>
            <p className="text-white font-medium">{stats.highestScoringMatch.teams}</p>
            <p className="text-xs text-lime-400">{stats.highestScoringMatch.totalPoints} total points</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function TournamentResults({
  results,
  onViewBracket,
  onShareResults,
  onViewPlayer,
}: TournamentResultsProps) {
  const { podium, stats, championPath, bracket, bracketMatches } = results

  // Sort podium by place
  const sortedPodium = [...podium].sort((a, b) => a.place - b.place)
  const champion = sortedPodium[0]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Celebration Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-b border-slate-800/50">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 px-6 py-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500/20 border border-lime-500/30 rounded-full mb-4">
            <Trophy className="w-4 h-4 text-lime-400" />
            <span className="text-sm font-semibold text-lime-400">Tournament Complete</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Congratulations!
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            The tournament has concluded. Here are the final standings and highlights.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {onViewBracket && (
              <button
                onClick={onViewBracket}
                className="px-5 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <GitBranch className="w-4 h-4" />
                View Bracket
              </button>
            )}
            {onShareResults && (
              <button
                onClick={onShareResults}
                className="px-5 py-2.5 bg-lime-500 text-slate-900 rounded-lg font-medium hover:bg-lime-400 transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Results
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Podium Section */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Podium Display */}
          <div className="flex items-end justify-center gap-4 sm:gap-8 mb-12">
            {sortedPodium.map(placement => (
              <PodiumCard
                key={placement.place}
                placement={placement}
                isChampion={placement.place === 1}
                onViewPlayer={() => onViewPlayer?.(placement.teamId)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats and Champion's Path */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-2">
          {/* Champion's Path */}
          {champion && championPath.length > 0 && (
            <ChampionPath
              championPath={championPath}
              bracketMatches={bracketMatches}
              championTeam={champion}
            />
          )}

          {/* Tournament Stats */}
          <TournamentStatsCard stats={stats} />
        </div>
      </div>

      {/* Full Standings (expandable) */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
            <button
              onClick={onViewBracket}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-slate-400" />
                <span className="font-semibold text-white">View Full Bracket & All Results</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
