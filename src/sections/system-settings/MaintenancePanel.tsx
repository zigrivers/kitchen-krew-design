import data from '@/../product/sections/system-settings/data.json'
import { MaintenancePanel } from './components/MaintenancePanel'

export default function MaintenancePanelPreview() {
  return (
    <MaintenancePanel
      config={data.maintenanceConfig}
      onToggleMaintenanceMode={(enabled) => console.log('Toggle maintenance mode:', enabled)}
      onScheduleMaintenance={(startTime, endTime, noticeHours) => console.log('Schedule maintenance:', { startTime, endTime, noticeHours })}
      onUpdateBannerMessage={(message) => console.log('Update banner message:', message)}
      onUpdateAllowedIPs={(ips) => console.log('Update allowed IPs:', ips)}
      onEmergencyMaintenance={() => console.log('Activate emergency maintenance')}
    />
  )
}
