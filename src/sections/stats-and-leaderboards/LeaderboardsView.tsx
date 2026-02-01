import { Leaderboards } from './components'
import sampleData from '@/../product/sections/stats-and-leaderboards/data.json'
import type {
  EventLeaderboard,
  ClubLeaderboard,
} from '@/../product/sections/stats-and-leaderboards/types'

// Cast sample data to proper types
const eventLeaderboard = sampleData.eventLeaderboard as EventLeaderboard
const clubLeaderboard = sampleData.clubLeaderboard as ClubLeaderboard

export default function LeaderboardsView() {
  return (
    <Leaderboards
      eventLeaderboard={eventLeaderboard}
      clubLeaderboard={clubLeaderboard}
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
      onViewEvent={(eventId) => console.log('View event:', eventId)}
      onViewClub={(clubId) => console.log('View club:', clubId)}
      onChangeClubMetric={(metric) => console.log('Change metric:', metric)}
      onChangeClubPeriod={(period) => console.log('Change period:', period)}
    />
  )
}
