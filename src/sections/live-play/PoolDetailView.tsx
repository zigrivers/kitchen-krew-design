import data from '@/../product/sections/live-play/data.json'
import { PoolDetailView } from './components/PoolDetailView'

/**
 * Preview wrapper for the Pool Detail View
 * Shows Pool A from roundRobinPools (in-progress pool)
 */
export default function PoolDetailViewPreview() {
  // Get Pool A from the round robin data
  const poolData = data.roundRobinPools.find((p) => p.id === 'pool-A')!
  const poolTeams = data.roundRobinTeams.filter((t) => poolData.teams.includes(t.id))
  const progress = data.roundRobinEventProgress.poolProgress['pool-A']

  // Transform pool to include matches (component expects matches embedded)
  const poolMatches = data.roundRobinMatches
    .filter((m) => m.poolId === 'pool-A')
    .map((m) => ({
      id: m.id,
      team1Id: m.team1Id,
      team2Id: m.team2Id,
      score: m.score,
      winner: m.winner,
      status: m.status,
      courtId: m.courtId,
      scheduledTime: m.startedAt || new Date().toISOString(),
      startedAt: m.startedAt,
      completedAt: m.completedAt,
    }))

  const pool = {
    ...poolData,
    matches: poolMatches,
    scheduleComplete: poolData.status === 'completed',
  }

  return (
    <PoolDetailView
      pool={pool as any}
      teams={poolTeams as any}
      progress={progress as any}
      teamsAdvancing={data.roundRobinConfig.playoffConfig.teamsAdvancing}
      tournamentName={data.roundRobinEvent.name}
      currentUserId="plr-001" // Sarah Martinez
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
