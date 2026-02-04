import data from '@/../product/sections/live-play/data.json'
import { PoolPlayView } from './components/PoolStandings'
import type { Pool, PoolAdvancementRules } from '@/../product/sections/live-play/types'

export default function PoolStandingsPreview() {
  // Transform roundRobinPools to match Pool type
  // Pool type expects simpler standings with just basic info
  const pools: Pool[] = data.roundRobinPools.map((pool) => ({
    id: pool.id,
    name: pool.name,
    status: pool.status as Pool['status'],
    teams: pool.teams,
    standings: pool.standings.map((s) => ({
      teamId: s.teamId,
      displayName: s.displayName,
      wins: s.wins,
      losses: s.losses,
      pointDiff: s.pointDiff,
      rank: s.rank,
      advances: s.advances,
    })),
    matches: data.roundRobinMatches
      .filter((m) => m.poolId === pool.id)
      .map((m) => m.id),
  }))

  const advancementRules: PoolAdvancementRules = {
    teamsPerPool: data.roundRobinConfig.poolStructure.teamsPerPool,
    teamsAdvancing: data.roundRobinConfig.playoffConfig.teamsAdvancing,
    tiebreakers: ['head_to_head', 'point_differential', 'points_scored'],
  }

  return (
    <PoolPlayView
      pools={pools}
      advancementRules={advancementRules}
      currentUserId={data.currentUser.id}
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
      onViewMatch={(matchId) => console.log('View match:', matchId)}
    />
  )
}
