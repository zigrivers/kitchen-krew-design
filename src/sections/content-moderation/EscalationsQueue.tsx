import data from '@/../product/sections/content-moderation/data.json'
import { EscalationsQueue } from './components/EscalationsQueue'

export default function EscalationsQueuePreview() {
  const categories = [
    { value: 'severe_harassment', label: 'Severe Harassment' },
    { value: 'threats_violence', label: 'Threats/Violence' },
    { value: 'fraud_impersonation', label: 'Fraud/Impersonation' },
    { value: 'illegal_activity', label: 'Illegal Activity' },
    { value: 'pattern_abuse', label: 'Pattern of Abuse' },
  ]

  return (
    <EscalationsQueue
      escalations={data.platformEscalations}
      moderators={data.moderators}
      categories={categories}
      totalCount={data.platformEscalations.length}
      onViewEscalation={(id) => console.log('View escalation:', id)}
      onAssign={(escalationId, moderatorId) => console.log('Assign escalation:', escalationId, 'to:', moderatorId)}
      onFilterChange={(filters) => console.log('Filter changed:', filters)}
      onLoadMore={() => console.log('Load more escalations')}
      onRefresh={() => console.log('Refresh escalations')}
    />
  )
}
