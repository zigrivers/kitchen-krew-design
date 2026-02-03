import data from '@/../product/sections/content-moderation/data.json'
import { AppealsQueue } from './components/AppealsQueue'

export default function AppealsQueuePreview() {
  return (
    <AppealsQueue
      appeals={data.appeals}
      moderators={data.moderators}
      onViewAppeal={(id) => console.log('View appeal:', id)}
      onAssign={(appealId, moderatorId) => console.log('Assign appeal:', appealId, 'to:', moderatorId)}
      onDecide={(appealId, decision, reason) => console.log('Decision on appeal:', appealId, decision, reason)}
      onRefresh={() => console.log('Refresh appeals')}
    />
  )
}
