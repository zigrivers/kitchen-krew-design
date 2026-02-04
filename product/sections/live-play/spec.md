# Live Play Specification

## Overview
Live Play is the real-time game execution interface used during active events. Players see their match assignments and can check in at courts, while Game Managers control the flow—calling players to courts, entering scores, handling no-shows, and tracking overall event progress. Live Play adapts its interface to match the six event format categories: Tournament, Round Robin, Ladder & League, Recreational, Team Competition, and Specialty formats. A full-screen Court Status Board provides a TV/projector-friendly display for venues.

## Format Categories

Live Play provides specialized interfaces for each of the six event format categories:

### 1. Tournament Formats
Single Elimination, Double Elimination, Pool Play + Playoffs — Bracket-based competition with seeding, advancement tracking, and finals management.

### 2. Round Robin Formats
Standard Round Robin, Rotating Partners, Set Partners, Mixed Gender — Schedule-based play where all players/teams compete against each other with standings tracking.

### 3. Ladder & League Formats
Ladder League, Flex League, Partner League — Ongoing competition with court-based movement, ranking algorithms, and session management.

### 4. Recreational Formats
Open Play/Drop-In, Clinics & Classes, Socials & Mixers, Lessons — Casual play with paddle rotation queues, instructor-led sessions, and walk-in management.

### 5. Team Competition Formats
MiLP-Style Teams, Custom Team Format, Inter-Club League — Multi-game match formats with team scoring, substitutions, and structured match sequences.

### 6. Specialty Formats
King of the Court, Gauntlet, ABCD Play, Skill-Limited Events — Dynamic formats with continuous rotation, skill-based groupings, and adaptive matchmaking.

## User Flows

### Player Flows

#### General Event Flows (All Formats)
- View live status of all courts (current games, scores, availability)
- See current match assignment (court, partner, opponents, format)
- See upcoming match with estimated start time
- Check in at assigned court ("I'm Here" button)
- Enter score for completed match (if GM permits)
- Confirm or dispute score entered by opponent
- View completed matches and running standings during event

#### Tournament Player Flows
- View tournament bracket with current position, opponents, and path to finals
- See seeding and first-round matchup when bracket is released
- Track bracket advancement and next opponent determination
- View losers bracket position (for double elimination)
- See estimated match times for upcoming rounds
- View pool standings and advancement status (for pool play)
- Share bracket via link or to social media
- View final results with podium display and champion's path

#### Hybrid Tournament Player Flows (Seeding + Bracket)
- View current phase indicator: "Seeding Phase (Round 3/5)" or "Bracket Phase (Quarterfinals)"
- During seeding phase:
  - View complete seeding schedule (all rounds) with opponents and court assignments
  - See live standings with current seed position prominently displayed: "Your Current Seed: #3"
  - Track wins/losses and point differential affecting final seeding
  - View "What I need for top seed" scenarios
- During phase transition:
  - See final seeding standings with bracket position preview
  - View first-round bracket matchup based on seeding
- During bracket phase:
  - View tournament bracket with seeded positions
  - Track bracket advancement and next opponent
  - View match schedule and court assignments
  - See losers bracket position (for double elimination)
- Receive notifications: "Seeding complete - you are the #3 seed", "Your bracket match is starting"

#### Round Robin Player Flows
- View complete round robin schedule with round numbers, opponents, partners (if rotating), and court assignments
- See current/next match highlighted with estimated start time
- View real-time standings with W-L record, point differential, and rank
- See tiebreaker explanations when ties exist (USA Pickleball hierarchy)
- View pool standings and advancement line ("Top 2 advance to playoffs")
- Track bye rounds clearly marked as "Bye - No Match"
- See partner assignments for each round (rotating/blind draw formats)
- View "What I need to advance" scenarios in pool play
- Tap any match to see full details (score, who entered, timestamp)
- View final standings and placement after event ends

#### Ladder & League Player Flows
- View current ladder position with ranking
- Challenge players within range (typically 1-3 positions above)
- Accept or decline incoming challenges
- View challenge deadline countdown
- See scheduled match time and court for accepted challenges
- Track wins/losses and position changes over time
- View league standings and weekly session schedule
- Check in for scheduled league sessions
- View inactivity warnings and deadline reminders
- See season/ladder end date and final standings

