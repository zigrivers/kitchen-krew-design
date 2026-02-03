import data from '@/../product/sections/support-tickets/data.json'
import { SupportDashboard } from './components/SupportDashboard'

export default function SupportDashboardPreview() {
  return (
    <SupportDashboard
      metrics={data.dashboardMetrics}
      recentTickets={data.tickets}
      agents={data.supportAgents}
      onViewTicket={(id) => console.log('View ticket:', id)}
      onViewAgent={(id) => console.log('View agent:', id)}
      onRefresh={() => console.log('Refresh dashboard')}
    />
  )
}
