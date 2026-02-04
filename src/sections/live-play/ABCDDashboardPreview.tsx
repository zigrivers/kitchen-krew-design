import { ABCDDashboard } from './components/ABCDDashboard'
import data from '@/../product/sections/live-play/data.json'

// Extract data from the JSON file
const abcdEvent = data.abcdEvent
const abcdSession = data.abcdSession

// Sample courts for the dashboard
const courts = [
  { id: 'abcd-court-001', name: 'Court 1', status: 'in_progress' as const, currentMatchId: 'abcd-m-001', attributes: { indoor: true, surface: 'sport_court' as const, lighting: true } },
  { id: 'abcd-court-002', name: 'Court 2', status: 'in_progress' as const, currentMatchId: 'abcd-m-002', attributes: { indoor: true, surface: 'sport_court' as const, lighting: true } },
  { id: 'abcd-court-003', name: 'Court 3', status: 'in_progress' as const, currentMatchId: 'abcd-m-003', attributes: { indoor: true, surface: 'sport_court' as const, lighting: true } },
  { id: 'abcd-court-004', name: 'Court 4', status: 'in_progress' as const, currentMatchId: 'abcd-m-004', attributes: { indoor: true, surface: 'sport_court' as const, lighting: true } },
]

export function ABCDDashboardPreview() {
  return (
    <ABCDDashboard
      event={abcdEvent}
      session={abcdSession}
      courts={courts}
      onStartSession={() => console.log('Start session')}
      onAssignPlayerToGroup={(playerId, group) => console.log('Assign player to group:', playerId, group)}
      onStartMatch={(matchId, courtId) => console.log('Start match:', matchId, courtId)}
      onEnterScore={(matchId, team1Score, team2Score) => console.log('Enter score:', matchId, team1Score, team2Score)}
      onEndSession={() => console.log('End session')}
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
      onViewMatch={(matchId) => console.log('View match:', matchId)}
      onViewGroup={(group) => console.log('View group:', group)}
    />
  )
}
