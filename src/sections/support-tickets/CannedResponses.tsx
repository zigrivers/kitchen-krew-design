import data from '@/../product/sections/support-tickets/data.json'
import { CannedResponses } from './components/CannedResponses'

export default function CannedResponsesPreview() {
  return (
    <CannedResponses
      responses={data.cannedResponses}
      onCreate={(response) => console.log('Create response:', response)}
      onEdit={(id, updates) => console.log('Edit response:', id, updates)}
      onDelete={(id) => console.log('Delete response:', id)}
      onDuplicate={(id) => console.log('Duplicate response:', id)}
      onSelect={(id) => console.log('Select response:', id)}
    />
  )
}
