import { KingOfCourtDashboard } from './components/KingOfCourtDashboard'
import data from '@/../product/sections/live-play/data.json'

// Extract data from the JSON file
const kingOfCourtEvent = data.kingOfCourtEvent
const kingOfCourtSession = data.kingOfCourtSession

export function KingOfCourtDashboardPreview() {
  return (
    <KingOfCourtDashboard
      event={kingOfCourtEvent}
      session={kingOfCourtSession}
      onStartSession={() => console.log('Start session')}
      onEnterScore={(courtId, team1Score, team2Score) => console.log('Enter score:', courtId, team1Score, team2Score)}
      onProcessMovement={() => console.log('Process movement')}
      onEndSession={() => console.log('End session')}
      onAdjustPosition={(playerId, newCourt) => console.log('Adjust position:', playerId, newCourt)}
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
    />
  )
}
