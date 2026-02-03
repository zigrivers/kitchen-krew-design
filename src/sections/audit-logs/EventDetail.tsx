import data from '@/../product/sections/audit-logs/data.json'
import { EventDetail } from './components/EventDetail'

export default function EventDetailPreview() {
  // Use the first event as the main event
  const mainEvent = data.auditEvents[0]
  const actor = data.actors.find((a) => a.id === mainEvent.actorId) || data.actors[0]

  // Get related events (same session or same resource)
  const relatedEvents = data.auditEvents.filter(
    (e) =>
      e.id !== mainEvent.id &&
      (e.sessionId === mainEvent.sessionId || e.resourceId === mainEvent.resourceId)
  )

  return (
    <EventDetail
      event={mainEvent}
      actor={actor}
      relatedEvents={relatedEvents}
      displayMode="inline"
      onClose={() => console.log('Close event detail')}
      onViewRelated={(id) => console.log('View related event:', id)}
      onViewResource={(entityType, resourceId) => console.log('View resource:', entityType, resourceId)}
      onExport={(format) => console.log('Export event:', format)}
      onCopyValue={(value) => console.log('Copied:', value)}
    />
  )
}
