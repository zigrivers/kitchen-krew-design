import data from '@/../product/sections/support-tickets/data.json'
import { TicketDetail } from './components/TicketDetail'

export default function TicketDetailPreview() {
  // Use the first ticket for preview (the password reset one with internal notes)
  const ticket = data.tickets[0]

  return (
    <TicketDetail
      ticket={ticket}
      agents={data.supportAgents}
      cannedResponses={data.cannedResponses}
      onReply={(ticketId, content, isInternal) =>
        console.log('Reply to ticket:', ticketId, 'Internal:', isInternal, 'Content:', content)
      }
      onAssign={(ticketId, agentId) => console.log('Assign ticket:', ticketId, 'to agent:', agentId)}
      onEscalate={(ticketId, reason) => console.log('Escalate ticket:', ticketId, 'Reason:', reason)}
      onChangePriority={(ticketId, priority) => console.log('Change priority:', ticketId, 'to:', priority)}
      onResolve={(ticketId, resolutionType) => console.log('Resolve ticket:', ticketId, 'as:', resolutionType)}
      onClose={(id) => console.log('Close/back from ticket:', id)}
      onMerge={(ticketId, targetId) => console.log('Merge ticket:', ticketId, 'into:', targetId)}
      onToggleStar={(id) => console.log('Toggle star:', id)}
      onViewRelated={(id) => console.log('View related ticket:', id)}
      onViewUser={(id) => console.log('View user profile:', id)}
    />
  )
}
