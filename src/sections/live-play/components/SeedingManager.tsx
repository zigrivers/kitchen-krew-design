import { useState } from 'react'
import {
  GripVertical,
  Trophy,
  Lock,
  Unlock,
  Shuffle,
  ArrowUpDown,
  Users,
  Star,
  AlertCircle,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Minus,
} from 'lucide-react'
import type { Seed, SeedingManagerProps } from '@/../product/sections/live-play/types'

// =============================================================================
// Sub-Components
// =============================================================================

interface SeedRowProps {
  seed: Seed
  index: number
  isLocked: boolean
  isDragging: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDragStart?: () => void
  onDragEnd?: () => void
  onDragOver?: () => void
}

function SeedRow({
  seed,
  index,
  isLocked,
  isDragging,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragEnd,
  onDragOver,
}: SeedRowProps) {
  const isTopSeed = seed.seed <= 2
  const isBye = seed.isBye

  return (
    <div
      className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        isDragging
          ? 'bg-lime-100 dark:bg-lime-900/30 border-lime-300 dark:border-lime-700 shadow-lg scale-[1.02]'
          : isBye
          ? 'bg-slate-100/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-lime-300 dark:hover:border-lime-700'
      }`}
      draggable={!isLocked && !isBye}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver?.()
      }}
    >
      {/* Drag Handle */}
      {!isLocked && !isBye && (
        <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <GripVertical className="w-5 h-5" />
        </div>
      )}
      {(isLocked || isBye) && <div className="w-5" />}

      {/* Seed Number */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
          isBye
            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
            : isTopSeed
            ? 'bg-gradient-to-br from-lime-400 to-lime-500 text-slate-900 shadow-lg shadow-lime-500/25'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
        }`}
      >
        {seed.seed}
      </div>

      {/* Team Info */}
      <div className="flex-1 min-w-0">
        {isBye ? (
          <div className="flex items-center gap-2">
            <Minus className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500 italic">
              Bye
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white truncate">
                {seed.players.map((p) => p.name.split(' ')[0]).join(' & ')}
              </span>
              {isTopSeed && <Star className="w-4 h-4 text-lime-500 flex-shrink-0" />}
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {seed.players.map((p) => p.name).join(' & ')}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Rating */}
      {!isBye && (
        <div className="flex-shrink-0 text-right">
          <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
            {seed.combinedRating.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">combined</div>
        </div>
      )}

      {/* Reorder Buttons (visible on hover when not locked) */}
      {!isLocked && !isBye && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function BracketPreview({ seeds }: { seeds: Seed[] }) {
  // Simple bracket preview showing first round matchups
  const matchups: [Seed, Seed][] = []
  const bracketSize = seeds.length

  // Standard bracket seeding: 1v8, 4v5, 3v6, 2v7 for 8 teams
  if (bracketSize === 8) {
    matchups.push([seeds[0], seeds[7]]) // 1 vs 8
    matchups.push([seeds[3], seeds[4]]) // 4 vs 5
    matchups.push([seeds[2], seeds[5]]) // 3 vs 6
    matchups.push([seeds[1], seeds[6]]) // 2 vs 7
  } else if (bracketSize === 4) {
    matchups.push([seeds[0], seeds[3]]) // 1 vs 4
    matchups.push([seeds[1], seeds[2]]) // 2 vs 3
  } else if (bracketSize === 16) {
    matchups.push([seeds[0], seeds[15]])
    matchups.push([seeds[7], seeds[8]])
    matchups.push([seeds[3], seeds[12]])
    matchups.push([seeds[4], seeds[11]])
    matchups.push([seeds[2], seeds[13]])
    matchups.push([seeds[5], seeds[10]])
    matchups.push([seeds[1], seeds[14]])
    matchups.push([seeds[6], seeds[9]])
  }

  return (
    <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        First Round Preview
      </h3>
      <div className="space-y-3">
        {matchups.map(([team1, team2], idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700"
          >
            <div className="flex-1 flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  team1.seed <= 2
                    ? 'bg-lime-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {team1.seed}
              </span>
              <span className="text-sm font-medium text-white truncate">
                {team1.isBye
                  ? 'Bye'
                  : team1.players.map((p) => p.name.split(' ')[0]).join(' & ')}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">vs</span>
            <div className="flex-1 flex items-center gap-2 justify-end">
              <span className="text-sm font-medium text-white truncate text-right">
                {team2.isBye
                  ? 'Bye'
                  : team2.players.map((p) => p.name.split(' ')[0]).join(' & ')}
              </span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  team2.seed <= 2
                    ? 'bg-lime-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {team2.seed}
              </span>
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

export function SeedingManager({
  seeds,
  seedingLocked,
  seedingMethod,
  onUpdateSeeding,
  onLockSeeding,
  onRandomize,
  onSortByRating,
}: SeedingManagerProps) {
  const [localSeeds, setLocalSeeds] = useState<Seed[]>(seeds)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [showConfirmLock, setShowConfirmLock] = useState(false)

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newSeeds = [...localSeeds]
    const temp = newSeeds[index]
    newSeeds[index] = { ...newSeeds[index - 1], seed: temp.seed }
    newSeeds[index - 1] = { ...temp, seed: newSeeds[index].seed + 1 }
    // Re-number all seeds
    const renumbered = newSeeds.map((s, i) => ({ ...s, seed: i + 1 }))
    setLocalSeeds(renumbered)
    setHasChanges(true)
  }

  const handleMoveDown = (index: number) => {
    if (index >= localSeeds.length - 1) return
    const newSeeds = [...localSeeds]
    const temp = newSeeds[index]
    newSeeds[index] = { ...newSeeds[index + 1], seed: temp.seed }
    newSeeds[index + 1] = { ...temp, seed: newSeeds[index].seed - 1 }
    // Re-number all seeds
    const renumbered = newSeeds.map((s, i) => ({ ...s, seed: i + 1 }))
    setLocalSeeds(renumbered)
    setHasChanges(true)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return

    const newSeeds = [...localSeeds]
    const draggedSeed = newSeeds[draggedIndex]
    newSeeds.splice(draggedIndex, 1)
    newSeeds.splice(index, 0, draggedSeed)

    // Re-number all seeds
    const renumbered = newSeeds.map((s, i) => ({ ...s, seed: i + 1 }))
    setLocalSeeds(renumbered)
    setDraggedIndex(index)
    setHasChanges(true)
  }

  const handleRandomize = () => {
    const shuffled = [...localSeeds]
      .filter((s) => !s.isBye)
      .sort(() => Math.random() - 0.5)
    const byes = localSeeds.filter((s) => s.isBye)
    const combined = [...shuffled, ...byes].map((s, i) => ({ ...s, seed: i + 1 }))
    setLocalSeeds(combined)
    setHasChanges(true)
    onRandomize?.()
  }

  const handleSortByRating = () => {
    const sorted = [...localSeeds]
      .filter((s) => !s.isBye)
      .sort((a, b) => b.combinedRating - a.combinedRating)
    const byes = localSeeds.filter((s) => s.isBye)
    const combined = [...sorted, ...byes].map((s, i) => ({ ...s, seed: i + 1 }))
    setLocalSeeds(combined)
    setHasChanges(true)
    onSortByRating?.()
  }

  const handleSaveChanges = () => {
    onUpdateSeeding?.(localSeeds)
    setHasChanges(false)
  }

  const handleDiscardChanges = () => {
    setLocalSeeds(seeds)
    setHasChanges(false)
  }

  const handleLockSeeding = () => {
    setShowConfirmLock(true)
  }

  const confirmLock = () => {
    onLockSeeding?.()
    setShowConfirmLock(false)
  }

  const methodLabels = {
    random: 'Random',
    skill_based: 'Skill-Based',
    manual: 'Manual',
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-lime-400 to-lime-500 shadow-lg shadow-lime-500/25">
              <Trophy className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Tournament Seeding
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {localSeeds.filter((s) => !s.isBye).length} teams ·{' '}
                {methodLabels[seedingMethod]} seeding
              </p>
            </div>
          </div>

          {/* Lock Status */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              seedingLocked
                ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
            }`}
          >
            {seedingLocked ? (
              <>
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Seeding Locked</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span className="text-sm font-medium">Seeding Unlocked</span>
              </>
            )}
          </div>
        </div>

        {/* Action Bar */}
        {!seedingLocked && (
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRandomize}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
              >
                <Shuffle className="w-4 h-4" />
                Randomize
              </button>
              <button
                onClick={handleSortByRating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort by Rating
              </button>
            </div>

            <div className="flex items-center gap-2">
              {hasChanges && (
                <>
                  <button
                    onClick={handleDiscardChanges}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Discard
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-slate-900 transition-colors shadow-lg shadow-lime-500/25"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              )}
              {!hasChanges && (
                <button
                  onClick={handleLockSeeding}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Lock Seeding
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Seed List */}
        <div className="lg:col-span-3 space-y-2">
          {localSeeds.map((seed, index) => (
            <SeedRow
              key={seed.teamId}
              seed={seed}
              index={index}
              isLocked={seedingLocked}
              isDragging={draggedIndex === index}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onDragOver={() => handleDragOver(index)}
            />
          ))}
        </div>

        {/* Bracket Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <BracketPreview seeds={localSeeds} />

            {/* Info */}
            <div className="mt-4 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-sky-800 dark:text-sky-300">
                    Standard Bracket Seeding
                  </p>
                  <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">
                    Higher seeds are matched against lower seeds in the first round. This
                    ensures the strongest teams don't meet until later rounds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Confirmation Modal */}
      {showConfirmLock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50">
                <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Lock Seeding?
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Once locked, seeding cannot be changed. The bracket will be generated based on
              the current seed order. Players will be able to see their matchups.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmLock(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLock}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-lime-500 hover:bg-lime-600 text-slate-900 transition-colors shadow-lg shadow-lime-500/25"
              >
                <Lock className="w-4 h-4" />
                Lock Seeding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
