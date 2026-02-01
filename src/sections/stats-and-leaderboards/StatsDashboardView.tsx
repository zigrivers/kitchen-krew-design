import { StatsDashboard } from './components'
import sampleData from '@/../product/sections/stats-and-leaderboards/data.json'
import type {
  CurrentPlayer,
  PlayerStats,
  RatingHistoryPoint,
  PartnerRecord,
  ActivityDay,
} from '@/../product/sections/stats-and-leaderboards/types'

// Cast sample data to proper types
const currentPlayer = sampleData.currentPlayer as CurrentPlayer
const playerStats = sampleData.playerStats as PlayerStats
const ratingHistory = sampleData.ratingHistory as RatingHistoryPoint[]
const partnerRecords = sampleData.partnerRecords as PartnerRecord[]
const activityCalendar = sampleData.activityCalendar as ActivityDay[]

export default function StatsDashboardView() {
  return (
    <StatsDashboard
      currentPlayer={currentPlayer}
      playerStats={playerStats}
      ratingHistory={ratingHistory}
      partnerRecords={partnerRecords}
      activityCalendar={activityCalendar}
      onViewPartners={() => console.log('View partners')}
      onViewOpponents={() => console.log('View opponents')}
      onViewHistory={() => console.log('View match history')}
    />
  )
}
