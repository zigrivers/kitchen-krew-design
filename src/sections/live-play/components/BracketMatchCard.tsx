import { Trophy, Clock, Play, CheckCircle2, AlertCircle, Minus } from 'lucide-react'
import type { BracketMatch, BracketTeam, GameScore } from '@/../product/sections/live-play/types'

interface BracketMatchCardProps {
  bracketMatch: BracketMatch
  isCurrentUserMatch: boolean
  isGameManager: boolean
  compact?: boolean
  onStartMatch?: () => void
  onEnterScore?: () => void
  onViewMatch?: () => void
}

function TeamRow({
  team,
  scores,
  isWinner,
  isCurrentUser,
  status,
  position,
}: {
  team: BracketTeam | null
  scores: GameScore[]
  isWinner: boolean
  isCurrentUser: boolean
  status: BracketMatch['status']
  position: 'top' | 'bottom'
}) {
  if (!team) {
    return (
      <div
        className={`flex items-center justify-between gap-3 px-3 py-2.5 ${
          position === 'top'
            ? 'border-b border-slate-700/50'
            : ''
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="w-5 h-5 rounded-full bg-slate-700/50 flex items-center justify-center text-xs text-slate-500">
            ?
          </span>
          <span className="text-sm text-slate-500 italic">TBD</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-slate-600">
            -
          </span>
        </div>
      </div>
    )
  }

  const totalGamesWon = scores.filter(
    (s) => (position === 'top' ? s.team1 > s.team2 : s.team2 > s.team1)
  ).length

  return (
    <div
      className={`flex items-center justify-between gap-3 px-3 py-2.5 transition-colors ${
        position === 'top' ? 'border-b border-slate-700/50' : ''
      } ${
        isWinner
          ? 'bg-lime-500/10'
          : isCurrentUser
          ? 'bg-sky-500/10'
          : ''
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            isWinner
              ? 'bg-lime-500 text-slate-900'
              : isCurrentUser
              ? 'bg-sky-500 text-white'
              : 'bg-slate-700 text-slate-300'
          }`}
        >
          {team.seed}
        </span>
        <span
          className={`text-sm font-medium truncate ${
            isWinner
              ? 'text-lime-400'
              : isCurrentUser
              ? 'text-sky-300'
              : 'text-slate-200'
          }`}
        >
          {team.displayName.replace(/^\(\d+\)\s*/, '')}
        </span>
        {isWinner && status === 'completed' && (
          <Trophy className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
        )}
      </div>

      {/* Scores */}
      <div className="flex items-center gap-1">
        {scores.length > 0 ? (
          scores.map((score, idx) => {
            const teamScore = position === 'top' ? score.team1 : score.team2
            const oppScore = position === 'top' ? score.team2 : score.team1
            const wonGame = teamScore > oppScore
            return (
              <span
                key={idx}
                className={`w-6 h-6 flex items-center justify-center text-sm font-bold rounded ${
                  wonGame
                    ? 'bg-lime-500/20 text-lime-400'
                    : 'bg-slate-700/50 text-slate-400'
                }`}
              >
                {teamScore}
              </span>
            )
          })
        ) : (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-slate-600">
            -
          </span>
        )}
        {/* Total games won indicator for Bo3/Bo5 */}
        {scores.length > 1 && (
          <span
            className={`ml-1 w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full ${
              isWinner
                ? 'bg-lime-500 text-slate-900'
                : 'bg-slate-600 text-slate-300'
            }`}
          >
            {totalGamesWon}
          </span>
        )}
      </div>
    </div>
  )
}

export function BracketMatchCard({
  bracketMatch,
  isCurrentUserMatch,
  isGameManager,
  compact = false,
  onStartMatch,
  onEnterScore,
  onViewMatch,
}: BracketMatchCardProps) {
  const { status, team1, team2, scores, winner, roundLabel, scheduledTime, courtId } = bracketMatch

  const statusConfig = {
    upcoming: {
      icon: Clock,
      label: 'Upcoming',
      bgClass: 'bg-slate-800',
      borderClass: 'border-slate-700',
      iconClass: 'text-slate-400',
    },
    calling: {
      icon: AlertCircle,
      label: 'Calling',
      bgClass: 'bg-amber-900/30',
      borderClass: 'border-amber-600/50',
      iconClass: 'text-amber-400',
    },
    in_progress: {
      icon: Play,
      label: 'Live',
      bgClass: 'bg-sky-900/30',
      borderClass: 'border-sky-500/50',
      iconClass: 'text-sky-400',
    },
    completed: {
      icon: CheckCircle2,
      label: 'Final',
      bgClass: 'bg-slate-800',
      borderClass: 'border-slate-700',
      iconClass: 'text-lime-400',
    },
    bye: {
      icon: Minus,
      label: 'Bye',
      bgClass: 'bg-slate-800/50',
      borderClass: 'border-slate-700/50',
      iconClass: 'text-slate-500',
    },
    forfeit: {
      icon: AlertCircle,
      label: 'Forfeit',
      bgClass: 'bg-red-900/30',
      borderClass: 'border-red-600/50',
      iconClass: 'text-red-400',
    },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  const isClickable = onViewMatch || (isGameManager && (onStartMatch || onEnterScore))

  const handleClick = () => {
    if (status === 'upcoming' && isGameManager && onStartMatch) {
      onStartMatch()
    } else if (status === 'in_progress' && isGameManager && onEnterScore) {
      onEnterScore()
    } else if (onViewMatch) {
      onViewMatch()
    }
  }

  return (
    <div
      className={`rounded-lg border overflow-hidden transition-all ${config.bgClass} ${config.borderClass} ${
        isClickable ? 'cursor-pointer hover:border-lime-500/50 hover:shadow-lg hover:shadow-lime-500/10' : ''
      } ${isCurrentUserMatch ? 'ring-2 ring-sky-500/50' : ''}`}
      onClick={isClickable ? handleClick : undefined}
      style={{ minWidth: compact ? '200px' : '240px' }}
    >
      {/* Status Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-700/50 bg-slate-900/50">
        <div className="flex items-center gap-1.5">
          <StatusIcon className={`w-3.5 h-3.5 ${config.iconClass}`} />
          <span className={`text-xs font-medium ${config.iconClass}`}>
            {status === 'in_progress' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 mr-1 animate-pulse" />
            )}
            {config.label}
          </span>
        </div>
        {scheduledTime && status === 'upcoming' && (
          <span className="text-xs text-slate-500">
            {new Date(scheduledTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        )}
        {courtId && (status === 'calling' || status === 'in_progress') && (
          <span className="text-xs text-slate-400">Court {courtId.replace('court-', '')}</span>
        )}
      </div>

      {/* Teams */}
      <TeamRow
        team={team1}
        scores={scores}
        isWinner={winner === 'team1'}
        isCurrentUser={isCurrentUserMatch && team1 !== null}
        status={status}
        position="top"
      />
      <TeamRow
        team={team2}
        scores={scores}
        isWinner={winner === 'team2'}
        isCurrentUser={false}
        status={status}
        position="bottom"
      />
    </div>
  )
}
