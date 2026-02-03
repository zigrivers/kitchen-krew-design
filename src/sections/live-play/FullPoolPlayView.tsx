import data from '@/../product/sections/live-play/data.json'
import { FullPoolPlayView } from './components/FullPoolPlayView'

/**
 * Preview wrapper for the Full Pool Play View
 * Uses the poolPlayScenario from sample data (16 teams, 4 pools)
 */
export default function FullPoolPlayViewPreview() {
  const scenario = data.poolPlayScenario

  return (
    <FullPoolPlayView
      event={scenario.event as any}
      eventProgress={scenario.eventProgress as any}
      poolPlayConfig={scenario.poolPlayConfig as any}
      pools={scenario.pools as any}
      teams={scenario.teams as any}
      poolProgress={scenario.poolProgress as any}
      upcomingMatches={scenario.upcomingMatches as any}
      playoffBracket={scenario.playoffBracket as any}
      courts={scenario.courts as any}
      currentUser={scenario.currentUser as any}
      notifications={scenario.notifications as any}
      onViewPool={(poolId) => console.log('View pool:', poolId)}
      onViewMatch={(matchId) => console.log('View match:', matchId)}
      onStartMatch={(matchId) => console.log('Start match:', matchId)}
      onEnterScore={(matchId) => console.log('Enter score:', matchId)}
      onViewTeam={(teamId) => console.log('View team:', teamId)}
      onSharePool={(poolId) => console.log('Share pool:', poolId)}
      onViewPlayoffBracket={() => console.log('View playoff bracket')}
    />
  )
}