#### Recreational Player Flows (Open Play / Drop-In)
- Check in to session and join paddle queue
- View current position in rotation queue
- See "You're up next!" notification when approaching front of queue
- View which court to go to when called
- Check out of session (removes from queue)
- Rejoin queue after completing a game
- View estimated wait time based on queue position
- See session end time countdown

#### Recreational Player Flows (Clinics & Classes)
- Check in to scheduled clinic/class
- View session agenda and drill sequence
- See current drill/activity and what's next
- View court assignment for current drill
- Access drill instructions or videos (if provided)
- Mark attendance for drop-in style clinics
- View session notes from instructor after completion

#### Recreational Player Flows (Socials & Mixers)
- Check in to social event
- View activity schedule (casual games, food breaks, announcements)
- Optionally join casual game rotation queue
- See court availability for pickup games
- View event timeline and schedule

#### Team Competition Player Flows (MiLP-Style / Team Format)
- View team roster and current lineup
- See match card showing all games in the match (Men's Doubles, Women's Doubles, Mixed 1, Mixed 2, Dreambreaker)
- Track team score vs opponent team
- View individual game assignments (who plays when)
- Check in for specific games within the match
- See current game status and upcoming games
- View Dreambreaker rules and format when applicable
- Track team standings in the competition

#### Specialty Player Flows (King of the Court)
- View current court position (Court 1 = King, Court 4 = lowest)
- See current opponents and score
- Track wins/losses at current court
- See movement preview (win = move up, lose = move down)
- View partner assignment (split or stay rules)
- See session timer and rounds remaining
- Track cumulative wins/points for session standings

#### Specialty Player Flows (Gauntlet)
- View current skill group assignment
- See dynamically matched opponents for next round
- Track performance affecting next round matching
- View session standings within skill tier
- See movement between skill tiers based on results

#### Specialty Player Flows (ABCD Play)
- View skill level assignment (A, B, C, or D)
- See round robin schedule within skill group
- Track standings within skill group
- View games against same-level opponents
- See final placement within skill group

### Game Manager Flows

#### General Event Flows (All Formats)
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

#### Tournament Bracket Management Flows
- View/edit seeding before bracket is generated (random, skill-based, or manual)
- Lock seeding to finalize bracket
- Configure match format by round (e.g., Bo3 until finals, Bo5 for finals)
- Configure consolation bracket and third-place match options
- View full bracket dashboard with match status (upcoming, in progress, completed)
- Click any match to start, enter score, or manage
- Handle walkovers and forfeits mid-tournament
- Manual advancement with override reason
- Undo last advancement (within 5 minutes)
- Swap positions before tournament starts
- Schedule specific times for tournament rounds
- Assign matches to courts with court optimization view
- Handle mid-tournament withdrawals (forfeit remaining matches, promote alternates)
- Configure double elimination Grand Finals reset rules
- Announce next round to all participants
- View tournament progress and estimated time remaining

#### Multi-Day Tournament Flows
- Configure tournament across multiple days with phase assignments
- Set session times per day
- Handle Day 2 check-in and no-shows for advancing players

#### Pool Play Management Flows
- Assign players to pools (random or seeded)
- Run round robin within pools
- View pool standings and advancement criteria
- Generate bracket seeded by pool results

#### Hybrid Tournament Management Flows (Seeding + Bracket)
- Configure hybrid tournament with seeding rounds + elimination bracket:
  - Set number of seeding rounds (typically 5, configurable 3-7)
  - Set bracket type: single or double elimination
  - Set bracket size: 8, 16, or 32 teams
  - Configure match formats per phase (e.g., single games for seeding, Bo3 for bracket)
- Run seeding phase:
  - Generate round robin schedule for all seeding rounds
  - View court status dashboard with seeding matches
  - Enter scores and track live standings
  - View match queue organized by round
- Phase transition:
  - Review final seeding standings after all rounds complete
  - Preview bracket with seed assignments (1v8, 2v7, etc.)
  - Optional: Override individual seed positions before generating bracket
  - Confirm and generate elimination bracket
  - Set break time before bracket starts
  - Send notifications: "Seeding complete - Bracket starts in 15 minutes"
- Run bracket phase:
  - Full tournament bracket management (reuse existing tournament GM flows)
  - Court assignments for bracket matches
  - Score entry with bracket advancement
  - Handle forfeits and manual advances
