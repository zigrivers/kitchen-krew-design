import data from '@/../product/sections/events/data.json'
import { EventCreateWizard } from './components/EventCreateWizard'
import type { Venue, FormatCategory } from '@/../product/sections/events/types'

// Extract unique venues from events
const venues = Array.from(
  new Map(data.events.map((e) => [e.venue.id, e.venue])).values()
) as Venue[]

export default function EventCreateWizardPreview() {
  return (
    <EventCreateWizard
      venues={venues}
      formatCategories={data.formatCategories as FormatCategory[]}
      onSubmit={(eventData) => console.log('Create event:', eventData)}
      onCancel={() => console.log('Cancel wizard')}
    />
  )
}
