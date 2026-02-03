import { useState, useRef, useEffect } from 'react'
import {
  Trophy,
  Share2,
  Users,
  Clock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  AlertCircle,
  Minus,
  MapPin,
  Layers,
} from 'lucide-react'
import type {
  Bracket,
  BracketMatch,
  BracketRound,
  BracketTeam,
  GameScore,
  EventProgress,
  LargeBracketViewProps,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Compact Match Card (Optimized for 32-team density)
// =============================================================================

interface CompactMatchCardProps {
  match: BracketMatch
  isHighlighted: boolean
  isGameManager: boolean
  onClick?: () => void
}

function CompactMatchCard({ match, isHighlighted, isGameManager, onClick }: CompactMatchCardProps) {
  const { status, team1, team2, scores, winner, courtId } = match

  const statusStyles = {
    upcoming: { bg: 'bg-slate-800/80', border: 'border-slate-600/50', glow: '' },
    calling: { bg: 'bg-amber-950/60', border: 'border-amber-500/40', glow: 'shadow-amber-500/10' },
    in_progress: { bg: 'bg-sky-950/60', border: 'border-sky-400/40', glow: 'shadow-sky-500/20' },
    completed: { bg: 'bg-slate-800/60', border: 'border-slate-600/30', glow: '' },
    bye: { bg: 'bg-slate-900/40', border: 'border-slate-700/20', glow: '' },
    forfeit: { bg: 'bg-red-950/40', border: 'border-red-600/30', glow: '' },
  }

  const style = statusStyles[status]

  const renderTeamSlot = (team: BracketTeam | null, isWinner: boolean, position: 'top' | 'bottom') => {
    if (!team) {
      return (
        <div className={`flex items-center justify-between px-2 py-1.5 ${position === 'top' ? 'border-b border-slate-700/30' : ''}`}>
          <span className="text-xs text-slate-500 italic">TBD</span>
          <span className="text-xs text-slate-600">-</span>
        </div>
      )
    }

    // Calculate total score for display
    const teamScores = scores.map(s => position === 'top' ? s.team1 : s.team2)
    const displayScore = scores.length === 1
      ? teamScores[0]
      : teamScores.filter((s, i) => s > (position === 'top' ? scores[i].team2 : scores[i].team1)).length

    return (
      <div
        className={`flex items-center justify-between px-2 py-1.5 transition-colors ${
          position === 'top' ? 'border-b border-slate-700/30' : ''
        } ${
          isWinner ? 'bg-lime-500/10' : isHighlighted && team ? 'bg-sky-500/10' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              isWinner
                ? 'bg-lime-500 text-slate-900'
                : isHighlighted
                ? 'bg-sky-500 text-white'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {team.seed}
          </span>
          <span
            className={`text-xs font-medium truncate ${
              isWinner ? 'text-lime-400' : isHighlighted ? 'text-sky-300' : 'text-slate-200'
            }`}
          >
            {team.displayName.replace(/^\(\d+\)\s*/, '')}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {scores.length > 0 ? (
            scores.length === 1 ? (
              <span
                className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded ${
                  isWinner ? 'bg-lime-500/20 text-lime-400' : 'text-slate-400'
                }`}
              >
                {teamScores[0]}
              </span>
            ) : (
              <>
                {scores.map((s, i) => {
                  const ts = position === 'top' ? s.team1 : s.team2
                  const os = position === 'top' ? s.team2 : s.team1
                  return (
                    <span
                      key={i}
                      className={`w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded ${
                        ts > os ? 'bg-lime-500/20 text-lime-400' : 'text-slate-500'
                      }`}
                    >
                      {ts}
                    </span>
                  )
                })}
              </>
            )
          ) : (
            <span className="text-xs text-slate-600">-</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg border overflow-hidden transition-all cursor-pointer
        ${style.bg} ${style.border} ${style.glow}
        hover:border-lime-500/50 hover:shadow-lg hover:shadow-lime-500/10
        ${isHighlighted ? 'ring-1 ring-sky-500/50' : ''}
      `}
      style={{ width: '180px' }}
    >
      {/* Mini Status Bar */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-slate-700/30 bg-slate-900/60">
        <div className="flex items-center gap-1">
          {status === 'in_progress' && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          )}
          {status === 'calling' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          )}
          {status === 'completed' && winner && (
            <CheckCircle2 className="w-3 h-3 text-lime-400" />
          )}
          {status === 'upcoming' && (
            <Clock className="w-3 h-3 text-slate-500" />
          )}
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            {status === 'in_progress' ? 'Live' : status === 'completed' ? 'Final' : status}
          </span>
        </div>
        {courtId && (status === 'in_progress' || status === 'calling') && (
          <span className="text-[10px] text-slate-500">Ct {courtId.replace('court-', '')}</span>
        )}
      </div>

      {/* Teams */}
      {renderTeamSlot(team1, winner === 'team1', 'top')}
      {renderTeamSlot(team2, winner === 'team2', 'bottom')}
    </div>
  )
}

// =============================================================================
// Round Navigation Pills
// =============================================================================

interface RoundNavProps {
  rounds: BracketRound[]
  activeRound: number
  onRoundChange: (roundNumber: number) => void
  matchCounts: { [roundNumber: number]: { total: number; completed: number; inProgress: number } }
}

function RoundNav({ rounds, activeRound, onRoundChange, matchCounts }: RoundNavProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
      {rounds.map((round) => {
        const counts = matchCounts[round.roundNumber] || { total: 0, completed: 0, inProgress: 0 }
        const isActive = activeRound === round.roundNumber
        const hasLiveMatches = counts.inProgress > 0

        return (
          <button
            key={round.roundNumber}
            onClick={() => onRoundChange(round.roundNumber)}
            className={`
              relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${isActive
                ? 'bg-lime-500 text-slate-900 shadow-lg shadow-lime-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }
            `}
          >
            {hasLiveMatches && !isActive && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            )}
            <span className="hidden sm:inline">{round.label}</span>
            <span className="sm:hidden">R{round.roundNumber}</span>
            {round.status === 'completed' && !isActive && (
              <CheckCircle2 className="w-3 h-3 text-lime-400" />
            )}
          </button>
        )
      })}
    </div>
  )
}

// =============================================================================
// Bracket Column (Single Round)
// =============================================================================

interface BracketColumnProps {
  round: BracketRound
  matches: BracketMatch[]
  roundIndex: number
  totalRounds: number
  highlightedTeamId?: string
  isGameManager: boolean
  onMatchClick?: (matchId: string) => void
}

function BracketColumn({
  round,
  matches,
  roundIndex,
  totalRounds,
  highlightedTeamId,
  isGameManager,
  onMatchClick,
}: BracketColumnProps) {
  // Calculate vertical spacing - doubles each round to maintain bracket structure
  const spacingMultiplier = Math.pow(2, roundIndex)
  const baseGap = 8 // Tighter base gap for 32-team
  const matchHeight = 72 // Approx height of compact card

  const isTeamHighlighted = (match: BracketMatch) => {
    if (!highlightedTeamId) return false
    return match.team1?.teamId === highlightedTeamId || match.team2?.teamId === highlightedTeamId
  }

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      {/* Round Header */}
      <div className="text-center mb-3 sticky top-0 z-10 bg-gradient-to-b from-slate-900 via-slate-900/95 to-transparent pb-2 px-4">
        <h3 className="text-sm font-bold text-white mb-1">{round.label}</h3>
        <div className="flex items-center justify-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              round.status === 'completed'
                ? 'bg-lime-500/20 text-lime-400'
                : round.status === 'in_progress'
                ? 'bg-sky-500/20 text-sky-400'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            {round.status === 'completed' ? '✓ Complete' : round.status === 'in_progress' ? '● Live' : 'Upcoming'}
          </span>
          {round.matchFormat.gamesPerMatch > 1 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-700/50 text-slate-400">
              {round.matchFormat.label}
            </span>
          )}
        </div>
      </div>

      {/* Matches */}
      <div
        className="flex flex-col justify-around relative"
        style={{
          gap: `${baseGap * spacingMultiplier}px`,
          minHeight: `${matches.length * matchHeight * spacingMultiplier}px`,
        }}
      >
        {matches.map((match, idx) => (
          <div key={match.id} className="flex items-center">
            <CompactMatchCard
              match={match}
              isHighlighted={isTeamHighlighted(match)}
              isGameManager={isGameManager}
              onClick={() => onMatchClick?.(match.id)}
            />
            {/* Connector line to next round */}
            {roundIndex < totalRounds - 1 && (
              <div className="w-6 h-px bg-slate-600/50 ml-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// Progress Stats Bar
// =============================================================================

interface ProgressStatsProps {
  progress: EventProgress
  tournamentName: string
  bracketSize: number
}

function ProgressStats({ progress, tournamentName, bracketSize }: ProgressStatsProps) {
  const completionPercent = Math.round((progress.completedMatches / progress.totalMatches) * 100)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-lime-500 to-lime-600 shadow-lg shadow-lime-500/20">
            <Trophy className="w-4 h-4 text-slate-900" />
          </div>
          {tournamentName}
        </h2>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {bracketSize} Teams
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            {progress.currentRoundLabel || `Round ${progress.currentRound}`}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            ~{progress.estimatedRemainingMinutes}m remaining
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-lime-400">{completionPercent}%</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Complete</span>
        </div>
        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lime-500 to-lime-400 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Champion Celebration (Finals Winner)
// =============================================================================

interface ChampionCelebrationProps {
  match: BracketMatch
}

function ChampionCelebration({ match }: ChampionCelebrationProps) {
  if (match.status !== 'completed' || !match.winner) return null

  const champion = match.winner === 'team1' ? match.team1 : match.team2
  if (!champion) return null

  return (
    <div className="flex flex-col items-center justify-center ml-4 flex-shrink-0">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-3xl bg-lime-500/20 rounded-full scale-150" />

        {/* Trophy card */}
        <div className="relative bg-gradient-to-br from-lime-400 via-lime-500 to-lime-600 rounded-2xl p-5 text-center shadow-2xl shadow-lime-500/30 border border-lime-400/30">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)] rounded-2xl" />

          <Trophy className="w-10 h-10 text-lime-900/80 mx-auto mb-2 drop-shadow-lg" />
          <p className="text-[10px] font-bold text-lime-900/60 uppercase tracking-widest mb-1">Champion</p>
          <p className="text-base font-bold text-white drop-shadow-md">
            {champion.displayName.replace(/^\(\d+\)\s*/, '')}
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {champion.players.map((p, idx) => (
              <span key={p.id} className="text-[10px] text-lime-100/80">
                {p.name}{idx < champion.players.length - 1 ? ' &' : ''}
              </span>
            ))}
          </div>
          <div className="mt-2 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium text-lime-900/70">
            Seed #{champion.seed}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function LargeBracketView({
  bracket,
  bracketMatches,
  currentUserId,
  isGameManager,
  tournamentName,
  eventProgress,
  shareableLink,
  onViewMatch,
  onStartMatch,
  onEnterScore,
  onShareBracket,
  onZoomChange,
}: LargeBracketViewProps) {
  const [zoomLevel, setZoomLevel] = useState(0.85) // Start slightly zoomed out for 32-team
  const [activeRound, setActiveRound] = useState(eventProgress.currentRound)
  const [highlightedTeamId, setHighlightedTeamId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Group matches by round
  const matchesByRound = bracket.rounds.map((round) =>
    bracketMatches
      .filter((m) => m.roundNumber === round.roundNumber)
      .sort((a, b) => a.position - b.position)
  )

  // Calculate match counts per round
  const matchCounts = bracket.rounds.reduce((acc, round) => {
    const roundMatches = bracketMatches.filter((m) => m.roundNumber === round.roundNumber)
    acc[round.roundNumber] = {
      total: roundMatches.length,
      completed: roundMatches.filter((m) => m.status === 'completed').length,
      inProgress: roundMatches.filter((m) => m.status === 'in_progress').length,
    }
    return acc
  }, {} as { [key: number]: { total: number; completed: number; inProgress: number } })

  // Find finals match for champion display
  const finalsMatch = bracketMatches.find(
    (m) => m.roundLabel === 'Finals' || m.roundNumber === bracket.rounds.length
  )

  // Get current user's team ID for highlighting
  const currentUserTeamId = currentUserId
    ? bracketMatches.find((m) =>
        m.team1?.players.some((p) => p.id === currentUserId) ||
        m.team2?.players.some((p) => p.id === currentUserId)
      )?.team1?.players.some((p) => p.id === currentUserId)
        ? bracketMatches.find((m) => m.team1?.players.some((p) => p.id === currentUserId))?.team1?.teamId
        : bracketMatches.find((m) => m.team2?.players.some((p) => p.id === currentUserId))?.team2?.teamId
    : undefined

  // Zoom handlers
  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.15, 1.5)
    setZoomLevel(newZoom)
    onZoomChange?.(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.15, 0.5)
    setZoomLevel(newZoom)
    onZoomChange?.(newZoom)
  }

  const handleResetZoom = () => {
    setZoomLevel(0.85)
    onZoomChange?.(0.85)
  }

  // Scroll to active round
  const scrollToRound = (roundNumber: number) => {
    setActiveRound(roundNumber)
    // Could implement smooth scroll to round column here
  }

  // Handle match click
  const handleMatchClick = (matchId: string) => {
    const match = bracketMatches.find((m) => m.id === matchId)
    if (!match) return

    if (isGameManager) {
      if (match.status === 'upcoming' && match.team1 && match.team2) {
        onStartMatch?.(matchId)
      } else if (match.status === 'in_progress') {
        onEnterScore?.(matchId)
      } else {
        onViewMatch?.(matchId)
      }
    } else {
      onViewMatch?.(matchId)
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <ProgressStats
          progress={eventProgress}
          tournamentName={tournamentName}
          bracketSize={Math.pow(2, bracket.rounds.length)}
        />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-slate-700/30 bg-slate-900/50">
        {/* Round Navigation */}
        <RoundNav
          rounds={bracket.rounds}
          activeRound={activeRound}
          onRoundChange={scrollToRound}
          matchCounts={matchCounts}
        />

        {/* Zoom & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              title="Reset zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 1.5}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {shareableLink && (
            <button
              onClick={onShareBracket}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Bracket Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-auto"
        style={{ maxHeight: '65vh' }}
      >
        <div
          className="p-6 flex items-start gap-2 transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left',
            minWidth: 'max-content',
          }}
        >
          {/* Render all rounds */}
          {bracket.rounds.map((round, idx) => (
            <BracketColumn
              key={round.roundNumber}
              round={round}
              matches={matchesByRound[idx]}
              roundIndex={idx}
              totalRounds={bracket.rounds.length}
              highlightedTeamId={highlightedTeamId || currentUserTeamId}
              isGameManager={isGameManager}
              onMatchClick={handleMatchClick}
            />
          ))}

          {/* Champion Display (if finals completed) */}
          {finalsMatch && <ChampionCelebration match={finalsMatch} />}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 border-t border-slate-700/30 bg-slate-900/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-[10px] text-slate-400">In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] text-slate-400">Calling</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-lime-400" />
          <span className="text-[10px] text-slate-400">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] text-slate-400">Upcoming</span>
        </div>
        {currentUserTeamId && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 ring-2 ring-sky-500/30" />
            <span className="text-[10px] text-slate-400">Your Match</span>
          </div>
        )}
      </div>
    </div>
  )
}
