import { useState } from 'react'
import {
  Trophy,
  Share2,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Calendar,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Award,
} from 'lucide-react'
import { BracketMatchCard } from './BracketMatchCard'
import type {
  Bracket,
  BracketMatch,
  BracketRound,
  Tournament,
  EventProgress,
  BracketViewProps,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

function RoundHeader({
  round,
  isActive,
}: {
  round: BracketRound
  isActive: boolean
}) {
  const statusColors = {
    upcoming: 'bg-slate-700 text-slate-400',
    in_progress: 'bg-sky-500/20 text-sky-400',
    completed: 'bg-lime-500/20 text-lime-400',
  }

  return (
    <div className="text-center mb-4">
      <h3 className="text-lg font-bold text-white mb-1">{round.label}</h3>
      <div className="flex items-center justify-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[round.status]}`}>
          {round.status === 'in_progress' && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 mr-1 animate-pulse" />
          )}
          {round.status === 'completed' ? 'Complete' : round.status === 'in_progress' ? 'In Progress' : 'Upcoming'}
        </span>
        {round.matchFormat.gamesPerMatch > 1 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
            {round.matchFormat.label}
          </span>
        )}
      </div>
    </div>
  )
}

function ConnectorLine({
  type,
  fromTop,
}: {
  type: 'horizontal' | 'vertical-down' | 'vertical-up' | 'merge'
  fromTop?: boolean
}) {
  if (type === 'horizontal') {
    return <div className="w-8 h-0.5 bg-slate-600" />
  }
  if (type === 'vertical-down') {
    return (
      <div className="relative w-8 h-full">
        <div className="absolute left-0 top-1/2 w-4 h-0.5 bg-slate-600" />
        <div className="absolute left-4 top-1/2 bottom-0 w-0.5 bg-slate-600" />
      </div>
    )
  }
  if (type === 'vertical-up') {
    return (
      <div className="relative w-8 h-full">
        <div className="absolute left-0 top-1/2 w-4 h-0.5 bg-slate-600" />
        <div className="absolute left-4 top-0 bottom-1/2 w-0.5 bg-slate-600" />
      </div>
    )
  }
  if (type === 'merge') {
    return (
      <div className="relative w-8 h-full">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-600" style={{ left: '-1px' }} />
        <div className="absolute left-0 top-1/2 w-4 h-0.5 bg-slate-600" />
      </div>
    )
  }
  return null
}

function BracketColumn({
  round,
  matches,
  currentUserId,
  isGameManager,
  roundIndex,
  totalRounds,
  onViewMatch,
  onStartMatch,
  onEnterScore,
}: {
  round: BracketRound
  matches: BracketMatch[]
  currentUserId?: string
  isGameManager: boolean
  roundIndex: number
  totalRounds: number
  onViewMatch?: (bracketMatchId: string) => void
  onStartMatch?: (bracketMatchId: string) => void
  onEnterScore?: (bracketMatchId: string) => void
}) {
  // Calculate spacing based on round (matches get more spread out in later rounds)
  const spacingMultiplier = Math.pow(2, roundIndex)
  const baseGap = 16

  // Check if user is in any match
  const isUserInMatch = (match: BracketMatch) => {
    if (!currentUserId) return false
    const team1Players = match.team1?.players || []
    const team2Players = match.team2?.players || []
    return [...team1Players, ...team2Players].some((p) => p.id === currentUserId)
  }

  return (
    <div className="flex flex-col items-center">
      <RoundHeader round={round} isActive={round.status === 'in_progress'} />
      <div
        className="flex flex-col justify-around"
        style={{
          gap: `${baseGap * spacingMultiplier}px`,
          minHeight: `${matches.length * 100 * spacingMultiplier}px`,
        }}
      >
        {matches.map((match) => (
          <div key={match.id} className="flex items-center">
            <BracketMatchCard
              bracketMatch={match}
              isCurrentUserMatch={isUserInMatch(match)}
              isGameManager={isGameManager}
              onViewMatch={onViewMatch ? () => onViewMatch(match.id) : undefined}
              onStartMatch={
                isGameManager && match.status === 'upcoming' && onStartMatch
                  ? () => onStartMatch(match.id)
                  : undefined
              }
              onEnterScore={
                isGameManager && match.status === 'in_progress' && onEnterScore
                  ? () => onEnterScore(match.id)
                  : undefined
              }
            />
            {/* Connector to next round */}
            {roundIndex < totalRounds - 1 && <div className="w-8 h-0.5 bg-slate-600 ml-2" />}
          </div>
        ))}
      </div>
    </div>
  )
}

