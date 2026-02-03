import data from '@/../product/sections/system-settings/data.json'
import { RateLimitsPanel } from './components/RateLimitsPanel'

export default function RateLimitsPanelPreview() {
  return (
    <RateLimitsPanel
      rateLimits={data.rateLimits}
      onUpdate={(id, limit, alertThreshold) => console.log('Update limit:', id, limit, alertThreshold)}
      onTest={(id) => console.log('Test limit:', id)}
      onViewDetails={(id) => console.log('View limit details:', id)}
    />
  )
}
