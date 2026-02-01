import data from '@/../product/sections/events/data.json'
import { EventDetail } from './components/EventDetail'

export default function EventDetailPreview() {
  // Use the first event for preview, but with the current user registered
  const previewEvent = {
    ...data.events[0],
    // Add current user to registrations to show the "registered" state
    registrations: [
      {
        id: 'reg-preview',
        player: {
          id: data.currentUser.id,
          name: data.currentUser.name,
          avatarUrl: data.currentUser.avatarUrl,
          skillRating: data.currentUser.skillRating,
        },
        status: 'registered' as const,
        registeredAt: new Date().toISOString(),
        partner: null,
      },
      ...data.events[0].registrations,
    ],
    registeredCount: data.events[0].registeredCount + 1,
    spotsAvailable: Math.max(0, data.events[0].spotsAvailable - 1),
  }

  // Get share data for this event
  const shareData = data.shareEventData?.find(s => s.eventId === previewEvent.id) || {
    eventId: previewEvent.id,
    eventName: previewEvent.name,
    eventDate: new Date(previewEvent.startDateTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    venueName: previewEvent.venue.name,
    shareUrl: `https://kitchenkrew.app/events/${previewEvent.id}`,
    defaultMessage: `Join me for ${previewEvent.name} at ${previewEvent.venue.name}!`,
  }

  // Get QR code for this event
  const eventQRCode = data.eventQRCodes?.find(qr => qr.eventId === previewEvent.id && qr.type === 'event_registration') || null

  return (
    <EventDetail
      event={previewEvent}
      currentUser={data.currentUser}
      shareData={shareData}
      eventQRCode={eventQRCode}
      isGeneratingQR={false}
      onBack={() => console.log('Navigate back')}
      onRegister={(partnerId) => console.log('Register:', partnerId)}
      onUnregister={() => console.log('Unregister')}
      onJoinWaitlist={() => console.log('Join waitlist')}
      onCheckIn={() => console.log('Check in')}
      onShareEvent={(method) => console.log('Share event via:', method)}
      onEdit={() => console.log('Edit event')}
      onCancel={() => console.log('Cancel event')}
      onReschedule={() => console.log('Reschedule event')}
      onManualCheckIn={(regId) => console.log('Manual check-in:', regId)}
      onMarkNoShow={(regId) => console.log('Mark no-show:', regId)}
      onRemoveRegistration={(regId) => console.log('Remove registration:', regId)}
      onPromoteFromWaitlist={(regId) => console.log('Promote from waitlist:', regId)}
      onGenerateRegistrationQR={() => console.log('Generate registration QR')}
      onDownloadQR={(format) => console.log('Download QR as:', format)}
      onCopyQRLink={() => console.log('Copy QR link')}
    />
  )
}
