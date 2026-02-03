import data from '@/../product/sections/system-settings/data.json'
import { GeneralSettingsPanel } from './components/GeneralSettingsPanel'

export default function GeneralSettingsPanelPreview() {
  return (
    <GeneralSettingsPanel
      settings={data.generalSettings}
      onUpdate={(path, value) => console.log('Update setting:', path, value)}
      onResetToDefault={(path) => console.log('Reset to default:', path)}
      onSave={() => console.log('Save all changes')}
    />
  )
}
