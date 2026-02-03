import data from '@/../product/sections/content-moderation/data.json'
import { ModerationDashboard } from './components/ModerationDashboard'

export default function ModerationDashboardPreview() {
  return (
    <ModerationDashboard
      metrics={data.metrics}
      moderators={data.moderators}
      recentReports={data.userReports}
      selectedPeriod="last_7d"
      onPeriodChange={(period) => console.log('Period changed:', period)}
      onDrillDown={(metricType) => console.log('Drill down:', metricType)}
      onViewReport={(id) => console.log('View report:', id)}
      onViewEscalation={(id) => console.log('View escalation:', id)}
      onRefresh={() => console.log('Refresh dashboard')}
    />
  )
}
