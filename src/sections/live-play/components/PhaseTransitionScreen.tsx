import { useState } from 'react'
import {
  Trophy,
  ArrowRight,
  ChevronRight,
  GripVertical,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
} from 'lucide-react'
import type {
  HybridSeedingResult,
  BracketPhaseConfig,
  PhaseTransitionScreenProps,
} from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface SeedingResultRowProps {
  result: HybridSeedingResult
  isEditing: boolean
  onDragStart?: () => void
}

function SeedingResultRow({ result, isEditing }: SeedingResultRowProps) {
  const seedChange = result.originalSeed - result.bracketSeed
  const seedChangeText =
    seedChange > 0
      ? `+${seedChange}`
      : seedChange < 0
      ? `${seedChange}`
      : '—'
  const seedChangeColor =
    seedChange > 0
      ? 'text-lime-400'
      : seedChange < 0
      ? 'text-red-400'
      : 'text-slate-500'

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg transition-colors
        ${isEditing ? 'bg-slate-800/80 cursor-grab active:cursor-grabbing' : 'bg-slate-800/50'}
        ${result.bracketSeed <= 4 ? 'border-l-2 border-l-lime-500' : 'border-l-2 border-l-transparent'}
      `}
    >
      {/* Drag Handle */}
      {isEditing && (
        <div className="text-slate-600 hover:text-slate-400">
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Seed Number */}
      <div
        className={`
          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
          ${result.bracketSeed === 1
            ? 'bg-amber-500/20 text-amber-400'
            : result.bracketSeed === 2
            ? 'bg-slate-400/20 text-slate-300'
            : result.bracketSeed === 3
            ? 'bg-orange-500/20 text-orange-400'
            : 'bg-slate-700 text-slate-400'
          }
        `}
      >
        {result.bracketSeed}
      </div>

      {/* Team Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{result.displayName}</p>
        <p className="text-xs text-slate-500">
          {result.wins}-{result.losses} • {result.pointDiff > 0 ? '+' : ''}
          {result.pointDiff} PD
        </p>
      </div>

      {/* Seed Change Indicator */}
      <div className={`text-xs font-medium ${seedChangeColor}`}>{seedChangeText}</div>

      {/* Tiebreaker Indicator */}
      {result.tiebreaker && (
        <div className="group relative">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {result.tiebreaker.reason}
          </div>
        </div>
      )}
    </div>
  )
}

interface BracketPreviewMatchProps {
  position: string
  seed1: number
  team1Name: string
  seed2: number
  team2Name: string
}

function BracketPreviewMatch({ position, seed1, team1Name, seed2, team2Name }: BracketPreviewMatchProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">{position}</div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center">
            {seed1}
          </span>
          <span className="text-sm text-white truncate flex-1">{team1Name}</span>
        </div>
        <div className="text-[10px] text-slate-600 text-center">vs</div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center">
            {seed2}
          </span>
          <span className="text-sm text-white truncate flex-1">{team2Name}</span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function PhaseTransitionScreen({
  seedingResults,
  bracketPreview,
  bracketConfig,
  allowSeedOverride,
  onConfirmAndGenerate,
  onOverrideSeed,
  onBack,
}: PhaseTransitionScreenProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">Seeding Complete</h1>
              <p className="text-slate-400 mt-1">
                Review final standings and generate the bracket
              </p>
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/20 text-lime-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Seeding Complete
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700 text-slate-300 text-sm font-medium">
              <Clock className="w-4 h-4" />
              Ready for Bracket
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Final Seeding */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Final Seeding
              </h2>
              {allowSeedOverride && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${isEditing
                      ? 'bg-lime-500 text-slate-900'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }
                  `}
                >
                  {isEditing ? 'Done Editing' : 'Adjust Seeds'}
                </button>
              )}
            </div>

            <div className="space-y-2">
              {seedingResults.map((result) => (
                <SeedingResultRow
                  key={result.teamId}
                  result={result}
                  isEditing={isEditing}
                />
              ))}
            </div>

            {isEditing && (
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                <GripVertical className="w-3 h-3" />
                Drag to reorder seeds
              </p>
            )}
          </div>

          {/* Right: Bracket Preview */}
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              Bracket Preview
            </h2>

            {/* Bracket Info */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{seedingResults.length}</p>
                  <p className="text-xs text-slate-500">Teams</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white capitalize">
                    {bracketConfig.type.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-slate-500">Format</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {bracketConfig.thirdPlaceMatch ? 'Yes' : 'No'}
                  </p>
                  <p className="text-xs text-slate-500">3rd Place Match</p>
                </div>
              </div>
            </div>

            {/* First Round Matchups */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400">First Round Matchups</h3>
              <div className="grid grid-cols-2 gap-3">
                {bracketPreview.map((matchup) => (
                  <BracketPreviewMatch
                    key={matchup.matchId}
                    position={matchup.position}
                    seed1={matchup.seed1}
                    team1Name={matchup.team1Name}
                    seed2={matchup.seed2}
                    team2Name={matchup.team2Name}
                  />
                ))}
              </div>
            </div>

            {/* Bracket Structure Note */}
            <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <p className="text-xs text-slate-400">
                Standard bracket seeding: #1 vs #{seedingResults.length}, #2 vs #
                {seedingResults.length - 1}, etc. Higher seeds face lower seeds in early rounds.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
              >
                Back to Seeding
              </button>
            )}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-900 font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Generate Bracket & Start Tournament
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-lime-500/20">
                <Trophy className="w-6 h-6 text-lime-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Start Tournament?</h2>
                <p className="text-sm text-slate-400">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  Seeding will be locked and cannot be changed
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  Bracket will be generated from current seeding
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  Players will be notified of their bracket positions
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirmAndGenerate?.()
                  setShowConfirmModal(false)
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-900 font-medium transition-colors"
              >
                Generate Bracket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhaseTransitionScreen
