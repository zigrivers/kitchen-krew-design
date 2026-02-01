# Players Specification

## Overview
The Players section handles user profiles, skill ratings, playing preferences, social connections (friends), and achievement badges. Players can view and edit their profile, set self-assessed skill ratings with optional DUPR integration, manage partner/opponent preferences for game matching, control privacy settings, and track their earned achievement badges.

## User Flows
- View and edit profile (name, photo, bio, playing style, preferred side)
- Set self-assessed skill rating (2.0-5.0 scale, singles/doubles)
- Set playing preferences (court side, style, availability, skill range for opponents)
- Manage partner/opponent lists (preferred partners, preferred opponents, avoid in matching)
- Control privacy settings (profile visibility, leaderboard opt-out, search visibility)
- Send, accept, or decline friend requests
- View and manage friends list
- View own achievements grid (earned/unearned badges with progress)
- View other players' profiles and achievements
- Complete profile onboarding wizard for new users

## UI Requirements
- Profile page with organized sections (info, preferences, achievements preview)
- Skill rating selector with level descriptions and source badge (self-assessed, DUPR, calculated)
- Playing preferences form with time/day picker
- Friends list with search, sort options, and quick actions
- Friend request notifications with accept/decline/block options
- Achievements grid showing all available badges with earned/progress states
- Badge detail modal with criteria, date earned, and rarity
- Profile completion indicator
- Privacy settings panel with visibility controls
- Player search/browse functionality
- "What others see" preview for privacy settings

## Configuration
- shell: true
