import data from '@/../product/sections/support-tickets/data.json'
import { TicketQueue } from './components/TicketQueue'

export default function TicketQueuePreview() {
  return (
    <TicketQueue
      tickets={data.tickets}
      agents={data.supportAgents}
      onViewTicket={(id) => console.log('View ticket:', id)}
      onAssign={(ticketId, agentId) => console.log('Assign ticket:', ticketId, 'to agent:', agentId)}
      onChangePriority={(ticketId, priority) => console.log('Change priority:', ticketId, 'to:', priority)}
      onToggleStar={(id) => console.log('Toggle star:', id)}
      onMerge={(ids) => console.log('Merge tickets:', ids)}
      onBulkAction={(ids, action) => console.log('Bulk action:', action, 'on tickets:', ids)}
    />
  )
}
