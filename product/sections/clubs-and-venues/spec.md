# Clubs & Venues Specification

## Overview
Clubs & Venues allows players to discover and join pickleball communities, and manage the physical locations where events are held. Club admins manage membership, assign Game Managers, and track club analytics, while venue admins configure courts and availability. Players can browse clubs and venues, join communities, and review their experiences.

## User Flows

### Player Flows
- Browse and search for clubs by name and location
- View club details (description, member count, upcoming events)
- Join a club (instant for open clubs, request for closed clubs)
- Leave a club or manage membership settings
- Browse and search for venues on map or list view
- View venue details (address, courts, amenities, reviews)
- Rate and review a venue after attending an event

### Club Admin Flows
- Create and edit club profile (name, logo, description, visibility)
- Manage membership requests (approve/reject with message)
- View and manage member list (search, filter, export)
- Add/remove club administrators
- Assign Game Manager permissions to members
- Create sub-groups for skill levels or interests
- View club analytics dashboard
- Configure club leaderboard settings
- Invite players to join the club
- Ban/suspend members who violate rules
- Transfer ownership or archive/delete club
- Generate Club Invitation QR code for quick membership signup
- Generate App Download QR code with optional club branding
- Download QR codes as PNG/SVG for printing on flyers and signage
- Regenerate QR codes to invalidate old ones for security

### Venue Admin Flows
- Create and edit venue (name, address, photos, amenities, hours)
- Define courts with attributes (name, indoor/outdoor, surface, lighting)
- Manage court availability and maintenance windows
- Add/remove venue administrators
- Respond to venue reviews

## UI Requirements
- Club browse page with search, filters, and list/card view
- Club detail page showing description, members, events, and join button
- Member management dashboard with table view and bulk actions
- Venue browse page with map view and list view toggle
- Venue detail page with photos, court list, amenities, and reviews
- Court configuration interface with drag-and-drop reordering
- Analytics dashboard with charts for membership and activity trends
- QR code generator modal with preview, download options (PNG/SVG), and optional club branding
- QR code display optimized for printing (high resolution with club/event context)

## Configuration
- shell: true
