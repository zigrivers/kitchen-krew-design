import data from '@/../product/sections/club-management/data.json'
import { OwnershipDisputes } from './components/OwnershipDisputes'

export default function OwnershipDisputesPreview() {
  return (
    <OwnershipDisputes
      disputes={data.ownershipDisputes}
      onViewDispute={(id) => console.log('View dispute:', id)}
      onAssignDispute={(id, adminId) => console.log('Assign dispute:', id, 'to', adminId)}
      onResolve={(id, resolution, details) => console.log('Resolve dispute:', id, resolution, details)}
      onAddNote={(id, content) => console.log('Add note to dispute:', id, content)}
      onContactParty={(id, partyType) => console.log('Contact party:', id, partyType)}
      onFilterByStatus={(status) => console.log('Filter by status:', status)}
      onFilterByType={(type) => console.log('Filter by type:', type)}
      onFilterByPriority={(priority) => console.log('Filter by priority:', priority)}
    />
  )
}