- View unified dashboard that adapts to current phase:
  - Seeding phase: Shows standings, court grid, seeding match queue
  - Bracket phase: Shows bracket view, court grid, bracket match queue

#### Round Robin Management Flows
- Generate round robin schedule (single or double round robin)
- Set custom number of rounds (1-20)
- Configure partner format:
  - Fixed Partners (pre-registered pairs)
  - Rotating Partners (each player partners with every other once)
  - Blind Draw (random assignment before event)
  - Pick-a-Number Random (new random partner each round)
- Configure spouse/pair avoidance rules
- Preview partner rotation before starting event
- Configure pool structure:
  - Single Pool (all players in one round robin, 4-14 players recommended)
  - Multiple Pools (2-4 pools for 12-32 players)
- Configure pool assignment method (Random, Serpentine Seeding, Manual, Skill-Balanced)
- Configure time format:
  - Games-Based (complete games to 11, 15, or 21 points)
  - Time-Based (fixed duration per round: 8, 10, 12, 15 minutes)
  - Hybrid (complete as many games as possible within time limit)
- Configure win-by margin and point caps
- Configure rally scoring vs traditional side-out
- Configure standings calculation (Win-Loss Points, Points-For, or Social Mode)
- Apply USA Pickleball official tiebreaker hierarchy
- View master schedule with all matches across all rounds
- Handle mid-event changes:
  - Player leaves → remaining matches become forfeits or byes
  - Late arrival → add player and regenerate remaining rounds only
  - Schedule regeneration preserves completed match scores
- Configure playoff format after pool play:
  - No Playoffs (standings determine final placements)
  - Single Elimination
  - Double Elimination
  - Medal Rounds (1v4 and 2v3 semifinals, Gold/Silver and Bronze matches)
- Configure advancement (how many advance from each pool: 1, 2, 3, or 4)
- Configure bracket seeding (Standard Cross vs Performance-Based)
- Lock standings and transition to playoff bracket
- Send notifications: "You've advanced to playoffs!" / "Thank you for playing"
- Configure break time between pool play and playoffs
- Configure mixed doubles mode with gender-balanced rotations

#### Ladder & League Management Flows
- Create initial ladder from registrations (by skill rating or random)
- Configure challenge range (how many positions up a player can challenge)
- Configure challenge deadline (hours to accept/decline)
- Configure match scheduling:
  - Self-scheduled (players coordinate)
  - System-scheduled (automatic assignment)
- Manually adjust ladder positions
- Handle inactivity drops (auto-demote inactive players)
- Set ladder end conditions:
  - Fixed date (ladder ends on specific date)
  - Rolling (continuous with periodic resets)
  - Season-based (aligns with league seasons)
- Process challenge results and update rankings
- Handle disputed challenges
- View ladder activity log
- Send reminders for pending challenges
- Configure flex league sessions (which days are active)
- Track attendance and participation requirements

#### Recreational Management Flows (Open Play / Drop-In)
- Start open play session with configured courts
- View paddle queue dashboard showing all players in rotation
- Add walk-in players to queue
- Remove players from queue (left early)
- Call next group to available court
- Configure rotation rules:
  - Paddle Stack (next 4 in line)
  - Winners Stay (winners remain, losers rotate)
  - Time-Based (fixed duration per court slot)
- Handle court assignments with skill balancing
- View session attendance count
- Track court utilization (games played per court)
- End session and record final attendance

#### Recreational Management Flows (Clinics & Classes)
- Start clinic/class session
- Take attendance (check in registered players)
- View participant list with skill levels
- Progress through drill/activity sequence
- Assign players to courts for drills
- Send instructions to player devices
- Record session notes
- Mark session complete
- Generate attendance report

#### Recreational Management Flows (Socials & Mixers)
- Start social event
- Check in attendees
- Manage activity timeline
- Enable/disable casual game rotation
- Make announcements (push notifications)
- Track participation
- End event

#### Team Competition Management Flows (MiLP-Style / Team Format)
- Configure match structure:
  - Number of games per match (4 for MiLP: MD, WD, MX1, MX2)
  - Tiebreaker format (Dreambreaker)
  - Points per game win
- Set team lineups before match start
- View match card with all games
- Start individual games within match
- Enter game scores
- Track aggregate team score
- Handle player substitutions between games
- Manage Dreambreaker if teams are tied:
  - Select Dreambreaker participants from each team
  - Enter rally scoring result
