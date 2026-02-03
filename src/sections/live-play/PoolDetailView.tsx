import data from '@/../product/sections/live-play/data.json'
import { PoolDetailView } from './components/PoolDetailView'

/**
 * Preview wrapper for the Pool Detail View
 * Shows Pool C from the poolPlayScenario (in-progress pool with the current user's team)
 */
export default function PoolDetailViewPreview() {
  const scenario = data.poolPlayScenario

  // Show Pool C (in_progress, contains current user's team Martinez/Patel)
  const pool = scenario.pools.find((p: any) => p.id === 'pool-C')!
  const poolTeams = scenario.teams.filter((t: any) => pool.teams.includes(t.id))
  const progress = scenario.poolProgress['pool-C']

  return (
    <PoolDetailView
      pool={pool as any}
      teams={poolTeams as any}
      progress={progress as any}
      teamsAdvancing={scenario.poolPlayConfig.advancementRules.teamsAdvancing}
      tournamentName={scenario.event.name}
      currentUserId="pp-plr-005" // Sarah Martinez
      isGameManager={false}
      onBack={() => console.log('Back to all pools')}
      onViewMatch={(matchId) => console.log('View match:', matchId)}
      onStartMatch={(matchId) => console.log('Start match:', matchId)}
      onEnterScore={(matchId) => console.log('Enter score:', matchId)}
      onViewTeam={(teamId) => console.log('View team:', teamId)}
      onSharePool={() => console.log('Share pool')}
    />
  )
}
