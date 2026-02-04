import { SeedingManager } from './components/SeedingManager'
import type { Seed } from '@/../product/sections/live-play/types'

// Sample seeds for an 8-team bracket
const sampleSeeds: Seed[] = [
  { seed: 1, teamId: 't-1', players: [{ id: 'p-1', name: 'Jennifer Walsh', skillRating: 4.5 }, { id: 'p-2', name: 'David Kim', skillRating: 4.25 }], combinedRating: 8.75, isBye: false },
  { seed: 2, teamId: 't-2', players: [{ id: 'p-3', name: 'Michael Torres', skillRating: 4.5 }, { id: 'p-4', name: 'Brian Thompson', skillRating: 4.0 }], combinedRating: 8.5, isBye: false },
  { seed: 3, teamId: 't-3', players: [{ id: 'p-5', name: 'Sarah Martinez', skillRating: 4.0 }, { id: 'p-6', name: 'Lisa Patel', skillRating: 4.0 }], combinedRating: 8.0, isBye: false },
  { seed: 4, teamId: 't-4', players: [{ id: 'p-7', name: 'Amanda Johnson', skillRating: 4.0 }, { id: 'p-8', name: 'Chris Garcia', skillRating: 3.75 }], combinedRating: 7.75, isBye: false },
  { seed: 5, teamId: 't-5', players: [{ id: 'p-9', name: 'Emily Chen', skillRating: 3.75 }, { id: 'p-10', name: 'Robert Lee', skillRating: 3.75 }], combinedRating: 7.5, isBye: false },
  { seed: 6, teamId: 't-6', players: [{ id: 'p-11', name: 'Kevin Wilson', skillRating: 3.75 }, { id: 'p-12', name: 'Jessica Brown', skillRating: 3.5 }], combinedRating: 7.25, isBye: false },
  { seed: 7, teamId: 't-7', players: [{ id: 'p-13', name: 'Tom Davis', skillRating: 3.5 }, { id: 'p-14', name: 'Kate Moore', skillRating: 3.5 }], combinedRating: 7.0, isBye: false },
  { seed: 8, teamId: 't-8', players: [{ id: 'p-15', name: 'Jim Adams', skillRating: 3.25 }, { id: 'p-16', name: 'Sue Clark', skillRating: 3.25 }], combinedRating: 6.5, isBye: false },
]

export default function SeedingManagerPreview() {
  // For preview, show unlocked state so the UI is interactive
  const isLocked = false

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <SeedingManager
        seeds={sampleSeeds}
        seedingLocked={isLocked}
        seedingMethod="skill_based"
        onUpdateSeeding={(seeds) => console.log('Update seeding:', seeds)}
        onLockSeeding={() => console.log('Lock seeding')}
        onRandomize={() => console.log('Randomize')}
        onSortByRating={() => console.log('Sort by rating')}
      />
    </div>
  )
}