- Record match result and update standings
- View team standings in competition
- Handle forfeits (team or individual game level)

#### Team Competition Management Flows (Inter-Club League)
- Manage multi-venue schedule
- Track standings across clubs
- Coordinate match dates between clubs
- Enter results from away matches
- View league-wide standings
- Generate playoff bracket from league standings

#### Specialty Management Flows (King of the Court)
- Configure court count and movement rules:
  - Winners move up one court
  - Losers move down one court
  - Partner split or stay option
- Configure game format (points to win, time limit)
- Start session with initial court assignments
- Enter game results
- Automatic court movement based on results
- View court status grid with current games
- Track session standings (cumulative wins)
- Handle odd player count (bye rotation)
- End session and display final standings

#### Specialty Management Flows (Gauntlet)
- Configure skill tiers and movement thresholds
- Generate initial matchups based on skill ratings
- Enter round results
- Dynamic re-matching between rounds
- Track player movement between skill tiers
- View tier standings and match history
- End event with final tier placements

#### Specialty Management Flows (ABCD Play)
- Configure skill level definitions (A/B/C/D thresholds)
- Assign players to skill groups
- Generate round robin schedule within each group
- Run parallel round robins across courts
- Enter scores for each skill group
- Track standings within each group
- View combined event progress
- End event with group placements

## UI Requirements

### General (All Formats)
- Court grid showing all courts with real-time status (Available, Calling, In Progress)
- Match cards displaying players, current score, and game status
- "You're Up Next" prominent alert for players
- Score entry interface (simple tap-to-increment for players, detailed entry for GMs)
- Court Status Board: full-screen display mode optimized for TV/projector
- Event progress summary (matches completed, time elapsed, standings preview)
- Notification badges and alerts for match calls
- Pause overlay when event is paused (shows reason)
- Format category badge/indicator showing event type

### Tournament UI
- Interactive bracket visualization with team names, scores, and real-time updates
- Dual bracket display for double elimination (winners and losers brackets)
- Pool standings tables with advancement indicators
- Seeding management interface with drag-and-drop
- Tournament schedule view (timeline format with court assignments)
- Bracket sharing options (public link, social media, image export)
- Podium display for tournament results (1st, 2nd, 3rd with visual treatment)
- Champion's path highlight in completed brackets
- Tournament-specific notifications (seeding released, bracket live, advancement, elimination)
- Multi-day tournament progress indicator ("Day 1 of 2")
- Match format indicator by round (Bo3, Bo5, etc.)
- Bye display and handling in bracket visualization

### Hybrid Tournament UI
- Phase indicator banner: "Seeding Phase (Round 3/5)" with phase-appropriate styling
- Unified dashboard that adapts to current phase:
  - Phase selector tabs (disabled, shows current phase)
  - Quick stats adapting to phase (seeding: rounds/matches, bracket: teams remaining)
- Seeding phase view:
  - Live standings table with seed numbers, W-L, point differential
  - "Your Current Seed: #3" prominent display for players
  - Court grid with seeding matches
  - Match queue organized by seeding round
  - Seeding schedule with round-by-round progress
- Phase transition screen:
  - Final seeding standings (1st through Nth)
  - Bracket preview showing seed matchups (1v8, 2v7, 3v6, 4v5)
  - Drag-and-drop seed override option for GM
  - "Generate Bracket & Start Tournament" confirmation button
  - Break time countdown before bracket starts
- Bracket phase view:
  - Full bracket visualization with seed numbers on teams
  - Court grid with bracket matches
  - Bracket match queue with round labels
  - Round navigator for bracket management
- Player view adapts to phase:
  - Seeding: Schedule + standings + current seed
  - Bracket: Bracket position + next match + elimination status

### Round Robin UI
- Round robin schedule view with round-by-round match list
- Current round highlighted, completed rounds grayed
- Standings table with real-time updates (Rank, Player/Team, W, L, Point Differential)
- Expandable head-to-head records in standings
- Tiebreaker explanation tooltips (USA Pickleball hierarchy)
- Pool standings tables with advancement line indicator ("Top 2 advance")
- Pool selector to toggle between Pool A, Pool B, etc.
- Partner rotation preview before event starts
- Partner assignments visible in schedule view for each round
- Bye distribution visualization for odd player counts
- "Pool Play Complete" transition screen
- Advancing/eliminated player notification banners
- Schedule regeneration confirmation dialog with score preservation warning
- Time-based round timer with countdown display
- Whistle/horn notification trigger when time expires
- Buffer time indicator between rounds
- Mixed doubles team display (Player A (M) / Player B (F))
- Event duration estimate based on player count and court availability
- Rounds remaining and time-to-completion display
- Podium display for top 3 with certificates/badges
- Results export options (PDF, CSV)

