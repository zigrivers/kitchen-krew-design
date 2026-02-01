import { useState } from 'react'
import data from '@/../product/sections/players/data.json'
import { AchievementsGrid } from './components/AchievementsGrid'
import type { Achievement } from '@/../product/sections/players/types'

export default function AchievementsGridPreview() {
  const [filterCategory, setFilterCategory] = useState<Achievement['category'] | 'all'>('all')

  return (
    <AchievementsGrid
      achievements={data.achievements as Achievement[]}
      filterCategory={filterCategory}
      onBack={() => console.log('Navigate back')}
      onViewAchievement={(id) => console.log('View achievement:', id)}
      onFilterChange={(category) => setFilterCategory(category)}
      onShare={(id) => console.log('Share achievement:', id)}
    />
  )
}
