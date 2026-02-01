import { useState } from 'react'
import {
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  MapPin,
  Hand,
} from 'lucide-react'
import type { Match, MatchCardProps } from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

function StatusBadge({ status }: { status: Match['status'] }) {
  const statusConfig = {
    scheduled: {
      label: 'Scheduled',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
    },
    calling: {
      label: 'Check In Now',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-sky-100 dark:bg-sky-900/30',
      text: 'text-sky-700 dark:text-sky-400',
    },
    completed: {
      label: 'Completed',
      bg: 'bg-lime-100 dark:bg-lime-900/30',
      text: 'text-lime-700 dark:text-lime-400',
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  )
}

function TeamRow({
  players,
  score,
  checkedIn,
  isCurrentUserTeam,
  isCalling,
  isWinner,
}: {
  players: { id: string; name: string; skillRating: number }[]
  score: number
  checkedIn: boolean[]
  isCurrentUserTeam: boolean
  isCalling: boolean
  isWinner: boolean
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl ${
        isCurrentUserTeam
          ? 'bg-lime-50 dark:bg-lime-900/20 ring-2 ring-lime-200 dark:ring-lime-800'
          : 'bg-slate-50 dark:bg-slate-800/50'
      }`}
    >
      <div className="flex-1 min-w-0">
        {players.map((player, idx) => (
          <div key={player.id} className="flex items-center gap-2">
            <span
              className={`text-sm font-medium truncate ${
                isCurrentUserTeam ? 'text-lime-700 dark:text-lime-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {player.name}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {player.skillRating.toFixed(1)}
            </span>
            {isCalling && (
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  checkedIn[idx] ? 'bg-lime-500' : 'bg-amber-400 animate-pulse'
                }`}
                title={checkedIn[idx] ? 'Checked in' : 'Waiting for check-in'}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-right">
        {isWinner && (
          <CheckCircle2 className="w-4 h-4 text-lime-500 mx-auto mb-1" />
        )}
        <span
          className={`text-2xl font-bold tabular-nums ${
            isWinner ? 'text-lime-600 dark:text-lime-400' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {score}
        </span>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function MatchCard({
  match,
  isCurrentUserMatch,
  isGameManager,
  onCheckIn,
  onSubmitScore,
  onStartMatch,
  onViewMatch,
}: MatchCardProps) {
  const [showScoreEntry, setShowScoreEntry] = useState(false)
  const [team1Score, setTeam1Score] = useState(match.team1.score)
  const [team2Score, setTeam2Score] = useState(match.team2.score)

  const isCalling = match.status === 'calling'
  const isInProgress = match.status === 'in_progress'
  const isCompleted = match.status === 'completed'

  // Check if current user needs to check in
  const needsCheckIn = isCalling && isCurrentUserMatch

  // Determine winner
  const team1Winner = match.winner === 'team1'
  const team2Winner = match.winner === 'team2'

  // Get match duration
  const getDuration = () => {
    if (match.duration) return `${match.duration} min`
    if (!match.startedAt) return null
    const started = new Date(match.startedAt)
    const now = new Date()
    const diffMins = Math.floor((now.getTime() - started.getTime()) / 60000)
    return `${diffMins} min`
  }

  const handleSubmitScore = () => {
    onSubmitScore?.(team1Score, team2Score)
    setShowScoreEntry(false)
  }

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isCurrentUserMatch && isCalling
          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 ring-2 ring-amber-200 dark:ring-amber-800/50'
          : isCurrentUserMatch
          ? 'bg-white dark:bg-slate-900 border-lime-300 dark:border-lime-800'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Urgent Alert */}
      {needsCheckIn && (
        <div className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">You&apos;re being called!</p>
              <p className="text-xs text-amber-100">Head to your assigned court now</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4" />
            {match.courtId ? `Court ${match.courtId.replace('court-00', '')}` : 'TBD'}
          </div>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">Round {match.round}</span>
        </div>
        <div className="flex items-center gap-2">
          {getDuration() && (
            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {getDuration()}
            </span>
          )}
          <StatusBadge status={match.status} />
        </div>
      </div>

      {/* Teams */}
      <div className="p-4 space-y-3">
        <TeamRow
          players={match.team1.players}
          score={match.team1.score}
          checkedIn={match.team1.checkedIn}
          isCurrentUserTeam={isCurrentUserMatch && match.team1.players.some(p => p.id === 'plr-001')}
          isCalling={isCalling}
          isWinner={team1Winner}
        />
        <div className="flex items-center gap-2 text-slate-400">
          <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
          <span className="text-xs font-medium">VS</span>
          <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
        </div>
        <TeamRow
          players={match.team2.players}
          score={match.team2.score}
          checkedIn={match.team2.checkedIn}
          isCurrentUserTeam={isCurrentUserMatch && match.team2.players.some(p => p.id === 'plr-001')}
          isCalling={isCalling}
          isWinner={team2Winner}
        />
      </div>

      {/* Score Entry */}
      {showScoreEntry && (
        <div className="px-4 pb-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Enter Final Score</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 text-center">
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {match.team1.players.map(p => p.name.split(' ')[0]).join(' & ')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                  className="w-full p-3 text-2xl font-bold text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <span className="text-slate-400 font-medium">-</span>
              <div className="flex-1 text-center">
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {match.team2.players.map(p => p.name.split(' ')[0]).join(' & ')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                  className="w-full p-3 text-2xl font-bold text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowScoreEntry(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitScore}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors"
              >
                Submit Score
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {!showScoreEntry && (
        <div className="px-4 pb-4 space-y-2">
          {needsCheckIn && onCheckIn && (
            <button
              onClick={onCheckIn}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white transition-all flex items-center justify-center gap-2"
            >
              <Hand className="w-5 h-5" />
              I&apos;m Here - Check In
            </button>
          )}

          {isGameManager && isCalling && onStartMatch && (
            <button
              onClick={onStartMatch}
              disabled={!match.team1.checkedIn.every(Boolean) || !match.team2.checkedIn.every(Boolean)}
              className="w-full py-2.5 rounded-lg text-sm font-medium bg-lime-500 hover:bg-lime-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Match
            </button>
          )}

          {isInProgress && isCurrentUserMatch && onSubmitScore && (
            <button
              onClick={() => setShowScoreEntry(true)}
              className="w-full py-2.5 rounded-lg text-sm font-medium bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            >
              Enter Score
            </button>
          )}

          {(onViewMatch && !needsCheckIn) && (
            <button
              onClick={onViewMatch}
              className="w-full py-2.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      )}
    </div>
  )
}
