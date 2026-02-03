import data from '@/../product/sections/support-tickets/data.json'
import { Reports } from './components/Reports'

export default function ReportsPreview() {
  return (
    <Reports
      metrics={data.dashboardMetrics}
      dateRange={{
        start: '2024-01-09',
        end: '2024-01-15',
      }}
      onDateRangeChange={(start, end) => console.log('Date range changed:', start, 'to', end)}
      onExport={(format) => console.log('Export report as:', format)}
      onViewAgent={(id) => console.log('View agent:', id)}
    />
  )
}
