import { useState } from 'react'
import { GDPRCompliance } from './components/GDPRCompliance'
import sampleData from '@/../product/sections/user-management/data.json'
import type {
  GDPRRequest,
  GDPRRequestStatus,
  GDPRRequestType,
} from '@/../product/sections/user-management/types'

// Cast sample data to proper types
const requests = sampleData.gdprRequests as GDPRRequest[]

export default function GDPRComplianceView() {
  const [statusFilter, setStatusFilter] = useState<GDPRRequestStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<GDPRRequestType | 'all'>('all')

  return (
    <GDPRCompliance
      requests={requests}
      statusFilter={statusFilter}
      typeFilter={typeFilter}
      isLoading={false}
      onFilterChange={(status, type) => {
        setStatusFilter(status)
        setTypeFilter(type)
        console.log('Filter change:', { status, type })
      }}
      onViewRequest={(requestId) => {
        console.log('View request:', requestId)
        const request = requests.find((r) => r.id === requestId)
        if (request) {
          alert(`View user: ${request.playerName} (${request.playerEmail})`)
        }
      }}
      onGenerateExport={(requestId) => {
        console.log('Generate export:', requestId)
        alert('Generating data export... This typically takes 2-5 minutes.')
      }}
      onProcessDeletion={(requestId) => {
        console.log('Process deletion:', requestId)
        const confirmed = confirm(
          'Are you sure you want to process this deletion request? This action cannot be undone.'
        )
        if (confirmed) {
          alert('Deletion request processed. User data will be anonymized.')
        }
      }}
      onCancelDeletion={(requestId) => {
        console.log('Cancel deletion:', requestId)
        alert('Deletion request cancelled at user request.')
      }}
    />
  )
}
