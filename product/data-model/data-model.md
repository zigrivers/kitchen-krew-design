# Data Model

## Entities

### Player
A registered user of the platform with a profile, skill ratings (self-assessed and DUPR), playing preferences, and partner/opponent history. Players can participate in events, organize events as Game Managers, and earn achievements.

### Club
An organization that hosts pickleball events and manages members. Clubs have their own branding, membership workflows, and can operate multiple venues.

### Venue
A physical location where pickleball is played. Venues have addresses, operating hours, amenities, and contain one or more courts.

### Court
An individual playing surface at a venue. Courts have attributes like indoor/outdoor, surface type, and lighting availability.

### Event
A scheduled pickleball session with a specific game format (Open Play, Round Robin, King of the Court, Tournament, etc.). Events have registration limits, waitlists, check-in processes, and scoring configurations.

### Registration
A player's signup for an event, tracking their status through the event lifecycle: registered, waitlisted, checked-in, or no-show.

### Match
An individual game between players or teams within an event. Matches track court assignment, scores, game-by-game results (for best-of series), and completion status.

### Achievement
A badge or milestone earned by a player for reaching goals like games played, wins, streaks, or social milestones. Achievements are displayed on player profiles.

## Relationships

- Player belongs to many Clubs (as member)
- Club has many Venues
- Venue has many Courts
- Club has many Events
- Event has one Organizer (a Player who manages it)
- Event has many Co-Managers (Players who assist the Organizer)
- Event has many Registrations
- Registration belongs to one Player and one Event
- Event has many Matches
- Match has many Players (as participants, assigned to teams)
- Player has many Achievements
