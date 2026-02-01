import data from '@/../product/sections/events/data.json'
import { EventCreateWizard } from './components/EventCreateWizard'

// Extract unique venues from events
const venues = Array.from(
  new Map(data.events.map((e) => [e.venue.id, e.venue])).values()
)

export default function EventCreateWizardPreview() {
  return (
    <EventCreateWizard
      venues={venues}
      gameFormats={data.gameFormats}
      onSubmit={(eventData) => console.log('Create event:', eventData)}
      onCancel={() => console.log('Cancel wizard')}
    />
  )
}
