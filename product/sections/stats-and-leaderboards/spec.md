# Stats & Leaderboards Specification

## Overview
Stats & Leaderboards provides players with comprehensive performance tracking including win/loss records, partner/opponent statistics, rating trends, and match history. It also features multiple leaderboard types (event, club, format-specific) with configurable metrics and time periods.

## User Flows

### Player Flows
- View personal stats dashboard (wins, losses, win%, trends)
- View partner statistics and best partnerships
- View opponent statistics and head-to-head records
- View rating trend chart over time
- Browse and filter complete match history
- View current and longest winning/losing streaks
- View activity calendar showing games played
- View event leaderboard with my position highlighted
- View club leaderboard with customizable metrics
- Export match history (Excel, PDF, CSV)
- Generate and share stats card to social media

### Admin Flows
- Game Manager: View event analytics (attendance, match duration, court utilization)
- Club Admin: View club analytics (membership trends, engagement, popular events)

## UI Requirements
- Stats dashboard with summary cards showing key metrics
- Interactive rating trend chart with time range selection
- Partner/opponent tables sortable by games played or win %
- Match history list with date, format, result filters
- Calendar heat map for activity visualization
- Leaderboard tables with rank, name, stats columns
- My position highlighted and quick-scroll option
- Shareable stats card generator with template options
- Export dialog with format and date range selection

## Configuration
- shell: true
