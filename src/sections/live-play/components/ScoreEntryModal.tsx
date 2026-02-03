import { useState, useEffect, useMemo } from 'react'
import {
  X,
  Trophy,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  Info,
  Flag,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  RefreshCw,
  Zap,
} from 'lucide-react'
import type {
  ScoreEntryModalProps,
  ScoreEntryMatchContext,
  ScoreEntryTeam,
  ScoringRules,
  GameScore,
  ScoreValidation,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Validation Logic
// =============================================================================

function validateScores(
  scores: GameScore[],
  scoringRules: ScoringRules,
  gamesPerMatch: 1 | 3 | 5
): ScoreValidation {
  const errors: string[] = []
  const warnings: string[] = []
  let team1GamesWon = 0
  let team2GamesWon = 0

  const gamesNeededToWin = Math.ceil(gamesPerMatch / 2)

  for (let i = 0; i < scores.length; i++) {
    const score = scores[i]
    const gameNum = i + 1

    // Check if someone won this game
    const { pointsToWin, winByTwo, pointCap } = scoringRules

    const team1Won = isGameWinner(score.team1, score.team2, pointsToWin, winByTwo, pointCap)
    const team2Won = isGameWinner(score.team2, score.team1, pointsToWin, winByTwo, pointCap)

    if (team1Won) {
      team1GamesWon++
    } else if (team2Won) {
      team2GamesWon++
    } else if (score.team1 > 0 || score.team2 > 0) {
      // Game has points but no winner yet
      if (score.team1 < pointsToWin && score.team2 < pointsToWin) {
        errors.push(`Game ${gameNum}: No winner yet (need ${pointsToWin} to win)`)
      } else if (winByTwo && Math.abs(score.team1 - score.team2) < 2) {
        errors.push(`Game ${gameNum}: Need to win by 2 points`)
      }
    }

    // Validate point cap
    if (pointCap && (score.team1 > pointCap || score.team2 > pointCap)) {
      warnings.push(`Game ${gameNum}: Score exceeds point cap of ${pointCap}`)
    }

    // Check for unusual scores
    if (score.team1 > 25 || score.team2 > 25) {
      warnings.push(`Game ${gameNum}: Unusually high score`)
    }
  }

  // Determine match winner
  let winner: 'team1' | 'team2' | null = null
  let matchComplete = false

  if (team1GamesWon >= gamesNeededToWin) {
    winner = 'team1'
    matchComplete = true
  } else if (team2GamesWon >= gamesNeededToWin) {
    winner = 'team2'
    matchComplete = true
  }

  // Check if too many games played
  const totalGamesPlayed = scores.filter(s => s.team1 > 0 || s.team2 > 0).length
  if (matchComplete && totalGamesPlayed > team1GamesWon + team2GamesWon) {
    warnings.push('Extra games entered after match was decided')
  }

  return {
    isValid: errors.length === 0 && matchComplete,
    errors,
    warnings,
    winner,
    team1GamesWon,
    team2GamesWon,
    matchComplete,
  }
}

function isGameWinner(
  myScore: number,
  oppScore: number,
  pointsToWin: number,
  winByTwo: boolean,
  pointCap: number | null
): boolean {
  // Must have at least pointsToWin
  if (myScore < pointsToWin) return false

  // Must be winning
  if (myScore <= oppScore) return false

  // Check win by two
  if (winByTwo && myScore - oppScore < 2) {
    // Unless we've hit the cap
    if (pointCap && myScore >= pointCap) {
      return true
    }
    return false
  }

  return true
}

// =============================================================================
// Score Input Component
// =============================================================================

interface ScoreInputProps {
  value: number
  onChange: (value: number) => void
  teamColor: 'lime' | 'sky'
  disabled?: boolean
  max?: number
}

function ScoreInput({ value, onChange, teamColor, disabled, max = 99 }: ScoreInputProps) {
  const colorClasses = {
    lime: {
      bg: 'bg-lime-500/10',
      border: 'border-lime-500/30',
      text: 'text-lime-400',
      button: 'bg-lime-500/20 hover:bg-lime-500/30 text-lime-400',
      active: 'ring-lime-500/50',
    },
    sky: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30',
      text: 'text-sky-400',
      button: 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-400',
      active: 'ring-sky-500/50',
    },
  }

  const colors = colorClasses[teamColor]

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled || value <= 0}
        className={`w-10 h-10 rounded-lg ${colors.button} transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center`}
      >
        <Minus className="w-4 h-4" />
      </button>

      <div
        className={`w-20 h-16 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}
      >
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const num = parseInt(e.target.value) || 0
            onChange(Math.min(max, Math.max(0, num)))
          }}
          disabled={disabled}
          className={`w-full h-full bg-transparent text-center text-3xl font-bold ${colors.text} focus:outline-none focus:ring-2 ${colors.active} rounded-xl tabular-nums`}
          min={0}
          max={max}
        />
      </div>

      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        className={`w-10 h-10 rounded-lg ${colors.button} transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}

