import data from '@/../product/sections/system-settings/data.json'
import { FeatureFlagsPanel } from './components/FeatureFlagsPanel'

export default function FeatureFlagsPanelPreview() {
  return (
    <FeatureFlagsPanel
      featureFlags={data.featureFlags}
      onToggle={(id, enabled) => console.log('Toggle flag:', id, enabled)}
      onUpdateRollout={(id, percentage) => console.log('Update rollout:', id, percentage)}
      onUpdateTargetGroups={(id, groups) => console.log('Update target groups:', id, groups)}
      onViewDetails={(id) => console.log('View flag details:', id)}
    />
  )
}
