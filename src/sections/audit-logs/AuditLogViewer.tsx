import data from '@/../product/sections/audit-logs/data.json'
import { AuditLogViewer } from './components/AuditLogViewer'

export default function AuditLogViewerPreview() {
  return (
    <AuditLogViewer
      events={data.auditEvents}
      actors={data.actors}
      actionTypes={data.actionTypes}
      entityTypes={data.entityTypes}
      filterPresets={data.filterPresets}
      totalCount={1247}
      onViewEvent={(id) => console.log('View event:', id)}
      onFilterChange={(filters) => console.log('Filter changed:', filters)}
      onApplyPreset={(id) => console.log('Apply preset:', id)}
      onSavePreset={(name, desc) => console.log('Save preset:', name, desc)}
      onDeletePreset={(id) => console.log('Delete preset:', id)}
      onExport={(format) => console.log('Export:', format)}
      onCopyValue={(value) => console.log('Copied:', value)}
      onLoadMore={() => console.log('Load more events')}
      onRefresh={() => console.log('Refresh events')}
    />
  )
}
