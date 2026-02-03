import data from '@/../product/sections/system-settings/data.json'
import { IntegrationsPanel } from './components/IntegrationsPanel'

export default function IntegrationsPanelPreview() {
  return (
    <IntegrationsPanel
      integrations={data.integrations}
      onTestConnection={(id) => console.log('Test connection:', id)}
      onManualSync={(id) => console.log('Manual sync:', id)}
      onUpdateCredentials={(id) => console.log('Update credentials:', id)}
      onUpdateSettings={(id, settings) => console.log('Update settings:', id, settings)}
      onViewLogs={(id) => console.log('View logs:', id)}
    />
  )
}
