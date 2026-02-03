import data from '@/../product/sections/club-management/data.json'
import { ClubList } from './components/ClubList'

export default function ClubListPreview() {
  return (
    <ClubList
      clubs={data.adminClubs}
      onViewClub={(id) => console.log('View club:', id)}
      onSuspendClub={(id, reason) => console.log('Suspend club:', id, 'Reason:', reason)}
      onUnsuspendClub={(id) => console.log('Unsuspend club:', id)}
      onDeleteClub={(id) => console.log('Delete club:', id)}
      onTransferOwnership={(id, newOwnerId) => console.log('Transfer ownership:', id, 'to', newOwnerId)}
      onSearch={(query) => console.log('Search:', query)}
      onFilterByStatus={(status) => console.log('Filter by status:', status)}
      onFilterByTier={(tier) => console.log('Filter by tier:', tier)}
      onFilterByFlag={(flag) => console.log('Filter by flag:', flag)}
      onExport={() => console.log('Export clubs')}
    />
  )
}
