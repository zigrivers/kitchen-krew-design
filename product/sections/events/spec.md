# Events Specification

## Overview
The Events section is the home view of KitchenKrew, providing a split interface for discovering new events and managing registered events. Players can browse, filter, register, and check in to events. Game Managers can create events using a guided wizard, configure game formats and settings, and manage registrations.

## User Flows

### Player Flows
- Browse events with filters (date, location, format, skill level)
- View event details (venue, format, registered players, waitlist status)
- Register for an event (with optional partner selection for doubles)
- Join waitlist when event is full
- Unregister from an event
- Check in to an event (QR code scan or manual)
- View "My Events" (registered, waitlisted, and managed events)
- Share event via SMS, email, or copy link to invite friends
- Register via shared link or QR code scan (redirects to event details)

### Game Manager Flows
- Create event via multi-step wizard (basics → format → settings → review)
- Manage event registrations (approve, add, remove players)
- Manage waitlist and handle no-shows
- Cancel or reschedule an event
- Generate Event Registration QR code for flyers and signage
- Download QR code as PNG/SVG with event name and date
- Display check-in QR code for players to scan on arrival

## UI Requirements
- Split view with tabs: "Discover" and "My Events"
- Event cards showing: name, date/time, venue, format, spots available, skill level, fee, organizer, registered players preview
- Event detail page with full information and action buttons
- Multi-step event creation wizard with progress indicator
- Registration modal with partner selection option
- QR code display for check-in (player side)
- Check-in management view for Game Managers
- Filter panel for event discovery (collapsible on mobile)
- Empty states for no events found / no registrations
- Share button with options: SMS, Email, Copy Link
- QR code generator modal with preview and download options (PNG/SVG)
- QR code printable format with event name, date, and venue

## Configuration
- shell: true
