import data from '@/../product/sections/live-play/data.json'
import { PoolPlayView } from './components/PoolStandings'
import type { Pool, PoolAdvancementRules } from '@/../product/sections/live-play/types'

export default function PoolStandingsPreview() {
  // Use the example pool play data from data.json
  const poolPlayData = data.poolPlayExample as {
    pools: Pool[]
    advancementRules: PoolAdvancementRules
  }

  return (
    <PoolPlayView
      pools={poolPlayData.pools}
      advancementRules={poolPlayData.advancementRules}
      currentUserId={data.currentUser.id}
      onViewPlayer={(playerId) => console.log('View player:', playerId)}
      onViewMatch={(matchId) => console.log('View match:', matchId)}
    />
  )
}
