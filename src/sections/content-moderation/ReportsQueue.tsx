import data from '@/../product/sections/content-moderation/data.json'
import { ReportsQueue } from './components/ReportsQueue'

export default function ReportsQueuePreview() {
  const categories = [
    { value: 'harassment', label: 'Harassment' },
    { value: 'cheating', label: 'Cheating' },
    { value: 'inappropriate_content', label: 'Inappropriate Content' },
    { value: 'spam', label: 'Spam' },
    { value: 'impersonation', label: 'Impersonation' },
    { value: 'other', label: 'Other' },
  ]

  const priorities = [
    { value: 'urgent' as const, label: 'Urgent', slaHours: 1 },
    { value: 'high' as const, label: 'High', slaHours: 4 },
    { value: 'medium' as const, label: 'Medium', slaHours: 24 },
    { value: 'low' as const, label: 'Low', slaHours: 72 },
  ]

  return (
    <ReportsQueue
      reports={data.userReports}
      moderators={data.moderators}
      categories={categories}
      priorities={priorities}
      totalCount={data.userReports.length}
      onViewReport={(id) => console.log('View report:', id)}
      onAssign={(reportId, moderatorId) => console.log('Assign report:', reportId, 'to:', moderatorId)}
      onTakeAction={(reportId, action) => console.log('Take action:', action, 'on report:', reportId)}
      onFilterChange={(filters) => console.log('Filter changed:', filters)}
      onLoadMore={() => console.log('Load more reports')}
      onRefresh={() => console.log('Refresh reports')}
    />
  )
}
