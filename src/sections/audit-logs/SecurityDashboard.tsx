import data from '@/../product/sections/audit-logs/data.json'
import { SecurityDashboard } from './components/SecurityDashboard'

export default function SecurityDashboardPreview() {
  // Filter for critical events
  const criticalEvents = data.auditEvents.filter((e) => e.severity === 'critical')

  return (
    <SecurityDashboard
      metrics={data.securityMetrics}
      heatmap={data.activityHeatmap}
      recentCriticalEvents={criticalEvents}
      actors={data.actors}
      selectedPeriod="last_7d"
      onPeriodChange={(period) => console.log('Period changed:', period)}
      onDrillDown={(metricType) => console.log('Drill down:', metricType)}
      onViewEvent={(id) => console.log('View event:', id)}
      onViewActor={(id) => console.log('View actor:', id)}
      onInvestigatePattern={(id) => console.log('Investigate pattern:', id)}
      onRefresh={() => console.log('Refresh dashboard')}
      onExport={(format) => console.log('Export:', format)}
    />
  )
}
