import { MatchHistory } from './components'
import sampleData from '@/../product/sections/stats-and-leaderboards/data.json'
import type { MatchHistoryEntry } from '@/../product/sections/stats-and-leaderboards/types'

// Cast sample data to proper types
const matchHistory = sampleData.matchHistory as MatchHistoryEntry[]

export default function MatchHistoryView() {
  return (
    <MatchHistory
      matches={matchHistory}
      onViewMatch={(matchId) => console.log('View match:', matchId)}
      onViewEvent={(eventId) => console.log('View event:', eventId)}
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
      onExportHistory={(format, startDate, endDate) =>
        console.log('Export:', format, startDate, endDate)
      }
    />
  )
}
