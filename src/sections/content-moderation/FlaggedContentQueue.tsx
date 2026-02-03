import data from '@/../product/sections/content-moderation/data.json'
import { FlaggedContentQueue } from './components/FlaggedContentQueue'

export default function FlaggedContentQueuePreview() {
  return (
    <FlaggedContentQueue
      content={data.flaggedContent}
      totalCount={data.flaggedContent.length}
      onApprove={(id) => console.log('Approve content:', id)}
      onRemove={(id, warnUser) => console.log('Remove content:', id, 'warn user:', warnUser)}
      onViewDetails={(id) => console.log('View content details:', id)}
      onFilterChange={(filters) => console.log('Filter changed:', filters)}
      onLoadMore={() => console.log('Load more content')}
      onRefresh={() => console.log('Refresh content')}
    />
  )
}
