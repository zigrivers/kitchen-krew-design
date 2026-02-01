import data from '@/../product/sections/events/data.json'
import { CheckInManagement } from './components/CheckInManagement'
import type { Event, Registration } from '@/../product/sections/events/types'

// Create a preview event with mixed check-in statuses
const previewEvent: Event = {
  ...data.events[1], // Weekend Round Robin Tournament (full event)
  status: 'in_progress',
  registrations: [
    // Checked in players
    {
      id: 'reg-preview-1',
      player: { id: 'plr-006', name: 'Michael Torres', avatarUrl: null, skillRating: 4.0 },
      status: 'checked_in' as const,
      registeredAt: '2026-01-25T10:00:00',
      partner: null,
    },
    {
      id: 'reg-preview-2',
      player: { id: 'plr-007', name: 'Lisa Patel', avatarUrl: null, skillRating: 3.75 },
      status: 'checked_in' as const,
      registeredAt: '2026-01-25T10:15:00',
      partner: null,
    },
    {
      id: 'reg-preview-3',
      player: { id: 'plr-008', name: 'Robert Johnson', avatarUrl: null, skillRating: 4.0 },
      status: 'checked_in' as const,
      registeredAt: '2026-01-25T11:30:00',
      partner: null,
    },
    // Pending players
    {
      id: 'reg-preview-4',
      player: { id: 'plr-017', name: 'Alex Morgan', avatarUrl: null, skillRating: 4.5 },
      status: 'registered' as const,
      registeredAt: '2026-01-20T08:00:00',
      partner: null,
    },
    {
      id: 'reg-preview-5',
      player: { id: 'plr-018', name: 'Diana Cruz', avatarUrl: null, skillRating: 4.25 },
      status: 'registered' as const,
      registeredAt: '2026-01-20T08:15:00',
      partner: null,
    },
    {
      id: 'reg-preview-6',
      player: { id: 'plr-019', name: 'Ryan Mitchell', avatarUrl: null, skillRating: 4.0 },
      status: 'registered' as const,
      registeredAt: '2026-01-20T09:00:00',
      partner: null,
    },
    // No show
    {
      id: 'reg-preview-7',
      player: { id: 'plr-010', name: 'Nicole Garcia', avatarUrl: null, skillRating: 3.5 },
      status: 'no_show' as const,
      registeredAt: '2026-01-31T16:00:00',
      partner: null,
    },
  ] as Registration[],
}

// Get check-in QR code for this event
const checkInQRCode = data.eventQRCodes?.find(
  qr => qr.eventId === previewEvent.id && qr.type === 'check_in'
) || {
  id: 'eqr-checkin-preview',
  type: 'check_in' as const,
  eventId: previewEvent.id,
  eventName: previewEvent.name,
  targetUrl: `https://kitchenkrew.app/events/${previewEvent.id}/checkin`,
  createdAt: new Date().toISOString(),
  expiresAt: previewEvent.endDateTime,
  scanCount: 12,
  conversionCount: 3,
  isActive: true,
}

export default function CheckInManagementPreview() {
  return (
    <CheckInManagement
      event={previewEvent}
      checkInQRCode={checkInQRCode}
      isGeneratingQR={false}
      onBack={() => console.log('Navigate back')}
      onCheckIn={(regId) => console.log('Check in:', regId)}
      onMarkNoShow={(regId) => console.log('Mark no-show:', regId)}
      onUndoCheckIn={(regId) => console.log('Undo check-in:', regId)}
      onRemoveRegistration={(regId) => console.log('Remove registration:', regId)}
      onPromoteFromWaitlist={(regId) => console.log('Promote from waitlist:', regId)}
      onScanQR={() => console.log('Open QR scanner')}
      onDisplayCheckInQR={() => console.log('Display check-in QR')}
      onDownloadQR={(format) => console.log('Download QR as:', format)}
      onCopyQRLink={() => console.log('Copy QR link')}
    />
  )
}
