import { PartnerOpponentRecords } from './components'
import sampleData from '@/../product/sections/stats-and-leaderboards/data.json'
import type {
  PartnerRecord,
  OpponentRecord,
} from '@/../product/sections/stats-and-leaderboards/types'

// Cast sample data to proper types
const partnerRecords = sampleData.partnerRecords as PartnerRecord[]
const opponentRecords = sampleData.opponentRecords as OpponentRecord[]

export default function PartnerOpponentRecordsView() {
  return (
    <PartnerOpponentRecords
      partnerRecords={partnerRecords}
      opponentRecords={opponentRecords}
      onViewPartner={(partnerId) => console.log('View partner:', partnerId)}
      onViewOpponent={(opponentId) => console.log('View opponent:', opponentId)}
      onViewHeadToHead={(playerId) => console.log('View head-to-head:', playerId)}
    />
  )
}
