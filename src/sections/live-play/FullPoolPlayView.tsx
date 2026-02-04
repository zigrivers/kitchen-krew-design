import data from '@/../product/sections/live-play/data.json'
import { FullPoolPlayView } from './components/FullPoolPlayView'

/**
 * Preview wrapper for the Full Pool Play View
 * Uses the round robin data from sample data (16 teams, 4 pools)
 */
export default function FullPoolPlayViewPreview() {
  // Transform roundRobinConfig to match ExtendedPoolPlayConfig structure
  const poolPlayConfig = {
    advancementRules: {
      teamsPerPool: data.roundRobinConfig.poolStructure.teamsPerPool,
      teamsAdvancing: data.roundRobinConfig.playoffConfig.teamsAdvancing,
      tiebreakers: data.roundRobinConfig.standingsConfig.tiebreakers as any,
    },
    playoffBracketSize: data.roundRobinConfig.playoffConfig.bracketSize as 4 | 8 | 16,
    playoffSeeding: data.roundRobinConfig.playoffConfig.seedingMethod as 'cross_pool' | 'straight' | 'snake',
  }

  // Transform pools to include matches from roundRobinMatches
  // The component expects matches embedded in each pool, but data.json stores them separately
  const poolsWithMatches = data.roundRobinPools.map((pool) => {
    const poolMatches = data.roundRobinMatches
      .filter((m) => m.poolId === pool.id)
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

    return {
      ...pool,
      matches: poolMatches,
      scheduleComplete: pool.status === 'completed',
    }
  })

  return (
    <FullPoolPlayView
      event={data.roundRobinEvent as any}
      eventProgress={data.roundRobinEventProgress as any}
      poolPlayConfig={poolPlayConfig}
      pools={poolsWithMatches as any}
      teams={data.roundRobinTeams as any}
      poolProgress={data.roundRobinEventProgress.poolProgress as any}
      upcomingMatches={data.upcomingRoundRobinMatches as any}
      playoffBracket={data.pendingPlayoffBracket as any}
      courts={data.courts as any}
      currentUser={data.currentUser as any}
      notifications={data.roundRobinNotifications as any}
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
