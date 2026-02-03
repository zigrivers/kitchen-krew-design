import data from '@/../product/sections/live-play/data.json'
import { RoundRobinPoolStandings } from './components/RoundRobinPoolStandings'

export default function RoundRobinPoolStandingsView() {
  return (
    <RoundRobinPoolStandings
      pools={data.roundRobinPools as any}
      teams={data.roundRobinTeams as any}
      progress={data.roundRobinEventProgress as any}
      currentUserId={data.currentUser.id}
      eventName={data.roundRobinEvent.name}
      onViewTeam={(teamId) => console.log('View team:', teamId)}
      onViewPool={(poolId) => console.log('View pool:', poolId)}
      onViewPlayoffBracket={() => console.log('View playoff bracket preview')}
    />
  )
}