// =============================================================================
// Quick Score Buttons
// =============================================================================

interface QuickScoreButtonsProps {
  pointsToWin: number
  onSelect: (team1: number, team2: number) => void
}

function QuickScoreButtons({ pointsToWin, onSelect }: QuickScoreButtonsProps) {
  // Generate common score scenarios
  const commonScores = [
    { label: `${pointsToWin}-0`, team1: pointsToWin, team2: 0 },
    { label: `${pointsToWin}-${Math.floor(pointsToWin / 2)}`, team1: pointsToWin, team2: Math.floor(pointsToWin / 2) },
    { label: `${pointsToWin}-${pointsToWin - 2}`, team1: pointsToWin, team2: pointsToWin - 2 },
    { label: `${pointsToWin + 1}-${pointsToWin - 1}`, team1: pointsToWin + 1, team2: pointsToWin - 1 },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {commonScores.map((score) => (
        <button
          key={score.label}
          onClick={() => onSelect(score.team1, score.team2)}
          className="px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium transition-colors"
        >
          {score.label}
        </button>
      ))}
    </div>
  )
}

// =============================================================================
// Game Score Card
// =============================================================================

interface GameScoreCardProps {
  gameNumber: number
  score: GameScore
  team1Name: string
  team2Name: string
  scoringRules: ScoringRules
  isActive: boolean
  isComplete: boolean
  winner: 'team1' | 'team2' | null
  onChange: (score: GameScore) => void
  onQuickSwap: () => void
}

