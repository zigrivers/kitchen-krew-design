import data from '@/../product/sections/club-management/data.json'
import { ClubManagementDashboard } from './components/ClubManagementDashboard'

export default function ClubManagementDashboardPreview() {
  return (
    <ClubManagementDashboard
      stats={data.dashboardStats}
      recentAuditLog={data.auditLog}
      pendingAlerts={data.suspiciousActivityAlerts}
      currentAdmin={data.adminUsers[0]}
      onViewAllClubs={() => console.log('Navigate to: All Clubs')}
      onViewNonProfitQueue={() => console.log('Navigate to: Non-Profit Queue')}
      onViewDisputes={() => console.log('Navigate to: Disputes')}
      onViewEscalations={() => console.log('Navigate to: Escalations')}
      onViewAlerts={() => console.log('Navigate to: Alerts')}
      onViewAuditLog={() => console.log('Navigate to: Audit Log')}
    />
  )
}
