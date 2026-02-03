# Live Play Specification

## Overview
Live Play is the real-time game execution interface used during active events. Players see their match assignments and can check in at courts, while Game Managers control the flow—calling players to courts, entering scores, handling no-shows, and tracking overall event progress. For tournament formats, Live Play includes interactive bracket views, seeding management, and tournament-specific notifications. For Round Robin events, players see their complete schedule, current standings, and partner assignments, while Game Managers manage the full round robin lifecycle including schedule generation, score entry, tiebreaker resolution, and optional playoff bracket transitions. A full-screen Court Status Board provides a TV/projector-friendly display for venues.

## User Flows

### Player Flows

#### General Event Flows
- View live status of all courts (current games, scores, availability)
- See current match assignment (court, partner, opponents, format)
- See upcoming match with estimated start time
- Check in at assigned court ("I'm Here" button)
- Enter score for completed match (if GM permits)
- Confirm or dispute score entered by opponent
- View completed matches and running standings during event

#### Tournament-Specific Flows
- View tournament bracket with current position, opponents, and path to finals
- See seeding and first-round matchup when bracket is released
- Track bracket advancement and next opponent determination
- View losers bracket position (for double elimination)
- See estimated match times for upcoming rounds
- View pool standings and advancement status (for pool play)
- Challenge players above in ladder (for ladder tournaments)
- Share bracket via link or to social media
- View final results with podium display and champion's path

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

### Game Manager Flows

#### General Event Flows
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

#### Ladder Tournament Flows
- Create initial ladder from registrations
- Configure challenge range and deadlines
- Configure match scheduling (self-scheduled or system-scheduled)
- Handle inactivity drops
- Set ladder end conditions (fixed date, rolling, or season-based)

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

## UI Requirements

### General
- Court grid showing all courts with real-time status (Available, Calling, In Progress)
- Match cards displaying players, current score, and game status
- "You're Up Next" prominent alert for players
- Score entry interface (simple tap-to-increment for players, detailed entry for GMs)
- Court Status Board: full-screen display mode optimized for TV/projector
- Queue visualization for rotation formats (paddle stack, next 4 up)
- Event progress summary (matches completed, time elapsed, standings preview)
- Notification badges and alerts for match calls
- Pause overlay when event is paused (shows reason)

### Tournament UI
- Interactive bracket visualization with team names, scores, and real-time updates
- Dual bracket display for double elimination (winners and losers brackets)
- Pool standings tables with advancement indicators
- Ladder standings with challenge buttons and position indicators
- Seeding management interface with drag-and-drop
- Tournament schedule view (timeline format with court assignments)
- Bracket sharing options (public link, social media, image export)
- Podium display for tournament results (1st, 2nd, 3rd with visual treatment)
- Champion's path highlight in completed brackets
- Tournament-specific notifications (seeding released, bracket live, advancement, elimination)
- Multi-day tournament progress indicator ("Day 1 of 2")
- Match format indicator by round (Bo3, Bo5, etc.)
- Bye display and handling in bracket visualization

### Round Robin UI
- Round robin schedule view with round-by-round match list
- Current round highlighted, completed rounds grayed
- Standings table with real-time updates (Rank, Player/Team, W, L, Point Differential)
- Expandable head-to-head records in standings
- Tiebreaker explanation tooltips (USA Pickleball hierarchy: H2H → Overall PD → H2H PD → vs Next Highest → Coin Flip)
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

## Configuration
- shell: true
