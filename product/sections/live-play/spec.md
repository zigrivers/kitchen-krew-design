# Live Play Specification

## Overview
Live Play is the real-time game execution interface used during active events. Players see their match assignments and can check in at courts, while Game Managers control the flow—calling players to courts, entering scores, handling no-shows, and tracking overall event progress. A full-screen Court Status Board provides a TV/projector-friendly display for venues.

## User Flows

### Player Flows
- View live status of all courts (current games, scores, availability)
- See current match assignment (court, partner, opponents, format)
- See upcoming match with estimated start time
- Check in at assigned court ("I'm Here" button)
- Enter score for completed match (if GM permits)
- Confirm or dispute score entered by opponent
- View completed matches and running standings during event

### Game Manager Flows
- View court status dashboard showing all courts and games
- Call next match to a court (triggers player notifications)
- Start and stop matches, track game timing
- Enter scores with format-aware validation (single game, best of 3, etc.)
- Resolve score disputes between players
- Handle no-shows (mark player, reassign or forfeit)
- Substitute players who leave mid-event
- Adjust match queue order manually
- Pause and resume event (weather, breaks, emergencies)
- Display countdown timer for timed games
- View event progress (matches completed, standings, time remaining)
- End event and finalize results

## UI Requirements
- Court grid showing all courts with real-time status (Available, Calling, In Progress)
- Match cards displaying players, current score, and game status
- "You're Up Next" prominent alert for players
- Score entry interface (simple tap-to-increment for players, detailed entry for GMs)
- Court Status Board: full-screen display mode optimized for TV/projector
- Queue visualization for rotation formats (paddle stack, next 4 up)
- Event progress summary (matches completed, time elapsed, standings preview)
- Notification badges and alerts for match calls
- Pause overlay when event is paused (shows reason)

## Configuration
- shell: true
