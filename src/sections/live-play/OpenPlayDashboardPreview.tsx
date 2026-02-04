import { OpenPlayDashboard } from './components/OpenPlayDashboard'
import data from '@/../product/sections/live-play/data.json'

// Extract data from the JSON file
const openPlayEvent = data.openPlayEvent
const openPlaySession = data.openPlaySession

export function OpenPlayDashboardPreview() {
  return (
    <OpenPlayDashboard
      event={openPlayEvent}
      session={openPlaySession}
      onAddPlayerToQueue={(playerId) => console.log('Add player to queue:', playerId)}
      onRemoveFromQueue={(playerId) => console.log('Remove from queue:', playerId)}
      onReorderQueue={(playerId, newPosition) => console.log('Reorder queue:', playerId, newPosition)}
      onCallNextGroup={(courtId) => console.log('Call next group to court:', courtId)}
      onEndGame={(courtId) => console.log('End game on court:', courtId)}
      onEndSession={() => console.log('End session')}
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
    />
  )
}
