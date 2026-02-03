import data from '@/../product/sections/club-management/data.json'
import { NonProfitQueue } from './components/NonProfitQueue'

export default function NonProfitQueuePreview() {
  return (
    <NonProfitQueue
      applications={data.nonProfitApplications}
      onViewApplication={(id) => console.log('View application:', id)}
      onApprove={(id, notes) => console.log('Approve application:', id, 'Notes:', notes)}
      onReject={(id, reason) => console.log('Reject application:', id, 'Reason:', reason)}
      onRequestInfo={(id, request) => console.log('Request info:', id, 'Request:', request)}
      onBulkProcess={(ids, action) => console.log('Bulk process:', ids, 'Action:', action)}
      onFilterByStatus={(status) => console.log('Filter by status:', status)}
      onFilterByType={(type) => console.log('Filter by type:', type)}
    />
  )
}
