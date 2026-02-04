import { TeamMatchDashboard } from './components/TeamMatchDashboard'
import data from '@/../product/sections/live-play/data.json'

// Extract data from the JSON file
const teamCompetitionEvent = data.teamCompetitionEvent
const teamCompetitionConfig = data.teamCompetitionConfig
const teamMatch = data.teamMatch
const teamStandings = data.teamStandings

// Sample courts for the dashboard
const courts = [
  { id: 'court-001', name: 'Court 1', status: 'in_progress' as const, currentMatchId: 'tm-001', attributes: { indoor: true, surface: 'sport_court' as const, lighting: true } },
  { id: 'court-002', name: 'Court 2', status: 'available' as const, currentMatchId: null, attributes: { indoor: true, surface: 'sport_court' as const, lighting: true } },
]

export function TeamMatchDashboardPreview() {
  return (
    <TeamMatchDashboard
      event={teamCompetitionEvent}
      config={teamCompetitionConfig}
      currentMatch={teamMatch}
      upcomingMatches={[]}
      completedMatches={[]}
      standings={teamStandings}
      courts={courts}
      onStartMatch={(matchId) => console.log('Start match:', matchId)}
      onSetLineup={(matchId, gameId, team, players) => console.log('Set lineup:', matchId, gameId, team, players)}
      onStartGame={(matchId, gameId, courtId) => console.log('Start game:', matchId, gameId, courtId)}
      onEnterGameScore={(matchId, gameId, team1Score, team2Score) => console.log('Enter game score:', matchId, gameId, team1Score, team2Score)}
      onTriggerDreambreaker={(matchId) => console.log('Trigger Dreambreaker:', matchId)}
      onCompleteMatch={(matchId) => console.log('Complete match:', matchId)}
      onSubstitutePlayer={(matchId, gameId, oldPlayerId, newPlayerId) => console.log('Substitute:', matchId, gameId, oldPlayerId, newPlayerId)}
      onViewTeam={(teamId) => console.log('View team:', teamId)}
      onViewMatch={(matchId) => console.log('View match:', matchId)}
    />
  )
}
