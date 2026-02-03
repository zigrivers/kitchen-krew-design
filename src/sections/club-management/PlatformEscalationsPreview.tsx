import data from '@/../product/sections/club-management/data.json'
import { PlatformEscalations } from './components/PlatformEscalations'

export default function PlatformEscalationsPreview() {
  return (
    <PlatformEscalations
      escalations={data.platformEscalations}
      currentAdmin={data.adminUsers[0]}
      onViewEscalation={(id) => console.log('View escalation:', id)}
      onAssign={(id, adminId) => console.log('Assign escalation:', id, 'to', adminId)}
      onResolve={(id, resolution, details) => console.log('Resolve escalation:', id, resolution, details)}
      onAddNote={(id, content) => console.log('Add note to escalation:', id, content)}
      onRequestInfo={(id, request) => console.log('Request info for escalation:', id, request)}
      onSecondApproval={(id) => console.log('Second approval for:', id)}
      onFilterByStatus={(status) => console.log('Filter by status:', status)}
      onFilterByPriority={(priority) => console.log('Filter by priority:', priority)}
      onFilterByReason={(reason) => console.log('Filter by reason:', reason)}
    />
  )
}
