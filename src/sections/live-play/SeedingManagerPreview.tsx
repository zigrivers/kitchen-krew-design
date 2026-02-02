import data from '@/../product/sections/live-play/data.json'
import { SeedingManager } from './components/SeedingManager'
import type { Seed } from '@/../product/sections/live-play/types'

export default function SeedingManagerPreview() {
  // For preview, show unlocked state so the UI is interactive
  const isLocked = false

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <SeedingManager
        seeds={data.seeds as Seed[]}
        seedingLocked={isLocked}
        seedingMethod={data.tournament.seedingMethod as 'random' | 'skill_based' | 'manual'}
        onUpdateSeeding={(seeds) => console.log('Update seeding:', seeds)}
        onLockSeeding={() => console.log('Lock seeding')}
        onRandomize={() => console.log('Randomize')}
        onSortByRating={() => console.log('Sort by rating')}
      />
    </div>
  )
}