function TournamentHeader({
  tournament,
  progress,
  onShareBracket,
}: {
  tournament?: Tournament
  progress: EventProgress
  onShareBracket?: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-lime-500/20">
            <Trophy className="w-5 h-5 text-lime-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Tournament Bracket</h2>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400 ml-12">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {tournament?.bracketSize || 8} Teams
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Round {progress.currentRound} of {progress.totalRounds}
          </span>
          <span>
            {progress.completedMatches} of {progress.totalMatches} matches complete
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {tournament?.isPublic && onShareBracket && (
          <button
            onClick={onShareBracket}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        )}
      </div>
    </div>
  )
}

function ChampionDisplay({
  winnerMatch,
}: {
  winnerMatch: BracketMatch | null
}) {
  if (!winnerMatch || winnerMatch.status !== 'completed' || !winnerMatch.winner) {
    return null
  }

  const champion = winnerMatch.winner === 'team1' ? winnerMatch.team1 : winnerMatch.team2

  if (!champion) return null

  return (
    <div className="flex flex-col items-center justify-center ml-8">
      <div className="relative">
        {/* Trophy glow effect */}
        <div className="absolute inset-0 blur-2xl bg-lime-500/30 rounded-full" />

        <div className="relative bg-gradient-to-br from-lime-500 to-lime-600 rounded-2xl p-6 text-center shadow-2xl shadow-lime-500/20">
          <Trophy className="w-12 h-12 text-lime-900 mx-auto mb-3" />
          <p className="text-xs font-medium text-lime-900/70 uppercase tracking-wider mb-1">Champion</p>
          <p className="text-lg font-bold text-white">
            {champion.displayName.replace(/^\(\d+\)\s*/, '')}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {champion.players.map((p, idx) => (
              <span key={p.id} className="text-xs text-lime-100">
                {p.name}
                {idx < champion.players.length - 1 && ' & '}
              </span>
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

export function BracketView({
  bracket,
  bracketMatches,
  currentUserId,
  isGameManager,
  eventProgress,
  tournament,
  onViewMatch,
  onStartMatch,
  onEnterScore,
  onShareBracket,
}: BracketViewProps & {
  eventProgress: EventProgress
  tournament?: Tournament
  onShareBracket?: () => void
}) {
  const [zoomLevel, setZoomLevel] = useState(1)

  // Group matches by round
  const matchesByRound = bracket.rounds.map((round) =>
    bracketMatches
      .filter((m) => m.roundNumber === round.roundNumber)
      .sort((a, b) => a.position - b.position)
  )

  // Find the finals match
  const finalsMatch = bracketMatches.find(
    (m) => m.roundLabel === 'Finals' || m.roundNumber === bracket.rounds.length
  )

  // Handle zoom
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.5))
  const handleResetZoom = () => setZoomLevel(1)

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <TournamentHeader
          tournament={tournament}
          progress={eventProgress}
          onShareBracket={onShareBracket}
        />
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-end gap-2 px-6 py-2 border-b border-slate-700/50 bg-slate-900/50">
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel <= 0.5}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="px-2 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel >= 2}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Bracket Container */}
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '70vh' }}>
        <div
          className="p-8 flex items-start gap-4 transition-transform"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left',
            minWidth: 'max-content',
          }}
        >
          {/* Render each round */}
          {bracket.rounds.map((round, idx) => (
            <BracketColumn
              key={round.roundNumber}
              round={round}
              matches={matchesByRound[idx]}
              currentUserId={currentUserId}
              isGameManager={isGameManager}
              roundIndex={idx}
              totalRounds={bracket.rounds.length}
              onViewMatch={onViewMatch}
              onStartMatch={onStartMatch}
              onEnterScore={onEnterScore}
            />
          ))}

          {/* Champion Display */}
          {finalsMatch?.status === 'completed' && <ChampionDisplay winnerMatch={finalsMatch} />}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 px-6 py-3 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs text-slate-400">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-lime-400" />
          <span className="text-xs text-slate-400">Winner</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs text-slate-400">Calling</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-500" />
          <span className="text-xs text-slate-400">Upcoming</span>
        </div>
      </div>
    </div>
  )
}
