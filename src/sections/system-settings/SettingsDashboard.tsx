import data from '@/../product/sections/system-settings/data.json'
import { SettingsDashboard } from './components/SettingsDashboard'

export default function SettingsDashboardPreview() {
  return (
    <SettingsDashboard
      environment={data.environment as 'production' | 'staging' | 'development'}
      admins={data.admins}
      generalSettings={data.generalSettings}
      featureFlags={data.featureFlags}
      rateLimits={data.rateLimits}
      integrations={data.integrations}
      maintenanceConfig={data.maintenanceConfig}
      settingsHistory={data.settingsHistory}
      onNavigateCategory={(category) => console.log('Navigate to category:', category)}
      onSearch={(query) => console.log('Search:', query)}
    />
  )
}
