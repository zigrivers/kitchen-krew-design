import { useState } from 'react'
import { PlatformReviewQueue } from './components/PlatformReviewQueue'
import sampleData from '@/../product/sections/user-management/data.json'
import type {
  EscalationCase,
  EscalationStatus,
  EscalationPriority,
} from '@/../product/sections/user-management/types'

// Cast sample data to proper types
const cases = sampleData.escalationCases as EscalationCase[]

export default function PlatformReviewQueueView() {
  const [statusFilter, setStatusFilter] = useState<EscalationStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<EscalationPriority | 'all'>('all')

  return (
    <PlatformReviewQueue
      cases={cases}
      statusFilter={statusFilter}
      priorityFilter={priorityFilter}
      isLoading={false}
      onFilterChange={(status, priority) => {
        setStatusFilter(status)
        setPriorityFilter(priority)
        console.log('Filter change:', { status, priority })
      }}
      onSelectCase={(caseId) => {
        console.log('Select case:', caseId)
        const selectedCase = cases.find((c) => c.id === caseId)
        if (selectedCase) {
          alert(`View case details: ${selectedCase.playerName} (${selectedCase.reason})`)
        }
      }}
      onAssignToSelf={(caseId) => {
        console.log('Assign to self:', caseId)
        alert(`Case ${caseId} assigned to you`)
      }}
    />
  )
}