function GameScoreCard({
  gameNumber,
  score,
  team1Name,
  team2Name,
  scoringRules,
  isActive,
  isComplete,
  winner,
  onChange,
  onQuickSwap,
}: GameScoreCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isActive
          ? 'border-sky-500/50 bg-sky-500/5 ring-1 ring-sky-500/20'
          : isComplete
          ? 'border-lime-500/30 bg-lime-500/5'
          : 'border-slate-700/50 bg-slate-800/30'
      }`}
    >
      {/* Game Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
              isComplete
                ? 'bg-lime-500/20 text-lime-400'
                : isActive
                ? 'bg-sky-500/20 text-sky-400'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            {gameNumber}
          </span>
          <span className="text-sm font-medium text-white">Game {gameNumber}</span>
          {isComplete && winner && (
            <span className="text-xs text-lime-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              {winner === 'team1' ? team1Name.split('/')[0] : team2Name.split('/')[0]} wins
            </span>
          )}
        </div>

        {/* Quick Swap */}
        <button
          onClick={onQuickSwap}
          className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors"
          title="Swap scores"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Score Inputs */}
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-2 truncate max-w-[100px]">{team1Name}</p>
          <ScoreInput
            value={score.team1}
            onChange={(val) => onChange({ ...score, team1: val })}
            teamColor="lime"
          />
        </div>

        <div className="text-2xl font-bold text-slate-600">–</div>

        <div className="text-center">
          <p className="text-xs text-slate-500 mb-2 truncate max-w-[100px]">{team2Name}</p>
          <ScoreInput
            value={score.team2}
            onChange={(val) => onChange({ ...score, team2: val })}
            teamColor="sky"
          />
        </div>
      </div>

      {/* Quick Score Buttons */}
      {isActive && (
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <p className="text-xs text-slate-500 mb-2">Quick scores:</p>
          <QuickScoreButtons
            pointsToWin={scoringRules.pointsToWin}
            onSelect={(team1, team2) => onChange({ team1, team2 })}
          />
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Validation Panel
// =============================================================================

interface ValidationPanelProps {
  validation: ScoreValidation
  team1Name: string
  team2Name: string
}

function ValidationPanel({ validation, team1Name, team2Name }: ValidationPanelProps) {
  if (validation.errors.length === 0 && validation.warnings.length === 0 && !validation.matchComplete) {
    return null
  }

  return (
    <div className="space-y-2">
      {/* Errors */}
      {validation.errors.map((error, idx) => (
        <div
          key={`error-${idx}`}
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      ))}

      {/* Warnings */}
      {validation.warnings.map((warning, idx) => (
        <div
          key={`warning-${idx}`}
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 flex items-center gap-2"
        >
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-400">{warning}</p>
        </div>
      ))}

      {/* Match Complete */}
      {validation.matchComplete && validation.winner && (
        <div className="rounded-lg border border-lime-500/30 bg-lime-500/10 px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-lime-500/20">
            <Trophy className="w-5 h-5 text-lime-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-lime-400">Match Complete!</p>
            <p className="text-xs text-lime-400/70">
              {validation.winner === 'team1' ? team1Name : team2Name} wins {validation.team1GamesWon}-
              {validation.team2GamesWon}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Match Header
// =============================================================================

interface MatchHeaderProps {
  match: ScoreEntryMatchContext
}

function MatchHeader({ match }: MatchHeaderProps) {
  const duration = match.startedAt
    ? Math.floor((Date.now() - new Date(match.startedAt).getTime()) / 60000)
    : 0

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-slate-500">{match.roundLabel}</span>
          <h3 className="text-lg font-bold text-white">Enter Score</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {match.courtName && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {match.courtName}
            </span>
          )}
          {match.startedAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration} min
            </span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-lime-500/10 border border-lime-500/30 p-3">
          <div className="flex items-center gap-2 mb-1">
            {match.team1.seed && (
              <span className="w-5 h-5 rounded-full bg-lime-500/30 flex items-center justify-center text-[10px] font-bold text-lime-400">
                {match.team1.seed}
              </span>
            )}
            <span className="text-sm font-medium text-lime-400">{match.team1.displayName}</span>
          </div>
          <p className="text-xs text-slate-500">
            {match.team1.players.map((p) => p.name).join(' & ')}
          </p>
        </div>

        <div className="rounded-lg bg-sky-500/10 border border-sky-500/30 p-3">
          <div className="flex items-center gap-2 mb-1">
            {match.team2.seed && (
              <span className="w-5 h-5 rounded-full bg-sky-500/30 flex items-center justify-center text-[10px] font-bold text-sky-400">
                {match.team2.seed}
              </span>
            )}
            <span className="text-sm font-medium text-sky-400">{match.team2.displayName}</span>
          </div>
          <p className="text-xs text-slate-500">
            {match.team2.players.map((p) => p.name).join(' & ')}
          </p>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Scoring Rules Display
// =============================================================================

interface ScoringRulesDisplayProps {
  rules: ScoringRules
  gamesPerMatch: 1 | 3 | 5
}

function ScoringRulesDisplay({ rules, gamesPerMatch }: ScoringRulesDisplayProps) {
  const formatLabel = gamesPerMatch === 1 ? 'Single Game' : `Best of ${gamesPerMatch}`
  const gamesNeeded = Math.ceil(gamesPerMatch / 2)

  return (
    <div className="rounded-lg bg-slate-800/30 border border-slate-700/50 px-4 py-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
      <span className="flex items-center gap-1.5">
        <Trophy className="w-3.5 h-3.5" />
        {formatLabel} (first to {gamesNeeded})
      </span>
      <span>•</span>
      <span className="flex items-center gap-1.5">
        <Zap className="w-3.5 h-3.5" />
        {rules.pointsToWin} to win{rules.winByTwo && ', win by 2'}
      </span>
      {rules.pointCap && (
        <>
          <span>•</span>
          <span>Cap at {rules.pointCap}</span>
        </>
      )}
      {rules.rallyScoring && (
        <>
          <span>•</span>
          <span>Rally scoring</span>
        </>
      )}
    </div>
  )
}

// =============================================================================
// Forfeit Confirmation
// =============================================================================

interface ForfeitConfirmProps {
  team1Name: string
  team2Name: string
  onConfirm: (team: 'team1' | 'team2') => void
  onCancel: () => void
}

function ForfeitConfirm({ team1Name, team2Name, onConfirm, onCancel }: ForfeitConfirmProps) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Flag className="w-4 h-4 text-red-400" />
        <h3 className="text-sm font-medium text-red-400">Record Forfeit</h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">Which team is forfeiting this match?</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onConfirm('team1')}
          className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors"
        >
          {team1Name.split('/')[0]}
        </button>
        <button
          onClick={() => onConfirm('team2')}
          className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors"
        >
          {team2Name.split('/')[0]}
        </button>
      </div>
      <button
        onClick={onCancel}
        className="w-full mt-3 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 text-sm transition-colors"
      >
        Cancel
      </button>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ScoreEntryModal({
  match,
  scoringRules,
  isModal = true,
  onSubmit,
  onSubmitGame,
  onClose,
  onMarkForfeit,
}: ScoreEntryModalProps) {
  // Initialize scores from existing or create empty
  const initialScores = useMemo(() => {
    const scores: GameScore[] = [...match.existingScores]
    while (scores.length < match.gamesPerMatch) {
      scores.push({ team1: 0, team2: 0 })
    }
    return scores
  }, [match.existingScores, match.gamesPerMatch])

  const [scores, setScores] = useState<GameScore[]>(initialScores)
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false)

  // Reset scores when match changes
  useEffect(() => {
    setScores(initialScores)
  }, [initialScores])

  // Validate scores
  const validation = useMemo(
    () => validateScores(scores, scoringRules, match.gamesPerMatch),
    [scores, scoringRules, match.gamesPerMatch]
  )

  // Find active game (first incomplete game)
  const activeGameIndex = useMemo(() => {
    const { team1GamesWon, team2GamesWon } = validation
    const gamesNeeded = Math.ceil(match.gamesPerMatch / 2)

    if (team1GamesWon >= gamesNeeded || team2GamesWon >= gamesNeeded) {
      return -1 // Match complete
    }

    // Find first game without a winner
    for (let i = 0; i < scores.length; i++) {
      const score = scores[i]
      const hasWinner = isGameWinner(
        score.team1,
        score.team2,
        scoringRules.pointsToWin,
        scoringRules.winByTwo,
        scoringRules.pointCap
      ) || isGameWinner(
        score.team2,
        score.team1,
        scoringRules.pointsToWin,
        scoringRules.winByTwo,
        scoringRules.pointCap
      )

      if (!hasWinner) {
        return i
      }
    }

    return -1
  }, [scores, validation, match.gamesPerMatch, scoringRules])

  const updateGameScore = (gameIndex: number, score: GameScore) => {
    const newScores = [...scores]
    newScores[gameIndex] = score
    setScores(newScores)
  }

  const swapGameScore = (gameIndex: number) => {
    const newScores = [...scores]
    const current = newScores[gameIndex]
    newScores[gameIndex] = { team1: current.team2, team2: current.team1 }
    setScores(newScores)
  }

  const handleSubmit = () => {
    if (validation.isValid && validation.winner && onSubmit) {
      onSubmit(scores, validation.winner)
    }
  }

  const handleForfeit = (team: 'team1' | 'team2') => {
    onMarkForfeit?.(team)
    setShowForfeitConfirm(false)
  }

  // Determine which games to show
  const gamesToShow = match.gamesPerMatch

  const content = (
    <div className="space-y-6">
      {/* Match Header */}
      <MatchHeader match={match} />

      {/* Scoring Rules */}
      <ScoringRulesDisplay rules={scoringRules} gamesPerMatch={match.gamesPerMatch} />

      {/* Game Score Cards */}
      <div className="space-y-4">
        {Array.from({ length: gamesToShow }).map((_, idx) => {
          const score = scores[idx] || { team1: 0, team2: 0 }
          const gameWinner = isGameWinner(
            score.team1,
            score.team2,
            scoringRules.pointsToWin,
            scoringRules.winByTwo,
            scoringRules.pointCap
          )
            ? 'team1'
            : isGameWinner(
                score.team2,
                score.team1,
                scoringRules.pointsToWin,
                scoringRules.winByTwo,
                scoringRules.pointCap
              )
            ? 'team2'
            : null

          return (
            <GameScoreCard
              key={idx}
              gameNumber={idx + 1}
              score={score}
              team1Name={match.team1.displayName}
              team2Name={match.team2.displayName}
              scoringRules={scoringRules}
              isActive={activeGameIndex === idx}
              isComplete={gameWinner !== null}
              winner={gameWinner}
              onChange={(newScore) => updateGameScore(idx, newScore)}
              onQuickSwap={() => swapGameScore(idx)}
            />
          )
        })}
      </div>

      {/* Validation Panel */}
      <ValidationPanel
        validation={validation}
        team1Name={match.team1.displayName}
        team2Name={match.team2.displayName}
      />

      {/* Forfeit Section */}
      {showForfeitConfirm ? (
        <ForfeitConfirm
          team1Name={match.team1.displayName}
          team2Name={match.team2.displayName}
          onConfirm={handleForfeit}
          onCancel={() => setShowForfeitConfirm(false)}
        />
      ) : (
        <button
          onClick={() => setShowForfeitConfirm(true)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-500 hover:text-red-400 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Flag className="w-4 h-4" />
          Record Forfeit
        </button>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!validation.isValid}
          className="flex-1 px-4 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Submit Score
        </button>
      </div>
    </div>
  )

  if (!isModal) {
    return <div className="max-w-lg mx-auto">{content}</div>
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-lime-500/20">
              <Trophy className="w-5 h-5 text-lime-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Score Entry</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6">{content}</div>
      </div>
    </div>
  )
}
