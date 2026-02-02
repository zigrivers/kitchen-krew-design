# Clubs & Venues Specification

## Overview
Clubs & Venues allows players to discover and join pickleball communities, and manage the physical locations where events are held. The section emphasizes **frictionless onboarding** for club and venue owners—getting a new club set up and running should take less than 5 minutes. Club admins manage membership, assign Game Managers, and track club analytics, while venue admins configure courts and availability. Players can browse clubs and venues, join communities, and review their experiences.

## User Flows

### Club Owner Onboarding Wizard (Frictionless Flow)
The primary onboarding experience for new club/venue owners. Target: under 5 minutes from signup to first event.

**Entry Point:** After signup, users see "Are you here to play or to manage a club/venue?"

**Step 1: Club Setup (1-2 min)**
- Club name (required, only required field to proceed)
- Club description (optional, can add later)
- Logo upload (optional, can add later via drag-drop or file picker)
- Contact email (pre-filled from account) and phone (optional)
- Location (city, state) for search discoverability
- Membership type: Open (default, anyone joins instantly) or Closed (approval required)
- Visibility: Public (default, searchable) or Unlisted (direct link only)

**Step 2: Venue Setup (1-2 min)**
- "Do you have a home venue?" toggle (can skip to add later)
- Venue name and address (Google Places autocomplete)
- Quick court setup: "How many courts?" slider (1-20) → auto-generates Court 1, 2, 3...
- Indoor/outdoor toggle (can mix later)
- Surface type quick-select: Concrete, Sport Court, Wood, Other

**Step 3: Subscription Tier Selection (30 sec)**
- Three tiers displayed with feature comparison:
  - Community (Free): 20 events/mo, 4 courts, 32 players/event, 2 GMs
  - Club Pro ($79/mo): Unlimited everything, all formats
  - Club Elite ($199/mo): Multi-venue, API, white-label
- "Start Free" default selection (no payment required)
- Upgrade prompts shown contextually when limits approached

**Step 4: First Event (Optional, 1 min)**
- "Create your first event?" prompt with Skip option
- Quick event templates: Open Play, Round Robin, Ladder Match
- Pre-filled with club/venue info
- Date/time picker with "Recurring" option

**Step 5: Invite Members**
- Generate Club Invitation QR code automatically
- Share options: Copy link, Download QR (PNG/SVG), SMS, Email
- "Skip and do this later" option

**Completion:**
- Welcome confirmation with next steps
- Club goes live immediately
- Welcome email with getting started guide
- Dashboard shows completion checklist for optional items skipped

### Create Club (Standalone Flow)
For users who want to create a club outside the onboarding wizard.

- Access from: Profile menu → "Create a Club" or Browse Clubs → "Start a Club"
- Club name (required)
- Description, logo, contact info (optional)
- Location (city, state/region) for discoverability
- Membership type: Open or Closed
- Visibility: Public or Unlisted
- Club URL slug auto-generated, can customize if available
- Creator becomes Club Owner (primary admin)
- Email verification required (E1-025) before creation
- Club accessible immediately after creation

### Create Venue (Standalone Flow)
For users creating a venue independently of club onboarding.

- Access from: Browse Venues → "Add a Venue" or Club Admin → "Link a Venue"
- Venue name (required)
- Address with Google Places autocomplete (required)
- Description, photos (up to 10, max 5MB each)
- Amenities checklist: restrooms, water, parking, seating, lighting, pro shop, food/drink
- Operating hours per day (or "varies")
- **Venue linking:** Can link to existing club or create standalone
  - If club-linked: Club Admins automatically become Venue Admins
  - If standalone: Creator becomes primary Venue Admin
- Must define at least one court before events can be scheduled

### Quick Court Setup
Streamlined court definition for fast onboarding.

- **Bulk add:** "Add X courts" → auto-generates Court 1, Court 2, etc.
- **Individual add:** Court name, indoor/outdoor, surface type, lighting
- Surface types: Concrete, Asphalt, Sport Court, Wood, Other
- Per-court notes (e.g., "shaded in afternoon")
- Drag-and-drop reordering
- Mark courts as Active/Inactive (inactive hidden but data preserved)
- Can delete court only if no scheduled events use it

### Claim Existing Venue
For legitimate venue owners to claim admin control of community-created venues.

- "Claim This Venue" button on unclaimed venues
- Claim request form:
  - Relationship to venue (owner, manager, authorized rep)
  - Contact information
  - Supporting documentation (optional: business card, lease)
- Super Admin reviews and approves/rejects
- Upon approval: Claimant becomes primary Venue Admin
- Claimed venues show "Verified Venue" badge
- Dispute process for contested claims

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
- View and manage member list (search, filter, export CSV)
- Add/remove club administrators
- Transfer ownership to another admin
- Assign Game Manager permissions to members
- Create sub-groups for skill levels or interests
- View club analytics dashboard (members, events, attendance trends)
- Configure club leaderboard settings
- Invite players via email, search, or bulk CSV upload
- Ban/suspend members who violate rules
- Archive or delete club (with safeguards)
- Generate Club Invitation QR code for quick membership signup
- Generate App Download QR code with optional club branding
- Download QR codes as PNG/SVG for printing on flyers and signage
- Regenerate QR codes to invalidate old ones for security

### Venue Admin Flows
- Create and edit venue (name, address, photos, amenities, hours)
- Define courts with attributes (name, indoor/outdoor, surface, lighting)
- Quick bulk court addition
- Manage court availability and maintenance windows
- Add/remove venue administrators
- Respond to venue reviews
- Archive or delete venue (cannot delete with upcoming events)
- Set venue as "Temporarily Closed" with message

### Club Invitation & Growth Flows
- Generate QR code with unique invitation link
- Scanning opens club profile with "Join" button
- New users create account first, then redirected to join
- QR code downloadable as PNG/SVG (high resolution for print)
- Optional expiration date for time-limited invitations
- Track membership signups via QR code
- Works for both public and private clubs
- Regenerate QR to invalidate old codes for security

## UI Requirements

### Onboarding Wizard
- Full-screen wizard with progress indicator (Step 1 of 5)
- Large, touch-friendly inputs optimized for mobile
- Smart defaults minimize required decisions
- "Skip" option on every optional step
- Save progress indicator (auto-save)
- Celebration animation on completion

### Club Management
- Club browse page with search, filters, and list/card view
- Club detail page showing description, members, events, and join button
- Member management dashboard with table view and bulk actions
- Club settings with tabbed navigation (Profile, Membership, QR Codes, Analytics)
- Subscription tier comparison modal with clear feature differences

### Venue Management
- Venue browse page with map view and list view toggle
- Venue detail page with photos, court list, amenities, and reviews
- Court configuration interface with drag-and-drop reordering
- Quick court bulk-add modal with count slider
- Court availability calendar with maintenance markers

### QR Code Features
- QR code generator modal with live preview
- Download options: PNG (standard and high-res) and SVG
- Optional club branding/logo overlay
- Print-optimized format with contextual information
- Copy link button with success feedback
- Usage analytics (scan count, conversion count)
- Regenerate button with confirmation (invalidates existing QR)

### Analytics Dashboard
- Charts for membership growth trend
- Event attendance over time
- Most active members leaderboard
- Rating distribution of members
- Export data option

## Configuration
- shell: true
