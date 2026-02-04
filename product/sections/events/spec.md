# Events Specification

## Overview
The Events section is the home view of KitchenKrew, providing a split interface for discovering new events and managing registered events. Players can browse, filter, register, and check in to events. Game Managers can create events using a guided wizard that supports the full range of pickleball game formats—from casual open play to competitive tournaments, round robins, ladder leagues, and specialty formats.

## Supported Event Categories

The Events section supports six major event categories, each with multiple format variations:

### 1. Tournament Formats
- **Single Elimination** — Win and advance; lose once and you're eliminated
- **Double Elimination** — Losers bracket gives second chance; must lose twice to be eliminated
- **Pool Play + Playoffs** — Round-robin pools followed by elimination bracket for top finishers

### 2. Round Robin Formats
- **Standard Round Robin** — All players/teams play each other at least once
- **Rotating Partners** — Individual signups with partners changing each round (Scramble)
- **Set Partners** — Fixed doubles teams compete against all other teams
- **Mixed Gender Round Robin** — Rotating partners with gender balancing rules

### 3. Ladder & League Formats
- **Ladder League** — Ongoing competition with court-based movement (winners up, losers down)
- **Flex League** — Flexible scheduling with opt-in game days
- **Partner League** — Fixed 2-player teams competing over multiple weeks

### 4. Recreational Formats
- **Open Play / Drop-In** — Casual pickup play with paddle-in rotation
- **Clinics & Classes** — Instructional sessions led by coaches
- **Socials & Mixers** — Non-competitive gatherings with optional casual play
- **Lessons** — Private or group sessions with professional instructors

### 5. Team Competition Formats
- **MiLP-Style Teams** — 4-person teams (2M/2F) in professional-style match format
- **Custom Team Format** — Configurable team sizes for inter-club competitions
- **Inter-Club League** — Multi-week competition across multiple venues

### 6. Specialty Formats
- **King of the Court** — Winners move up courts; losers move down; short games with continuous rotation
- **Gauntlet** — Dynamic seeding with skill-based matchmaking each round
- **ABCD Play** — Skill-grouped round robin (club-defined A/B/C/D levels)
- **Skill-Limited Events** — Events restricted to specific rating ranges

## User Flows

### Player Flows
- Browse events with filters (date, location, format category, skill level, fee)
- View event details (venue, format, registered players, waitlist status, game rules)
- Register for an event (with optional partner selection for doubles/team formats)
- Join waitlist when event is full
- Unregister from an event
- Check in to an event (QR code scan or manual)
- View "My Events" (registered, waitlisted, and managed events)
- Share event via SMS, email, or copy link to invite friends
- Register via shared link or QR code scan (redirects to event details)
- View live bracket/standings during event (read-only for participants)

### Game Manager Flows
- Create event via multi-step wizard:
  1. **Basics** — Name, description, date/time, venue, courts
  2. **Format Selection** — Choose category → choose specific format
  3. **Format Configuration** — Settings specific to chosen format (see below)
  4. **Registration Settings** — Capacity, fees, skill restrictions, waitlist
  5. **Review & Publish** — Summary and confirmation
- Clone existing event as template for new event
- Manage event registrations (approve, add, remove players)
- Manage waitlist and handle no-shows
- Cancel or reschedule an event
- Generate Event Registration QR code for flyers and signage
- Download QR code as PNG/SVG with event name and date
- Display check-in QR code for players to scan on arrival

### Format-Specific Configuration (Step 3 of Wizard)

**Tournament Formats:**
- Bracket type (single/double elimination, consolation bracket)
- Bronze match option
- Seeding method (manual, rating-based, random)
- Match format (single game, best of 3, best of 5)
- Points to win (11, 15, 21) and win-by requirement

**Round Robin Formats:**
- Partnership type (individual/rotating, fixed partners)
- Number of pools and teams per pool
- Playoff bracket option (yes/no, format)
- Scoring (points, win-by, cap)
- Tiebreaker rules (head-to-head, point differential, etc.)

**Ladder/League Formats:**
- Session duration (weeks) and frequency
- Players per court (4 or 5)
- Court movement rules (single/dual movement)
- Ranking algorithm settings

**Recreational Formats:**
- Skill range (min/max or open)
- Session capacity
- Instructor assignment (clinics/lessons)
- Drop-in vs. pre-registration

**Team Competition Formats:**
- Team size and composition (e.g., 2M/2F for MiLP)
- Match structure (games per round)
- Special scoring (rally scoring, Dreambreaker tiebreaker)

**Specialty Formats:**
- King of Court: partner split/stay option, court movement rules
- Gauntlet: dynamic seeding enabled
- ABCD: skill level definitions
- Skill-Limited: rating system (DUPR/self-rating), min/max thresholds

## UI Requirements

### Event Discovery
- Split view with tabs: "Discover" and "My Events"
- Event cards showing: name, date/time, venue, format badge, spots available, skill level, fee, organizer avatar
- Format badge with icon indicating category (🏆 Tournament, 🔄 Round Robin, 📈 Ladder, 🎱 Social, 👥 Team, ⭐ Specialty)
- Filter panel for event discovery (collapsible on mobile):
  - Date range picker
  - Location/distance
  - Format category (multi-select)
  - Skill level range
  - Fee range (free, paid, any)
  - Availability (open, waitlist, full)
- Search by event name or organizer
- Empty states for no events found / no registrations

### Event Detail Page
- Full event information with format-specific details
- Action buttons (Register, Join Waitlist, Share, Check In)
- Registered players list with partner information where applicable
- For tournaments: bracket preview (visual)
- For round robins: schedule/matchup grid preview
- For ladders: current standings preview
- Share button with options: SMS, Email, Copy Link
- QR code display for check-in (player side)

### Event Creation Wizard
- Multi-step wizard with progress indicator
- Step 1 (Basics): Standard form fields
- Step 2 (Format Selection):
  - Visual cards for 6 main categories
  - Sub-selection for specific format within category
  - Format description and "best for" hints
- Step 3 (Format Configuration):
  - Dynamic form based on selected format
  - Sensible defaults for each format
  - Help tooltips explaining options
- Step 4 (Registration Settings): Capacity, fees, restrictions
- Step 5 (Review): Summary card with all settings, edit links
- Save as Draft option throughout
- Clone from existing event option

### Game Manager Views
- Registration management table with player info, partner, payment status
- Waitlist management with promote/remove actions
- Check-in management view with search and manual check-in
- QR code generator modal with preview and download options (PNG/SVG)
- QR code printable format with event name, date, and venue

### Responsive Considerations
- Mobile-first filter experience (bottom sheet on mobile)
- Card layout adapts: single column on mobile, 2-column on tablet, 3-column on desktop
- Wizard steps stack vertically on mobile with sticky navigation

## Configuration
- shell: true