### Ladder & League UI
- Ladder standings table with position, player/team name, rating, record
- Challenge button on players within challenge range
- Incoming challenge notifications with accept/decline buttons
- Challenge deadline countdown timer
- Challenge history log
- Position change indicators (+2, -1, etc.)
- Inactivity warning badges on inactive players
- League session calendar view
- Session check-in interface
- Season progress indicator
- Flex league session selector (which days)
- Weekly standings comparison

### Recreational UI (Open Play / Drop-In)
- Paddle queue visualization:
  - Vertical list showing queue order
  - Player cards with name, skill level, wait time
  - "Next Up" highlight for players at front of queue
  - Drag-and-drop reordering for GMs
- Court status grid:
  - Available courts highlighted
  - In-progress games with player names
  - Time elapsed on each court
- "Join Queue" button for players
- Queue position indicator ("You are #5 in line")
- Estimated wait time display
- "Leave Queue" / "Check Out" button
- Walk-in player quick-add form for GMs
- Session attendance counter
- Court utilization stats

### Recreational UI (Clinics & Classes)
- Attendance checklist with player names
- Drill/activity timeline:
  - Current activity highlighted
  - Completed activities marked
  - Upcoming activities visible
- Court assignment display for drills
- Instruction panel (text, images, video links)
- Session notes input for instructor
- Timer for timed drills
- Progress indicator (Drill 3 of 8)
- "Mark Complete" button for each activity

### Recreational UI (Socials & Mixers)
- Event timeline/schedule display
- Attendance list with check-in status
- Announcement broadcast interface
- Optional game queue (if casual games enabled)
- Activity status indicator
- Photo/moment capture prompt

### Team Competition UI (MiLP-Style / Team Format)
- Match card showing all games:
  - Game 1: Men's Doubles - Team A vs Team B
  - Game 2: Women's Doubles - Team A vs Team B
  - Game 3: Mixed Doubles 1 - Team A vs Team B
  - Game 4: Mixed Doubles 2 - Team A vs Team B
  - Game 5: Dreambreaker (if needed)
- Team score aggregation display (Team A: 2, Team B: 2)
- Individual game status (upcoming, in progress, completed)
- Player lineup display for each game
- Substitution interface between games
- Dreambreaker trigger when teams tied after 4 games
- Dreambreaker format explanation
- Rally scoring indicator for Dreambreaker
- Team standings table with W-L-T, games won/lost
- Match result summary

### Specialty UI (King of the Court)
- Court grid with king designation:
  - Court 1 = King Court (highlighted, premium styling)
  - Courts 2-4 = Regular courts
- Current matchups on each court
- "Winners Move Up / Losers Move Down" movement indicator
- Partner split/stay rule indicator
- Session standings:
  - Total wins
  - Time spent on King Court
  - Current court position
- Round/rotation counter
- Session timer
- Movement animation when games complete

### Specialty UI (Gauntlet)
- Skill tier visualization:
  - Tier A (Advanced)
  - Tier B (Intermediate)
  - Tier C (Beginner)
- Player cards with current tier badge
- Match assignment display (dynamically generated)
- Tier movement indicators (↑ moving up, ↓ moving down)
- Round progression display
- Tier standings tables
- Match history with tier transitions

### Specialty UI (ABCD Play)
- Four-panel skill group display:
  - Panel A: A-level players and standings
  - Panel B: B-level players and standings
  - Panel C: C-level players and standings
  - Panel D: D-level players and standings
- Color-coded skill level badges (A=Gold, B=Silver, C=Bronze, D=Green)
- Round robin schedule within each group
- Group standings with rank, W-L, point differential
- Cross-group event progress overview
- Final placements by skill group

### Responsive Considerations
- Mobile-first queue management
- Swipeable court cards on mobile
- Collapsible standings tables
- Bottom sheet score entry on mobile
- Landscape-optimized bracket view
- TV/projector mode with large fonts and high contrast

## Configuration
- shell: true
